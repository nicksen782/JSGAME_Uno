/*
// NOTES:
// Static methods and properties belong to the class and not to the instances of the class. 
// They cannot be used by an instance of the class.
// They can only be called by NameOfClass.property or NameOfClass.method.
// They are NOT inherited when the class is extended.

// A "setter" function such as set x(value){ this._x = value; } will set the value of _x.
// A "getter" function such as get x(){ return this._x; } will return the current value of _x.
// This is why the _x property is needed since a setter and getter would call themselves trying to access this.x.
// Setters and getters are invoked by access from anywhere. You have a setter/getter for x but the property internally is_x.

// CHANGE POSITION:
_GFX.layerObjs.getOne("N782_face_anim", "gs_N782").x = 8;
_GFX.layerObjs.getOne("N782_face_anim", "gs_N782").y += 8;

// CHANGE TILEMAP:
_GFX.layerObjs.getOne("board_28x28"   , "gs_JSG") .tmap = _GFX.tilesets.bg_tiles2.tilemaps.N782_TEXT1_F2;
_GFX.layerObjs.getOne("board_28x28"   , "gs_JSG") .tmap = _GFX.funcs.getTilemap("bg_tiles2", "N782_TEXT1_F2");

// CHANGE TILESET:
_GFX.layerObjs.getOne("N782_text_anim", "gs_N782").tilesetKey = "bg_tiles";
_GFX.layerObjs.getOne("board_28x28"   , "gs_JSG") .tilesetKey = "bg_tiles2";

// CHANGE SETTINGS:
_GFX.layerObjs.getOne("N782_oneStar_anim2_10", "gs_N782").setSetting("colorData", [ [ [ 255,182,  0,255], [ 255,72,36,255] ], ]);
_GFX.layerObjs.getOne("N782_text_anim"       , "gs_N782").setSetting("bgColorRgba", [128, 128, 0, 255]);
_GFX.layerObjs.getOne("N782_text_anim"       , "gs_N782").setSetting("rotation", 90);
_GFX.layerObjs.getOne("N782_text_anim"       , "gs_N782").setSetting("xFlip", true);
_GFX.layerObjs.getOne("N782_text_anim"       , "gs_N782").setSetting("yFlip", true);
_GFX.layerObjs.getOne("N782_text_anim"       , "gs_N782").setSetting("fade", 5);

// CHANGE LAYER:
_GFX.layerObjs.getOne("N782_oneStar_anim2_10", "gs_N782").layerKey = "BG1";
_GFX.layerObjs.getOne("N782_oneStar_anim2_10", "gs_N782").layerKey = "BG2";
_GFX.layerObjs.getOne("N782_oneStar_anim2_10", "gs_N782").layerKey = "TX1";
_GFX.layerObjs.getOne("N782_oneStar_anim2_10", "gs_N782").layerKey = "SP1";

// TESTING: (TODO: Layer changes leave the old copy on it's previous layer.)
_GFX.layerObjs.getOne("N782_oneStar_anim2_10", "gs_N782").setSetting("colorData", [ [ [ 255,182,  0,255], [ 255,72,36,255] ], ]);
_GFX.layerObjs.getOne("N782_oneStar_anim2_10", "gs_N782").layerKey = "BG1";
_GFX.layerObjs.getOne("board_28x28", "gs_JSG").layerKey = "BG2";
*/

// Creates one LayerObject.
class LayerObject {
    /* EXAMPLE USAGE:
    */

    // // Getters and setters:
    get x()          { return this._x; } 
    get y()          { return this._y; } 
    get tmap()       { return this._tmap; } 
    get layerKey()   { return this._layerKey; } 
    get tilesetKey() { return this._tilesetKey; } 
    get settings()   { return this._settings; } 
    get xyByGrid()   { return this._xyByGrid; } 
    
    set x(value)          { if( this._x          !== value){ this._x          = value; this._changed = true; } }
    set y(value)          { if( this._y          !== value){ this._y          = value; this._changed = true; } }
    set tmap(value)       { if( this._tmap       !== value){ this._tmap       = value; this._changed = true; } }
    set layerKey(value)   { if( this._layerKey   !== value){ 
        // Remove the existing layerObject from it's previous layer.
        // _GFX.layerObjs.getOne("N782_oneStar_anim2_10", "gs_N782").layerKey = "BG1";
        if(this._layerKey && this.layerObjKey && _GFX.currentData[this._layerKey].tilemaps[this.layerObjKey]){
            console.log(`REMOVING: layerKey: ${this._layerKey}, layerObjKey: ${this.layerObjKey}`);
            _GFX.funcs.removeLayerObj(this._layerKey, this.layerObjKey);
            // _GFX.currentData["BG2"].tilemaps["N782_oneStar_anim2_10"];
        }

        this._layerKey   = value; this._changed = true; 
    } }
    set tilesetKey(value) { if( this._tilesetKey !== value){ this._tilesetKey = value; this._changed = true; } }
    set settings(value)   { this._settings = value; this._changed = true; }
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

