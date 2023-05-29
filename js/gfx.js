var _GFX = {
    // Cache of tileset settings, tiles (optional), and tilemaps.
    tilesets:{},

    // Holds the graphics data that will be sent to the WebWorker.
    currentData : {
        "L1":{
            canvas: null,
            bgColorRgba: [0,0,0,255],
            tilemaps   : {},
            changes    : false,
            fade:{
                fade    : false,
                currFade: null,
                prevFade: null,
            },
            useFlicker: false
        },
        "L2":{
            canvas: null,
            tilemaps  : {},
            changes   : false,
            fade:{
                fade    : false,
                currFade: null,
                prevFade: null,
            },
            useFlicker: false
        },
        "L3":{
            canvas: null,
            tilemaps  : {},
            changes   : false,
            fade:{
                fade    : false,
                currFade: null,
                prevFade: null,
            },
            useFlicker: true,
        },
        "L4":{
            canvas: null,
            tilemaps  : {},
            changes   : false,
            fade:{
                fade    : false,
                currFade: null,
                prevFade: null,
            },
            useFlicker: false,
        },
    },

    // Default values for settings.
    defaultSettings: {
        fade       : null,
        xFlip      : false,
        yFlip      : false,
        rotation   : 0,
        colorData  : [],
        bgColorRgba: []
    },

    ALLCLEAR: true,         //
    DRAWNEEDED: false,      //
    REMOVALS: {
        L1: [],
        L2: [],
        L3: [],
        L4: [],
    },      //
    
    GFX_UPDATE_DATA: {
        gs1: "",
        gs2: "",
        version: 4,
        ALLCLEAR: false,
        hasChanges: false,

        L1: { 
            REMOVALS_ONLY: [],
            CHANGES: {}, 
            fade       : {}, 
            changes    : false, 
            bgColorRgba: [0,0,0,0]
        }, 
        L2: { 
            REMOVALS_ONLY: [],
            CHANGES: {}, 
            fade       : {}, 
            changes    : false, 
        }, 
        L3: { 
            REMOVALS_ONLY: [],
            CHANGES: {}, 
            fade       : {}, 
            changes    : false, 
        }, 
        L4: { 
            REMOVALS_ONLY: [],
            CHANGES: {}, 
            fade       : {}, 
            changes    : false, 
        }, 
    },
    create_GFX_UPDATE_DATA: function(){
        this.GFX_UPDATE_DATA.gs1        = _APP.game.gs1 ;
        this.GFX_UPDATE_DATA.gs2        = _APP.game.gs2 ;
        this.GFX_UPDATE_DATA.ALLCLEAR   = _GFX.ALLCLEAR;
        this.GFX_UPDATE_DATA.hasChanges = _GFX.DRAWNEEDED;

        for(let layerKey in _GFX.currentData){ 
            let layerData = _GFX.currentData[layerKey];
            this.GFX_UPDATE_DATA[layerKey].CHANGES       = {};
            this.GFX_UPDATE_DATA[layerKey].REMOVALS_ONLY = [];
            this.GFX_UPDATE_DATA[layerKey].fade          = layerData.fade;
            this.GFX_UPDATE_DATA[layerKey].changes       = layerData.changes;
            this.GFX_UPDATE_DATA[layerKey].useFlicker    = layerData.useFlicker;
            if([layerKey] == "L1"){
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
                    this.GFX_UPDATE_DATA[layerKey].changes = true; 
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
            if(gamestate === ""){ return; }
            if(gamestate == undefined){ gamestate = _APP.game.gs1; }

            // Create the gamestate key in objs if it does not exist.
            if(this.objs[gamestate] == undefined){ this.objs[gamestate] = {}; }

            // console.log(`key: ${key}, gamestate: ${gamestate},`, this.objs[gamestate][key]);

            // Return the object.
            return this.objs[gamestate][key];
        },

        // Adds or updates one layer object for a gamestate.
        updateOne: function(className, config, gamestate){
            /* 
            // EXAMPLE USAGE:
            // NOTE: The last argument, gamestate is technically optional and defaults to the current gamestate 1.

            _GFX.layerObjs.updateOne(LayerObject, {
                    layerObjKey: "demo_board", layerKey: "L1", tilesetKey: "bg_tiles",
                    tmap: _GFX.funcs.getTilemap("bg_tiles", "board_28x28"),
                    x: 0, y: 0, xyByGrid: true,
                    settings : {
                        xFlip: false, yFlip: false, rotation: 0, colorData:[]
                    }
                }, _APP.game.gs1
            );
            */

            // If the gamestate was not provided use the current gamestate 1.
            if(gamestate === ""){ return; }
            if(gamestate == undefined){ gamestate = _APP.game.gs1; }

            // Create the gamestate key in objs if it does not exist.
            if(this.objs[gamestate] == undefined){ this.objs[gamestate] = {}; }

            // Add/Create the new layer object.
            if(!config.layerObjKey && config.text){ config.layerObjKey = config.text; }
            return this.objs[gamestate][ config.layerObjKey ] = new className(config);
        },

        // Remove one layer object from objs for a gamestate.
        removeOne: function(key, gamestate){
            /* 
            // EXAMPLE USAGE:
            // NOTE: The last argument, gamestate is technically optional and defaults to the current gamestate 1.

            _GFX.layerObjs.removeOne("keyNameToRemove", _APP.game.gs1);
            */

            // If the gamestate was not provided use the current gamestate 1.
            if(gamestate === ""){ return; }
            if(gamestate == undefined){ gamestate = _APP.game.gs1; }

            // Create the gamestate key in objs if it does not exist.
            if(this.objs[gamestate] == undefined){ this.objs[gamestate] = {}; }

            // If this key was not found then return.
            if(!this.objs[gamestate][key]){ return {}; }

            // If this layer object does not have a render function then assume the layer object is not created yet and skip the render.
            if(!this.objs[gamestate][key].render){ return {}; }

            // Remove from the graphics cache. 
            let config = this.objs[gamestate][key].removeLayerObject();
        
            // Clear this key.
            this.objs[gamestate][key] = {}; 
            
            // Delete this key.
            delete this.objs[gamestate][key];

            // Return the config to the caller (makes reuse easier.)
            return config;
        },
        
        // Removes the specified key from all gamestate keys in objs.
        removeOneAllGamestates: function(key){
            for(let gs in this.objs){ this.removeOne(key, gs); }
        },

        // Clear ALL layer objects in objs for a gamestate.
        clearAll : function(gamestate){
            /* 
            // EXAMPLE USAGE:
            // NOTE: The last argument, gamestate is technically optional and defaults to the current gamestate 1.

            _GFX.layerObjs.clearAll(_APP.game.gs1);
            */

            // If the gamestate was not provided use the current gamestate 1.
            if(gamestate === ""){ return; }
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

            _GFX.layerObjs.removeAll(_APP.game.gs1_prev);
            _GFX.layerObjs.removeAll(_APP.game.gs1);
            */

            // If the gamestate was not provided use the current gamestate 1.
            if(gamestate === ""){ return; }
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
            if(gamestate === ""){ return; }
            if(gamestate == undefined){ gamestate = _APP.game.gs1; }

            // Create the gamestate key in objs if it does not exist.
            if(this.objs[gamestate] == undefined){ this.objs[gamestate] = {}; }

            let layerObjects = {
                "L1": {},
                "L2": {},
                "L3": {},
                "L4": {},
            };
            
            // Get all the layer objects. 
            let temp;
            let cnt = 0;
            for(let key in this.objs[gamestate]){
                let obj = this.objs[gamestate][key];

                // Skip the rendering of unchanged layer objects. 
                if(!obj._changed){ continue; }
                
                // Render the layer objects if it contains the render function.
                if(obj.render){ 
                    temp = obj.render(true); 
                    if(!temp){ continue; }
                    layerObjects[temp.layerKey][key] = temp;
                    cnt += 1;
                }
            }

            // Render the layer object datas.
            if(cnt){ 
                // console.log(cnt); 

                // Send the layer objects to updateLayer all at once instead of one at a time.
                for(let layerKey in layerObjects){ 
                    _GFX.funcs.updateLayer(layerKey, layerObjects[layerKey]);
                }
            }
        },
    },

    // Drawing update and drawing functions. 
    funcs:{
        // Sets all changed data to unchanged.
        clearChanges: function(){
            // Clear the special changes flags.
            _GFX.ALLCLEAR = false;
            _GFX.DRAWNEEDED = false;
    
            // Clear the changes flags and update hashPrev.
            // NOTE: _GFX.currentData and _GFX.REMOVALS have the same layerKeys.
            for(let layerKey in _GFX.currentData){ 
                // Get a handle to this layer.
                let layer = _GFX.currentData[layerKey];
                
                //. Update the hashPrev for all layer objects.
                for(let mapKey in layer.tilemaps){ 
                    if(layer.tilemaps[mapKey].hashPrev != layer.tilemaps[mapKey].hash){
                        layer.tilemaps[mapKey].hashPrev = layer.tilemaps[mapKey].hash;
                    }
                }

                // Clear the changes flag.
                layer.changes = false;

                // Clear the REMOVALS array.
                _GFX.REMOVALS[layerKey] = [];

                // Update prevFade to currFade.
                // if(layer.fade.fade && layer.fade.prevFade != layer.fade.currFade){
                if(layer.fade.prevFade != layer.fade.currFade){
                    // console.log("Updating prevFade");
                    layer.fade.prevFade = layer.fade.currFade;
                }

                // Clear the CHANGES object in GFX_UPDATE_DATA.
                _GFX.GFX_UPDATE_DATA[layerKey].CHANGES = {};

                // Clear the REMOVALS_ONLY array in GFX_UPDATE_DATA.
                _GFX.GFX_UPDATE_DATA[layerKey].REMOVALS_ONLY = [];

                // fade
                // changes
                // bgColorRgba 
            }
        },

        // Determines if a draw is needed and updates _GFX.DRAWNEEDED.
        isDrawNeeded: function(){
            if(
                ! (
                    _GFX.ALLCLEAR                   ||
                    _GFX.currentData["L1"].changes ||
                    _GFX.currentData["L2"].changes ||
                    _GFX.currentData["L3"].changes ||
                    _GFX.currentData["L4"].changes ||
                    _GFX.DRAWNEEDED
                )
            )   { _GFX.DRAWNEEDED = false; }
            else{ _GFX.DRAWNEEDED = true;  }
            return _GFX.DRAWNEEDED;
        },

        // Ensures that settings is an object with at least the default values within it.
        correctSettings: function(settings){
            // Check if settings is a valid object. Make it an object if it is not already.
            if (settings === null || typeof settings !== 'object' || Array.isArray(settings)) {
                settings = {};
            }

            // Merge the default settings with the provided settings.
            // Already existing settings will remain and missing settings will be added from the default settings.
            return Object.assign({}, _GFX.defaultSettings, settings);
        },

        // This requests that all output canvases be cleared. 
        // Also removes all tilemap object data locally and in the WebWorker.
        clearAllLayers: async function(keepBg1BgColor=true){
            // Local data clear.
            for(let layerKey in _GFX.currentData){ 
                // Add to REMOVALS.
                for(let mapKey in _GFX.currentData[layerKey].tilemaps){ _GFX.REMOVALS[layerKey].push(mapKey); }

                // Remove all tilemaps. 
                for(let layerObjKey in _GFX.currentData[layerKey].tilemaps){
                    // console.log("CLEAR ALL LAYERS:", layerKey, layerObjKey, _GFX.currentData[layerKey].tilemaps[layerObjKey]);
                    // _GFX.layerObjs.removeOneAllGamestates(layerObjKey);
                    _GFX.funcs.removeLayerObj(layerKey, layerObjKey);
                }
                // _GFX.currentData[layerKey].tilemaps = {};

                // Keep the background color for L1?
                if(layerKey == "L1" && !keepBg1BgColor){
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

        // Updates the background color for L1.
        updateL1BgColorRgba: function(bgColorRgba=[0,0,0,255]){
            // _GFX.funcs.updateL1BgColorRgba([0,0,255,255]);
            let layer = "L1";

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
        // Creates/Updates an entry in _GFX.currentData[layer].tilemaps[tilemapKey].
        updateLayer: function(layer, tilemaps={}){
            // 
            if(layer == "L1" || layer == "L2" || layer == "L3" || layer == "L4"){
                let tilemap, exists, oldHash, newHash, hashCacheHash, hashCacheHash_BASE;
                let tw ;
                let th ;
                for(let tilemapKey in tilemaps){
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

                    // Fix settings.
                    tilemap.settings = Object.assign({}, _GFX.defaultSettings, tilemap.settings ?? {});

                    // If it exists then get it's existing hash.
                    if(exists){ oldHash = _GFX.currentData[layer].tilemaps[tilemapKey].hash ?? 0; }

                    // Generate a new hash for THIS layerObject. 
                    newHash = _GFX.utilities.djb2Hash( JSON.stringify([
                        // Location.
                        tilemap.x, 
                        tilemap.y, 

                        // Uniqueness of this tilemap.
                        tilemap.ts,                       // Tileset
                        JSON.stringify(tilemap.settings), // Settings
                        Array.from(tilemap.tmap),         // Tmap
                    ]));

                    // Is this a changed object?
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
                            mapKey : tilemapKey,

                            removeHashOnRemoval: tilemap.removeHashOnRemoval ?? true,
                            noResort           : tilemap.noResort ?? false,
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
            // layer can be one of: [ "L1", "L2", "L3", "TXT1", "ALL" ].
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
        sendGfxUpdates: async function(awaitDraw){
            // Update _GFX.GFX_UPDATE_DATA
            _GFX.create_GFX_UPDATE_DATA();

            if(_GFX.GFX_UPDATE_DATA.hasChanges){
                // Send ASYNC
                if(!awaitDraw){
                    // console.log("using await: false");
                    _WEBW_V.SEND("sendGfxUpdates", { 
                        data: _GFX.GFX_UPDATE_DATA, 
                        refs:[]
                    }, false, _APP.debugActive); // Request data if debug is active.
                }
                
                // Await for the graphics update to finish.
                else{
                    // console.log("using await: true");
                    await _WEBW_V.SEND("sendGfxUpdates", { 
                        data: _GFX.GFX_UPDATE_DATA, 
                        refs:[]
                    }, true, _APP.debugActive); // waitForResp, Request data if debug is active.
                }
            }

            // Clear the changes.
            _GFX.funcs.clearChanges();
        },

        // Returns a copy of a tilemap.
        getTilemap: function(ts, mapKey){
            // Reference.
            // return _GFX.tilesets[ts].tilemaps[mapKey];
            
            // Value copy.
            let tilemap = _GFX.tilesets[ts].tilemaps[mapKey];
            if(!tilemap){ 
                console.error(`getTilemap: Missing tmap: ts: ${ts}, mapKey: ${mapKey}`); 
                throw `getTilemap: Missing tmap: ts: ${ts}, mapKey: ${mapKey}`; 
            }
            return new Uint8Array(tilemap);
        },

        // Removes a layer object and sets the changes for that layer to true. 
        removeLayerObj: function(layerKey, mapKey){
            if(!_GFX.currentData[layerKey].tilemaps[mapKey]){
                // console.log("removeLayerObj: Could not find:", layerKey, mapKey);
                return; 
            }

            // Get a handle to REMOVALS for this layer.
            const removals = _GFX.REMOVALS[layerKey];
            
            // Find the index in REMOVALS for this mapkey.
            const index = removals.indexOf(mapKey);

            // Remove from REMOVALS if the mapKey was found. (So that the key does not appear more than once.)
            if (index !== -1) { removals.splice(index, 1); }
            
            // Add to REMOVALS.
            removals.push(mapKey);
        
            // Delete from currentData.
            delete _GFX.currentData[layerKey].tilemaps[mapKey];
            
            // Set changes to true so that the canvas output updates.
            _GFX.currentData[layerKey].changes = true;
        }, 

        // Creates a layer object from a tilemap.
        // NOTE: Output is used with updateLayer.
        createLayerObjData: function(obj={}){
            // Correct any missing data in the object.
            if(undefined == obj)        { console.log(obj); throw `createLayerObjData: Missing obj: ${JSON.stringify(obj)}`; }
            if(undefined == obj.mapKey) { console.log(obj); throw `createLayerObjData: Missing mapKey: ${JSON.stringify(obj)}`; }
            if(undefined == obj.tmap)   { console.log(obj); throw `createLayerObjData: Missing tmap: ${JSON.stringify(obj)}`; }
            if(undefined == obj.ts)     { console.log(obj); throw `createLayerObjData: Missing ts: ${JSON.stringify(obj)}`; }
            if(undefined == obj.x)      { console.log(obj); throw `createLayerObjData: Missing x: ${JSON.stringify(obj)}`; }
            if(undefined == obj.y)      { console.log(obj); throw `createLayerObjData: Missing y: ${JSON.stringify(obj)}`; }
            obj.settings = this.correctSettings(obj.settings); // Make sure that settings is an object.

            // Handle tilemap transforms.
            if(obj.settings.rotation || obj.settings.xFlip || obj.settings.yFlip){
                obj.tmap = _GFX.utilities.tilemapTransform(obj.tmap, obj.settings);
            }

            // Create the layerObject.
            let newObj = { 
                [obj.mapKey]: { 
                    ts      : obj.ts,
                    x       : obj.x,
                    y       : obj.y,
                    w       : obj.tmap[0] * _APP.configObj.dimensions.tileWidth,
                    h       : obj.tmap[1] * _APP.configObj.dimensions.tileHeight,
                    tmap    : obj.tmap,
                    settings: obj.settings,
                } 
            };

            // Adjust width and height if there is a rotation that would require the change.
            newObj[obj.mapKey].w = (obj.settings.rotation % 180 === 0) ? newObj[obj.mapKey].w : newObj[obj.mapKey].h;
            newObj[obj.mapKey].h = (obj.settings.rotation % 180 === 0) ? newObj[obj.mapKey].h : newObj[obj.mapKey].w;

            // Return the layerObject.
            return newObj;
        },

        // Creates a layer object from a tilemap based on text string(s).
        // NOTE: Output is used with updateLayer.
        // NOTE: If using an array of strings each line will have the same length as the longest line (padded with spaces.)
        createPrintLayerObjData: function(obj={}){
            // Correct any missing data in the object.
            if(undefined == obj)        { console.log(obj); throw `createPrintLayerObjData: Missing obj: ${JSON.stringify(obj)}`; }
            if(undefined == obj.mapKey) { console.log(obj); throw `createPrintLayerObjData: Missing mapKey: ${JSON.stringify(obj)}`; }
            if(undefined == obj.ts)     { console.log(obj); throw `createPrintLayerObjData: Missing ts: ${JSON.stringify(obj)}`; }
            if(undefined == obj.text)   { console.log(obj); throw `createPrintLayerObjData: Missing text: ${JSON.stringify(obj)}`; }
            if(undefined == obj.x)      { console.log(obj); throw `createPrintLayerObjData: Missing x: ${JSON.stringify(obj)}`; }
            if(undefined == obj.y)      { console.log(obj); throw `createPrintLayerObjData: Missing y: ${JSON.stringify(obj)}`; }
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
            let newTilemap = new Uint8Array( 2 + (mapWidth * mapHeight) );
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

            // Create the layerObject.
            let newObj = { 
                [obj.mapKey]: { 
                    ts      : obj.ts,
                    x       : obj.x,
                    y       : obj.y,
                    w       : newTilemap[0] * _APP.configObj.dimensions.tileWidth,
                    h       : newTilemap[1] * _APP.configObj.dimensions.tileHeight,
                    tmap    : newTilemap,
                    settings: obj.settings,
                } 
            };

            // Adjust width and height if there is a rotation that would require the change.
            newObj[obj.mapKey].w = (obj.settings.rotation % 180 === 0) ? newObj[obj.mapKey].w : newObj[obj.mapKey].h;
            newObj[obj.mapKey].h = (obj.settings.rotation % 180 === 0) ? newObj[obj.mapKey].h : newObj[obj.mapKey].w;

            // Return the layerObject.
            return newObj;
        },

        // This is called after each draw completes.
        afterDraw: function(data = {}){
            if(_APP.debugActive && _DEBUG){
                _DEBUG.timingsDisplay.gfx.updateCache(data); 

                // hashCacheStats
                _DEBUG.hashCacheStats_size1 = ( `${data["hashCacheMapSize1"]}` );
                _DEBUG.hashCacheStats_size2 = ( `${(data["hashCacheMapSize2"]/1000).toFixed(2)} KB` );
                // Sort so that the removeHashOnRemoval entries appear first.
                _DEBUG.hashCacheStats1 = data.hashCacheStats
                .sort((a, b) => {
                    if(a.removeHashOnRemoval.toString() >  b.removeHashOnRemoval.toString()){ return -1; }
                    if(a.removeHashOnRemoval.toString() <  b.removeHashOnRemoval.toString()){ return  1; }
                    if(a.removeHashOnRemoval.toString() == b.removeHashOnRemoval.toString()){ return  0; }
                }); 
                // .sort((a, b) => a.mapKey.localeCompare(b.mapKey));
            }

            if(data.newL1_bgColor){
                // Break out the rgb data.
                let [r,g,b,a] = data.newL1_bgColor;
                a = ( ( (a/255) * 100 ) |0 ) / 100;

                // Create strings for comparison
                let currentString = _GFX.currentData.L1.canvas.style['background-color'];
                let newString;

                // If the alpha is fully opaque then the browser will set to rgb, otherwise rgba. 
                if(a==1){ newString = `rgb(${r}, ${g}, ${b})`; }
                else    { newString = `rgba(${r}, ${g}, ${b}, ${a})`; }
                
                // Apply the new bgColorRgba if the currentString and newString do not match.
                if(currentString!=newString){
                    _GFX.currentData.L1.canvas.style['background-color'] = newString;
                    // console.log(`Changed from: ${currentString} to ${newString}`, r,b,g,a);
                }
                // else{
                    // console.log(`SAME: DATA  : ${currentString} to ${newString}`, r,b,g,a);
                // }
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
            return new Uint8Array([width, height, ...tileIndexes]);
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
            return new Uint8Array([width, height, ...tileIndexes]);
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
            return new Uint8Array([width, height, ...tileIndexes]);
        },
        // Performs required transforms to a tilemap and returns the new tilemap.
        tilemapTransform: function(tmap, settings){
            // DISABLED:
            return tmap;
            
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

        // Send the init request with the config data. Await the response.
        await _WEBW_V.SEND("initConfigAndGraphics", {data: { configObj: _APP.configObj, defaultSettings: _GFX.defaultSettings } }, true, true);
        
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

// ***********
// * CLASSES *
// ***********

// Creates one LayerObject.
class LayerObject {
    /* EXAMPLE USAGE:
    */

    // // Getters and setters:
    get x()          { return this._x; } 
    get y()          { return this._y; } 
    get tmap()       { return this._tmap; } 
    get layerKey()   { return this._layerKey; } 
    // get tilesetKey() { return this._tilesetKey; } 
    get settings()   { return this._settings; } 
    get xyByGrid()   { return this._xyByGrid; } 
    
    set x(value)          { if( this._x          !== value){ this._x          = value; this._changed = true; } }
    set y(value)          { if( this._y          !== value){ this._y          = value; this._changed = true; } }
    set tmap(value)       { if( this._tmap       !== value){ this._tmap       = value; this._changed = true; } }
    set layerKey(value)   { if( this._layerKey   !== value){ 
        // Remove the existing layerObject from it's previous layer.
        // _GFX.layerObjs.getOne("N782_oneStar_anim2_10", "gs_N782").layerKey = "L1";
        if(this._layerKey && this.layerObjKey && _GFX.currentData[this._layerKey].tilemaps[this.layerObjKey]){
            console.log(`REMOVING: layerKey: ${this._layerKey}, layerObjKey: ${this.layerObjKey}`);
            _GFX.funcs.removeLayerObj(this._layerKey, this.layerObjKey);
            // _GFX.currentData["L2"].tilemaps["N782_oneStar_anim2_10"];
        }

        this._layerKey   = value; this._changed = true; 
    } }
    // set tilesetKey(value) { if( this._tilesetKey !== value){ this._tilesetKey = value; this._changed = true; } }
    set settings(value)   { 
        // this._settings = value; 
        this._settings = Object.assign({}, _GFX.defaultSettings, value ?? {});
        this._changed = true; 
    }
    // TODO: FIX. Works find with gridxy to pixelxy. Need fix for pixelxy to gridxy.
    set xyByGrid(value)   { 
        if(this._xyByGrid == value) { return; }

        // xyByGrid requires tw and th.
        
        // Get the tileWidth and tileHeight from the tileset config. 
        if(this.tilesetKey){
            this.tw = _GFX.tilesets[this.tilesetKey].config.tileWidth ;
            this.th = _GFX.tilesets[this.tilesetKey].config.tileHeight;
        }
        // Get the tileWidth and tileHeight from the configObj.dimensions config.
        else{
            this.tw = _APP.configObj.dimensions.tileWidth ;
            this.th = _APP.configObj.dimensions.tileHeight;
        }

        this._xyByGrid = value; 
        this._changed = true; 
    }
    
    getSetting(key)       { return this._settings[key]; } 
    setSetting(key, value){ 
        if(this._settings[key] == value) { return; }
        this._settings[key] = value; 
        this._changed = true; 
    }

    constructor(config){
        this.className = this.constructor.name;
        
        // Settings.
        this.settings = config.settings ?? _GFX.funcs.correctSettings(null);

        this.orgConfig  = config;

        // layerObjKey (MapKey), layerKey, and tilesetKey.
        this.text = config.text ?? "NO_TEXT"
        this.layerObjKey = config.layerObjKey;
        this.layerKey    = config.layerKey;
        this.tilesetKey  = config.tilesetKey;
        this.removeHashOnRemoval = config.removeHashOnRemoval ?? false;
        this.noResort = config.noResort ?? false,

        // Tilemap. (It is possible that a tilemap is not provided/required.)
        this.tmap = config.tmap; // ?? new Uint8Array([1,1,0]);

        // X position.
        this.x = config.x ?? 0;
        
        // Y position.
        this.y = config.y ?? 0;

        // x,y positioning (grid or pixel based.)
        this.xyByGrid = config.xyByGrid ?? false;
        
        // Change detection.
        this._changed = true;
    };
    
    // Removes the LayerObject from _GFX.layerObj.objs.
    removeLayerObject(){
        // console.log("NOT READY: removeLayerObject", this); return;
        
        // NOTE: The object instance will need to be removed from where it was stored.
        
        // Remove the layer object from the cache.
        _GFX.funcs.removeLayerObj(this.layerKey, this.layerObjKey);
        
        // Return the original config. (Helpful when changing layers.)
        return this.orgConfig;
    };

    // Render function.
    clampXandY(x, y, w, h){
        let maxX = _APP.configObj.dimensions.cols * _APP.configObj.dimensions.tileWidth;
        let maxY = _APP.configObj.dimensions.rows * _APP.configObj.dimensions.tileHeight;

        // console.log(x,y,w,h, this);

        // Min/Max x.
        x = Math.max(
            0-w, 
            Math.min(x, maxX+w)
        );
        
        // Min/Max y.
        y = Math.max(
            0-h, 
            Math.min(y, maxY+h)
        );

        return { x:x, y:y };
    };

    render(onlyReturnLayerObjData=false){
        // Do not render unchanged LayerObjects.
        if(!this._changed){ return; }

        // Draw by grid or by pixel?
        let x = this.x; 
        let y = this.y;
        if(this.xyByGrid && this.tilesetKey){ 
            x = x * this.tw; 
            y = y * this.th;
        }
        
        // Clamp x and y to the acceptable range on screen.
        let w = this.tmap[0] * _APP.configObj.dimensions.tileWidth;
        let h = this.tmap[1] * _APP.configObj.dimensions.tileHeight;
        ({x,y} = this.clampXandY(x,y, w, h));

        //
        let layerObjectData;
        
        layerObjectData = _GFX.funcs.createLayerObjData({ 
            mapKey  : this.layerObjKey, 
            x       : x, 
            y       : y, 
            ts      : this.tilesetKey, 
            settings: this.settings, 
            tmap    : this.tmap,
            removeHashOnRemoval: this.removeHashOnRemoval,
            noResort           : this.noResort,
        });

        if(onlyReturnLayerObjData){ 
            layerObjectData[this.layerObjKey].layerKey = this.layerKey;
            this._changed = false;
            return layerObjectData[this.layerObjKey]; 
        }
        else{
            //
            _GFX.funcs.updateLayer(this.layerKey, 
                {
                    ...layerObjectData,
                }
            );
            this._changed = false;
        }
    };
}

// 
class PrintText extends LayerObject{
    get text()   { return this._text; } 
    // set text(value){ if( this._text !== value){ this._text = value; this._changed = true; } }
    set text(value){ if( this._text !== value){ this._text = value; this._changed = true; } }

    constructor(config){
        super(config);
        this.className = this.constructor.name;

        // mapKey  : this.layerObjKey, 
        
        this.text = config.text;
        this.removeHashOnRemoval = config.removeHashOnRemoval ?? true;
        this.noResort = config.noResort ?? true;

        if(!this.layerKey)  { this.layerKey = "L4";}
        if(!this.tilesetKey){ this.tilesetKey = "font_tiles1"; }

        // This part should be handled already by _GFX.funcs.layerObjs.updateOne.
        if(!config.layerObjKey){ config.layerObjKey = config.text; }

        this._changed = true;
    }

    // Render function.
    render(onlyReturnLayerObjData=false){
        // Do not render unchanged LayerObjects.
        if(!this._changed){ return; }

        // Text with no length? 
        if(!this.text.length){ this.text = " "; }

        // Draw by grid or by pixel?
        let x = this.x; 
        let y = this.y;
        if(this.xyByGrid && this.tilesetKey){ 
            x = x * this.tw; 
            y = y * this.th;
        }

        //
        let layerObjectData;
        layerObjectData = _GFX.funcs.createPrintLayerObjData({ 
            mapKey  : this.layerObjKey, 
            x       : x, 
            y       : y, 
            ts      : this.tilesetKey, 
            settings: this.settings, 
            tmap    : this.tmap,
            text    : this.text, 
            removeHashOnRemoval: this.removeHashOnRemoval,
            noResort           : this.noResort,
        });
        this.tmap = layerObjectData[this.layerObjKey].tmap;

        // Clamp x and y to the acceptable range on screen.
        let w = this.tmap[0];
        let h = this.tmap[1];
        ({x:layerObjectData[this.layerObjKey].x ,y: layerObjectData[this.layerObjKey].y} = this.clampXandY(x,y, w, h));

        if(onlyReturnLayerObjData){ 
            layerObjectData[this.layerObjKey].layerKey = this.layerKey;
            this._changed = false;
            return layerObjectData[this.layerObjKey]; 
        }
        else{
            
            //
            _GFX.funcs.updateLayer(this.layerKey, 
                {
                    ...layerObjectData,
                }
            );
            this._changed = false;
        }
    };

};