
var gfxMainV5 = {
    PARENT       : null,
    modName      : null,
    moduleLoaded : false,
    isModuleLoaded: function(){ return this.moduleLoaded; },
    module_init: async function (parent, name) {
        return new Promise((resolve, reject)=>{
            if(!this.moduleLoaded){
                // Save reference to the parent module.
                this.PARENT = parent;
    
                // Save module name.
                this.modName = name;
    
                // Set the moduleLoaded flag.
                this.moduleLoaded = true;
                
                resolve();
            }
            else{
                resolve();
            }
        });
    },
    init: async function(){
        // Create a list of layerKeys for reuse.
        this.layerKeys = Object.keys(_GFX.layers);

        for(let i=0, len=this.layerKeys.length; i<len; i+=1){
            this.clearTimingsValues(this.layerKeys[i]);
        }
    },

    // Clears the timers for the sections of UPDATE_LAYER.
    clearTimingsValues: function(layerKey){
        timeIt(layerKey+"___TOTAL"            , "reset");
        timeIt(layerKey+"_A_clearLayer"       , "reset"); 
        timeIt(layerKey+"_B_clearRemovedData" , "reset"); 
        timeIt(layerKey+"_C_createTilemaps"   , "reset"); 
        timeIt(layerKey+"_D_drawFromDataCache", "reset"); 
        timeIt(layerKey+"_E_drawImgDataCache" , "reset"); 
        // timeIt("gfx", "reset");
    },

    // DEBUG: generates and returns some debug values. 
    updateDebugTimings: function(){
        let totalSize_all = 0;
        let totalSize_temp = 0;
        let totalSize_perm = 0;

        let totalSum = 0;
        let totalSumTemp = 0;
        let totalSumPerm = 0;

        let totalSum_genTimeAll = 0;
        let totalSum_genTimeTemp = 0;
        let totalSum_genTimePerm = 0;

        Array.from(gfxCoreV5.hashCache.values()).forEach(d=>{
            totalSum += 1;
            totalSize_all += d.hashCacheDataLength;
            totalSum_genTimeAll += d.genTime;

            if(d.removeHashOnRemoval){ 
                totalSumTemp += 1; 
                totalSize_temp += d.hashCacheDataLength; 
                totalSum_genTimeTemp += d.genTime;
            }
            else{ 
                totalSumPerm += 1; 
                totalSize_perm += d.hashCacheDataLength; 
                totalSum_genTimePerm += d.genTime;
            }
        });

        // Determine which hashCacheHash values are in use within _GFX.currentData layers.
        let hashCacheHashesUnmodified = new Set();
        let hashCacheHashesModified = new Set();
        
        let hashCacheStats2 = {
            "ALL":{
                "base": new Set(),//
                "copy": new Set(),//
                "baseHash": new Set(),//
                "copyHash": new Set(),//
            },
            "PERM":{
                "base": new Set(),//
                "copy": new Set(),
                "baseHash": new Set(),//
                "copyHash": new Set(),
            },
            "TEMP":{
                "base": new Set(),//
                "copy": new Set(),
                "baseHash": new Set(), //
                "copyHash": new Set(),
            },
        };
        // hashCacheHashesModified.add(tilemap.hashCacheHash)
        // hashCacheHashesUnmodified.add(tilemap.hashCacheHash)
        for(let i=0, len=this.layerKeys.length; i<len; i+=1){
            let tilemaps = _GFX.currentData[this.layerKeys[i]].tilemaps;
            for(let tilemapKey in tilemaps){
                tilemap = tilemaps[tilemapKey];
                // if(tilemap.removeHashOnRemoval){
                //     console.log("TEMP: tilemap.removeHashOnRemoval:", tilemap.mapKey, tilemap.removeHashOnRemoval);
                // }
                // else{
                //     console.log("PERM: tilemap.removeHashOnRemoval:", tilemap.mapKey, tilemap.removeHashOnRemoval);
                // }

                // Check for modifications (base not equal to individual hash.)
                
                // // The hashCacheHash_BASE and the hashCacheHash ARE the same.
                if(tilemap.hashCacheHash == tilemap.hashCacheHash_BASE){ 
                    hashCacheStats2.ALL.base.add(tilemap.hashCacheHash_BASE);
                    if(tilemap.removeHashOnRemoval){ hashCacheStats2.TEMP.base.add(tilemap.hashCacheHash_BASE); }
                    else                           { hashCacheStats2.PERM.base.add(tilemap.hashCacheHash_BASE); }
                }

                // Check if the hashCacheHash_BASE and the hashCacheHash ARE NOT the same.
                else if(tilemap.hashCacheHash != tilemap.hashCacheHash_BASE){ 
                    hashCacheStats2.ALL.copy.add(tilemap.hashCacheHash);
                    if(tilemap.removeHashOnRemoval){ hashCacheStats2.TEMP.copy.add(tilemap.hashCacheHash); }
                    else                           { hashCacheStats2.PERM.copy.add(tilemap.hashCacheHash); }
                }
                else{
                //     console.log("BAD:", tilemap);
                }
            }
        }
        hashCacheStats2.ALL.baseHash  = _GFX.utilities._djb2Hash( [...hashCacheStats2.ALL.base] );
        hashCacheStats2.ALL.copyHash  = _GFX.utilities._djb2Hash( [...hashCacheStats2.ALL.copy] );
        hashCacheStats2.PERM.baseHash = _GFX.utilities._djb2Hash( [...hashCacheStats2.PERM.base] );
        hashCacheStats2.PERM.copyHash = _GFX.utilities._djb2Hash( [...hashCacheStats2.PERM.copy] );
        hashCacheStats2.TEMP.baseHash = _GFX.utilities._djb2Hash( [...hashCacheStats2.TEMP.base] );
        hashCacheStats2.TEMP.copyHash = _GFX.utilities._djb2Hash( [...hashCacheStats2.TEMP.copy] );
        // console.log(hashCacheStats2);

        let partial_hashCache = new Map();
        let hashCacheStats = Array.from(gfxCoreV5.hashCache.values()).map(d=>{
            partial_hashCache.set(d.hashCacheHash, {
                // mapKey             : d.mapKey,
                relatedMapKey      : d.relatedMapKey,
                ts                 : d.ts,
                settings           : d.settings,
                hasTransparency    : d.hasTransparency,
                genTime            : d.genTime ?? -1,
                w: d.w,
                h: d.h,
                text: d.text,

                origin             : d.origin,
                removeHashOnRemoval: d.removeHashOnRemoval,
                hashCacheDataLength: d.hashCacheDataLength,
                hashCacheHash      : d.hashCacheHash,
                hashCacheHash_BASE : d.hashCacheHash_BASE,
                isBase             : d.hashCacheHash == d.hashCacheHash_BASE,
            });
            return partial_hashCache.get(d.hashCacheHash);
        });

        messageFuncs.timings["gfx"]["hashCacheHashesUnmodified"] = [...hashCacheHashesUnmodified];
        messageFuncs.timings["gfx"]["hashCacheHashesModified"] = [...hashCacheHashesModified];
        messageFuncs.timings["gfx"]["totalSize_all"]  = totalSize_all;
        messageFuncs.timings["gfx"]["totalSize_temp"] = totalSize_temp;
        messageFuncs.timings["gfx"]["totalSize_perm"] = totalSize_perm;
        messageFuncs.timings["gfx"]["totalSum_genTimeAll"]  = totalSum_genTimeAll;
        messageFuncs.timings["gfx"]["totalSum_genTimeTemp"] = totalSum_genTimeTemp;
        messageFuncs.timings["gfx"]["totalSum_genTimePerm"] = totalSum_genTimePerm;
        messageFuncs.timings["gfx"]["totalSum"]     = totalSum;
        messageFuncs.timings["gfx"]["totalSumTemp"] = totalSumTemp;
        messageFuncs.timings["gfx"]["totalSumPerm"] = totalSumPerm;
        messageFuncs.timings["gfx"]["hashCacheStats"] = hashCacheStats;
        messageFuncs.timings["gfx"]["partial_hashCache"] = partial_hashCache;
        messageFuncs.timings["gfx"]["hashCacheStats2"] = hashCacheStats2;
        messageFuncs.timings["gfx"].ALLTIMINGS = timeIt("", "getAll");

        // console.log("gfx:", timeIt("gfx", "get"));
        // Create a list of layerKeys for reuse.
        // this.layerKeys = Object.keys(_GFX.layers);

        // for(let i=0, len=this.layerKeys.length; i<len; i+=1){
        //     this.clearTimingsValues(this.layerKeys[i]);
        // }
    },

    // Applies changes to a layer.
    UPDATE_LAYER: function(layerKey, messageData, forceLayerRedraw){
        // Reset timers.
        timeIt(layerKey+"___TOTAL"            , "reset");
        timeIt(layerKey+"_A_clearLayer"       , "reset"); 
        timeIt(layerKey+"_B_clearRemovedData" , "reset"); 
        timeIt(layerKey+"_C_createTilemaps"   , "reset"); 
        timeIt(layerKey+"_D_drawFromDataCache", "reset"); 
        timeIt(layerKey+"_E_drawImgDataCache" , "reset"); 
        timeIt(layerKey+"___TOTAL"       , "start");

        timeIt(layerKey+"___TOTAL"       , "start");

        let layerData = messageData[layerKey];
        let overlappedRegions;
        let toClear;
        let canContinue;
        
        // ** CLEAR LAYER **
        // *****************

        timeIt(layerKey+"_A_clearLayer"       , "start");
        if(forceLayerRedraw){ 
            if(!messageData.ALLCLEAR){
                // Clear the imgDataCache for this layer if the fade is ON.
                if(layerData.fade.currFade != null){
                    // Clear the imgDataCache for this layer. 
                    gfxMainV5.gfx.CLEAR.oneLayerGfx(layerKey);
                }
            }
        }
        else                 { 
            // "Smarter clear"
            if(!messageData.ALLCLEAR){
                ({overlappedRegions, toClear} = gfxMainV5.gfx.CLEAR.preClear(layerKey, layerData, messageData));
            }
        }
        timeIt(layerKey+"_A_clearLayer"       , "stop");
        
        // ** CLEAR REMOVED GRAPHICS DATA **
        // *********************************
        
        timeIt(layerKey+"_B_clearRemovedData"       , "start");
        if(!messageData.ALLCLEAR){
            gfxCoreV5.removeHashCacheKeys(layerKey, layerData["REMOVALS_ONLY"]);
        }
        timeIt(layerKey+"_B_clearRemovedData"       , "stop");
        
        // ** CREATE/REUSE IMAGEDATA TILEMAPS **
        // *************************************
        
        // console.log("**");
        timeIt(layerKey+"_C_createTilemaps"       , "start");
        // Get the mapKeys for the changes.
        let newMapKeys = [ ...Object.keys(layerData["CHANGES"]) ];

        // Get the maps for the changes.
        let newMapData = { ...layerData["CHANGES"] };

        // Go through CHANGES and see if the existing ImageData tilemap can be reused (EX: Only a change to x or y.)
        // x/y changes will be updated in the graphics data cache.
        // Non-reusable keys and data will be replace newMapKeys and newMapData.
        ({newMapKeys, newMapData} = gfxMainV5.gfx.DRAW.canImageDataTilemapBeReused(layerKey, newMapKeys, newMapData));

        // Create ImageData tilemaps as needed and update the graphics data cache. 
        if(newMapKeys.length){
            gfxMainV5.gfx.DRAW.createImageDataFromTilemapsAndUpdateGraphicsCache(
                layerKey, newMapKeys, newMapData, true
            );
        }
        timeIt(layerKey+"_C_createTilemaps"       , "stop");
        
        // ** SET THE BACKGROUND COLOR (L1) **
        // ***********************************

        canContinue = gfxMainV5.gfx.SETBG.setBackgroundColor(layerKey, layerData, forceLayerRedraw);
        if(!canContinue){ 
            timeIt(layerKey+"___TOTAL"            , "stop");
            return; 
        }
        
        // ** DRAW TO IMGDATACACHE **
        // **************************
        
        timeIt(layerKey+"_D_drawFromDataCache"       , "start");
        gfxMainV5.gfx.DRAW.drawToImgDataCache(layerKey, layerData, forceLayerRedraw, toClear, overlappedRegions);
        timeIt(layerKey+"_D_drawFromDataCache"       , "stop");
        
        // ** DRAW FROM IMGDATACACHE TO OUTPUT CANVAS **
        // *********************************************
        
        timeIt(layerKey+"_E_drawImgDataCache"       , "start");
        gfxMainV5.gfx.DRAW.drawImgDataCacheToCanvas(layerKey);
        timeIt(layerKey+"_E_drawImgDataCache"       , "stop");

        timeIt(layerKey+"___TOTAL"       , "stop");
    },

    // Runs through each layer using UPDATE_LAYER to apply changes.
    runGraphicsUpdate: function(messageData){
        timeIt("gfx", "reset");
        timeIt("gfx", "start");

        let layerKeys = this.layerKeys;

        // Handle the ALLCLEAR. (Clears imgDataCache and the data cache.)
        if(messageData.ALLCLEAR){
            // console.log("ALLCLEAR");
            
            // Clears the imgDataCache for all layers.
            for(let i=0, len=this.layerKeys.length; i<len; i+=1){
                gfxMainV5.gfx.CLEAR.oneLayerGfx(this.layerKeys[i]);
            }
            
            // Clears the graphics cache for all layers and removes from hashCache if the map's hash removal flag is set. 
            gfxCoreV5.removeAllHashCacheKeys();

            // Reset the background color for L1.
            _GFX.currentData["L1"].bgColorRgba = [0,0,0,0];
            _GFX.currentData["L1"].bgColor32bit = 0;
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
                this.UPDATE_LAYER( layerKey, messageData, forceLayerRedraw );
            }
            else{
                this.clearTimingsValues(layerKey);
            }
        }

        timeIt("gfx", "stop");

        // Save the timings.
        messageFuncs.timings["gfx"].gs1        = messageData.gs1;
        messageFuncs.timings["gfx"].gs2        = messageData.gs2;
        messageFuncs.timings["gfx"].hasChanges = messageData.hasChanges;
        messageFuncs.timings["gfx"].version    = messageData.version;
        messageFuncs.timings["gfx"].ALLCLEAR   = messageData.ALLCLEAR;

        if(debugActive){ 
            // let ts = performance.now();
            // this.updateDebugTimings();
            // console.log(performance.now()-ts);
        }

        messageFuncs.timings["gfx"]["gfx"] = + timeIt("gfx", "get").toFixed(3);

        // // Now that the timings are stored and will be sent, reset them.
        // for(let i=0, len1=layerKeys.length; i<len1; i+=1){
        //     this.clearTimingsValues(layerKeys[i]);
        // }
        // timeIt("gfx", "reset");

        // Return the timings.
        return messageFuncs.timings["gfx"];
    },

    // ** FUNCTIONS USED BY UPDATE_LAYER **
    // ************************************

    gfx : {
        // Clearing functions.
        CLEAR: {
            // Clears ONE layer gfx. (imgDataCache only.)
            oneLayerGfx: function(layerKey){
                // Clear the imgDataCache for this layer.
                _GFX.layers[layerKey].imgDataCache.data.fill(0);
            },
    
            // Returns a list of specific regions that were overlapped by removed images on the same layer.
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
                    data             : removedRegions,
                    keys             : Object.keys(removedRegions),
                    hasRemovedRegions: hasRemovedRegions,
                };
            },

            // Generates the data used to clear regions occupied by removed images.
            // Uses getRegionsUsedByMapKeys.
            // Does perform clearing. That is done by drawToImgDataCache using data returned by this function.
            preClear(layerKey, layerData, messageData){
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
                let removedRegions = this.getRegionsUsedByMapKeys(layerKey, toClear);
                
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
                            overlap = _GFX.utilities.aabb_collisionDetection(rect1, rect2);
    
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
                                        imgData        : map.imgData,
                                        hasTransparency: map.hasTransparency,
                                        settings       : map.settings
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
                    toClear           : removedRegions.hasRemovedRegions ? removedRegions.data : false,
                }
            },
        },
        // Drawing functions.
        DRAW : {
            // Per-layer flicker flags.
            flickerFlag_L1: 0,
            flickerFlag_L2: 0,
            flickerFlag_L3: 0,
            flickerFlag_L4: 0,
    
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
                        let overlappedCopy = gfxCoreV5.copyRegion(
                            rec.src_img.imgData.data,
                            rec.src_img.imgData.width,
                            rec.src_img.x, rec.src_img.y,
                            rec.src_img.w, rec.src_img.h
                        );
        
                        // Apply existing fade to the overlappedCopy.
                        gfxCoreV5.transforms.applyFadeToImageDataArray(overlappedCopy, _GFX.currentData[layerKey].fade.currFade);
        
                        // Determine which updateRegion to use. 
                        let blit = (firstRegion || !rec.src_img.hasTransparency) ? false : true;
                        
                        // Write the overlappedCopy to the imgDataCache.
                        if(!blit){
                            gfxCoreV5.updateRegion_replace(
                                overlappedCopy,      // source
                                rec.src_img.w,       // srcWidth
                                imgDataCache.data,   // destination
                                imgDataCache.width,  // destWidth
                                imgDataCache.height, // destHeight
                                rec.dest_layer.x,    // dx
                                rec.dest_layer.y,    // dy
                                rec.dest_layer.w,    // dw
                                rec.dest_layer.h,    // dh
                            );
                            }
                            else{
                                gfxCoreV5.updateRegion_blit(
                                    overlappedCopy,      // source
                                    rec.src_img.w,       // srcWidth
                                    imgDataCache.data,   // destination
                                    imgDataCache.width,  // destWidth
                                    imgDataCache.height, // destHeight
                                    rec.dest_layer.x,    // dx
                                    rec.dest_layer.y,    // dy
                                    rec.dest_layer.w,    // dw
                                    rec.dest_layer.h,    // dh
                                );
                            }
    
                        // Unset firstRegion flag.
                        firstRegion = false;
                    }
    
                }
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
            
            createImageDataFromTilemapsAndUpdateGraphicsCache: function(layerKey, mapKeys, maps){
                /* 
                Ideally any change request would result in a cache hit matching the graphic.
                */
                for(let i=0, len=mapKeys.length; i<len; i+=1){
                    let cacheHit = false;
                    let mapKey = mapKeys[i];
                    let map = maps[mapKey];
    
                    let settingsAreDefault;
                    let base_found = false;
                    let modified_found = false;
                    let addToCache = false;
                    let cacheObj;
    
                    // If the tmap was not supplied then ERROR.
                    if(!map.tmap){
                        console.log("ERROR: map:", map, _GFX.tilesets[map.ts].tilemaps); 
                        throw `createImageDataFromTilemapsAndUpdateGraphicsCache: tmap not found.`;
                    }
                    
                    // Find the related tilemap key.
                    map.relatedMapKey = _GFX.utilities.findRelatedMapKey(map.ts, map.tmap);
    
                    // If the cache is on...
                    if(_GFX.configObj.disableCache == false){
                        // Create hashes for this tilemap object.
                        map.hashCacheHash_BASE = _GFX.utilities._djb2Hash( JSON.stringify(
                            {
                                ts      : map.ts,
                                settings: JSON.stringify(_GFX.defaultSettings),
                                tmap    : Array.from(map.tmap),
                            }
                        ));
    
                        // Create a unique hash for the tilemap data including full settings.
                        map.hashCacheHash = _GFX.utilities._djb2Hash( JSON.stringify(
                            {
                                ts      : map.ts,
                                settings: JSON.stringify( Object.assign({}, _GFX.defaultSettings, map.settings ?? {}) ),
                                tmap    : Array.from(map.tmap),
                            }
                        ));
    
                        base_found     = gfxCoreV5.hashCache.has(map.hashCacheHash_BASE);
                        modified_found = gfxCoreV5.hashCache.has(map.hashCacheHash);
                        settingsAreDefault = _GFX.utilities.areSettingsObjectsEqual(map.settings, _GFX.defaultSettings);
    
                        // Was the modified version found? (Could also be the base too.)
                        if(modified_found){
                            // console.log("hashCacheHash      'WAS'     found'");
                            cacheObj = gfxCoreV5.hashCache.get(map.hashCacheHash);
                            map.imgData = cacheObj.imgData;
                            map.w = cacheObj.imgData.width;
                            map.h = cacheObj.imgData.height;
                            map.hasTransparency = cacheObj.hasTransparency;
                            map.origin = cacheObj.origin;
                            cacheHit = true;
                        }
                        
                        // Was only the base found?
                        else if(base_found){
                            // console.log("hashCacheHash      'WAS NOT' found'");
                            // console.log("hashCacheHash_BASE 'WAS      found'");
                            
                            if(settingsAreDefault){
                                // console.log("settings           'ARE'     default'");
                                cacheObj = gfxCoreV5.hashCache.get(map.hashCacheHash_BASE);
                                map.imgData = cacheObj.imgData;
                                map.w = cacheObj.imgData.width;
                                map.h = cacheObj.imgData.height;
                                map.hasTransparency = cacheObj.hasTransparency;
                                map.origin = cacheObj.origin;
                                cacheHit = true;
                            }
                            else{
                                // console.log("settings           'ARE NOT' default'");
                                addToCache = true;
                            }
                        }
    
                        // No base. This is a new tilemap object.
                        else{
                            // console.log("hashCacheHash      'WAS NOT' found'");
                            // console.log("hashCacheHash_BASE 'WAS NOT' found'");
                            addToCache = true;
                        }
                    }
    
                    // console.log(`` +
                    //     `cacheHit: ${cacheHit?"Y":"N"}` +
                    //     `, base_found: ${base_found?"Y":"N"}` +
                    //     `, modified_found: ${modified_found?"Y":"N"}` +
                    //     `, settingsAreDefault: ${settingsAreDefault?"Y":"N"}` +
                    //     `, test1: ${!modified_found && base_found && !settingsAreDefault ?"Y":"N"}` + 
                    //     `, test2: ${!base_found && !modified_found ?"Y":"N"}` + 
                    //     ``
                    // );
    
                    if(cacheHit){
                        // Existing tilemap object. BASE or BASE_MODIFIED.
                        if(modified_found || base_found){
                            map.imgData = cacheObj.imgData;
                            map.w = cacheObj.imgData.width;
                            map.h = cacheObj.imgData.height;
                            map.hasTransparency = cacheObj.hasTransparency;
                            map.origin = cacheObj.origin;

                            // let debug_text = ``;
                            // Is this a modified base?
                            if(modified_found && map.hashCacheHash_BASE != map.hashCacheHash){
                                // debug_text += `src: modified, map_origin: ${map.origin}, cacheObj_origin: ${cacheObj.origin}`;
                                map.removeHashOnRemoval = true;
                            }
                            // Is this a base?
                            else if(map.hashCacheHash_BASE == map.hashCacheHash){
                                // debug_text += `src: base, map_origin: ${map.origin}, cacheObj_origin: ${cacheObj.origin}`;
                                map.removeHashOnRemoval = cacheObj.removeHashOnRemoval;
                            }
                            // else{
                                // console.log("NO THIS IS SOMETHING ELSE"); 
                            // }

                            // console.log(map.relatedMapKey, map.removeHashOnRemoval, "::", cacheObj.relatedMapKey, cacheObj.removeHashOnRemoval);
                            // map.removeHashOnRemoval = true;
                            // console.log(debug_text, `MAP: relatedMapKey: ${map.relatedMapKey || "CUSTOM"}, removeHashOnRemoval: ${map.removeHashOnRemoval}, :: CACHEOBJ: relatedMapKey: ${cacheObj.relatedMapKey || "CUSTOM"}, removeHashOnRemoval: ${cacheObj.removeHashOnRemoval}`);
                        }
                    }
                    else{
                        // New tilemap object: BASE_MODIFIED.
                        // If the base WAS found then use that and apply the settings to a copy of it.
                        // Cache: Set the origin to BASE_MODIFIED
                        if(!modified_found && base_found && !settingsAreDefault){
                            map.genTime = performance.now();
                            cacheObj = gfxCoreV5.createImageDataFromTilemap(map);
                            map.imgData = cacheObj.imgData;
                            map.w = cacheObj.imgData.width;
                            map.h = cacheObj.imgData.height;
                            map.hasTransparency = cacheObj.hasTransparency;
                            map.origin = "BASE_MODIFIED";
                            map.genTime = performance.now() - map.genTime;
                            map.removeHashOnRemoval = true;
                        }
    
                        // New tilemap object: CUSTOM.
                        // Cache: add to the hashCache with the removeHashOnRemoval flag set as received by this function.
                        // Cache: Set the origin to "CUSTOM".
                        else if(!base_found && !modified_found){
                            map.genTime = performance.now();
                            cacheObj = gfxCoreV5.createImageDataFromTilemap(map);
                            map.imgData = cacheObj.imgData;
                            map.w = cacheObj.imgData.width;
                            map.h = cacheObj.imgData.height;
                            map.hasTransparency = cacheObj.hasTransparency;
                            if(map.hashCacheHash != map.hashCacheHash_BASE){
                                map.origin = "CUSTOM_MODIFIED";
                            }
                            else{
                                map.origin = "CUSTOM";
                            }
                            map.genTime = performance.now() - map.genTime;
                            map.removeHashOnRemoval = true;
                            // if(map.text){
                                // console.log("map.mapKey:", map.origin, map.mapKey, map.text || "", map.hashCacheHash_BASE, map.hashCacheHash, map.hashCacheHash_BASE == map.hashCacheHash);
                            // }
                        }
                    }
                    
                    // Add the new cacheObj to the hashCache if it is is new/modified.
                    if(_GFX.configObj.disableCache == false){
                        if(!map.origin) { 
                            console.log(`Missing map.origin value: ${mapKey}`); 
                            console.log(`  base_found        `, base_found); 
                            console.log(`  modified_found    `, modified_found); 
                            console.log(`  settingsAreDefault`, settingsAreDefault); 
                            return; 
                        }
                        
                        if(addToCache){
                            let added = gfxCoreV5.addTilemapImagesToHashCache(
                                { ["NEW_CACHE_OBJECT"]: map }, 
                                map.origin, map.text
                            );
    
                            if(!added){
                                console.log(`ALREADY EXISTS: hashCache entry: ${map.mapKey}, ${map.relatedMapKey}`);
                            }
                            // else{
                            //     console.log(`Added new hashCache entry: ${map.mapKey}, ${map.relatedMapKey}`);
                            // }
                        }
                    }
    
                    // Save the completed tilemap (or modification) to the active graphics cache.
                    _GFX.currentData[layerKey].tilemaps[mapKey] = {
                        ...map,
                    };
                }
            },
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
                        let map = _GFX.currentData[layerKey].tilemaps[ allMapKeys[i] ];
                        
                        // DEBUG
                        if(!map){ 
                            console.log(`NO MAP??`, layerKey, allMapKeys[i], map);
                            return; 
                        }
                        // else{
                            // console.log(`to imgDataCache: ${layerKey} ${allMapKeys[i]} ${map.relatedMapKey}`);
                        // }
    
                        // If the noResort flag is set then push to the flicker array.
                        if(!map.noResort){ part1.push( allMapKeys[i] ); }
                        
                        //Otherwise, add to the non-flicker array.
                        else             { part2.push( allMapKeys[i] ); }
                    }
    
                    // "Flicker" via resorting of the map keys.
                    if(layerData.useFlicker){
                        // Generate the flickerFlag key.
                        let key = "flickerFlag_" + layerKey
    
                        // If the flickerFlag key is set then reverse the order of the keys in the flicker array.
                        if(this[key]){ part1.reverse(); } 
    
                        // Toggle the flag.
                        this[key] = ! this[key];
                    }
                }
    
                // STEP 1: Clear the toClear regions. (clearRegionsUsedByMapKeys)
                if(toClear){
                    // Go through the supplied mapKeys...
                    let rec;
                    for(let recKey in toClear){
                        // Get the object.
                        rec = toClear[recKey];
    
                        // Clear the region that was occupied by this image.
                        gfxCoreV5.clearRegion(
                            _GFX.layers[layerKey].imgDataCache.data, 
                            _GFX.layers[layerKey].imgDataCache.width,
                            rec.x, rec.y, rec.w, rec.h
                        );
                    }
                }
    
                // STEP 2: Draw the overlaps second.
                if(overlappedRegions){
                    // Replace the overlapped regions with their original data.
                    gfxMainV5.gfx.DRAW.restoreOverlapsToMapKey(layerKey, overlappedRegions);
                }
    
                // STEP 3: Draw the images that do not have noResort set.
                // The map key order may have been reversed by flicker.
                if(part1.length){
                    gfxMainV5.gfx.DRAW.drawImgDataCacheFromDataCache(layerKey, part1);
                }
                
                // STEP 4: Draw the images that do have have noResort set.
                // Drawn in the order that they were added.
                if(part2.length){
                    gfxMainV5.gfx.DRAW.drawImgDataCacheFromDataCache(layerKey, part2);
                }
            },
            drawImgDataCacheFromDataCache : function(layerKey, mapKeys){
                for(let i=0, len=mapKeys.length; i<len; i+=1){
                    let layer  = _GFX.currentData[layerKey];
                    let mapKey = mapKeys[i];
                    let map    = _GFX.currentData[layerKey].tilemaps[mapKey];
                    let imgDataCache = _GFX.layers[layerKey].imgDataCache;
                    let imgData;
                    
                    // If there is no need for fading just use use the existing ImageData.
                    if( 
                        !(layer.fade.prevFade != layer.fade.currFade || map.fadeBeforeDraw) &&
                        map.settings.fade == null
                    ){
                        imgData = map.imgData;
                    }
    
                    // This image requires fading. 
                    // Make a copy, fade it, and draw it instead of the existing ImageData for this map.
                    else{
                        // Create new "ImageData" of the map's ImageData..
                        imgData = {
                            width : map.imgData.width, 
                            height: map.imgData.height, 
                            data  : gfxCoreV5.copyRegion( 
                                map.imgData.data, 
                                map.imgData.width, 
                                0, 0, map.w, map.h
                            )
                        };
        
                        // Apply the per-image fade to the image copy.
                        if(map.settings.fade){
                            gfxCoreV5.transforms.applyFadeToImageDataArray(imgData.data, map.settings.fade);
                        }
    
                        // Apply the global fade to the image copy.
                        gfxCoreV5.transforms.applyFadeToImageDataArray(imgData.data, layer.fade.currFade);
                    }
    
                    // 
                    // let ts = performance.now();
                    if(map.hasTransparency){
                        gfxCoreV5.updateRegion_blit(
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
                    }
                    else{
                        gfxCoreV5.updateRegion_replace(
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
                    }

                    // ts = performance.now() - ts;
                    // if(ts >= 0.3){ console.log(ts.toFixed(2), imgData.data.byteLength, layerKey, mapKey); }
                }
            },
            drawImgDataCacheToCanvas      : function(layerKey){
                // Get the imgDataCache.
                let imgDataCache = _GFX.layers[layerKey].imgDataCache;
    
                // Use the imgDataCache to draw to the output canvas.
                requestAnimationFrame(()=>{
                    _GFX.layers[layerKey].ctx.putImageData(imgDataCache, 0, 0);
                });
            },
        },

        // TODO: Unfinished.
        // Handles conditions where the background color behind the first layer changes.
        SETBG: {
            // TODO: Unfinished.
            setBackgroundColor            : function(layerKey, layerData, forceLayerRedraw){
                return true;
            },
        },
    },
    
    // ** INIT FUNCTIONS **
    // *******************

    initConfigAndGraphics : async function(messageData){
        let ts_TOTAL = performance.now();
    
        // Save the configObj.
        let tsDataSave = performance.now();
        _GFX.configObj = messageData.configObj;
        tsDataSave = performance.now() - tsDataSave;
    
        // Save the default settings.
        _GFX.defaultSettings = messageData.defaultSettings;
    
        // Save the debugActive flag (global variable.)
        debugActive = messageData.debugActive ?? false;
        
        // Convert the graphics assets.
        let results = await gfxCoreV5.process(_GFX.configObj.tilesetFiles);
    
        // Save the converted tilesets.
        _GFX.tilesets = results.finishedTilesets;
    
        // Create the BASE tilemap images.
        let base_totalMapsCached = 0;
        let base_totalMapsGenerated = 0;
        let cacheObj;
        let ts_createBasetilemapImagesAndHashes = performance.now();
        for(let tilesetKey in _GFX.tilesets){
            let th = _GFX.tilesets[tilesetKey].config.tileHeight;
            let tw = _GFX.tilesets[tilesetKey].config.tileWidth;
            for(let tilemapKey in _GFX.tilesets[tilesetKey].tilemaps){
                let tmapArr = _GFX.tilesets[tilesetKey].tilemaps[tilemapKey];
                let mapW = tmapArr[0];
                let mapH = tmapArr[1];
                let map = {
                    // "imgData"            : new ImageData(mapW * tw, mapH * th),
                    "ts"                 : tilesetKey, 
                    "settings"           : _GFX.defaultSettings, 
                    "tmap"               : tmapArr, 
                    "w"                  : mapW * tw, 
                    "h"                  : mapH * th, 
                    "hasTransparency"    : false, // TBD
                    "isFullyTransparent" : false, // TBD
                    "removeHashOnRemoval": false, 
                    // "mapKey"             : tilemapKey, 
                    "relatedMapKey"      : tilemapKey, 
                    "genTime"            : 0,
                };
                map.genTime = performance.now();
                
                // Create hashes for this tilemap object.
                map.hashCacheHash_BASE = _GFX.utilities._djb2Hash( JSON.stringify(
                    {
                        ts      : map.ts,
                        settings: JSON.stringify(_GFX.defaultSettings),
                        tmap    : Array.from(map.tmap),
                    }
                ));
    
                // Create a unique hash for the tilemap data including full settings.
                map.hashCacheHash = _GFX.utilities._djb2Hash( JSON.stringify(
                    {
                        ts      : map.ts,
                        settings: JSON.stringify( Object.assign({}, _GFX.defaultSettings, map.settings ?? {}) ),
                        tmap    : Array.from(map.tmap),
                    }
                ));
    
                cacheObj = gfxCoreV5.createImageDataFromTilemap(map);
                map.imgData = cacheObj.imgData;
                map.w = cacheObj.imgData.width;
                map.h = cacheObj.imgData.height;
                map.hasTransparency = cacheObj.hasTransparency;
                map.origin = "BASE";
                map.genTime = performance.now() - map.genTime;
    
                // Add this completd tilemap image to _GFX.tilesets tilemap images.
                _GFX.tilesets[tilesetKey].tilemapImages[tilemapKey] = map;
    
                base_totalMapsGenerated += 1;
    
                // Add this to the hashCache?
                if(_GFX.configObj.disableCache == false){
                    if(!gfxCoreV5.hashCache.has(map.hashCacheHash)){
                        let added = gfxCoreV5.addTilemapImagesToHashCache(
                            { ["NEW_CACHE_OBJECT"]: map }, 
                            map.origin, map.text
                        );
                        if(added){ 
                            // console.log(`Added new hashCache entry: ${map.relatedMapKey}`); 
                            base_totalMapsCached += 1;
                        }
                        else     { console.log(`ALREADY EXISTS: hashCache entry: relatedMapKey: ${map.relatedMapKey}`); }
                    }
                }
            }
        }
        ts_createBasetilemapImagesAndHashes = performance.now() - ts_createBasetilemapImagesAndHashes;
        // if(debugActive && _GFX.configObj.disableCache == false){
        //     console.log(
        //         // `V5: _createGraphicsAssets: tileset: '${tilesetName.padEnd(13, " ")}': ` +
        //         `V5: BASE tilemap images creation and hashCaching: ` + 
        //         `TIME: ${ts_createBasetilemapImagesAndHashes.toFixed(2).padStart(6, " ")} ms, ` +
        //         `MAPS PRE-GENERATED : ${base_totalMapsGenerated.toString().padStart(3, " ")}, ` +
        //         `MAPS ADDED TO CACHE: ${base_totalMapsCached.toString().padStart(3, " ")}` +
        //         ``
        //     );
        // }
    
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
            for(let mapKey in _GFX.tilesets[tsKey].tilemaps){
                minimalReturnData[tsKey].tilemaps[mapKey] = _GFX.tilesets[tsKey].tilemaps[mapKey];
            }
        }
        createMinimalData = performance.now() - createMinimalData;
    
        ts_TOTAL = performance.now() - ts_TOTAL;
    
        // Save the timings.
        messageFuncs.timings["initConfigAndGraphics"]["__TOTAL"]                            = ts_TOTAL.toFixed(3);
        messageFuncs.timings["initConfigAndGraphics"]["A_tsDataSave"]                       = tsDataSave.toFixed(3);
        messageFuncs.timings["initConfigAndGraphics"]["B_getAndParseGraphicsData"]          = results.timings.getAndParseGraphicsData.toFixed(3);
        messageFuncs.timings["initConfigAndGraphics"]["C_createGraphicsAssets"]             = results.timings.createGraphicsAssets.toFixed(3);
        messageFuncs.timings["initConfigAndGraphics"]["D_createBasetilemapImagesAndHashes"] = ts_createBasetilemapImagesAndHashes.toFixed(3);
        messageFuncs.timings["initConfigAndGraphics"]["E_createRgbaFadeValues"]             = results.timings.createRgbaFadeValues.toFixed(3);
        messageFuncs.timings["initConfigAndGraphics"]["F_createMinimalData"]                = createMinimalData.toFixed(3);
    
        // Return some minimal data.
        return {
            minimalReturnData: minimalReturnData,
            timings: messageFuncs.timings["initConfigAndGraphics"],
            counts: {
                base_totalMapsGenerated: base_totalMapsGenerated,
                base_totalMapsCached   : base_totalMapsCached,
            },
        };
    },
    
    initLayers : async function(messageData){
        let ts_TOTAL = performance.now();
    
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
        let ts_initV5 = performance.now();
        if(gfxMainV5.init){ await gfxMainV5.init(); }
        else{ 
            console.error(`initLayers: Missing 'gfxMainV5.init' function.`);
            throw `initLayers: Missing 'gfxMainV5.init' function.`;
        }
        ts_initV5 = performance.now() - ts_initV5;
        
        ts_TOTAL = performance.now() - ts_TOTAL;
    
        // Save the timings.
        messageFuncs.timings["initLayers"]["__TOTAL"]       = ts_TOTAL.toFixed(3);
        messageFuncs.timings["initLayers"]["A_tsLayerSave"] = tsLayerSave.toFixed(3);
        messageFuncs.timings["initLayers"]["B_ts_initV5"]   = ts_initV5.toFixed(3);
    
        return {
            timings: messageFuncs.timings["initLayers"]
        };
    },

    // ** WEB WORKER MESSAGE HANDLER **
    // ********************************

    messageHander : async function(event){
        // Make sure the request is valid. 
        if(!event.data.mode){ console.log("No MODE was specified."); self.postMessage( {mode: event.data, data: ""}, [] ); }
        if(!event.data.data){ console.log("No DATA was specified."); self.postMessage( {mode: event.data, data: ""}, [] ); }
    
        // Break-out the event values.
        let mode  = event.data.mode;
        let data  = event.data.data;
        let flags = event.data.flags;
    
        // Create these values for the end of the message call.
        let refs  = [];
        let returnData = "";
    
        switch(mode){
            // ONE-TIME REQUESTS.
            case "initConfigAndGraphics": { 
                // console.log("initConfigAndGraphics");
                if(!flags.dataRequest){              await gfxMainV5.initConfigAndGraphics(data); }
                else                  { returnData = await gfxMainV5.initConfigAndGraphics(data); }
                break;
            }
            case "initLayers"           : { 
                // console.log("initLayers");
                if(!flags.dataRequest){              await gfxMainV5.initLayers(data); }
                else                  { returnData = await gfxMainV5.initLayers(data); }
                break; 
            }
            case "generateCoreImageDataAssets"           : { 
                console.log("generateCoreImageDataAssets: DISABLED");
                // if(!flags.dataRequest){              await messageFuncs.gfx.DRAW.generateCoreImageDataAssets(data.list); }
                // else                  { returnData = await messageFuncs.gfx.DRAW.generateCoreImageDataAssets(data.list); }
                break; 
            }
    
            // GRAPHICS UPDATE REQUEST.
            case "sendGfxUpdates"       : { 
                // console.log("sendGfxUpdates", data.version);
                // if(data.version == 5){
                    if(!flags.dataRequest){              gfxMainV5.runGraphicsUpdate(data); }
                    else                  { returnData = gfxMainV5.runGraphicsUpdate(data); }
                // }
                break; 
            }
    
            // DEBUG REQUESTS
            case "requestHashCacheEntry" : { 
                console.log("HASH CACHE ENTRY:", data.title);
                console.log("  HASH:", gfxCoreV5.hashCache.get(data.hash) );
                console.log("  BASE:", gfxCoreV5.hashCache.get(data.hashBase) );
                console.log(`  HASH ACCESS: gfxCoreV5.hashCache.get(${data.hash})`);
                console.log(`  BASE ACCESS: gfxCoreV5.hashCache.get(${data.hashBase})`);
                break; 
            }
    
            // UNUSED??
            case "clearAllLayers"          : { 
                console.log("clearAllLayers: DISABLED");
                // messageFuncs.gfx.CLEAR.allLayersGfx(); 
                // messageFuncs.gfx.CLEAR.allLayersData(); 
                break; 
            }
            
            case "_new_DEBUG.toggleDebugFlag"          : { 
                // console.log("_new_DEBUG.toggleDebugFlag: ");
                debugActive = data.debugActive ?? false;
                break; 
            }
    
            case "_new_DEBUG.updateDebugTimings"          : { 
                // console.log("_new_DEBUG.updateDebugTimings: ");
                gfxMainV5.updateDebugTimings();
                returnData = messageFuncs.timings["gfx"];

                // CLEAR
                for(let i=0, len1=this.layerKeys.length; i<len1; i+=1){
                    this.clearTimingsValues(this.layerKeys[i]);
                }
                timeIt("gfx", "reset");

                break; 
            }
    
            case "_new_DEBUG.toggleCacheFlag"          : { 
                // console.log("_new_DEBUG.toggleCacheFlag: ");
                _GFX.configObj.disableCache = data.disableCache ?? false;
                break; 
            }
    
            // UNKNOWN REQUESTS.
            default: {
                console.log("WEBWORKER: Unknown mode:", mode);
                break; 
            }
        };
    
        // Return the response.
        self.postMessage( 
            { 
                mode: mode, 
                data: returnData, 
                flags: flags 
            }, refs 
        );
    },
};
