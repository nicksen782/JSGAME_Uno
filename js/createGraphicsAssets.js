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
        0x40, //     1 // 64  // 1 0 0 // 01 000 000 // 33  0   0   
        0x88, //     2 // 136 // 2 1 0 // 10 001 000 // 66  14  0   
        0x91, //     3 // 145 // 2 2 1 // 10 010 001 // 66  28  14  
        0xD2, //     4 // 210 // 3 2 2 // 11 010 010 // 100 28  28  
        0xE4, //     5 // 228 // 3 4 4 // 11 100 100 // 100 57  57  
        0xAD, //     6 // 173 // 2 5 5 // 10 101 101 // 66  71  71  
        0xB5, //     7 // 181 // 2 6 5 // 10 110 101 // 66  85  71  
        0xB6, //     8 // 182 // 2 6 6 // 10 110 110 // 66  85  85  
        0xBE, //     9 // 190 // 2 7 6 // 10 111 110 // 66  100 85  
        0xBF, //    10 // 191 // 2 7 7 // 10 111 111 // 66  100 100 
        // 0xFF, //    11 // 255 // 3 7 7 // 11 111 111 // 100 100 100 
    ].reverse();
    
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
        // tileDataRgb32.fill(0);

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
            if(rgb332_byte == translucent_color){ transparentPixelCounter += 1; }

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

    // Sets pixelated values on the specified ctx.
    function setPixelated(ctx){
        ctx.mozImageSmoothingEnabled    = false; // Firefox
        ctx.imageSmoothingEnabled       = false; // Firefox
        ctx.oImageSmoothingEnabled      = false; //
        ctx.webkitImageSmoothingEnabled = false; //
        ctx.msImageSmoothingEnabled     = false; //
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
    async function createGraphicsAssets(rgb332_tilesets, createFadeTilesets){
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
                        // Two copies of canvas and ctx each.
                        // let canvasSrc = new OffscreenCanvas(tileWidth, tileHeight);
                        // let canvas    = new OffscreenCanvas(tileWidth, tileHeight);
                        // let ctxSrc = canvasSrc.getContext("2d", { willReadFrequently: true });
                        // let ctx    = canvas.getContext("2d", { willReadFrequently: true });

                        // Start the object for this tile.
                        let newTile = {
                            // Copy (not referrence) of the original rgb332 data.
                            rgb332Src: new Uint8ClampedArray( rgb332_tilesets[tsKey].tileset[tileId].org_rgb332.slice() ),
        
                            // Not-changing copy of the Image Data (can be copied.)
                            // imgDataSrc: ctx.createImageData(tileWidth, tileHeight),
                            
                            // Image Data (for use.)
                            imgData: new ImageData(tileWidth, tileHeight),
                            
                            // Canvas/ctx (Source versions)
                            // canvasSrc: canvasSrc,
                            // ctxSrc: ctxSrc,
        
                            // Canvas/ctx (for use.)
                            // canvas: canvas,
                            // ctx: ctx,
        
                            // Faded tiles.
                            fadeTiles: [],
        
                            // Flags.
                            hasTransparency   : false, 
                            isFullyTransparent: false, 
                        };

                        // Generate rgba32 tile data from rgb332 data and save.
                        let tileDataRgba = rgb332TileDataToRgba32(newTile.rgb332Src, rgb332_tilesets[tsKey].config);
                        // newTile.imgDataSrc.data.set(tileDataRgba.tileDataRgb32);
                        newTile.imgData.data.set(tileDataRgba.tileDataRgb32);
                        newTile.hasTransparency    = tileDataRgba.hasTransparency;
                        newTile.isFullyTransparent = tileDataRgba.isFullyTransparent;
        
                        // Draw the image to the canvas.
                        // ctxSrc.putImageData(newTile.imgData, 0, 0);
                        // ctx.putImageData(newTile.imgData, 0, 0);

                        // FADE?
                        if(createFadeTilesets){
                            for(let level = 0; level<fadeMasks.length; level+=1){
                                // let canvasSrc2 = new OffscreenCanvas(tileWidth, tileHeight);
                                // let canvas2    = new OffscreenCanvas(tileWidth, tileHeight);
                                // let ctxSrc2 = canvasSrc2.getContext("2d", { willReadFrequently: true });
                                // let ctx2    = canvas2.getContext("2d", { willReadFrequently: true });
        
                                let tileDataRgb = rgb332TileToFadedRgb332Tile(newTile.rgb332Src, rgb332_tilesets[tsKey].config, level);
        
                                let newFadeTile = {
                                    rgb332Src :tileDataRgb.tileDataRgb332,
                                    // imgDataSrc: ctx2.createImageData(tileWidth, tileHeight),
                                    imgData   : new ImageData(tileWidth, tileHeight),
                                    // canvasSrc : canvasSrc2,
                                    // ctxSrc    : ctxSrc2,
                                    // canvas    : canvas2,
                                    // ctx       : ctx2,
                                    hasTransparency   : false, // tileDataRgb.hasTransparency, 
                                    isFullyTransparent: false, // tileDataRgb.isFullyTransparent, 
                                };
        
                                // Generate rgba32 tile data from rgb332 data and save.
                                let tileDataRgba2 = rgb332TileDataToRgba32(newFadeTile.rgb332Src, rgb332_tilesets[tsKey].config);
                                // newFadeTile.imgDataSrc.data.set(tileDataRgba2.tileDataRgb32);
                                newFadeTile.imgData.data.set(tileDataRgba2.tileDataRgb32);
                                newFadeTile.hasTransparency    = tileDataRgba2.hasTransparency;
                                newFadeTile.isFullyTransparent = tileDataRgba2.isFullyTransparent;
        
                                // Draw the image to the canvas.
                                // ctxSrc.putImageData(newFadeTile.imgData, 0, 0);
                                // ctx2.putImageData(newFadeTile.imgData, 0, 0);
        
                                newTile.fadeTiles[level] = newFadeTile;
                            }
                        }
                        else{}

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
        
        // let proms2 = [];
        // for(let tsKey in rgb332_tilesets){
        //     proms.push(
        //         new Promise(async(res,rej)=>{
        //             // Is a tileset key defined?
        //             if(!rgb332_tilesets[tsKey].tileset){ res(); return; }

        //             // Break-out some values. 
        //             let tilesetName       = rgb332_tilesets[tsKey].tilesetName; // Also equal to ts.
        //             let tileHeight        = rgb332_tilesets[tsKey].config.tileHeight;
        //             let tileWidth         = rgb332_tilesets[tsKey].config.tileWidth;

        //             // The tileset entry should already exist.

        //             // Go through each tilemap key and store the tilemap data.
        //             for(let tileId in rgb332_tilesets[tsKey].tilemaps){
        //             }
        //         })
        //     );
        // }
        // await Promise.all(proms2);

        // Return the completed tilesets.
        return finishedTilesets;
    }

    // Copy a region from the source (Uint8ClampedArray).
    function copyRegion(source, srcWidth, x, y, w, h) {
        let resultData = new Uint8ClampedArray(w * h * 4);
        let resultIndex = 0;

        for (let j = y; j < y + h; j++) {
            for (let i = x; i < x + w; i++) {
                let srcIndex = (j * srcWidth + i) * 4;

                for (let k = 0; k < 4; k++) {
                    resultData[resultIndex + k] = source[srcIndex + k];
                }

                resultIndex += 4;
            }
        }

        return resultData;
    }

    // Update a region in the destination with the source data.
    function updateRegion(source, srcWidth, destination, destWidth, x, y, w, h) {
        for (let j = 0; j < h; j++) {
            for (let i = 0; i < w; i++) {
                let srcIndex = (j * srcWidth + i) * 4;
                let destIndex = ((y + j) * destWidth + (x + i)) * 4;

                for (let k = 0; k < 4; k++) {
                    destination[destIndex + k] = source[srcIndex + k];
                }
            }
        }
    }

    // BLIT: Update a region in the destination with the source data but only on transparent pixels at the destination.
    function updateRegionBlit(source, srcWidth, destination, destWidth, x, y, w, h) {
        let srcIndex;
        let destIndex;
        let subArray = new Uint8ClampedArray(4);

        // Rows
        for (let y_inc = 0; y_inc < h; y_inc++) {
            // Cols
            for (let x_inc = 0; x_inc < w; x_inc++) {
                // Get the indexes for the source and the destination for this pixel.
                srcIndex  = (y_inc * srcWidth + x_inc) * 4;
                destIndex = ((y + y_inc) * destWidth + (x + x_inc)) * 4;

                // Check if the destination pixel is transparent.
                if (destination[destIndex + 3] === 0) {
                    // Copy the source pixel data to the destination using set and subarray.
                    subArray = source.subarray(srcIndex, srcIndex + 4);
                    destination.set( subArray, destIndex );
                }
            }
        }
    }

    // Performs the graphics processing functions. 
    async function process(tilesetFiles, createFadeTilesets){
        let ts1 = performance.now();
        let rgb332_tilesets = await getAndParseGraphicsData(tilesetFiles);
        let ts1e = performance.now() - ts1;
        
        let ts2 = performance.now();
        let finishedTilesets = await createGraphicsAssets(rgb332_tilesets, createFadeTilesets);
        let ts2e = performance.now() - ts2;

        return {
            finishedTilesets: finishedTilesets,
            timings: {
                getAndParseGraphicsData: ts1e,
                createGraphicsAssets   : ts2e,
            },

        }
    }

    return {
        process         : process,
        setPixelated    : setPixelated,
        updateRegion    : updateRegion,
        copyRegion      : copyRegion,
        updateRegionBlit: updateRegionBlit,
    };
}));
