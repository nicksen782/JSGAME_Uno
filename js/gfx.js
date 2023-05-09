var _GFX = {
    // Cache of tileset settings, tiles (optional), and tilemaps.
    tilesets:{},

    // Holds the graphics data that will be sent to the WebWorker.
    currentData : {
        "BG1":{
            bgColorRgba: [0,64,92,255],
            tilemaps   : {},
            changes    : false,
        },
        "BG2":{
            tilemaps   : {},
            changes    : false,
        },
        "SP1":{
            tilemaps   : {},
            changes    : false,
        },
        "TX1":{
            tilemaps   : {},
            changes    : false,
        },
    },

    // Drawing update and drawing functions. 
    funcs:{
        // Ensures that settings is an object.
        correctSettings: function(settings){
            if(
                ! (
                    settings !== null &&
                    typeof settings === 'object' &&
                    !Array.isArray(settings)
                )
            ){
                settings = {};
            }

            return settings;
        },

        // This requests that all output canvases be cleared. 
        // Also removes all tilemap object data locally and in the WebWorker.
        clearAllLayers: async function(keepBg1BgColor=true){
            // Local data clear.
            for(let layerKey in _GFX.currentData){ 
                _GFX.currentData[layerKey].tilemaps = {};
                if(layerKey == "BG1" && !keepBg1BgColor){
                    _GFX.currentData[layerKey].bgColorRgba = [0,0,0,0];
                }
                _GFX.currentData[layerKey].changes = true;
            }

            // Request the screen and WebWorker cache clear.
            await _WEBW_V.SEND("clearAllLayers", { 
                data:{}, 
                refs:[]
            }, true);
        },

        // Updates the specified layer (locally.) Can accept multiple tilemaps.
        updateLayer: function(layer, tilemaps={}, bgColorRgba=[0,0,0,255]){
            // 
            if(layer == "BG2" || layer == "SP1" || layer == "TX1"){
                let tilemap, exists, oldHash, newHash;
                for(let tilemapKey in tilemaps){
                    // Get the tilemap from the provided list.
                    tilemap = tilemaps[tilemapKey];

                    // Does this tilemapKey already exist?
                    exists = _GFX.currentData[layer].tilemaps[tilemapKey] ? true : false;

                    // If it exists then get it's existing hash.
                    if(exists){ oldHash = _GFX.currentData[layer].tilemaps[tilemapKey].hash ?? 0; }

                    // Generate a new hash. 
                    newHash = _GFX.utilities.xxHash32_min( JSON.stringify(tilemap) );
                    
                    // Is this a changed object? (TEST: Hashes don't match.)
                    if(oldHash != newHash){
                        // Make sure that settings is an object.
                        tilemap.settings = this.correctSettings(tilemap.settings);

                        // Update the layerObject.
                        _GFX.currentData[layer].tilemaps[tilemapKey] = {
                            hash: newHash,
                            ts       : tilemap.ts,
                            tmap     : tilemap.tmap,
                            x        : tilemap.x,
                            y        : tilemap.y,
                            settings : tilemap.settings,
                        };

                        // Set the changes flag for this layer since there were changes.
                        _GFX.currentData[layer].changes = true;
                    }
                }
            }

            // BG1 is always a total replacement.
            else if(layer == "BG1"){
                _GFX.currentData[layer].bgColorRgba = bgColorRgba;
                _GFX.currentData[layer].tilemaps    = tilemaps;
                _GFX.currentData[layer].changes     = true;
            }
        },

        // This gathers the data created by the other update functions and sends the values.
        sendGfxUpdates: function(){
            // Do not continue if there are not any changes. 
            if(
                ! (
                    _GFX.currentData["BG1"].changes ||
                    _GFX.currentData["BG2"].changes ||
                    _GFX.currentData["SP1"].changes ||
                    _GFX.currentData["TX1"].changes
                )
            ){
                // console.log(
                //     "Skipping: sendGfxUpdates" +
                //     `\nBG1 changes:${_GFX.currentData["BG1"].changes}` +
                //     `\nBG2 changes:${_GFX.currentData["BG2"].changes}` +
                //     `\nSP1 changes:${_GFX.currentData["SP1"].changes}` +
                //     `\nTX1 changes:${_GFX.currentData["TX1"].changes}` +
                //     ""
                // );
                return;
            }
            // else{
            //     console.log(
            //         "UPDATING: sendGfxUpdates" +
            //         `\nBG1 changes:${_GFX.currentData["BG1"].changes} ${JSON.stringify(Object.keys(_GFX.currentData["BG1"].tilemaps))}` +
            //         `\nBG2 changes:${_GFX.currentData["BG2"].changes} ${JSON.stringify(Object.keys(_GFX.currentData["BG2"].tilemaps))}` +
            //         `\nSP1 changes:${_GFX.currentData["SP1"].changes} ${JSON.stringify(Object.keys(_GFX.currentData["SP1"].tilemaps))}` +
            //         `\nTX1 changes:${_GFX.currentData["TX1"].changes} ${JSON.stringify(Object.keys(_GFX.currentData["TX1"].tilemaps))}` +
            //         ""
            //     );
            // }

            _WEBW_V.SEND("sendGfxUpdates", { 
                data:{
                    BG1: _GFX.currentData["BG1"].changes ?_GFX.currentData["BG1"] : 0,
                    BG2: _GFX.currentData["BG2"].changes ?_GFX.currentData["BG2"] : 0,
                    SP1: _GFX.currentData["SP1"].changes ?_GFX.currentData["SP1"] : 0,
                    TX1: _GFX.currentData["TX1"].changes ?_GFX.currentData["TX1"] : 0,
                }, 
                refs:[]
            }, false);

            _GFX.currentData["BG1"].changes = false;
            _GFX.currentData["BG2"].changes = false;
            _GFX.currentData["SP1"].changes = false;
            _GFX.currentData["TX1"].changes = false;
        },

        // Returns a copy of a tilemap.
        getTilemap: function(ts, mapKey){
            // Reference.
            // return _GFX.tilesets[ts].tilemaps[mapKey];
            
            // Value copy.
            return new Uint8ClampedArray(_GFX.tilesets[ts].tilemaps[mapKey]);
        },

        // Removes a layer object and sets the changes for that layer to true. 
        removeLayerObj: function(layerKey, mapKey){
            delete _GFX.currentData[layerKey].tilemaps[mapKey];
            _GFX.currentData[layerKey].changes = true;
        }, 

        // Creates a layer object from a tilemap.
        // NOTE: Output is used with updateLayer.
        createLayerObjData: function(obj={}){
            // Correct any missing data in the object.
            if(!obj){ obj = {}; }
            if(!obj.mapKey) { 
                throw `createLayerObjData: Missing mapKey: ${JSON.stringify(obj)}`;
                // obj.mapKey = "" ;
            }
            if(!obj.ts)     { obj.ts     = "bg_tiles" }
            if(!obj.tmap)   { obj.tmap   = [0,0,0] }
            if(!obj.x)      { obj.x      = 0; }
            if(!obj.y)      { obj.y      = 0; }
            obj.settings = this.correctSettings(obj.settings); // Make sure that settings is an object.

            // Handle tilemap transforms.
            if(obj.settings.rotation || obj.settings.xFlip || obj.settings.yFlip){
                obj.tmap = _GFX.utilities.tilemapTransform(obj.tmap, obj.settings);
            }

            // Return the layerObject.
            return { 
                [obj.mapKey]: { 
                    ts      : obj.ts,
                    x       : obj.x,
                    y       : obj.y,
                    tmap    : obj.tmap,
                    settings: obj.settings
                } 
            } ;
        },

        // Creates a layer object from a tilemap based on text string(s).
        // NOTE: Output is used with updateLayer.
        createPrintLayerObjData: function(obj={}){
            // _GFX.funcs.createPrintTilemap("text1", { x:0, y:0, text:"test"});

            // Correct any missing data in the object.
            if(!obj){ obj = {}; }
            if(!obj.mapKey) { obj.mapKey = "" }
            // if(!obj.layer)  { obj.layer  = "TX1" }
            if(!obj.ts)     { obj.ts     = "font_tiles" }
            if(!obj.text)   { obj.text   = [""]; }
            if(!obj.x)      { obj.x      = 0; }
            if(!obj.y)      { obj.y      = 0; }
            obj.settings = this.correctSettings(obj.settings); // Make sure that settings is an object.

            // Get the highest tile. (For handling font tilesets that only have capital letters.)
            let maxTileId = _GFX.tilesets[obj.ts].tileCount -1;

            // Convert string to array of that string.
            if(!Array.isArray(obj.text)){ obj.text = [ obj.text ]; }
            
            // Determine the longest line. 
            let mapWidth = obj.text.reduce((longestLength, current) => {
                return current.length > longestLength ? current.length : longestLength;
            }, 0);
            let mapHeight = obj.text.length;
            
            // Start the new tilemap.
            let newTilemap = new Uint8ClampedArray( 2 + (mapWidth * mapHeight) );
            newTilemap[0] = mapWidth;
            newTilemap[1] = mapHeight;

            // Go through each line.
            let index = 2;
            for(let l=0; l<obj.text.length; l+=1){
                // Get the line.
                let line = obj.text[l];

                // Convert numbers to string.
                if(typeof line == "number"){ line = line.toString(); }

                // Convert the string to upper case.
                // line = line.toUpperCase();

                // Pad the end of the line with spaces.
                line = line.padEnd(mapWidth, " ");

                // Need to create a tilemap of the characters in the string.
                let chars = Array.from(line); 
                
                let tileId;
                for(let c=0; c<chars.length; c+=1){
                    // Convert the ASCII value to a tileId.
                    tileId = chars[c].charCodeAt(0) - 32;

                    // Add the tileId to the newTilemap. (Make sure to only use a valid font tileId.)
                    newTilemap[index] = Math.min(tileId, maxTileId);

                    // Increment the next newTilemap index.
                    index +=1 ;
                }
            }

            // Handle tilemap transforms.
            if(obj.settings.rotation || obj.settings.xFlip || obj.settings.yFlip){
                newTilemap = _GFX.utilities.tilemapTransform(newTilemap, obj.settings);
            }

            // Return the layerObject.
            return { 
                [obj.mapKey]: { 
                    // layer   : obj.layer,
                    ts      : obj.ts,
                    x       : obj.x,
                    y       : obj.y,
                    tmap    : newTilemap,
                    settings: obj.settings
                } 
            } ;
        },
    },

    // Transformation utilities.
    utilities:{
        // Returns a hash for the specified data. (xxHash32 algorithm variant, minified.)
        xxHash32_min : function(a){
            for(var t=function(a,t){return a<<t|a>>>32-t},u=a.length,h=u,i=0,r=2654435769,e=0;h>=4;)e=a[i]|a[i+1]<<8|a[i+2]<<16|a[i+3]<<24,e=t(e=Math.imul(e,2246822507),13),r=t(r^=e=Math.imul(e,3266489909),17),r=Math.imul(r,461845907),i+=4,h-=4;switch(e=0,h){case 3:e^=a[i+2]<<16;break;case 2:e^=a[i+1]<<8;break;case 1:e^=a[i],e=t(e=Math.imul(e,2246822507),13),r^=e=Math.imul(e,3266489909)}return r^=u,r^=r>>>16,r=Math.imul(r,2246822507),r^=r>>>13,r=Math.imul(r,3266489909),(r^=r>>>16)>>>0
        },

        // ******************
        // TILEMAP TRANSFORMS
        // ******************

        // Performs a X flip (horizontal) transform on a tilemap.
        tilemap_flipX: function(map){
            // Make sure a map was provided.
            if(!map){ console.log("No map"); return; }

            // Break-out only the tile data portion of the map.
            let srcMap = map.slice(2);

            // Get the dimensions of the tilemap. 
            let width  = map[0];
            let height = map[1];

            // This will hold the flipped tile indexes.
            let tileIndexes = new Array(width * height);

            // Flip horizontally.
            let index1 = 0;
            for (let y = 0; y < height; y += 1) {
                for (let x = width - 1; x >= 0; x -= 1) {
                    tileIndexes[ ((y * width) + x) ] = srcMap[index1++];
                }
            }

            // Return a new tilemap with the width, height, and new tileIndexes.
            return new Uint8ClampedArray([width, height, ...tileIndexes]);
        },
        // Performs a Y flip (vertical) transform on a tilemap.
        tilemap_flipY: function(map){
            // Make sure a map was provided.
            if(!map){ console.log("No map"); return; }

            // Break-out only the tile data portion of the map.
            let srcMap = map.slice(2);

            // Get the dimensions of the tilemap. 
            let width  = map[0];
            let height = map[1];
            
            // This will hold the flipped tile indexes.
            let tileIndexes = new Array(width * height);

            // Flip vertically.
            let index1 = 0;
            for (let y = height - 1; y >= 0; y -= 1) {
                for (let x = 0; x < width; x += 1) {
                    tileIndexes[ ((y * width) + x) ] = srcMap[index1++];
                }
            }

            // Return a new tilemap with the width, height, and new tileIndexes.
            return new Uint8ClampedArray([width, height, ...tileIndexes]);
        },
        // Performs a rotational transform on a tilemap.
        tilemap_rotate: function(map, degrees){
            // Make sure a map was provided.
            if(!map){ console.error("Missing tilemap."); return map; }
            
            // Make sure a rotation was provided.
            if(!degrees){ console.error("Missing degrees."); return map; }

            // Make sure that the rotation specified is allowed.
            let allowedDegrees = [-90, 90, -180, 180, 270];
            if(allowedDegrees.indexOf(degrees) == -1){
                console.error(`Invalid degrees value: ${degrees}. Must be within:`, allowedDegrees);
                return map;
            }

            // Break-out only the tile data portion of the map.
            let srcMap = map.slice(2);

            // Get the dimensions of the tilemap. 
            let width  = map[0];
            let height = map[1];
            
            // This will hold the rotated tile indexes.
            let tileIndexes = new Array(width * height);

            // Holds the calculated index for the tileIds as they are stored.
            let index;

            // NOTE: The index formula for no rotation would be: tileIndexes[y * width + x] = srcMap[index];
            //       This would be unnecessary since the tiles would already be in order for 0 degree rotation.

            // Rotation for 90 and -270 degrees.
            if (degrees === 90 || degrees === -270) {
                for (let x = 0; x < width; x++) {
                    for (let y = height - 1; y >= 0; y--) {
                        index = y * width + x;
                        // The x and y coordinates are swapped, and the y coordinate is reversed.
                        tileIndexes[x * height + (height - y - 1)] = srcMap[index];
                    }
                }
            }

            // Rotation for -90 and 270 degrees.
            else if (degrees === -90 || degrees === 270) {
                for (let x = width - 1; x >= 0; x--) {
                    for (let y = 0; y < height; y++) {
                        index = y * width + x;
                        // The x and y coordinates are swapped, and the x coordinate is reversed.
                        tileIndexes[(width - x - 1) * height + y] = srcMap[index];
                    }
                }
            }

            // Rotation for 180 and -180 degrees.
            else if (degrees === 180 || degrees === -180) {
                for (let y = height - 1; y >= 0; y--) {
                    for (let x = width - 1; x >= 0; x--) {
                        index = y * width + x;
                        // Both the x and y coordinates are reversed.
                        tileIndexes[((height - 1 - y) * width) + (width - 1 - x)] = srcMap[index];
                    }
                }
            }

            // Swap the width and the height if needed.
            if(degrees == 90 || degrees == -90 || degrees == 270){
                [width, height] = [height, width];
            }

            // Return a new tilemap with the width, height, and new tileIndexes.
            return new Uint8ClampedArray([width, height, ...tileIndexes]);
        },
        // Performs required transforms to a tilemap and returns the new tilemap.
        tilemapTransform: function(tmap, settings){
            // Handle rotation.
            // NOTE: If a tilemap is NOT a square then the tilemap will have swapped new width and height values.
            if(settings.rotation){ tmap = _GFX.utilities.tilemap_rotate(tmap, settings.rotation); }
            
            // Handle xFlip.
            if(settings.xFlip){ tmap = _GFX.utilities.tilemap_flipX(tmap); }
            
            // Handle yFlip.
            if(settings.yFlip){ tmap = _GFX.utilities.tilemap_flipY(tmap); }

            return tmap;
        },
    },
};

