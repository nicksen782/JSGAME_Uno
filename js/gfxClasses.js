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
_GFX.layerObjs.getOne("N782_oneStar_anim2_10", "gs_N782").layerKey = "L1";
_GFX.layerObjs.getOne("N782_oneStar_anim2_10", "gs_N782").layerKey = "L2";
_GFX.layerObjs.getOne("N782_oneStar_anim2_10", "gs_N782").layerKey = "L4";
_GFX.layerObjs.getOne("N782_oneStar_anim2_10", "gs_N782").layerKey = "L3";

// TESTING: (TODO: Layer changes leave the old copy on it's previous layer.)
_GFX.layerObjs.getOne("N782_oneStar_anim2_10", "gs_N782").setSetting("colorData", [ [ [ 255,182,  0,255], [ 255,72,36,255] ], ]);
_GFX.layerObjs.getOne("N782_oneStar_anim2_10", "gs_N782").layerKey = "L1";
_GFX.layerObjs.getOne("board_28x28", "gs_JSG").layerKey = "L2";
*/

class UnoLetter extends LayerObject{
    // Set named colors.
    static colors = {
        base   : [255, 182, 85 , 255], // Yellow
        blue   : [36 , 72 , 170, 255], // 
        red    : [218, 0  , 0  , 255], // 
        green  : [0  , 145, 0  , 255], // 
        black  : [0  , 0  , 0  , 255], // 
    };
    static colorFrames = [
        [ [ UnoLetter.colors.base, UnoLetter.colors.black ] ],
        [ [ UnoLetter.colors.base, UnoLetter.colors.red   ] ],
        [ [ UnoLetter.colors.base, UnoLetter.colors.blue  ] ],
        [], // Yellow
        [ [ UnoLetter.colors.base, UnoLetter.colors.green ] ],
    ];

    constructor(config){
        super(config);
        
        if     (config.letter == "u") { this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "letter_uno_u"); }
        else if(config.letter == "n") { this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "letter_uno_n"); }
        else if(config.letter == "o") { this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "letter_uno_o"); }
        else if(config.letter == "u2"){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "letter_uno2_u"); }
        else if(config.letter == "n2"){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "letter_uno2_n"); }
        else if(config.letter == "o2"){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "letter_uno2_o"); }
        else{ console.log("Unmatched letter!"); throw "Unmatched letter"; }
        
        this.tilesetKey = "bg_tiles1";
        this.framesIndex = config.framesIndex ?? 0;
        this.framesCounter = 0;
        this.framesBeforeIndexChange = config.framesBeforeIndexChange ?? 15;
        this.repeatCount = 0;
        this.repeats = 0;
        this.done = false;
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
            if(this.framesIndex < UnoLetter.colorFrames.length -1){ 
                this.framesIndex += 1; 
            }
            else { 
                // Reset the framesIndex.
                this.framesIndex = 0; 

                // Increment repeatCount.
                this.repeatCount += 1; 

                // Stop after repeating up to this.repeats.
                if(this.repeatCount == this.repeats) { 
                    // if(!UnoLetter.colorFrames[this.framesIndex]){ this.settings.colorData = []; }
                    // else                                        { this.settings.colorData =  UnoLetter.colorFrames[this.framesIndex]; }
                    this.settings.colorData = UnoLetter.colorFrames[0];
                    this.done = true; 
                    this._changed = true; 
                    return; 
                }
                else{
                }

            }
        }

        // Set the new colorData.
        this.settings.colorData = UnoLetter.colorFrames[this.framesIndex] ;
        this._changed = true; 
    };
}

//
class Cursor1 extends LayerObject{
    // Set named colors.
    static colors = {
        inner  : [255, 255, 255, 255], // 
        white  : [255, 255, 255, 255], // 
        black  : [0  , 0  , 0  , 255], // 
        red    : [218, 0  , 0  , 255], // 
        yellow : [255, 182, 85 , 255], // 
        blue   : [36 , 72 , 170, 255], // 
        green  : [0  , 145, 0  , 255], // 
    };

