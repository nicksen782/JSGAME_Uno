'use strict';

// Take care of vendor prefixes.
self.postMessage = self.postMessage || self.webkitPostMessage;

var debugActive = false;
const messageFuncs = {
    timings: {
        sendGfxUpdates: {
            "BG1" : {},
            "BG2" : {},
            "SP1" : {},
            "TX1" : {},
            "sendGfxUpdates" : 0,
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
        )

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

        // Save the timings.
        messageFuncs.timings["initConfigAndGraphics"]["tsDataSave"]              = tsDataSave.toFixed(3);
        messageFuncs.timings["initConfigAndGraphics"]["getAndParseGraphicsData"] = results.timings.getAndParseGraphicsData.toFixed(3);
        messageFuncs.timings["initConfigAndGraphics"]["createGraphicsAssets"]    = results.timings.createGraphicsAssets.toFixed(3);
        messageFuncs.timings["initConfigAndGraphics"]["createMinimalData"]       = createMinimalData.toFixed(3);

        // Return some minimal data.
        return minimalReturnData;
    },
    initLayers : function(messageData){
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
        if(messageFuncs.sendGfxUpdates.V4){
            messageFuncs.sendGfxUpdates.V4.init();
        }
        ts_initV4 = performance.now() - ts_initV4;
        
        // Save the timings.
        messageFuncs.timings["initLayers"]["tsLayerSave"] = tsLayerSave.toFixed(3);
        messageFuncs.timings["initLayers"]["ts_initV4"]   = ts_initV4.toFixed(3);
    },
    sendGfxUpdates:{}
};

// Import the graphics module.
importScripts("createGraphicsAssets.js");
importScripts("ww_sendGfxUpdatesV4.js");

