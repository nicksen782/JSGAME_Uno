var _GFX = {
    // Cache of tileset settings, tiles (optional), and tilemaps.
    tilesets:{},

    // Holds the graphics data that will be sent to the WebWorker.
    currentData : {
        "BG1":{
            canvas: null,
            bgColorRgba: [0,0,0,255],
            tilemaps   : {},
            changes    : false,
            fade:{
                fade    : false,
                currFade: null,
                // prevFade: null,
            },
            useFlicker: false
        },
        "BG2":{
            canvas: null,
            tilemaps  : {},
            changes   : false,
            fade:{
                fade    : false,
                currFade: null,
                // prevFade: null,
            },
            useFlicker: false
        },
        "SP1":{
            canvas: null,
            tilemaps  : {},
            changes   : false,
            fade:{
                fade    : false,
                currFade: null,
                // prevFade: null,
            },
            useFlicker: true,
        },
        "TX1":{
            canvas: null,
            tilemaps  : {},
            changes   : false,
            fade:{
                fade    : false,
                currFade: null,
                // prevFade: null,
            },
            useFlicker: false,
        },
    },

    // Cache of all generated ImageData tilemaps. (Main thread does NOT include the ImageData.)
    hashCacheMap: new Map(),

    ALLCLEAR: true,         //
    DRAWNEEDED: false,      //
    REMOVALS: {
        BG1: [],
        BG2: [],
        SP1: [],
        TX1: [],
    },      //
    
    GFX_UPDATE_DATA: {
        gs1: "",
        gs2: "",
        version: 4,
        ALLCLEAR: false,
        hasChanges: false,

        BG1: { 
            CHANGES: {}, REMOVALS_ONLY: [],
            fade       : {}, 
            changes    : false, 
            bgColorRgba: [0,0,0,0]
        }, 
        BG2: { 
            CHANGES: {}, REMOVALS_ONLY: [],
            fade       : {}, 
            changes    : false, 
        }, 
        SP1: { 
            CHANGES: {}, REMOVALS_ONLY: [],
            fade       : {}, 
            changes    : false, 
        }, 
        TX1: { 
            CHANGES: {}, REMOVALS_ONLY: [],
            fade       : {}, 
            changes    : false, 
        }, 
    },
    create_GFX_UPDATE_DATA: function(){
        this.GFX_UPDATE_DATA.gs1        = _APP.game.gs1 ;
        this.GFX_UPDATE_DATA.gs2        = _APP.game.gs2 ;
        // this.GFX_UPDATE_DATA.version    = this.GFX_UPDATE_DATA.version;
        this.GFX_UPDATE_DATA.ALLCLEAR   = _GFX.ALLCLEAR;
        this.GFX_UPDATE_DATA.hasChanges = _GFX.DRAWNEEDED;

        for(let layerKey in _GFX.currentData){ 
            let layerData = _GFX.currentData[layerKey];
            this.GFX_UPDATE_DATA[layerKey].CHANGES       = {};
            this.GFX_UPDATE_DATA[layerKey].REMOVALS_ONLY = [];
            this.GFX_UPDATE_DATA[layerKey].fade          = layerData.fade;
            this.GFX_UPDATE_DATA[layerKey].changes       = layerData.changes;
            this.GFX_UPDATE_DATA[layerKey].useFlicker    = layerData.useFlicker;
            if([layerKey] == "BG1"){
                this.GFX_UPDATE_DATA[layerKey].bgColorRgba   = layerData.bgColorRgba;
            }

            // Process what has changed.
            for(let mapKey in layerData.tilemaps){ 
                tilemap = layerData.tilemaps[mapKey];

                // ADD or CHANGED
                if(
                    layerData.tilemaps[mapKey].hashPrev == 0 ||
                    layerData.tilemaps[mapKey].hashPrev != layerData.tilemaps[mapKey].hash
                ){ 
                    this.GFX_UPDATE_DATA[layerKey]["CHANGES"][mapKey] = tilemap; 
                    // this.GFX_UPDATE_DATA[layerKey].changes = true; 
                }

                // REMOVALS_ONLY (if there are removals AND this mapKey is in removals.)
                if(_GFX.REMOVALS[layerKey].length && _GFX.REMOVALS[layerKey].indexOf(mapKey) != -1){
                    this.GFX_UPDATE_DATA.hasChanges = true; 
                    this.GFX_UPDATE_DATA[layerKey].changes = true;
                }
            }

            // Add the REMOVALS_ONLY values.
            this.GFX_UPDATE_DATA[layerKey]["REMOVALS_ONLY"] = _GFX.REMOVALS[layerKey]
        }
    },

    // Used for layer object management within a gamestate.
    layerObjs: {
        // Holds the layer objects per gamestate.
        objs: {},
        
        // Returns the specified layer object for a gamestate.
        getOne: function(key, gamestate){
            /* 
            // EXAMPLE USAGE:
            // NOTE: The last argument, gamestate is technically optional and defaults to the current gamestate 1.

            _GFX.layerObjs.getOne("keyToGet", _APP.game.gs1);
            */

            // If the gamestate was not provided use the current gamestate 1.
            if(gamestate == undefined){ gamestate = _APP.game.gs1; }

            // Create the gamestate key in objs if it does not exist.
            if(this.objs[gamestate] == undefined){ this.objs[gamestate] = {}; }

            // console.log(`key: ${key}, gamestate: ${gamestate},`, this.objs[gamestate][key]);

            // Return the object.
            return this.objs[gamestate][key];
        },

        // Creates an empty object placeholder for a gamestate layer object.
        createPlaceholder: function(key, gamestate){
            /* 
            // EXAMPLE USAGE:
            // NOTE: The last argument, gamestate is technically optional and defaults to the current gamestate 1.

            _GFX.layerObjs.createPlaceholder("placeholderKey", _APP.game.gs1);
            */

            // If the gamestate was not provided use the current gamestate 1.
            if(gamestate == undefined){ gamestate = _APP.game.gs1; }

            // Create the gamestate key in objs if it does not exist.
            if(this.objs[gamestate] == undefined){ this.objs[gamestate] = {}; }

            // Add/Create the new layer object.
            this.objs[gamestate][key] = {};
        },

        // Adds or updates one layer object for a gamestate.
        updateOne: function(className, config, gamestate){
            /* 
            // EXAMPLE USAGE:
            // NOTE: The last argument, gamestate is technically optional and defaults to the current gamestate 1.

            _GFX.layerObjs.updateOne(LayerObject, {
                    immediateAdd: false,
                    layerObjKey: "demo_board", layerKey: "BG1", tilesetKey: "bg_tiles",
                    tmap: _GFX.funcs.getTilemap("bg_tiles", "board_28x28"),
                    x: 0, y: 0, xyByGrid: true,
                    settings : {
                        xFlip: false, yFlip: false, rotation: 0, colorData:[]
                    }
                }, _APP.game.gs1
            );
            */

            // If the gamestate was not provided use the current gamestate 1.
            if(gamestate == undefined){ gamestate = _APP.game.gs1; }

            // Create the gamestate key in objs if it does not exist.
            if(this.objs[gamestate] == undefined){ this.objs[gamestate] = {}; }

            // Add/Create the new layer object.
            this.objs[gamestate][ config.layerObjKey ] = new className(config);
        },

        // Remove one layer object from objs for a gamestate.
        removeOne: function(key, gamestate){
            /* 
            // EXAMPLE USAGE:
            // NOTE: The last argument, gamestate is technically optional and defaults to the current gamestate 1.

            _GFX.layerObjs.removeOne("keyNameToRemove", _APP.game.gs1);
            */

            // If the gamestate was not provided use the current gamestate 1.
            if(gamestate == undefined){ gamestate = _APP.game.gs1; }

            // Create the gamestate key in objs if it does not exist.
            if(this.objs[gamestate] == undefined){ this.objs[gamestate] = {}; }

            // If this layer object does not have a render function then assume the layer object is not created yet and skip the render.
            if(!this.objs[gamestate][key].render){ return {}; }

            // Remove from the graphics cache. 
            let config = this.obs[gamestate][key].removeLayerObject();
        
            // Clear this key.
            this.objs[gamestate][key] = {}; 
        
            // Return the config to the caller (makes reuse easier.)
            return config;
        },
        
        // Clear ALL layer objects in objs for a gamestate.
        clearAll : function(gamestate){
            /* 
            // EXAMPLE USAGE:
            // NOTE: The last argument, gamestate is technically optional and defaults to the current gamestate 1.

            _GFX.layerObjs.clearAll(_APP.game.gs1);
            */

            // If the gamestate was not provided use the current gamestate 1.
            if(gamestate == undefined){ gamestate = _APP.game.gs1; }

            // Create the gamestate key in objs if it does not exist.
            if(this.objs[gamestate] == undefined){ this.objs[gamestate] = {}; }

            // Set each layer object to {}.
            for(let key in this.objs[gamestate]){ this.objs[gamestate][key] = {}; }
        },

        // Remove ALL layer objects for a gamestate.
        removeAll : function(gamestate){
            /* 
            // EXAMPLE USAGE:
            // NOTE: The last argument, gamestate is technically optional and defaults to the current gamestate 1.

            _GFX.layerObjs.removeAll(_APP.game.gs1);
            */

            // If the gamestate was not provided use the current gamestate 1.
            if(gamestate == undefined){ gamestate = _APP.game.gs1; }

            // Create the gamestate key in objs if it does not exist.
            if(this.objs[gamestate] == undefined){ this.objs[gamestate] = {}; }

            // Run the removeOne function against each key for the gamestate's layer objects.
            for(let key in this.objs[gamestate]){ this.removeOne(key, gamestate); }
        },
        
        // Render ALL layer objects for a gamestate. (Skips layer objects with the hidden flag set.)
        render: function(gamestate){
            /* 
            // EXAMPLE USAGE:
            // NOTE: The last argument, gamestate is technically optional and defaults to the current gamestate 1.

            _GFX.layerObjs.render(_APP.game.gs1);
            */

            // If the gamestate was not provided use the current gamestate 1.
            if(gamestate == undefined){ gamestate = _APP.game.gs1; }

            // Create the gamestate key in objs if it does not exist.
            if(this.objs[gamestate] == undefined){ this.objs[gamestate] = {}; }

            for(let key in this.objs[gamestate]){
                // Skip the rendering of hidden layer objects. 
                if(this.objs[gamestate][key].hidden){ continue; }

                // Render the layer objects if it contains the render function.
                if(this.objs[gamestate][key].render){ this.objs[gamestate][key].render() }
            }
        },
    },

    // Drawing update and drawing functions. 
    funcs:{
        // Determines if a draw is needed and updates _GFX.DRAWNEEDED.
        isDrawNeeded: function(){
            if(
                ! (
                    _GFX.ALLCLEAR                   ||
                    _GFX.currentData["BG1"].changes ||
                    _GFX.currentData["BG2"].changes ||
                    _GFX.currentData["SP1"].changes ||
                    _GFX.currentData["TX1"].changes ||
                    _GFX.DRAWNEEDED
                )
            )   { _GFX.DRAWNEEDED = false; }
            else{ _GFX.DRAWNEEDED = true;  }
            return _GFX.DRAWNEEDED;
        },
        // Ensures that settings is an object.
        correctSettings: function(settings){
            if(
                ! (
                    settings !== null &&
                    typeof settings === 'object' &&
                    !Array.isArray(settings)
                )
            ){
                // Settings was not an object. Replace with default settings.
                // console.error("Fixing settings", settings);
                settings = { fade: null, xFlip: false, yFlip: false, rotation: 0, colorData:[] };
            }

            return settings;
        },

        // This requests that all output canvases be cleared. 
        // Also removes all tilemap object data locally and in the WebWorker.
        clearAllLayers: async function(keepBg1BgColor=true){
            // Local data clear.
            for(let layerKey in _GFX.currentData){ 
                // Add to REMOVALS.
                for(let mapKey in _GFX.currentData[layerKey].tilemaps){ _GFX.REMOVALS[layerKey].push(mapKey); }

                // Remove all tilemaps. 
                _GFX.currentData[layerKey].tilemaps = {};

                // Keep the background color for BG1?
                if(layerKey == "BG1" && !keepBg1BgColor){
                    _GFX.currentData[layerKey].bgColorRgba = [0,0,0,0];
                }

                // Set changes true so that this updates the canvas output.
                _GFX.currentData[layerKey].changes = true;
            }

            // Set the flag for screen and WebWorker cache clear.
            _GFX.ALLCLEAR = true;

            // Directly request the screen and WebWorker cache clear.
            // await _WEBW_V.SEND("clearAllLayers", { data:{}, refs:[] }, true, false);
        },

        // Updates the background color for BG1.
        updateBG1BgColorRgba: function(bgColorRgba=[0,0,0,255]){
            // _GFX.funcs.updateBG1BgColorRgba([0,0,255,255]);
            let layer = "BG1";

            if(bgColorRgba){
                _GFX.currentData[layer].bgColorRgba = bgColorRgba;
            }
            else{
                _GFX.currentData[layer].bgColorRgba = [0,0,0,0];
            }

            //
            _GFX.currentData[layer].changes = true;
        },

        // Updates the specified layer (locally.) Can accept multiple tilemaps.
        updateLayer: function(layer, tilemaps={}){
            // 
            if(layer == "BG1" || layer == "BG2" || layer == "SP1" || layer == "TX1"){
                let fade = _GFX.currentData[layer].fade;
                let tilemap, exists, oldHash, newHash;
                let tw ;
                let th ;
                let isNewTilemaphash;
                for(let tilemapKey in tilemaps){
                    isNewTilemaphash = false;
                    
                    // Get the tilemap from the provided list.
                    tilemap = tilemaps[tilemapKey];
                    tw = _GFX.tilesets[tilemap.ts].config.tileWidth;
                    th = _GFX.tilesets[tilemap.ts].config.tileHeight;

                    // Make sure that settings is an object.
                    tilemap.settings = this.correctSettings(tilemap.settings);

                    // Does this tilemapKey already exist?
                    exists = _GFX.currentData[layer].tilemaps[tilemapKey] ? true : false;

                    // If useGlobalOffsets is defined use them to offset x and y.
                    if(_APP.configObj.useGlobalOffsets){
                        tilemap.x += ( (_APP.configObj.globalOffsets.x ?? 0) * tw);
                        tilemap.y += ( (_APP.configObj.globalOffsets.y ?? 0) * th);
                    }

                    // If it exists then get it's existing hash.
                    if(exists){ oldHash = _GFX.currentData[layer].tilemaps[tilemapKey].hash ?? 0; }

                    // Generate a new hash. 
                    newHash = _GFX.utilities.djb2Hash( JSON.stringify({tilemap, fade}) );

                    // Cache of all generated ImageData tilemaps. (to avoid regeneration.)
                    // HASHCACHEHMAP: Create a unique hash for some of the tilemap data.
                    let hashMapHash = _GFX.utilities.djb2Hash(JSON.stringify({
                        ts      : tilemap.ts,
                        settings: JSON.stringify(tilemap.settings),
                        tmap    : Array.from(tilemap.tmap),
                        w: tilemap.tmap[0] * tw ,
                        h: tilemap.tmap[1] * th,
                    }));

                    // Save to hashCacheMap. (Map)
                    if(!_GFX.hashCacheMap.get(hashMapHash)){
                        // console.log("Saving");
                        _GFX.hashCacheMap.set(hashMapHash, {
                            ts      : tilemap.ts,
                            settings: tilemap.settings,
                            tmap    : tilemap.tmap,
                            w       : tilemap.tmap[0] * tw,
                            h       : tilemap.tmap[1] * th,
                        });
                        isNewTilemaphash = true;
                    }

                    // Is this a changed object? (TEST: Hashes don't match.)
                    if(oldHash != newHash){
                        // Update the layerObject.
                        _GFX.currentData[layer].tilemaps[tilemapKey] = {
                            hash    : newHash, // Newly generated hash.
                            hashPrev: oldHash ?? 0, // Previous hash or 0 if there wasn't one.
                            ts       : tilemap.ts,
                            tmap     : tilemap.tmap,
                            x        : tilemap.x,
                            y        : tilemap.y,
                            w        : tilemap.w,
                            h        : tilemap.h,
                            settings : tilemap.settings,
                            isNewTilemaphash : isNewTilemaphash,
                        };

                        // Set the changes flag for this layer since there were changes.
                        _GFX.currentData[layer].changes = true;
                    }
                }
            }
        },

        // Sets the fade over-ride values for all or any layers.
        // NOTE: Fade uses preGenerated fadeTiles so color replacements will be skipped.
        setFade: function(layer="ALL", level=0){
            // _GFX.funcs.setFade("ALL", 5);
            // layer can be one of: [ "BG1", "BG2", "SP1", "TXT1", "ALL" ].
            // level can be one of: [ null, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]

            // Affect all layers?
            if(layer=="ALL"){
                // If the fade level is off then reset the fade settings for each layer.
                for(let layerKey in _GFX.currentData){
                    if(level==null){
                        for(let layerKey in _GFX.currentData){ 
                            // Set fade false.
                            _GFX.currentData[layerKey].fade.fade = false;
                        
                            // Set prevFade to null.
                            // _GFX.currentData[layerKey].fade.prevFade = null;
                        
                            // Set currFade to null.
                            _GFX.currentData[layerKey].fade.currFade = null;
                        }
                    }
                    // No, set the fade level for each layer. 
                    else{
                        for(let layerKey in _GFX.currentData){ 
                            // Set fade true.
                            _GFX.currentData[layerKey].fade.fade = true;
                        
                            // Set prevFade to currFade.
                            // _GFX.currentData[layerKey].fade.prevFade = _GFX.currentData[layerKey].fade.currFade;
                        
                            // Set currFade to level.
                            _GFX.currentData[layerKey].fade.currFade = level;
                        }
                    }

                    // Set changes to true.
                    _GFX.currentData[layerKey].changes = true;
                }
            }
            else{
                // If the fade level is off then reset the fade settings for the layer.
                if(level==null){
                    // Set fade false.
                    _GFX.currentData[layer].fade.fade = false;
                     
                    // Set prevFade to null.
                    // _GFX.currentData[layer].fade.prevFade = null;
                 
                    // Set currFade to null.
                    _GFX.currentData[layer].fade.currFade = null;
                }
                // No, set the fade level for the layer. 
                else{
                    // Set fade true.
                    _GFX.currentData[layer].fade.fade = true;
                                        
                    // Set prevFade to currFade.
                    // _GFX.currentData[layer].fade.prevFade = _GFX.currentData[layer].fade.currFade;

                    // Set currFade to level.
                    _GFX.currentData[layer].fade.currFade = level;
                }

                // Set changes to true.
                _GFX.currentData[layer].changes = true;
            }
        },

        // This gathers the data created by the other update functions and sends the values.
        sendGfxUpdates: async function(waitForResp=false){
            // Update _GFX.GFX_UPDATE_DATA
            _GFX.create_GFX_UPDATE_DATA();

            // console.log("HEY");
            if(_GFX.GFX_UPDATE_DATA.hasChanges){
                // console.log(`_GFX.GFX_UPDATE_DATA.hasChanges:`, _GFX.GFX_UPDATE_DATA.hasChanges, _GFX.GFX_UPDATE_DATA);
                // debugger;
                // Send ASYNC
                _GFX.GFX_UPDATE_DATA.currentgs1 = _APP.game.gs1;
                if(!waitForResp){
                    _WEBW_V.SEND("sendGfxUpdates", { 
                        data: _GFX.GFX_UPDATE_DATA, 
                        refs:[]
                    }, false, _APP.debugActive); // Request data if debug is active.
                }
                // Await for the graphics update to finish.
                else{
                    await _WEBW_V.SEND("sendGfxUpdates", { 
                        data: _GFX.GFX_UPDATE_DATA, 
                        refs:[]
                    }, true, _APP.debugActive); // waitForResp, Request data if debug is active.
                }
            }

            // Clear the special changes flags.
            _GFX.ALLCLEAR = false;
            _GFX.DRAWNEEDED = false;

            // Clear the changes flags and update hashPrev.
            // NOTE: _GFX.currentData and _GFX.REMOVALS have the same layerKeys.
            for(let layerKey in _GFX.currentData){ 
                let layer = _GFX.currentData[layerKey];
                for(let mapKey in layer.tilemaps){ 
                    if(layer.tilemaps[mapKey].hashPrev != layer.tilemaps[mapKey].hash){
                        layer.tilemaps[mapKey].hashPrev = layer.tilemaps[mapKey].hash;
                    }
                }
                layer.changes = false;
                _GFX.REMOVALS[layerKey] = [];
            }
        },

        // Returns a copy of a tilemap.
        getTilemap: function(ts, mapKey){
            // Reference.
            // return _GFX.tilesets[ts].tilemaps[mapKey];
            
            // Value copy.
            let tilemap = _GFX.tilesets[ts].tilemaps[mapKey];
            if(!tilemap){ throw `getTilemap: Missing tmap: ts: ${ts}, mapKey: ${mapKey}`; }
            return new Uint8ClampedArray(tilemap);
        },

        // Removes a layer object and sets the changes for that layer to true. 
        removeLayerObj: function(layerKey, mapKey){
            // Remove from REMOVALS.
            _GFX.REMOVALS[layerKey].filter(d => d != mapKey);

            // Delete from currentData.
            delete _GFX.currentData[layerKey].tilemaps[mapKey];

            // Set changes to true so that the canvas output updates.
            _GFX.currentData[layerKey].changes = true;
        }, 

        // Creates a layer object from a tilemap.
        // NOTE: Output is used with updateLayer.
        createLayerObjData: function(obj={}){
            // Correct any missing data in the object.
            if(!obj){ obj = {}; }
            if(!obj.mapKey) { throw `createLayerObjData: Missing mapKey: ${JSON.stringify(obj)}`; }
            if(!obj.tmap)   { throw `createLayerObjData: Missing tmap: ${JSON.stringify(obj)}`; }
            if(!obj.ts)     { obj.ts = "bg_tiles" }
            if(!obj.x)      { obj.x  = 0; }
            if(!obj.y)      { obj.y  = 0; }
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
                    w       : obj.tmap[0] * _APP.configObj.dimensions.tileWidth,
                    h       : obj.tmap[1] * _APP.configObj.dimensions.tileHeight,
                    tmap    : obj.tmap,
                    settings: obj.settings,
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
                    ts      : obj.ts,
                    x       : obj.x,
                    y       : obj.y,
                    w       : newTilemap[0] * _APP.configObj.dimensions.tileWidth,
                    h       : newTilemap[1] * _APP.configObj.dimensions.tileHeight,
                    tmap    : newTilemap,
                    settings: obj.settings
                } 
            } ;
        },

        afterDraw: function(data = {}){
            if(_APP.debugActive && _DEBUG){
                _DEBUG.timingsDisplay.gfx.updateCache(data); 
            }

            if(data.newBG1_bgColor){
                // Save the new bgColorRgba.
                // _GFX.currentData["BG1"].bgColorRgba = e.data.data.newBG1_bgColorRgba;

                // Apply the new bgColorRgba.
                //
            }
        },
    },

    // Transformation utilities.
    utilities:{
        // Returns a hash for the specified string. (Variation of Dan Bernstein's djb2 hash.)
        djb2Hash: function(str) {
            if(typeof str != "string") { str = str.toString(); }
            var hash = 5381;
            for (var i = 0; i < str.length; i++) {
                hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
            }
            return hash;
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
            if(!map){ console.error("tilemap_rotate: Missing tilemap.", map); return map; }
            
            // Make sure a rotation was provided. (0 is considered invalid here.)
            if(!degrees){ console.error("tilemap_rotate: Missing degrees.", degrees); return map; }

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
            if(degrees == 90 || degrees == -90 || degrees == 270 || degrees == -270){
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
        await _WEBW_V.SEND("initConfigAndGraphics", {data: { configObj: _APP.configObj } }, true, true);
        
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
            
            // Save the canvas element to currentData.
            _GFX.currentData[rec.name].canvas = layer.canvasElem;
            
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
        }, true, false);

        resolve();
    });
};
