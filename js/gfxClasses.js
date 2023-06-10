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
        this.className = this.constructor.name;
        
        if     (config.letter == "u") { this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "letter_uno_u"); }
        else if(config.letter == "n") { this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "letter_uno_n"); }
        else if(config.letter == "o") { this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "letter_uno_o"); }
        else if(config.letter == "u2"){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "letter_uno2_u"); }
        else if(config.letter == "n2"){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "letter_uno2_n"); }
        else if(config.letter == "o2"){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", "letter_uno2_o"); }
        else{ console.log("Unmatched letter!"); throw "Unmatched letter"; }
        
        this.tilesetKey = "bg_tiles1";
        this.framesIndex = config.framesIndex ?? 0;
        if(this.framesIndex >= UnoLetter.colorFrames.length){ this.framesIndex = 0; }
        this.framesCounter = 0;
        this.framesBeforeIndexChange = config.framesBeforeIndexChange ?? 15;
        this.repeatCount = 0;
        this.repeats = 0;
        this.done = false;
        this._changed = true;
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
        config.tilesetKey = "sprite_tiles1";
        super(config);
        this.className = this.constructor.name;

        this.tilesetKey = "sprite_tiles1";

        this.frames = [
            _GFX.funcs.getTilemap("sprite_tiles1", "cursor1_f1"),
            _GFX.funcs.getTilemap("sprite_tiles1", "cursor1_f2"),
            // _GFX.funcs.getTilemap("sprite_tiles1", "cursor2_f1"),
            // _GFX.funcs.getTilemap("sprite_tiles1", "cursor2_f2"),
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
        
        this._changed = true;
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
                    // this.tmap = _GFX.funcs.getTilemap("sprite_tiles1", "cursor1_f1");
                    this.tmap = this.frames[0];
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
    /* NOTES
        If you want to change the card from a black card (wilds, back) you cannot change to a non-black card by just changing one setting.  
          You'll need two changes. 
        This is not a problem with non-black cards. You can change the color or the value at any time. 
          If the new value is a black card then the color will be handled automatically.
        If you want to change the card in one operation then use change_wholeCard.
    */

    // Getters and setters.
    get value(){ return this._value; } 
    get color(){ return this._color; } 
    get size() { return this._size; } 
    set size (newValue){ if( this._size  !== newValue){ this._size  = newValue; this._change_size(this._size);   this._changed = true; } }
    set value(newValue){ if( this._value !== newValue){ this._value = newValue; this._change_value(this._value); this._changed = true; } }
    set color(newValue){ if( this._color !== newValue){ this._color = newValue; this._change_color(this._color); this._changed = true; } }

    // Set named colors.
    static colors = {
        base   : [218, 0  , 0  , 255], // All non-wild cards are initially red.
        yellow : [255, 182, 85 , 255], // 
        blue   : [36 , 72 , 170, 255], // 
        green  : [0  , 145, 0  , 255], // 
        // red    : [218, 0  , 0  , 255], // Same as the base.
        // black  : [0  , 0  , 0  , 255], // 
    };

    // Set named destination color replacements. 
    static colorReplacements = {
        "YELLOW": [[Card.colors.base, Card.colors.yellow ]],
        "BLUE"  : [[Card.colors.base, Card.colors.blue   ]],
        "GREEN" : [[Card.colors.base, Card.colors.green  ]],
        "RED"   : [],
        "BLACK" : [],
    };

    // Changes the displayed value of the card.
    _change_value(value){
        // Make sure that the size is valid.
        if( !(this.size ==  "sm" || this.size == "lg")) { 
            console.error(`Invalid card size: ${this.size}`, this); 
            throw `Invalid card size: ${this.size}`; 
        }

        // Set the card tilemap.
        if     (value == "CARD_0"         ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", `card_${this.size}_0`);         }
        else if(value == "CARD_1"         ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", `card_${this.size}_1`);         }
        else if(value == "CARD_2"         ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", `card_${this.size}_2`);         }
        else if(value == "CARD_3"         ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", `card_${this.size}_3`);         }
        else if(value == "CARD_4"         ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", `card_${this.size}_4`);         }
        else if(value == "CARD_5"         ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", `card_${this.size}_5`);         }
        else if(value == "CARD_6"         ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", `card_${this.size}_6`);         }
        else if(value == "CARD_7"         ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", `card_${this.size}_7`);         }
        else if(value == "CARD_8"         ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", `card_${this.size}_8`);         }
        else if(value == "CARD_9"         ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", `card_${this.size}_9`);         }
        else if(value == "CARD_DRAW2"     ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", `card_${this.size}_draw2`);     }
        else if(value == "CARD_SKIP"      ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", `card_${this.size}_skip`);      }
        else if(value == "CARD_REV"       ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", `card_${this.size}_reverse`);   }
        else if(value == "CARD_WILD"      ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", `card_${this.size}_wild`);      }
        else if(value == "CARD_WILD_DRAW4"){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", `card_${this.size}_wildDraw4`); }
        else if(value == "CARD_BACK"      ){ this.tmap = _GFX.funcs.getTilemap("bg_tiles1", `card_${this.size}_back`);      }
        else{ 
            console.error(`Invalid card value: ${value}`, this); 
            throw `Invalid card value: ${value}`; 
        }

        // These cards must always have their color set to "CARD_BLACK".
        if( (value == "CARD_WILD" || value == "CARD_WILD_DRAW4" || value == "CARD_BACK") ){ this.color = "CARD_BLACK"; }
        
        // The other cards must never have their color set to "CARD_BLACK".
        else if(this._color == "CARD_BLACK"){ this.color = "CARD_RED"; }
    };

    // Changes the displayed color of the card.
    _change_color(color){
        // These cards must always have their color set to "CARD_BLACK".
        if( (this.value == "CARD_WILD" || this.value == "CARD_WILD_DRAW4" || this.value == "CARD_BACK") ){ color = "CARD_BLACK"; this._color = color; }
        
        // The other cards must never have their color set to "CARD_BLACK".
        else if(color == "CARD_BLACK"){ color = "CARD_RED";  this._color = color; }
        
        if     (color == "CARD_YELLOW"){ this.settings.colorData = Card.colorReplacements.YELLOW; }
        else if(color == "CARD_BLUE"  ){ this.settings.colorData = Card.colorReplacements.BLUE;   }
        else if(color == "CARD_GREEN" ){ this.settings.colorData = Card.colorReplacements.GREEN;  }
        else if(color == "CARD_RED"   ){ this.settings.colorData = Card.colorReplacements.RED;    } // No color change (use the base color.)
        else if(color == "CARD_BLACK" ){ this.settings.colorData = Card.colorReplacements.BLACK;  } // No color change (use the base color.)
        else{ 
            console.error(`Invalid card color: ${color}`, this); 
            throw `Invalid card color: ${color}`; 
        }
    };

    // Changes the displayed size of the card and regenerates the value.
    _change_size(size){
        // Make sure that the size is valid.
        if( !(this.size ==  "sm" || this.size == "lg")) { 
            console.error(`Invalid card size: ${this.size}`, this); 
            throw `Invalid card size: ${this.size}`; 
        }
        this._size = size;

        // Set the card tilemap.
        this._change_value(this._value);
    };

    constructor(config){
        config.tilesetKey = "bg_tiles1";
        super(config);
        this.className = this.constructor.name;

        this._size  = config.size;
        this._value = config.value;
        this._color = config.color;

        // Set the card tilemap.
        this._change_value(config.value);

        // Change the color.
        this._change_color(config.color);
    };

    // Allows changes to each attribute of the card.
    change_wholeCard(size, color, value){
        // Example usages: 
        // this.change_wholeCard(null, "CARD_YELLOW", "CARD_1");          // Color changes to yellow.
        // this.change_wholeCard("lg", "CARD_BLUE"  , "CARD_2");          // Color changes to blue.
        // this.change_wholeCard("sm", "CARD_GREEN" , "CARD_DRAW2");      // Color changes to green.
        // this.change_wholeCard(null, "CARD_GREEN" , "CARD_WILD_DRAW4"); // Color forced to black.
        // this.change_wholeCard(null, null , "CARD_WILD_DRAW4");         // Color forced to black.

        // Save the values. (If any arguments were null then use the existing values.)
        this._size  = size  ?? this._size ;
        this._color = color ?? this._color;
        this._value = value ?? this._value;

        // Update the displayed size and value.
        this._change_size(this._size);

        // Update the displayed color.
        this._change_color(this._color);
    };

    // Card movements.
    fromPos = { x:0, y:0 };
    currPos = { x:0, y:0 };
    toPos   = { x:0, y:0 };
    movementDone = false;

    // Sets up a card movement from point A to point B.
    moveCardFromPosToPos(fromPos, toPos){
        this.movementDone = false;
        
        // Store the fromPos, currPos and toPos.
        this.fromPos = {...fromPos};
        this.currPos = {...fromPos};
        this.toPos   = {...toPos};
        
        // Move the card to the starting position.
        this.x = this.currPos.x;
        this.y = this.currPos.y;
    };

    // Sets up the "selected card" movement (uses: moveCardFromPosToPos.)
    moveCardToSelected(currPlayer){
        let from = { x:this.x, y:this.y };
        let dest = { x:this.x, y:this.y };
        if     (currPlayer == "P1"){ dest.y -= 2; } // Avoids covering the message box.
        else if(currPlayer == "P2"){ dest.x += 2; } // Avoids covering the message box.
        else if(currPlayer == "P3"){ dest.y += 2; } // Avoids covering the message box.
        else if(currPlayer == "P4"){ dest.x -= 2; } // Avoids covering the message box.

        this.moveCardFromPosToPos( from, dest );
    };

    // Sets up the "unselected card" movement (uses: moveCardFromPosToPos.)
    moveCardToUnselected(currPlayer){
        let from = { x:this.x, y:this.y };
        let dest = { x:this.x, y:this.y };
        if     (currPlayer == "P1"){ dest.y += 2; } 
        else if(currPlayer == "P2"){ dest.x -= 2; } 
        else if(currPlayer == "P3"){ dest.y -= 2; } 
        else if(currPlayer == "P4"){ dest.x += 2; } 

        this.moveCardFromPosToPos( from, dest );
    };
    moveCardToDiscard(){
        let discPos = Deck.discardPos;
        let from = { x:this.x, y:this.y };
        let dest = { x: discPos[0], y: discPos[1] };
        this.moveCardFromPosToPos( from, dest );
    };

    moveDrawCardToHome(playerKey, cardSlot){
        let cardPos = Deck.cardPos[playerKey][cardSlot];
        let drawPos = Deck.drawPos;
        let from = { x: drawPos[0], y: drawPos[1] };
        let dest = { x: cardPos[0], y: cardPos[1] };
        this.moveCardFromPosToPos( from, dest );
    };
    
    moveCardToHome(playerKey, cardSlot){
        let cardPos = Deck.cardPos[playerKey][cardSlot];
        let from = { x: this.x, y: this.y };
        let dest = { x: cardPos[0], y: cardPos[1] };
        this.moveCardFromPosToPos( from, dest );
    };

    roundToNearestMultiple(number, multiple) {
        var numOfDecimalPlaces = (multiple.toString().split('.')[1] || []).length;
        return parseFloat((Math.round(number / multiple) * multiple).toFixed(numOfDecimalPlaces));
    };

    nextFrame() {
        // CARD MOVEMENT
        if(!this.movementDone){
            // Move from currPos to toPos on x/y by changeVal.
            let changeVal = 0.25;
            let tolerance = 0.01; // Tolerance for considering as reached the position
    
            // Track which coords change.
            let changedX = false;
            let changedY = false;
        
            // Keep track of the previous position.
            let prevX = this.currPos.x;
            let prevY = this.currPos.y;
        
            // Move right: currPos.x moving towards toPos.x.
            if      (this.currPos.x < this.toPos.x - tolerance) { this.currPos.x += changeVal; changedX = true; }
            
            // Move left: currPos.x moving towards toPos.x. 
            else if (this.currPos.x > this.toPos.x + tolerance) { this.currPos.x -= changeVal; changedX = true; }
        
            // Move down: currPos.y moving towards toPos.y.
            if      (this.currPos.y < this.toPos.y - tolerance) { this.currPos.y += changeVal; changedY = true; }
            
            // Move up: currPos.y moving towards toPos.y.
            else if (this.currPos.y > this.toPos.y + tolerance) { this.currPos.y -= changeVal; changedY = true; }
        
            // Update the x/y position(s).
            if(changedX) { this.x = this.roundToNearestMultiple(this.currPos.x, changeVal); }
            if(changedY) { this.y = this.roundToNearestMultiple(this.currPos.y, changeVal); }
        
            // Is the movement done? Check if it's close to the target and moving away.
            if (
                // If "close enough" with tolerance.
                (
                    Math.abs(this.x - this.toPos.x) <= tolerance && 
                    Math.abs(this.y - this.toPos.y) <= tolerance
                ) 
                
                || 
    
                // If "close enough" and considering the rounding.
                (
                    (this.currPos.x - prevX) * (this.toPos.x - this.currPos.x) < 0 ||
                    (this.currPos.y - prevY) * (this.toPos.y - this.currPos.y) < 0
                )
            ) {
                // Set the x and y directly to toPos values.
                this.x = this.toPos.x;
                this.y = this.toPos.y;
        
                // Set the current position to the target position to ensure it's exactly reached.
                this.currPos.x = this.x;
                this.currPos.y = this.y;
        
                // Set the flag for the movement being completed.
                this.movementDone = true;
            }
        }

        // OTHER
        //
    };

};

class Border extends LayerObject{
    /*
    Has static methods for building borders.
    Borders are just a collection of LayerObjects for the corners, sides, and fills. 
    There is no border management otherwise. You cannot change a border through methods here.
    However, borders can still be changed through LayerObject methods if needed.
    This class is basically identical to LayerObject. but using it allows filtering in LayerObjects debug.
    */

    static createBorder(config){
        /* 
        Border.createBorder({
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
            _GFX.layerObjs.createOne(Border, {
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
            _GFX.layerObjs.createOne(Border, {
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
    };
    
    constructor(config){
        super(config);
        this.className = this.constructor.name;
    }
};

class Deck{
    /* 
    let deck = new Deck({
        activePlayers: ["P1","P2","P3"]
    });
    */

    static cardPoints = {
        "CARD_WILD"      : 50,
        "CARD_WILD_DRAW4": 50,
        "CARD_DRAW2"     : 20,
        "CARD_SKIP"      : 20,
        "CARD_REV"       : 20,
        "CARD_0": 0,
        "CARD_1": 1,
        "CARD_2": 2,
        "CARD_3": 3,
        "CARD_4": 4,
        "CARD_5": 5,
        "CARD_6": 6,
        "CARD_7": 7,
        "CARD_8": 8,
        "CARD_9": 9,
    };
    static cardPos = {
        P1: [ [7 ,24], [10,24], [13,24], [16,24], [19,24] ], // CARDS: p1_pos
        P2: [ [1 ,7 ], [1 ,10], [1 ,13], [1 ,16], [1 ,19] ], // CARDS: p2_pos
        P3: [ [7 ,1 ], [10,1 ], [13,1 ], [16,1 ], [19,1 ] ], // CARDS: p3_pos
        P4: [ [24,7 ], [24,10], [24,13], [24,16], [24,19] ], // CARDS: p4_pos
    };
    static cardCursorsPos = {
        P1: [ [7 ,23], [10,23], [13,23], [16,23], [19,23] ], // CARD CURSORS: p1_pos_cursor
        P2: [ [4 ,7 ], [4 ,10], [4 ,13], [4 ,16], [4 ,19] ], // CARD CURSORS: p2_pos_cursor
        P3: [ [7 ,4 ], [10,4 ], [13,4 ], [16,4 ], [19,4 ] ], // CARD CURSORS: p3_pos_cursor
        P4: [ [23,7 ], [23,10], [23,13], [23,16], [23,19] ], // CARD CURSORS: p4_pos_cursor
    };
    // static wildCursorPos  = [ [9 ,15], [12,15], [15,15], [18,15] ]; // CURSORS IN WILD MENU  : wild_pos_cursor
    // static pauseCursorPos = [ [8 ,12], [8 ,13], [8 ,14], [8 ,15] ]; // CURSORS IN PAUSE MENU : pause_pos_cursor
    static drawPos        = [ 10,11 ]; // Draw Pile          : draw_pos
    static discardPos     = [ 16,11 ]; // Discard Pile       : discard_pos
    static drawPosBelow   = [ 10,15 ]; // Under Draw Pile    : draw_pos_below
    static discardPosBelow= [ 15,15 ]; // Under Discard Pile : discard_pos_below

    constructor(config){
        this.className = this.constructor.name;
        this.gameBoard = null;

        // Create the deck (in order.)
        this.deck = [
            // WILD
            { location: "CARD_LOCATION_DRAW", value: "CARD_WILD", color: "CARD_BLACK" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_WILD", color: "CARD_BLACK" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_WILD", color: "CARD_BLACK" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_WILD", color: "CARD_BLACK" },

            // WILD DRAW FOUR
            { location: "CARD_LOCATION_DRAW", value: "CARD_WILD_DRAW4", color: "CARD_BLACK" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_WILD_DRAW4", color: "CARD_BLACK" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_WILD_DRAW4", color: "CARD_BLACK" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_WILD_DRAW4", color: "CARD_BLACK" },

            // YELLOW
            { location: "CARD_LOCATION_DRAW", value: "CARD_0"    , color: "CARD_YELLOW" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_1"    , color: "CARD_YELLOW" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_1"    , color: "CARD_YELLOW" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_2"    , color: "CARD_YELLOW" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_2"    , color: "CARD_YELLOW" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_3"    , color: "CARD_YELLOW" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_3"    , color: "CARD_YELLOW" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_4"    , color: "CARD_YELLOW" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_4"    , color: "CARD_YELLOW" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_5"    , color: "CARD_YELLOW" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_5"    , color: "CARD_YELLOW" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_6"    , color: "CARD_YELLOW" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_6"    , color: "CARD_YELLOW" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_7"    , color: "CARD_YELLOW" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_7"    , color: "CARD_YELLOW" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_8"    , color: "CARD_YELLOW" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_8"    , color: "CARD_YELLOW" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_9"    , color: "CARD_YELLOW" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_9"    , color: "CARD_YELLOW" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_DRAW2", color: "CARD_YELLOW" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_DRAW2", color: "CARD_YELLOW" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_SKIP" , color: "CARD_YELLOW" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_SKIP" , color: "CARD_YELLOW" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_REV"  , color: "CARD_YELLOW" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_REV"  , color: "CARD_YELLOW" },

            // BLUE
            { location: "CARD_LOCATION_DRAW", value: "CARD_0"    , color: "CARD_BLUE" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_1"    , color: "CARD_BLUE" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_1"    , color: "CARD_BLUE" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_2"    , color: "CARD_BLUE" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_2"    , color: "CARD_BLUE" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_3"    , color: "CARD_BLUE" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_3"    , color: "CARD_BLUE" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_4"    , color: "CARD_BLUE" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_4"    , color: "CARD_BLUE" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_5"    , color: "CARD_BLUE" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_5"    , color: "CARD_BLUE" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_6"    , color: "CARD_BLUE" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_6"    , color: "CARD_BLUE" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_7"    , color: "CARD_BLUE" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_7"    , color: "CARD_BLUE" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_8"    , color: "CARD_BLUE" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_8"    , color: "CARD_BLUE" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_9"    , color: "CARD_BLUE" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_9"    , color: "CARD_BLUE" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_DRAW2", color: "CARD_BLUE" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_DRAW2", color: "CARD_BLUE" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_SKIP" , color: "CARD_BLUE" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_SKIP" , color: "CARD_BLUE" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_REV"  , color: "CARD_BLUE" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_REV"  , color: "CARD_BLUE" },

            // RED
            { location: "CARD_LOCATION_DRAW", value: "CARD_0"    , color: "CARD_RED" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_1"    , color: "CARD_RED" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_1"    , color: "CARD_RED" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_2"    , color: "CARD_RED" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_2"    , color: "CARD_RED" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_3"    , color: "CARD_RED" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_3"    , color: "CARD_RED" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_4"    , color: "CARD_RED" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_4"    , color: "CARD_RED" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_5"    , color: "CARD_RED" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_5"    , color: "CARD_RED" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_6"    , color: "CARD_RED" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_6"    , color: "CARD_RED" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_7"    , color: "CARD_RED" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_7"    , color: "CARD_RED" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_8"    , color: "CARD_RED" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_8"    , color: "CARD_RED" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_9"    , color: "CARD_RED" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_9"    , color: "CARD_RED" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_DRAW2", color: "CARD_RED" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_DRAW2", color: "CARD_RED" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_SKIP" , color: "CARD_RED" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_SKIP" , color: "CARD_RED" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_REV"  , color: "CARD_RED" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_REV"  , color: "CARD_RED" },

            // GREEN
            { location: "CARD_LOCATION_DRAW", value: "CARD_0"    , color: "CARD_GREEN" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_1"    , color: "CARD_GREEN" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_1"    , color: "CARD_GREEN" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_2"    , color: "CARD_GREEN" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_2"    , color: "CARD_GREEN" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_3"    , color: "CARD_GREEN" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_3"    , color: "CARD_GREEN" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_4"    , color: "CARD_GREEN" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_4"    , color: "CARD_GREEN" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_5"    , color: "CARD_GREEN" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_5"    , color: "CARD_GREEN" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_6"    , color: "CARD_GREEN" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_6"    , color: "CARD_GREEN" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_7"    , color: "CARD_GREEN" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_7"    , color: "CARD_GREEN" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_8"    , color: "CARD_GREEN" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_8"    , color: "CARD_GREEN" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_9"    , color: "CARD_GREEN" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_9"    , color: "CARD_GREEN" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_DRAW2", color: "CARD_GREEN" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_DRAW2", color: "CARD_GREEN" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_SKIP" , color: "CARD_GREEN" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_SKIP" , color: "CARD_GREEN" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_REV"  , color: "CARD_GREEN" },
            { location: "CARD_LOCATION_DRAW", value: "CARD_REV"  , color: "CARD_GREEN" },
        ];
    }

    storeGameBoard(gameBoardRef){
        this.gameBoard = gameBoardRef;
    };

    // Create card placeholders.
    createCardPlaceholders(){
        // Set placeholders for each active player's small card.
        let players = this.gameBoard.players;
        for(let key in players){
            // Skip non-active players.
            if(!players[key].active){ continue; }

            // PLAYER CARDS (DISPLAY OF 5.) (SMALL)
            for(let i=0, len=Deck.cardPos[key].length; i<len; i+=1){
                let pos = Deck.cardPos[key][i];

                let rotation;
                if     (key=="P1"){ rotation =   0; }
                else if(key=="P2"){ rotation =  90; }
                else if(key=="P3"){ rotation = 180; }
                else if(key=="P4"){ rotation = -90; }

                // Create clear tilemap as placeholder.
                _GFX.layerObjs.createOne(Card, { 
                    size       : "sm", 
                    color      : "CARD_BLACK",
                    value      : "CARD_BACK", 
                    layerObjKey: `${key}_card_${i}`, 
                    layerKey   : "L2", 
                    xyByGrid   : true,
                    x          : pos[0], 
                    y          : pos[1], 
                    settings: { rotation: rotation }
                } );
            }
        }
    };

    // Flip player cards up.
    flipPlayerCardsUp(playerKey){
    };
    
    // Flip player cards down.
    flipPlayerCardsDown(playerKey){
        for(let i=0, len=Deck.cardPos[playerKey].length; i<len; i+=1){
            let layerObjKey = `${playerKey}_card_${i}`;
            let pos = Deck.cardPos[playerKey][i];
    
            _GFX.layerObjs.getOne(layerObjKey);
            
            // // Create clear tilemap as placeholder.
            // _GFX.layerObjs.createOne(Card, { 
            //     size       : "sm", 
            //     color      : "CARD_BLACK",
            //     value      : "CARD_BACK", 
            //     layerObjKey: `${key}_card_${i}`, 
            //     layerKey   : "L2", 
            //     xyByGrid   : true,
            //     x          : pos[0], 
            //     y          : pos[1], 
            //     settings: { rotation: rotation }
            // } );
        }
    };

    // Sets the location of each card to the DRAW_PILE.
    resetDeck(){
        for(let card of this.deck){
            card.location = "CARD_LOCATION_DRAW";
        }
    };

    // Randomly shuffles the deck.
    shuffleDeck(){
        // Based on: Fisher-Yates (also known as Knuth) shuffle algorithm.
        let times = 2;

        // Do it X times.
        // let ts = performance.now();
        for(let c=0; c<times; c+=1){
            for (let i = this.deck.length - 1; i > 0; i--) {
                // const j = Math.floor(Math.random() * (i + 1));
                const j = (Math.random() * (i + 1)) | 0;
                [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
            }
        }
        // console.log("Shuffle time:", performance.now() -ts);
    };

    // Get a random card from the draw pile (no assignment, just returns a random card.)
    getRandomCardFromDrawpile(){
        // Filter out only the available cards.
        let availableCards = this.deck.filter(d=>d.location=="CARD_LOCATION_DRAW");

        // If no cards are available then return null.
        if(!availableCards.length){ return false; }
        
        // Set the min and max for a range within the available cards. 
        let min = 0;
        let max = availableCards.length;
        
        // Get a random card from the available cards. 
        let index = ((Math.random() * (max - min + 1)) | 0) + min;
        let card = availableCards[index];

        // Return the card object (reference.)
        return card;
    };

    // Get the next card from the draw pile (no assignment, just returns a card.)
    getNextCardFromDrawpile(){
            // Filter out only the available cards.
            let availableCards = this.deck.filter(d=>d.location=="CARD_LOCATION_DRAW");

            // Are there any available cards in the draw pile?
            if(availableCards.length == 0){
                // No cards left. Convert the discard pile to the draw pile and shuffle those cards.
                for(let card of this.deck){
                    if(card.location == "CARD_LOCATION_DISCARD"){
                        card.location = "CARD_LOCATION_DRAW"
                    };
                }
        
                // Filter out only the available cards.
                // availableCards = this.deck.filter(d=>d.location=="CARD_LOCATION_DRAW");
                
                // Shuffle these cards.
                // this.shuffleArray(availableCards);
                
                // Shuffle the deck.
                this.shuffleDeck();
                
                // Filter out only the available cards.
                availableCards = this.deck.filter(d=>d.location=="CARD_LOCATION_DRAW");
    
                if(availableCards.length){
                    // Return the next card.
                    return availableCards[0];
                }
                else{
                    console.log("OUT OF CARDS", availableCards);
                    return false;
                }
            }
            else{
                // Return the next card.
                return availableCards[0];
            }
    };

    // NORMAL PLAY:
    // DRAW PILE (UNO BACK) (LARGE)
    // DISCARD PILE FACE-UP CARD (LARGE)
    // PLAYER1 CARDS (DISPLAY OF 5.) (SMALL)
    // PLAYER2 CARDS (DISPLAY OF 5.) (SMALL)
    // PLAYER3 CARDS (DISPLAY OF 5.) (SMALL)
    // PLAYER4 CARDS (DISPLAY OF 5.) (SMALL)
    // PLAYER MOVING CARD TO DISCARD PILE. (SMALL)
    // PLAYER MOVING CARD FROM DRAW PILE. (SMALL)
    // Non-active players only show the back card.

    // END OF ROUND PLAY:
    // PLAYER1 CARDS (DISPLAY OF 5.) (SMALL) (reuse of above)
    // PLAYER2 CARDS (DISPLAY OF 5.) (SMALL) (reuse of above)
    // PLAYER3 CARDS (DISPLAY OF 5.) (SMALL) (reuse of above)
    // PLAYER4 CARDS (DISPLAY OF 5.) (SMALL) (reuse of above)
    // DISPLAY CARD: 1 (LARGE) (reuse of discard pile)
    // PLAYER MOVING CARD TO BE THE DISPLAY CARD. (SMALL) (reuse of card moving to draw pile.)
    // Players not actively adding to the score only show the back card.
};

class Gameboard{
    constructor(config){
        this.parent       = config.parent;
        this.deck         = config.deck;
        this.gameSettings = config.gameSettings;

        this.players = {
            P1: { type: "NONE", active:false },
            P2: { type: "NONE", active:false },
            P3: { type: "NONE", active:false },
            P4: { type: "NONE", active:false },
        };

        this.currentColor     = "CARD_BLACK";
        this.currentDirection = "F";
        this.currentPlayer    = "P1";

        this.createGameBoard();
        // this.initPlayers();
    }

    // Display in-game message.
    displayMessage(msgKey, playerKey, hide=false){
        // this.gameBoard.displayMessage("playsFirst", "P1", false);
        let pos = {
            msgBox: {
                msgBox  : { x:7, y:18, w:13 , h:3, layerKey: "L4", layerObjKey: "msgBox_text" },
            }
        }

        let playerNum = playerKey.replace(/\D/g,'');

        let msgs = {
            none  : [
                `              ` ,
                `              ` ,
                `               `
            ],
            tied  : [
                `     TIED     ` ,
                `  SAME CARDS  ` ,
                ` TRYING AGAIN ` ,
            ],
            playsFirst  : [
                `   PLAYER ${playerNum}   `,
                `              ` ,
                ` PLAYS FIRST! `
            ],
            reversed    : [
                `  PLAY ORDER  ` ,
                `              ` ,
                `  REVERSED !  `
            ],
            loseTurn    : [
                `   PLAYER ${playerNum}   ` ,
                `              ` ,
                `  LOSE TURN!  `
            ],
            skipLoseTurn: [
                `   PLAYER ${playerNum}   ` ,
                `    SKIP !    ` ,
                `  LOSE TURN!  `
            ],
            d2LoseTurn  : [
                `   PLAYER ${playerNum}   ` ,
                `  DRAW TWO !  ` ,
                `  LOSE TURN!  `
            ],
            d4LoseTurn  : [
                `   PLAYER ${playerNum}   ` ,
                `  DRAW FOUR!  ` ,
                `  LOSE TURN!  `
            ],
            winsRound   : [
                `   PLAYER ${playerNum}  ` ,
                `   WINS THE   ` ,
                `    ROUND!    `
            ],
            playCancel  : [
                `  A:  PLAY    ` ,
                `              ` ,
                `  B:  CANCEL  ` 
            ],
            passCancel  : [
                `  A:  PASS    ` ,
                `              ` ,
                `  B:  CANCEL  `
            ],
            wrongCard   : [
                `  WRONG CARD  ` ,
                `              ` ,
                ` PICK ANOTHER `
            ],
        };

        if(! (msgKey in msgs)){ console.log("displayMessage: Invalid message"); return ; }

        // Try to access.
        let textKey_msgBox   = _GFX.layerObjs.getOne( pos["msgBox"].msgBox.layerObjKey );

        let data;
        if(!textKey_msgBox)  { 
            data = pos["msgBox"].msgBox;
            _GFX.layerObjs.createOne(PrintText, { text: " "  , x:data.x, y:data.y, layerObjKey: data.layerObjKey, layerKey: data.layerKey, xyByGrid: true });   
            textKey_msgBox   = _GFX.layerObjs.getOne( pos["msgBox"].msgBox.layerObjKey   );
        }

        // Remove the layerObject.
        if(msgKey == "none"){ 
            // Removing an already removed object does not throw an error.
            _GFX.layerObjs.removeOne( textKey_msgBox.layerObjKey );
        }

        // Set the background color and set the text.
        else{ 
            textKey_msgBox.settings = { bgColorRgba: [0,0,0, 168] }; 
            
            // Set the text.
            textKey_msgBox.text = msgs[msgKey];
        }
    };

    // Display in-game menu.
    displayMenu(type="wild"){
        // types: ["wild", "menu"]
    };

    // Init the players and determine which are active.
    initPlayers(){
        // Player 1
        if(this.parent.gameSettings.P1 != "NONE"){ this.players["P1"].active = true; } 
        else                                     { this.players["P1"].active = false; }
        this.players["P1"].type = this.parent.gameSettings.P1; 
        
        // Player 2
        if(this.parent.gameSettings.P2 != "NONE"){ this.players["P2"].active = true; } 
        else                                     { this.players["P2"].active = false; }
        this.players["P2"].type = this.parent.gameSettings.P2; 
        
        // Player 3
        if(this.parent.gameSettings.P3 != "NONE"){ this.players["P3"].active = true; } 
        else                                     { this.players["P3"].active = false; }
        this.players["P3"].type = this.parent.gameSettings.P3; 
        
        // Player 4
        if(this.parent.gameSettings.P4 != "NONE"){ this.players["P4"].active = true;  } 
        else                                     { this.players["P4"].active = false; }
        this.players["P4"].type = this.parent.gameSettings.P4; 

        // Add the text. (For each active player.)
        this.updatePlayerText();
    };

    // TODO
    // Set current player.
    setCurrentPlayer(playerKey){
        // Set the playerKey value. 
        this.currentPlayer = playerKey;

        // Hide the active player indicators.
        //
        
        // Show the active player indicator for the active player.
        //
    };

    // Set color indicators.
    setColorIndicators(playerKey, color){
        // Set the color value. 
        this.currentColor = color;

        // Display the active color.
        let pos = {
            P1: { x:8 , y:22, w: 12, h:1 , layerKey: "L1", layerObjKey: "p1ColorBar", tilesetKey: "bg_tiles1" },
            P2: { x:5 , y:8 , w: 1 , h:12, layerKey: "L1", layerObjKey: "p2ColorBar", tilesetKey: "bg_tiles1" },
            P3: { x:8 , y:5 , w: 12, h:1 , layerKey: "L1", layerObjKey: "p3ColorBar", tilesetKey: "bg_tiles1" },
            P4: { x:22, y:8 , w: 1 , h:12, layerKey: "L1", layerObjKey: "p4ColorBar", tilesetKey: "bg_tiles1" },
        };

        let fillTile;
        if     (this.currentColor == "CARD_BLACK") { fillTile = _GFX.funcs.getTilemap("bg_tiles1", "colorFill1_black")[2];}
        else if(this.currentColor == "CARD_YELLOW"){ fillTile = _GFX.funcs.getTilemap("bg_tiles1", "colorFill1_yellow")[2];}
        else if(this.currentColor == "CARD_BLUE")  { fillTile = _GFX.funcs.getTilemap("bg_tiles1", "colorFill1_blue")[2];  }
        else if(this.currentColor == "CARD_RED")   { fillTile = _GFX.funcs.getTilemap("bg_tiles1", "colorFill1_red")[2];   }
        else if(this.currentColor == "CARD_GREEN") { fillTile = _GFX.funcs.getTilemap("bg_tiles1", "colorFill1_green")[2]; }

        // Remove bars.
        _GFX.layerObjs.removeOne( pos["P1"].layerObjKey );
        _GFX.layerObjs.removeOne( pos["P2"].layerObjKey );
        _GFX.layerObjs.removeOne( pos["P3"].layerObjKey );
        _GFX.layerObjs.removeOne( pos["P4"].layerObjKey );

        // Create the bar.
        let data = pos[playerKey];
        _GFX.layerObjs.createOne(LayerObject, {
            layerObjKey: data.layerObjKey, 
            layerKey   : data.layerKey, 
            tilesetKey : data.tilesetKey, 
            xyByGrid: true, settings: {},
            removeHashOnRemoval: true, noResort: false,
            x:data.x, y:data.y,
            tmap: new Uint8Array(
                // Dimensions.
                [ data.w, data.h ]
                // Tiles
                .concat(Array.from({ length: ((data.w) * (data.h)) }, () => fillTile))
            ),
        });
    };

    // Set direction indicators.
    setDirectionIndicators(dir){
        // _APP.shared.gameBoard.setDirectionIndicators("F");
        // _APP.shared.gameBoard.setDirectionIndicators("N");
        // _APP.shared.gameBoard.setDirectionIndicators("R");
        this.currentDirection = dir;
        if(dir == "F"){
            _GFX.layerObjs.createOne(LayerObject, { tmap: _GFX.funcs.getTilemap("bg_tiles1", "directionF_tl"), x:5, y:5, layerObjKey: `direction_tl`, layerKey: "L1", tilesetKey: "bg_tiles1", xyByGrid: true });
            _GFX.layerObjs.createOne(LayerObject, { tmap: _GFX.funcs.getTilemap("bg_tiles1", "directionF_tr"), x:20, y:5, layerObjKey: `direction_tr`, layerKey: "L1", tilesetKey: "bg_tiles1", xyByGrid: true });
            _GFX.layerObjs.createOne(LayerObject, { tmap: _GFX.funcs.getTilemap("bg_tiles1", "directionF_bl"), x:5, y:20, layerObjKey: `direction_bl`, layerKey: "L1", tilesetKey: "bg_tiles1", xyByGrid: true });
            _GFX.layerObjs.createOne(LayerObject, { tmap: _GFX.funcs.getTilemap("bg_tiles1", "directionF_br"), x:20, y:20, layerObjKey: `direction_br`, layerKey: "L1", tilesetKey: "bg_tiles1", xyByGrid: true });
        }
        else if(dir == "R"){
            _GFX.layerObjs.createOne(LayerObject, { tmap: _GFX.funcs.getTilemap("bg_tiles1", "directionR_tl"), x:5, y:5, layerObjKey: `direction_tl`, layerKey: "L1", tilesetKey: "bg_tiles1", xyByGrid: true });
            _GFX.layerObjs.createOne(LayerObject, { tmap: _GFX.funcs.getTilemap("bg_tiles1", "directionR_tr"), x:20, y:5, layerObjKey: `direction_tr`, layerKey: "L1", tilesetKey: "bg_tiles1", xyByGrid: true });
            _GFX.layerObjs.createOne(LayerObject, { tmap: _GFX.funcs.getTilemap("bg_tiles1", "directionR_bl"), x:5, y:20, layerObjKey: `direction_bl`, layerKey: "L1", tilesetKey: "bg_tiles1", xyByGrid: true });
            _GFX.layerObjs.createOne(LayerObject, { tmap: _GFX.funcs.getTilemap("bg_tiles1", "directionR_br"), x:20, y:20, layerObjKey: `direction_br`, layerKey: "L1", tilesetKey: "bg_tiles1", xyByGrid: true });
        }
        else if(dir == "N"){
            _GFX.layerObjs.removeOne( "direction_tl" );
            _GFX.layerObjs.removeOne( "direction_tr" );
            _GFX.layerObjs.removeOne( "direction_bl" );
            _GFX.layerObjs.removeOne( "direction_br" );
        }
    };

    // Update the text for each player corner.
    updatePlayerText(){
        let pos = {
            P1: {
                uno  : { x:23, y:24, layerKey: "L4", layerObjKey: "p1Text_uno"   },
                name : { x:23, y:25, layerKey: "L4", layerObjKey: "p1Text_name"  },
                cards: { x:23, y:26, layerKey: "L4", layerObjKey: "p1Text_cards" },
                count: { x:23, y:27, layerKey: "L4", layerObjKey: "p1Text_count" },
            },
            P2: {
                uno  : { x:0, y:24, layerKey: "L4", layerObjKey: "p2Text_uno"   },
                name : { x:0, y:25, layerKey: "L4", layerObjKey: "p2Text_name"  },
                cards: { x:0, y:26, layerKey: "L4", layerObjKey: "p2Text_cards" },
                count: { x:0, y:27, layerKey: "L4", layerObjKey: "p2Text_count" },
            },
            P3: {
                name : { x:0, y:0, layerKey: "L4", layerObjKey: "p3Text_name"  },
                cards: { x:0, y:1, layerKey: "L4", layerObjKey: "p3Text_cards" },
                count: { x:0, y:2, layerKey: "L4", layerObjKey: "p3Text_count" },
                uno  : { x:0, y:3, layerKey: "L4", layerObjKey: "p3Text_uno"   },
            },
            P4: {
                name : { x:23, y:0, layerKey: "L4", layerObjKey: "p4Text_name"  },
                cards: { x:23, y:1, layerKey: "L4", layerObjKey: "p4Text_cards" },
                count: { x:23, y:2, layerKey: "L4", layerObjKey: "p4Text_count" },
                uno  : { x:23, y:3, layerKey: "L4", layerObjKey: "p4Text_uno"   },
            },
        };

        for(let playerKey in this.players){
            if( ! this.players[playerKey].active){ continue; }
            
            // Try to access.
            let textKey_uno   = _GFX.layerObjs.getOne( pos[playerKey].uno.layerObjKey   );
            let textKey_name  = _GFX.layerObjs.getOne( pos[playerKey].name.layerObjKey  );
            let textKey_count = _GFX.layerObjs.getOne( pos[playerKey].count.layerObjKey );
            let textKey_cards = _GFX.layerObjs.getOne( pos[playerKey].cards.layerObjKey );
            
            // If not found then create it.
            let data;
            if(!textKey_uno)  { 
                data = pos[playerKey].uno;
                // console.log("Adding uno:", playerKey, data);
                _GFX.layerObjs.createOne(PrintText, { text: "    "  , x:data.x, y:data.y, layerObjKey: data.layerObjKey, layerKey: data.layerKey, xyByGrid: true });   
                textKey_uno   = _GFX.layerObjs.getOne( pos[playerKey].uno.layerObjKey   );
            }
            if(!textKey_name) { 
                data = pos[playerKey].name;
                _GFX.layerObjs.createOne(PrintText, { text: playerKey  , x:data.x, y:data.y, layerObjKey: data.layerObjKey, layerKey: data.layerKey, xyByGrid: true });  
                textKey_name  = _GFX.layerObjs.getOne( pos[playerKey].name.layerObjKey  );
            }
            if(!textKey_count){ 
                data = pos[playerKey].count;
                _GFX.layerObjs.createOne(PrintText, { text: "  10  "  , x:data.x, y:data.y, layerObjKey: data.layerObjKey, layerKey: data.layerKey, xyByGrid: true }); 
                textKey_count = _GFX.layerObjs.getOne( pos[playerKey].count.layerObjKey );
            }
            if(!textKey_cards){ 
                data = pos[playerKey].cards;
                _GFX.layerObjs.createOne(PrintText, { text: "CARDS"  , x:data.x, y:data.y, layerObjKey: data.layerObjKey, layerKey: data.layerKey, xyByGrid: true }); 
                textKey_cards = _GFX.layerObjs.getOne( pos[playerKey].cards.layerObjKey );
            }

            // Get the card count for the player.
            let location;
            if     (playerKey == 1){ location = CARD_LOCATION_PLAYER1; }
            else if(playerKey == 2){ location = CARD_LOCATION_PLAYER2; }
            else if(playerKey == 3){ location = CARD_LOCATION_PLAYER3; }
            else if(playerKey == 4){ location = CARD_LOCATION_PLAYER4; }
            let cardCount = this.parent.deck.deck.filter(d=>d.location==location).length;

            // Update "UNO" and the card count.
            if     (cardCount == 1 && _APP.game.gs2 == "playerTurn"){ textKey_uno.text   = "UNO!"; }
            else if(cardCount == 0 && _APP.game.gs2 == "playerTurn"){ textKey_uno.text   = "WIN!"; }
            else                   { 
                // Removing an already removed object does not throw an error.
                _GFX.layerObjs.removeOne( textKey_uno.layerObjKey );
            }
            
            textKey_count.text = cardCount.toString(); // centered
            textKey_name .text = playerKey;
            textKey_cards.text = "CARDS";
        }
    };

    // Create the gameboard graphics.
    createGameBoard(){
        let pos = {
            centerBorder: { x:5 , y:5 , w:18, h:18 },
            p1Border    : { x:6 , y:23, w:16, h:5  },
            p2Border    : { x:0 , y:6 , w:5 , h:16 },
            p3Border    : { x:6 , y:0 , w:16, h:5  },
            p4Border    : { x:23, y:6 , w:5 , h:16 },
            drawBorder  : { x:8 , y:10, w:5 , h:7  },
            discBorder  : { x:15, y:10, w:5 , h:7  },
        };

        let borderType_center  = 2;
        let borderType_player  = 3;
        let borderType_draw    = 1;
        let borderType_discard = 1;

        // border/fill: center
        Border.createBorder({
            x:pos.centerBorder.x, y:pos.centerBorder.y, w: pos.centerBorder.w, h: pos.centerBorder.h, 
            layerObjKey: `cBorder`, layerKey: "L1", xyByGrid: true, tilesetKey: "bg_tiles1", 
            fill: true, fillTile: _GFX.funcs.getTilemap("bg_tiles1", "border2_fill")[2], borderType: borderType_center 
        });

        // Border/fill: player 1
        Border.createBorder({
            x:pos.p1Border.x, y:pos.p1Border.y, w: pos.p1Border.w, h: pos.p1Border.h, 
            layerObjKey: `p1Border`, layerKey: "L1", xyByGrid: true, tilesetKey: "bg_tiles1",
            fill: true, fillTile: _GFX.funcs.getTilemap("bg_tiles1", "wood2")[2], borderType: borderType_player 
        });
        
        // Border/fill: player 2
        Border.createBorder({
            x:pos.p2Border.x, y:pos.p2Border.y, w: pos.p2Border.w, h: pos.p2Border.h, 
            layerObjKey: `p2Border`, layerKey: "L1", xyByGrid: true, tilesetKey: "bg_tiles1",
            fill: true, fillTile: _GFX.funcs.getTilemap("bg_tiles1", "wood2")[2], borderType: borderType_player 
        });
        
        // Border/fill: player 3
        Border.createBorder({
            x:pos.p3Border.x, y:pos.p3Border.y, w: pos.p3Border.w, h: pos.p3Border.h, 
            layerObjKey: `p3Border`, layerKey: "L1", xyByGrid: true, tilesetKey: "bg_tiles1",
            fill: true, fillTile: _GFX.funcs.getTilemap("bg_tiles1", "wood2")[2], borderType: borderType_player 
        });
        
        // Border/fill: player 4
        Border.createBorder({
            x:pos.p4Border.x, y:pos.p4Border.y, w: pos.p4Border.w, h: pos.p4Border.h, 
            layerObjKey: `p4Border`, layerKey: "L1", xyByGrid: true, tilesetKey: "bg_tiles1",
            fill: true, fillTile: _GFX.funcs.getTilemap("bg_tiles1", "wood2")[2], borderType: borderType_player 
        });

        // Border/fill: draw pile
        Border.createBorder({
            x:pos.drawBorder.x, y:pos.drawBorder.y, w: pos.drawBorder.w, h: pos.drawBorder.h, 
            layerObjKey: `drapBorder`, layerKey: "L1", xyByGrid: true, tilesetKey: "bg_tiles1",
            fill: true, fillTile: _GFX.funcs.getTilemap("bg_tiles1", "wood2")[2], borderType: borderType_draw 
        });
        
        // Border/fill: discard pile
        Border.createBorder({
            x:pos.discBorder.x, y:pos.discBorder.y, w: pos.discBorder.w, h: pos.discBorder.h, 
            layerObjKey: `dispBorder`, layerKey: "L1", xyByGrid: true, tilesetKey: "bg_tiles1",
            fill: true, fillTile: _GFX.funcs.getTilemap("bg_tiles1", "wood2")[2], borderType: borderType_discard 
        });
    };
}




class OLD_N782_face_anim extends LayerObject{
    constructor(config){
        super(config);
        this.className = this.constructor.name;

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
        this.className = this.constructor.name;

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
        this.className = this.constructor.name;

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
        this.className = this.constructor.name;

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
        this.className = this.constructor.name;

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
        this.className = this.constructor.name;

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

