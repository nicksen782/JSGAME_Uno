/*
*/

messageFuncs.sendGfxUpdates.V4 = {
    layerKeys: [],
    CLEAR:{
        parent: null,

        // Clears ONE layer gfx. (imgDataCache)
        oneLayerGfx: function(layerKey){
            // Clear the imgDataCache for this layer.
            _GFX.layers[layerKey].imgDataCache.data.fill(0);
        },

        // Clears ALL layers gfx. (imgDataCache)
        allLayersGfx: function(){
            let layerKeys = this.parent.layerKeys; 
            for(let i=0, len=layerKeys.length; i<len; i+=1){
                this.oneLayerGfx(layerKeys[i]);
            }
        },

        // Clears ONE layer data. (graphics cache)
        oneLayerData: function(layerKey){
            // Clear the graphics cache for this layer.
            let mapKeys = Object.keys(_GFX.currentData[layerKey].tilemaps);
            this.manyMapKeys(layerKey, mapKeys, "oneLayerData");

            // If the layer is L1 then reset bgColorRgba and bgColor32bit also.
            if(layerKey == "L1"){
                _GFX.currentData[layerKey].bgColorRgba = [0,0,0,0];
                _GFX.currentData[layerKey].bgColor32bit = 0;
            }
        },

        // Clears ALL layers data. (graphics cache)
        allLayersData: function(){
            let layerKeys = this.parent.layerKeys; 
            for(let i=0, len=layerKeys.length; i<len; i+=1){
                this.oneLayerData(layerKeys[i]);
            }
        },

        // Deletes a specific map key in the data cache and also removes from the hashCacheMap if the removeHashOnRemoval flag is set.
        oneMapKey: function(layer, mapKey){
            // Get a handle the map in the graphics cache.
            let map = _GFX.currentData[layer].tilemaps[mapKey];
            let hashCacheHash_BASE;
            let hashCacheMap = this.parent.DRAW.hashCacheMap;
            
            // removeHashOnRemoval
            // Was the map found? 
            if(map){
                // Get the hashCacheHash_BASE for this tilemap.
                hashCacheHash_BASE = map.hashCacheHash_BASE;
                if(!hashCacheHash_BASE){ throw `oneMapKey: Missing hashCacheHash_BASE`; }

                // Look through hashCacheMap for entries that have the same hashCacheHash_BASE.
                for (let [key, value] of hashCacheMap.entries()) {
                    // If the value's removeHashOnRemoval flag is set and hashCacheHash_BASE matches the map's hashCacheHash_BASE...
                    if (value.removeHashOnRemoval && value.hashCacheHash_BASE === map.hashCacheHash_BASE) {
                        // Remove the value.
                        hashCacheMap.delete(key);
                    }
                }

                // Remove the data from the currentData graphics cache.
                delete _GFX.currentData[layer].tilemaps[mapKey];
            }
        },

        // Deletes a many specific map key in the data cache. (uses oneMapKey)
        manyMapKeys: function(layer, mapKeys=[]){
            for(let i=0, len=mapKeys.length; i<len; i+=1){
                this.oneMapKey(layer, mapKeys[i]);
            }
        },

        // Used by UPDATE.clear to determine if images overlap and where.
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

        getRegionsUsedByMapKeys: function(layerKey, mapKeys){
            // Go through the supplied mapKeys...
            let removedRegions = {};
            let hasRemovedRegions = false;
            
            for(let mapKey of mapKeys){
                // Get the map from the graphics cache.
                let map = _GFX.currentData[layerKey].tilemaps[mapKey]; 
    
                // If it was not found then skip.
                if(!map){ continue; }
    
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

        clearRegionsUsedByMapKeys: function(layerKey, toClear){
            // Go through the supplied mapKeys...
            let rec;
            for(let recKey in toClear){
                // Get the object.
                rec = toClear[recKey];

                // Clear the region that was occupied by this image.
                createGraphicsAssets.clearRegion(
                    _GFX.layers[layerKey].imgDataCache.data, 
                    _GFX.layers[layerKey].imgDataCache.width,
                    rec.x, rec.y, rec.w, rec.h
                );
            }
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

        
        // The background-color change is NOW handled by CSS in _GFX.funcs.afterDraw (main thread.)
        // Also stores the replacement colors for later use.
        setLayerBgColorRgba: function(layer, findColorArray, replaceColorArray){
            if(layer != "L1"){ 
                throw `setLayerBgColorRgba is only available for L1. You specified: ${layer}`;
            }

            // Get the 32-bit value for the [r,g,b,a] values provided.
            let replaceColor_32bit = this.rgbaTo32bit(replaceColorArray);

            // If the 32-bit value is different than the stored value then update both.
            if(_GFX.currentData["L1"].bgColor32bit != replaceColor_32bit){
                _GFX.currentData["L1"].bgColorRgba  = replaceColorArray;
                _GFX.currentData["L1"].bgColor32bit = replaceColor_32bit;
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

        // Restores removed regions with replacement partial images. Will apply fade if needed.
        restoreOverlapsToMapKey: function(layerKey, regions){
            // Get the map from the current graphics cache.
            let imgDataCache = _GFX.layers[layerKey].imgDataCache;
            let region;

            // Get the overlapped graphic clips and write them to imgDataCache.
            let firstRegion = true;
            for(let regionKey in regions){
                region = regions[regionKey];

                for(let rec of region){
                    // Create a copy of the overlapped region from the source ImageData.
                    let overlappedCopy = createGraphicsAssets.copyRegion(
                        rec.src_img.imgData.data,
                        rec.src_img.imgData.width,
                        rec.src_img.x, rec.src_img.y,
                        rec.src_img.w, rec.src_img.h
                    );
    
                    // Apply existing fade to the overlappedCopy.
                    createGraphicsAssets.applyFadeToImageDataArray(overlappedCopy, _GFX.currentData[layerKey].fade.currFade);
    
                    // Determine which updateRegion to use. 
                    let funcName = (firstRegion || !rec.src_img.hasTransparency) ? "updateRegion_replace" : "updateRegion_blit";
                    
                    // if((firstRegion || !rec.src_img.hasTransparency)){ console.log("REPLACE:", regionKey, "firstRegion:", firstRegion, "hasTransparency:", rec.src_img.hasTransparency); }
                    // else                                             { console.log("BLIT   :", regionKey, "firstRegion:", firstRegion, "hasTransparency:", rec.src_img.hasTransparency); }

                    // Write the overlappedCopy to the imgDataCache.
                    createGraphicsAssets[funcName](
                        overlappedCopy,      // source
                        rec.src_img.w,    // srcWidth
                        imgDataCache.data,   // destination
                        imgDataCache.width,  // destWidth
                        imgDataCache.height, // destHeight
                        rec.dest_layer.x, // dx
                        rec.dest_layer.y, // dy
                        rec.dest_layer.w, // dw
                        rec.dest_layer.h, // dh
                    );

                    // Unset firstRegion flag.
                    firstRegion = false;
                }

            }
        },

        // Clears the regions occupied by removed and changed maps.
        // Then restores the overlapped regions with original source data and will fade if needed.
        clear                        : function(layerKey, layerData, messageData){
            // Determine regions to clear and anything they overlapped that still exists.
            let overlappedRegions = {};
            let hasOverlaps = false;
            let removedMapKeys = layerData["REMOVALS_ONLY"];
            let changedMapKeys = new Set(Object.keys(layerData["CHANGES"]));
            let toClear = [
                // These keys are to be removed from imgDataCache and from the graphics cache.
                ...removedMapKeys, 
                
                // These keys are to be removed from imgDataCache and redrawn when their entries for the graphics cache are updated.
                ...changedMapKeys
            ];
            let removedRegions = this.parent.CLEAR.getRegionsUsedByMapKeys(layerKey, toClear);
            // let removedRegions = this.parent.CLEAR.clearRegionsUsedByMapKeys(layerKey, toClear);
            
            if(removedRegions.hasRemovedRegions){
                let tilemaps = _GFX.currentData[layerKey].tilemaps;
                let currentMapKeys = Object.keys(tilemaps);
                let overlap;
                let rect1;
                let rect2;
                for (let mapKey1 of removedRegions.keys) {
                    // Create rectangle dimensions for the map.
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
                            // Create the key if it doesn't exist yet. 
                            if(!overlappedRegions[mapKey2]){ overlappedRegions[mapKey2] = []; }

                            // Add the data for the overlap. 
                            // NOTE: src_img is the coords within the source. dest_layer is the coords for the output layer.
                            overlappedRegions[mapKey2].push( {
                                src_img    : { 
                                    x: (overlap.x - map.x), w: overlap.w, 
                                    y: (overlap.y - map.y), h: overlap.h,
                                    imgData: map.imgData,
                                    hasTransparency: map.hasTransparency
                                },
                                dest_layer : { 
                                    x: overlap.x, w: overlap.w, 
                                    y: overlap.y, h: overlap.h 
                                },
                            } );

                            // Set the hasOverlaps flag.
                            hasOverlaps = true;
                        }
                    }
                }
            }

            return {
                overlappedRegions : hasOverlaps ? overlappedRegions : false,
                toClear: removedRegions.hasRemovedRegions ? removedRegions.data : false,
            }
        },

        // Remove the REMOVALS_ONLY maps from the graphics cache and if applicable the hashCacheMap also.
        removeRemovedGraphicsData     : function(layerKey, layerData){
            // Remove the entries of REMOVALS_ONLY from _GFX.currentData[layerKey].tilemaps.
            this.parent.CLEAR.manyMapKeys(layerKey, layerData["REMOVALS_ONLY"]);
        },

        // Creates or reuse ImageData tilemaps.
        createOrReuseImageDataTilemaps: function(layerKey, layerData){
            // Get the mapKeys for the changes.
            let newMapKeys = [ ...Object.keys(layerData["CHANGES"]) ];

            // Get the maps for the changes.
            let newMapData = { ...layerData["CHANGES"] };
            
            // Go through CHANGES and see if the existing ImageData tilemap can be reused (EX: Only a change to x or y.)
            // x/y changes will be updated in the graphics data cache.
            // Non-reusable keys and data will be replace newMapKeys and newMapData.
            ({newMapKeys, newMapData} = this.parent.DRAW.canImageDataTilemapBeReused(layerKey, newMapKeys, newMapData));
            
            // Create ImageData tilemaps as needed and update the graphics data cache. 
            if(newMapKeys.length){
                this.parent.DRAW.createImageDataFromTilemapsAndUpdateGraphicsCache(
                    layerKey, newMapKeys, newMapData, true
                );
            }
        },
        
        // Sets the background color of L1 if a bgColorRgba is set for it.
        setBackgroundColor            : function(layerKey, layerData, forceLayerRedraw){
            let canContinue = true;
            if(layerKey == "L1" && Array.isArray(layerData.bgColorRgba)){
                this.parent.SETBG.setLayerBgColorRgba( layerKey, [0,0,0,0], layerData.bgColorRgba );

                // Determine the new bg color based on the fade level.
                let newColor = createGraphicsAssets.applyFadeToRgbaArray(layerData.bgColorRgba, layerData.fade.currFade);
                messageFuncs.timings["sendGfxUpdates"]["newL1_bgColor"] = newColor;
            }

            // If the global fade is 10 or 11 then.
            if(layerData.fade.fade && (layerData.fade.currFade == 10 || layerData.fade.currFade == 11)){
                if(forceLayerRedraw){ canContinue = true; }
                else                { 
                    // Redraw the layer from the cache data to imgDataCache.
                    timeIt("E_drawImgDataCache"       , "start");
                    this.parent.DRAW.drawImgDataCacheToCanvas(layerKey);
                    timeIt("E_drawImgDataCache"       , "stop");
                    canContinue = false; 
                }
            }

            // Return the canContinue flag.
            return canContinue;
        },

        // Updates the imgDataCache for the layer. 
        drawToImgDataCache            : function(layerKey, layerData, forceLayerRedraw=false, toClear, overlappedRegions){
            let allMapKeys;

            // If this is a forcedLayerRedraw then use ALL mapKeys. 
            if(forceLayerRedraw){
                allMapKeys = Object.keys(_GFX.currentData[layerKey].tilemaps);
            }

            // Otherwise use only the CHANGES keys. 
            else{
                allMapKeys = [ ...Object.keys(layerData["CHANGES"]) ];
            }
            
            let part1=[]; // Can be flickered/resorted.
            let part2=[]; // Must NOT be flickered/resorted.

            // If there are mapKeys in allMapKeys...
            if(allMapKeys.length){
                // Separate the allMapKeys into flicker/non-flicker.
                for(let i=0, len=allMapKeys.length; i<len; i+=1){
                    // Get a handle to the map. 
                    let map = _GFX.currentData[layerKey].tilemaps[allMapKeys[i]];

                    // If the noResort flag is set then push to the flicker array.
                    if(!map.noResort){ part1.push(allMapKeys[i]); }
                    
                    //Otherwise, add to the non-flicker array.
                    else             { part2.push(allMapKeys[i]); }
                }

                // "Flicker" via resorting of the map keys.
                if(layerData.useFlicker){
                    // Generate the flickerFlag key.
                    let key = "flickerFlag_" + layerKey

                    // If the flickerFlag key is set then reverse the order of the keys in the flicker array.
                    if(this.parent.DRAW[key]){ part1.reverse(); } 

                    // Toggle the flag.
                    this.parent.DRAW[key] = ! this.parent.DRAW[key];
                }
            }

            // STEP 1: Clear the toClear regions.
            if(toClear){
                this.parent.CLEAR.clearRegionsUsedByMapKeys(layerKey, toClear);
            }

            // STEP 2: Draw the overlaps second.
            if(overlappedRegions){
                // Replace the overlapped regions with their original data.
                this.restoreOverlapsToMapKey(layerKey, overlappedRegions);
            }

            // STEP 3: Draw the images that do not have noResort set.
            // The map key order may have been reversed by flicker.
            if(part1.length){
                this.parent.DRAW.drawImgDataCacheFromDataCache(layerKey, part1);
            }
            
            // STEP 4: Draw the images that do have have noResort set.
            // Drawn in the order that they were added.
            if(part2.length){
                this.parent.DRAW.drawImgDataCacheFromDataCache(layerKey, part2);
            }
        },
        
        // Redraws the layer from the cache data to imgDataCache.
        drawFromImgDataCache          : function(layerKey){
            // Redraw the layer from the cache data to imgDataCache.
            this.parent.DRAW.drawImgDataCacheToCanvas(layerKey);
        },

        // Does not always clear the screen for changes to a layer.
        // Instead it can selectively remove and draw regions.
        ANYLAYER2: function(layerKey, messageData, forceLayerRedraw){
            timeIt(layerKey+"___TOTAL"            , "reset");
            timeIt(layerKey+"_A_clearLayer"       , "reset"); 
            timeIt(layerKey+"_B_clearRemovedData" , "reset"); 
            timeIt(layerKey+"_C_createTilemaps"   , "reset"); 
            timeIt(layerKey+"_D_drawFromDataCache", "reset"); 
            timeIt(layerKey+"_E_drawImgDataCache" , "reset"); 

            timeIt(layerKey+"___TOTAL"       , "start");

            let layerData = messageData[layerKey];
            let overlappedRegions;
            let toClear;
            let canContinue;
            
            // ***********
            // CLEAR LAYER
            // ***********

            timeIt(layerKey+"_A_clearLayer"       , "start");
            if(forceLayerRedraw){ 
                if(!messageData.ALLCLEAR){
                    // Clear the imgDataCache for this layer if the fade is ON.
                    if(layerData.fade.currFade != null){
                        // Clear the imgDataCache for this layer. 
                        this.parent.CLEAR.oneLayerGfx(layerKey); 
                    }
                }
            }
            else                 { 
                // "Smarter clear"
                if(!messageData.ALLCLEAR){
                    ({overlappedRegions, toClear} = this.clear(layerKey, layerData, messageData));
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
            
            canContinue = this.setBackgroundColor(layerKey, layerData, forceLayerRedraw);
            if(!canContinue){ 
                timeIt(layerKey+"___TOTAL"            , "stop");
                return; 
            }
            
            // ********************
            // DRAW TO IMGDATACACHE
            // ********************
            
            timeIt(layerKey+"_D_drawFromDataCache"       , "start");
            this.drawToImgDataCache(layerKey, layerData, forceLayerRedraw, toClear, overlappedRegions);
            timeIt(layerKey+"_D_drawFromDataCache"       , "stop");
            
            // ***************************************
            // DRAW FROM IMGDATACACHE TO OUTPUT CANVAS
            // ***************************************
            
            timeIt(layerKey+"_E_drawImgDataCache"       , "start");
            this.drawFromImgDataCache(layerKey);
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

        // Pre-caches all assets and sets removeHashOnRemoval for each to false (base assets, does not include future.)
        generateCoreImageDataAssets: async function(list){
            // console.log("RUNNING: generateCoreImageDataAssets");
            let hashCacheHash;
            let hashCacheHash_BASE;
            let tilemap;
            let settings;

            // Pre-generate all ImageData tilemaps to cache?
            if(!list){
                console.log("generateCoreImageDataAssets: A list was NOT provided.. Generating a list for ALL tilemaps.");
                list = {};
                for(let tilesetKey in _GFX.tilesets){
                    if(!list[tilesetKey]){ 
                        list[tilesetKey] = {
                            mapObjs  : {},
                            mapKeys  : [],
                            mapsArray: [],
                        }
                    }

                    for(let tilemapKey in _GFX.tilesets[tilesetKey].tilemaps){ 
                        list[tilesetKey].mapKeys.push(tilemapKey);

                        tilemap = _GFX.tilesets[tilesetKey].tilemaps[tilemapKey];

                        list[tilesetKey].mapsArray.push( {
                            "mapKey"             : tilemapKey,
                            "baseMapKey"         : tilemapKey,
                            "ts"                 : tilesetKey,
                            "tmap"               : tilemap,
                            "removeHashOnRemoval": false,
                            "hashCacheHash"      : null, // hashCacheHash ,
                            "hashCacheHash_BASE" : null, // hashCacheHash_BASE 
                            // "settings"           : null, // _GFX.defaultSettings,
                        } );
                    }
                }
            }
            else{
                console.log("generateCoreImageDataAssets: A list WAS specified.");
            }
            
            // Use the list to create the tilemap data.
            for(let tilesetKey in list){ 
                for(let rec of list[tilesetKey].mapsArray){ 
                    // Does this entry have tilemapKey?
                    if(!rec.mapKey){ 
                        console.log(`generateCoreImageDataAssets: Error. Missing mapKey:`, rec);
                        throw `generateCoreImageDataAssets: Error. Missing mapKey.`; 
                    }
                    
                    // Does this entry have tmap?
                    if(!rec.tmap){
                        // console.log("missing tmap. using default.", rec.baseMapKey, rec.mapKey);
                        if(!rec.baseMapKey){
                            console.log(`generateCoreImageDataAssets: Error. Missing baseMapKey:`, rec);
                            throw `generateCoreImageDataAssets: Error. Missing baseMapKey.`; 
                        }
                        rec.tmap = _GFX.tilesets[rec.ts].tilemaps[rec.baseMapKey];
                    }

                    //  Make sure that all settings keys exist and at least have their default values.
                    rec.settings = Object.assign({}, _GFX.defaultSettings, rec.settings ?? {});

                    // Generate hashCacheHash.
                    hashCacheHash      = this.djb2Hash( JSON.stringify(
                        {
                            ts      : rec.ts,
                            settings: JSON.stringify(rec.settings),
                            tmap    : Array.from(rec.tmap),
                        }
                    ));

                    // Generate hashCacheHash_BASE.
                    hashCacheHash_BASE = this.djb2Hash( JSON.stringify(
                        {
                            ts      : rec.ts,
                            settings: JSON.stringify(_GFX.defaultSettings),
                            tmap    : Array.from(rec.tmap),
                        }
                    ));

                    // Add the remaining keys. 
                    rec.hashCacheHash      = hashCacheHash;
                    rec.hashCacheHash_BASE = hashCacheHash_BASE;

                    list[rec.ts].mapObjs[rec.mapKey] = rec;
                }
            }

            // // Use the list to pre-generate ImageData tilemaps to cache.
            for(let tilesetKey in list){ 
                // Create tilemaps and hashCache entries for any missing tilemaps.
                // console.log(list, " *** ", list[tilesetKey].mapKeys, list[tilesetKey].mapObjs);
                this.createImageDataFromTilemapsAndUpdateGraphicsCache("", list[tilesetKey].mapKeys, list[tilesetKey].mapObjs, false);
            }

        },

        findRelatedMapKey: function(ts, tmap){
            let tmap_same;
            let tmap2;
            for(let mapKey in _GFX.tilesets[ts].tilemaps){
                tmap2 = _GFX.tilesets[ts].tilemaps[mapKey];
                tmap_same = _GFX.utilities.areArraysEqual(tmap, tmap2);
                if(tmap_same){ return mapKey; };
            }
            return "";
        },

        // Creates ImageData from a tilemap.
        createImageDataFromTilemap: function(tmapObj){
            // NOTE: imageData here is an object that looks like ImageData but is not.
            // This is because the width and height properties of ImageData are read-only.
            // However, considering rotations, these may need to be changed.
            // There does not appear to be a drawback to doing it this way.

            // Check if the base image for this tilemap exists.
            let useCachedBase = false;

            // Get the tileset and the dimensions for the tileset. 
            let tw      = _GFX.tilesets[ tmapObj.ts ].config.tileWidth;
            let th      = _GFX.tilesets[ tmapObj.ts ].config.tileHeight;
            let settings  = tmapObj.settings;

            // Get the dimensions of the tilemap.
            let mapW = tmapObj.tmap[0];
            let mapH = tmapObj.tmap[1];
            
            // Start at index 2 since the first two indexs are the map dimensions in tiles. 
            let hasTransparency = false;

            // Create new ImageData for the tilemap.
            let imageData;
            let base;
            if(this.hashCacheMap.has(tmapObj.hashCacheHash_BASE)){
                // The width and height come from the tilemap and should be correct.
                useCachedBase   = true;
                // imageData       = new ImageData(mapW * tw, mapH * th); 
                // imageData = new ImageData(
                //     (settings.rotation % 180 === 0) ? (mapW * tw) : (mapH * th),
                //     (settings.rotation % 180 === 0) ? (mapH * th) : (mapW * tw)
                // ); 
                imageData = {
                    width : mapW * tw,
                    height: mapH * th,
                    data : new Uint8ClampedArray(
                        (mapW * tw) * (mapH * th) * 4
                    )
                }; 
                base            = this.hashCacheMap.get(tmapObj.hashCacheHash_BASE);
                hasTransparency = (base.hasTransparency || base.isFullyTransparent);
                try{
                    imageData.data.set( base.imgData.data );
                }
                catch(e){
                    console.log("opps!");
                    debugger;
                }
            }
            else{
                // The width and height come from the tilemap and should be correct.
                // imageData = new ImageData(mapW * tw, mapH * th); 
                // imageData = new ImageData(
                //     (settings.rotation % 180 === 0) ? (mapW * tw) : (mapH * th),
                //     (settings.rotation % 180 === 0) ? (mapH * th) : (mapW * tw)
                // ); 
                imageData = {
                    width : mapW * tw,
                    height: mapH * th,
                    data : new Uint8ClampedArray(
                        (mapW * tw) * (mapH * th) * 4
                    )
                }; 
            }

            // Break-out settings.
            let fadeLevel = null;

            // Determine the fade level for this specific tilemap.
            if( settings.fade != null){ fadeLevel = settings.fade; }

            // Fully faded out? 
            // If the fade level is 10 then just draw the entire tilemap imageData as full black;
            if( fadeLevel == 10 ){
                // R,G,B is already 0. Need to set alpha to enable full black.
                for (let i = 3; i < imageData.data.length; i += 4) { imageData.data[i] = 255; }
                hasTransparency = false;
            }

            // If the fade level is 11 then do nothing and leave the entire tilemap imageData as transparent.
            else if( fadeLevel == 11 ){
                hasTransparency = true;
                // R,G,B,A is already 0. Nothing to do.
            }

            // No. Create the image.
            else{
                let tileset = _GFX.tilesets[ tmapObj.ts ].tileset;
                let width  = tw;
                let height = th;
                let index=2;
                let missingTile = false;
                let tile; 

                // If not using a cached base image then the image must be generated tile-by-tile.
                if(!useCachedBase){
                    // console.log("    generating:", tmapObj.mapKey);

                    // Create the ImageData version of the tilemap.
                    for(let y=0; y<mapH; y+=1){
                        for(let x=0; x<mapW; x+=1){
                            // Determine if this tile is missing.
                            missingTile = !tileset.hasOwnProperty(tmapObj.tmap[index]) ;

                            // Update the imageData with the completed imageDataTile.
                            if(!missingTile){
                                // Get the tile object.
                                tile = tileset[ tmapObj.tmap[index] ];

                                // Determine if the tile has transparency (returned later.)
                                hasTransparency = hasTransparency || (tile.hasTransparency || tile.isFullyTransparent);

                                // Adjust width and height if there is a rotation that would require the change.
                                width  = (settings.rotation % 180 === 0) ? width : height;
                                height = (settings.rotation % 180 === 0) ? height : width;

                                // ALWAYS REPLACE. THIS IS A NEW IMAGE.
                                let funcName = "updateRegion_replace";

                                // Write the tile to the imageData.
                                createGraphicsAssets[funcName](
                                    tile.imgData.data,   // source
                                    width,               // srcWidth
                                    imageData.data,      // destination
                                    imageData.width,     // destWidth
                                    imageData.height,    // destHeight
                                    x * tw,              // x
                                    y * th,              // y
                                    width,               // w
                                    height,              // h
                                    "replace"            // writeType ["blitDest", "replace"]
                                );
                            }

                            // Increment the tile index in the tilemap.
                            index++;
                        }
                    }
                }
                // else{
                    // console.log("Not generating:", tmapObj.mapKey);
                // }

                // TODO: This distorts non-square images.
                // Apply image transforms using rotation, xFlip, yFlip, color replacements, bgColorRgba, fade. (by reference)
                ( {width: imageData.width, height: imageData.height} = this.performTransformsOnImageData(imageData, settings));
                // this.performTransformsOnImageData(imageData, settings);
            }

            // Return the completed ImageData version of the tilemap.
            return {
                imageData      : imageData,
                hasTransparency: hasTransparency,
            }
        },

        // Transforms using rotation, xFlip, yFlip (no recoloring.) (By reference.)
        performTransformsOnImageData: function(imageData, settings){
            let width  = imageData.width;
            let height = imageData.height;

            // Handle xFlip.
            if(settings.xFlip)           { _GFX.utilities.flipImageDataHorizontally(imageData); }
            
            // Handle yFlip.
            if(settings.yFlip)           { _GFX.utilities.flipImageDataVertically(imageData); }
            
            // Handle color replacements. (by reference.)
            if(settings.colorData.length){ _GFX.utilities.replaceColors(imageData, settings.colorData); }

            // Handle adding a background?  (by reference.)
            if(settings.bgColorRgba){
                this.parent.SETBG.setImageDataBgColorRgba(imageData, [0,0,0,0], settings.bgColorRgba);
            }

            // Handle per image fades (by reference.)
            if(settings.fade != null){
                createGraphicsAssets.applyFadeToImageDataArray(imageData.data, fadeLevel);
            }

            // Handle rotation (Uses temp copy up updates the ImageData by reference.)
            // NOTE: If a tilemap is NOT a square then the tilemap will have swapped new width and height values.
            if(settings.rotation)        { ({width, height} = _GFX.utilities.rotateImageData(imageData, settings.rotation)); }

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
                let curr_map = _GFX.currentData[layerKey].tilemaps[newMapKey];

                // If this is a new map then currentData won't have it. Add it.
                if(!_GFX.currentData[layerKey].tilemaps[newMapKey]){
                    filtered_newMapKeys.push(newMapKey);
                    filtered_newMapData[newMapKey] = newMap;
                    // filtered_reasons[newMapKey] = `${newMapKey}: New tilemap`;
                    continue; 
                }
                
                let settings_same = _GFX.utilities.areSettingsObjectsEqual(curr_map.settings, newMap.settings);
                if(!settings_same){ 
                    filtered_newMapKeys.push(newMapKey);
                    filtered_newMapData[newMapKey] = newMap;
                    // console.log(`${newMapKey}: Changed settings: curr: ${JSON.stringify(curr_map.settings)}, new: ${JSON.stringify(newMap.settings)}`)
                    // filtered_reasons[newMapKey] = `${newMapKey}: Changed settings: curr: ${JSON.stringify(curr_map.settings)}, new: ${JSON.stringify(newMap.settings)}`;
                    continue; 
                }

                let tmap_same = _GFX.utilities.areArraysEqual(curr_map.tmap, newMap.tmap);
                if(!tmap_same){ 
                    filtered_newMapKeys.push(newMapKey);
                    filtered_newMapData[newMapKey] = newMap;
                    // console.log(`${newMapKey}: Changed tmap: curr: ${curr_map.tmap}, new: ${newMap.tmap}`);
                    // filtered_reasons[newMapKey] = `${newMapKey}: Changed tmap: curr: ${curr_map.tmap}, new: ${newMap.tmap}`;
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

                // Save the updated data to the data cache.
                _GFX.currentData[layerKey].tilemaps[newMapKey].x        = newMap.x;
                _GFX.currentData[layerKey].tilemaps[newMapKey].y        = newMap.y;
                _GFX.currentData[layerKey].tilemaps[newMapKey].tmap     = newMap.tmap;
                _GFX.currentData[layerKey].tilemaps[newMapKey].settings = newMap.settings;
                _GFX.currentData[layerKey].tilemaps[newMapKey].hash     = newMap.hash;
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
            let mapKey;
            let map;
            let cacheHit = false; 
            let tw;
            let th;
            let genTime
            let relatedMapKey;
            for(let i=0, len=mapKeys.length; i<len; i+=1){
                cacheHit = false;

                // Get the mapKey and the map;
                mapKey = mapKeys[i];
                map = maps[mapKey];

                // If the tmap was not supplied use the default tmap.
                if(!map.tmap){
                    console.log("No tmap supplied. Using the default tmap.");
                    if     (_GFX.tilesets[map.ts].tilemaps[mapKey])        { map.tmap = _GFX.tilesets[map.ts].tilemaps[mapKey]; }
                    else if(_GFX.tilesets[map.ts].tilemaps[map.mapKey])    { map.tmap = _GFX.tilesets[map.ts].tilemaps[map.mapKey]; }
                    else if(_GFX.tilesets[map.ts].tilemaps[map.baseMapKey]){ map.tmap = _GFX.tilesets[map.ts].tilemaps[map.baseMapKey]; }
                    else{
                        console.log("ERROR: map:", map, _GFX.tilesets[map.ts].tilemaps); 
                        throw `createImageDataFromTilemapsAndUpdateGraphicsCache: tmap not found.`;
                    }
                }

                // Get the tileWidth and tileHeight
                tw = _GFX.tilesets[ map.ts ].config.tileWidth;
                th = _GFX.tilesets[ map.ts ].config.tileHeight;

                // Use the supplied hashCacheHash and hashMapHash_BASE.
                if(map.hashCacheHash && map.hashCacheHash_BASE){
                    // console.log(`Using supplied hashCacheHash_BASE and hashCacheHash for ${mapKey}`);
                    map.hashCacheHash      = map.hashCacheHash;
                    map.hashCacheHash_BASE = map.hashCacheHash_BASE;
                }
                
                else{
                    // console.log(`hashCacheHash_BASE and hashCacheHash where not supplied for: ${mapKey}. Generating.`);
                    
                    // Generate hashCacheHash and hashMapHash_BASE (not including settings.)
                    // Create a hash for the base of this tilemap.
                    map.hashCacheHash_BASE = this.djb2Hash( JSON.stringify(
                        {
                            ts      : map.ts,
                            settings: JSON.stringify(_GFX.defaultSettings),
                            tmap    : Array.from(map.tmap),
                        }
                    ));

                    // Create a unique hash for the tilemap data including settings.
                    map.hashCacheHash = this.djb2Hash( JSON.stringify(
                        {
                            ts      : map.ts,
                            settings: JSON.stringify(map.settings),
                            tmap    : Array.from(map.tmap),
                        }
                    ));
                }

                // Use existing ImageData cache (Map)
                if(this.hashCacheMap.has(map.hashCacheHash)){
                    // console.log("Cache hit: Map", mapKey, map.hashCacheHash, map);
                    ({imgData: map.imgData, hasTransparency: map.hasTransparency} = this.hashCacheMap.get(map.hashCacheHash));
                    if(map.imgData && map.imgData.width){ cacheHit = true; }
                    else{ console.log("Something is wrong with the imgData", map); throw ""; }
                }

                // Hash was not found. The ImageData must be generated.
                if(!cacheHit){
                    // console.log("Not in cache Generating/Saving:", mapKey);

                    // Create the ImageData for this tilemap since it does not exist in the cache.
                    genTime = performance.now();
                    ({imageData: map.imgData, hasTransparency: map.hasTransparency} = this.createImageDataFromTilemap(map));
                    genTime = performance.now() - genTime;
                    
                    // Get the number of bytes for the new hashCache entry (approximate.)
                    let hashCacheDataLength = JSON.stringify({
                        imgData : Array.from(map.imgData.data),
                        ts      : map.ts,
                        settings: map.settings,
                        tmap    : map.tmap,
                        w: map.imgData.width, 
                        h: map.imgData.height,
                        mapKey:mapKey, 
                    }).length;

                    // Save to hashCacheMap. (Map)
                    relatedMapKey = this.findRelatedMapKey(map.ts, map.tmap);
                    this.hashCacheMap.set(map.hashCacheHash, {
                        imgData            : map.imgData,
                        ts                 : map.ts,
                        settings           : map.settings,
                        tmap               : map.tmap,
                        w                  : map.imgData.width, 
                        h                  : map.imgData.height,
                        hasTransparency    : map.hasTransparency,
                        removeHashOnRemoval: map.removeHashOnRemoval ?? false,
                        hashCacheHash      : map.hashCacheHash,
                        hashCacheHash_BASE : map.hashCacheHash_BASE,

                        hashCacheDataLength: hashCacheDataLength,
                        mapKey             : mapKey, 
                        relatedMapKey      : relatedMapKey,
                        genTime            : genTime,
                    });
                }
                
                // Save the completed data to the data cache.
                // if(map.fadeBeforeDraw){ console.log("****"); }
                if(save){
                    // Ensure that all keys exist.
                    if( !("mapKey"              in map) ){ console.log("map:", map.removeHashOnRemoval); throw `createImageDataFromTilemapsAndUpdateGraphicsCache: Missing key in map: mapKey`; }
                    if( !("hash"                in map) ){ console.log("map:", map.removeHashOnRemoval); throw `createImageDataFromTilemapsAndUpdateGraphicsCache: Missing key in map: hash`; }
                    if( !("hashPrev"            in map) ){ console.log("map:", map.removeHashOnRemoval); throw `createImageDataFromTilemapsAndUpdateGraphicsCache: Missing key in map: hashPrev`; }
                    if( !("ts"                  in map) ){ console.log("map:", map.removeHashOnRemoval); throw `createImageDataFromTilemapsAndUpdateGraphicsCache: Missing key in map: ts`; }
                    if( !("tmap"                in map) ){ console.log("map:", map.removeHashOnRemoval); throw `createImageDataFromTilemapsAndUpdateGraphicsCache: Missing key in map: tmap`; }
                    if( !("x"                   in map) ){ console.log("map:", map.removeHashOnRemoval); throw `createImageDataFromTilemapsAndUpdateGraphicsCache: Missing key in map: x`; }
                    if( !("y"                   in map) ){ console.log("map:", map.removeHashOnRemoval); throw `createImageDataFromTilemapsAndUpdateGraphicsCache: Missing key in map: y`; }
                    if( !("w"                   in map) ){ console.log("map:", map.removeHashOnRemoval); throw `createImageDataFromTilemapsAndUpdateGraphicsCache: Missing key in map: w`; }
                    if( !("h"                   in map) ){ console.log("map:", map.removeHashOnRemoval); throw `createImageDataFromTilemapsAndUpdateGraphicsCache: Missing key in map: h`; }
                    if( !("settings"            in map) ){ console.log("map:", map.removeHashOnRemoval); throw `createImageDataFromTilemapsAndUpdateGraphicsCache: Missing key in map: settings`; }
                    if( !("hashCacheHash"       in map) ){ console.log("map:", map.removeHashOnRemoval); throw `createImageDataFromTilemapsAndUpdateGraphicsCache: Missing key in map: hashCacheHash`; }
                    if( !("hashCacheHash_BASE"  in map) ){ console.log("map:", map.removeHashOnRemoval); throw `createImageDataFromTilemapsAndUpdateGraphicsCache: Missing key in map: hashCacheHash_BASE`; }
                    if( !("removeHashOnRemoval" in map) ){ console.log("map:", map.removeHashOnRemoval); throw `createImageDataFromTilemapsAndUpdateGraphicsCache: Missing key in map: removeHashOnRemoval`; }
                    if( !("noResort"            in map) ){ console.log("map:", map.removeHashOnRemoval); throw `createImageDataFromTilemapsAndUpdateGraphicsCache: Missing key in map: noResort`; }

                    // Save the data.
                    _GFX.currentData[layerKey].tilemaps[mapKey] = {
                        ...map,
                    };
                    
                    // console.log("SAVED:", _GFX.currentData[layerKey].tilemaps[mapKey]);
                }
            }
        },

        // Draw ALL tilemap ImageData from cache.
        drawImgDataCacheFromDataCache: function(layerKey, mapKeys){
            for(let i=0, len=mapKeys.length; i<len; i+=1){
                let layer  = _GFX.currentData[layerKey];
                let mapKey = mapKeys[i];
                let map    = _GFX.currentData[layerKey].tilemaps[mapKey];
                let imgDataCache = _GFX.layers[layerKey].imgDataCache;
                let imgData;
                
                // If there is no need for fading just use use the existing ImageData.
                if( !(layer.fade.prevFade != layer.fade.currFade || map.fadeBeforeDraw) ){
                    imgData = map.imgData;
                }

                // This image requires fading. 
                // Make a copy, fade it, and draw it instead of the existing ImageData for this map.
                else{
                    // Create new "ImageData" of the map's ImageData..
                    imgData = {
                        width : map.imgData.width, 
                        height: map.imgData.height, 
                        data  : createGraphicsAssets.copyRegion( 
                            map.imgData.data, 
                            map.imgData.width, 
                            0, 0, map.w, map.h
                        )
                    };
    
                    // Apply the fade to the "ImageData".
                    createGraphicsAssets.applyFadeToImageDataArray(imgData.data, layer.fade.currFade);
                }

                // 
                let ts = performance.now();
                // let funcName = "updateRegion_blit";
                let funcName = (!map.hasTransparency) ? "updateRegion_replace" : "updateRegion_blit";

                // if(mapKey == "card_l_1" || mapKey == "letter_uno_u"){
                    // if((!map.hasTransparency)){ console.log("REPLACE:", "mapKey:", mapKey, "hasTransparency:", map.hasTransparency); }
                    // else                      { console.log("BLIT   :", "mapKey:", mapKey, "hasTransparency:", map.hasTransparency); }
                // }

                createGraphicsAssets[funcName](
                    imgData.data,        // source
                    imgData.width,       // srcWidth
                    imgDataCache.data,   // destination
                    imgDataCache.width,  // destWidth
                    imgDataCache.height, // destHeight
                    map.x,               // x
                    map.y,               // y
                    map.w,               // w
                    map.h,               // h
                );
                ts = performance.now() - ts;
                if(ts >= 0.3){ console.log(ts.toFixed(2), imgData.data.byteLength, layerKey, mapKey); }
            }
        },

        // Draw the imgDataCache for a layer to the canvas layer. (Can also apply the global fade.)
        drawImgDataCacheToCanvas: function(layerKey){
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

        if(debugActive){
            messageFuncs.timings["sendGfxUpdates"].hashCacheMapSize1 = messageFuncs.sendGfxUpdates.V4.DRAW.hashCacheMap.size;

            let totalSum = Array.from(messageFuncs.sendGfxUpdates.V4.DRAW.hashCacheMap.values()).reduce((acc, rec) => acc + rec.hashCacheDataLength, 0);
            messageFuncs.timings["sendGfxUpdates"]["hashCacheMapSize2"] = totalSum;
            
            let hashCacheStats = Array.from(messageFuncs.sendGfxUpdates.V4.DRAW.hashCacheMap.values()).map(d=>{
                return {
                    mapKey: d.mapKey,
                    relatedMapKey: d.relatedMapKey,
                    ts: d.ts,
                    // w: d.w, 
                    // h: d.h, 
                    hasTransparency    : d.hasTransparency,
                    genTime            : d.genTime,
                    hashCacheDataLength: d.hashCacheDataLength,
                    removeHashOnRemoval: d.removeHashOnRemoval,
                    hashCacheHash      : d.hashCacheHash,
                    hashCacheHash_BASE : d.hashCacheHash_BASE,
                    isBase             : d.hashCacheHash_BASE == d.hashCacheHash_BASE,
                };
            });

            messageFuncs.timings["sendGfxUpdates"]["hashCacheStats"] = hashCacheStats;
            messageFuncs.timings["sendGfxUpdates"].ALLTIMINGS = timeIt("", "getAll");
        }

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
        
        // DRAW
        this.DRAW.parent = this;
        
        // SETBG
        this.SETBG.parent = this;
        
        // UPDATE
        this.UPDATE.parent = this;

    }
};