        // // TODO: Convert x and y.
        // if(this._xyByGrid){
        //     // Multiply x by tw.
        //     this._x *= this.tw;
            
        //     // Multiply y by th.
        //     this._y *= this.th;
        // }
        // else{
        //     // Divide x by tw and round it down to get the new grid x.
        //     this._x = ~~( this._x / this.tw) * this.tw;
            
        //     // Divide y by th and round it down to get the new grid y.
        //     this._y = ~~( this._y / this.th) * this.th; 
        // }
        
        this._xyByGrid = value; 
        this._changed = true; 
    }
    
    getSetting(key)       { return this._settings[key]; } 
    setSetting(key, value){ this._settings[key] = value; this._changed = true; }

    constructor(config){
        this.orgConfig  = config;

        // layerObjKey (MapKey), layerKey, and tilesetKey.
        this.layerObjKey = config.layerObjKey;
        this.layerKey    = config.layerKey;
        this.tilesetKey  = config.tilesetKey;

        // Tilemap. (It is possible that a tilemap is not provided/required.)
        this.tmap = config.tmap; // ?? new Uint8ClampedArray([1,1,0]);

        // X position.
        this.x = config.x ?? 0;
        
        // Y position.
        this.y = config.y ?? 0;

        // x,y positioning (grid or pixel based.)
        this.xyByGrid = config.xyByGrid ?? false;
        
        // Settings.
        this.settings = config.settings ?? _GFX.funcs.correctSettings(null);

        // Hidden.
        this.hidden = false; 

        // Change detection.
        this._changed = true;
    };
    
    // TODO: Redundant with removeLayerObject?
    // Remove the LayerObject from _GFX.currentData, set the hidden flag, return the orgConfig
    hideLayerObject(){
        console.log("NOT READY: hideLayerObject", this); return;

        // Remove from _GFX.currentData and return the original config. (Helpful when changing layers.)
        return this.removeLayerObject();
    }

    // Removes the LayerObject data from _GFX.currentData. (Causing the drawing to be removed.)
    // Unsets the hidden flag to enable the render functions for this LayerObject. (So that drawing will work.)
    unhideLayerObject(){
        console.log("NOT READY: unhideLayerObject", this); return;

        // Allow rendering by unsetting the hidden flag.
        this.hidden = false; 
        this._changed = true;

        // Render the LayerObject.
        // this.render();
    }
    
    // TODO: Redundant with hideLayerObject?
    removeLayerObject(){
        console.log("NOT READY: removeLayerObject", this); return;
        
        // NOTE: The object instance will need to be removed from where it was stored.
        
        // Remove the layer object from the cache.
        _GFX.funcs.removeLayerObj(this.layerKey, this.layerObjKey);
        
        // Prevent further rendering by settings the hidden flag.
        this.hidden = true; 
        this._changed = true;
        
        // Return the original config. (Helpful when changing layers.)
        return this.orgConfig;
    };

    // Render function.
    render(onlyReturnLayerObjData=false){
        // Do not render hidden LayerObjects.
        if(this.hidden){ return; }
        
        // Do not render unchanged LayerObjects.
        if(!this._changed){ return; }

        // Draw by grid or by pixel?
        let x = this.x; 
        let y = this.y;
        if(this.xyByGrid && this.tilesetKey){ 
            x = x * this.tw; 
            y = y * this.th;
        }

        //
        let layerObjectData = _GFX.funcs.createLayerObjData({ 
            mapKey  : this.layerObjKey, 
            x       : x, 
            y       : y, 
            ts      : this.tilesetKey, 
            settings: this.settings, 
            tmap    : this.tmap, 
        });

        //
        if(onlyReturnLayerObjData){ 
            layerObjectData[this.layerObjKey].layerKey = this.layerKey;
            this._changed = false;
            return layerObjectData[this.layerObjKey]; 
        }

        //
        _GFX.funcs.updateLayer(this.layerKey, 
            {
                ...layerObjectData,
            }
        );
        this._changed = false;
    };
}
class N782_face_anim extends LayerObject{
    constructor(config){
        super(config);
        this.tilesetKey = config.tilesetKey ?? "bg_tiles2";
        
        this.frames = [
            _GFX.funcs.getTilemap("bg_tiles2", "N782_FACE1_F1"),
            _GFX.funcs.getTilemap("bg_tiles2", "N782_FACE1_F2"),
            _GFX.funcs.getTilemap("bg_tiles2", "N782_FACE1_F3"),
            _GFX.funcs.getTilemap("bg_tiles2", "N782_FACE1_F4"),
            _GFX.funcs.getTilemap("bg_tiles2", "N782_FACE1_F5"),
            _GFX.funcs.getTilemap("bg_tiles2", "N782_FACE1_F1"),
        ];
        this.framesIndex = 0;
        this.framesCounter = 0;
        this.framesBeforeIndexChange = 6;
        this.repeatCount = 0;
        this.repeats = 4;
        this.done = false;
        this.tmap = this.frames[this.framesIndex];
        this.x = config.x ?? (( (28/2) - (7/2) )) * 8;
        this.y = config.y ?? ( 10 ) * 8;
    }

