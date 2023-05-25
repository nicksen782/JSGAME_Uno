/* 
_GFX.layers[layerKey].imgDataCache.data.set(this.fullTransparent_imgDataLayer.data); // A copy
imageDataTile                     .data.set(tileset[ tmapObj.tmap[index] ].imgData.data.slice()); // A copy
imageDataTile                     .data.set(tileset[ tmapObj.tmap[index] ].imgData.data); // Also a copy, not a reference
*/
messageFuncs.sendGfxUpdates.V4 = {
    layerKeys: [],
    CLEAR:{
        parent: null,

        // Used to clear the imgDataCache.
        fullTransparent_imgDataLayer: null,
        
        // Clears ONE layer gfx. (imgDataCache)
        oneLayerGfx: function(layerKey){
            // Clear the imgDataCache for this layer.
            _GFX.layers[layerKey].imgDataCache.data.set(this.fullTransparent_imgDataLayer.data); // A copy
        },

        // Clears ALL layers gfx. (imgDataCache)
        allLayersGfx: function(){
            let layerKeys = this.parent.layerKeys; 
            for(let i=0, len=layerKeys.length; i<len; i+=1){
                this.oneLayerGfx(layerKeys[i]);
            }
        },

        // Clears ONE layer data. (data cache)
        oneLayerData: function(layerKey){
            // Clear the cache for this layer.
            let mapKeys = Object.keys(_GFX.currentData[layerKey].tilemaps);
            this.manyMapKeys(layerKey, mapKeys, "oneLayerData");

            // If the layer is L1 then reset bgColorRgba and bgColor32bit also.
            if(layerKey == "L1"){
                _GFX.currentData[layerKey].bgColorRgba = [0,0,0,0];
                _GFX.currentData[layerKey].bgColor32bit = 0;
            }
        },

        // Clears ALL layers data. (data cache)
        allLayersData: function(){
            let layerKeys = this.parent.layerKeys; 
            for(let i=0, len=layerKeys.length; i<len; i+=1){
                this.oneLayerData(layerKeys[i]);
            }
        },

        // Deletes a specific map key in the data cache.
        oneMapKey: function(layer, mapKey){
            let map = _GFX.currentData[layer].tilemaps[mapKey];
            // let count = 0;
            
            // Was the map found? 
            if(map){
                // console.log("map found:", mapKey);
                // Keep or remove the hashCache?
                if(map.removeHashOnRemoval){
                    // console.log("    removeHashOnRemoval:", map.removeHashOnRemoval);
                    if(this.parent.DRAW.hashCacheMap.has(map.hashCacheHash)){
                        // console.log("    ", "REMOVING FROM HASHCACHE");

                        // Remove THIS entry from the hashCacheMap.
                        this.parent.DRAW.hashCacheMap.delete(map.hashCacheHash);
                        // console.log(`mapKey: ${mapKey}: Removed ACTIVE: ${map.hashCacheHash} BASE: (${map.hashCacheHash_BASE})`);
                        // count +=1;
                        
                        // Find other entries that have the same hashCacheHash_BASE and remove them as well.
                        for (let [key, value] of this.parent.DRAW.hashCacheMap.entries()) {
                            if (value.hashCacheHash_BASE === map.hashCacheHash_BASE) {
                                // console.log(`     : ${mapKey}: Removed ACTIVE: ${map.hashCacheHash} BASE: (${map.hashCacheHash_BASE})`);
                                this.parent.DRAW.hashCacheMap.delete(key);
                                // count +=1;
                            }
                        }
                        // if(count > 1){
                            // console.log(`Removed '${count}' hashCache entries for mapKey: '${mapKey}'`);
                        // }
                    }
                }
                // else{
                    // console.log("removeHashOnRemoval:", map.removeHashOnRemoval, map.mapKey);
                // }

                // Remove the data from the currentData graphics cache.
                delete _GFX.currentData[layer].tilemaps[mapKey];
            }
            // else{
                // console.log("map NOT found?", mapKey, src);
            // }
        },

        // Deletes a many specific map key in the data cache. (uses oneMapKey)
        manyMapKeys: function(layer, mapKeys=[]){
            for(let i=0, len=mapKeys.length; i<len; i+=1){
                this.oneMapKey(layer, mapKeys[i]);
            }
        },

        //
        aabb_collisionDetection: function(rect1,rect2){
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

        clearRegionsUsedByMapKeys: function(layerKey, mapKeys){
            // Go through the supplied mapKeys...
            let removedRegions = {};
            let hasRemovedRegions = false;
            // let clearImageData;
            for(let mapKey of mapKeys){
                // Get the map from the graphics cache.
                let map = _GFX.currentData[layerKey].tilemaps[mapKey]; 

                // If it was not found then skip.
                if(!map){ continue; }

                // Clear the region that was occupied by this image.
                createGraphicsAssets.clearRegion(
                    _GFX.layers[layerKey].imgDataCache.data, 
                    _GFX.layers[layerKey].imgDataCache.width,
                    map.x, map.y, map.w, map.h
                );

                // Store rectangle dimensions for the region occupied by the old map.
                removedRegions[mapKey] = { x:map.x, y:map.y, w:map.w, h:map.h };
                hasRemovedRegions = true; 
            }

            return {
                data: removedRegions,
                keys: Object.keys(removedRegions),
                hasRemovedRegions: hasRemovedRegions,
            };
        },
    },
    SETBG:{
        parent: null,

        // UNUSED
        // Convert JsAlpha (0.0 - 1.0) to Uint8 (0-255) alpha.
        convertJsAlphaToUint8Alpha: function(JsAlpha){
            return  Math.round(JsAlpha * 255);
        },

        // UNUSED
        // Convert Uint8 (0-255) alpha to JsAlpha (0.0 - 1.0).
        convertUint8AlphaToJsAlpha: function(Uint8Alpha){
            // return Number((Uint8Alpha / 255).toFixed(2));
            return ( ( (Uint8Alpha/255) * 100 ) |0 ) / 100;
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

        // Convert array having values for r,g,b,a to 32-bit rgba value.
        rgbaTo32bit: function(rgbaArray){
            // Break out the values in rgbaArray.
            let [r, g, b, a] = rgbaArray;
            
            // Generate the 32-bit version of the rgbaArray.
            // let fillColor = (a << 24) | (b << 16) | (g << 8) | r;
            let fillColor = ((a << 24) | (b << 16) | (g << 8) | r) >>> 0;
            
            // Return the result.
            return fillColor;
        },

        // Replaces the specified color pixels with the replacement bgColor.
        // Also stores the replacement colors for later use.
        setLayerBgColorRgba: function(layer, findColorArray, replaceColorArray){
            if(layer != "L1"){ 
                throw `setLayerBgColorRgba is only available for L1. You specified: ${layer}`;
            }

            // Get the 32-bit value for the [r,g,b,a] values provided.
            // let findColor_32bit    = this.rgbaTo32bit(findColorArray);
            let replaceColor_32bit = this.rgbaTo32bit(replaceColorArray);

            // If the 32-bit value is different than the stored value then update both.
            if(_GFX.currentData["L1"].bgColor32bit != replaceColor_32bit){
                _GFX.currentData["L1"].bgColorRgba  = replaceColorArray;
                _GFX.currentData["L1"].bgColor32bit = replaceColor_32bit;
            }

            // The background-color change is NOW handled by CSS in _GFX.funcs.afterDraw (main thread.)
            // // Create a Uint32Array view of the imgDataCache for this layer.
            // let uint32Data = new Uint32Array(_GFX.layers["L1"].imgDataCache.data.buffer);

            // // Find the findColor and replace with the replacementColor.
            // for (let p = 0, len = uint32Data.length; p < len; ++p) {
            //     if (uint32Data[p] === findColor_32bit) { uint32Data[p] = replaceColor_32bit; }
            // }
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
        restoreOverlapsToMapKey: function(layerKey, mapKey, regions, layerData){
            // Get the map from the current graphics cache.
            let tilemaps = _GFX.currentData[layerKey].tilemaps;
            let map = tilemaps[mapKey]; 
            
            // Get the overlapped graphic clips and write them to imgDataCache.
            for(let region of regions){
                // Create a copy of the overlapped region from the source ImageData.
                let overlappedCopy = createGraphicsAssets.copyRegion(
                    map.imgData.data,
                    map.imgData.width,
                    region.src_img.x,
                    region.src_img.y,
                    region.src_img.w,
                    region.src_img.h
                );

                // Apply existing fade.
                // createGraphicsAssets.applyFadeToImageDataArray(overlappedCopy, layerData.fade.currFade);
                createGraphicsAssets.applyFadeToImageDataArray(overlappedCopy, _GFX.currentData[layerKey].fade.currFade);
                // createGraphicsAssets.applyFadeToImageDataArray(overlappedCopy, _GFX.currentData[layerKey].fade.prevFade);

                // Write the clippedImageData to the imgDataCache.
                createGraphicsAssets.updateRegion(
                    overlappedCopy,                     // source
                    region.src_img.w,                    // srcWidth
                    _GFX.layers[layerKey].imgDataCache.data,   // destination
                    _GFX.layers[layerKey].imgDataCache.width,  // destWidth
                    _GFX.layers[layerKey].imgDataCache.height, // destHeight
                    region.dest_layer.x,                       // dx
                    region.dest_layer.y,                       // dy
                    region.dest_layer.w,                       // dw
                    region.dest_layer.h,                       // dh
                    // "onlyToAlpha0"                             // writeType ["onlyToAlpha0", "blitDest", "replace"]
                    "blitDest"                                 // writeType ["onlyToAlpha0", "blitDest", "replace"]
                    // "replace"                                  // writeType ["onlyToAlpha0", "blitDest", "replace"]
                );
            }
        },
        clear                        : function(layerKey, layerData, messageData){
            // Clear the entire layer (overwrite with transparent pixels.)
            // this.parent.CLEAR.oneLayerGfx(layerKey);

            // Determine regions to clear and anything they overlapped that still exists.
            let removedMapKeys = layerData["REMOVALS_ONLY"];
            // let changedMapKeys = [ ...Object.keys(layerData["CHANGES"]) ];
            let changedMapKeys = new Set(Object.keys(layerData["CHANGES"]));
            let removedRegions = this.parent.CLEAR.clearRegionsUsedByMapKeys(layerKey, [
                // These keys are to be removed from imgDataCache and from the graphics cache.
                ...removedMapKeys, 
                
                // These keys are to be removed from imgDataCache and redrawn when their entries for the graphics cache are updated.
                ...changedMapKeys
            ]);
            
            if(removedRegions.hasRemovedRegions){
                let tilemaps = _GFX.currentData[layerKey].tilemaps;
                let currentMapKeys = Object.keys(tilemaps);
                let overlappedRegions = {};
                let hasOverlaps = false;
                let overlap;
                let rect1;
                let rect2;
                for (let mapKey1 of removedRegions.keys) {
                    rect1 = removedRegions.data[ mapKey1 ];

                    // Changes need to be faded individually (Later in drawImgDataCacheFromDataCache.)
                    if(layerData["CHANGES"][mapKey1] && layerData.fade.currFade != null){
                        layerData["CHANGES"][mapKey1].fadeBeforeDraw = true;
                    }

                    // Go through each mapKey of the currentMapKeys...
                    for(let mapKey2 of currentMapKeys){
                        // Don't check an entry against itself.
                        if(mapKey1 == mapKey2) { continue; }

                        // Skip this map if mapKey2 is one of the changed maps.
                        // If the mapKey is a changed map then it will be redrawn in full anyway.
                        if(changedMapKeys.has(mapKey2)){ continue; }

                        // Get the map from the current graphics cache.
                        let map = tilemaps[mapKey2]; 
                        
                        // Create rectangle dimensions for the map.
                        rect2 = { x:map.x, y:map.y, w:map.w, h:map.h };

                        // Determine if this map overlaps with rect. 
                        overlap = this.parent.CLEAR.aabb_collisionDetection(rect1, rect2);

                        // If overlapped and the overlapped mapKey is not in changes...
                        if(overlap.collision){ 

                            // console.log(`'${mapKey1}' overlapped '${mapKey2}'. Region:`, overlap);//"overlap:", mapKey, overlap); 
                            if(!overlappedRegions[mapKey2]){ overlappedRegions[mapKey2] = []; }

                            overlappedRegions[mapKey2].push( {
                                src_img    : { 
                                    x: (overlap.x - map.x), w: overlap.w, 
                                    y: (overlap.y - map.y), h: overlap.h 
                                },
                                dest_layer : { 
                                    x: overlap.x, w: overlap.w, 
                                    y: overlap.y, h: overlap.h 
                                },
                            } );
                            hasOverlaps = true;
                        }
                    }
                }

                // If there are overlaps restore the overlapped regions.
                if(hasOverlaps){
                    for(let mapKey in overlappedRegions){
                        // Get the regions.
                        let regions = overlappedRegions[mapKey];
                       
                        // Replace the overlapped regions with their original data.
                        this.restoreOverlapsToMapKey(layerKey, mapKey, regions, layerData);
                    }
                }
            }
        },
        removeRemovedGraphicsData     : function(layerKey, layerData){
            // Remove the entries of REMOVALS_ONLY from _GFX.currentData[layerKey].tilemaps.
            this.parent.CLEAR.manyMapKeys(layerKey, layerData["REMOVALS_ONLY"]);
        },
        createOrReuseImageDataTilemaps: function(layerKey, layerData){
            // Create or reuse ImageData tilemaps.
            let newMapKeys = [ ...Object.keys(layerData["CHANGES"]) ];
            let newMapData = { ...layerData["CHANGES"] };
            
            // Go through CHANGES and see if the existing ImageData tilemap can be reused (EX: Only a change to x or y.)
            // x/y changes will be updated in the graphics data cache.
            // Non-reusable keys and data will be replace newMapKeys and newMapData.
            ({newMapKeys, newMapData} = this.parent.DRAW.canImageDataTilemapBeReused(layerKey, newMapKeys, newMapData));
            // ({newMapKeys, newMapData, reasons} = this.parent.DRAW.canImageDataTilemapBeReused(layerKey, newMapKeys, newMapData));
            
            // Create ImageData tilemaps as needed and update the graphics data cache. 
            if(newMapKeys.length){
                // console.log("These tilemaps were not in the graphics cache:", reasons);
                this.parent.DRAW.createImageDataFromTilemapsAndUpdateGraphicsCache(
                    layerKey, newMapKeys, newMapData
                );
            }
    
            // return { newMapKeys, newMapData };
        },
        setBackgroundColor            : function(layerKey, layerData, forceLayerRedraw){
            let canContinue = true;
            if(layerKey == "L1" && Array.isArray(layerData.bgColorRgba)){
                this.parent.SETBG.setLayerBgColorRgba( layerKey, [0,0,0,0], layerData.bgColorRgba );
                // this.parent.SETBG.setImageDataBgColorRgba( _GFX.layers[layerKey].imgDataCache, [0,0,0,0], layerData.bgColorRgba );

                // Determine the new bg color based on the fade level.
                let newColor = createGraphicsAssets.applyFadeToRgbaArray(layerData.bgColorRgba, layerData.fade.currFade);
                messageFuncs.timings["sendGfxUpdates"]["newL1_bgColor"] = newColor;
            }

            // If the global fade is 10 or 11 then.
            if(layerData.fade.fade && (layerData.fade.currFade == 10 || layerData.fade.currFade == 11)){
                // Redraw the layer from the cache data to imgDataCache.
                timeIt("E_drawImgDataCache"       , "start");
                this.parent.DRAW.drawImgDataCacheToCanvas(layerKey, layerData.fade);
                timeIt("E_drawImgDataCache"       , "stop");

                //
                if(forceLayerRedraw){ canContinue = true; }
                else                { canContinue = false; }
            }

            return { canContinue: canContinue };
        },
        drawToImgDataCache            : function(layerKey, layerData, forceLayerRedraw=false){
            let allMapKeys;
            if(forceLayerRedraw){
                allMapKeys = Object.keys(_GFX.currentData[layerKey].tilemaps);
            }
            else{
                allMapKeys = [ ...Object.keys(layerData["CHANGES"]) ];
            }
            
            if(allMapKeys.length){
                let part1=[]; // Can be flickered/resorted.
                let part2=[]; // Must NOT be flickered/resorted.
                for(let i=0, len=allMapKeys.length; i<len; i+=1){
                    let map = _GFX.currentData[layerKey].tilemaps[allMapKeys[i]];
                    if(!map.noResort){ part1.push(allMapKeys[i]); }
                    else{ part2.push(allMapKeys[i]); }
                }

                // "Flicker" via resorting of the map keys.
                if(layerData.useFlicker){
                    let key = "flickerFlag_" + layerKey
                    if(this.parent.DRAW[key]){ part1.reverse(); } 
                    this.parent.DRAW[key] = ! this.parent.DRAW[key];
                }

                // First draw the images that do not have noResort set. The map key order may have been reversed by flicker.
                if(part1.length){
                    this.parent.DRAW.drawImgDataCacheFromDataCache(layerKey, part1, layerData.CHANGES);
                }
                
                // Then draw the images that do have have noResort set.
                if(part2.length){
                    this.parent.DRAW.drawImgDataCacheFromDataCache(layerKey, part2, layerData.CHANGES);
                }
            }
        },
        drawFromImgDataCache          : function(layerKey, layerData){
            // Redraw the layer from the cache data to imgDataCache.
            this.parent.DRAW.drawImgDataCacheToCanvas(layerKey, layerData.fade);
        },

        // Does not clear the screen for any change to a layer. Instead it selectively removes and draws regions.
        ANYLAYER2: function(layerKey, messageData, forceLayerRedraw){
            timeIt(layerKey+"___TOTAL"            , "reset");
            timeIt(layerKey+"_A_clearLayer"       , "reset"); 
            timeIt(layerKey+"_B_clearRemovedData" , "reset"); 
            timeIt(layerKey+"_C_createTilemaps"   , "reset"); 
            timeIt(layerKey+"_D_drawFromDataCache", "reset"); 
            timeIt(layerKey+"_E_drawImgDataCache" , "reset"); 

            timeIt(layerKey+"___TOTAL"       , "start");

            let layerData = messageData[layerKey];
            let resp;
            
            // ***********
            // CLEAR LAYER
            // ***********

            timeIt(layerKey+"_A_clearLayer"       , "start");
            if(forceLayerRedraw){ 
                if(!messageData.ALLCLEAR){
                    // Clear the imgDataCache for this layer. 
                    this.parent.CLEAR.oneLayerGfx(layerKey); 
                    
                    // Remove all graphics cache keys for this layer.
                    // this.parent.CLEAR.manyMapKeys(layerKey, Object.keys(_GFX.currentData[layerKey].tilemaps));
                }
            }
            else                 { 
                // "Smarter clear"
                if(!messageData.ALLCLEAR){
                    this.clear(layerKey, layerData, messageData); 
                    this.parent.CLEAR.manyMapKeys(layerKey, layerData["REMOVALS_ONLY"]);
                }
            }
            timeIt(layerKey+"_A_clearLayer"       , "stop");
            
            // ***************************
            // CLEAR REMOVED GRAPHICS DATA
            // ***************************
            
            timeIt(layerKey+"_B_clearRemovedData"       , "start");
            if(!messageData.ALLCLEAR){
                this.removeRemovedGraphicsData(layerKey, layerData);
            }
            timeIt(layerKey+"_B_clearRemovedData"       , "stop");
            
            // *******************************
            // CREATE/REUSE IMAGEDATA TILEMAPS
            // *******************************
            
            timeIt(layerKey+"_C_createTilemaps"       , "start");
            this.createOrReuseImageDataTilemaps(layerKey, layerData);
            timeIt(layerKey+"_C_createTilemaps"       , "stop");
            
            // ******************************
            // SET THE BACKGROUND COLOR (L1)
            // ******************************
            
            resp = this.setBackgroundColor(layerKey, layerData, forceLayerRedraw);
            if(!resp.canContinue){ 
                timeIt(layerKey+"___TOTAL"            , "stop");
                return; 
            }
            
            // ********************
            // DRAW TO IMGDATACACHE
            // ********************
            
            timeIt(layerKey+"_D_drawFromDataCache"       , "start");
            this.drawToImgDataCache(layerKey, layerData, forceLayerRedraw);
            timeIt(layerKey+"_D_drawFromDataCache"       , "stop");
            
            // ***************************************
            // DRAW FROM IMGDATACACHE TO OUTPUT CANVAS
            // ***************************************
            
            timeIt(layerKey+"_E_drawImgDataCache"       , "start");
            this.drawFromImgDataCache(layerKey, layerData);
            timeIt(layerKey+"_E_drawImgDataCache"       , "stop");

            timeIt(layerKey+"___TOTAL"       , "stop");
        },
    },
    DRAW: {
        parent:null,
        flickerFlag_L1: 0,
        flickerFlag_L2: 0,
        flickerFlag_L3: 0,
        flickerFlag_L4: 0,

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

        // Pre-caches all assets (base assets, not including modificiations.)
        generateAllCoreImageDataAssets: async function(){
            // console.log("RUNNING: generateAllCoreImageDataAssets");

            // Pre-generate all ImageData tilemaps to cache.
            for(let tilesetKey in _GFX.tilesets){ 
                let tilemaps = {};
                let mapKeys = [];

                for(let tilemapKey in _GFX.tilesets[tilesetKey].tilemaps){ 
                    // Get the tilemap data.
                    let tilemap = _GFX.tilesets[tilesetKey].tilemaps[tilemapKey];

                    // Add the tilemapKey.
                    mapKeys.push(tilemapKey);

                    // Generate a minimal tilemap object for createImageDataFromTilemapsAndUpdateGraphicsCache.
                    tilemaps[tilemapKey] = {
                        "ts"      : tilesetKey,
                        "settings": _GFX.defaultSettings,
                        "tmap"    : tilemap,
                    };
                }

                // Create tilemaps and hashCache entries for any missing tilemaps.
                this.createImageDataFromTilemapsAndUpdateGraphicsCache("", mapKeys, tilemaps, false);
            }
        },

        // Creates ImageData from a tilemap.
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

            // Fully faded out? 
            // If the fade level is 10 then just draw the entire tilemap imageData as full black;
            if( fadeLevel == 10 ){
                // R,G,B is already 0. Need to set alpha to enable full black.
                for (let i = 3; i < imageData.data.length; i += 4) { imageData.data[i] = 255; }
            }
            // If the fade level is 11 then do nothing and leave the entire tilemap imageData as transparent.
            else if( fadeLevel == 11 ){
                // R,G,B,A is already 0. Nothing to do.
            }

            // No. Process the tilemap tile-by-tile.
            else{
                // Create the ImageData version of the tilemap.
                for(let y=0; y<mapH; y+=1){
                    for(let x=0; x<mapW; x+=1){
                        // Replace the imageDataTile.data with the tile ImageData.data specified by the tilemap.
                        try{ 
                            // imageDataTile.data.set(tileset[ tmapObj.tmap[index] ].imgData.data.slice()); // A copy then copied. 
                            imageDataTile.data.set(tileset[ tmapObj.tmap[index] ].imgData.data); // One copy.
                            missingTile = false; 
                        }
                        
                        // Missing tile. (Wrong tileset?) 
                        // Create a transparent tile and set the missingTile flag to skip any transforms from settings.
                        catch(e){ 
                            imageDataTile.data.fill(0); 
                            missingTile = true; 
                            ({width, height} = imageDataTile);
                        }
                        
                        // Apply tile transforms using rotation, xFlip, yFlip. (by reference)
                        // Skip the transforms if the tile was not found. 
                        if(!missingTile){
                            ({width, height} = this.performTransformsOnImageData(imageDataTile, settings));
                        }

                        // Update the imageData with the completed imageDataTile.
                        createGraphicsAssets.updateRegion(
                            imageDataTile.data,  // source
                            width,               // srcWidth
                            imageData.data,      // destination
                            imageData.width,     // destWidth
                            imageData.height,    // destHeight
                            x * tw,              // x
                            y * th,              // y
                            width,               // w
                            height,              // h
                            // "onlyToAlpha0"       // writeType ["onlyToAlpha0", "blitDest", "replace"]
                            // "blitDest"           // writeType ["onlyToAlpha0", "blitDest", "replace"]
                            "replace"            // writeType ["onlyToAlpha0", "blitDest", "replace"]
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
                    createGraphicsAssets.applyFadeToImageDataArray(imageData.data, fadeLevel);
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
        
        // Determine if a graphics cache object can be reused.
        canImageDataTilemapBeReused: function(layerKey, newMapKeys, newMapData){
            // The contents of these will determine what maps get new ImageData.
            let filtered_newMapKeys = [];
            let filtered_newMapData = {};
            // let filtered_reasons = {};

            // If only x or y changed then the ImageData can be reused.
            for(let i=0, len=newMapKeys.length; i<len; i+=1){
                let newMapKey = newMapKeys[i];
                let newMap = newMapData[newMapKey];

                // If this is a new map then currentData won't have it. Add it.
                if(!_GFX.currentData[layerKey].tilemaps[newMapKey]){
                    filtered_newMapKeys.push(newMapKey);
                    filtered_newMapData[newMapKey] = newMap;
                    // filtered_reasons[newMapKey] = `${newMapKey}: New tilemap`;
                    continue; 
                }
                
                let curr_map = _GFX.currentData[layerKey].tilemaps[newMapKey];
                
                let curr_tmap = JSON.stringify(Array.from(curr_map.tmap));
                let new_tmap  = JSON.stringify(Array.from(newMap.tmap));
                if(curr_tmap != new_tmap){ 
                    filtered_newMapKeys.push(newMapKey);
                    filtered_newMapData[newMapKey] = newMap;
                    // filtered_reasons[newMapKey] = `${newMapKey}: Changed tmap: curr: ${curr_tmap}, new: ${new_tmap}`;
                    continue; 
                }

                let curr_settings = JSON.stringify(curr_map.settings);
                let new_settings  = JSON.stringify(newMap.settings);
                if(curr_settings != new_settings){ 
                    filtered_newMapKeys.push(newMapKey);
                    filtered_newMapData[newMapKey] = newMap;
                    // filtered_reasons[newMapKey] = `${newMapKey}: Changed settings: curr: ${curr_settings}, new: ${new_settings}`;
                    continue; 
                }

                let curr_ts = curr_map.ts;
                let new_ts = newMap.ts;
                if(curr_ts != new_ts){ 
                    filtered_newMapKeys.push(newMapKey);
                    filtered_newMapData[newMapKey] = newMap;
                    // filtered_reasons[newMapKey] = `${newMapKey}: Changed ts: curr: ${curr_ts}, new: ${new_ts}`;
                    continue; 
                }

                // let curr_w = curr_map.w;
                // let new_w = newMap.w;
                // if(curr_w != new_w){ 
                //     filtered_newMapKeys.push(newMapKey);
                //     filtered_newMapData[newMapKey] = newMap;
                //     // filtered_reasons[newMapKey] = `${newMapKey}: Changed w: curr: ${curr_w}, new: ${new_w}`;
                //     continue; 
                // }

                // let curr_h = curr_map.h;
                // let new_h = newMap.h;
                // if(curr_h != new_h){ 
                //     filtered_newMapKeys.push(newMapKey);
                //     filtered_newMapData[newMapKey] = newMap;
                //     // filtered_reasons[newMapKey] = `${newMapKey}: Changed h: curr: ${curr_h}, new: ${new_h}`;
                //     continue; 
                // }

                // Save the updated data to the data cache.
                _GFX.currentData[layerKey].tilemaps[newMapKey].x = newMap.x;
                _GFX.currentData[layerKey].tilemaps[newMapKey].y = newMap.y;
                _GFX.currentData[layerKey].tilemaps[newMapKey].tmap = newMap.tmap;
                _GFX.currentData[layerKey].tilemaps[newMapKey].hash = newMap.hash;
                _GFX.currentData[layerKey].tilemaps[newMapKey].hashPrev = newMap.hashPrev;
            }

            // if(Object.keys(filtered_reasons).length){
            //     console.log("REASONS:", Object.keys(filtered_reasons).length, "\n", filtered_reasons);
            // }
            // if(filtered_newMapKeys.length){ console.log("filtered_newMapKeys:", filtered_newMapKeys); }

            return {
                newMapKeys: filtered_newMapKeys,
                newMapData: filtered_newMapData,
                // reasons: filtered_reasons,
            };
        },

        // Creates ImageData as needed or pulls from the hashCache. Updates graphics cache data.
        createImageDataFromTilemapsAndUpdateGraphicsCache: function(layerKey, mapKeys, maps, save=true){
            // console.log(mapKeys, maps);
            // debugger;
            let mapKey;
            let map;
            let cacheHit = false; 
            let tw;
            let th;
            let hashCacheHash;
            let hashCacheHash_BASE;
            for(let i=0, len=mapKeys.length; i<len; i+=1){
                cacheHit = false;
                // Get the mapKey and the map;
                mapKey = mapKeys[i];
                map = maps[mapKey];
                
                // Get the tileWidth and tileHeight
                tw = _GFX.tilesets[ map.ts ].config.tileWidth;
                th = _GFX.tilesets[ map.ts ].config.tileHeight;

                // Create a unique hash for some of the tilemap data.
                // hashCacheHash = this.djb2Hash(
                //     JSON.stringify({
                //         ts      : map.ts,
                //         settings: JSON.stringify(map.settings),
                //         tmap    : Array.from(map.tmap),
                //     })
                // );

                // // Create another hash but without settings. This would be the base hash of this image.
                // hashCacheHash_BASE = this.djb2Hash(
                //     JSON.stringify({
                //         ts      : map.ts,
                //         tmap    : Array.from(map.tmap),
                //     })
                // );

                // Use the supplied hashCacheHash and hashMapHash_BASE.
                hashCacheHash      = map.hashCacheHash;
                hashCacheHash_BASE = map.hashCacheHash_BASE;

                // Use existing ImageData cache (Map)
                if(this.hashCacheMap.has(hashCacheHash)){
                    // console.log("Cache hit: Map", mapKey, map);
                    // console.log("Cache hit: Map", mapKey, map, `HASH TEST: ${hashCacheHash == map.hashCacheHash}`);
                    map.imgData = this.hashCacheMap.get(hashCacheHash).imgData;
                    if(map.imgData && map.imgData.width){ cacheHit = true; }
                }

                // Hash was not found. The ImageData must be generated.
                if(!cacheHit){
                    // console.log("Not in cache Generating/Saving:", mapKey, map);

                    // Create the ImageData for this tilemap since it does not exist in the cache.
                    map.imgData = this.createImageDataFromTilemap( map );
                    
                    // Get the number of bytes for the new hashCache entry (approximate.)
                    let hashCacheDataLength = JSON.stringify({
                        imgData : map.imgData,
                        ts      : map.ts,
                        settings: map.settings,
                        tmap    : map.tmap,
                        w: map.imgData.width, 
                        h: map.imgData.height,
                        mapKey:mapKey, 
                    }).length;

                    // Save to hashCacheMap. (Map)
                    this.hashCacheMap.set(hashCacheHash, {
                        imgData : map.imgData,
                        ts      : map.ts,
                        settings: map.settings,
                        tmap    : map.tmap,
                        w       : map.imgData.width, 
                        h       : map.imgData.height,
                        mapKey             : mapKey, // First tilemap key used by this hashCacheHash.
                        hashCacheDataLength: hashCacheDataLength,
                        removeHashOnRemoval: map.removeHashOnRemoval ?? false,
                        hashCacheHash      : hashCacheHash,
                        hashCacheHash_BASE : hashCacheHash_BASE,
                    });
                }
                
                // Save the completed data to the data cache.
                // if(map.fadeBeforeDraw){ console.log("****"); }
                if(save){
                    _GFX.currentData[layerKey].tilemaps[mapKey] = {
                        ...map,
                        // imgData       : map.imgData,
                        removeHashOnRemoval: map.removeHashOnRemoval ?? false,
                        fadeBeforeDraw: map.fadeBeforeDraw ?? false,
                        hashCacheHash : hashCacheHash, // Used for future hashCache removals.
                        hashCacheHash_BASE : hashCacheHash_BASE, // Used for future hashCache removals.
                        mapKey: mapKey, // First tilemap key used by this hash.
                        // hash          : The current hash
                        // hashPrev      : The previous hash
                        // hashCacheHash : The hash for the hashCache.
                    };
                    
                    // console.log("SAVED:", _GFX.currentData[layerKey].tilemaps[mapKey]);
                }
            }
        },

        // Draw ALL tilemap ImageData from cache.
        drawImgDataCacheFromDataCache: function(layerKey, mapKeys, changes=null){
            for(let i=0, len=mapKeys.length; i<len; i+=1){
                let layer = _GFX.currentData[layerKey];
                let mapKey = mapKeys[i];
                let map = _GFX.currentData[layerKey].tilemaps[mapKey];
                let imgData;
                
                // If there is no need for fading just use use the existing ImageData.
                if( !(layer.fade.prevFade != layer.fade.currFade || map.fadeBeforeDraw) ){
                    imgData = map.imgData;
                }

                // This image requires fading. Make a copy, fade it, and draw it instead of the existing ImageData for this map.
                else{
                    // Create new "ImageData" of the map's ImageData..
                    imgData = {
                        width: map.imgData.width, 
                        height: map.imgData.height, 
                        data: createGraphicsAssets.copyRegion( 
                            map.imgData.data, 
                            map.imgData.width, 
                            0, 0, map.w, map.h
                        )
                    };
    
                    // Apply the fade to the "ImageData".
                    createGraphicsAssets.applyFadeToImageDataArray(imgData.data, layer.fade.currFade);
                }

                // Use blitDestTransparency.
                createGraphicsAssets.updateRegion(
                    imgData.data,                          // source
                    imgData.width, // imgData.width,                         // srcWidth
                    _GFX.layers[layerKey].imgDataCache.data,   // destination
                    _GFX.layers[layerKey].imgDataCache.width,  // destWidth
                    _GFX.layers[layerKey].imgDataCache.height, // destHeight
                    map.x,                                     // x
                    map.y,                                     // y
                    map.w,                                     // w
                    map.h,                                     // h
                    // "onlyToAlpha0"                             // writeType ["onlyToAlpha0", "blitDest", "replace"]
                    "blitDest"                                 // writeType ["onlyToAlpha0", "blitDest", "replace"]
                    // "replace"                                  // writeType ["onlyToAlpha0", "blitDest", "replace"]
                );
            }
        },

        // Draw the imgDataCache for a layer to the canvas layer. (Can also apply the global fade.)
        drawImgDataCacheToCanvas: function(layerKey, fade){
            // Get the imgDataCache.
            let imgDataCache = _GFX.layers[layerKey].imgDataCache;

            // Use the imgDataCache to draw to the output canvas.
            _GFX.layers[layerKey].ctx.putImageData(imgDataCache, 0, 0);
        },
    },
    clearTimingsValues: function(layerKey, messageData){
        timeIt(layerKey+"___TOTAL"            , "reset");
        timeIt(layerKey+"_A_clearLayer"       , "reset"); 
        timeIt(layerKey+"_B_clearRemovedData" , "reset"); 
        timeIt(layerKey+"_C_createTilemaps"   , "reset"); 
        timeIt(layerKey+"_D_drawFromDataCache", "reset"); 
        timeIt(layerKey+"_E_drawImgDataCache" , "reset"); 
    },
    run: function(messageData){
        timeIt("sendGfxUpdates", "reset");
        timeIt("sendGfxUpdates", "start");

        let layerKeys = this.layerKeys;
        // Handle the ALLCLEAR. (Clears imgDataCache and the data cache.)
        if(messageData.ALLCLEAR){
            this.CLEAR.allLayersGfx();  // Clears the imgDataCache for all layers.
            this.CLEAR.allLayersData(); // Clears the graphics cache for all layers and removes from hashCache if the map's flag is set. 
            // for(let i=0, len1=layerKeys.length; i<len1; i+=1){
            // }
        }
        
        
        let layerKey;
        let forceLayerRedraw;
        let fade;
        for(let i=0, len1=layerKeys.length; i<len1; i+=1){
            // Get this layer key.
            layerKey = layerKeys[i];
            fade = messageData[layerKey].fade;
            forceLayerRedraw = false; 

            // If the fade has changed then force a redraw.
            if(fade.prevFade != fade.currFade){ forceLayerRedraw = true; }

            // Update the locally stored fade for this layer.
            _GFX.currentData[layerKey].fade = fade;

            // Run the draw updater for this layer if ALLCLEAR is set or there are changes or fade changes.
            if(
                messageData.ALLCLEAR || 
                messageData[layerKey].changes ||
                forceLayerRedraw
            ){
                // this.UPDATE.ANYLAYER(layerKey, messageData);
                this.UPDATE.ANYLAYER2(layerKey, messageData, forceLayerRedraw);
            }
            else{
                this.clearTimingsValues(layerKey, messageData);
            }
        }

        timeIt("sendGfxUpdates", "stop");

        // Save the timings.
        messageFuncs.timings["sendGfxUpdates"].gs1        = messageData.gs1;
        messageFuncs.timings["sendGfxUpdates"].gs2        = messageData.gs2;
        messageFuncs.timings["sendGfxUpdates"].hasChanges = messageData.hasChanges;
        messageFuncs.timings["sendGfxUpdates"].version    = messageData.version;
        messageFuncs.timings["sendGfxUpdates"].ALLCLEAR   = messageData.ALLCLEAR;
        messageFuncs.timings["sendGfxUpdates"].hashCacheMapSize1 = messageFuncs.sendGfxUpdates.V4.DRAW.hashCacheMap.size;

        let totalSum = Array.from(messageFuncs.sendGfxUpdates.V4.DRAW.hashCacheMap.values()).reduce((acc, rec) => acc + rec.hashCacheDataLength, 0);
        messageFuncs.timings["sendGfxUpdates"]["hashCacheMapSize2"] = totalSum;
        
        // 
        // let hashCacheStats = Array.from(messageFuncs.sendGfxUpdates.V4.DRAW.hashCacheMap.values()).map(d=>{
        //     return {
        //         mapKey: d.mapKey,
        //         ts: d.ts,
        //         w: d.w, 
        //         h: d.h, 
        //         hashCacheDataLength: d.hashCacheDataLength,
        //         removeHashOnRemoval: d.removeHashOnRemoval,
        //         hashCacheHash: d.hashCacheHash,
        //     };
        // });
        let hashCacheStats = Array.from(messageFuncs.sendGfxUpdates.V4.DRAW.hashCacheMap.values()).map(d=>{
            return {
                mapKey: d.mapKey,
                ts: d.ts,
                w: d.w, 
                h: d.h, 
                hashCacheDataLength: d.hashCacheDataLength,
                removeHashOnRemoval: d.removeHashOnRemoval,
                hashCacheHash: d.hashCacheHash,
            };
        }).sort((a, b) => a.mapKey.localeCompare(b.mapKey));

        messageFuncs.timings["sendGfxUpdates"]["hashCacheStats"] = hashCacheStats;
        messageFuncs.timings["sendGfxUpdates"].ALLTIMINGS = timeIt("", "getAll");
        messageFuncs.timings["sendGfxUpdates"]["sendGfxUpdates"] = + timeIt("sendGfxUpdates", "get").toFixed(3);

        // DEBUG: TIMINGS
        // let tmp = messageFuncs.timings["sendGfxUpdates"].ALLTIMINGS;
        // let l1ChangesCount = Object.keys(messageData.L1.CHANGES).length + (messageData.L1.REMOVALS_ONLY.length)
        // console.log(
        //     `A_clearLayer: gs1: ${messageData.gs1}: changes/removals: ${l1ChangesCount}:` +
        //     `    part1: ${ (tmp["L1_A_clearLayer_part1"] ?? 0) .toFixed(1).padStart(4, " ")}, ` +
        //     `    part2: ${ (tmp["L1_A_clearLayer_part2"] ?? 0) .toFixed(1).padStart(4, " ")}, ` +
        //     `    part3: ${ (tmp["L1_A_clearLayer_part3"] ?? 0) .toFixed(1).padStart(4, " ")}, ` +
        //     // `    part4: ${ (data.ALLTIMINGS["L1_A_clearLayer_part4"] ?? 0) .toFixed(1).padStart(4, " ")}  ` +
        //     `` 
        // );

        // Return the timings.
        return messageFuncs.timings["sendGfxUpdates"];

        // MessageData should look something like this:
        /*
        messageData = {
            ALLCLEAR: false,  // Request to clear all layers and data.
            version: 4,       // Version of the messageData.
            hasChanges: true, // At least one layer has changes.
            gs1       : "gs_JSG", 
            gs2       : "", 
            L1:{
                // Added or changed.
                CHANGES       : {
                    "board_28x28": {
                        "hash": 528763009, "hashPrev": 528763009,
                        "ts": "bg_tiles", "tmap": [],
                        "x": 8, "y": 8, "w": 224, "h": 224,
                        "settings": {
                            "fade": null, "xFlip": false, "yFlip": false, "rotation": 0,
                            "colorData": [],
                            "bgColorRgba": [ 128, 128, 0, 255 ]
                        }
                    }
                },
                REMOVALS_ONLY : ["p1_card_0"],                   // Previously existing and requiring removal.
                fade       : _GFX.currentData["L1"].fade,       // Fade for this layer.
                changes    : _GFX.currentData["L1"].changes,    // If this layer has changes
                bgColorRgba: _GFX.currentData["L1"].bgColorRgba // Background-color for the layer.
            }
            // <OTHER LAYERS> NOTE: Only L1 has bgColorRgba.
        };
        */
    },
    init: async function(){
        // layerKeys
        this.layerKeys = Object.keys(_GFX.layers);

        // CLEAR
        this.CLEAR.parent = this;
        let {width, height} = _GFX.layers["L1"].imgDataCache;
        this.CLEAR.fullTransparent_imgDataLayer = new ImageData(width, height);
        
        // DRAW
        this.DRAW.parent = this;
        
        // SETBG
        this.SETBG.parent = this;
        
        // UPDATE
        this.UPDATE.parent = this;

    }
};
