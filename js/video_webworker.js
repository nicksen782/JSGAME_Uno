'use strict';

// Take care of vendor prefixes.
// self.postMessage = self.postMessage || self.webkitPostMessage;

var debugActive = false;
const messageFuncs = {
    timings: {
        gfx: {
            "L1" : {},
            "L2" : {},
            "L3" : {},
            "L4" : {},
            "gfx" : 0,
        },
        initConfigAndGraphics: {},
        initLayers: {},
        clearAllLayers: {},
    },
    initConfigAndGraphics : async function(messageData){
        // Save the configObj.
        let tsDataSave = performance.now();
        _GFX.configObj = messageData.configObj;
        tsDataSave = performance.now() - tsDataSave;

        // Convert the graphics assets.
        let results = await createGraphicsAssets.process( 
            _GFX.configObj.tilesetFiles, 
            _GFX.configObj.createFadeTilesets
        );

        // Create image tilemaps for each tilemap and store to the hashCacheMap.
        //

        // Save the converted tilesets.
        _GFX.tilesets = results.finishedTilesets;

        // Send back some data about the graphics assets. 
        let createMinimalData = performance.now();
        let minimalReturnData = {};
        for(let tsKey in _GFX.tilesets){
            minimalReturnData[tsKey] = {
                config: _GFX.tilesets[tsKey].config,
                tilesetName: _GFX.tilesets[tsKey].tilesetName,
                tilemaps: {},
                tileCount: _GFX.tilesets[tsKey].tileset.length,
            };
            if(_GFX.configObj.clientLocalTileset){
                minimalReturnData[tsKey].tileset = _GFX.tilesets[tsKey].tileset.map(d=>{
                    return { 
                        imgData: d.imgData,
                        fadeTiles: d.fadeTiles.map( dd => { return { imgData: dd.imgData }; } ),
                    }
                });
            }
            for(let mapKey in _GFX.tilesets[tsKey].tilemaps){
                minimalReturnData[tsKey].tilemaps[mapKey] = _GFX.tilesets[tsKey].tilemaps[mapKey];
            }
        }
        createMinimalData = performance.now() - createMinimalData;

        // Save the debugActive flag (global variable.)
        debugActive = messageData.debugActive ?? false;

        // Save the default settings.
        _GFX.defaultSettings = messageData.defaultSettings;

        // Save the timings.
        messageFuncs.timings["initConfigAndGraphics"]["tsDataSave"]              = tsDataSave.toFixed(3);
        messageFuncs.timings["initConfigAndGraphics"]["getAndParseGraphicsData"] = results.timings.getAndParseGraphicsData.toFixed(3);
        messageFuncs.timings["initConfigAndGraphics"]["createGraphicsAssets"]    = results.timings.createGraphicsAssets.toFixed(3);
        messageFuncs.timings["initConfigAndGraphics"]["createMinimalData"]       = createMinimalData.toFixed(3);

        // Return some minimal data.
        return minimalReturnData;
    },
    initLayers : async function(messageData){
        // Save the layers data. Configure the ctx value for each layer.
        let tsLayerSave = performance.now();

        for(let layer of messageData.layers){ 
            // Get the canvas.
            let canvas = layer.canvas;
            
            // Create the drawing context.
            layer.ctx = canvas.getContext("2d", layer.canvasOptions || {});
            
            // Clear the layer.
            layer.ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Create the imgDataCache
            layer.imgDataCache = new ImageData(canvas.width, canvas.height);
            
            // Clear the imgDataCache
            layer.imgDataCache.data.set(0);
            
            // Save the layer.
            _GFX.layers[layer.name] = layer;
        }
        tsLayerSave = performance.now() - tsLayerSave;

        // Init V4
        let ts_initV4 = performance.now();
        if(messageFuncs.gfx){
            await messageFuncs.gfx.init();
        }
        ts_initV4 = performance.now() - ts_initV4;
        
        // Save the timings.
        messageFuncs.timings["initLayers"]["tsLayerSave"] = tsLayerSave.toFixed(3);
        messageFuncs.timings["initLayers"]["ts_initV4"]   = ts_initV4.toFixed(3);
    },

    // Populated by: ww_sendGfxUpdatesV4.js
    gfx:{}
};

// Import the graphics module.
importScripts("createGraphicsAssets.js");
importScripts("ww_sendGfxUpdatesV4.js");