    // Render functions.
    nextFrame(){
        // Stop after repeating up to this.repeats.
        if(this.done){ return; }

        // Time to change frames?
        if(this.framesCounter < this.framesBeforeIndexChange){ 
            this.framesCounter += 1; 
        }
        else {
            // Reset the frames counter.
            this.framesCounter = 0;
            
            // Increment the framesIndex
            if(this.framesIndex < this.frames.length -1){ 
                this.framesIndex += 1; 
            }
            else { 
                // Reset the framesIndex.
                this.framesIndex = 0; 

                // Increment repeatCount.
                this.repeatCount += 1; 

                // Stop after repeating up to this.repeats.
                if(this.repeatCount == this.repeats) { 
                    this.tmap = _GFX.funcs.getTilemap("bg_tiles2", "N782_FACE1_F1");
                    this.done = true; 
                    return; 
                }
                else{
                }
            }
        }

        // Set the new tmap.
        this.tmap = this.frames[this.framesIndex];
    };
};
class N782_text_anim extends LayerObject{
    constructor(config){
        super(config);
        this.tilesetKey = config.tilesetKey ?? "bg_tiles2";

        this.frames = [
            // _GFX.funcs.getTilemap("bg_tiles2", "N782_TEXT1_F1"),
            _GFX.funcs.getTilemap("bg_tiles2", "N782_TEXT1_F2"),
            _GFX.funcs.getTilemap("bg_tiles2", "N782_TEXT1_F3"),
            _GFX.funcs.getTilemap("bg_tiles2", "N782_TEXT1_F4"),
            _GFX.funcs.getTilemap("bg_tiles2", "N782_TEXT1_F5"),
            _GFX.funcs.getTilemap("bg_tiles2", "N782_TEXT1_F6"),
            _GFX.funcs.getTilemap("bg_tiles2", "N782_TEXT1_F7"),
            _GFX.funcs.getTilemap("bg_tiles2", "N782_TEXT1_F8"),
        ];
        this.framesIndex = 0;
        this.framesCounter = 0;
        this.framesBeforeIndexChange = 3;
        this.repeatCount = 0;
        this.repeats = 5;
        this.done = false;
        this.tmap = this.frames[this.framesIndex];

        this.x = config.x ?? (( (28/2) - (7/2) )) * 8;
        this.y = config.y ?? ( 16 )*8;
    }

    // Render functions.
    nextFrame(){
        // Stop after repeating up to this.repeats.
        if(this.done){ return; }

        // Time to change frames?
        if(this.framesCounter < this.framesBeforeIndexChange){ 
            this.framesCounter += 1; 
        }
        else {
            // Reset the frames counter.
            this.framesCounter = 0;
            
            // Increment the framesIndex
            if(this.framesIndex < this.frames.length -1){ 
                this.framesIndex += 1; 
            }
            else { 
                // Reset the framesIndex.
                this.framesIndex = 0; 

                // Increment repeatCount.
                this.repeatCount += 1; 

                // Stop after repeating up to this.repeats.
                if(this.repeatCount == this.repeats) { 
                    this.tmap = _GFX.funcs.getTilemap("bg_tiles2", "N782_TEXT1_F1");
                    this.done = true; 
                    return; 
                }
                else{
                }

            }
        }

        // Set the new tmap.
        this.tmap = this.frames[this.framesIndex];
    };
};

