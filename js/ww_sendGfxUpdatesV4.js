messageFuncs.sendGfxUpdates.V4 = {
    CLEAR:{
        parent: null,

        // Used to clear the imgDataCache.
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

            // ***********
            // CLEAR LAYER
            // ***********

            // Clear the layer. (imgDataCache)
            let ts_clearLayer = performance.now();
            this.parent.CLEAR.oneLayerGfx(layerKey);
            ts_clearLayer = performance.now() - ts_clearLayer;

            // **************************
            // CLEAR REMOVED GRAPHICS DATA
            // ***************************

            // Clear graphics cache data mapKeys indicated by the REMOVALS_ONLY array.
            let ts_clearRemovedData = performance.now();
            this.parent.CLEAR.manyMapKeys(layerKey, layerData["REMOVALS_ONLY"]);
            ts_clearRemovedData = performance.now() - ts_clearRemovedData;

            // ******************************
            // SET THE BACKGROUND COLOR (BG1)
            // ******************************

            // Set the background color?
            let ts_setLayerBackgroundColor = performance.now();
            if(layerData.fade.fade && layerData.fade.currFade == 10){
                messageFuncs.timings["sendGfxUpdates"][layerKey]["__TOTAL"]            = + (ts_clearLayer+ts_clearRemovedData).toFixed(3);
                messageFuncs.timings["sendGfxUpdates"][layerKey]["A_clearLayer"]       = + ts_clearLayer.toFixed(3);
                messageFuncs.timings["sendGfxUpdates"][layerKey]["B_clearRemovedData"] = + ts_clearRemovedData.toFixed(3);
                messageFuncs.timings["sendGfxUpdates"][layerKey]["C_createTilemaps"]   = + 0;
                messageFuncs.timings["sendGfxUpdates"][layerKey]["D_drawFromDataCache"]= + 0;
                messageFuncs.timings["sendGfxUpdates"][layerKey]["E_drawImgDataCache"] = + 0;

                // Redraw the layer from the cache data to imgDataCache.
                let ts_drawImgDataCache = performance.now();
                this.parent.DRAW.drawImgDataCacheToCanvas(layerKey, layerData.fade);
                ts_drawImgDataCache = performance.now() - ts_drawImgDataCache;
                return;
            }
            if(layerKey == "BG1"){
                this.parent.SETBG.setLayerBgColorRgba( layerKey, [0,0,0,0], layerData.bgColorRgba );
            }
            ts_setLayerBackgroundColor = performance.now() - ts_setLayerBackgroundColor;

            // *******************************
            // CREATE/REUSE IMAGEDATA TILEMAPS
            // *******************************

            // Create or reuse ImageData tilemaps.
            let ts_createTilemaps = performance.now();
            let newMapKeys = [ ...Object.keys(layerData["CHANGES"]) ];
            let newMapData = { ...layerData["CHANGES"] };
            
            // Go through CHANGES and see if the existing ImageData tilemap can be reused (EX: Only a change to x or y.)
            // x/y changes will be updated in the graphics data cache.
            // Non-reusable keys and data will be replace newMapKeys and newMapData.
            ({newMapKeys, newMapData} = this.parent.DRAW.canImageDataTilemapBeReused(layerKey, newMapKeys, newMapData));
            
            // Create ImageData tilemaps as needed and update the graphics data cache. 
            if(newMapKeys.length){
                this.parent.DRAW.createImageDataFromTilemapsAndUpdateGraphicsCache(
                    layerKey, newMapKeys, newMapData
                );
            }
            ts_createTilemaps = performance.now() - ts_createTilemaps;
            
            // ********************
            // DRAW TO IMGDATACACHE
            // ********************

            // Redraw the imgDataCache from the graphics data cache.
            let ts_drawFromDataCache = performance.now();
            let allMapKeys = Object.keys(_GFX.currentData[layerKey].tilemaps);
            if(allMapKeys.length){
                this.parent.DRAW.drawImgDataCacheFromDataCache(layerKey, layerData.useFlicker);
            }
            ts_drawFromDataCache = performance.now() - ts_drawFromDataCache;

            // *************************************
            // DRAW TO IMGDATACACHE TO OUTPUT CANVAS
            // *************************************

            // Redraw the layer from the cache data to imgDataCache.
            let ts_drawImgDataCache = performance.now();
            this.parent.DRAW.drawImgDataCacheToCanvas(layerKey, layerData.fade);
            ts_drawImgDataCache = performance.now() - ts_drawImgDataCache;

            // Save the timings.
            messageFuncs.timings["sendGfxUpdates"][layerKey]["__TOTAL"]            = + (ts_clearLayer+ts_clearRemovedData+ts_createTilemaps+ts_drawFromDataCache+ts_drawImgDataCache).toFixed(3);
            messageFuncs.timings["sendGfxUpdates"][layerKey]["A_clearLayer"]       = + ts_clearLayer.toFixed(3);
            messageFuncs.timings["sendGfxUpdates"][layerKey]["B_clearRemovedData"] = + ts_clearRemovedData.toFixed(3);
            messageFuncs.timings["sendGfxUpdates"][layerKey]["C_createTilemaps"]   = + ts_createTilemaps.toFixed(3);
            messageFuncs.timings["sendGfxUpdates"][layerKey]["D_drawFromDataCache"]= + ts_drawFromDataCache.toFixed(3);
            messageFuncs.timings["sendGfxUpdates"][layerKey]["E_drawImgDataCache"] = + ts_drawImgDataCache.toFixed(3);
        },
    },
    DRAW: {
        parent:null,
        flickerFlag_BG1: 0,
        flickerFlag_BG2: 0,
        flickerFlag_SP1: 0,
        flickerFlag_TX1: 0,

        // Cache of all generated ImageData tilemaps. (to avoid regeneration.)
        hashCacheMap: new Map(),

        // Returns a hash for the specified string. (Variation of Dan Bernstein's djb2 hash.)
        djb2Hash: function(str) {
            if(typeof str != "string") { str = str.toString(); }
            var hash = 5381;
            for (var i = 0; i < str.length; i++) {
                hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
            }
            return hash;
        },

        //
        createImageDataFromTilemap: function(tmapObj){
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

            // Determine the fade level for this specific tilemap.
            if( settings.fade != null){ fadeLevel = settings.fade; }

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
                            // tw,                  // w
                            // th,                  // h
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

                // Handle per-tilemap fade? (by reference.)
                if(fadeLevel){
                    // Fade the tile (RGBA version of the fade table.)
                    // _GFX.utilities.replaceColors(imageData, fadeLevel); 
                    createGraphicsAssets.rgba32TileToFadedRgba32Tile(imageData, fadeLevel);
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
        
        canImageDataTilemapBeReused: function(layerKey, newMapKeys, newMapData){
            // The contents of these will determine what maps get new ImageData.
            let filtered_newMapKeys = [];
            let filtered_newMapData = {};
            let filtered_reasons = {};

            // If only x or y changed then the ImageData can be reused.
            for(let i=0, len=newMapKeys.length; i<len; i+=1){
                let newMapKey = newMapKeys[i];
                let newMap = newMapData[newMapKey];

                // If this is a new map then currentData won't have it. Add it.
                if(!_GFX.currentData[layerKey].tilemaps[newMapKey]){
                    filtered_newMapKeys.push(newMapKey);
                    filtered_newMapData[newMapKey] = newMap;
                    filtered_reasons[newMapKey] = `New tilemap`;
                    continue; 
                }
                
                let curr_map = _GFX.currentData[layerKey].tilemaps[newMapKey];
                
                let curr_tmap = JSON.stringify(Array.from(curr_map.tmap));
                let new_tmap  = JSON.stringify(Array.from(newMap.tmap));
                if(curr_tmap != new_tmap){ 
                    filtered_newMapKeys.push(newMapKey);
                    filtered_newMapData[newMapKey] = newMap;
                    filtered_reasons[newMapKey] = `Changed tmap: curr: ${curr_tmap}, new: ${new_tmap}`;
                    // console.log(filtered_reasons[newMapKey]);
                    continue; 
                }

                let curr_settings = JSON.stringify(curr_map.settings);
                let new_settings  = JSON.stringify(newMap.settings);
                if(curr_settings != new_settings){ 
                    filtered_newMapKeys.push(newMapKey);
                    filtered_newMapData[newMapKey] = newMap;
                    filtered_reasons[newMapKey] = `Changed settings: curr: ${curr_settings}, new: ${new_settings}`;
                    continue; 
                }

                let curr_w = curr_map.w;
                let new_w = newMap.w;
                if(curr_w != new_w){ 
                    filtered_newMapKeys.push(newMapKey);
                    filtered_newMapData[newMapKey] = newMap;
                    filtered_reasons[newMapKey] = `Changed w: curr: ${curr_w}, new: ${new_w}`;
                    continue; 
                }

                let curr_h = curr_map.h;
                let new_h = newMap.h;
                if(curr_h != new_h){ 
                    filtered_newMapKeys.push(newMapKey);
                    filtered_newMapData[newMapKey] = newMap;
                    filtered_reasons[newMapKey] = `Changed h: curr: ${curr_h}, new: ${new_h}`;
                    continue; 
                }

                // Save the updated data to the data cache.
                _GFX.currentData[layerKey].tilemaps[newMapKey].x = newMap.x;
                _GFX.currentData[layerKey].tilemaps[newMapKey].y = newMap.y;
                _GFX.currentData[layerKey].tilemaps[newMapKey].tmap = newMap.tmap;
                _GFX.currentData[layerKey].tilemaps[newMapKey].hash = newMap.hash;
                _GFX.currentData[layerKey].tilemaps[newMapKey].hashPrev = newMap.hashPrev;
            }

            // if(Object.keys(filtered_reasons).length){
                // console.log("REASONS:", filtered_reasons);
                // debugger;
            // }

            return {
                newMapKeys: filtered_newMapKeys,
                newMapData: filtered_newMapData,
                // reasons: filtered_reasons,
            };
        },

        //
        createImageDataFromTilemapsAndUpdateGraphicsCache: function(layerKey, mapKeys, maps){
            let mapKey;
            let map;
            let cacheHit = false; 
            let tw;
            let th;
            let hash;
            for(let i=0, len=mapKeys.length; i<len; i+=1){
                cacheHit = false;
                // Get the mapKey and the map;
                mapKey = mapKeys[i];
                map = maps[mapKey];
                
                // Get the tileWidth and tileHeight
                tw = _GFX.tilesets[ map.ts ].config.tileWidth;
                th = _GFX.tilesets[ map.ts ].config.tileHeight;

                // Create a unique hash for some of the tilemap data.
                hash = this.djb2Hash(JSON.stringify({
                    ts      : map.ts,
                    settings: JSON.stringify(map.settings),
                    tmap    : Array.from(map.tmap),
                    w: map.tmap[0] * tw,
                    h: map.tmap[1] * th,
                }));

                // Use existing ImageData cache (Map)
                if(this.hashCacheMap.has(hash)){
                    map.imgData = this.hashCacheMap.get(hash).imgData;
                    if(map.imgData && map.imgData.width){ cacheHit = true; }
                    // console.log("Cache hit: Map", cacheHit, mapKey, map);
                }

                // Create the ImageData for this tilemap since it does not exist in the cache.
                if(!cacheHit){
                    map.imgData = this.createImageDataFromTilemap( map );
                    // console.log("Generated:", mapKey, map, map.settings.fade);
                }

                // Save to hashCacheMap. (Map)
                if(!cacheHit){
                    // console.log("Saving");
                    this.hashCacheMap.set(hash, {
                        imgData : map.imgData,
                        ts      : map.ts,
                        settings: map.settings,
                        tmap    : map.tmap,
                        mapKey  : mapKey
                    });
                }

                // Save the completed data to the data cache.
                _GFX.currentData[layerKey].tilemaps[mapKey] = {
                    ...map,
                    imgData: map.imgData,
                    w: map.imgData.width, 
                    h: map.imgData.height
                }
            }
        },

        // Draw ALL tilemap ImageData from cache.
        drawImgDataCacheFromDataCache: function(layerKey, flicker=false){
            let maps    = _GFX.currentData[layerKey].tilemaps;
            let mapKeys = Object.keys(maps);

            // "Flicker"
            if(flicker){ 
                let key = "flickerFlag_" + layerKey
                if(this[key]){ mapKeys.reverse(); } 
                this[key] = ! this[key];
            }

            for(let i=0, len=mapKeys.length; i<len; i+=1){
                let mapKey = mapKeys[i];
                let map = _GFX.currentData[layerKey].tilemaps[mapKey];

                // Use blitDestTransparency.
                createGraphicsAssets.updateRegion2(
                    map.imgData.data,                      // source
                    map.imgData.width,                     // srcWidth
                    _GFX.layers[layerKey].imgDataCache.data,  // destination
                    _GFX.layers[layerKey].imgDataCache.width, // destWidth
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
            // fadeLevel (currFade) 10 is all black.
            if(fade.fade && fade.currFade == 10){
                // R,G,B is already 0. Need to set alpha to enable full black.
                for (let i = 3; i < imgDataCache.data.length; i += 4) { imgDataCache.data[i] = 255; }
            }
            // Fade the imgDataCache in it's entirety..
            else if(fade.fade){
                createGraphicsAssets.rgba32TileToFadedRgba32Tile(imgDataCache, fade.currFade);
            }

            // Use the imgDataCache to draw to the output canvas.
            _GFX.layers[layer].ctx.putImageData(imgDataCache, 0, 0);
        },
    },
    clearTimingsValues: function(layerKey, messageData){
        messageFuncs.timings["sendGfxUpdates"][layerKey]["__TOTAL"]            = 0;
        messageFuncs.timings["sendGfxUpdates"][layerKey]["B_clearRemovedData"] = 0;
        messageFuncs.timings["sendGfxUpdates"][layerKey]["C_createTilemaps"]   = 0;
        messageFuncs.timings["sendGfxUpdates"][layerKey]["D_drawFromDataCache"]= 0;
        messageFuncs.timings["sendGfxUpdates"][layerKey]["E_drawImgDataCache"] = 0;
        messageFuncs.timings["sendGfxUpdates"][layerKey]["E_drawImgDataCache"] = 0;
        messageFuncs.timings["sendGfxUpdates"].gs1        = messageData.gs1;
        messageFuncs.timings["sendGfxUpdates"].gs2        = messageData.gs2;
        messageFuncs.timings["sendGfxUpdates"].hasChanges = messageData.hasChanges;
        messageFuncs.timings["sendGfxUpdates"].version    = messageData.version;
        messageFuncs.timings["sendGfxUpdates"].ALLCLEAR   = messageData.ALLCLEAR;
        messageFuncs.timings["sendGfxUpdates"].currentgs1   = messageData.currentgs1;
    },
    run: function(messageData){
        let sendGfxUpdates = performance.now();

        // Handle the ALLCLEAR. (Clears imgDataCache and the data cache.)
        if(messageData.ALLCLEAR){
            this.CLEAR.allLayersGfx();
            this.CLEAR.allLayersData();
        }

        let layerKeys = ["BG1", "BG2", "SP1", "TX1"];
        let layerKey;
        for(let i=0, len1=layerKeys.length; i<len1; i+=1){
            // Get this layer key.
            layerKey = layerKeys[i];

            // Skip this layer key if it does not exist in the messageData.
            // if(!messageData[layerKey]){ this.clearTimingsValues(layerKey, messageData); console.log("This should not happen"); continue; }
            
            // Run the draw updater for this layer if ALLCLEAR is set or there are changes. 
            if(messageData.ALLCLEAR || messageData[layerKey].changes){
                this.UPDATE.ANYLAYER(layerKey, messageData);
            }
            else{
                this.clearTimingsValues(layerKey, messageData);
            }
        }

        sendGfxUpdates = performance.now() - sendGfxUpdates;

        // Save the timings.
        messageFuncs.timings["sendGfxUpdates"]["sendGfxUpdates"] = + sendGfxUpdates.toFixed(3);
        messageFuncs.timings["sendGfxUpdates"].gs1        = messageData.gs1;
        messageFuncs.timings["sendGfxUpdates"].gs2        = messageData.gs2;
        messageFuncs.timings["sendGfxUpdates"].hasChanges = messageData.hasChanges;
        messageFuncs.timings["sendGfxUpdates"].version    = messageData.version;
        messageFuncs.timings["sendGfxUpdates"].ALLCLEAR   = messageData.ALLCLEAR;
        messageFuncs.timings["sendGfxUpdates"].currentgs1   = messageData.currentgs1;

        // Return the timings.
        return messageFuncs.timings["sendGfxUpdates"];

        // MessageData should look like this:
        // let data2 = {
        //     version: 4,       // Version of the messageData.
        //     ALLCLEAR: false,  // Request to clear all layers and data.
        //     hasChanges: true, // At least one layer has changes.
        //     BG1:{
        //         CHANGES       : {},                              // Added or changed.
        //         REMOVALS_ONLY : [],                              // Previously existing and requiring removal
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
};
