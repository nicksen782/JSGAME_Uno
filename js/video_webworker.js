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
            // bgColorRgba: [0,255,255,255],
            // tilemaps   : {},
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
        tilemapToImageData: function(tilesetName, tilemap, settings){
            // Get the tileset and the dimensions for the tileset. 
            let tileset = _GFX.tilesets[tilesetName].tileset;
            let tw = _GFX.tilesets["bg_tiles2"].config.tileWidth;
            let th = _GFX.tilesets["bg_tiles2"].config.tileHeight;

            // Get the dimensions of the tilemap.
            let mapW = tilemap[0];
            let mapH = tilemap[1];
            
            // Start at index 2 since the first two indexs are the map dimensions in tiles. 
            let index=2;
            
            // Create new ImageData. (The final copy and the reusable tile copy.)
            let imageData = new ImageData(mapW*tw, mapH*th);
            let imageDataTile = new ImageData(tw, th);
            
            let tile;
            for(let y=0; y<mapH; y+=1){
                for(let x=0; x<mapW; x+=1){
                    // Get a handle to the tile. 
                    tile = (settings.fade == undefined)
                        ? tileset[ tilemap[index] ] 
                        : tileset[ tilemap[index] ].fadeTiles[settings.fade];
                    
                    // Copy the tile data to the imageDataTile. 
                    imageDataTile.data.set(tile.imgData.data.slice());

                    // Rotate tile?
                    if(settings.rotation) { _GFX.utilities.rotateImageData(imageDataTile, settings.rotation); }

                    // Flip tile horizontally?
                    if(settings.xFlip)    { _GFX.utilities.flipImageDataHorizontally(imageDataTile); }

                    // Flip tile vertically?
                    if(settings.yFlip)    { _GFX.utilities.flipImageDataVertically(imageDataTile); }

                    // Update the imageData with this tile.
                    createGraphicsAssets.updateRegion(
                        imageDataTile.data,  // source
                        imageDataTile.width, // srcWidth
                        imageData.data,      // destination
                        imageData.width,     // destWidth
                        x*tw,                // x
                        y*th,                // y
                        tw,                  // w
                        th                   // h
                    );

                    // Increment the tile index in the tilemap.
                    index++;
                }
            }

            // Replace colors of the resulting imageData?
            if(settings.colorData && settings.colorData.length){ 
                _GFX.utilities.replaceColors(imageData, settings.colorData); 
            }

            return {
                imgData: imageData,
                tw     : tw,
                th     : th,
            }
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
                return;
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
            data.set(rotatedData);
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
    },
};
const _DEBUG = {
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
            thisTile = new Uint8ClampedArray( (4*tw*th)*4);

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
                        h  // h
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
                let rec = _GFX.layers[layer];
                rec.ctx.clearRect(0, 0, rec.canvas.width, rec.canvas.height);
            }
            tsAllLayerClear = performance.now() - tsAllLayerClear;
    
            // Clear the data for each currentData.
            let tsAllObjectClear = performance.now();
            for(let layerKey in _GFX.currentData){ 
                _GFX.currentData[layerKey].tilemaps = {};
            }
            tsAllObjectClear = performance.now() - tsAllObjectClear;
    
            // Save the timings.
            messageFuncs.timings["clearAllLayers"]["AllLayerClear"] = tsAllLayerClear.toFixed(3);
            messageFuncs.timings["clearAllLayers"]["AllObjectClear"] = tsAllObjectClear.toFixed(3);
        },
        // Fills the imgDataCache for a layer with 0 (fully transparent.)
        clearLayer : function(layer){
            _GFX.layers[layer].imgDataCache.data.fill(0);
        },
        // Converts a tilemap to ImageData and draws to the imgDataCache. Can also recolor and save tilemap rect and hash data.
        drawTilemapsToImgDataLayer : function(layer, tilemaps, save=false){
            // This prevents a sprite from always being on top of other sprites. 
            // By reversing the draw order each is on top 50% of the time.
            let mapKeys = Object.keys(tilemaps);
            if(this.flickerFlag){ mapKeys.reverse(); }

            // for(let mapKey in tilemaps){
            for(let i=0; i<mapKeys.length; i+=1){
                let mapKey = mapKeys[i];
                let tmap = tilemaps[mapKey];
                let obj = _GFX.utilities.tilemapToImageData(tmap.ts, tmap.tmap, tmap.settings);

                if(tmap.settings.bgColorRgba){
                    let [r, g, b, a] = tmap.settings.bgColorRgba;
                    let uint32Data = new Uint32Array(obj.imgData.data.buffer);
                    let fillColor = (a << 24) | (b << 16) | (g << 8) | r;
                    let len = uint32Data.length;
                    for (let p = 0; p < len; ++p) {
                        if (uint32Data[p] === 0) { uint32Data[p] = fillColor; }
                    }
                }

                createGraphicsAssets.updateRegionBlit(
                    obj.imgData.data,                      // source
                    obj.imgData.width,                     // srcWidth
                    _GFX.layers[layer].imgDataCache.data,  // destination
                    _GFX.layers[layer].imgDataCache.width, // destWidth
                    tmap.x * obj.tw,                       // x
                    tmap.y * obj.th,                       // y
                    obj.imgData.width,                     // w
                    obj.imgData.height                     // h
                );

                if(save){
                    _GFX.currentData[layer].tilemaps[mapKey] = {
                        x: tmap.x * obj.tw,
                        y: tmap.y * obj.th,
                        w: obj.imgData.width,
                        h: obj.imgData.height,
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

        // Updates the BG1 layer.
        updateBG1 : function(data){
            let ts_TOTAL = performance.now();

            let layer = "BG1";
            
            // Clear the Image Data (transparent).
            let ts_clearLayer = performance.now();
            this.clearLayer(layer);
            ts_clearLayer = performance.now() - ts_clearLayer;
            
            // Draw the tilemaps to the Image Data.
            let ts_drawTilemapsToImgDataLayer = performance.now();
            this.drawTilemapsToImgDataLayer(layer, data.tilemaps, false);
            ts_drawTilemapsToImgDataLayer = performance.now() - ts_drawTilemapsToImgDataLayer;
            
            // Set the transparent pixels to the background color.
            let ts_setBackgroundcolor = performance.now();
            if(data.bgColorRgba){
                this.setBackgroundcolor(layer, data.bgColorRgba);
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
            this.drawTilemapsToImgDataLayer(layer, data.tilemaps, true);
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
            this.drawTilemapsToImgDataLayer(layer, data.tilemaps, true);
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
            this.drawTilemapsToImgDataLayer(layer, data.tilemaps, true);
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
            if( messageData["BG1"] ){ this.updateBG1(messageData["BG1"]); }
            if( messageData["BG2"] ){ this.updateBG2(messageData["BG2"]); }
            if( messageData["SP1"] ){ this.updateSP1(messageData["SP1"]); }
            if( messageData["TX1"] ){ this.updateTX1(messageData["TX1"]); }

            this.flickerFlag = ! this.flickerFlag;
            sendGfxUpdates = performance.now() - sendGfxUpdates;
            
            // Save the timings.
            messageFuncs.timings["sendGfxUpdates"]["sendGfxUpdates"] = sendGfxUpdates.toFixed(3);
        },
    },
};

self.onmessage = async function(event) {
    // Accept only version 2 methods.
    if(!event.data.version == 2){ 
        console.log("Mismatched version. Must be version 2.");
        self.postMessage( {mode: event.data, data: ""}, [] );
    }
    else{
        if(!event.data.mode){ console.log("No mode was specified."); self.postMessage( {mode: event.data, data: ""}, [] ); }
        if(!event.data.data){ console.log("No data was specified."); self.postMessage( {mode: event.data, data: ""}, [] ); }
        let messageMode = event.data.mode;
        let messageData = event.data.data;
        let returnData = "";

        // console.log(messageMode, messageData);

        switch(messageMode){
            case "initConfigAndGraphics": { returnData = await messageFuncs.initConfigAndGraphics(messageData); break; }
            case "initLayers"           : { messageFuncs.initLayers(messageData); break; }
            case "sendGfxUpdates"       : { messageFuncs.sendGfxUpdates.run(messageData); break; }
            case "clearAllLayers"       : { messageFuncs.sendGfxUpdates.clearAllLayers(); break; }

            // DEBUG
            case "_DEBUG.drawColorPalette" : { _DEBUG.drawColorPalette(); break; }
            default: {
                console.log("WEBWORKER: Unknown mode:", messageMode);
                break; 
            }
        }

        self.postMessage( {mode: event.data.mode, data: returnData}, [] );
    }
};