class N782_oneStar_anim extends LayerObject{
    constructor(config){
        super(config);
        this.tilesetKey = config.tilesetKey ?? "bg_tiles2";

        this.frames = [
            _GFX.funcs.getTilemap("bg_tiles2", "N782_STAR"),
        ];
        this.framesIndex = 0;
        this.framesCounter = 0;
        this.framesBeforeIndexChange = 5;
        this.repeatCount = 0;
        this.repeats = 0;
        this.done = false;
        this.tmap = this.frames[this.framesIndex];

        this.x_min = 8*8;
        this.x_max = (20*8)-8;
        this.x_inc = 4;
        this.xDir = 1;

        this.x = config.x ?? this.x_min;
        this.y = config.y ?? ( 13 )*8;
    }

    // Render functions.
    nextFrame(){
        // Stop after repeating up to this.repeats.
        if(this.done){ return; }

        // Time to change frames?
        if(this.framesCounter < this.framesBeforeIndexChange){ 
            this.framesCounter += 1; 
        }
        else {
            // Reset the frames counter.
            this.framesCounter = 0;
            
            // Increment the framesIndex
            if(this.framesIndex < this.frames.length -1){ 
                this.framesIndex += 1; 
            }
            else { 
                
                if     (this.xDir == -1 && this.x < this.x_min){ this.xDir *= -1; }
                else if(this.xDir ==  1 && this.x >= this.x_max){ this.xDir *= -1; }
                this.x += (this.x_inc * this.xDir);
                // console.log(`x: ${this.x}, xDir: ${this.xDir}, x_min: ${this.x_min}, x_max: ${this.x_max}`);

                // // Reset the framesIndex.
                // this.framesIndex = 0; 

                // // Increment repeatCount.
                // this.repeatCount += 1; 

                // // Stop after repeating up to this.repeats.
                // if(this.repeatCount == this.repeats && this.repeats != 0) { 
                //     this.tmap = _GFX.funcs.getTilemap("bg_tiles2", "N782_TEXT1_F1");
                //     this.done = true; 
                //     return; 
                // }
            }
        }

        // Set the new tmap.
        this.tmap = this.frames[this.framesIndex];
    };
};
class N782_oneStar_animNS extends N782_oneStar_anim{
    constructor(config){
        super(config);
        this.tilesetKey = config.tilesetKey ?? "bg_tiles2";

        this.frames = [
            _GFX.funcs.getTilemap("bg_tiles2", "N782_TEXT1_F2"),
            // _GFX.funcs.getTilemap("bg_tiles2", "N782_STAR"),
        ];
        this.framesIndex = 0;
        this.framesCounter = 0;
        this.framesBeforeIndexChange = 5;
        this.repeatCount = 0;
        this.repeats = 0;
        this.done = false;
        this.tmap = this.frames[this.framesIndex];

        this.x_min = -12*8+8;
        this.x_max = (35*8)-8;
        this.x_inc =16;
        this.xDir = -1;

        this.y_min = -8*8+8;
        this.y_max = (35*8)-8;
        this.y_inc = 8;
        this.yDir = 1;

        // this.x = config.x ?? ( 25 )*8;
        // this.y = config.y ?? ( 5 )*8;

        this.x =  ( 25 )*8;
        this.y =  ( 5 )*8;

        this.settings.colorData = [ [ [ 36, 72,255,255], [ 255,72,36,255] ] ];
    }

    // Render functions.
    nextFrame(){
        // Stop after repeating up to this.repeats.
        if(this.done){ return; }

        // Time to change frames?
        if(this.framesCounter < this.framesBeforeIndexChange){ 
            this.framesCounter += 1; 
        }
        else {
            // Reset the frames counter.
            this.framesCounter = 0;
            
            // Increment the framesIndex
            if(this.framesIndex < this.frames.length -1){ 
                this.framesIndex += 1; 
            }
            else { 
                
                if     (this.xDir == -1 && this.x < this.x_min){ this.xDir *= -1; }
                else if(this.xDir ==  1 && this.x >= this.x_max){ this.xDir *= -1; }

                if     (this.yDir == -1 && this.y < this.y_min){ this.yDir *= -1; }
                else if(this.yDir ==  1 && this.y >= this.y_max){ this.yDir *= -1; }
                this.x += (this.x_inc * this.xDir);
                this.y += (this.y_inc * this.yDir);
                // console.log(`x: ${this.x}, xDir: ${this.xDir}, x_min: ${this.x_min}, x_max: ${this.x_max}`);

                // // Reset the framesIndex.
                // this.framesIndex = 0; 

                // // Increment repeatCount.
                // this.repeatCount += 1; 

                // // Stop after repeating up to this.repeats.
                // if(this.repeatCount == this.repeats && this.repeats != 0) { 
                //     this.tmap = _GFX.funcs.getTilemap("bg_tiles2", "N782_TEXT1_F1");
                //     this.done = true; 
                //     return; 
                // }
            }
        }

        // Set the new tmap.
        this.tmap = this.frames[this.framesIndex];
    };
};

