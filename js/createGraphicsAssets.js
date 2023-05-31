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

    // **********
    // * FADING *
    // **********

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
        let r,g,b;

        for(let i=0, l=src.length; i<l; i+=1){
            // console.log( {
            //     "index:"      : i,
            //     "hex_string"  : "0x"+src[i].toString(16).toUpperCase().padStart(2, "0"), 
            //     "dec"         : src[i], 
            //     "bin_string"  : src[i].toString(2).padStart(8, "0"), 
            //     "bin_string_b": ( (src[i] & 0b11000000) >> 6 ).toString(2).padStart(2, "0"), 
            //     "bin_string_g": ( (src[i] & 0b00111000) >> 3 ).toString(2).padStart(3, "0"), 
            //     "bin_string_r": ( (src[i] & 0b00000111) >> 0 ).toString(2).padStart(3, "0"),
            // } );

            // Add the values in order (round down to the nearest whole integer).
            r = ( ( ( ( src[i] & 0b00000111 ) >> 0) / 7 ) * 100 ) << 0;
            g = ( ( ( ( src[i] & 0b00111000 ) >> 3) / 7 ) * 100 ) << 0;
            b = ( ( ( ( src[i] & 0b11000000 ) >> 6) / 3 ) * 100 ) << 0;
            fadeMasksRGBA.push( new Uint8Array([ r, g, b ]) ); 
        }
    };
    
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

    // *********************
    // * VALUE CONVERSIONS *
    // *********************

    // Returns a hash for the specified string. (Variation of Dan Bernstein's djb2 hash.)
    function _djb2Hash(str) {
        if(typeof str != "string") { str = str.toString(); }
        var hash = 5381;
        for (var i = 0; i < str.length; i++) {
            hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
        }
        return hash;
    };

    // UNUSED
    // Convert JsAlpha (0.0 - 1.0) to Uint8 (0-255) alpha.
    function convertJsAlphaToUint8Alpha(JsAlpha){
        return  Math.round(JsAlpha * 255);
    };

    // UNUSED
    // Convert Uint8 (0-255) alpha to JsAlpha (0.0 - 1.0).
    function convertUint8AlphaToJsAlpha(Uint8Alpha){
        // return Number((Uint8Alpha / 255).toFixed(2));
        return ( ( (Uint8Alpha/255) * 100 ) |0 ) / 100;
    };

    // UNUSED
    // Convert 32-bit rgba value to array having values for r,g,b,a. (alpha 0-255 or 0.1)
    function bits32ToRgbaArray(bits32Value, alphaAsFloat=false){
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
    };

    // Convert array having values for r,g,b,a to 32-bit rgba value.
    function rgbaTo32bit(rgbaArray){
        // Break out the values in rgbaArray.
        let [r, g, b, a] = rgbaArray;
        
        // Generate the 32-bit version of the rgbaArray.
        // let fillColor = (a << 24) | (b << 16) | (g << 8) | r;
        let fillColor = ((a << 24) | (b << 16) | (g << 8) | r) >>> 0;
        
        // Return the result.
        return fillColor;
    };

    // *************************
    // * IMAGE DATA TRANSFORMS *
    // *************************

    // Replaces the specified color pixels with the replacement bgColor.
    function setImageDataBgColorRgba(imageData, findColorArray, replaceColorArray){
        // Get the 32-bit value for the [r,g,b,a] values provided.
        let findColor_32bit    = rgbaTo32bit(findColorArray);
        let replaceColor_32bit = rgbaTo32bit(replaceColorArray);

        // Create a Uint32Array view of the imgDataCache for this layer.
        let uint32Data = new Uint32Array(imageData.data.buffer);

        // Find the findColor and replace with the replacementColor.
        for (let p = 0, len = uint32Data.length; p < len; ++p) {
            if (uint32Data[p] === findColor_32bit) { uint32Data[p] = replaceColor_32bit; }
        }
    };

    // Modifies the supplied Uint8Array and applies a fade to each pixel (Uint8Array) (by reference.)
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

    // Flips ImageData horizontally. (By reference, changes source imageData.)
    function flipImageDataHorizontally(imageData) {
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
    };

    // Flips ImageData vertically. (By reference, changes source imageData.)
    function flipImageDataVertically(imageData) {
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
    };
    
    // Rotates ImageData by the specified degrees. (Changes source imageData. Uses temporary copy.)
    function rotateImageData(imageData, degrees) {
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
    };
    
    // Replaces colors in ImageData. (By reference, changes source imageData.)
    function replaceColors(imageData, colorReplacements) {
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
    };

    // **********************
    // * IMAGE DATA UPDATES *
    // **********************

    // Function to CLEAR a region from the source image (represented as a Uint8Array).
    function clearRegion(source, srcWidth, dx, dy, w, h) {
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
    };

    // COPY a region from the source to a new Uint8Array.
    function copyRegion(source, srcWidth, dx, dy, w, h) {
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
    };

    // BLIT a region in the destination with the source data (Uint8Array.)
    // Writes pixels that are NOT fully transparent. (slower than replace.)
    function updateRegion_blit(source, srcWidth, destination, destWidth, destHeight, dx, dy, w, h) {
        // Determine the start and end of the destination region in both dimensions.
        // If dx or dy are negative (indicating a region starting outside the actual source data), they're clamped to 0.
        let x_start = dx < 0              ? 0          : dx;
        let y_start = dy < 0              ? 0          : dy;

        // Similarly, if the destination extends beyond the source data, the end of the region is clamped.
        let x_end   = dx + w > destWidth  ? destWidth  : dx + w;
        let y_end   = dy + h > destHeight ? destHeight : dy + h;

        // If the entire destination region outside the valid source area, exit the function early.
        // This could occur if dx,dy and dx+w,dy+h both point outside the valid source area.
        if (x_start == destWidth || y_start == destHeight || x_end == 0 || y_end == 0) {
            return;
        }

        // Iterate through the region defined by x_start to x_end and y_start to y_end.
        for (let y = y_start; y < y_end; y++) {
            for (let x = x_start; x < x_end; x++) {
                // Compute the index offsets in the source and the destination arrays.
                let srcOffset  = ((y - dy) * srcWidth + (x - dx)) << 2;
                let destOffset = (y * destWidth + x) << 2;

                // Retrieve the RGBA values from the source.
                let r = source[srcOffset],
                    g = source[srcOffset + 1],
                    b = source[srcOffset + 2],
                    a = source[srcOffset + 3];

                // Skip transparent pixels in the source.
                if(a == 0) { continue; }

                // Write the RGBA values from the source to the destination.
                destination[destOffset] = r;
                destination[destOffset + 1] = g;
                destination[destOffset + 2] = b;
                destination[destOffset + 3] = a;
            }
        }
    };

    // REPLACE a region in the destination with the source data (Uint8Array.)
    // Writes pixels without checking for transparency. (faster than blit.)
    function updateRegion_replace(source, srcWidth, destination, destWidth, destHeight, dx, dy, w, h) {
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

            // Calculate the row end and start.
            let srcRowStart  = srcOffset;
            let srcRowEnd    = srcOffset + ((x_end - x_start) << 2);
            let destRowStart = destOffset;

            // Copy the entire row at once from the source to the destination.
            destination.set(source.subarray(srcRowStart, srcRowEnd), destRowStart);
        }
    };

    // **************
    // * PROCESSING *
    // **************

    // UNUSED.
    // Returns a copy of a rgb332 tile that has had the specified fade applied to it.
    function rgb332TileToFadedRgb332Tile(tileData, config, fadeLevel){
        let tileHeight        = config.tileHeight;
        let tileWidth         = config.tileWidth;
        let translucent_color = config.translucent_color;
        let fadeMask = fadeMasks[fadeLevel];

        let tileDataRgb332 = new Uint8Array( tileWidth * tileHeight);

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
    function _rgb332TileDataToRgba32(tileData, config){
        let tileHeight        = config.tileHeight;
        let tileWidth         = config.tileWidth;
        let translucent_color = config.translucent_color;

        let tileDataRgb32 = new Uint8Array( tileWidth * tileHeight * 4);

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
                            tileset.tileset[tileId] = {
                                org_rgb332: tile
                            }; 
                        }
                    }
            
                    // Tilemap data: Parse/convert the JSON-string(s) to Uint8Array.
                    if(file.tilemaps){
                        for(let key in file.tilemaps){ 
                            let tilemap = new Uint8Array( JSON.parse(file.tilemaps[key]) );
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
    async function _createGraphicsAssets(rgb332_tilesets, defaultSettings, debugActive, disableCache=false){
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
                    let tsObj = {
                        config       : rgb332_tilesets[tsKey].config,
                        tileset      : [], // Image data for each tile.
                        tilemaps     : {}, // Tilemap arrays.
                        tilemapImages: {}, // Image  data of each tilemap built up via tiles.
                        tilesetName  : tilesetName,
                    };
                    finishedTilesets[ tilesetName ] = tsObj;

                    let tileIndex = 0;
                    let rgb332Src;
                    let newTile;
                    let tmiObj;
                    let tileDataRgba;
                    for(let tileId in rgb332_tilesets[tsKey].tileset){
                        // Copy of the original rgb332 tile.
                        rgb332Src = new Uint8Array( rgb332_tilesets[tsKey].tileset[tileId].org_rgb332.slice() );

                        // Start the object for this tile.
                        newTile = {
                            // Image Data
                            imgData: new ImageData(tileWidth, tileHeight),

                            // Flags: transparency.
                            hasTransparency   : false, 
                            isFullyTransparent: false, 
                        };

                        // Generate rgba32 tile data from rgb332 data and save.
                        tileDataRgba = _rgb332TileDataToRgba32(rgb332Src, rgb332_tilesets[tsKey].config);
                        newTile.imgData.data.set(tileDataRgba.tileDataRgb32);
                        newTile.hasTransparency    = tileDataRgba.hasTransparency;
                        newTile.isFullyTransparent = tileDataRgba.isFullyTransparent;

                        // Save this tile.
                        tsObj.tileset[tileIndex] = newTile;
                        tileIndex+=1;
                    }

                    // Tilemaps.
                    for(let tilemapKey in rgb332_tilesets[tsKey].tilemaps){
                        tsObj.tilemaps[tilemapKey] = rgb332_tilesets[tsKey].tilemaps[tilemapKey].org_rgb332.slice();
                    }

                    // Tilemap images
                    let mapCount = 0;
                    let ts1 = performance.now();
                    if(disableCache == false){
                        let tmapArr;
                        let genTime;
                        let tile;
                        let missingTile;
                        let tileset = tsObj.tileset;
                        let mapW;
                        let mapH;
                        let index;
                        for(let tilemapKey in tsObj.tilemaps){
                            genTime = performance.now();

                            tmapArr = tsObj.tilemaps[tilemapKey];
                            mapW = tmapArr[0];
                            mapH = tmapArr[1];
                            index = 2;

                            // It is possible for an instance of the PrintText class to have an empty string for text. Height will be 1 but width will be 0. 
                            // Set mapW and mapH to 1 so that the image data can have actual dimensions.
                            // This will trigger missingTile (since there will not be a tile index after the dimensions) and leave the image data as an empty transparent tile.
                            if(mapW == 0 || mapH == 0){ mapW = 1; mapW = 1; mapH = 1; }

                            // Create the tilemap image.
                            tsObj.tilemapImages[tilemapKey] = {
                                "imgData"            : {
                                    width : mapW * tileWidth,
                                    height: mapH * tileHeight,
                                    data : new Uint8Array( (mapW * tileWidth) * (mapH * tileHeight) * 4 )
                                }, 
                                "ts"                 : tsObj.tilesetName, 
                                "settings"           : defaultSettings, 
                                "tmap"               : tmapArr, 
                                "w"                  : mapW * tileWidth, 
                                "h"                  : mapH * tileHeight, 
                                "hasTransparency"    : false, 
                                "isFullyTransparent" : true, 
                                "removeHashOnRemoval": false, 
                                "mapKey"             : tilemapKey, 
                                "relatedMapKey"      : tilemapKey, 
                                "hashCacheHash_BASE" : _djb2Hash( JSON.stringify(
                                    {
                                        ts      : tsObj.tilesetName,
                                        settings: JSON.stringify(defaultSettings),
                                        tmap    : Array.from(tmapArr),
                                    }
                                )), 
                                "hashCacheHash"      : 0, 
                                "hashCacheDataLength": 0, 
                                "genTime"            : 0,
                                "origin"             : "INIT_PRECACHE",
                            };
                            tmiObj = tsObj.tilemapImages[tilemapKey];
                            tmiObj.hashCacheHash = tmiObj.hashCacheHash_BASE;

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
                                        updateRegion_replace(
                                            tile.imgData.data,     // source
                                            tile.imgData.width,    // srcWidth
                                            tmiObj.imgData.data,   // destination
                                            tmiObj.imgData.width,  // destWidth
                                            tmiObj.imgData.height, // destHeight
                                            x * tileWidth,         // x
                                            y * tileHeight,        // y
                                            tileWidth,             // w
                                            tileHeight,            // h
                                        );
                                    }
                                    else{ 
                                        console.log("missing tile"); 
                                        throw "missing tile"; 
                                    }

                                    // Increment the tile index in the tilemap.
                                    index++;
                                }
                            }

                            tmiObj.hashCacheDataLength = JSON.stringify({
                                imgData  : Array.from(tmiObj.imgData.data),
                                ts       : tmiObj.ts,
                                settings : tmiObj.settings,
                                tmap     : tmiObj.tmap,
                                w        : tmiObj.imgData.width, 
                                h        : tmiObj.imgData.height,
                                mapKey   : tmiObj.mapKey, 
                            });
                            genTime = performance.now() - genTime;
                            tmiObj.genTime = genTime;

                            mapCount += 1;
                        }
                    }
                    
                    if(debugActive && disableCache == false){
                        ts1 = performance.now() - ts1;
                        console.log(`_createGraphicsAssets: tileset: '${tilesetName.padEnd(15, " ")}', MAPS PRE-LOADED: '${mapCount}', TIME: '${ts1.toFixed(2)} ms'`);
                    }

                    res();
                })
            );
        }
        await Promise.all(proms1);

        // Return the completed tilesets.
        return finishedTilesets;
    }

    // Performs the graphics processing functions. 
    async function process(tilesetFiles, defaultSettings, debugActive, disableCache){
        console.log(`debugActive: ${debugActive}, disableCache: ${disableCache}`);
        let ts1 = performance.now();
        let rgb332_tilesets = await getAndParseGraphicsData(tilesetFiles);
        let ts1e = performance.now() - ts1;
        
        let ts2 = performance.now();
        let finishedTilesets = await _createGraphicsAssets(rgb332_tilesets, defaultSettings, debugActive, disableCache);
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

        // Background color fade.
        rgbaTo32bit          : rgbaTo32bit,
        applyFadeToRgbaArray : applyFadeToRgbaArray,

        // Transforms.
        setImageDataBgColorRgba : setImageDataBgColorRgba,
        applyFadeToImageDataArray : applyFadeToImageDataArray,
        flipImageDataHorizontally : flipImageDataHorizontally,
        flipImageDataVertically   : flipImageDataVertically,
        rotateImageData           : rotateImageData,
        replaceColors             : replaceColors,

        // Copy, update, clear of regions (Uint8Array.)
        updateRegion_blit    : updateRegion_blit,
        updateRegion_replace : updateRegion_replace,
        copyRegion           : copyRegion,
        clearRegion          : clearRegion,
    };
}));
