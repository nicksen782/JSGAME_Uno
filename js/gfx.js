var _GFX = {
    timings: {},

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
        L1: new Set(),
        L2: new Set(),
        L3: new Set(),
        L4: new Set(),
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
        let DATA = this.GFX_UPDATE_DATA;
        DATA.gs1        = _APP.game.gs1 ;
        DATA.gs2        = _APP.game.gs2 ;
        DATA.ALLCLEAR   = _GFX.ALLCLEAR;
        DATA.hasChanges = _GFX.DRAWNEEDED;

        for(let layerKey in _GFX.currentData){ 
            let layerData = _GFX.currentData[layerKey];
            DATA[layerKey].CHANGES       = {};
            DATA[layerKey].REMOVALS_ONLY = [];
            DATA[layerKey].fade          = layerData.fade;
            DATA[layerKey].changes       = layerData.changes;
            DATA[layerKey].useFlicker    = layerData.useFlicker;
            if(layerKey == "L1"){
                DATA[layerKey].bgColorRgba   = layerData.bgColorRgba;
            }

            // Process what has changed.
            let tilemap;
            for(let mapKey in layerData.tilemaps){ 
                tilemap = layerData.tilemaps[mapKey];

                // ADD or CHANGED
                if(
                    tilemap.hashPrev == 0 ||
                    tilemap.hashPrev != tilemap.hash
                ){ 
                    DATA[layerKey]["CHANGES"][mapKey] = tilemap; 
                    DATA.hasChanges = true; 
                    DATA[layerKey].changes = true; 
                }
            }
            
            // REMOVALS_ONLY 
            // Compare the keys of changes against the keys of removals. 
            // Any key that is in changes should NOT be in removals.
            let changesKeys = new Set( Object.keys(DATA[layerKey].CHANGES) );
            for(let key of _GFX.REMOVALS[layerKey]){
                if(!changesKeys.has(key)){ 
                    // console.log(`Adding '${key}' to removals because it is NOT in changes`);
                    DATA[layerKey]["REMOVALS_ONLY"].push(key); 
                }
                else{
                    // console.log(`NOT adding '${key}' to removals because it is also in changes`);
                }
            }
            
            // If there is a removal on this layer then then the layer should be flagged for changes. 
            if(DATA[layerKey]["REMOVALS_ONLY"].length){
                DATA.hasChanges = true; 
                DATA[layerKey].changes = true;
            }
            // DATA[layerKey]["REMOVALS_ONLY"] = [ ... _GFX.REMOVALS[layerKey] ];
        }
    },

    // Used for layer object management within a gamestate.
    layerObjs: {
        // Holds the layer objects per gamestate.
        objs: {},
        
        // Holds object key that are to be removed (hidden first THEN removed on the next frame.)
        // removalQueue: new Set(),

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

        // Adds or replaces one layer object for a gamestate.
        createOne: function(className, config, gamestate){
            /* 
            // EXAMPLE USAGE:
            // NOTE: The last argument, gamestate is technically optional and defaults to the current gamestate 1.

            _GFX.layerObjs.createOne(LayerObject, {
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

            // this.removalQueue.add(key);

            // Remove from the graphics cache. 
            let config = this.objs[gamestate][key].removeLayerObject();
        
            // Clear this key.
            this.objs[gamestate][key] = {}; 
            
            // Delete this key.
            this.objs[gamestate][key] = null;
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

            layerObjects = null;
            // delete layerObjects;
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

                // Save the layerChange if debug mode is on (for _DEBUG.layerObjs.)
                if(_APP.debugActive){
                    if(layer.changes){
                        _DEBUG.layerObjs.changes[layerKey] = true;
                    }
                }

                // Clear the changes flag.
                layer.changes = false;

                // Clear the REMOVALS array.
                _GFX.REMOVALS[layerKey].clear();

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
                for(let mapKey in _GFX.currentData[layerKey].tilemaps){ 
                    _GFX.REMOVALS[layerKey].add(mapKey); 
                }

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

                // Clear all changes and removals for this layer. 
                _GFX.REMOVALS[layerKey].clear();
                _GFX.currentData[layerKey].REMOVALS_ONLY = [];
                _GFX.currentData[layerKey].CHANGES = {};

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

            if(Array.isArray(bgColorRgba) && bgColorRgba.length){
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
            // Only accept these layerKeys:
            if(layer == "L1" || layer == "L2" || layer == "L3" || layer == "L4"){
                let tilemap, exists, oldHash, newHash;
                let tw ;
                let th ;
                for(let tilemapKey in tilemaps){
                    // Get the tilemap from the provided list.
                    tilemap = tilemaps[tilemapKey];
                    tw = _GFX.tilesets[tilemap.ts].config.tileWidth;
                    th = _GFX.tilesets[tilemap.ts].config.tileHeight;

                    // Make sure that settings is an object.
                    tilemap.settings = this.correctSettings(tilemap.settings);

                    // Ensure that x and y are integers.
                    tilemap.x = tilemap.x | 0;
                    tilemap.y = tilemap.y | 0;

                    // Does this tilemapKey already exist?
                    exists = _GFX.currentData[layer].tilemaps[tilemapKey] ? true : false;

                    // If useGlobalOffsets is defined use them to offset x and y.
                    if(_APP.configObj.useGlobalOffsets){
                        tilemap.x += ( (_APP.configObj.globalOffsets.x ?? 0) * tw);
                        tilemap.y += ( (_APP.configObj.globalOffsets.y ?? 0) * th);
                    }

                    // Fix settings.
                    // tilemap.settings = Object.assign({}, _GFX.defaultSettings, tilemap.settings ?? {});

                    // If it exists then get it's existing hash.
                    if(exists){ oldHash = _GFX.currentData[layer].tilemaps[tilemapKey].hash ?? 0; }

                    // Generate a new hash for THIS layerObject. 
                    newHash = _GFX.utilities.djb2Hash( JSON.stringify([
                        // Location.
                        tilemap.x, 
                        tilemap.y, 
                        tilemap.hidden ?? false, 

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
                            hidden   : tilemap.hidden ?? false,
                            settings : tilemap.settings,
                            mapKey   : tilemapKey,
                            
                            text : tilemap.text,
                            removeHashOnRemoval: tilemap.removeHashOnRemoval ?? true,
                            noResort           : tilemap.noResort ?? false,
                        };

                        // Set the changes flag for this layer since there were changes.
                        _GFX.currentData[layer].changes = true;
                    }
                }
            }
            else{
                console.error("updateLayer: INVALID LAYER KEY:", layer);
            }
        },

        // Sets the fade over-ride values for all or any layers.
        // NOTE: Fade uses preGenerated fadeTiles so color replacements will be skipped.
        setFade: function(layer="ALL", level=0){
            // EXAMPLE USAGE:
            // _GFX.funcs.setFade("ALL", 5);
            // NOTES: 
            // layer can be one of: [ "L1", "L2", "L3", "TXT1", "ALL" ].
            // level can be one of: [ null, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ]
            // level for null can alternatively be: [ "off" ]
            // level for 10 and 11 can alternatively be one of: [ "black", "clear" ]

            // Convert named levels to their actual level value.
            if     (level == "off"){ level = null; }
            else if(level == "black"){ level = 10; }
            else if(level == "clear"){ level = 11; }

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

            // Affect an individual layer.
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
            let pointersSize = _GFX.tilesets[ts].config.pointersSize;

            if(!tilemap){ 
                console.error(`Missing tile map for '${ts}':'${mapKey}'. Returning blank tilemap.`);
                return pointersSize == 8 
                    ? new Uint8Array([0,0, 0])
                    : new Uint16Array([0,0, 0]);
            }

            return pointersSize == 8 
                ? new Uint8Array(tilemap)
                : new Uint16Array(tilemap);
        },

        // Removes a layer object and sets the changes for that layer to true. 
        removeLayerObj: function(layerKey, mapKey){
            if(!_GFX.currentData[layerKey].tilemaps[mapKey]){
                // console.log("removeLayerObj: Could not find:", layerKey, mapKey);
                return; 
            }

            // Add to the set (won't add if it is already there.)
            _GFX.REMOVALS[layerKey].add(mapKey);

            // Delete from currentData.
            if(_GFX.currentData[layerKey].tilemaps[mapKey]){
                _GFX.currentData[layerKey].tilemaps[mapKey] = null;
                delete _GFX.currentData[layerKey].tilemaps[mapKey];
            }
            
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
                    text    : false,
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
            let newTilemap;
            let pointersSize = _GFX.tilesets[obj.ts].config.pointersSize;
            newTilemap = pointersSize == 8 
                ? new Uint8Array( 2 + (mapWidth * mapHeight) )
                : new Uint16Array( 2 + (mapWidth * mapHeight) );
            
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
                    text    : obj.text,
                } 
            };

            // Adjust width and height if there is a rotation that would require the change.
            newObj[obj.mapKey].w = (obj.settings.rotation % 180 === 0) ? newObj[obj.mapKey].w : newObj[obj.mapKey].h;
            newObj[obj.mapKey].h = (obj.settings.rotation % 180 === 0) ? newObj[obj.mapKey].h : newObj[obj.mapKey].w;

            // Return the layerObject.
            return newObj;
        },

        // This is called after each draw completes.
        afterDraw: function(data={}, forceGraphicsDataUsed=false){
            if(_APP.debugActive){
                if(data == ""){ return; }

                // BACKGROUND COLOR CHANGES
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

                // If debug is active and awaitDraw is active then run the debugTasks.
                if(_APP.debugActive){
                    // Save these timings.
                    _DEBUG.savePrevGfxTimings(data);

                    // console.log("normal afterDraw");
                    _DEBUG.debugTasks(1);
                }
            }
        },
    },

    // Transformation utilities.
    utilities:{
        // Returns a hash for the specified string. (Variation of Dan Bernstein's djb2 hash.)
        djb2Hash: function(str) {
            // Example usages:
            // _GFX.utilities.djb2Hash( "string to hash" );
            // _GFX.utilities.djb2Hash( [1, 2, 3, "4", "5", [1,2,3] ]);
            if(typeof str != "string") { str = str.toString(); }
            var hash = 5381;
            for (var i = 0; i < str.length; i++) {
                hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
            }
            return hash;
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
        }, true, true);

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

    // Checks if arrays are equal. (May use recursion.)
    static areArraysEqual(array1, array2){
        // LayerObject.areArraysEqual(tmap1, tmap2);

        // Ensure that the inputs are defined.
        if (undefined == array1 || undefined == array2) { 
            console.error("areArraysEqual: Inputs must be arrays.", array1, array2);
            return false; 
        }

        // Check if the arrays are the same length. If they are then there is nothing more that needs to be checked.
        if (array1.length !== array2.length) { return false; }
    
        // Check if all items exist and are in the same order
        for (let i = 0; i < array1.length; i++) {
            // Handle arrays using recursion.
            if (
                Array.isArray(array1[i]) && 
                Array.isArray(array2[i])
            ) {
                if (!this.areArraysEqual(array1[i], array2[i])) {
                    return false;
                }
            } 
            // Handle normal properties. Are these properties that same value?
            else if (array1[i] !== array2[i]) {
                return false;
            }
        }
    
        // If we have not returned false by this point then the arrays are equal.
        return true;
    };
    
    // // Getters and setters:
    get x()          { return this._x; } 
    get y()          { return this._y; } 
    get tmap()       { return this._tmap; } 
    get layerKey()   { return this._layerKey; } 
    get tilesetKey() { return this._tilesetKey; } 
    get settings()   { return this._settings; } 
    get xyByGrid()   { return this._xyByGrid; } 
    get hidden()     { return this._hidden; } 
    
    set hidden(value)     { if( this._hidden     !== value){ this._hidden     = value; this._changed = true; } }
    set x(value)          { if( this._x          !== value){ this._x          = value; this._changed = true; } }
    set y(value)          { if( this._y          !== value){ this._y          = value; this._changed = true; } }
    set tmap(value)       { 
        if(!this._tmap || !LayerObject.areArraysEqual(this._tmap, value) ){
            this._tmap = value; this._changed = true; 
        } 
    }
    set layerKey(value)   { if( this._layerKey   !== value){ 
        // Remove the existing layerObject from it's previous layer.
        if(this._layerKey && this.layerObjKey && _GFX.currentData[this._layerKey].tilemaps[this.layerObjKey]){
            // console.log(`REMOVING: layerKey: ${this._layerKey}, layerObjKey: ${this.layerObjKey}`);
            _GFX.funcs.removeLayerObj(this._layerKey, this.layerObjKey);
        }

        this._layerKey   = value; 
        this._changed = true; 
    } }
    set tilesetKey(value) { 
        if( this._tilesetKey !== value){ 
            this._tilesetKey = value; 
            this._changed = true; 
        } 
    }
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
        this.layerObjKey = config.layerObjKey;
        this.layerKey    = config.layerKey;
        this.tilesetKey  = config.tilesetKey;
        this.removeHashOnRemoval = config.removeHashOnRemoval ?? true;
        this.noResort = config.noResort ?? false;

        // Tilemap. (It is possible that a tilemap is not provided/required.)
        this.tmap = config.tmap; 

        // X position.
        this.x = config.x ?? 0;
        
        // Y position.
        this.y = config.y ?? 0;

        // x,y positioning (grid or pixel based.)
        this.xyByGrid = config.xyByGrid ?? false;
        
        this.hidden = config.hidden ?? false;

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

    // Force x and y values to be within the acceptable range.
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

    // Render function.
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

        // Ensure that x and y are integers.
        x = x | 0;
        y = y | 0;
        
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
        layerObjectData[this.layerObjKey].hidden = this.hidden;

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
    /*
    // Create one line as one LayerObject.
    _GFX.layerObjs.createOne(PrintText, { text: "LINE OF TEXT: ", x:0, y: 0, layerObjKey: `textLine1`, layerKey: "L4", xyByGrid: true, });

    // Create multiple lines as one LayerObject. 
    // (Width of the entire tilemap is determined by the longest line. 
    // Shorter lines are padded with spaces.)
    _GFX.layerObjs.createOne(PrintText, { text: ["LINE 1", "THIS IS LINE 2"], x:0, y: 0, layerObjKey: `textLine1`, layerKey: "L4", xyByGrid: true, });

    // Create multiple lines each being a separate LayerObject allowing each line to have different settings.
    // layerObjectKeys will contain an array of the LayerObject keys created.
    let layerObjectKeys;
    {
        // Specify some settings that can be used by lines.
        let bgColorRgba = [16, 16, 16, 224];
        let settingsGrayOut   = { colorData: [ [ [255,255,255,255], [104,104,104,255] ]], bgColorRgba: bgColorRgba };

        // Create the lines.
        layerObjectKeys = PrintText.genMultipleLines({
            // Start position of x and y.
            x:PauseMenu.pos.box.x, 
            y:PauseMenu.pos.box.y, 

            // Starts as hidden (true/false)
            hidden:true,

            // This indicates if each line should be the same width as the longest line (padded with spaces.)
            padLines: true, 

            layerObjKey: "pause_menu_text", tilesetKey: "font_tiles1", layerKey: "L4", 

            // Shared settings (if settings is not specified for a line.)
            settings: { bgColorRgba: [16, 16, 16, 224] },
            
            lines: [
                { t: `  PAUSE   MENU  `   , },
                { t: ``                   , },
                { t: `   RESET ROUND`     , },
                { t: `   EXIT GAME`       , },
                { t: `   AUTO PLAY`       , s: settingsGrayOut }, // This line has grayOut settings applied.
                { t: `   CANCEL`          , },
                { t: ``                   , },
                { t: ``                   , skip: true }, // These lines are ignored but y still increments.
                { t: ``                   , skip: true }, // These lines are ignored but y still increments.
                { t: ``                   , skip: true }, // These lines are ignored but y still increments.
                { t: ``                   , skip: true }, // These lines are ignored but y still increments.
                { t: ``                   , skip: true }, // These lines are ignored but y still increments.
                { t: ``                   , },
                { t: `B:CANCEL   A:SET`   , },
            ]
        });
    }
    */

    get text()   { return this._text; } 
    set text(value){ if( this._text !== value){ this._text = value; this._changed = true; } }

    static genMultipleLines(config){
        let line;
        let settings;
        let padLines = config.padLines ?? false;
        let textWidth;
        if(padLines){
            // Determine the longest line. 
            textWidth = config.lines.reduce((longestLength, current) => {
                return current.t.length > longestLength ? current.t.length : longestLength;
            }, 0);
        }

        // Get the x and y from the config.
        let x = config.x;
        let y = config.y;

        let layerObjectKey;
        let layerObjectKeys = [];

        // Create each line from the config.
        for(let i=0, len=config.lines.length; i<len; i+=1){
            // Go to the next line down.
            if(config.lines[i].skip){ y+=1; continue; }

            // Get the text for this line (trim the right side of the line or pad it.)
            if(padLines){ line = config.lines[i].t.padEnd(textWidth, " "); }
            else        { line = config.lines[i].t.trimRight(); }

            // Get the settings for this line.
            settings = config.lines[i].s ?? config.settings ?? {};

            // If the line has length then create the line with the text and settings for this line.
            if(line.length){
                layerObjectKey = `${config.layerObjKey}_L_${i}`;
                // Create the line.
                _GFX.layerObjs.createOne(PrintText, { 
                    text: line, 
                    x: x, 
                    y: y,
                    layerObjKey: layerObjectKey, 
                    layerKey   : config.layerKey   ?? "L4", 
                    tilesetKey : config.tilesetKey ?? "font_tiles1", 
                    xyByGrid   : true, 
                    settings   : settings,
                    hidden: config.hidden ?? false,
                });
                layerObjectKeys.push(layerObjectKey);
            }

            // Go to the next line down.
            y+=1;
        }

        // Return the array of layerObjectKeys.
        return layerObjectKeys;
    };

    constructor(config){
        super(config);
        this.className = this.constructor.name;

        // mapKey  : this.layerObjKey, 
        
        this.text = config.text ?? ""
        this.removeHashOnRemoval = config.removeHashOnRemoval ?? true;
        this.noResort = config.noResort ?? true;

        if(!this.layerKey)  { this.layerKey = "L4";}
        if(!this.tilesetKey){ this.tilesetKey = "font_tiles1"; }

        // This part should be handled already by _GFX.funcs.layerObjs.createOne.
        // TODO: This could result in a very large name.
        if(!config.layerObjKey){ config.layerObjKey = config.text; }

        this._changed = true;
    }

    // Render function.
    render(onlyReturnLayerObjData=false){
        // Do not render unchanged LayerObjects.
        if(!this._changed){ return; }

        // Text with no length? 
        if(!this.text.length){ this.text = ""; }

        // Draw by grid or by pixel?
        let x = this.x; 
        let y = this.y;
        if(this.xyByGrid && this.tilesetKey){ 
            x = x * this.tw; 
            y = y * this.th;
        }

        // Ensure that x and y are integers.
        x = x | 0;
        y = y | 0;

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
        layerObjectData[this.layerObjKey].hidden = this.hidden;
        this.tmap = layerObjectData[this.layerObjKey].tmap;

        // Clamp x and y to the acceptable range on screen.
        let w = this.tmap[0];
        let h = this.tmap[1];
        ({x:layerObjectData[this.layerObjKey].x ,y: layerObjectData[this.layerObjKey].y} = this.clampXandY(x,y, w, h));
        // this.text

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