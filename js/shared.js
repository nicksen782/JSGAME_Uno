_APP.shared = {
    // Used for frame-count-based timing.
    genTimer: {
        timers:{},

        // Creates a timer. Check with check. Must be reset/recreated after it finishes before reusing.
        create: function(name, maxFrames, gamestate){
            // EXAMPLE USAGE:
            // _APP.shared.genTimer.create("timer1", 60);
            // _APP.shared.genTimer.create("timer1", 60, _APP.game.gs1);

            if(gamestate == undefined){ gamestate = _APP.game.gs1; }
            if(this.timers[gamestate] == undefined){ this.timers[gamestate] = {}; }

            this.timers[gamestate][name] = {
                finished  : false,
                maxFrames : maxFrames,
                frameCount: 0,
            };
        },

        // Resets a timer to it's starting state.
        reset : function(name, gamestate){
            // EXAMPLE USAGE:
            // _APP.shared.genTimer.reset("timer1");
            // _APP.shared.genTimer.reset("timer1", _APP.game.gs1);

            if(gamestate == undefined){ gamestate = _APP.game.gs1; }

            if(!this.timers[gamestate][name]){ 
                console.error("ERROR: genTimer:reset: This timer does not exist:", name, gamestate);
                return; 
            }
    
            // Reset the timer. 
            this.timers[gamestate][name] = {
                finished  : false,
                maxFrames : this.timers[gamestate][name].maxFrames,
                frameCount: 0,
            };
        },

        // Sets the timer to it's finished state.
        finish: function(name, gamestate){
            // EXAMPLE USAGE:
            // _APP.shared.genTimer.finish("timer1");
            // _APP.shared.genTimer.finish("timer1", _APP.game.gs1);

            if(gamestate == undefined){ gamestate = _APP.game.gs1; }

            if(!this.timers[gamestate][name]){ 
                console.error("ERROR: genTimer:finish: This timer does not exist:", name, gamestate);
                return; 
            }
    
            // Finish the timer. 
            this.timers[gamestate][name] = {
                finished  : true,
                maxFrames : this.timers[gamestate][name].maxFrames,
                frameCount: this.timers[gamestate][name].maxFrames,
            };
        },

        // Returns true if the timer is complete. Otherwise it increments the timer's frameCount and returns false.
        check : function(name, gamestate){
            // EXAMPLE USAGE:
            // _APP.shared.genTimer.check("timer1");
            // _APP.shared.genTimer.check("timer1", _APP.game.gs1);
            
            if(gamestate == undefined){ gamestate = _APP.game.gs1; }

            if(!this.timers[gamestate][name]){ 
                console.error("ERROR: genTimer:check: This timer does not exist:", name, gamestate);
                return; 
            }

            // Return true if finished.
            if(this.timers[gamestate][name].finished){ return true; };

            // Check and update the timer. 
            if(
                this.timers[gamestate][name].frameCount >= this.timers[gamestate][name].maxFrames && 
                !this.timers[gamestate][name].finished
            ){
                this.timers[gamestate][name].finished = true;
            }
            else{
                // Increment by 1.
                this.timers[gamestate][name].frameCount += 1;
            }

            return this.timers[gamestate][name].finished;

        },
    },
    border:{
        createBorder1: function(config){
            /* 
            _APP.shared.border.createBorder1({
                x:1, y:9, w: 26, h: 11, 
                layerObjKey: `border1`, layerKey: "L4", xyByGrid: true, tilesetKey: "bg_tiles1"
            });
        
            */
            // A border uses 6 different tiles.
            let tile_border_tl;
            let tile_border_tr;
            let tile_border_bl;
            let tile_border_br;
            let tile_border_vert;
            let tile_border_horz;
            config.borderType = config.borderType ?? 1;

            // Border with transparency.
            if(config.borderType == 1){
                tile_border_tl   = _GFX.funcs.getTilemap("bg_tiles1", "border1_tl")[2];
                tile_border_tr   = _GFX.funcs.getTilemap("bg_tiles1", "border1_tr")[2];
                tile_border_bl   = _GFX.funcs.getTilemap("bg_tiles1", "border1_bl")[2];
                tile_border_br   = _GFX.funcs.getTilemap("bg_tiles1", "border1_br")[2];
                tile_border_vert = _GFX.funcs.getTilemap("bg_tiles1", "border1_row")[2];
                tile_border_horz = _GFX.funcs.getTilemap("bg_tiles1", "border1_col")[2];
            }
            // Gameboard border.
            else if(config.borderType == 2){
                tile_border_tl   = _GFX.funcs.getTilemap("bg_tiles1", "border2_tl")[2];
                tile_border_tr   = _GFX.funcs.getTilemap("bg_tiles1", "border2_tr")[2];
                tile_border_bl   = _GFX.funcs.getTilemap("bg_tiles1", "border2_bl")[2];
                tile_border_br   = _GFX.funcs.getTilemap("bg_tiles1", "border2_br")[2];
                tile_border_vert = _GFX.funcs.getTilemap("bg_tiles1", "border2_row")[2];
                tile_border_horz = _GFX.funcs.getTilemap("bg_tiles1", "border2_col")[2];
            }
            // Border with black instead of transparency.
            else if(config.borderType == 3){
                tile_border_tl   = _GFX.funcs.getTilemap("bg_tiles1", "border3_tl")[2];
                tile_border_tr   = _GFX.funcs.getTilemap("bg_tiles1", "border3_tr")[2];
                tile_border_bl   = _GFX.funcs.getTilemap("bg_tiles1", "border3_bl")[2];
                tile_border_br   = _GFX.funcs.getTilemap("bg_tiles1", "border3_br")[2];
                tile_border_vert = _GFX.funcs.getTilemap("bg_tiles1", "border3_row")[2];
                tile_border_horz = _GFX.funcs.getTilemap("bg_tiles1", "border3_col")[2];
            }
        
            // A border has 8 parts and thus 8 tilemaps. Potentially one more tilemap for the fill.
            let tilemaps = {
                // BORDER: CORNER: TOP-LEFT
                corner_tl   : { 
                    layerObjKey: `${config.layerObjKey}_TL`, 
                    layerKey   : config.layerKey   ?? "L4", 
                    tilesetKey : config.tilesetKey ?? "bg_tiles1",
                    tmap: new Uint8Array( [1, 1, tile_border_tl ] ),
                    x: config.x, y: config.y, 
                },
                // BORDER: CORNER: TOP-RIGHT
                corner_tr   : { 
                    layerObjKey: `${config.layerObjKey}_TR`, 
                    layerKey   : config.layerKey   ?? "L4", 
                    tilesetKey : config.tilesetKey ?? "bg_tiles1",
                    tmap: new Uint8Array( [1, 1, tile_border_tr ] ),
                    x: config.x+config.w-1, y: config.y, 
                },
                // BORDER: CORNER: BOTTOM-LEFT
                corner_bl   : { 
                    layerObjKey: `${config.layerObjKey}_BL`, 
                    layerKey   : config.layerKey   ?? "L4", 
                    tilesetKey : config.tilesetKey ?? "bg_tiles1",
                    tmap: new Uint8Array( [1, 1, tile_border_bl ] ),
                    x: config.x, y: config.y+config.h-1, 
                },
                // BORDER: CORNER: BOTTOM-RIGHT
                corner_br   : { 
                    layerObjKey: `${config.layerObjKey}_BR`, 
                    layerKey   : config.layerKey   ?? "L4", 
                    tilesetKey : config.tilesetKey ?? "bg_tiles1",
                    tmap: new Uint8Array( [1, 1, tile_border_br ] ),
                    x: config.x+config.w-1, y: config.y+config.h-1, 
                },
                
                // BORDER: TOP
                top   : { 
                    layerObjKey: `${config.layerObjKey}_T`, 
                    layerKey   : config.layerKey   ?? "L4", 
                    tilesetKey : config.tilesetKey ?? "bg_tiles1",
                    tmap: new Uint8Array( [config.w-2, 1 ].concat(Array.from({ length: config.w-2 }, () => tile_border_horz)) ),
                    x: config.x+1, y: config.y, 
                },
                // BORDER: BOTTOM
                bottom: { 
                    layerObjKey: `${config.layerObjKey}_B`,
                    layerKey   : config.layerKey   ?? "L4", 
                    tilesetKey : config.tilesetKey ?? "bg_tiles1",
                    tmap: new Uint8Array([config.w-2, 1 ].concat(Array.from({ length: config.w-2 }, () => tile_border_horz)) ),
                    x: config.x+1, y: config.y + config.h-1, 
                },
                // BORDER: LEFT
                left  : { 
                    layerObjKey: `${config.layerObjKey}_L`,
                    layerKey   : config.layerKey   ?? "L4", 
                    tilesetKey : config.tilesetKey ?? "bg_tiles1",
                    tmap: new Uint8Array( [ 1, config.h-2 ].concat(Array.from({ length: config.h-2 }, () => tile_border_vert)) ),
                    x: config.x, y: config.y+1, 
                },
                // BORDER: RIGHT
                right : { 
                    layerObjKey: `${config.layerObjKey}_R`,
                    layerKey   : config.layerKey   ?? "L4", 
                    tilesetKey : config.tilesetKey ?? "bg_tiles1",
                    tmap: new Uint8Array( [ 1, config.h-2 ].concat(Array.from({ length: config.h-2 }, () => tile_border_vert)) ),
                    x: config.x+config.w-1, y: config.y+1, 
                },
            };

            // Draw the border.
            for(let key in tilemaps){
                _GFX.layerObjs.createOne(LayerObject, {
                    layerObjKey: tilemaps[key].layerObjKey, 
                    layerKey   : tilemaps[key].layerKey, 
                    tilesetKey : tilemaps[key].tilesetKey, 
                    tmap       : tilemaps[key].tmap,
                    x          : tilemaps[key].x, 
                    y          : tilemaps[key].y, 
                    xyByGrid: config.xyByGrid ?? false,
                    settings: config.settings,
                    removeHashOnRemoval: true, noResort: false,
                });
            }

            // Fill the border?
            if(config.fill){
                tilemaps["fill"] = { 
                    layerObjKey: `${config.layerObjKey}_fill`, 
                    layerKey   : config.layerKey ?? "L4", 
                    tilesetKey : config.tilesetKey ?? "bg_tiles1",
                    tmap: new Uint8Array(
                        // Dimensions.
                        [ config.w-2, config.h-2 ]
                        // Tiles
                        .concat(Array.from({ length: ((config.w-2) * (config.h-2)) }, () => config.fillTile))
                    ),
                    x:config.x+1, y:config.y+1,
                }

                // Draw the fill.
                _GFX.layerObjs.createOne(LayerObject, {
                    layerObjKey: tilemaps["fill"].layerObjKey, 
                    layerKey   : tilemaps["fill"].layerKey, 
                    tilesetKey : tilemaps["fill"].tilesetKey, 
                    tmap       : tilemaps["fill"].tmap, 
                    x          : tilemaps["fill"].x, 
                    y          : tilemaps["fill"].y, 
                    xyByGrid: true, settings: {},
                    removeHashOnRemoval: true, noResort: false,
                });
            }

            // Return the tilemap data.
            return tilemaps;
        },
    },

    generateMultipleTextLines: function(config){
        config.startX;
        
        let x = config.x;
        let y = config.y;
        let line;

        for(let i=0, len=config.lines.length; i<len; i+=1){
            line = config.lines[i];
            if(line.length){
                _GFX.layerObjs.createOne(PrintText, { 
                    text: line, 
                    x:x, y:y,
                    // layerObjKey_base: `${config.layerObjKey}`, 
                    layerObjKey: `${config.layerObjKey}_line_${i}`, 
                    layerKey  : config.layerKey   ?? "L4", 
                    tilesetKey: config.tilesetKey ?? "font_tiles1", 
                    xyByGrid: true, 
                });
            }
            y+=1;
        }
    },
};

// _GFX.layerObjs.createOne(PrintText, { 
//     text: "PROGRAMMING: ", 
//     x:2, y: 
//     y+=1,           
//     layerObjKey: `text1`, 
//     layerKey: "L4", 
//     xyByGrid: true, 
// });