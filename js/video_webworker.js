'use strict';

// Take care of vendor prefixes.
self.postMessage = self.postMessage || self.webkitPostMessage;

// Import the graphics module.
importScripts("createGraphicsAssets.js");

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
        // Converts a tilemap to new ImageData (respects the settings provided.)
        tilemapToImageData: function(tilesetName, tilemap, settings, fade=null){
            // Get the tileset and the dimensions for the tileset. 
            let tileset = _GFX.tilesets[tilesetName].tileset;
            let tw = _GFX.tilesets[tilesetName].config.tileWidth;
            let th = _GFX.tilesets[tilesetName].config.tileHeight;

            // Get the dimensions of the tilemap.
            let mapW = tilemap[0];
            let mapH = tilemap[1];
            
            // Start at index 2 since the first two indexs are the map dimensions in tiles. 
            let index=2;
            let missingTile = false;
            
            // Create new ImageData. (The final copy and the reusable tile copy.)
            let imageData = new ImageData(mapW * tw, mapH * th); // The width and height come from the tilemap and should be correct.
            let imageDataTile = new ImageData(tw, th);

            // Break-out settings.
            let rotation  = settings.rotation;
            let xFlip     = settings.xFlip;
            let yFlip     = settings.yFlip;
            let colorData = settings.colorData;
            let fadeLevel = null;
            
            if( (fade && fade.fade && fade.currFade != null) ){ fadeLevel = fade.currFade; }
            else if( settings.fade != null){ fadeLevel = settings.fade; }

            if( fadeLevel != 10 ){
                // Draw the tilemap.
                for(let y=0; y<mapH; y+=1){
                    for(let x=0; x<mapW; x+=1){
                        // Copy the tile data to the imageDataTile. 
                        try{ imageDataTile.data.set(tileset[ tilemap[index] ].imgData.data.slice()); missingTile = false; }
                        
                        // Missing tile. (Wrong tileset?) 
                        // Create a transparent tile and set the missingTile flag to skip any transforms from settings.
                        catch(e){ imageDataTile.data.fill(0); missingTile = true; }
    
                        // Rotate tile?
                        if(!missingTile && rotation) { 
                            _GFX.utilities.rotateImageData(imageDataTile, rotation); 
                        }
    
                        // Flip tile horizontally?
                        if(!missingTile && xFlip)    { _GFX.utilities.flipImageDataHorizontally(imageDataTile); }
    
                        // Flip tile vertically?
                        if(!missingTile && yFlip)    { _GFX.utilities.flipImageDataVertically(imageDataTile); }
    
                        // Update the imageData with this tile.
                        createGraphicsAssets.updateRegion(
                            imageDataTile.data,  // source
                            imageDataTile.width, // srcWidth
                            imageData.data,      // destination
                            imageData.width,     // destWidth
                            x * tw,              // x
                            y * th,              // y
                            tw,                  // w
                            th,                  // h
                            false                // onlyWriteToTransparent
                        );
    
                        // Increment the tile index in the tilemap.
                        index++;
                    }
                }

                // Apply color replacements and/or fading to the imageData.
    
                // Fade? (Replaces the colors THEN fades the result.
                if(fadeLevel != null){
                    _GFX.utilities.fadeImageData(imageData, fadeLevel, colorData);
                }

                // Just color replacements?
                else if(colorData && colorData.length){
                    _GFX.utilities.replaceColors(imageData, colorData); 
                }
            }

            // Fade level is 10. Set full black;
            else{
                // R,G,B is already 0. Need to set alpha.
                for (let i = 3; i < imageData.data.length; i += 4) { imageData.data[i] = 255; }
            }

            // Return the completed data.
            return imageData;
        },

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
                createGraphicsAssets.rgba32TileToFadedRgba32Tile(imageData, fadeLevel);
            }
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
    initConfigAndGraphics: async function(messageData){
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

        // Save the timings.
        messageFuncs.timings["initConfigAndGraphics"]["tsDataSave"]              = tsDataSave.toFixed(3);
        messageFuncs.timings["initConfigAndGraphics"]["getAndParseGraphicsData"] = results.timings.getAndParseGraphicsData.toFixed(3);
        messageFuncs.timings["initConfigAndGraphics"]["createGraphicsAssets"]    = results.timings.createGraphicsAssets.toFixed(3);
        messageFuncs.timings["initConfigAndGraphics"]["createMinimalData"]       = createMinimalData.toFixed(3);

        // Return some minimal data.
        return minimalReturnData;
    },
    initLayers: function(messageData){
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

        // Save the timings.
        messageFuncs.timings["initLayers"]["tsLayerSave"] = tsLayerSave.toFixed(3);
    },
    sendGfxUpdates: {
        flickerFlag : false,

        // ****************
        // Helper functions
        // ****************

        // Compares local cache against the newtilemaps and determines removals and changes.
        determineChanges: function(layer, newTilemaps){
            let currentKeys = Object.keys(_GFX.currentData[layer].tilemaps) ;
            let newKeys     = Object.keys(newTilemaps);
            let removedKeys = this.determineTilemapRemovals( currentKeys, newKeys );
            // let addedKeys   = this.determineTilemapRemovals( newKeys, currentKeys );
            let changedKeys = currentKeys.map(key=>{
                // Get the hashes to compare.
                let hash1 = _GFX.currentData[layer].tilemaps[key] ? _GFX.currentData[layer].tilemaps[key].hash : "";
                let hash2 = newTilemaps[key] ? newTilemaps[key].hash : "";
                
                // If hash2 is missing then that tilemap should already be flagged for removal.
                if(hash2 === ""){ return false; }
                
                // If the hashes do not match then this is a changed key. Return the key.
                if(hash1 != hash2){ return key; }
            }).filter(d=>d);

            return {
                // currentKeys: currentKeys,
                // newKeys    : newKeys,
                // addedKeys  : addedKeys,
                removedKeys: removedKeys,
                changedKeys: changedKeys,
            };
        },
        // Compares two arrays to determine what is in the second array that is not in the first.
        determineTilemapRemovals: function(newTilemaps, existingTilemaps){
            // Compares existing tilemaps against the new tilemaps. 
            // The result will contain an array of removed tilemaps.
            let setA = new Set(existingTilemaps);
            let removedTilemaps = newTilemaps.filter(item => !setA.has(item));
            return removedTilemaps;
        },
        // Deletes cache data and/or undraws the tilemaps.
        clearRemovedTilemaps: function(layer, removedKeys, deleteKey=false, undraw=false){
            // If deleteKey and undraw are both false then do not continue.
            if(deleteKey == false &&  undraw == false){ return; }

            // Get the tileset and the dimensions for the tileset. 
            let cachedData;
            let tmpImageData;
            let x,y,w,h;
            
            for(let i=0; i<removedKeys.length; i+=1){
                if(undraw){
                    // Get the tileset and the dimensions for the tileset. 
                    cachedData = _GFX.currentData[layer].tilemaps[removedKeys[i]];
                    x = cachedData.x;
                    y = cachedData.y;
                    w = cachedData.w;
                    h = cachedData.h;

                    tmpImageData = new ImageData(w,h);

                    // Update the imageData with this tile.
                    createGraphicsAssets.updateRegion(
                        tmpImageData.data,                     // source
                        tmpImageData.width,                    // srcWidth
                        _GFX.layers[layer].imgDataCache.data,  // destination
                        _GFX.layers[layer].imgDataCache.width, // destWidth
                        x, // x
                        y, // y
                        w, // w
                        h, // h
                        false // onlyWriteToTransparent
                    );
                }

                if(deleteKey){
                    delete _GFX.currentData[layer].tilemaps[removedKeys[i]];
                }
            }

        },
        // Clears all output layers and removes all tilemap object cache data.
        clearAllLayers: function(){
            // Clear each output layer.
            let tsAllLayerClear = performance.now();
            for(let layer in _GFX.layers){
                // Get the layer.
                let rec = _GFX.layers[layer];

                // Clear the output canvas.
                rec.ctx.clearRect(0, 0, rec.canvas.width, rec.canvas.height);
                
                // Clear the imgDataCache.
                this.clearLayer(layer);
            }
            tsAllLayerClear = performance.now() - tsAllLayerClear;
    
            // Clear the data for each currentData.
            let tsAllObjectClear = performance.now();
            for(let layerKey in _GFX.currentData){ 
                _GFX.currentData[layerKey].tilemaps = {};
            }
            tsAllObjectClear = performance.now() - tsAllObjectClear;
    
            // Save the timings.
            messageFuncs.timings["clearAllLayers"]["AllLayerClear"]  = tsAllLayerClear.toFixed(3);
            messageFuncs.timings["clearAllLayers"]["AllObjectClear"] = tsAllObjectClear.toFixed(3);
        },
        // Fills the imgDataCache for a layer with 0 (fully transparent.)
        clearLayer : function(layer){
            _GFX.layers[layer].imgDataCache.data.fill(0);
        },
        // Converts a tilemap to ImageData and draws to the imgDataCache. Can also recolor and save tilemap rect and hash data.
        drawTilemapsToImgDataLayer : function(layer, tilemaps, save=false, fade=null){
            // This prevents a sprite from always being on top of other sprites. 
            // By reversing the draw order each is on top 50% of the time.
            let mapKeys = Object.keys(tilemaps);
            if(this.flickerFlag){ mapKeys.reverse(); }

            let imgData, mapKey, tmap;
            let r, g, b, a, uint32Data, fillColor;
            for(let i=0; i<mapKeys.length; i+=1){
                mapKey = mapKeys[i];
                tmap = tilemaps[mapKey];
                imgData = _GFX.utilities.tilemapToImageData(tmap.ts, tmap.tmap, tmap.settings, fade);

                if(tmap.settings.bgColorRgba){
                    [r, g, b, a] = tmap.settings.bgColorRgba;
                    uint32Data = new Uint32Array(obj.imgData.data.buffer);
                    fillColor = (a << 24) | (b << 16) | (g << 8) | r;
                    for (let p = 0, len = uint32Data.length; p < len; ++p) {
                        if (uint32Data[p] === 0) { uint32Data[p] = fillColor; }
                    }
                }

                // Use onlyWriteToTransparent.
                createGraphicsAssets.updateRegion(
                    imgData.data,                          // source
                    imgData.width,                         // srcWidth
                    _GFX.layers[layer].imgDataCache.data,  // destination
                    _GFX.layers[layer].imgDataCache.width, // destWidth
                    tmap.x,                                // x
                    tmap.y,                                // y
                    imgData.width,                         // w
                    imgData.height,                        // h
                    true                                   // onlyWriteToTransparent
                );

                if(save){
                    _GFX.currentData[layer].tilemaps[mapKey] = {
                        x: tmap.x,
                        y: tmap.y,
                        w: imgData.width,
                        h: imgData.height,
                        hash: tmap.hash,
                    };
                }
            }
        },
        // Fills imgDataCache with a specified rgba color.
        setBackgroundcolor : function(layer, bgColorRgba){
            let [r, g, b, a] = bgColorRgba;
            let uint32Data = new Uint32Array(_GFX.layers[layer].imgDataCache.data.buffer);
            let fillColor = (a << 24) | (b << 16) | (g << 8) | r;
            let len = uint32Data.length;
            for (let p = 0; p < len; ++p) {
                if (uint32Data[p] === 0) { uint32Data[p] = fillColor; }
            }
        },
        // Draws the imgDataCache to the output layer.
        drawTilemapsLayer : function(layer){
            _GFX.layers[layer].ctx.putImageData(_GFX.layers[layer].imgDataCache, 0, 0);
        },

        // **************
        // Layer updaters
        // **************

        // Updates the BG1 layer. (Any update to this layer causes a complete redraw.)
        updateBG1 : function(data){
            let ts_TOTAL = performance.now();

            let layer = "BG1";
            
            // Clear the Image Data (transparent).
            let ts_clearLayer = performance.now();
            this.clearLayer(layer);
            ts_clearLayer = performance.now() - ts_clearLayer;
            
            // Draw the tilemaps to the Image Data.
            let ts_drawTilemapsToImgDataLayer = performance.now();
            this.drawTilemapsToImgDataLayer(layer, data.tilemaps, false, data.fade);
            ts_drawTilemapsToImgDataLayer = performance.now() - ts_drawTilemapsToImgDataLayer;
            
            // Set the transparent pixels to the background color.
            let ts_setBackgroundcolor = performance.now();
            if(data.bgColorRgba){
                this.setBackgroundcolor(layer, data.bgColorRgba);

                if( (data.fade && data.fade.fade && data.fade.currFade != null) ){ 
                    let fadeLevel = data.fade.currFade;
                    let imgDataCache = _GFX.layers[layer].imgDataCache;
                    let imgDataCacheLength = imgDataCache.data.length;
                    
                    if(fadeLevel != 10){
                        _GFX.utilities.fadeImageData(imgDataCache, fadeLevel, []);
                    }
                    else{
                        imgDataCache.data.fill(0);
                        // R,G,B is already 0. Need to set alpha.
                        for (let i = 3; i < imgDataCacheLength; i += 4) { imgDataCache.data[i] = 255; }
                    }
                }
            }
            ts_setBackgroundcolor = performance.now() - ts_setBackgroundcolor;
            
            // Draw the entire Image Data. 
            let ts_drawTilemapsLayer = performance.now();
            this.drawTilemapsLayer(layer);
            ts_drawTilemapsLayer = performance.now() - ts_drawTilemapsLayer;
            
            ts_TOTAL = performance.now() - ts_TOTAL;

            // Save the timings.
            messageFuncs.timings["sendGfxUpdates"][layer]["A_TOTAL"]                      = ts_TOTAL.toFixed(3);
            messageFuncs.timings["sendGfxUpdates"][layer]["B_clearLayer"]                 = ts_clearLayer.toFixed(3);
            messageFuncs.timings["sendGfxUpdates"][layer]["C_drawTilemapsToImgDataLayer"] = ts_drawTilemapsToImgDataLayer.toFixed(3);
            messageFuncs.timings["sendGfxUpdates"][layer]["D_setBackgroundcolor"]         = ts_setBackgroundcolor.toFixed(3);
            messageFuncs.timings["sendGfxUpdates"][layer]["E_drawTilemapsLayer"]          = ts_drawTilemapsLayer.toFixed(3);
        },
        // Updates the BG2 layer.
        updateBG2 : function(data){
            let ts_TOTAL = performance.now();
            
            let layer = "BG2";
            
            let ts_determineChanges = performance.now();
            let changes = this.determineChanges(layer, data.tilemaps);
            ts_determineChanges = performance.now() - ts_determineChanges;
            
            let ts_clearRemovedTilemaps = performance.now();
            this.clearRemovedTilemaps(layer, changes.removedKeys, true, true); // delete cache, undraw.
            this.clearRemovedTilemaps(layer, changes.changedKeys, true, true); // delete cache, undraw.
            ts_clearRemovedTilemaps = performance.now() - ts_clearRemovedTilemaps;
            
            // Draw the tilemaps to the Image Data.
            let ts_drawTilemapsToImgDataLayer = performance.now();
            this.drawTilemapsToImgDataLayer(layer, data.tilemaps, true, data.fade);
            ts_drawTilemapsToImgDataLayer = performance.now() - ts_drawTilemapsToImgDataLayer;

            // Draw the entire Image Data. 
            let ts_drawTilemapsLayer = performance.now();
            this.drawTilemapsLayer(layer);
            ts_drawTilemapsLayer = performance.now() - ts_drawTilemapsLayer;

            ts_TOTAL = performance.now() - ts_TOTAL;

            // Save the timings.
            messageFuncs.timings["sendGfxUpdates"][layer]["A_TOTAL"]                      = ts_TOTAL.toFixed(3);
            messageFuncs.timings["sendGfxUpdates"][layer]["B_ts_determineChanges"]        = ts_determineChanges.toFixed(3);
            messageFuncs.timings["sendGfxUpdates"][layer]["C_ts_clearRemovedTilemaps"]    = ts_clearRemovedTilemaps.toFixed(3);
            messageFuncs.timings["sendGfxUpdates"][layer]["D_drawTilemapsToImgDataLayer"] = ts_drawTilemapsToImgDataLayer.toFixed(3);
            messageFuncs.timings["sendGfxUpdates"][layer]["E_drawTilemapsLayer"]          = ts_drawTilemapsLayer.toFixed(3);
        },
        // Updates the SP1 layer.
        updateSP1 : function(data){
            let ts_TOTAL = performance.now();

            let layer = "SP1";
            
            // Clear the Image Data (transparent).
            let ts_clearLayer = performance.now();
            this.clearLayer(layer);
            ts_clearLayer = performance.now() - ts_clearLayer;
    
            let ts_determineChanges = performance.now();
            let changes = this.determineChanges(layer, data.tilemaps);
            ts_determineChanges = performance.now() - ts_determineChanges;
            
            let ts_clearRemovedTilemaps = performance.now();
            this.clearRemovedTilemaps(layer, changes.removedKeys, true, false); // delete cache, do not undraw.
            this.clearRemovedTilemaps(layer, changes.changedKeys, true, false); // delete cache, do not undraw.
            ts_clearRemovedTilemaps = performance.now() - ts_clearRemovedTilemaps;

            // Draw the tilemaps to the Image Data.
            let ts_drawTilemapsToImgDataLayer = performance.now();
            this.drawTilemapsToImgDataLayer(layer, data.tilemaps, true, data.fade);
            ts_drawTilemapsToImgDataLayer = performance.now() - ts_drawTilemapsToImgDataLayer;
    
            // Draw the entire Image Data. 
            let ts_drawTilemapsLayer = performance.now();
            this.drawTilemapsLayer(layer);
            ts_drawTilemapsLayer = performance.now() - ts_drawTilemapsLayer;
            
            ts_TOTAL = performance.now() - ts_TOTAL;

            // Save the timings.
            messageFuncs.timings["sendGfxUpdates"][layer]["A_TOTAL"]                      = ts_TOTAL.toFixed(3);
            messageFuncs.timings["sendGfxUpdates"][layer]["B_clearLayer"]                 = ts_clearLayer.toFixed(3);
            messageFuncs.timings["sendGfxUpdates"][layer]["C_ts_determineChanges"]        = ts_determineChanges.toFixed(3);
            messageFuncs.timings["sendGfxUpdates"][layer]["C_ts_clearRemovedTilemaps"]    = ts_clearRemovedTilemaps.toFixed(3);
            messageFuncs.timings["sendGfxUpdates"][layer]["D_drawTilemapsToImgDataLayer"] = ts_drawTilemapsToImgDataLayer.toFixed(3);
            messageFuncs.timings["sendGfxUpdates"][layer]["E_drawTilemapsLayer"]          = ts_drawTilemapsLayer.toFixed(3);
        },
        // Updates the TX1 layer.
        updateTX1 : function(data){
            let ts_TOTAL = performance.now();

            let layer = "TX1";
    
            let ts_determineChanges = performance.now();
            let changes = this.determineChanges(layer, data.tilemaps);
            ts_determineChanges = performance.now() - ts_determineChanges;
            
            let ts_clearRemovedTilemaps = performance.now();
            this.clearRemovedTilemaps(layer, changes.removedKeys, true, true); // delete cache, undraw.
            this.clearRemovedTilemaps(layer, changes.changedKeys, true, true); // delete cache, undraw.
            ts_clearRemovedTilemaps = performance.now() - ts_clearRemovedTilemaps;

            // Draw the tilemaps to the Image Data.
            let ts_drawTilemapsToImgDataLayer = performance.now();
            this.drawTilemapsToImgDataLayer(layer, data.tilemaps, true, data.fade);
            ts_drawTilemapsToImgDataLayer = performance.now() - ts_drawTilemapsToImgDataLayer;
    
            // Draw the entire Image Data. 
            let ts_drawTilemapsLayer = performance.now();
            this.drawTilemapsLayer(layer);
            ts_drawTilemapsLayer = performance.now() - ts_drawTilemapsLayer;
    
            ts_TOTAL = performance.now() - ts_TOTAL;

            // Save the timings.
            messageFuncs.timings["sendGfxUpdates"][layer]["A_TOTAL"]                      = ts_TOTAL.toFixed(3);
            messageFuncs.timings["sendGfxUpdates"][layer]["B_ts_determineChanges"]        = ts_determineChanges.toFixed(3);
            messageFuncs.timings["sendGfxUpdates"][layer]["C_ts_clearRemovedTilemaps"]    = ts_clearRemovedTilemaps.toFixed(3);
            messageFuncs.timings["sendGfxUpdates"][layer]["C_drawTilemapsToImgDataLayer"] = ts_drawTilemapsToImgDataLayer.toFixed(3);
            messageFuncs.timings["sendGfxUpdates"][layer]["D_drawTilemapsLayer"]          = ts_drawTilemapsLayer.toFixed(3);
        },

        // ************************
        // Run the graphics updates
        // ************************

        // Runs the graphics updates.
        run: function(messageData){
            let sendGfxUpdates = performance.now();
            
            if( messageData["ALLCLEAR"] ){ messageFuncs.sendGfxUpdates.clearAllLayers() }
            if( messageData["BG1"] ){ this.updateBG1(messageData["BG1"]); }
            if( messageData["BG2"] ){ this.updateBG2(messageData["BG2"]); }
            if( messageData["SP1"] ){ this.updateSP1(messageData["SP1"]); }
            if( messageData["TX1"] ){ this.updateTX1(messageData["TX1"]); }

            this.flickerFlag = ! this.flickerFlag;

            sendGfxUpdates = performance.now() - sendGfxUpdates;

            // Save the timings.
            messageFuncs.timings["sendGfxUpdates"]["sendGfxUpdates"] = sendGfxUpdates.toFixed(3);

            // Return the timings.
            return messageFuncs.timings["sendGfxUpdates"];
        },

        V3: {
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

            clearLayer: function(layer){
                // Clear the imgDataCache for this layer. (Set fully transparent.)
                _GFX.layers[layer].imgDataCache.data.fill(0);
            },
            clearAllLayers: function(){
                // For all layers...
                for(let layer in _GFX.layers){
                    // Clear the layer.
                    this.clearLayer(layer);
                }
            },
            setBgColorRgba: function(layer, bgColor){
                // Break out the values in bgColor.
                let [r, g, b, a] = bgColor;

                // Generate the 32-bit version of the bgColor.
                let fillColor = (a << 24) | (b << 16) | (g << 8) | r;

                // Create a Uint32Array view of the imgDataCache for this layer.
                let uint32Data = new Uint32Array(_GFX.layers[layer].imgDataCache.data.buffer);

                // Replace all transparent pixels with the bgColor.
                for (let p = 0, len = uint32Data.length; p < len; ++p) {
                    if (uint32Data[p] === 0) { uint32Data[p] = fillColor; }
                }
            },
            tilemapToImageData: function(obj){
                // console.log("------------tilemapToImageData:", obj);

                // Get the tileset and the dimensions for the tileset. 
                let tileset = _GFX.tilesets[ obj.tmap.ts ].tileset;
                let tilemap = obj.tmap.tmap;
                let tw = obj.tw;
                let th = obj.th;

                // Get the dimensions of the tilemap.
                let mapW = obj.mapW;
                let mapH = obj.mapH;

                // Start at index 2 since the first two indexs are the map dimensions in tiles. 
                let index=2;
                let missingTile = false;

                // Create new ImageData for the individual tile.
                let imageData = obj.imageData; // The complete ImageData for the tilemap.
                let imageDataTile = new ImageData(tw, th); // The ImageData for an individual tile.

                // Break-out settings.
                let settings  = obj.tmap.settings;
                let rotation  = settings.rotation;
                let xFlip     = settings.xFlip;
                let yFlip     = settings.yFlip;
                let colorData = settings.colorData;
                let fadeLevel = null;

                
                // Determine the fade level to use.
                // if( (fade && fade.fade && fade.currFade != null) ){ fadeLevel = fade.currFade; }
                // else if( settings.fade != null){ fadeLevel = settings.fade; }
                if( settings.fade != null){ fadeLevel = settings.fade; }
                
                // If fadeLevel is 10 then the tile will be full black. No transformations are needed.
                if(fadeLevel == 10){
                    // R,G,B is already 0. Need to set alpha.
                    for (let i = 3; i < imageData.data.length; i += 4) { imageData.data[i] = 255; }
                }

                // Not a level 10 fade. Continue with specified transformations.
                else{
                    // Draw the tilemap to the Image Data.
                    for(let y=0; y<mapH; y+=1){
                        for(let x=0; x<mapW; x+=1){
                            // Copy the tile data to the imageDataTile. 
                            try{ imageDataTile.data.set(tileset[ tilemap[index] ].imgData.data.slice()); missingTile = false; }
                            
                            // Missing tile. (Wrong tileset?) 
                            // Create a transparent tile and set the missingTile flag to skip any transforms from settings.
                            catch(e){ console.log("missing tile", obj); debugger; imageDataTile.data.fill(0); missingTile = true; }

                            // Rotate tile?
                            if(!missingTile && rotation) { 
                                // console.log("rotation:", rotation);
                                _GFX.utilities.rotateImageData(imageDataTile, rotation); 
                            }
        
                            // Flip tile horizontally?
                            if(!missingTile && xFlip)    { 
                                // console.log("xFlip");
                                _GFX.utilities.flipImageDataHorizontally(imageDataTile); 
                            }
        
                            // Flip tile vertically?
                            if(!missingTile && yFlip)    { 
                                // console.log("yFlip");
                                _GFX.utilities.flipImageDataVertically(imageDataTile); 
                            }
        
                            // Update the imageData with this tile.
                            // console.log("Writing tile:", index, tilemap.length-1, x * tw, y * th);
                            createGraphicsAssets.updateRegion(
                                imageDataTile.data,  // source
                                imageDataTile.width, // srcWidth
                                imageData.data,      // destination
                                imageData.width,     // destWidth
                                x * tw,              // x
                                y * th,              // y
                                tw,                  // w
                                th,                  // h
                                false                // onlyWriteToTransparent
                            );
        
                            // Increment the tile index in the tilemap.
                            index++;
                        }
                    }

                    // Apply color replacements to the ImageData of the tilemap?
                    if(colorData && colorData.length){
                        // console.log("Color replacements", colorData);
                        _GFX.utilities.replaceColors(imageData, colorData); 
                    }
                    
                    // Apply a background color against the transparent pixels of the ImageData of the tilemap?
                    if(settings.bgColorRgba){
                        console.log("bgColorRgba replacements", settings.bgColorRgba);
                        [r, g, b, a] = settings.bgColorRgba;
                        uint32Data = new Uint32Array(imageData.data.buffer);
                        fillColor = (a << 24) | (b << 16) | (g << 8) | r;
                        for (let p = 0, len = uint32Data.length; p < len; ++p) {
                            if (uint32Data[p] === 0) { uint32Data[p] = fillColor; }
                        }
                    }
                }

                return imageData;

            },

            update_ImgDataCache_tilemaps: function(layer, tilemaps, type){
                let mapKeys = Object.keys(tilemaps);
                let mapKey;

                // Get the tileset and the dimensions for the tileset. 
                let obj = {
                    tmap      : undefined,
                    tw        : undefined,
                    th        : undefined,
                    mapW      : undefined,
                    mapH      : undefined,
                    imageData : undefined,
                };
                
                for(let i=0, mapKeysLength=mapKeys.length; i<mapKeysLength; i+=1){
                    mapKey = mapKeys[i];
                    obj.tmap = tilemaps[mapKey];

                    // Get the dimensions of the tilemap.
                    obj.mapW = obj.tmap.tmap[0];
                    obj.mapH = obj.tmap.tmap[1];

                    // Get the tileset and the dimensions for the tileset. 
                    obj.tileset = _GFX.tilesets[ obj.tmap.ts ].tileset;
                    obj.tw      = _GFX.tilesets[ obj.tmap.ts ].config.tileWidth;
                    obj.th      = _GFX.tilesets[ obj.tmap.ts ].config.tileHeight;

                    // The width and height come from the tilemap and should be correct.
                    obj.imageData = new ImageData(obj.mapW * obj.tw, obj.mapH * obj.th); 

                    // Updates require that the existing drawn tilemap is removed first.
                    if(type=="UPDATE"){
                        this.remove_ImgDataCache_tilemaps(layer, [mapKey]);
                        obj.imageData = this.tilemapToImageData(obj);
                    }
                    
                    // Adds just draw the tilemap.
                    else if(type=="ADD"){
                        obj.imageData = this.tilemapToImageData(obj);
                    }

                    // Use onlyWriteToTransparent.
                    createGraphicsAssets.updateRegion(
                        obj.imageData.data,                    // source
                        obj.imageData.width,                   // srcWidth
                        _GFX.layers[layer].imgDataCache.data,  // destination
                        _GFX.layers[layer].imgDataCache.width, // destWidth
                        obj.tmap.x,                            // x
                        obj.tmap.y,                            // y
                        obj.imageData.width,                   // w
                        obj.imageData.height,                  // h
                        true                                   // onlyWriteToTransparent
                        // false                                   // onlyWriteToTransparent
                    );

                    // Save the data to the local cache.
                    _GFX.currentData[layer].tilemaps[mapKey] = {
                        x       : obj.tmap.x,
                        y       : obj.tmap.y,
                        w       : obj.imageData.width,
                        h       : obj.imageData.height,
                        imgData : obj.imageData,
                        hash    : obj.tmap.hash,    // TODO: This are UNUSED and most likely NOT needed.
                        hashPrev: obj.tmap.hashPrev // TODO: This are UNUSED and most likely NOT needed.
                    };
                }
            },
            remove_ImgDataCache_tilemaps: function(layer, tilemapKeys){
                let layerTilemapKeys = Object.keys(_GFX.currentData[layer].tilemaps);
                let overlappingTilemapKeys = [];
                let mapKey1, mapKey2, map2, cData;
                let x, y, w, h, imgData;
                let x2, y2, w2, h2, imgData2;
                
                // let rect1, rect2;
                // let cData;

                for(let i=0, len=tilemapKeys.length; i<len; i+=1){
                    mapKey1 = tilemapKeys[i];
                    let overlaps = this.getOverlappedTilemaps(layer, layerTilemapKeys, mapKey1);
                    if(overlaps.length){ overlappingTilemapKeys.push(...overlaps); }

                    // Remove the tilemap from imgDataCache.
                    // Use without onlyWriteToTransparent.
                    ({ x, y, w, h, imgData } = _GFX.currentData[layer].tilemaps[mapKey1]);
                    imgData.data.fill(0);
                    createGraphicsAssets.updateRegion(
                        imgData.data,                          // source
                        imgData.width,                         // srcWidth
                        _GFX.layers[layer].imgDataCache.data,  // destination
                        _GFX.layers[layer].imgDataCache.width, // destWidth
                        x,                                     // x
                        y,                                     // y
                        w, // imgData.width,                         // w
                        h, // imgData.height,                        // h
                        false                                  // onlyWriteToTransparent
                    );

                    // Remove the cache data for this tilemap.
                    delete _GFX.currentData[layer].tilemaps[mapKey1];
                }

                // Remove the overlapped tilemaps.
                for(let i=0, len=overlappingTilemapKeys.length; i<len; i+=1){
                    map2 = overlappingTilemapKeys[i];
                    mapKey1 = map2.mapKey1;
                    mapKey2 = map2.mapKey2;
                    cData = map2.cData;
                    // ({ x, y, w, h } = _GFX.currentData[layer].tilemaps[mapKey2]);
                    // ({ w, h } = _GFX.currentData[layer].tilemaps[mapKey2]);
                    // imgData2 = new ImageData(imgData.width, imgData.height);
                    imgData2 = new ImageData(w, h);
                    // console.log(`${mapKey1} overlaps ${mapKey2} within this region:`, x, y, w, h, tilemapKeys);
                    // debugger;

                    // Remove the tilemap from imgDataCache.
                    // Use without onlyWriteToTransparent.
                    // createGraphicsAssets.updateRegion(
                    //     imgData2.data,                         // source
                    //     imgData2.width,                        // srcWidth
                    //     _GFX.layers[layer].imgDataCache.data,  // destination
                    //     _GFX.layers[layer].imgDataCache.width, // destWidth
                    //     map2.cData.x,                                     // x
                    //     map2.cData.y,                                     // y
                    //     map2.cData.w,                        // w
                    //     map2.cData.h,                       // h
                    //     // false                                  // onlyWriteToTransparent
                    //     true                                  // onlyWriteToTransparent
                    // );
                }
                // console.log("");
                
                // Return the overlapped keys so that they can be added to changes.
                return overlappingTilemapKeys;
            },
            getOverlappedTilemaps: function(layer, mapKeys, mapKey1){
                if(!_GFX.currentData[layer].tilemaps[mapKey1]){ 
                    console.log("getOverlappedTilemaps: could not find mapKey1", layer, mapKey1);
                    return []; 
                }

                let overlappingTilemapKeys = [];
                let layerTilemapKeys = Object.keys(_GFX.currentData[layer].tilemaps);
                let mapKey2;
                let x2, y2, w2, h2; 

                // Get data from the cache.
                let { x, y, w, h } = _GFX.currentData[layer].tilemaps[mapKey1];
                let rect1 = {x:x, y:y, w:w, h:h};
                let rect2;
                let cData;

                // Determine if this tilemap is overlapping with any other tilemaps.
                for(let c=0, clen=layerTilemapKeys.length; c<clen; c+=1){
                    mapKey2 = layerTilemapKeys[c];
                    if(mapKey2 == mapKey1){ continue; }
                    if(!_GFX.currentData[layer].tilemaps[mapKey2]){ continue; }

                    ({ x: x2, y: y2, w: w2, h: h2 } = _GFX.currentData[layer].tilemaps[mapKey2]);
                    rect2 = {x:x2, y:y2, w:w2, h:h2};
                    cData = this.aabb_collisionDetection(rect1, rect2);
                    
                    // Overlapped tilemaps need to be redrawn.
                    if(cData.collision){
                        overlappingTilemapKeys.push( { 
                            mapKey1: mapKey1, 
                            mapKey2: mapKey2, 
                            cData: cData, 
                            // rect1: rect1, 
                            // rect2: rect2, 
                        } );
                    }
                }

                return overlappingTilemapKeys;
            },

            redraw_ImgDataCache_imgData: function(layer, tilemapKeys){
                // return;
                let mapKey, x, y, w, h, imgData;

                for(let i=0, len=tilemapKeys.length; i<len; i+=1){
                    // Get the tilemap key.
                    mapKey = tilemapKeys[i];

                    if(!_GFX.currentData[layer].tilemaps[mapKey]){ console.log("not here"); continue; }
                    ( { x, y, w, h, imgData } = _GFX.currentData[layer].tilemaps[mapKey] );

                    // Draw the tilemap ImageData from cache to imgDataCache.
                    // Use with onlyWriteToTransparent.
                    // imgData.data.fill(0);
                    console.log(mapKey, x, y, w, h, imgData);
                    createGraphicsAssets.updateRegion(
                        imgData.data,                          // source
                        imgData.width,                         // srcWidth
                        _GFX.layers[layer].imgDataCache.data,  // destination
                        _GFX.layers[layer].imgDataCache.width, // destWidth
                        x,                                     // x
                        y,                                     // y
                        imgData.width,                         // w
                        imgData.height,                        // h
                        // true                                   // onlyWriteToTransparent
                        false                                   // onlyWriteToTransparent
                    );

                    // // Use onlyWriteToTransparent.
                    // createGraphicsAssets.updateRegion(
                    //     obj.imageData.data,                    // source
                    //     obj.imageData.width,                   // srcWidth
                    //     _GFX.layers[layer].imgDataCache.data,  // destination
                    //     _GFX.layers[layer].imgDataCache.width, // destWidth
                    //     obj.tmap.x,                            // x
                    //     obj.tmap.y,                            // y
                    //     obj.imageData.width,                   // w
                    //     obj.imageData.height,                  // h
                    //     true                                   // onlyWriteToTransparent
                    //     // false                                   // onlyWriteToTransparent
                    // );



                }

            },
            drawImgDataCacheToCanvas: function(layer, fade){
                // Get the imgDataCache.
                let imgDataCache = _GFX.layers[layer].imgDataCache;

                // If there is a global fade then apply it to imgDataCache.
                //

                // Use the imgDataCache to draw to the output canvas.
                _GFX.layers[layer].ctx.putImageData(imgDataCache, 0, 0);
            },

            updateBG1: function(data, ALLCLEAR){
                // console.log("updateBG1:", data);
                // Set the layer.
                let layer = "BG1";
    
                // Clear the layer on any update.
                if(ALLCLEAR || layer == "BG1"){
                    this.clearLayer(layer);
                    _GFX.currentData[layer].tilemaps = {};
                    // data.REMOVALS_ONLY = [];
                }
    
                // Draw tilemaps to imgDataCache.
                // let redraws1 = this.remove_ImgDataCache_tilemaps(layer, data.REMOVALS_ONLY);
                // // this.redraw_ImgDataCache_imgData(layer, redraws1);
                this.update_ImgDataCache_tilemaps(layer, data.CHANGES_ONLY, "UPDATE");
                this.update_ImgDataCache_tilemaps(layer, data.ADD_ONLY, "ADD");
                
                // If the layer is BG1 and a bgColor was specified then set the bgColor too.
                // if(layer == "BG1" && data.bgColorRgba){ this.setBgColorRgba(layer, data.bgColorRgba); }
                if(layer == "BG1" && data.bgColorRgba){ this.setBgColorRgba(layer, [32,32,32,255]); }
            },
            updateBG2: function(data, ALLCLEAR){
                // Set the layer.
                let layer = "BG2";
    
                // Clear the layer on ALLCLEAR..
                if(ALLCLEAR){
                    this.clearLayer(layer);
                    _GFX.currentData[layer].tilemaps = {};
                    data.REMOVALS_ONLY = [];
                }

                // Draw tilemaps to imgDataCache.
                let redraws1 = this.remove_ImgDataCache_tilemaps(layer, data.REMOVALS_ONLY);
                // if(redraws1){ this.redraw_ImgDataCache_imgData(layer, redraws1); }
                
                let redraws2 = this.update_ImgDataCache_tilemaps(layer, data.CHANGES_ONLY, "UPDATE");
                // if(redraws2){ this.redraw_ImgDataCache_imgData(layer, redraws2); }

                this.update_ImgDataCache_tilemaps(layer, data.ADD_ONLY, "ADD");
            },
            updateSP1: function(data, ALLCLEAR){},
            updateTX1: function(data, ALLCLEAR){},
    
            run: function(messageData){
                let sendGfxUpdates = performance.now();
                
                // Clear the imgDataCache for each layer.
                // if( messageData["ALLCLEAR"] ){ 
                //     messageFuncs.sendGfxUpdates.clearAllLayers(messageData["BG1"].bgColorRgba); 
                // }

                // Update imgDataCache with layer changes.
                if(messageData.hasChanges){
                    if( messageData["BG1"].changes ){ this.updateBG1( messageData["BG1"], messageData["ALLCLEAR"] )  }
                    if( messageData["BG2"].changes ){ this.updateBG2( messageData["BG2"], messageData["ALLCLEAR"] )  }
                    if( messageData["SP1"].changes ){ this.updateSP1( messageData["SP1"], messageData["ALLCLEAR"] )  }
                    if( messageData["TX1"].changes ){ this.updateTX1( messageData["TX1"], messageData["ALLCLEAR"] )  }
                }

                // Update all canvas output layers that have changed.
                for(let layer in _GFX.layers){
                    // If the layer has changes draw imgDataCache to canvas and fade if specified.
                    if(messageData[layer].changes){
                        this.drawImgDataCacheToCanvas(layer, messageData[layer].fade);
                    }
                }

                // // Was an ALLCLEAR requested but there were no tilemap changes?
                // if( messageData["ALLCLEAR"] && ! messageData.changes){
                //     console.log("ALLCLEAR but there were no changes...");
                //     // For all layers...
                //     for(let layer in _GFX.layers){
                //         // Draw imgDataCache to canvas and fade if specified.
                //         this.drawImgDataCacheToCanvas(layer, messageData[layer].fade);
                //     }
                // }
                
                // // There were tilemap changes. Draw each chnaged layer to it's canvas with imgDataCache.
                // else if(messageData.changes){
                //     console.log("There are changes...");

                //     // For all layers...
                //     for(let layer in _GFX.layers){
                //         // Draw imgDataCache to canvas and fade if specified.
                //         this.drawImgDataCacheToCanvas(layer, messageData[layer].fade);
                //     }
                // }
    
                this.flickerFlag = ! this.flickerFlag;
    
                sendGfxUpdates = performance.now() - sendGfxUpdates;
    
                // Save the timings.
                messageFuncs.timings["sendGfxUpdates"]["sendGfxUpdates"] = sendGfxUpdates.toFixed(3);
    
                // Return the timings.
                return messageFuncs.timings["sendGfxUpdates"];
            },
        },
        V4:{
            CLEAR:{
                parent: null,

                fullTransparent_imgDataLayer: null,
                
                // Clears ONE layer gfx. (imgDataCache)
                oneLayerGfx: function(layerKey){
                    // Clear the imgDataCache for this layer.
                    _GFX.layers[layerKey].imgDataCache.data.set(this.fullTransparent_imgDataLayer.data);
                },
                // Clears ALL layers gfx. (imgDataCache)
                allLayersGfx: function(){
                    let layerKeys = Object.keys(_GFX.layers);
                    for(let i=0, len=layerKeys.length; i<len; i+=1){
                        this.oneLayerGfx(layerKeys[i]);
                    }
                },

                // Clears ONE layer data. (data cache)
                oneLayerData: function(layerKey){
                    // Clear the cache for this layer.
                    _GFX.currentData[layerKey].tilemaps = {};

                    // If the layer is BG1 then reset bgColorRgba and bgColor32bit also.
                    if(layerKey == "BG1"){
                        _GFX.currentData[layerKey].bgColorRgba = [0,0,0,0];
                        _GFX.currentData[layerKey].bgColor32bit = 0;
                    }

                },
                // Clears ALL layers data. (data cache)
                allLayersData: function(){
                    let layerKeys = Object.keys(_GFX.layers);
                    for(let i=0, len=layerKeys.length; i<len; i+=1){
                        this.oneLayerData(layerKeys[i]);
                    }
                },

                // Deletes a specific map key in the data cache.
                oneMapKey: function(layer, mapKey){
                    if(_GFX.currentData[layer][mapKey]){
                        delete _GFX.currentData[layer][mapKey];
                    }
                },

                // Deletes a many specific map key in the data cache.
                manyMapKeys: function(layer, mapKeys=[]){
                    let mapKey;
                    for(let i=0, len=mapKeys.length; i<len; i+=1){
                        mapKey = mapKeys[i];
                        if(_GFX.currentData[layer][mapKey]){
                            delete _GFX.currentData[layer][mapKey];
                        }
                    }
                },
            },
            SETBG:{
                parent: null,

                // Convert JsAlpha (0.0 - 1.0) to Uint8 (0-255) alpha.
                convertJsAlphaToUint8Alpha: function(JsAlpha){
                    return  Math.round(JsAlpha * 255);
                },

                // Convert Uint8 (0-255) alpha to JsAlpha (0.0 - 1.0).
                convertUint8AlphaToJsAlpha: function(Uint8Alpha){
                    return Number((Uint8Alpha / 255).toFixed(2));
                },

                // Convert array having values for r,g,b,a to 32-bit rgba value.
                rgbaTo32bit: function(rgbaArray){
                    // Break out the values in rgbaArray.
                    let [r, g, b, a] = rgbaArray;
                    
                    // Generate the 32-bit version of the rgbaArray.
                    let fillColor = (a << 24) | (b << 16) | (g << 8) | r;
                    
                    // Return the result.
                    return fillColor;
                },

                // UNUSED
                // Convert 32-bit rgba value to array having values for r,g,b,a. (alpha 0-255 or 0.1)
                bits32ToRgbaArray: function(bits32Value, alphaAsFloat=false){
                    // Generate the alpha value.
                    let alpha = (bits32Value >> 24) & 255;
                    
                    // Optionally convert the alpha value to float.
                    if(alphaAsFloat){
                        alpha = this.convertUint8AlphaToJsAlpha(alpha);
                    }

                    // Return the r,g,b,a array.
                    return [
                         bits32Value & 255,        // r
                        (bits32Value >> 8) & 255,  // g
                        (bits32Value >> 16) & 255, // b
                        alpha,                     // a
                    ];
                },

                // Replaces the specified color pixels with the replacement bgColor.
                // Also stores the replacement colors for later use.
                setLayerBgColorRgba: function(layer, findColorArray, replaceColorArray){
                    if(layer != "BG1"){ 
                        throw `setLayerBgColorRgba is only available for BG1. You specified: ${layer}`;
                    }

                    // Get the 32-bit value for the [r,g,b,a] values provided.
                    let findColor_32bit    = this.rgbaTo32bit(findColorArray);
                    let replaceColor_32bit = this.rgbaTo32bit(replaceColorArray);

                    // If the 32-bit value is different than the stored value then update both.
                    if(_GFX.currentData["BG1"].bgColor32bit != replaceColor_32bit){
                        _GFX.currentData["BG1"].bgColorRgba  = replaceColorArray;
                        _GFX.currentData["BG1"].bgColor32bit = replaceColor_32bit;
                    }

                    // Create a Uint32Array view of the imgDataCache for this layer.
                    let uint32Data = new Uint32Array(_GFX.layers["BG1"].imgDataCache.data.buffer);
    
                    // Find the findColor and replace with the replacementColor.
                    for (let p = 0, len = uint32Data.length; p < len; ++p) {
                        if (uint32Data[p] === findColor_32bit) { uint32Data[p] = replaceColor_32bit; }
                    }
                },

                // Replaces the specified color pixels with the replacement bgColor.
                setImageDataBgColorRgba: function(imageData, findColorArray, replaceColorArray){
                    // Get the 32-bit value for the [r,g,b,a] values provided.
                    let findColor_32bit    = this.rgbaTo32bit(findColorArray);
                    let replaceColor_32bit = this.rgbaTo32bit(replaceColorArray);

                    // Create a Uint32Array view of the imgDataCache for this layer.
                    let uint32Data = new Uint32Array(imageData.data.buffer);
    
                    // Find the findColor and replace with the replacementColor.
                    for (let p = 0, len = uint32Data.length; p < len; ++p) {
                        if (uint32Data[p] === findColor_32bit) { uint32Data[p] = replaceColor_32bit; }
                    }
                },
            },
            UPDATE:{
                parent:null,

                ANYLAYER: function(layerKey, messageData){
                    let layerData = messageData[layerKey];

                    // Clear the layer. (imgDataCache)
                    this.parent.CLEAR.oneLayerGfx(layerKey);
                    
                    // Set the background color?
                    if(layerKey == "BG1"){
                        this.parent.SETBG.setLayerBgColorRgba( layerKey, [0,0,0,0], layerData.bgColorRgba );
                    }

                    // Clear graphics cache data mapKeys indicated by the REMOVALS_ONLY array.
                    this.parent.CLEAR.manyMapKeys(layerKey, layerData["REMOVALS_ONLY"]);

                    // Create ImageData tilemaps as needed and update the graphics data cache. 
                    this.parent.DRAW.createImageDataFromTilemapsAndUpdateGraphicsCache(
                        layerKey,
                        [
                            ...Object.keys(layerData["ADD_ONLY"]),
                            ...Object.keys(layerData["CHANGES_ONLY"]),
                        ],
                        {
                            ...layerData["ADD_ONLY"],
                            ...layerData["CHANGES_ONLY"],
                        },
                        layerData.fade
                    );
                    
                    // Redraw the imgDataCache from the graphics data cache.
                    this.parent.DRAW.drawImgDataCacheFromDataCache(layerKey, false);

                    // Redraw the layer from the cache data to imgDataCache.
                    this.parent.DRAW.drawImgDataCacheToCanvas(layerKey, layerData.fade);
                },
                BG1: function(messageData){
                    let layerKey = "BG1";
                    let layerData = messageData[layerKey];

                    // Clear the layer. (imgDataCache and canvas fillRect)
                    // Remove the cache data for REMOVED tilemaps.
                    // Create ADDED tilemaps (add to cache.)
                    // Create CHANGED tilemaps. (add to cache.)
                    // Add the bgColor for tilemaps if specified (fillRect)
                    // Draw the layer background-color if specified. (fillRect)
                    // Fade the layer background-color if specified. (fillRect)
                    // Redraw the layer from the cache data to imgDataCache.

                    // 
                },
                BG2: function(messageData){
                    let layerKey = "BG2";
                    let layerData = messageData[layerKey];

                    // Clear the layer.
                    this.parent.CLEAR.oneLayerGfx(layerKey);
                    
                    // Clear cache data mapKeys indicated by the REMOVALS_ONLY array.
                    this.parent.CLEAR.manyMapKeys(layerKey, layerData["REMOVALS_ONLY"]);

                    // Create ImageData tilemaps as needed and update the graphics data cache. 
                    this.parent.DRAW.createImageDataFromTilemapsAndUpdateGraphicsCache(
                        layerKey,
                        [
                            ...Object.keys(layerData["ADD_ONLY"]),
                            ...Object.keys(layerData["CHANGES_ONLY"]),
                        ],
                        {
                            ...layerData["ADD_ONLY"],
                            ...layerData["CHANGES_ONLY"],
                        },
                        layerData.fade
                    );
                    
                    // Redraw the imgDataCache from the graphics data cache.
                    this.parent.DRAW.drawImgDataCacheFromDataCache(layerKey, false);

                    // Redraw the layer from the cache data to imgDataCache.
                    this.parent.DRAW.drawImgDataCacheToCanvas(layerKey, layerData.fade);
                },
                SP1: function(messageData){
                    let layerKey = "SP1";
                    let layerData = messageData[layerKey];

                    // Clear the layer.
                    // Remove the cache data for REMOVED tilemaps.
                    // Create ADDED tilemaps (add to cache.)
                    // Create CHANGED tilemaps. (add to cache.)
                    // Redraw the layer from the cache data to imgDataCache.

                    // 
                },
                TX1: function(messageData){
                    let layerKey = "TX1";
                    let layerData = messageData[layerKey];

                    // Clear the layer.
                    // Remove the cache data for REMOVED tilemaps.
                    // Create ADDED tilemaps (add to cache.)
                    // Create CHANGED tilemaps. (add to cache.)
                    // Redraw the layer from the cache data to imgDataCache.

                    // 
                },
            },
            DRAW: {
                parent:null,
                // flickerFlag: 0,

                //
                createImageDataFromTilemap: function(tmapObj, globalFade){
                    // Get the tileset and the dimensions for the tileset. 
                    let tileset = _GFX.tilesets[ tmapObj.ts ].tileset;
                    let tw      = _GFX.tilesets[ tmapObj.ts ].config.tileWidth;
                    let th      = _GFX.tilesets[ tmapObj.ts ].config.tileHeight;

                    // Get the dimensions of the tilemap.
                    let mapW = tmapObj.tmap[0];
                    let mapH = tmapObj.tmap[1];
                    
                    // Start at index 2 since the first two indexs are the map dimensions in tiles. 
                    let index=2;
                    let missingTile = false;

                    // Create new ImageData for the tilemap.
                    let imageData = new ImageData(mapW * tw, mapH * th); // The width and height come from the tilemap and should be correct.
                    
                    // Create new ImageData to be reused for each tilemap tile.
                    let imageDataTile = new ImageData(tw, th);
                    let width  = imageDataTile.width;
                    let height = imageDataTile.height;
                    
                    // Break-out settings.
                    let settings  = tmapObj.settings;
                    let colorData = settings.colorData;
                    let fadeLevel = null;

                    // Determine the fade level (the global fade takes priority over the tmapObj.settings.fade.)
                    if( (globalFade && globalFade.fade && globalFade.currFade != null) ){ fadeLevel = globalFade.currFade; }
                    else if( settings.fade != null){ fadeLevel = settings.fade; }

                    // Fully faded out? If the fade level is 10 then just draw the entire tilemap imageData as full black;
                    if( fadeLevel == 10 ){
                        // R,G,B is already 0. Need to set alpha to enable full black.
                        for (let i = 3; i < imageData.data.length; i += 4) { imageData.data[i] = 255; }
                    }

                    // No. Process the tilemap tile-by-tile.
                    else{
                        // Create the ImageData version of the tilemap.
                        for(let y=0; y<mapH; y+=1){
                            for(let x=0; x<mapW; x+=1){
                                // Replace the imageDataTile.data with the tile ImageData.data specified by the tilemap.
                                try{ 
                                    imageDataTile.data.set(tileset[ tmapObj.tmap[index] ].imgData.data.slice()); 
                                    missingTile = false; 
                                }
                                
                                // Missing tile. (Wrong tileset?) 
                                // Create a transparent tile and set the missingTile flag to skip any transforms from settings.
                                catch(e){ 
                                    imageDataTile.data.fill(0); 
                                    missingTile = true; 
                                    ({width, height} = imageDataTile);
                                }
                                
                                // Apply tile transforms using rotation, xFlip, yFlip.
                                // Skip the transforms if the tile was not found. 
                                if(!missingTile){
                                    ({width, height} = this.performTransformsOnImageData(imageDataTile, settings));
                                }

                                // Update the imageData with the completed imageDataTile.
                                createGraphicsAssets.updateRegion(
                                    imageDataTile.data,  // source
                                    width, // imageDataTile.width, // srcWidth
                                    imageData.data,      // destination
                                    imageData.width,     // destWidth
                                    x * tw,              // x
                                    y * th,              // y
                                    width,  // tw,                  // w
                                    height, // th,                  // h
                                    false                // onlyWriteToTransparent
                                );

                                // Increment the tile index in the tilemap.
                                index++;
                            }
                        }

                        // Handle adding a background?  (by reference.)
                        if(settings.bgColorRgba){
                            this.parent.SETBG.setImageDataBgColorRgba(imageData, [0,0,0,0], settings.bgColorRgba);
                        }

                        // Handle color replacements. (by reference.)
                        if(colorData && colorData.length){
                            _GFX.utilities.replaceColors(imageData, colorData); 
                        }
                    }

                    // Return the completed ImageData version of the tilemap.
                    return imageData;
                },
                
                // Transforms using rotation, xFlip, yFlip (no recoloring.) (By reference.)
                performTransformsOnImageData: function(imageData, settings){
                    let width  = imageData.width;
                    let height = imageData.height;

                    // Handle rotation.
                    // NOTE: If a tilemap is NOT a square then the tilemap will have swapped new width and height values.
                    if(settings.rotation)        { ({width, height} = _GFX.utilities.rotateImageData(imageData, settings.rotation)); }
                    
                    // Handle xFlip.
                    if(settings.xFlip)           { imageData = _GFX.utilities.flipImageDataHorizontally(imageData); }
                    
                    // Handle yFlip.
                    if(settings.yFlip)           { imageData = _GFX.utilities.flipImageDataVertically(imageData); }
                    
                    // Handle color replacements. (by reference.)
                    // if(settings.colorData.length){ imageData = _GFX.utilities.replaceColors(imageData, settings.colorData); }

                    // Return the width and height (only useful for non-square image data.)
                    return { width:width, height:height };
                },
                
                //
                createImageDataFromTilemapsAndUpdateGraphicsCache: function(layerKey, mapKeys, maps, fade){
                    let mapKey;
                    let map;
                    for(let i=0, len=mapKeys.length; i<len; i+=1){
                        // Get the mapKey and the map;
                        mapKey = mapKeys[i];
                        map = maps[mapKey];

                        // Create the ImageData for this tilemap.
                        map.imgData = this.createImageDataFromTilemap( map, fade );

                        // Save the completed data to the data cache.
                        _GFX.currentData[layerKey].tilemaps[mapKey] = {
                            ...map,
                            w: map.imgData.width, 
                            h: map.imgData.height
                        }
                    }
                },

                // Draw ALL tilemap ImageData from cache.
                drawImgDataCacheFromDataCache: function(layer, flicker=false){
                    let maps    = _GFX.currentData[layer].tilemaps;
                    let mapKeys = Object.keys(maps);

                    // "Flicker"
                    // if(layerKey == "SP1"){ if(this.flickerFlag){ mapKeys.reverse(); } }

                    for(let i=0, len=mapKeys.length; i<len; i+=1){
                        let mapKey = mapKeys[i];
                        let map = _GFX.currentData[layer].tilemaps[mapKey];

                        // Use blitDestTransparency.
                        createGraphicsAssets.updateRegion2(
                            map.imgData.data,                      // source
                            map.imgData.width,                     // srcWidth
                            _GFX.layers[layer].imgDataCache.data,  // destination
                            _GFX.layers[layer].imgDataCache.width, // destWidth
                            map.x,                                 // x
                            map.y,                                 // y
                            map.w,                                 // w
                            map.h,                                 // h
                            true                                   // blitDestTransparency
                            // false                                  // blitDestTransparency
                        );
                    }
                },

                // Draw the imgDataCache for a layer to the canvas layer. (Can also apply the global fade.)
                drawImgDataCacheToCanvas: function(layer, fade){
                    // Get the imgDataCache.
                    let imgDataCache = _GFX.layers[layer].imgDataCache;

                    // If there is a global fade then apply it to imgDataCache.
                    // createGraphicsAssets.rgba32TileToFadedRgba32Tile(imgDataCache, fadeLevel);

                    // Use the imgDataCache to draw to the output canvas.
                    _GFX.layers[layer].ctx.putImageData(imgDataCache, 0, 0);
                },
            },
            run: function(messageData){
                // if(messageData.gs1 != "gs_N782"){ console.log("messageData.gs1:", messageData.gs1); return; }
                // console.log("YES messageData.gs1:", messageData.gs1);
                
                // Handle the ALLCLEAR. (Clears imgDataCache and the data cache.)
                if(messageData.ALLCLEAR){
                    this.CLEAR.allLayersGfx();
                    this.CLEAR.allLayersData();
                    // return;
                }

                let layerKeys = ["BG1", "BG2", "SP1", "TX1"];
                let layerKey;
                for(let i=0, len1=layerKeys.length; i<len1; i+=1){
                    // Get this layer key.
                    layerKey = layerKeys[i];

                    // Skip this layer key if it does not exist in the messageData.
                    if(!messageData[layerKey]){ continue; }

                    // Run the draw updater for this layer if ALLCLEAR is set or there are changes. 
                    if(messageData.ALLCLEAR || messageData.hasChanges){
                        this.UPDATE.ANYLAYER(layerKey, messageData);

                        // "Flicker"
                        // if(layerKey == "SP1"){ this.flickerFlag = ! this.flickerFlag; }
                    }
                }

                // // MessageData should look like this:
                // let data2 = {
                //     version: 4,       // Version of the messageData.
                //     ALLCLEAR: false,  // Request to clear all layers and data.
                //     hasChanges: true, // At least one layer has changes.
                //     BG1:{
                //         ADD_ONLY      : {},                              // Added
                //         CHANGES_ONLY  : {},                              // Existing and changed
                //         REMOVALS_ONLY : [],                              // Previously existing and requiring removal
                //         ALL_MAPKEYS   : [],                              // A list of all active map keys for this layer.
                //         fade       : _GFX.currentData["BG1"].fade,       // Fade for this layer.
                //         changes    : _GFX.currentData["BG1"].changes,    // If the layer has changes
                //         bgColorRgba: _GFX.currentData["BG1"].bgColorRgba // background-color for the layer.
                //     }
                //     // ... BG1 repeated but for the remaining layers which won't have bgColorRgba.
                // };
            },
            init: function(){
                this.CLEAR.parent = this;
                let {width, height} = _GFX.layers["BG1"].imgDataCache;
                this.CLEAR.fullTransparent_imgDataLayer = new ImageData(width, height);

                this.DRAW.parent = this;

                this.SETBG.parent = this;

                this.UPDATE.parent = this;
            }
        }
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
            // case "initConfigAndGraphics": { returnData = await messageFuncs.initConfigAndGraphics(data); break; }
            case "initConfigAndGraphics": { 
                if(!flags.dataRequest){              await messageFuncs.initConfigAndGraphics(data); }
                else                  { returnData = await messageFuncs.initConfigAndGraphics(data); }
                break;
            }
            case "initLayers"           : { 
                messageFuncs.initLayers(data); 
                messageFuncs.sendGfxUpdates.V4.init();
                break; 
            }
            case "sendGfxUpdates"       : { 
                // console.log(`mode: ${mode}`, "\n  data:", data, "\n  flags:", flags);
                // debugger;
                if(data.version == 3){
                    if(!flags.dataRequest){              messageFuncs.sendGfxUpdates.V3.run(data); }
                    else                  { returnData = messageFuncs.sendGfxUpdates.V3.run(data); }
                }
                if(data.version == 4){
                    if(!flags.dataRequest){              messageFuncs.sendGfxUpdates.V4.run(data); }
                    else                  { returnData = messageFuncs.sendGfxUpdates.V4.run(data); }
                }
                else{
                    // if(!flags.dataRequest){              messageFuncs.sendGfxUpdates.run(data); }
                    // else                  { returnData = messageFuncs.sendGfxUpdates.run(data); }
                }
                break; 
            }
            
            // DEBUG REQUESTS.
            case "_DEBUG.drawColorPalette" : { 
                _DEBUG.drawColorPalette(); 
                break; 
            }
            case "clearAllLayers"          : { 
                messageFuncs.sendGfxUpdates.clearAllLayers(); 
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