    constructor(config){
        super(config);
        this.tilesetKey = "sprite_tiles1";

        this.frames = [
            _GFX.funcs.getTilemap("sprite_tiles1", "cursor1_f1"),
            _GFX.funcs.getTilemap("sprite_tiles1", "cursor1_f2"),
        ];

        // DEBUG
        // let tileId1 = this.frames[0][2];
        // let tileId2 = this.frames[1][2];
        // this.frames[0] = [ 3, 1, tileId1, tileId1, tileId1, tileId1 ];
        // this.frames[1] = [ 3, 1, tileId2, tileId2, tileId2, tileId2 ];

        this.framesIndex = 0;
        this.framesCounter = 0;
        this.framesBeforeIndexChange = 15;
        // this.framesBeforeIndexChange = 60;
        this.repeatCount = 0;
        this.repeats = 0;

        this.tmap = this.frames[this.framesIndex];
        this.done = false;
    };

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
                    this.tmap = _GFX.funcs.getTilemap("sprite_tiles1", "cursor1_f1");
                    this.done = true; 
                    this._changed = true; 
                    return; 
                }
                else{
                }

            }
        }

        // Set the new colorData.
        this.tmap = this.frames[this.framesIndex];
        this._changed = true; 
    };
};

//
class Card extends LayerObject{
    // Set named colors.
    static colors = {
        base   : [218, 0  , 0  , 255], // All non-wild cards are initially red.
        red    : [218, 0  , 0  , 255], // 
        yellow : [255, 182, 85 , 255], // 
        blue   : [36 , 72 , 170, 255], // 
        green  : [0  , 145, 0  , 255], // 
    };

