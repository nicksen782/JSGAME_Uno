
var gfxCoreV5 = {
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

    // *******************************
    // Tilemap Object Cache Management
    // *******************************

    // Tilemap Object Cache.
    hashCache               : new Map(), 
    // Removes one hashKey from the hashCache for one layer.
    removeHashCacheKey: function(layerKey, mapKey){
        // Get a handle the map in the graphics cache.
        let map = _GFX.currentData[layerKey].tilemaps[mapKey];
        let hashCacheHash;
        let hashCacheHash_BASE;
        let hashCache = this.hashCache;
        
        // Was the map found? 
        if(map){
            if(_GFX.configObj.disableCache == false){
                // Get the hashCacheHash and hashCacheHash_BASE for this tilemap.
                hashCacheHash      = map.hashCacheHash;
                hashCacheHash_BASE = map.hashCacheHash_BASE;
                // let remove_type1 = 0;
                // let remove_type2 = 0;
                // let remove_type3 = 0;

                // Remove the current entry.
                if(hashCacheHash){
                    if(map.removeHashOnRemoval && hashCache.has(hashCacheHash)){
                        hashCache.delete(hashCacheHash);
                        // remove_type1 += 1;
                    }
                }
                
                // Remove the entries that have the same base.
                if(hashCacheHash_BASE){
                    let filteredMap = new Map([...hashCache].filter(([key, value]) => value.hashCacheHash_BASE == hashCacheHash_BASE));
                    for (let [key, value] of filteredMap.entries()) {
                        if(value.removeHashOnRemoval && hashCache.has(key)){
                            // remove_type2 += 1;
                            hashCache.delete(key);
                        }
                    }
                }
            }

            // Remove the data from the currentData graphics cache.
            delete _GFX.currentData[layerKey].tilemaps[mapKey];
        }
    },
    // Removes a list of hashKeys from the hashCache for one layer.
    removeHashCacheKeys: function(layerKey, mapKeys){
        for(let i=0, len=mapKeys.length; i<len; i+=1){
            this.removeHashCacheKey(layerKey, mapKeys[i]);
        }
    },
    // Removes all non-PERM hashCache entries for all layers.
    // Also clears the active graphics cache and associated hashCache keys.
    removeAllHashCacheKeys: function(){
        // Clear the non-PERM hashCache entries. 
        for (let [key, value] of this.hashCache.entries()) {
            if(value.removeHashOnRemoval){
                this.hashCache.delete(key);
            }
        }

        // Clear the graphics cache. 
        let layerKey, mapKeys, mapKey, map;
        let layerKeys = gfxMainV5.layerKeys;
        for(let i=0, len1=layerKeys.length; i<len1; i+=1){
            layerKey = layerKeys[i];
            mapKeys = Object.keys(_GFX.currentData[layerKey].tilemaps);
            for(let m=0, len2=mapKeys.length; m<len2; m+=1){
                mapKey = mapKeys[m];
                map = _GFX.currentData[layerKey].tilemaps[mapKey];
                if(map){ delete _GFX.currentData[layerKey].tilemaps[mapKey]; }
            }
        }
    },

    // *********************
    // FADING AND TRANSFORMS
    // *********************

    // Creates RGBA fades from the RGB332 fade table values.
    _createRgbaFadeValues: function(){
        let src = this.transforms.fadeMasks;
        let r,g,b;

        // Add the values in order (round down to the nearest whole integer).
        for(let i=0, l=src.length; i<l; i+=1){
            r = ( ( ( ( src[i] & 0b00000111 ) >> 0) / 7 ) * 100 ) << 0;
            g = ( ( ( ( src[i] & 0b00111000 ) >> 3) / 7 ) * 100 ) << 0;
            b = ( ( ( ( src[i] & 0b11000000 ) >> 6) / 3 ) * 100 ) << 0;
            this.transforms.fadeMasksRGBA.push( new Uint8Array([ r, g, b ]) ); 
        }
    },
    // Transforms using fade, xFlip, yFlip, rotation, recoloring (By reference. Rotate creates a temp copy.)
    transforms: {
        // RGB332 fade table values.
        fadeMasks : [
            //    // INDEX // DEC // B G R // BB GGG RRR // B%  G%  R%  
            // 0x00, //     0 // 0   // 0 0 0 // 00 000 000 // 0   0   0   
            0x40, //     1 // 64  // 1 0 0 // 01 000 000 // 33  0   0    // 0
            0x88, //     2 // 136 // 2 1 0 // 10 001 000 // 66  14  0    // 1
            0x91, //     3 // 145 // 2 2 1 // 10 010 001 // 66  28  14   // 2
            0xD2, //     4 // 210 // 3 2 2 // 11 010 010 // 100 28  28   // 3
            0xE4, //     5 // 228 // 3 4 4 // 11 100 100 // 100 57  57   // 4
            0xAD, //     6 // 173 // 2 5 5 // 10 101 101 // 66  71  71   // 5
            0xB5, //     7 // 181 // 2 6 5 // 10 110 101 // 66  85  71   // 6
            0xB6, //     8 // 182 // 2 6 6 // 10 110 110 // 66  85  85   // 7
            0xBE, //     9 // 190 // 2 7 6 // 10 111 110 // 66  100 85   // 8
            0xBF, //    10 // 191 // 2 7 7 // 10 111 111 // 66  100 100  // 9
            // 0xFF, //    11 // 255 // 3 7 7 // 11 111 111 // 100 100 100 
        ].reverse(),

        // RGBA32 fade table values.
        fadeMasksRGBA : [],

        // Applies all transforms specified by the settings object.
        applyAll: function(imageData, settings){
            let width  = imageData.width;
            let height = imageData.height;
    
            // Break-out the settings object.
            let {
                xFlip      ,// = _GFX.defaultSettings.xFlip       ?? false,
                yFlip      ,// = _GFX.defaultSettings.yFlip       ?? false,
                colorData  ,// = _GFX.defaultSettings.colorData   ?? [],
                bgColorRgba,// = _GFX.defaultSettings.bgColorRgba ?? [],
                rotation   ,// = _GFX.defaultSettings.rotation    ?? 0,
                fade       ,// = _GFX.defaultSettings.fade        ?? null,
            } = settings;

            // Handle rotation modifications.
            if (rotation) {
                // A rotate 90.
                if (rotation == 90 || rotation == -270) {
                    rotation = 90;
                }
                // A rotate -90. Same as a rotate 90 with xflip.
                else if (rotation == -90 || rotation == 270) {
                    rotation = 90;
                    xFlip = !xFlip;
                }
                // A rotate 180. Same as rotation 0 with xFlip and yFlip.
                else if (rotation == 180 || rotation == -180) {
                    rotation = 0;
                    xFlip = !xFlip;
                    yFlip = !yFlip;
                }
            }

            // Handle xFlip.
            if(xFlip)           { this.flipImageDataHorizontally(imageData); }
            
            // Handle yFlip.
            if(yFlip)           { this.flipImageDataVertically(imageData); }
            
            // Handle color replacements. (by reference.)
            if(colorData.length){ this.replaceColors(imageData, colorData); }
    
            // Handle adding a background?  (by reference.)
            if(bgColorRgba)     { this.setImageDataBgColorRgba(imageData, [0,0,0,0], bgColorRgba); }
    
            // Handle per image fades (by reference.)
            if(fade != null)    { console.log("YO"); this.applyFadeToImageDataArray(imageData.data, fade); }
    
            // Handle rotation (Uses temp copy then updates the ImageData by reference.)
            // Will return new width and height values for the image data (useful for rotation of non-square images.)
            if(rotation)        { ({width, height} = this.rotateImageData(imageData, rotation)); }
    
            // Return the width and height (only useful for non-square image data.)
            return { width:width, height:height };
        },

        // Apply a fade to image data.
        applyFadeToImageDataArray: function(typedData, fadeLevel){
            let len  = typedData.length;

            // OFF
            if(fadeLevel === null){ return; }

            // BLACK
            else if(fadeLevel == 10){ 
                for(let i=0; i<len; i+=4){
                    typedData[i+0] =  0;
                    typedData[i+1] =  0;
                    typedData[i+2] =  0;
                    typedData[i+3] =  255;
                }
                return;
            } 

            // CLEAR
            else if(fadeLevel == 11){ typedData.fill(0); return; }

            // Convert each pixel's color to the max level as specified by the fadeLevel.
            else{
                // Need the max values.
                let fadeColorObj = this.fadeMasksRGBA[fadeLevel];
                let maxRed   = fadeColorObj[0] / 100; 
                let maxGreen = fadeColorObj[1] / 100; 
                let maxBlue  = fadeColorObj[2] / 100; 
                
                // Restrict r, g, b, a values and then round down.
                // let oldRed, oldGreen, oldBlue;
                // let newRed, newGreen, newBlue;

                for(let i=0; i<len; i+=4){
                    // Don't operate on transparent pixels.
                    if(typedData[i+3] != 255){ continue; } 

                    // IDEA TO TEST
                    // oldRed   = typedData[i+0];
                    // oldGreen = typedData[i+1];
                    // oldBlue  = typedData[i+2];
                    // newRed   = (oldRed   * maxRed)   | 0;
                    // newGreen = (oldGreen * maxGreen) | 0;
                    // newBlue  = (oldBlue  * maxBlue)  | 0;
                    // if(newRed   > oldRed  ){ typedData[i+0] = newRed  ; }
                    // if(newGreen > oldGreen){ typedData[i+1] = newGreen; }
                    // if(newBlue  > oldBlue ){ typedData[i+2] = newBlue ; }

                    typedData[i+0] =  (typedData[i+0] * maxRed)   | 0;
                    typedData[i+1] =  (typedData[i+1] * maxGreen) | 0;
                    typedData[i+2] =  (typedData[i+2] * maxBlue)  | 0;
                    // typedData[i+3] =  (typedData[i+3])            | 0;
                }
            }
        },

        // Flips image data horizontally. (By reference, changes source imageData.)
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

        // Flips image data vertically. (By reference, changes source image data.)
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
        
        // Rotates image data by the specified degrees. (Changes source image data. Uses temporary copy.)
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
        
        // Replaces transparent pixels in image data with the replacement bgColor. (By reference, changes source imageData.)
        setImageDataBgColorRgba: function(imageData, findColorArray, replaceColorArray){
            // Get the 32-bit value for the [r,g,b,a] values provided.
            let findColor_32bit    = _GFX.utilities.rgbaTo32bit(findColorArray);
            let replaceColor_32bit = _GFX.utilities.rgbaTo32bit(replaceColorArray);

            // Create a Uint32Array view of the imgDataCache for this layer.
            let uint32Data = new Uint32Array(imageData.data.buffer);

            // Find the findColor and replace with the replacementColor.
            for (let p = 0, len = uint32Data.length; p < len; ++p) {
                if (uint32Data[p] === findColor_32bit) { uint32Data[p] = replaceColor_32bit; }
            }
        },

        // Replaces colors in image data. (By reference, changes source imageData.)
        replaceColors: function(imageData, colorReplacements) {
            // Stop if no color replacements were specified.
            if(!colorReplacements || !colorReplacements.length){
                console.log("replaceColors: level 1: No colors specified:", colorReplacements, settings);
                return;
            }

            // Variables.
            let pixelKey;
            let sourceKey;
            let targetKey;
            let sourceColor;
            let targetColor;

            // Create a Uint32Array view over the image data
            const dataView = new Uint32Array(imageData.data.buffer);

            // Create a lookup map for color replacements.
            const lookup = new Map();
            for(let i=0, len = colorReplacements.length; i<len; i+=1){
                sourceColor = colorReplacements[i][0];
                targetColor = colorReplacements[i][1];

                if (!sourceColor || !targetColor) {
                    console.log("replaceColors: level 2: No colors specified:");
                    return;
                }

                // Convert colors to single integer values for faster lookup
                sourceKey = ( (sourceColor[3] << 24) | (sourceColor[2] << 16) | (sourceColor[1] << 8) | sourceColor[0] ) >>> 0;
                targetKey = ( (targetColor[3] << 24) | (targetColor[2] << 16) | (targetColor[1] << 8) | targetColor[0] ) >>> 0;
                lookup.set(sourceKey, targetKey);
            }

            // Iterate over pixels and replace colors as needed.
            for (let i = 0; i < dataView.length; i++) {
                // Get this pixel as a 32-bit value. 
                pixelKey = dataView[i];

                // Check if the pixel is in the lookup Map.
                if (lookup.has(pixelKey)) {
                    // It is. Replace the pixel.
                    dataView[i] = lookup.get(pixelKey); // 32bit write
                }
            }
        },
    },

    // Adds the tilemap image objects to the hashCache specified.
    addTilemapImagesToHashCache: function(mapObjs, origin){
        // Get a handle the to hashCache.
        let cache = this.hashCache;

        // Make sure that the supplied origin is valid.
        let allowedOrigins = [
            "BASE",
            "BASE_MODIFIED",
            "USER",
            "USER_MODIFIED",
            "CUSTOM",
        ];
        if(allowedOrigins.indexOf(origin) == -1){ 
            console.log(`addTilemapImagesToHashCache: invalid origin: ${origin}`, mapObjs);
            throw `addTilemapImagesToHashCache: invalid origin: ${origin}`;
        }

        // Add the entries.
        for(let mapKey in mapObjs){
            let map = mapObjs[mapKey];
            let hashCacheHash_BASE = _GFX.utilities._djb2Hash( JSON.stringify(
                {
                    ts      : map.ts,
                    settings: JSON.stringify(_GFX.defaultSettings),
                    tmap    : Array.from(map.tmap),
                }
            ));

            // Create a unique hash for the tilemap data including full settings.
            let hashCacheHash = _GFX.utilities._djb2Hash( JSON.stringify(
                {
                    ts      : map.ts,
                    settings: JSON.stringify( Object.assign({}, _GFX.defaultSettings, map.settings ?? {}) ),
                    tmap    : Array.from(map.tmap),
                }
            ));

            // Get the number of bytes for the new hashCache entry (approximate.)
            let hashCacheDataLength = JSON.stringify({
                imgData : Array.from(map.imgData.data),
                ts      : map.ts,
                settings: map.settings,
                tmap    : map.tmap,
                w: map.imgData.width, 
                h: map.imgData.height,
                // mapKey:mapKey, 
            }).length;

            // Find the related tilemap key if it is not set.
            if(!map.relatedMapKey){
                // console.log("Missing 'relatedMapKey'");
                map.relatedMapKey = _GFX.utilities.findRelatedMapKey(map.ts, map.tmap);
            }

            // Add the entry to the cache.
            // if(origin == "CUSTOM") { console.log("adding??", cache.has(hashCacheHash)); }
            if(!cache.has(hashCacheHash)){
                cache.set(hashCacheHash, {
                    imgData            : map.imgData,             // The image object.
                    w                  : map.imgData.width,       // The image width in pixels.
                    h                  : map.imgData.height,      // The image height in pixels.
                    ts                 : map.ts,                  // Not expected to change.
                    settings           : map.settings,            // May change but then there would be different hashes.
                    tmap               : map.tmap,                // This will never change from the base.
                    hasTransparency    : map.hasTransparency,     // Can be used to set the blit argument in updateRegion.
                    removeHashOnRemoval: map.removeHashOnRemoval, // Pre-generated images should have this as false. Others as true.
                    relatedMapKey      : map.relatedMapKey,       // Matching tilemap name from the tilemap arrays.
                    genTime            : map.genTime,             // Time taken to generate this image.
                    hashCacheHash      : hashCacheHash,           // Recalculated here.
                    hashCacheHash_BASE : hashCacheHash_BASE,      // Recalculated here.
                    hashCacheDataLength: hashCacheDataLength,     // Recalculated here.
                    origin             : origin,                  // Set by this function.
                    // mapKey             : map.mapKey,              // ???
                });

                return true;
            }
            else{
                // console.error(
                //     `addTilemapImagesToHashCache: This hashCache entry already exists. mapKey: '${map.mapKey}', relatedMapKey: '${map.relatedMapKey}' (${hashCacheHash}):`, 
                //     map.settings, map
                // );
                return false;
            }
        }
    },

    // ***************
    // INIT PROCESSING
    // ***************

    // Retrieve the tileset JSON files and parse.
    _getAndParseGraphicsData: function(tilesetFiles){
        let rgb332_tilesets = {};
        return new Promise(async(resolve,reject)=>{
            // Download each JSON file and JSON.parse portions of it into modified data.
            let proms1 = [];
            for(let f=0; f<tilesetFiles.length; f+=1){
                proms1.push(
                    new Promise( async(res,rej) => { 
                        let file = await fetch( tilesetFiles[f] ); 
                        file = await file.json();

                        let tileset = {
                            config       : file.config      ?? {},
                            tileset      : [], // Image data for each tile.
                            tilemaps     : {}, // Tilemap arrays.
                            tilemapImages: {}, // Image  data of each tilemap built up via tiles.
                            tilesetName: file.tilesetName ?? "",
                        };

                         // Tile data: Parse/convert the JSON-string(s) to Uint8Array.
                        if(file.tileset){
                            for(let tileId in file.tileset){ 
                                let tile = new Uint8Array( JSON.parse(file.tileset[tileId]) );
                                tileset.tileset[tileId] = tile; 
                            }
                        }
                
                        // Tilemap data: Parse/convert the JSON-string(s) to Uint8Array.
                        if(file.tilemaps){
                            for(let key in file.tilemaps){ 
                                let tilemap = new Uint8Array( JSON.parse(file.tilemaps[key]) );
                                tileset.tilemaps[key] = tilemap; 
                            }
                        }

                        // Add the tileset.
                        rgb332_tilesets[tileset.tilesetName] = tileset;

                        // Resolve this file. 
                        res(); 
                    } )
                );
            }
            await Promise.all(proms1);

            // 
            // Resolve the parsed rgb332 tilesets.
            resolve(rgb332_tilesets);
        });
    },
    // Converts the tileset JSON data into image data.
    _rgb332AssetsToRgba: function(rgb332_tilesets){
        return new Promise(async(resolve,reject)=>{
            // Returns a copy of a rgb332 tile converted to rgba32.
            let rgb332TileDataToRgba32 = function(tileData, config){
                let th = config.tileHeight;
                let tw = config.tileWidth;
                let translucent_color = config.translucent_color;
                let tileDataRgb32 = new Uint8Array( tw * th * 4);
                let transparentPixelCounter = 0;
                let rgba32_index = 0;
                let nR, nG, nB, nA;
                for(let rgb332_byte of tileData){
                    nR = 0;
                    nG = 0;
                    nB = 0;
                    nA = 0;

                    // Transparent pixel?
                    if(rgb332_byte == translucent_color){ 
                        transparentPixelCounter += 1;
                    }

                    // Not a transparent pixel.
                    else{
                        nR = ( ((rgb332_byte >> 0) & 0b00000111) * (255 / 7) ) << 0; // red
                        nG = ( ((rgb332_byte >> 3) & 0b00000111) * (255 / 7) ) << 0; // green
                        nB = ( ((rgb332_byte >> 6) & 0b00000011) * (255 / 3) ) << 0; // blue
                        nA = 255;
                    }
                    
                    // Update the data.
                    tileDataRgb32[rgba32_index + 0] = nR;
                    tileDataRgb32[rgba32_index + 1] = nG;
                    tileDataRgb32[rgba32_index + 2] = nB;
                    tileDataRgb32[rgba32_index + 3] = nA;

                    // Increment the rgba32_index.
                    rgba32_index += 4;
                }

                return {
                    hasTransparency   : transparentPixelCounter ? true : false, 
                    isFullyTransparent: transparentPixelCounter == tileData.length, 
                    tileDataRgb32     : tileDataRgb32,
                }
            };

            let finishedTilesets = {};

            // Create each tileset. (Tiles to ImageData, tilemaps to create tilemapImageData.)
            let proms1 = [];
            for(let tsKey in rgb332_tilesets){
                proms1.push(
                    new Promise(async(res,rej)=>{
                        let tilesetName = rgb332_tilesets[tsKey].tilesetName; // Also equal to ts.
                        let th = rgb332_tilesets[tsKey].config.tileHeight;
                        let tw = rgb332_tilesets[tsKey].config.tileWidth;

                        // Object entry.
                        let tsObj = {
                            config       : rgb332_tilesets[tsKey].config,
                            tileset      : [], // Image data for each tile.
                            tilemaps     : {}, // Tilemap arrays.
                            tilemapImages: {}, // Image  data of each tilemap built up via tiles.
                            tilesetName  : tilesetName,
                        };

                        // Create the tiles as ImageData.
                        let tileIndex = 0;
                        for(let tileId in rgb332_tilesets[tsKey].tileset){
                            // Start the object for this tile.
                            let newTile = {
                                // Image Data
                                imgData: new ImageData(tw, th),

                                // Flags: transparency.
                                hasTransparency   : false, 
                                isFullyTransparent: false, 
                            };

                            // Generate rgba32 tile data from rgb332 data and save.
                            let tileDataRgba = rgb332TileDataToRgba32(
                                rgb332_tilesets[tsKey].tileset[tileId],
                                rgb332_tilesets[tsKey].config
                            );
                            newTile.imgData.data.set(tileDataRgba.tileDataRgb32);
                            newTile.hasTransparency    = tileDataRgba.hasTransparency;
                            newTile.isFullyTransparent = tileDataRgba.isFullyTransparent;

                            // Save this tile.
                            tsObj.tileset[tileIndex] = newTile;
                            tileIndex+=1;
                        }

                        // Copy the tilemaps.
                        for(let tilemapKey in rgb332_tilesets[tsKey].tilemaps){
                            tsObj.tilemaps[tilemapKey] = rgb332_tilesets[tsKey].tilemaps[tilemapKey].slice();
                        }

                        // Save the completed tileset/tilemaps/tilemap images.
                        finishedTilesets[ tilesetName ] = tsObj;

                        // Resolve this promise.
                        res();
                    })
                );
            }

            //
            resolve(finishedTilesets);
        });
    },
    // Process the tilesets. Convert from RGB332.
    process: async function(tilesetFiles){
        return new Promise(async(resolve,reject)=>{
            // Get and parse the tileset data.
            let ts1 = performance.now();
            let rgb332_tilesets = await this._getAndParseGraphicsData(tilesetFiles);
            let ts1e = performance.now() - ts1;

            // Convert the tileset tilemaps to images and add to the hashCache.
            let ts2 = performance.now();
            let rgba32_tilesets = await this._rgb332AssetsToRgba(rgb332_tilesets);
            let ts2e = performance.now() - ts2;

            // Create the RGBA fade values.
            let ts3 = performance.now();
            this._createRgbaFadeValues();
            let ts3e = performance.now() - ts3;

            resolve({
                finishedTilesets: rgba32_tilesets,
                timings: {
                    getAndParseGraphicsData: ts1e,
                    createGraphicsAssets   : ts2e,
                    createRgbaFadeValues   : ts3e,
                },
            });
        });
    },

    // ****************************************
    // CREATE TILEMAP IMAGE, UPDATE THE DISPLAY
    // ****************************************

    // Creates a tilemap image from individual tiles governed by a tilemap array.
    createImageDataFromTilemap: function(tmapObj){
        let genTime = performance.now();
        let tmapArr = tmapObj.tmap;
        let mapW = tmapArr[0];
        let mapH = tmapArr[1];
        let index = 2;
        let tile;
        let missingTile;
        let tileset = _GFX.tilesets[tmapObj.ts].tileset;
        let th = _GFX.tilesets[tmapObj.ts].config.tileHeight;
        let tw = _GFX.tilesets[tmapObj.ts].config.tileWidth;

        // It is possible for an instance of the PrintText class to have an empty string for text. Height will be 1 but width will be 0. 
        // Set mapW and mapH to 1 so that the image data can have actual dimensions.
        // This will trigger missingTile (since there will not be a tile index after the dimensions) and leave the image data as an empty transparent tile.
        if(mapW == 0 || mapH == 0){ mapW = 1; mapW = 1; mapH = 1; }

        // Start the tilemap image object.
        let tmiObj = {
            // "imgData"            : new ImageData(mapW * tw, mapH * th),
            "imgData": {
                width : mapW * tw,
                height: mapH * th,
                data : new Uint8Array( mapW * tw * mapH * th *4 )
            },
            "ts"                 : tmapObj.ts, 
            "settings"           : tmapObj.settings, 
            // "settings"           : _GFX.defaultSettings, 
            "tmap"               : tmapArr, 
            "w"                  : mapW * tw, 
            "h"                  : mapH * th, 
            "hasTransparency"    : false, 
            "isFullyTransparent" : false, 
            "removeHashOnRemoval": tmapObj.removeHashOnRemoval, 
            // "mapKey"             : tmapObj.mapKey, 
            // "relatedMapKey"      : tmapObj.mapKey, 
            "genTime"            : 0,
        };

        // let w = tmiObj.w;
        // let h = tmiObj.h;

        // Create the tilemap image from tiles in the tileset.
        for(let y=0; y<mapH; y+=1){
            for(let x=0; x<mapW; x+=1){
                // Determine if this tile is missing.
                missingTile = !tileset.hasOwnProperty(tmapArr[index]) ;

                // Update the imageData with the completed imageDataTile.
                if(!missingTile){
                    // Get the tile object.
                    tile = tileset[ tmapArr[index] ];

                    // Determine if the tile has transparency (returned later.)
                    tmiObj.hasTransparency = tmiObj.hasTransparency || (tile.hasTransparency || tile.isFullyTransparent);
                    if(!tmiObj.hasTransparency){ tmiObj.isFullyTransparent = false; }

                    // Write the tile to the imageData.
                    this.updateRegion_replace(
                        tile.imgData.data,     // source
                        tile.imgData.width,    // srcWidth
                        tmiObj.imgData.data,   // destination
                        tmiObj.imgData.width,  // destWidth
                        tmiObj.imgData.height, // destHeight
                        x * tw,                // x
                        y * th,                // y
                        tw,                    // w
                        th,                    // h
                    );
                }
                else{ 
                    console.log("missing tile", index, tmapArr, tileset); 
                    throw "missing tile"; 
                }

                // Increment the tile index in the tilemap.
                index++;
            }
        }

        // Do the transformations.
        if(tmiObj.settings.xFlip || tmiObj.settings.yFlip || tmiObj.settings.colorData.length || tmiObj.settings.bgColorRgba.length || tmiObj.settings.rotation){
            ( 
                {width: tmiObj.imgData.width, height: tmiObj.imgData.height} = 
                    this.transforms.applyAll(
                        tmiObj.imgData, {
                        xFlip      : tmiObj.settings.xFlip,
                        yFlip      : tmiObj.settings.yFlip,
                        colorData  : tmiObj.settings.colorData,
                        bgColorRgba: tmiObj.settings.bgColorRgba,
                        rotation   : tmiObj.settings.rotation
                    }
                )
            );
        }

        genTime = performance.now() - genTime;
        tmiObj.genTime = genTime;

        return tmiObj;
        // let added = this.addTilemapImagesToHashCache(
        //     { [tilemapKey]: tmiObj }, 
        //     "BASE"
        // );
        // mapCount += 1;
        // if(added){ addedMapCount += 1; }
    },
    // Function to CLEAR a region from the source image (represented as a Uint8Array).
    clearRegion: function(source, srcWidth, dx, dy, w, h) {
        // Calculate the maximum X (width) and Y (height) based on the given source and source width
        let maxX = srcWidth;
        let maxY = source.length / srcWidth;

        // Determine the start and end of the destination region in both dimensions.
        // If dx or dy are negative (indicating a region starting outside the actual source data), they're clamped to 0.
        let x_start = dx < 0        ? 0    : dx;
        let x_end   = dx + w > maxX ? maxX : dx + w;

        // Similarly, if the destination extends beyond the source data, the end of the region is clamped.
        let y_start = dy < 0        ? 0    : dy;
        let y_end   = dy + h > maxY ? maxY : dy + h;

        // If the entire destination region outside the valid source area, exit the function early.
        // This could occur if dx,dy and dx+w,dy+h both point outside the valid source area.
        if (x_start == maxX || y_start == maxY || x_end == 0 || y_end == 0) {
            return;
        }

        // Iterate through the region defined by x_start to x_end and y_start to y_end.
        for (let y = y_start; y < y_end; y++) {
            for (let x = x_start; x < x_end; x++) {
                // For each pixel in the region, set the RGBA values to 0 (clear pixel) in the source Uint8Array.
                
                // Calculate the starting index of the pixel in the source array.
                let index = (y * srcWidth + x) << 2;  

                // Clear the pixel.
                source[index] = source[index + 1] = source[index + 2] = source[index + 3] = 0;  // Set RGBA values to 0.
            }
        }
    },
    // COPY a region from the source to a new Uint8Array.
    copyRegion: function(source, srcWidth, dx, dy, w, h) {
        // Calculate the maximum X (width) and Y (height) based on the given source and source width
        let maxX = srcWidth;
        let maxY = source.length / srcWidth;

        // Determine the start and end of the destination region in both dimensions.
        // If dx or dy are negative (indicating a region starting outside the actual source data), they're clamped to 0.
        let x_start = dx < 0        ? 0    : dx;
        let y_start = dy < 0        ? 0    : dy;

        // Similarly, if the destination extends beyond the source data, the end of the region is clamped.
        let x_end   = dx + w > maxX ? maxX : dx + w;
        let y_end   = dy + h > maxY ? maxY : dy + h;

        // If the region to be copied starts outside the actual source data,
        // the size of the region is adjusted accordingly.
        if (dx < 0) w += dx;
        if (dy < 0) h += dy;

        // If the entire destination region outside the valid source area, exit the function early and return an empty array.
        // This could occur if dx,dy and dx+w,dy+h both point outside the valid source area.
        if (x_start >= maxX || y_start >= maxY || x_end <= 0 || y_end <= 0 || w <= 0 || h <= 0) {
            return new Uint8Array(0);
        }

        // Prepare the result array.
        let resultData = new Uint8Array(w * h * 4);
        let resultIndex = 0;

        // Iterate through the region defined by x_start to x_end and y_start to y_end.
        for (let y = y_start; y < y_end; y++) {
            for (let x = x_start; x < x_end; x++) {
                // For each pixel, copy the RGB and A values from the source data to the result.

                // Calculate the starting index of the pixel in the source array.
                let srcIndex = (y * srcWidth + x) * 4;

                // Copy the pixel from the source to resultData (the destination.)
                for (let k = 0; k < 4; k++) {
                    resultData[resultIndex + k] = source[srcIndex + k];
                }

                // Increment the result index for the next pixel.
                resultIndex += 4;
            }
        }

        // Return the result data.
        return resultData;
    },
    // REPLACE a region in the destination with the source data (Uint8Array.)
    // Writes pixels without checking for transparency. (faster than blit.)
    updateRegion_replace: function(source, srcWidth, destination, destWidth, destHeight, dx, dy, w, h) {
        // Determine the start and end of the destination region in both dimensions.
        // If dx or dy are negative (indicating a region starting outside the actual source data), they're clamped to 0.
        let x_start = dx < 0              ? 0          : dx;
        let y_start = dy < 0              ? 0          : dy;

        // Similarly, if the destination extends beyond the source data, the end of the region is clamped.
        let x_end   = dx + w > destWidth  ? destWidth  : dx + w;
        let y_end   = dy + h > destHeight ? destHeight : dy + h;

        // If the entire destination region outside the valid source area, exit the function early.
        // This could occur if dx,dy and dx+w,dy+h both point outside the valid source area.
        if (x_start >= destWidth || y_start >= destHeight || x_end <= 0 || y_end <= 0) {
            return;
        }

        // Iterate through the region defined by x_start to x_end and y_start to y_end.
        for (let y = y_start; y < y_end; y++) {
            // Compute the start and end offsets in the source and the destination arrays.
            let srcOffset  = ((y - dy) * srcWidth + (x_start - dx)) << 2;
            let destOffset = (y * destWidth + x_start) << 2;
            let destRowStart = destOffset;

            // Calculate the row end and start.
            let srcRowStart  = srcOffset;
            let srcRowEnd    = srcOffset + ((x_end - x_start) << 2);

            // Copy the entire row at once from the source to the destination.
            destination.set(source.subarray(srcRowStart, srcRowEnd), destRowStart);
        }
    },
    // Performs all transformations before draw. 
    // Supports direct replace as well as blitting.
    updateRegion_blit: function(source, srcWidth, destination, destWidth, destHeight, dx, dy, w, h) {
        blit = true; 

        // Determine the start and end of the destination region in both dimensions.
        // If dx or dy are negative (indicating a region starting outside the actual source data), they're clamped to 0.
        let x_start = dx < 0              ? 0          : dx;
        let y_start = dy < 0              ? 0          : dy;

        // Similarly, if the destination extends beyond the source data, the end of the region is clamped.
        let x_end   = dx + w > destWidth  ? destWidth  : dx + w;
        let y_end   = dy + h > destHeight ? destHeight : dy + h;

        // If the entire destination region outside the valid source area, exit the function early.
        // This could occur if dx,dy and dx+w,dy+h both point outside the valid source area.
        if (x_start >= destWidth || y_start >= destHeight || x_end <= 0 || y_end <= 0) {
            return;
        }

        // This will work row by row with a normal array.
        // let maxRowLength = Math.max(w, destWidth) << 2;
        let maxRowLength = w << 2;
        let sourceRow = new Uint8Array(maxRowLength);
        let destRow = new Uint8Array(maxRowLength);

        // Iterate through the region defined by x_start to x_end and y_start to y_end.
        for (let y = y_start; y < y_end; y++) {
            // Compute the start and end offsets in the source and the destination arrays.
            let srcOffset = (((y - dy) * w + (x_start - dx)) << 2);
            let destOffset = (y * destWidth + x_start) << 2;
            let destRowStart = destOffset;

            // Calculate the row end and start.
            let srcRowStart  = srcOffset;
            let srcRowEnd    = srcOffset + ((x_end - x_start) << 2);

            // Get the row.
            let sourceRowView = source.subarray(srcRowStart, srcRowEnd);
            sourceRow.set(sourceRowView, 0);

            // If blitting then updates need to be considered pixel-by-pixel for each row.
            if(blit){
                // Check for transparent pixels in this row.
                let hasTransparentPixels = false;
                for (let i = 3; i < sourceRowView.length; i += 4) {
                    // if (sourceRowView[i] < 255) { hasTransparentPixels = true; break; }
                    if (sourceRowView[i] == 0) { hasTransparentPixels = true; break; }
                }

                // Does this row actually have any transparent pixels?
                if(hasTransparentPixels){
                    let destRowEnd = destOffset + ((x_end - x_start) << 2);
                    destRow.set(destination.subarray(destRowStart, destRowEnd), 0);
                    for (let i = 0; i < sourceRowView.length; i += 4) {
                        // Directly access the source pixel.
                        // If the source pixel is not transparent, replace the destination pixel with the source pixel.
                        if (sourceRowView[i+3] !== 0) { 
                            destRow[i]   = sourceRowView[i];
                            destRow[i+1] = sourceRowView[i+1];
                            destRow[i+2] = sourceRowView[i+2];
                            destRow[i+3] = sourceRowView[i+3];
                        }
                    }
    
                    // Copy the entire row (modified) at once from the source to the destination.
                    destination.set(destRow, destRowStart);
                }

                // No. Don't blit. Copy the entire row (unmodified) at once from the source to the destination.
                else{
                    destination.set(sourceRowView, destRowStart);
                }
            }

            // Copy the entire row (unmodified) at once from the source to the destination.
            else{
                destination.set(sourceRowView, destRowStart);
            }
        }
    },

    // **************
    // TEST FUNCTIONS
    // **************

    // TESTS
    test3: function(){
        let layerKey = "L3";
        let imgDataCache = _GFX.layers[layerKey].imgDataCache;
        let colors = {
            base   : [145, 36,  0,255], // 
            // base   : [182,109,  0,255], // 
            blue   : [36 , 72 , 170, 255], // 
            red    : [218, 0  , 0  , 255], // 
            green  : [0  , 145, 0  , 255], // 
            black  : [0  , 0  , 0  , 255], // 
            yellow : [255,182, 85,255], // 
        };
        let colorFrames = [
            [],
            [ [ colors.base, colors.black ] ],
            [ [ colors.base, colors.red   ] ],
            [ [ colors.base, colors.blue  ] ],
            [ [ colors.base, colors.yellow] ],
            [ [ colors.base, colors.green ] ],
        ];
        let colorNames = [
            "(BASE)",
            "black",
            "red",
            "blue",
            "yellow",
            "green",
        ];
        let colorIndex = 0;

        let tests = [
            { name:"cBorder_fill",    blit:false, dx:6*8 , dy:6*8 , img:_GFX.currentData.L1.tilemaps.cBorder_fill             , settings:{}, },
        ];

        let drawFill = function(settings){
            gfxCoreV5.updateRegion_blit(
                tests[0].img.imgData.data,   // source
                tests[0].img.imgData.width,  // srcWidth
                imgDataCache.data,           // destination
                imgDataCache.width,          // destWidth
                imgDataCache.height,         // destHeight
                tests[0].dx,                 // dx
                tests[0].dy,                 // dy
                tests[0].img.imgData.width,  // w
                tests[0].img.imgData.height, // h
            );
            requestAnimationFrame(()=>{
                _GFX.layers[layerKey].ctx.putImageData(imgDataCache, 0, 0);
            });
        };
        drawFill(_GFX.defaultSettings);

        // Set interval to change the colors.
        let repeatsCount = 0;
        let repeatsMax = 2;
        let id = setInterval(()=>{
            if(colorIndex >= colorFrames.length){
                colorIndex = 0;
                repeatsCount += 1;
                if(repeatsCount == repeatsMax){
                    clearInterval(id);
                }
            }
            let settings = {
                colorData: colorFrames[colorIndex]
            };
            let ts = performance.now();
            drawFill(settings);
            console.log("drawFill:", (performance.now()-ts).toFixed(2), colorNames[colorIndex], settings);
            colorIndex += 1;
        }, 240);

        //  
        // { name:"cBorder_fill",    blit:false, dx:6*8 , dy:6*8 , img:_GFX.currentData.L1.tilemaps.cBorder_fill             , settings:{ rotation: 0 }, },
    },
    test2: function(){
        let layerKey = "L3";
        let imgDataCache = _GFX.layers[layerKey].imgDataCache;
        let colors = {
            base   : [255, 182, 85 , 255], // Yellow
            blue   : [36 , 72 , 170, 255], // 
            red    : [218, 0  , 0  , 255], // 
            green  : [0  , 145, 0  , 255], // 
            black  : [0  , 0  , 0  , 255], // 
        };
        let colorFrames = [
            [], // Yellow
            [ [ colors.base, colors.black ] ],
            [ [ colors.base, colors.red   ] ],
            [ [ colors.base, colors.blue  ] ],
            [ [ colors.base, colors.green ] ],
        ];
        let colorIndex = 0;

        let tests = [
            { name:"letter_uno_u",    blit:false, dx:2*8  , dy:6*8, img:_GFX.tilesets.bg_tiles1.tilemapImages.letter_uno_u    , settings:{}, },
            { name:"letter_uno_n",    blit:false, dx:10*8 , dy:6*8, img:_GFX.tilesets.bg_tiles1.tilemapImages.letter_uno_n    , settings:{}, },
            { name:"letter_uno_o",    blit:false, dx:18*8 , dy:6*8, img:_GFX.tilesets.bg_tiles1.tilemapImages.letter_uno_o    , settings:{}, },
        ];

        // Draw the initial graphics (UNO)
        let drawUno = function(settings){
            gfxCoreV5.updateRegion_blit(
                tests[0].img.imgData.data,   // source
                tests[0].img.imgData.width,  // srcWidth
                imgDataCache.data,           // destination
                imgDataCache.width,          // destWidth
                imgDataCache.height,         // destHeight
                tests[0].dx,                 // dx
                tests[0].dy,                 // dy
                tests[0].img.imgData.width,  // w
                tests[0].img.imgData.height, // h
            );
            gfxCoreV5.updateRegion_blit(
                tests[1].img.imgData.data,   // source
                tests[1].img.imgData.width,  // srcWidth
                imgDataCache.data,           // destination
                imgDataCache.width,          // destWidth
                imgDataCache.height,         // destHeight
                tests[1].dx,                 // dx
                tests[1].dy,                 // dy
                tests[1].img.imgData.width,  // w
                tests[1].img.imgData.height, // h
            );
            gfxCoreV5.updateRegion_blit(
                tests[2].img.imgData.data,   // source
                tests[2].img.imgData.width,  // srcWidth
                imgDataCache.data,           // destination
                imgDataCache.width,          // destWidth
                imgDataCache.height,         // destHeight
                tests[2].dx,                 // dx
                tests[2].dy,                 // dy
                tests[2].img.imgData.width,  // w
                tests[2].img.imgData.height, // h
            );
            requestAnimationFrame(()=>{
                _GFX.layers[layerKey].ctx.putImageData(imgDataCache, 0, 0);
            });
        };
        drawUno(_GFX.defaultSettings);

        let colorNames = [
            "yellow (BASE COLOR)",
            "black",
            "red",
            "blue",
            "green",
        ];

        // Set interval to change the colors.
        let repeatsCount = 0;
        let repeatsMax = 5;
        let id = setInterval(()=>{
            if(colorIndex >= colorFrames.length){
                colorIndex = 0;
                repeatsCount += 1;
                if(repeatsCount == repeatsMax){
                    clearInterval(id);
                }
            }
            let settings = {
                colorData: colorFrames[colorIndex]
            };
            let ts = performance.now();
            drawUno(settings);
            console.log("drawUno:", (performance.now()-ts).toFixed(2), colorNames[colorIndex]);
            colorIndex += 1;
        }, 240);
    },
    test: function(){
        let layerKey = "L3";
        let imgDataCache = _GFX.layers[layerKey].imgDataCache;
        let tests = [
            { name:"card_sm_1",       blit:false, dx:0*8 , dy:0*8 , img:_GFX.tilesets.bg_tiles1.tilemapImages.card_sm_1       , settings:{}, },
            { name:"card_sm_2",       blit:false, dx:3*8 , dy:0*8 , img:_GFX.tilesets.bg_tiles1.tilemapImages.card_sm_2       , settings:{ colorData: [ [ [ 218,0,0,255 ], [ 255,182,85,255 ] ] ]}, },
            { name:"card_sm_3",       blit:false, dx:6*8 , dy:0*8 , img:_GFX.tilesets.bg_tiles1.tilemapImages.card_sm_3       , settings:{ colorData: [ [ [ 218,0,0,255 ], [ 36,72,170,255  ] ] ]}, },
            { name:"card_sm_4",       blit:false, dx:9*8 , dy:0*8 , img:_GFX.tilesets.bg_tiles1.tilemapImages.card_sm_4       , settings:{ colorData: [ [ [ 218,0,0,255 ], [ 0,145,0,255    ] ] ]}, },
            { name:"card_sm_5",       blit:false, dx:12*8, dy:0*8 , img:_GFX.tilesets.bg_tiles1.tilemapImages.card_sm_5       , settings:{ rotation: 90 }, },
            { name:"card_sm_6",       blit:false, dx:16*8, dy:0*8 , img:_GFX.tilesets.bg_tiles1.tilemapImages.card_sm_6       , settings:{ colorData: [ [ [ 218,0,0,255 ], [ 255,182,85,255 ] ] ]}, },
            { name:"card_sm_7",       blit:false, dx:19*8, dy:0*8 , img:_GFX.tilesets.bg_tiles1.tilemapImages.card_sm_7       , settings:{ colorData: [ [ [ 218,0,0,255 ], [ 36,72,170,255  ] ] ]}, },
            { name:"card_sm_8",       blit:false, dx:22*8, dy:0*8 , img:_GFX.tilesets.bg_tiles1.tilemapImages.card_sm_8       , settings:{ colorData: [ [ [ 218,0,0,255 ], [ 0,145,0,255    ] ] ]}, },
            { name:"card_sm_9",       blit:false, dx:25*8, dy:0*8 , img:_GFX.tilesets.bg_tiles1.tilemapImages.card_sm_9       , settings:{}, },
            { name:"border1_col",     blit:false, dx:0*8 , dy:4*8 , img:_GFX.tilesets.bg_tiles1.tilemapImages.border1_col     , settings:{ bgColorRgba: [0,255,0,255] }, },
            { name:"border1_col",     blit:false, dx:6*8 , dy:5*8 , img:_GFX.tilesets.bg_tiles1.tilemapImages.border1_col     , settings:{} },
            { name:"card_sm_draw2",   blit:false, dx:0*8 , dy:6*8 , img:_GFX.tilesets.bg_tiles1.tilemapImages.card_sm_draw2   , settings:{ colorData: [ [ [ 218,0,0,255 ], [ 255,182,85,255 ] ] ]}, },
            { name:"card_sm_reverse", blit:false, dx:3*8 , dy:6*8 , img:_GFX.tilesets.bg_tiles1.tilemapImages.card_sm_reverse , settings:{ colorData: [ [ [ 218,0,0,255 ], [ 36,72,170,255  ] ] ]}, },
            { name:"card_sm_skip",    blit:false, dx:6*8 , dy:6*8 , img:_GFX.tilesets.bg_tiles1.tilemapImages.card_sm_skip    , settings:{ colorData: [ [ [ 218,0,0,255 ], [ 0,145,0,255    ] ] ]}, },
            { name:"letter_uno_u",    blit:false, dx:0*8 , dy:10*8, img:_GFX.tilesets.bg_tiles1.tilemapImages.letter_uno_u    , settings:{}, },
            { name:"cursor1_f1",      blit:true , dx:1*8 , dy:11*8, img:_GFX.tilesets.sprite_tiles1.tilemapImages.cursor1_f1  , settings:{ rotation: 0 }, },
            { name:"cursor1_f1",      blit:true , dx:5*8 , dy:11*8, img:_GFX.tilesets.sprite_tiles1.tilemapImages.cursor1_f1  , settings:{ rotation: 0 }, },
            { name:"cursor1_f1",      blit:true , dx:2*8 , dy:3*8 , img:_GFX.tilesets.sprite_tiles1.tilemapImages.cursor1_f1  , settings:{ rotation: 0 }, },
            { name:"cursor1_f1",      blit:true , dx:2*8 , dy:4*8 , img:_GFX.tilesets.sprite_tiles1.tilemapImages.cursor1_f1  , settings:{ rotation: 0 }, },
            { name:"cursor1_f1",      blit:true , dx:10*8, dy:3*8 , img:_GFX.tilesets.sprite_tiles1.tilemapImages.cursor1_f1  , settings:{ rotation: 0 }, },
            { name:"cursor1_f1",      blit:true , dx:10*8, dy:4*8 , img:_GFX.tilesets.sprite_tiles1.tilemapImages.cursor1_f1  , settings:{ rotation: 0 }, },
            // { name:"cBorder_fill",    blit:false, dx:6*8 , dy:6*8 , img:_GFX.currentData.L1.tilemaps.cBorder_fill             , settings:{ rotation: 0 }, },
        ];
        
        let index = 0;
        let times = [];
        let id = setInterval(()=>{
            if(index >= tests.length){ 
                index = 0; 
                let totalTime = times.reduce((acc, curr)=> acc + curr.time, 0);
                times.forEach(d=>{
                    d.time = d.time.toFixed(2);
                });
                console.log("TESTS ARE DONE:", totalTime.toFixed(2), times);
                clearInterval(id);
                return;
            }
            let rec = tests[index];
            let ts = performance.now();
            gfxCoreV5.updateRegion_blit(
                rec.img.imgData.data,   // source
                rec.img.imgData.width,  // srcWidth
                imgDataCache.data,      // destination
                imgDataCache.width,     // destWidth
                imgDataCache.height,    // destHeight
                rec.dx,                 // dx
                rec.dy,                 // dy
                rec.img.imgData.width,  // w
                rec.img.imgData.height, // h
            );
            ts = performance.now() - ts;
            let entry = {
                name: rec.name, 
                time: ts, 
                transforms: "", 
            };
            let transforms = [];
            if(rec.blit)                                                   { transforms.push("blit");      }
            if(rec.settings.xFlip)                                         { transforms.push("xFlip");     }
            if(rec.settings.yFlip)                                         { transforms.push("yFlip");     }
            if(rec.settings.rotation)                                      { transforms.push("rotation");  }
            if(rec.settings.colorData && rec.settings.colorData.length)    { transforms.push("recolored"); }
            if(rec.settings.bgColorRgba && rec.settings.bgColorRgba.length){ transforms.push("addBg");     }
            entry.transforms = JSON.stringify(transforms);
            
            times.push(entry);
            index += 1;
            requestAnimationFrame(()=>{
                _GFX.layers[layerKey].ctx.putImageData(imgDataCache, 0, 0);
            });
        }, 0);
    },
};
