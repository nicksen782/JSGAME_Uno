// external_umd_module.js
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.createGraphicsAssets = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    // Fade masks for fading rgb332 tiles.
    const fadeMasks = [
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
    ].reverse();

    // Fade masks for fading rgb32 tiles/ImageData.
    const fadeMasksRGBA = [];
    function createRgbaFadeValues(){
        let src = fadeMasks;
        let b,g,r;

        for(let i=0, l=src.length; i<l; i+=1){
            // console.log( {
            //     "index:"      : i,
            //     "hex_string"  : "0x"+src[i].toString(16).toUpperCase().padStart(2, "0"), 
            //     "dec"         : src[i], 
            //     "bin_string_b": ( (src[i] & 0b11000000) >> 6 ).toString(2).padStart(2, "0"), 
            //     "bin_string_g": ( (src[i] & 0b00111000) >> 3 ).toString(2).padStart(3, "0"), 
            //     "bin_string_r": ( (src[i] & 0b00000111) >> 0 ).toString(2).padStart(3, "0"),
            // } );

            // Add the values in reverse order (round down to the nearest whole integer).
            r = ( ( ( ( src[i] & 0b00000111 ) >> 0) / 7 ) * 100 ) << 0;
            g = ( ( ( ( src[i] & 0b00111000 ) >> 3) / 7 ) * 100 ) << 0;
            b = ( ( ( ( src[i] & 0b11000000 ) >> 6) / 3 ) * 100 ) << 0;
            fadeMasksRGBA.unshift( new Uint8ClampedArray([ r, g, b ]) ); 
        }
        fadeMasksRGBA.reverse();
    };
    // Modifies the supplied Uint8ClampedArray and applies a fade to each pixel (Uint8ClampedArray) (by reference.)
    function applyFadeToImageDataArray(typedData, fadeLevel){
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
            let fadeColorObj = fadeMasksRGBA[fadeLevel];
            let maxRed   = fadeColorObj[0] / 100; 
            let maxGreen = fadeColorObj[1] / 100; 
            let maxBlue  = fadeColorObj[2] / 100; 
            
            // Restrict r, g, b, a values and then round down.
            for(let i=0; i<len; i+=4){
                // Don't operate on transparent pixels.
                if(typedData[i+3] != 255){ continue; } 

                typedData[i+0] =  (typedData[i+0] * maxRed)   | 0;
                typedData[i+1] =  (typedData[i+1] * maxGreen) | 0;
                typedData[i+2] =  (typedData[i+2] * maxBlue)  | 0;
                typedData[i+3] =  (typedData[i+3])            | 0;
            }
        }
    }

    // Modifies the supplied rgbaArray and applies a fade to it.
    function applyFadeToRgbaArray(rgbaArray, fadeLevel){
        if(fadeLevel === null){ return rgbaArray; }     // OFF
        else if(fadeLevel == 10){ return [0,0,0,255]; } // BLACK
        else if(fadeLevel == 11){ return [0,0,0,0]; }   // CLEAR

        // Need the max values.
        let fadeColorObj = fadeMasksRGBA[fadeLevel];
        let maxRed   = fadeColorObj[0] / 100; 
        let maxGreen = fadeColorObj[1] / 100; 
        let maxBlue  = fadeColorObj[2] / 100; 

        // Restrict r, g, b, a values and then round down.
        rgbaArray[0] =  (rgbaArray[0] * maxRed)   | 0;
        rgbaArray[1] =  (rgbaArray[1] * maxGreen) | 0;
        rgbaArray[2] =  (rgbaArray[2] * maxBlue)  | 0;
        rgbaArray[3] =  (rgbaArray[3])            | 0;

        return rgbaArray;
    };

    // UNUSED
    // Sets pixelated values on the specified ctx.
    function setPixelated(ctx){
        ctx.mozImageSmoothingEnabled    = false; // Firefox
        ctx.imageSmoothingEnabled       = false; // Firefox
        ctx.oImageSmoothingEnabled      = false; //
        ctx.webkitImageSmoothingEnabled = false; //
        ctx.msImageSmoothingEnabled     = false; //
    }

    // UNUSED.
    // Returns a copy of a rgb332 tile that has had the specified fade applied to it.
    function rgb332TileToFadedRgb332Tile(tileData, config, fadeLevel){
        let tileHeight        = config.tileHeight;
        let tileWidth         = config.tileWidth;
        let translucent_color = config.translucent_color;
        let fadeMask = fadeMasks[fadeLevel];

        let tileDataRgb332 = new Uint8ClampedArray( tileWidth * tileHeight);

        let transparentPixelCounter = 0;
        let rgb332_index = 0;

        for(let rgb332_byte of tileData){
            // Do not change translucent pixels. 
            if(rgb332_byte == translucent_color){
                tileDataRgb332[rgb332_index] = translucent_color;
                transparentPixelCounter += 1;
            }

            // Update the pixel. 
            else{
                tileDataRgb332[rgb332_index] = rgb332_byte & fadeMask;
            }

            // Increment the index.
            rgb332_index+=1;
        }

        return {
            hasTransparency   : transparentPixelCounter ? true : false, 
            isFullyTransparent: transparentPixelCounter == tileData.length, 
            tileDataRgb332    : tileDataRgb332,
        }
    }

    // Returns a copy of a rgb332 tile converted to rgba32.
    function rgb332TileDataToRgba32(tileData, config){
        let tileHeight        = config.tileHeight;
        let tileWidth         = config.tileWidth;
        let translucent_color = config.translucent_color;

        let tileDataRgb32 = new Uint8ClampedArray( tileWidth * tileHeight * 4);

        let transparentPixelCounter = 0;

        let rgba32_index = 0;
        let nR;
        let nG;
        let nB;
        let nA;
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
    }

    // Downloads each tileset json file and performs the initial parsing.
    async function getAndParseGraphicsData(tilesetFiles){
        let rgb332_tilesets = {};

        let proms = [];
        for(let f=0; f<tilesetFiles.length; f+=1){
            proms.push(
                new Promise(async(res,rej)=>{
                    let file = await(
                        await fetch( tilesetFiles[f] )
                    ).json();

                    let tileset = {
                        config     : file.config      ?? {},
                        tilemaps   : {}, // file.tilemaps    ?? {},
                        tileset    : [], // file.tileset     ?? [],
                        tilesetName: file.tilesetName ?? "",
                    };
            
                    // Tile data: Parse/convert the JSON-string(s) to Uint8ClampedArray.
                    if(file.tileset){
                        for(let tileId in file.tileset){ 
                            let tile = new Uint8ClampedArray( JSON.parse(file.tileset[tileId]) );
                            tileset.tileset[tileId] = {
                                org_rgb332: tile
                            }; 
                        }
                    }
            
                    // Tilemap data: Parse/convert the JSON-string(s) to Uint8ClampedArray.
                    if(file.tilemaps){
                        for(let key in file.tilemaps){ 
                            let tilemap = new Uint8ClampedArray( JSON.parse(file.tilemaps[key]) );
                            tileset.tilemaps[key] = {
                                org_rgb332: tilemap
                            }; 
                        }
                    }
            
                    // Add the tileset.
                    rgb332_tilesets[tileset.tilesetName] = tileset;
                    res();
                })
            );
        }
        await Promise.all(proms);

        // Return the parsed tilesets.
        return rgb332_tilesets;
    }

    // Creates the graphical assets and faded graphical assets.
    async function createGraphicsAssets(rgb332_tilesets){
        let finishedTilesets = {};

        // Create the tileset.
        let proms1 = [];
        for(let tsKey in rgb332_tilesets){
            proms1.push(
                new Promise(async(res,rej)=>{
                    // Is a tileset key defined?
                    if(!rgb332_tilesets[tsKey].tileset){ res(); return; }

                    // Break-out some values. 
                    let tilesetName       = rgb332_tilesets[tsKey].tilesetName; // Also equal to ts.
                    let tileHeight        = rgb332_tilesets[tsKey].config.tileHeight;
                    let tileWidth         = rgb332_tilesets[tsKey].config.tileWidth;
        
                    // Start the new tileset entry.
                    finishedTilesets[ tilesetName ] = {
                        config     : rgb332_tilesets[tsKey].config,
                        tilemaps   : {},
                        tileset    : [],
                        tilesetName: tilesetName,
                    };

                    let tileIndex = 0;
                    for(let tileId in rgb332_tilesets[tsKey].tileset){
                        // Copy of the original rgb332 tile.
                        let rgb332Src = new Uint8ClampedArray( rgb332_tilesets[tsKey].tileset[tileId].org_rgb332.slice() );

                        // Start the object for this tile.
                        let newTile = {
                            // Image Data
                            imgData: new ImageData(tileWidth, tileHeight),

                            // Flags: transparency.
                            hasTransparency   : false, 
                            isFullyTransparent: false, 
                        };

                        // Generate rgba32 tile data from rgb332 data and save.
                        let tileDataRgba = rgb332TileDataToRgba32(rgb332Src, rgb332_tilesets[tsKey].config);
                        newTile.imgData.data.set(tileDataRgba.tileDataRgb32);
                        newTile.hasTransparency    = tileDataRgba.hasTransparency;
                        newTile.isFullyTransparent = tileDataRgba.isFullyTransparent;

                        // Save this tile.
                        finishedTilesets[ tilesetName ].tileset[tileIndex] = newTile;
                        tileIndex+=1;
                    }

                    // Tilemaps.
                    for(let tilemapKey in rgb332_tilesets[tsKey].tilemaps){
                        finishedTilesets[ tilesetName ].tilemaps[tilemapKey] = rgb332_tilesets[tsKey].tilemaps[tilemapKey].org_rgb332.slice();
                    }
                    res();
                })
            );
        }
        await Promise.all(proms1);

        // Return the completed tilesets.
        return finishedTilesets;
    }


    // CLEAR a region from the source (Uint8ClampedArray).
    function clearRegion(source, srcWidth, dx, dy, w, h) {
        let maxX = srcWidth;
        let maxY = source.length / srcWidth;

        let x_start = dx < 0 ? 0 : dx;
        let x_end = dx + w > maxX ? maxX : dx + w;
        let y_start = dy < 0 ? 0 : dy;
        let y_end = dy + h > maxY ? maxY : dy + h;

        // Entire region to be cleared lies outside the valid source area.
        if (x_start == maxX || y_start == maxY || x_end == 0 || y_end == 0) {
            return;
        }

        for (let y = y_start; y < y_end; y++) {
            for (let x = x_start; x < x_end; x++) {
                let index = (y * srcWidth + x) << 2;
                source[index] = source[index + 1] = source[index + 2] = source[index + 3] = 0;
            }
        }
    }

    // COPY a region from the source to a new Uint8ClampedArray.
    function copyRegion(source, srcWidth, dx, dy, w, h) {
        let maxX = srcWidth;
        let maxY = source.length / srcWidth;

        let x_start = dx < 0 ? 0 : dx;
        let y_start = dy < 0 ? 0 : dy;
        let x_end = dx + w > maxX ? maxX : dx + w;
        let y_end = dy + h > maxY ? maxY : dy + h;

        // Adjust w, h based on any out-of-bounds portion
        if (dx < 0) w += dx;
        if (dy < 0) h += dy;

        // Exit if the region to be copied is entirely out-of-bounds
        if (x_start >= maxX || y_start >= maxY || x_end <= 0 || y_end <= 0 || w <= 0 || h <= 0) {
            return new Uint8ClampedArray();
        }

        let resultData = new Uint8ClampedArray(w * h * 4);
        let resultIndex = 0;

        for (let y = y_start; y < y_end; y++) {
            for (let x = x_start; x < x_end; x++) {
                let srcIndex = (y * srcWidth + x) * 4;
                for (let k = 0; k < 4; k++) {
                    resultData[resultIndex + k] = source[srcIndex + k];
                }
                resultIndex += 4;
            }
        }

        return resultData;
    }

    // BLIT a region in the destination with the source data (Uint8ClampedArray.)
    function updateRegion_blit(source, srcWidth, destination, destWidth, destHeight, dx, dy, w, h) {
        let x_start = dx < 0 ? 0 : dx;
        let x_end = dx + w > destWidth ? destWidth : dx + w;
        let y_start = dy < 0 ? 0 : dy;
        let y_end = dy + h > destHeight ? destHeight : dy + h;

        // Entire region to be blitted lies outside the valid destination area.
        if (x_start == destWidth || y_start == destHeight || x_end == 0 || y_end == 0) {
            return;
        }

        for (let y = y_start; y < y_end; y++) {
            for (let x = x_start; x < x_end; x++) {
                let srcOffset = ((y - dy) * srcWidth + (x - dx)) << 2;
                let destOffset = (y * destWidth + x) << 2;

                let r = source[srcOffset],
                    g = source[srcOffset + 1],
                    b = source[srcOffset + 2],
                    a = source[srcOffset + 3];

                if(a == 0) { continue; }

                destination[destOffset] = r;
                destination[destOffset + 1] = g;
                destination[destOffset + 2] = b;
                destination[destOffset + 3] = a;
            }
        }
    }

    // REPLACE a region in the destination with the source data (Uint8ClampedArray.)
    function updateRegion_replace(source, srcWidth, destination, destWidth, destHeight, dx, dy, w, h) {
        // source and destination should both be Uint8ClampedArray. 

        let x_start = dx < 0 ? 0 : dx;
        let x_end = dx + w > destWidth ? destWidth : dx + w;
        let y_start = dy < 0 ? 0 : dy;
        let y_end = dy + h > destHeight ? destHeight : dy + h;

        // Entire region to be replaced lies outside the valid destination area.
        if (x_start >= destWidth || y_start >= destHeight || x_end <= 0 || y_end <= 0) {
            return;
        }

        for (let y = y_start; y < y_end; y++) {
            let srcOffset = ((y - dy) * srcWidth + (x_start - dx)) << 2;
            let destOffset = (y * destWidth + x_start) << 2;

            let srcRowStart  = srcOffset;
            let srcRowEnd = srcOffset + ((x_end - x_start) << 2);
            let destRowStart = destOffset;

            // Copy the entire row at once.
            destination.set(source.subarray(srcRowStart, srcRowEnd), destRowStart);
        }
    };


    // Performs the graphics processing functions. 
    async function process(tilesetFiles){
        let ts1 = performance.now();
        let rgb332_tilesets = await getAndParseGraphicsData(tilesetFiles);
        let ts1e = performance.now() - ts1;
        
        let ts2 = performance.now();
        let finishedTilesets = await createGraphicsAssets(rgb332_tilesets);
        let ts2e = performance.now() - ts2;
        
        // Create the RGBA fade values.
        let ts3 = performance.now();
        createRgbaFadeValues();
        let ts3e = performance.now() - ts3;

        return {
            finishedTilesets: finishedTilesets,
            timings: {
                getAndParseGraphicsData: ts1e,
                createGraphicsAssets   : ts2e,
                createRgbaFadeValues   : ts3e,
            },
        }
    }

    return {
        // Init processing.
        process : process,

        // Copy, update, clear of regions (Uint8ClampedArray.)
        // updateRegion : updateRegion,
        updateRegion_blit : updateRegion_blit,
        updateRegion_replace : updateRegion_replace,
        copyRegion   : copyRegion,
        clearRegion  : clearRegion,

        // Fades (Uint8ClampedArray.)
        applyFadeToRgbaArray    : applyFadeToRgbaArray,
        applyFadeToImageDataArray : applyFadeToImageDataArray,
    };
}));