    // { size: "sm", color:"black", value: "back" }
    constructor(config){
        super(config);
        this.tilesetKey = "bg_tiles1";

        if(config.size=="sm"){
            // Get the tilemap for black cards.
            if(config.color == "CARD_BLACK"){
                if     (config.value == "CARD_WILD")      { this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_sm_wild");}
                else if(config.value == "CARD_WILD_DRAW4"){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_sm_wildDraw4");}
                else if(config.value == "CARD_BACK")      { this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_sm_back");}
                else{ throw `Invalid sm card value: ${config.value}`; }
            }
            else{
                // Change the color.
                if     (config.color == "CARD_YELLOW"){ this.settings.colorData = [[Card.colors.base, Card.colors.yellow ]]; }
                else if(config.color == "CARD_BLUE")  { this.settings.colorData = [[Card.colors.base, Card.colors.blue   ]]; }
                else if(config.color == "CARD_RED")   { this.settings.colorData = []; }
                else if(config.color == "CARD_GREEN") { this.settings.colorData = [[Card.colors.base, Card.colors.green  ]]; }
                else{ throw `Invalid sm card color: ${config.color}`; }
    
                // Set the card tilemap.
                if     (config.value == "CARD_0"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_sm_0");       }
                else if(config.value == "CARD_1"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_sm_1");       }
                else if(config.value == "CARD_2"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_sm_2");       }
                else if(config.value == "CARD_3"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_sm_3");       }
                else if(config.value == "CARD_4"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_sm_4");       }
                else if(config.value == "CARD_5"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_sm_5");       }
                else if(config.value == "CARD_6"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_sm_6");       }
                else if(config.value == "CARD_7"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_sm_7");       }
                else if(config.value == "CARD_8"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_sm_8");       }
                else if(config.value == "CARD_9"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_sm_9");       }
                else if(config.value == "CARD_DRAW2"){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_sm_draw2");   }
                else if(config.value == "CARD_SKIP" ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_sm_skip");    }
                else if(config.value == "CARD_REV"  ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_sm_reverse"); }
                else{ throw `Invalid sm card value: ${config.value}`; }
            }
        }
        else if(config.size=="lg"){
            // Get the tilemap for black cards.
            if(config.color == "CARD_BLACK"){
                if     (config.value == "CARD_WILD")      { this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_lg_wild");}
                else if(config.value == "CARD_WILD_DRAW4"){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_lg_wildDraw4");}
                else if(config.value == "CARD_BACK")      { this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_lg_back");}
                else{ throw `Invalid lg card value: ${config.value}`; }
            }
            else{
                // Change the color.
                if     (config.color == "CARD_YELLOW"){ this.settings.colorData = [[Card.colors.base, Card.colors.yellow ]]; }
                else if(config.color == "CARD_BLUE")  { this.settings.colorData = [[Card.colors.base, Card.colors.blue   ]]; }
                else if(config.color == "CARD_RED")   { this.settings.colorData = []; }
                else if(config.color == "CARD_GREEN") { this.settings.colorData = [[Card.colors.base, Card.colors.green  ]]; }
                else{ throw `Invalid lg card color: ${config.color}`; }

                // Set the card tilemap.
                if     (config.value == "CARD_0"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_lg_0");       }
                else if(config.value == "CARD_1"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_lg_1");       }
                else if(config.value == "CARD_2"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_lg_2");       }
                else if(config.value == "CARD_3"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_lg_3");       }
                else if(config.value == "CARD_4"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_lg_4");       }
                else if(config.value == "CARD_5"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_lg_5");       }
                else if(config.value == "CARD_6"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_lg_6");       }
                else if(config.value == "CARD_7"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_lg_7");       }
                else if(config.value == "CARD_8"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_lg_8");       }
                else if(config.value == "CARD_9"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_lg_9");       }
                else if(config.value == "CARD_DRAW2"){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_lg_draw2");   }
                else if(config.value == "CARD_SKIP" ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_lg_skip");    }
                else if(config.value == "CARD_REV"  ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_lg_reverse"); }
                else{ throw `Invalid lg card value: ${config.value}`; }
            }
        }
        else{ throw `Invalid card size: ${config.size}`; }
    };
};
class OLDCard extends LayerObject{
    // Set named colors.
    static colors = {
        base   : [218, 0  , 0  , 255], // All non-wild cards are initially red.
        red    : [218, 0  , 0  , 255], // 
        yellow : [255, 182, 85 , 255], // 
        blue   : [36 , 72 , 170, 255], // 
        green  : [0  , 145, 0  , 255], // 
    };

    // { size: "sm", color:"black", value: "back" }
    constructor(config){
        super(config);
        this.tilesetKey = "bg_tiles1";

        if(config.size=="sm"){
            // Get the tilemap for black cards.
            if(config.color == "CARD_BLACK"){
                if     (config.value == "CARD_WILD")  { this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_sm_wild");}
                else if(config.value == "CARD_WILD_DRAW4"){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_sm_wildDraw4");}
                else if(config.value == "CARD_BACK")  { this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_sm_back");}
                else{ throw `Invalid sm card value: ${config.value}`; }
            }
            else{
                // Change the color.
                if     (config.color == "CARD_YELLOW"){ this.settings.colorData = [[Card.colors.base, Card.colors.yellow ]]; }
                else if(config.color == "CARD_BLUE")  { this.settings.colorData = [[Card.colors.base, Card.colors.blue   ]]; }
                // else if(config.color == "CARD_RED")   { this.settings.colorData = [[Card.colors.base, Card.colors.red    ]]; }
                else if(config.color == "CARD_RED")   { this.settings.colorData = []; }
                else if(config.color == "CARD_GREEN") { this.settings.colorData = [[Card.colors.base, Card.colors.green  ]]; }
                else{ throw `Invalid sm card color: ${config.color}`; }
    
                // Set the card tilemap.
                if     (config.value == "CARD_0"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_sm_0");       }
                else if(config.value == "CARD_1"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_sm_1");       }
                else if(config.value == "CARD_2"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_sm_2");       }
                else if(config.value == "CARD_3"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_sm_3");       }
                else if(config.value == "CARD_4"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_sm_4");       }
                else if(config.value == "CARD_5"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_sm_5");       }
                else if(config.value == "CARD_6"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_sm_6");       }
                else if(config.value == "CARD_7"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_sm_7");       }
                else if(config.value == "CARD_8"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_sm_8");       }
                else if(config.value == "CARD_9"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_sm_9");       }
                else if(config.value == "CARD_DRAW2"){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_sm_draw2");   }
                else if(config.value == "CARD_SKIP" ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_sm_skip");    }
                else if(config.value == "CARD_REV"  ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_sm_reverse"); }
                else{ throw `Invalid sm card value: ${config.value}`; }
            }
        }
        else if(config.size=="lg"){
            // Get the tilemap for black cards.
            if(config.color == "CARD_BLACK"){
                if     (config.value == "CARD_WILD")  { this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_lg_wild");}
                else if(config.value == "CARD_WILD_DRAW4"){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_lg_wildDraw4");}
                else if(config.value == "CARD_BACK")  { this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_lg_back");}
                else{ throw `Invalid lg card value: ${config.value}`; }
            }
            else{
                // Change the color.
                if     (config.color == "CARD_YELLOW"){ this.settings.colorData = [[Card.colors.base, Card.colors.yellow ]]; }
                else if(config.color == "CARD_BLUE")  { this.settings.colorData = [[Card.colors.base, Card.colors.blue   ]]; }
                // else if(config.color == "CARD_RED")   { this.settings.colorData = [[Card.colors.base, Card.colors.red    ]]; }
                else if(config.color == "CARD_RED")   { this.settings.colorData = []; }
                else if(config.color == "CARD_GREEN") { this.settings.colorData = [[Card.colors.base, Card.colors.green  ]]; }
                else{ throw `Invalid lg card color: ${config.color}`; }

                // Set the card tilemap.
                if     (config.value == "CARD_0"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_lg_0");       }
                else if(config.value == "CARD_1"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_lg_1");       }
                else if(config.value == "CARD_2"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_lg_2");       }
                else if(config.value == "CARD_3"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_lg_3");       }
                else if(config.value == "CARD_4"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_lg_4");       }
                else if(config.value == "CARD_5"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_lg_5");       }
                else if(config.value == "CARD_6"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_lg_6");       }
                else if(config.value == "CARD_7"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_lg_7");       }
                else if(config.value == "CARD_8"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_lg_8");       }
                else if(config.value == "CARD_9"    ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_lg_9");       }
                else if(config.value == "CARD_DRAW2"){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_lg_draw2");   }
                else if(config.value == "CARD_SKIP" ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_lg_skip");    }
                else if(config.value == "CARD_REV"  ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "card_lg_reverse"); }
                else{ throw `Invalid lg card value: ${config.value}`; }
            }
        }
        else{ throw `Invalid card size: ${config.size}`; }
    };
};





class OLD_N782_face_anim extends LayerObject{
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
class OLD_N782_text_anim extends LayerObject{
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

class OLD_N782_oneStar_anim extends LayerObject{
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
class OLD_N782_oneStar_animNS extends OLD_N782_oneStar_anim{
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

class OLD_N782_oneStar_anim2 extends OLD_N782_oneStar_anim{
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
class OLD_N782_oneStar_anim3 extends OLD_N782_oneStar_anim2{
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

class OLD_Card extends LayerObject{
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
class OLD_GameBoard extends LayerObject{
    constructor(config){
        super(config);
        this.tilesetKey = config.tilesetKey ?? "bg_tiles";
        this.tmap = _GFX.funcs.getTilemap("bg_tiles", "board_28x28");
        this.x = config.x ?? 0;
        this.y = config.y ?? 0;
    }

};