_GFX.init = async function(){
    return new Promise(async (resolve,reject)=>{
        // Generate canvas.
        const generateCanvasLayer = function(rec, dimensions){
            // Create a canvas for this layer.
            let canvas = document.createElement("canvas");
            canvas.width  = dimensions.tileWidth * dimensions.cols;
            canvas.height = dimensions.tileHeight * dimensions.rows;
            
            // Set CSS for this canvas layer.
            if(rec.css){
                for(let c=0; c<rec.css.length; c+=1){
                    let k = rec.css[c].k;
                    let v = rec.css[c].v;
                    canvas.style[k] = v;
                }
            }
            canvas.classList.add("canvasLayer");
    
            // Return the object.
            return { 
                name      : rec.name, 
                canvasElem: canvas, 
            };
        };

        // Send the config. Await the response.
        await _WEBW_V.SEND("initConfigAndGraphics", {data: { configObj: _APP.configObj } }, true);
        
        // Generate canvas layers and attach to the DOM.
        let outputDiv = document.getElementById("output");
        outputDiv.style['width']  = (2 * _APP.configObj.dimensions.tileWidth * _APP.configObj.dimensions.cols) + "px";
        outputDiv.style['height'] = (2 * _APP.configObj.dimensions.tileHeight * _APP.configObj.dimensions.rows) + "px";
        let layers = [];
        for(let l=0; l<_APP.configObj.layers.length; l+=1){
            let rec = _APP.configObj.layers[l];
            let layer = generateCanvasLayer(rec, _APP.configObj.dimensions);
            layer.canvasElem.setAttribute("name", rec.name);
            outputDiv.append(layer.canvasElem);
            layer.canvas = layer.canvasElem.transferControlToOffscreen();
            layers.push({
                canvas        : layer.canvas,
                canvasOptions : rec.canvasOptions,
                name          : rec.name,
                type          : rec.type,
            });
        }

        // Send transferred canvases to the webworker. Await the response.
        await _WEBW_V.SEND("initLayers", {
            data:{
                layers: layers,
            },
            refs:[...layers.map(d=>d.canvas)]
        }, true);

        resolve();
    });
};