const _GFX = {
    configObj: {},
    layers: {},
    currentData: {
        "BG1":{
            bgColorRgba: [0,0,0,0],
            bgColor32bit: 0,
            tilemaps   : {},
        },
        "BG2":{
            tilemaps   : {},
        },
        "SP1":{
            tilemaps   : {},
        },
        "TX1":{
            tilemaps   : {},
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
            // Only allow specific values for degrees.
            let allowedDegrees = [-90, 90, -180, 180, 270];
            if (allowedDegrees.indexOf(degrees) === -1) {
                console.error('Invalid degrees. Only use these:', allowedDegrees);
                return imageData;
            }
        
            // Break-out the imageData.
            const { width, height, data } = imageData;

            // Create new ImageData.
            const rotatedData = new Uint8ClampedArray(data.length);
        
            // Rotate the image and store it in the rotatedData array
            let targetX, targetY;
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const sourceIndex = (y * width + x) * 4;
        
                    if      (degrees === 90)                      { targetX = height - y - 1; targetY = x; } 
                    else if (degrees === -90 || degrees === 270)  { targetX = y;              targetY = width - x - 1; } 
                    else if (degrees === 180 || degrees === -180) { targetX = width - x - 1;  targetY = height - y - 1; }
        
                    const targetIndex = (targetY * width + targetX) * 4;
        
                    rotatedData.set( data.subarray(sourceIndex, sourceIndex + 4), targetIndex);
                }
            }
        
            // Update the imageData with the rotated data and dimensions
            // NOTE: The source ImageData will have the width and height swapped on 90 degree rotations.
            data.set(rotatedData);

            // Swap the width and the height if needed and return the dimensions.
            return {
                width : (degrees % 180 === 0) ? width : height,
                height: (degrees % 180 === 0) ? height : width
            }
        },

        // Replaces colors in ImageData. (By reference, changes source imageData.)
        replaceColors: function(imageData, colorReplacements) {
            for (let i = 0; i < imageData.data.length; i += 4) {
                const pixelColor = imageData.data.slice(i, i + 4);
    
                for (let j = 0; j < colorReplacements.length; j++) {
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
                createGraphicsAssets.applyFadeToImageData(imageData, fadeLevel);
            }
        },

        // UNUSED: Axis-Aligned Bounding Box. (Determine if two rectangles are intersecting.)
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
    
    },
};
const _DEBUG = {
    // TODO: Should this be done with a debug canvas layer on the main thread instead?
    // Draw 256 tiles displaying all colors in the color palette. (16 rows of 16 at twice the tile dimensions.) 
    // Expects a 256x256 pixel container.
    drawColorPalette: function(){
        let tiles = new Array(16*16);
        let tw = 8;
        let th = 8;
        let thisTile,r,g,b,a;
        let colors = new Array(16*16);

        // Create the tile ImageData.
        for(let i=0; i<256; i+=1){
            // Convert RGB332 to RGB32 values.
            r = ( ((i >> 0) & 0b00000111) * (255 / 7) ) << 0; // red
            g = ( ((i >> 3) & 0b00000111) * (255 / 7) ) << 0; // green
            b = ( ((i >> 6) & 0b00000011) * (255 / 3) ) << 0; // blue
            a = 255;

            // Create the new tile container. 
            thisTile = new Uint8ClampedArray( (4 * tw * th)*4);

            // Fill the tile container with the same color.
            let uint8Data = new Uint32Array(thisTile.buffer);
            let uint32Data = new Uint32Array(thisTile.buffer);
            let fillColor = (a << 24) | (b << 16) | (g << 8) | r; // 32-bit number.
            let len = uint32Data.length;
            for (let p = 0; p < len; ++p) { uint32Data[p] = fillColor; }
            
            // Add the new tile to the list.
            tiles[i] = new ImageData(thisTile, tw*2, th*2);

            // Add the color to the list.
            colors[i] = [r,g,b,a];
        }

        // Draw each tile to the top layer.
        let index = 0;
        for(let y=0; y<16; y+=1){
            for(let x=0; x<16; x+=1){
                // _GFX.layers["BG1"].ctx.putImageData(tiles[index], (x)*(tw*2), (y)*(th*2));
                // _GFX.layers["BG2"].ctx.putImageData(tiles[index], (x)*(tw*2), (y)*(th*2));
                // _GFX.layers["SP1"].ctx.putImageData(tiles[index], (x)*(tw*2), (y)*(th*2));
                _GFX.layers["TX1"].ctx.putImageData(tiles[index], (x)*(tw*2), (y)*(th*2));
                index+=1;
            }
        }

        // Output the colors as text.
        // let text = `COLORS:\n`;
        // console.log(text);
        // console.log("Colors:");
        // colors.forEach((d,i)=>{
        //     text += `  RGB332: ${i.toString().padStart(3, " ")} (0x${i.toString(16).toUpperCase().padStart(2, "0")}), RGB32: [${d.join(",")}]\n`;
        // });
        // console.log(text);
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
                messageFuncs.initLayers(data); 
                break; 
            }
            case "sendGfxUpdates"       : { 
                if(data.version == 4){
                    if(!flags.dataRequest){              messageFuncs.sendGfxUpdates.V4.run(data); }
                    else                  { returnData = messageFuncs.sendGfxUpdates.V4.run(data); }
                }
                break; 
            }
            
            // DEBUG REQUESTS.

            case "_DEBUG.drawColorPalette" : { 
                _DEBUG.drawColorPalette(); 
                break; 
            }
            
            // UNUSED??
            case "clearAllLayers"          : { 
                messageFuncs.sendGfxUpdates.clearAllLayers(); 
                break; 
            }
            
            case "_DEBUG.toggleDebugFlag"          : { 
                // console.log("_DEBUG.toggleDebugFlag:", data);
                // if(data.debugActive != debugActive){
                //     console.log(`Changing the debugActive from ${debugActive} to ${data.debugActive}`);
                // }
                // else{
                //     console.log(`NO CHANGE debugActive: ${debugActive}, data.debugActive: ${data.debugActive}`);
                // }
                debugActive = data.debugActive ?? false;
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