class N782_oneStar_anim2 extends N782_oneStar_anim{
    constructor(config){
        super(config);

        this.frames = [
            _GFX.funcs.getTilemap("bg_tiles2", "N782_TEXT"),
        ];
        // console.log(this.frames[0], this.frames[0][0]);
        this.done = false;
        this.x_min = 0*8    ;//+ (this.frames[0][0]*8);
        this.x_max = (28*8) - (this.frames[0][0]*8);
        this.x_inc = 6;
        this.xDir = 1;
        this.x = config.x ?? this.x_min;
        this.tmap = this.frames[0];

        // this.frames[0]
    }
}
class N782_oneStar_anim3 extends N782_oneStar_anim2{
    constructor(config){
        super(config);

        this.frames = [
            _GFX.funcs.getTilemap("bg_tiles2", "N782_TEXT"),
        ];
        this.done = false;
        this.settings.rotation = 90;
        this.xDir = -1;
        this.x = config.x ?? this.x_max;
        this.tmap = this.frames[0];
    }
}

class Card extends LayerObject{
    // Set named colors.
    static colors = {
        cardOrange: [182, 72,  0,255], // tile_orange_color
        cardYellow: [255,182, 85,255], // tile_yellow_color
        cardBlue  : [ 72,109,170,255], // tile_blue_color
        cardRed   : [218,  0,  0,255], // tile_red_color
        cardGreen : [  0,145,  0,255], // tile_green_color
    };