const timeItData = {};
function timeIt(key, func){
    // timeIt("KEY_NAME", "start");
    // timeIt("KEY_NAME", "stop");
    // timeIt("KEY_NAME", "get");
    // timeIt("KEY_NAME", "reset");
    // timeIt("", "getAll");

    if     (func == "start"){
        if(!timeItData[key]){ 
            timeItData[key] = { t:0, s:0, e:0 }; 
        }
        timeItData[key].s = performance.now();
        timeItData[key].e = performance.now();
        timeItData[key].t = performance.now();
        return timeItData[key].t;
    }
    else if(func == "stop"){
        timeItData[key].t = performance.now() - timeItData[key].s;
        timeItData[key].s = 0;
        timeItData[key].e = 0;
        return timeItData[key].t;
    }
    else if(func == "get"){
        return timeItData[key].t;
    }
    else if(func == "getAll"){
        let data = {};
        for(let key in timeItData){
            data[key] = timeItData[key].t;
        }
        return data;
    }
    else if(func == "reset"){
        if(!timeItData[key]){ timeItData[key] = { t:0, s:0, e:0 };  }
        timeItData[key].t = 0;
        timeItData[key].s = 0;
        timeItData[key].e = 0;
        return timeItData[key].t;
    }
};
const _GFX = {
    // The configObj from the application.
    configObj: {},

    // Contains the canvas and ctx for each layer. Holds the imgDataCache which is used to update the canvas.
    layers: {},
    defaultSettings: {},
    currentData: {
        "L1":{
            bgColorRgba: [0,0,0,0],
            bgColor32bit: 0, // Used as a check to avoid repeatly changing to the same color.
            tilemaps : {},
            fade     : {},
        },
        "L2":{
            tilemaps : {},
            fade     : {},
        },
        "L3":{
            tilemaps : {},
            fade     : {},
        },
        "L4":{
            tilemaps : {},
            fade     : {},
        },
    },
    utilities: {
        // Flips ImageData horizontally. (By reference, changes source imageData.)
        flipImageDataHorizontally: function(imageData) {
            const width = imageData.width;
            const height = imageData.height;

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < Math.floor(width / 2); x++) {
                    // Calculate the index of the source pixel
                    const srcIndex = (y * width + x) * 4;

                    // Calculate the index of the destination pixel (flipped horizontally)
                    const destIndex = (y * width + (width - 1 - x)) * 4;

                    // Swap the pixel data
                    for (let i = 0; i < 4; i++) {
                        const temp = imageData.data[srcIndex + i];
                        imageData.data[srcIndex + i] = imageData.data[destIndex + i];
                        imageData.data[destIndex + i] = temp;
                    }
                }
            }
        },

        // Flips ImageData vertically. (By reference, changes source imageData.)
        flipImageDataVertically: function(imageData) {
            const width = imageData.width;
            const height = imageData.height;
            const data = imageData.data;
        
            // Iterate through half the image height to avoid flipping twice.
            for (let y = 0; y < Math.floor(height / 2); y++) {
                for (let x = 0; x < width; x++) {
                    // Calculate the index of the source pixel
                    const srcIndex = (y * width + x) * 4;
        
                    // Calculate the index of the destination pixel (flipped vertically)
                    const destIndex = ((height - 1 - y) * width + x) * 4;
        
                    // Swap the pixel data
                    for (let i = 0; i < 4; i++) {
                        const temp = data[srcIndex + i];
                        data[srcIndex + i] = data[destIndex + i];
                        data[destIndex + i] = temp;
                    }
                }
            }
        },
        
        // Rotates ImageData by the specified degrees. (Changes source imageData. Uses temporary copy.)
        rotateImageData: function(imageData, degrees) {
            // if(degrees == 0){
            //     return {
            //         width: imageData.width,
            //         height: imageData.height
            //     }
            // }

            // Only allow specific values for degrees.
            let allowedDegrees = [-90, 90, -180, 180, 270];
            if (allowedDegrees.indexOf(degrees) === -1) {
                console.error('Invalid degrees. Only use these:', allowedDegrees);
                return imageData;
            }
        
            // Break-out the imageData.
            const { width, height, data } = imageData;
        
            // Create new ImageData.
            const rotatedData = new Uint8Array(data.length);
        
            // Rotate the image and store it in the rotatedData array
            let targetX, targetY;
            let newWidth, newHeight;
            if (degrees % 180 === 0) {
                newWidth = width;
                newHeight = height;
            } else {
                newWidth = height;
                newHeight = width;
            }
        
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const sourceIndex = (y * width + x) * 4;
        
                    if (degrees === 90) {
                        targetX = height - y - 1; targetY = x;
                    } 
                    else if (degrees === -90 || degrees === 270) {
                        targetX = y; targetY = width - x - 1;
                    } 
                    else if (degrees === 180 || degrees === -180) {
                        targetX = width - x - 1; targetY = height - y - 1;
                    }
        
                    const targetIndex = (targetY * newWidth + targetX) * 4;
        
                    rotatedData.set(data.subarray(sourceIndex, sourceIndex + 4), targetIndex);
                }
            }
        
            // Update the imageData with the rotated data and dimensions
            // NOTE: The source ImageData will have the width and height swapped on 90 degree rotations.
            data.set(rotatedData);
        
            // Swap the width and the height if needed and return the dimensions.
            return {
                width: newWidth,
                height: newHeight
            }
        },
        
        // Replaces colors in ImageData. (By reference, changes source imageData.)
        replaceColors: function(imageData, colorReplacements) {
            if(!colorReplacements || !colorReplacements.length){ 
                console.log("replaceColors: level 1: No colors specified:", colorReplacements); 
                return; 
            }
            for (let i = 0; i < imageData.data.length; i += 4) {
                const pixelColor = imageData.data.slice(i, i + 4);
    
                for (let j = 0; j < colorReplacements.length; j++) {
                    if(!colorReplacements[j] || !colorReplacements[j].length){ 
                        // console.log("replaceColors: level 2: No colors specified:", j, colorReplacements[j], colorReplacements); 
                        continue; 
                    }
                    
                    const [sourceColor, targetColor] = colorReplacements[j];
    
                    // Compare colors.
                    if(pixelColor[0] === sourceColor[0] &&
                        pixelColor[1] === sourceColor[1] &&
                        pixelColor[2] === sourceColor[2] &&
                        pixelColor[3] === sourceColor[3]
                    ){
                        imageData.data.set(targetColor, i);
                        break;
                    }
                }
            }
        },

        // Takes ImageData, copies it, and applies color changes THEN fades the tile.
        fadeImageData: function(imageData, fadeLevel, colorData){
            // If the currFade is 10 then set tile to a new transparent tile.
            if(fadeLevel == 10){ 
                // Set the image data to fully transparent. 
                imageData.data.set(0);
            }
            else{
                // Apply color replacements (RGBA).
                if(colorData && colorData.length){ 
                    _GFX.utilities.replaceColors(imageData, colorData); 
                }

                // Fade the tile (RGBA version of the fade table.)
                createGraphicsAssets.applyFadeToImageDataArray(imageData.data, fadeLevel);
            }
        },

        // Axis-Aligned Bounding Box. (Determine if two rectangles are intersecting.)
        aabb_collisionDetection: function(rect1, rect2){
            // EXAMPLE USAGE:
            // aabb_collisionDetection({x:0,y:0,w:16,h:16}, {x:8,y:8,w:16,h:16});
    
            let collision = false;
            let overlapX, overlapY, overlapWidth, overlapHeight;
    
            // Check for overlap.
            if (
                rect1.x < rect2.x + rect2.w &&
                rect1.x + rect1.w > rect2.x &&
                rect1.y < rect2.y + rect2.h &&
                rect1.h + rect1.y > rect2.y
            ){ 
                collision = true;
    
                // Calculate the region that is overlapped.
                overlapX      = Math.max(rect1.x, rect2.x);
                overlapY      = Math.max(rect1.y, rect2.y);
                overlapWidth  = Math.min(rect1.x + rect1.w, rect2.x + rect2.w) - overlapX;
                overlapHeight = Math.min(rect1.y + rect1.h, rect2.y + rect2.h) - overlapY;
            }
            
            // Return the collision flag and the overlap region if applicable. 
            return {
                collision: collision,
                x: overlapX,
                y: overlapY,
                w: overlapWidth,
                h: overlapHeight
            };
        },

        // Checks if arrays are equal. (recursion)
        areArraysEqual: function(array1, array2) {
            // Check if the arrays are the same length. If they are then there is nothing more that needs to be checked.
            if (array1.length !== array2.length) { return false; }
        
            // Check if all items exist and are in the same order
            for (let i = 0; i < array1.length; i++) {
                // Handle arrays using recursion.
                if (
                    Array.isArray(array1[i]) && 
                    Array.isArray(array2[i])
                ) {
                    if (!this.areArraysEqual(array1[i], array2[i])) {
                        return false;
                    }
                } 
                // Handle normal properties. Are these properties that same value?
                else if (array1[i] !== array2[i]) {
                    return false;
                }
            }
        
            // If we have not returned false by this point then the arrays are equal.
            return true;
        },
        
        // Checks that settings objects are equal.
        areSettingsObjectsEqual: function(compareObj1, compareObj2=_GFX.defaultSettings) {
            // These are the keys that are required.
            let settingsKeys = Object.keys(_GFX.defaultSettings);
            
            // Check that obj1 and obj2 have all keys of settingsKeys.
            for (let key in settingsKeys) {
                if(!key in compareObj1){ 
                    throw `areSettingsObjectsEqual: missing key in compareObj1: ${key}`; 
                }
                if(!key in compareObj2){ 
                    throw `areSettingsObjectsEqual: missing key in compareObj2: ${key}`; 
                }
            }

            for (let key in compareObj1) {
                if (compareObj1.hasOwnProperty(key)) {
                    if (
                        Array.isArray(compareObj1[key]) && 
                        Array.isArray(compareObj2[key])
                    ) {
                        if (!this.areArraysEqual(compareObj1[key], compareObj2[key])) {
                            return false;
                        }
                    } 
                    else if (compareObj1[key] !== compareObj2[key]) {
                        return false;
                    }
                }
            }
            return true;
        },
    },
};