    constructor(config){
        super(config);

        this.orgConfig  = config;
        this.card = config.card ?? { size: "small", value: "CARD_0", color: "CARD_YELLOW" };

        // What type of card is this?
        if(config.card.size=="small"){ 
            // Wild cards.
            if(config.card.color=="CARD_BLACK"){
                // Set the card tilemap. 

                // WILD
                if      (config.card.value=="CARD_WILD"){
                    this.tmap = _GFX.funcs.getTilemap("bg_tiles", "card_wild_front_sm");
                }

                // WILD Draw 4
                else if (config.card.value=="CARD_WILD_DRAW4"){
                    this.tmap = _GFX.funcs.getTilemap("bg_tiles", "card_wild_d4front_sm");
                }
            }
            // Back of cards.
            else if(config.card.color=="CARD_BACK"){
                this.tmap = _GFX.funcs.getTilemap("bg_tiles", "card_back_sm_0deg");
            }
            else{
                // Set the card tilemap. 
                this.tmap = _GFX.funcs.getTilemap("bg_tiles", "card_front_orange_sm");

                // Handle the changing of the card color.
                if     (config.card.color=="CARD_YELLOW"){
                    this.settings.colorData = [ [ Card.colors.cardOrange, Card.colors.cardYellow ] ];
                }
                else if(config.card.color=="CARD_BLUE"){
                    this.settings.colorData = [ [ Card.colors.cardOrange, Card.colors.cardBlue ] ];
                }
                else if(config.card.color=="CARD_RED"){
                    this.settings.colorData = [ [ Card.colors.cardOrange, Card.colors.cardRed] ];
                }
                else if(config.card.color=="CARD_GREEN"){
                    this.settings.colorData = [ [ Card.colors.cardOrange, Card.colors.cardGreen] ];
                }

                // Determine what the corner tiles (uppper-left, lower-right) tiles will need to be.
                let tmpMap1;
                let tmpMap2;
                
                if     (config.card.value == "CARD_0"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_0b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_0b_180"); }
                else if(config.card.value == "CARD_1"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_1b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_1b_180"); }
                else if(config.card.value == "CARD_2"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_2b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_2b_180"); }
                else if(config.card.value == "CARD_3"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_3b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_3b_180"); }
                else if(config.card.value == "CARD_4"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_4b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_4b_180"); }
                else if(config.card.value == "CARD_5"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_5b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_5b_180"); }
                else if(config.card.value == "CARD_6"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_6b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_6b_180"); }
                else if(config.card.value == "CARD_7"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_7b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_7b_180"); }
                else if(config.card.value == "CARD_8"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_8b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_8b_180"); }
                else if(config.card.value == "CARD_9"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_9b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_9b_180"); }
                else if(config.card.value == "CARD_DRAW2"){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_smDraw2b");  tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_smDraw2b_180"); }
                else if(config.card.value == "CARD_SKIP" ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_smSkipb");   tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_smSkipb_180"); }
                else if(config.card.value == "CARD_REV"  ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_smReverse"); tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_smReverse_180"); }
                else{
                    throw `ERROR: Bad config.card.value: ${config.card.value}`;
                }

                // Replace the corner tiles. 
                this.tmap[2] = tmpMap1[2];
                this.tmap[this.tmap.length-1] = tmpMap2[2];
            }
        }
        // TODO: INCOMPLETE
        else if(config.card.size=="large"){ 
            
            // What type of card is this?
            if(config.card.color=="CARD_BLACK"){
                // Set the card tilemap. 

                // WILD
                if      (config.card.value=="CARD_WILD"){
                    this.tmap = _GFX.funcs.getTilemap("bg_tiles", "card_wild_front_lg");
                }

                // WILD Draw 4
                else if (config.card.value=="CARD_WILD_DRAW4"){
                    this.tmap = _GFX.funcs.getTilemap("bg_tiles", "card_wild_draw4_front_lg");
                }
            }
            // Back of cards.
            else if(config.card.color=="CARD_BACK"){
                this.tmap = _GFX.funcs.getTilemap("bg_tiles", "card_back_lg"); 
            }
            else{
                // Set the card tilemap. 
                this.tmap = _GFX.funcs.getTilemap("bg_tiles", "card_front_orange_lg");

                // Handle the changing of the card color.
                if     (config.card.color=="CARD_YELLOW"){
                    this.settings.colorData = [ [ Card.colors.cardOrange, Card.colors.cardYellow ] ];
                }
                else if(config.card.color=="CARD_BLUE"){
                    this.settings.colorData = [ [ Card.colors.cardOrange, Card.colors.cardBlue ] ];
                }
                else if(config.card.color=="CARD_RED"){
                    this.settings.colorData = [ [ Card.colors.cardOrange, Card.colors.cardRed] ];
                }
                else if(config.card.color=="CARD_GREEN"){
                    this.settings.colorData = [ [ Card.colors.cardOrange, Card.colors.cardGreen] ];
                }

                // Determine what the corner tiles (uppper-left, lower-right) tiles will need to be.
                let tmpMap1;
                let tmpMap2;
                
                if     (config.card.value == "CARD_0"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_0b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_0b_180"); }
                else if(config.card.value == "CARD_1"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_1b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_1b_180"); }
                else if(config.card.value == "CARD_2"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_2b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_2b_180"); }
                else if(config.card.value == "CARD_3"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_3b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_3b_180"); }
                else if(config.card.value == "CARD_4"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_4b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_4b_180"); }
                else if(config.card.value == "CARD_5"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_5b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_5b_180"); }
                else if(config.card.value == "CARD_6"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_6b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_6b_180"); }
                else if(config.card.value == "CARD_7"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_7b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_7b_180"); }
                else if(config.card.value == "CARD_8"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_8b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_8b_180"); }
                else if(config.card.value == "CARD_9"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_9b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_9b_180"); }
                else if(config.card.value == "CARD_DRAW2"){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_smDraw2b");  tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_smDraw2b_180"); }
                else if(config.card.value == "CARD_SKIP" ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_smSkipb");   tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_smSkipb_180"); }
                else if(config.card.value == "CARD_REV"  ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_smReverse"); tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_smReverse_180"); }
                else{
                    throw `ERROR: Bad config.card.value: ${config.card.value}`;
                }

                // Replace the corner tiles. 
                this.tmap[2] = tmpMap1[2];
                this.tmap[this.tmap.length-1] = tmpMap2[2];
            }
        }
    };
};
class GameBoard extends LayerObject{
    constructor(config){
        super(config);
        this.tilesetKey = config.tilesetKey ?? "bg_tiles";
        this.tmap = _GFX.funcs.getTilemap("bg_tiles", "board_28x28");
        this.x = config.x ?? 0;
        this.y = config.y ?? 0;
    }

};
class Cursor extends LayerObject{
    constructor(config){
        super(config);
    }
};