self.onmessage = async function(event) {
    // Accept only version 2 methods.
    if(event.data.version != 2){ 
        console.log("Mismatched version. Must be version 2.");
        self.postMessage( {mode: event.data, data: ""}, [] );
    }
    else{
        if(!event.data.mode){ console.log("No mode was specified."); self.postMessage( {mode: event.data, data: ""}, [] ); }
        if(!event.data.data){ console.log("No data was specified."); self.postMessage( {mode: event.data, data: ""}, [] ); }
        let mode  = event.data.mode;
        let data  = event.data.data;
        let flags = event.data.flags;
        let refs  = [];
        let returnData = "";

        // DEBUG:
        // console.log(`mode: ${mode}`, ", data:", data, ", flags:", flags);
        // console.log(`mode: ${mode}`, ", flags:", flags);

        switch(mode){
            // NORMAL REQUESTS.
            case "initConfigAndGraphics": { 
                if(!flags.dataRequest){              await messageFuncs.initConfigAndGraphics(data); }
                else                  { returnData = await messageFuncs.initConfigAndGraphics(data); }
                break;
            }
            case "initLayers"           : { 
                await messageFuncs.initLayers(data); 
                break; 
            }
            case "generateCoreImageDataAssets"           : { 
                if(!flags.dataRequest){              await messageFuncs.gfx.DRAW.generateCoreImageDataAssets(data.list); }
                else                  { returnData = await messageFuncs.gfx.DRAW.generateCoreImageDataAssets(data.list); }
                break; 
            }
            case "sendGfxUpdates"       : { 
                if(data.version == 4){
                    if(!flags.dataRequest){              messageFuncs.gfx.run(data); }
                    else                  { returnData = messageFuncs.gfx.run(data); }
                }
                break; 
            }
            
            // DEBUG REQUESTS.

            case "requestHashCacheEntry" : { 
                console.log("HASH CACHE ENTRY:", data.title);
                console.log("  HASH:", messageFuncs.gfx.DRAW.hashCacheMap.get(data.hash) );
                console.log("  BASE:", messageFuncs.gfx.DRAW.hashCacheMap.get(data.hashBase) );
                console.log(`  HASH ACCESS: messageFuncs.gfx.DRAW.hashCacheMap.get(${data.hash})`);
                console.log(`  BASE ACCESS: messageFuncs.gfx.DRAW.hashCacheMap.get(${data.hashBase})`);
                break; 
            }
            
            // UNUSED??
            case "clearAllLayers"          : { 
                messageFuncs.gfx.clearAllLayers(); 
                break; 
            }
            
            case "_DEBUG.toggleDebugFlag"          : { 
                debugActive = data.debugActive ?? false;
                break; 
            }

            case "_DEBUG.toggleCacheFlag"          : { 
                _GFX.configObj.disableCache = data.disableCache ?? false;
                break; 
            }

            // UNKNOWN REQUESTS.
            default: {
                console.log("WEBWORKER: Unknown mode:", mode);
                break; 
            }
        }

        // Send a response.
        self.postMessage( 
            { 
                mode: event.data.mode, 
                data: returnData, 
                flags: flags 
            }, refs 
        );
    }
};
