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
    static frames_type1 = [
    ];
    static frames_type2 = [
    ];

    constructor(config){
        config.tilesetKey = "sprite_tiles1";
        super(config);
        this.className = this.constructor.name;

        this.tilesetKey = "sprite_tiles1";

        this.cursorType = config.cursorType ?? 1;

        if(this.cursorType == 1){
            this.frames = [
                _GFX.funcs.getTilemap("sprite_tiles1", "cursor1_f1"),
                _GFX.funcs.getTilemap("sprite_tiles1", "cursor1_f2"),
            ];
        }
        else if(this.cursorType == 2){
            this.frames = [
                _GFX.funcs.getTilemap("sprite_tiles1", "cursor2_f1"),
                _GFX.funcs.getTilemap("sprite_tiles1", "cursor2_f2"),
            ];
        }

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
    movementSpeed = 1;
    movementDone = false;

    // Sets up a card movement from point A to point B.
    moveCardFromPosToPos(fromPos, toPos, speed=1){
        this.movementDone = false;
        
        // Make sure that the incoming numbers are integers.
        // Helpful if a movement command is repeated since the current values may be decimal.
        fromPos.x = fromPos.x | 0;
        fromPos.y = fromPos.y | 0;
        toPos.x = toPos.x | 0;
        toPos.y = toPos.y | 0;

        // Store the fromPos, currPos and toPos.
        this.fromPos = {...fromPos};
        this.currPos = {...fromPos};
        this.toPos   = {...toPos};
        
        // Set movement speed.
        this.movementSpeed = speed;

        // Move the card to the starting position.
        this.x = this.currPos.x;
        this.y = this.currPos.y;
    };

    // Sets up the "selected card" movement (uses: moveCardFromPosToPos.)
    moveCardToSelected(currPlayer, speed=1){
        let from = { x:this.x, y:this.y };
        let dest = { x:this.x, y:this.y };
        if     (currPlayer == "P1"){ dest.y -= 3; } // Avoids covering the message box.
        else if(currPlayer == "P2"){ dest.x += 3; } // Avoids covering the message box.
        else if(currPlayer == "P3"){ dest.y += 3; } // Avoids covering the message box.
        else if(currPlayer == "P4"){ dest.x -= 3; } // Avoids covering the message box.

        this.moveCardFromPosToPos( from, dest, speed );
    };

    // Sets up the "unselected card" movement (uses: moveCardFromPosToPos.)
    moveCardToUnselected(currPlayer, speed=1){
        let from = { x:this.x, y:this.y };
        let dest = { x:this.x, y:this.y };
        if     (currPlayer == "P1"){ dest.y += 3; } 
        else if(currPlayer == "P2"){ dest.x -= 3; } 
        else if(currPlayer == "P3"){ dest.y -= 3; } 
        else if(currPlayer == "P4"){ dest.x += 3; } 

        this.moveCardFromPosToPos( from, dest, speed );
    };
    moveCardToDiscard(speed=1){
        let discPos = Deck.discardPos;
        let from = { x:this.x, y:this.y };
        let dest = { x: discPos[0], y: discPos[1] };
        this.moveCardFromPosToPos( from, dest, speed );
    };

    // Sends a card from it's current position to the draw pile position.
    moveDrawCardToHome(playerKey, cardSlot, speed=1){
        let cardPos = Deck.cardPos[playerKey][cardSlot];
        let drawPos = Deck.drawPos;
        let from = { x: drawPos[0], y: drawPos[1] };
        let dest = { x: cardPos[0], y: cardPos[1] };
        this.moveCardFromPosToPos( from, dest, speed );
    };
    
    moveCardToHome(playerKey, cardSlot, speed=1){
        let cardPos = Deck.cardPos[playerKey][cardSlot];
        let from = { x: this.x, y: this.y };
        let dest = { x: cardPos[0], y: cardPos[1] };
        this.moveCardFromPosToPos( from, dest, speed );
    };

    // UNUSED
    roundToNearestMultiple(number, multiple) {
        var numOfDecimalPlaces = (multiple.toString().split('.')[1] || []).length;
        return parseFloat((Math.round(number / multiple) * multiple).toFixed(numOfDecimalPlaces));
        // return parseFloat((Math.ceil(number / multiple) * multiple).toFixed(numOfDecimalPlaces));
        // return parseFloat((Math.floor(number / multiple) * multiple).toFixed(numOfDecimalPlaces));
    };

    nextFrame() {
        // If movement is already done, do nothing.
        if(!this.movementDone) {
            // Calculate the total distances to be covered in x and y directions.
            let totalDistanceX = this.toPos.x - this.fromPos.x;
            let totalDistanceY = this.toPos.y - this.fromPos.y;
        
            // Calculate the increments per frame.
            let incrementX = totalDistanceX / this.movementSpeed;
            let incrementY = totalDistanceY / this.movementSpeed;
        
            // Update the current position.
            this.currPos.x += incrementX;
            this.currPos.y += incrementY;
        
            // Check if we are close or past the target in the X direction.
            if ((incrementX > 0 && this.currPos.x >= this.toPos.x) ||
                (incrementX < 0 && this.currPos.x <= this.toPos.x)) {
                this.currPos.x = this.toPos.x; // Snap to final position.
            }
        
            // Check if we are close or past the target in the Y direction.
            if ((incrementY > 0 && this.currPos.y >= this.toPos.y) ||
                (incrementY < 0 && this.currPos.y <= this.toPos.y)) {
                this.currPos.y = this.toPos.y; // Snap to final position.
            }
        
            // Update the position. (They remain unrounded here but are rounded down before actual draw.)
            this.x = this.currPos.x;
            this.y = this.currPos.y;
        
            // Check if movement is done.
            if (this.currPos.x === this.toPos.x && this.currPos.y === this.toPos.y) {
                this.movementDone = true;
            }
        }
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
    static playerCardLocations = {
        "P1": "CARD_LOCATION_PLAYER1",
        "P2": "CARD_LOCATION_PLAYER2",
        "P3": "CARD_LOCATION_PLAYER3",
        "P4": "CARD_LOCATION_PLAYER4",
    };
    static playerCardRotations = {
        "P1": 0,
        "P2": 90,
        "P3": 180,
        "P4": -90,
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
    static drawPos        = [ 9 ,11 ]; // Draw Pile          : draw_pos
    static discardPos     = [ 16,11 ]; // Discard Pile       : discard_pos
    static drawPosBelow   = [ 9,15 ]; // Under Draw Pile    : draw_pos_below
    static discardPosBelow= [ 16,15 ]; // Under Discard Pile : discard_pos_below

    constructor(config){
        this.className = this.constructor.name;
        this.gameBoard = null;
        this.parent    = config.parent;

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
                    settings: { rotation: rotation }, 
                    hidden: true,
                } );
            }
        }

        // DRAW: placeholders. (left side)
        _GFX.layerObjs.createOne(Card, { 
            size       : "lg", 
            color      : "CARD_BLACK",
            value      : "CARD_BACK", 
            layerObjKey: `draw_card`, 
            layerKey   : "L2", 
            xyByGrid   : true,
            x          : Deck.drawPos[0], 
            y          : Deck.drawPos[1], 
            settings: { rotation: 0 }, 
            hidden: false,
        } );
        _GFX.layerObjs.createOne(LayerObject, { 
            tilesetKey: `bg_tiles1`, 
            layerObjKey: `drawBelow`, 
            layerKey   : "L2", 
            tmap       : _GFX.funcs.getTilemap("bg_tiles1", "underPileL4"), 
            xyByGrid   : true,
            x          : Deck.drawPosBelow[0], 
            y          : Deck.drawPosBelow[1], 
            settings: { rotation: 0 }, 
            hidden: false,
        } );

        // DISCARD: placeholders. (right side)
        _GFX.layerObjs.createOne(Card, { 
            size       : "lg", 
            color      : "CARD_BLACK",
            value      : "CARD_BACK", 
            layerObjKey: `discard_card`, 
            layerKey   : "L2", 
            xyByGrid   : true,
            x          : Deck.discardPos[0], 
            y          : Deck.discardPos[1], 
            settings: { rotation: 0 }, 
            hidden: true,
        } );
        _GFX.layerObjs.createOne(LayerObject, { 
            tilesetKey: `bg_tiles1`, 
            layerObjKey: `discardBelow`, 
            layerKey   : "L2", 
            tmap       : _GFX.funcs.getTilemap("bg_tiles1", "underPileL0"), 
            xyByGrid   : true,
            x          : Deck.discardPosBelow[0], 
            y          : Deck.discardPosBelow[1], 
            settings: { rotation: 0 }, 
            hidden: false,
        } );

        // TEMP CARD. Used when drawing cards and then hidden.
        _GFX.layerObjs.createOne(Card, { 
            size       : "sm", 
            color      : "CARD_BLACK",
            value      : "CARD_BACK", 
            layerObjKey: `temp_card`, 
            layerKey   : "L2", 
            xyByGrid   : true,
            x          : Deck.drawPos[0], 
            y          : Deck.drawPos[1], 
            settings: { rotation: 0 }, 
            hidden: true,
        } );
    };

    // Flip player cards up.
    flipPlayerCardsUp(playerKey, row=0){
        // Get the current color.
        let currentColor = this.gameBoard.currentColor;

        // Get the player's cards.
        let location = Deck.playerCardLocations[playerKey];
        let playerCards = this.deck.filter(d => d.location == location);

        // Filter those cards by color.
        let colors = {
            "CARD_YELLOW": playerCards.filter(d => d.color == "CARD_YELLOW"),
            "CARD_BLUE"  : playerCards.filter(d => d.color == "CARD_BLUE"),
            "CARD_GREEN" : playerCards.filter(d => d.color == "CARD_GREEN"),
            "CARD_RED"   : playerCards.filter(d => d.color == "CARD_RED"),
            "CARD_BLACK" : playerCards.filter(d => d.color == "CARD_BLACK")
        };

        // Start playerCards_sorted.
        let playerCards_sorted = colors["CARD_BLACK"].concat(colors[currentColor]);

        // Add the remaining colors excluding black and the current color.
        for (let color in colors) {
            if (color !== "CARD_BLACK" && color !== currentColor) {
                playerCards_sorted = playerCards_sorted.concat(colors[color]);
            }
        }

        // Display up to 5 cards.
        // Get the layer objects for the cards.
        let cards_layerObjs = [
            _GFX.layerObjs.getOne( `${playerKey}_card_0` ),
            _GFX.layerObjs.getOne( `${playerKey}_card_1` ),
            _GFX.layerObjs.getOne( `${playerKey}_card_2` ),
            _GFX.layerObjs.getOne( `${playerKey}_card_3` ),
            _GFX.layerObjs.getOne( `${playerKey}_card_4` ),
        ];
        
        // Each row has up to 5 cards in it. So, each row starts on a multiple of 5 (including 0.)
        let cardsToDisplay = playerCards_sorted.slice( (row*5), 5);

        // Show the cards face-up.
        for(let i=0; i<cards_layerObjs.length; i+=1){
            // If we have a card here then display it.
            if(cardsToDisplay[i]){
                cards_layerObjs[i].hidden = false;
                cards_layerObjs[i].change_wholeCard("sm", cardsToDisplay[i].color, cardsToDisplay[i].value);
            }
            // No card. Hide it.
            else{
                cards_layerObjs[i].hidden = true;
            }
        }
    };
    
    // Flip player cards down.
    flipPlayerCardsDown(playerKey){
        let location = Deck.playerCardLocations[playerKey];
        let playerCards = this.deck.filter(d => d.location == location);
        
        // Display up to 5 cards.
        // Get the layer objects for the cards.
        let cards_layerObjs = [
            _GFX.layerObjs.getOne( `${playerKey}_card_0` ),
            _GFX.layerObjs.getOne( `${playerKey}_card_1` ),
            _GFX.layerObjs.getOne( `${playerKey}_card_2` ),
            _GFX.layerObjs.getOne( `${playerKey}_card_3` ),
            _GFX.layerObjs.getOne( `${playerKey}_card_4` ),
        ];
        
        // Each row has up to 5 cards in it. So, each row starts on a multiple of 5 (including 0.)
        let row = 0;
        let cardsToDisplay = playerCards.slice( (row*5), 5);

        // Show the cards face-down.
        for(let i=0; i<cards_layerObjs.length; i+=1){
            // If we have a card here then display it.
            if(cardsToDisplay[i]){
                cards_layerObjs[i].hidden = false;
                cards_layerObjs[i].change_wholeCard("sm", "CARD_BLACK", "CARD_BACK");
            }
            // No card. Hide it.
            else{
                cards_layerObjs[i].hidden = true;
            }
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

    //
    updateDiscardCard(card){
        // Get the displayed discard card.
        let cardObj = _GFX.layerObjs.getOne("discard_card");

        // Change the card to represent the card that was discarded.
        cardObj.change_wholeCard("lg", card.color, card.value);
    };

    updateUnderPiles(){
        let drawCount    = this.deck.filter(d=>d.location=="CARD_LOCATION_DRAW").length;
        let drawBelow      = _GFX.layerObjs.getOne("drawBelow");
        if     (drawCount == 0  ) { drawBelow.tmap = _GFX.funcs.getTilemap("bg_tiles1", "underPileL0");}
        else if(drawCount <  27 ) { drawBelow.tmap = _GFX.funcs.getTilemap("bg_tiles1", "underPileL1");}
        else if(drawCount <  54 ) { drawBelow.tmap = _GFX.funcs.getTilemap("bg_tiles1", "underPileL2");}
        else if(drawCount <  81 ) { drawBelow.tmap = _GFX.funcs.getTilemap("bg_tiles1", "underPileL3");}
        else                      { drawBelow.tmap = _GFX.funcs.getTilemap("bg_tiles1", "underPileL4");}

        let discardCount = this.deck.filter(d=>d.location=="CARD_LOCATION_DISCARD").length;
        let discardBelow   = _GFX.layerObjs.getOne("discardBelow");
        if     (discardCount == 0  ) { discardBelow.tmap = _GFX.funcs.getTilemap("bg_tiles1", "underPileL0");}
        else if(discardCount <  27 ) { discardBelow.tmap = _GFX.funcs.getTilemap("bg_tiles1", "underPileL1");}
        else if(discardCount <  54 ) { discardBelow.tmap = _GFX.funcs.getTilemap("bg_tiles1", "underPileL2");}
        else if(discardCount <  81 ) { discardBelow.tmap = _GFX.funcs.getTilemap("bg_tiles1", "underPileL3");}
        else                         { discardBelow.tmap = _GFX.funcs.getTilemap("bg_tiles1", "underPileL4");}
    };
};

class ColorChanger{
    static text = [
        // `              ` ,
        `  CHOOSE COLOR  ` ,
        `` ,
        `` ,
        ``, //`  YELBLUREDGRE  ` ,
        ``, //`  YELBLUREDGRE  ` ,
        ``, //`  YELBLUREDGRE  ` ,
        `` ,
        `` ,
        `  DPAD: CHANGE  `,
        `     A: SELECT  ` ,
    ];
    static pos = { 
        box   : { x: 6, y: 9 },
        yellow: { x: 8, y:12 },
        blue  : { x:11, y:12 },
        red   : { x:14, y:12 },
        green : { x:17, y:12 },
    };
    static cursorsPos = [
        {x: ColorChanger.pos.yellow.x + 1, y: ColorChanger.pos.yellow.y + 3, color: "CARD_YELLOW" },
        {x: ColorChanger.pos.blue  .x + 1, y: ColorChanger.pos.blue  .y + 3, color: "CARD_BLUE"   },
        {x: ColorChanger.pos.red   .x + 1, y: ColorChanger.pos.red   .y + 3, color: "CARD_RED"    },
        {x: ColorChanger.pos.green .x + 1, y: ColorChanger.pos.green .y + 3, color: "CARD_GREEN"  },
    ];
    static colors = {
        white  : [255, 255, 255, 255],
        yellow : [255, 182,  85, 255],
        blue   : [ 36,  72, 170, 255],
        red    : [218,   0,   0, 255],
        green  : [  0, 145,   0, 255],
    };

    constructor(config){
        this.parent       = config.parent;
        this.active = false;

        // Create the print text.
        _GFX.layerObjs.createOne(PrintText, { 
            hidden: true,
            text       : ColorChanger.text, 
            x          : ColorChanger.pos.box.x, 
            y          : ColorChanger.pos.box.y, 
            layerObjKey: "color_changer_text", 
            layerKey   : "L3", 
            xyByGrid   : true,
            // settings   : { bgColorRgba: [32, 32, 32, 168] }
            settings   : { bgColorRgba: [0, 0, 0, 200] }
        });

        // Create the cursor.
        this.cursorsPosIndex = 0;
        this.framesCounter = 0;
        this.framesBeforeIndexChange = 15;
        _GFX.layerObjs.createOne(Cursor1, { 
            hidden: true,
            x           : ColorChanger.cursorsPos[this.cursorsPosIndex].x, 
            y           : ColorChanger.cursorsPos[this.cursorsPosIndex].y, 
            layerObjKey : `color_changer_cursor`, 
            layerKey    : "L4", 
            xyByGrid    : true, 
            cursorType  : 1,
            settings    : { 
                rotation: 0,
            }
        } );

        // Add the colors.
        let tmp = [
            { layerObjKey: "color_changer_yellow", x: ColorChanger.pos.yellow.x, y: ColorChanger.pos.yellow.y, tmap: this.createFillMap(3, 3, _GFX.funcs.getTilemap("bg_tiles1", "solid_yellow")[2]) },
            { layerObjKey: "color_changer_blue"  , x: ColorChanger.pos.blue.x  , y: ColorChanger.pos.blue.y  , tmap: this.createFillMap(3, 3, _GFX.funcs.getTilemap("bg_tiles1", "solid_blue")  [2]) },
            { layerObjKey: "color_changer_red"   , x: ColorChanger.pos.red.x   , y: ColorChanger.pos.red.y   , tmap: this.createFillMap(3, 3, _GFX.funcs.getTilemap("bg_tiles1", "solid_red")   [2]) },
            { layerObjKey: "color_changer_green" , x: ColorChanger.pos.green.x , y: ColorChanger.pos.green.y , tmap: this.createFillMap(3, 3, _GFX.funcs.getTilemap("bg_tiles1", "solid_green") [2]) },
        ];
        for(let rec of tmp){
            _GFX.layerObjs.createOne(LayerObject, {
                hidden: true,
                layerObjKey: rec.layerObjKey, 
                layerKey   : "L4", 
                tilesetKey : "bg_tiles1", 
                tmap       : rec.tmap, 
                x          : rec.x, 
                y          : rec.y, 
                xyByGrid: true, 
                settings: {},
                removeHashOnRemoval: true, 
                noResort: false,
            });
        }

        // Store the elems for later use.
        this.elems = {
            text   : _GFX.layerObjs.getOne("color_changer_text"),
            cursor : _GFX.layerObjs.getOne("color_changer_cursor"),
            yellow : _GFX.layerObjs.getOne("color_changer_yellow"),
            blue   : _GFX.layerObjs.getOne("color_changer_blue"),
            red    : _GFX.layerObjs.getOne("color_changer_red"),
            green  : _GFX.layerObjs.getOne("color_changer_green"),
        };

        // Set the cursor color.
        this.changeCursorColor();
    }

    // Creates a fill map using tileId and the specified width and height.
    createFillMap(w, h, tileId){
        return new Uint8Array( 
            [ w, h ]
            .concat(
                Array.from( { length: w * h }, () => tileId )
            ) )
    };

    // Unhides the LayerObjects used by this class.
    show(){
        for(let elemKey in this.elems){ this.elems[elemKey].hidden = false; }
        this.active = true;
    };

    // Hides the LayerObjects used by this class.
    hide(){
        for(let elemKey in this.elems){ this.elems[elemKey].hidden = true; }
        this.active = false;
    };

    // Accepts the color choice based on the cursorsPosIndex.color.
    accept() {
        let newColor = ColorChanger.cursorsPos[this.cursorsPosIndex].color;
        this.parent.gameBoard.setColorIndicators(this.parent.gameBoard.currentPlayer, newColor);
        this.hide();
    };

    // Horizontal movement of the cursor and color changes to the cursor.
    moveCursor(xDir) {
        // Change the cursor position.
        let color_changer_cursor = _GFX.layerObjs.getOne("color_changer_cursor");
        if(xDir == 1){
            if(1 + this.cursorsPosIndex >= ColorChanger.cursorsPos.length){ this.cursorsPosIndex = 0; }
            else{ this.cursorsPosIndex += 1;}
        }
        else if(xDir == -1){
            if(this.cursorsPosIndex -1 < 0){ this.cursorsPosIndex = ColorChanger.cursorsPos.length -1; }
            else{ this.cursorsPosIndex -= 1;}
        }
        color_changer_cursor.x = ColorChanger.cursorsPos[this.cursorsPosIndex].x;
        color_changer_cursor.y = ColorChanger.cursorsPos[this.cursorsPosIndex].y;

        // Change the cursor color.
        this.changeCursorColor();
    };

    // Changes the cursor's color.
    changeCursorColor(){
        if     (this.cursorsPosIndex == 0){ this.elems.cursor.setSetting("colorData", [ [ColorChanger.colors.white, ColorChanger.colors.yellow] ]); }
        else if(this.cursorsPosIndex == 1){ this.elems.cursor.setSetting("colorData", [ [ColorChanger.colors.white, ColorChanger.colors.blue  ] ]); }
        else if(this.cursorsPosIndex == 2){ this.elems.cursor.setSetting("colorData", [ [ColorChanger.colors.white, ColorChanger.colors.red   ] ]); }
        else if(this.cursorsPosIndex == 3){ this.elems.cursor.setSetting("colorData", [ [ColorChanger.colors.white, ColorChanger.colors.green ] ]); }
    };

    // Runs the next frame for the Cursor1 instance.
    nextFrame() {
        // Update cursor frame.
        this.elems.cursor.nextFrame();
    }
}

class Gameboard{
    static pos_colorIndicators = {
        P1: { x:8 , y:22, w: 12, h:1 , layerKey: "L1", layerObjKey: "p1ColorBar", tilesetKey: "bg_tiles1" },
        P2: { x:5 , y:8 , w: 1 , h:12, layerKey: "L1", layerObjKey: "p2ColorBar", tilesetKey: "bg_tiles1" },
        P3: { x:8 , y:5 , w: 12, h:1 , layerKey: "L1", layerObjKey: "p3ColorBar", tilesetKey: "bg_tiles1" },
        P4: { x:22, y:8 , w: 1 , h:12, layerKey: "L1", layerObjKey: "p4ColorBar", tilesetKey: "bg_tiles1" },
    };

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

        this.activePlayerKeys = [];
        this.currentColor     = "CARD_BLACK";
        this.currentDirection = "F";
        this.currentPlayer    = "P1";
        // this.currentPlayer    = ""; //"P1";

        this.createGameBoard();

        // Color indicator animation.
        this.colorIndicator_type = 0;
        this.colorIndicator_framesCount = 0;
        this.colorIndicator_framesMax = 45;
    }

    // Display in-game message.
    displayMessage(msgKey, playerKey, hide=false){
        // this.gameBoard.displayMessage("playsFirst", "P1", false);
        let pos = {
            msgBox: {
                msgBox      : { x:7, y:18, w:13 , h:3, layerKey: "L4", layerObjKey: "msgBox_text" },
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
            _GFX.layerObjs.createOne(PrintText, { 
                text: " "  , x:data.x, y:data.y, layerObjKey: data.layerObjKey, layerKey: data.layerKey, xyByGrid: true,
                settings: { bgColorRgba: [32, 32, 32, 168] }
            });   
            textKey_msgBox   = _GFX.layerObjs.getOne( pos["msgBox"].msgBox.layerObjKey   );
        }

        textKey_msgBox.x = pos["msgBox"].msgBox.x;
        textKey_msgBox.y = pos["msgBox"].msgBox.y;

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

        // Generate and store a list of active player keys.
        this.activePlayerKeys = Object.keys(this.players).filter(d=>this.players[d].active);;

        // Add the text. (For each active player.)
        // this.updatePlayerText();
    };

    // Sets the new currentPlayer based on currentPlayer and currentDirection.
    setNextPlayer(){
        // Get the active players.
        let players = Object.keys(this.players).filter(d => this.players[d].active);
        let currentPlayerIndex;

        // Get the current player index in the list of active players. 
        currentPlayerIndex = players.indexOf(this.currentPlayer);

        // Get the next player based on direction.
        let nextPlayerIndex;
        if (this.currentDirection == "F") {
            // Next index too far? Reset to 0.
            if (1 + currentPlayerIndex >= players.length) { nextPlayerIndex = 0; }
            else { nextPlayerIndex = currentPlayerIndex + 1 }
        }
        else if (this.currentDirection == "R") {
            // Next index too low? Reset to max -1.
            if (currentPlayerIndex - 1 < 0) { nextPlayerIndex = players.length - 1; }
            else { nextPlayerIndex = currentPlayerIndex - 1 }
        }

        // Set the new player.
        this.currentPlayer = players[nextPlayerIndex];
    };

    // COLOR INDICATORS
    setColorIndicators(playerKey, color){
        // Set the color value. 
        this.currentColor = color;

        // Display the active color.
        let pos = Gameboard.pos_colorIndicators;

        // Remove bars.
        _GFX.layerObjs.removeOne( pos["P1"].layerObjKey );
        _GFX.layerObjs.removeOne( pos["P2"].layerObjKey );
        _GFX.layerObjs.removeOne( pos["P3"].layerObjKey );
        _GFX.layerObjs.removeOne( pos["P4"].layerObjKey );

        // Create the bar.
        this.generateColorIndicatorBar(playerKey, 1);
    };
    generateColorIndicatorBar(playerKey, type){
        type = type ?? 1;
        let fillTile;
        if     (this.currentColor == "CARD_BLACK") { fillTile = _GFX.funcs.getTilemap("bg_tiles1", `colorFill${type+1}_black`)[2];}
        else if(this.currentColor == "CARD_YELLOW"){ fillTile = _GFX.funcs.getTilemap("bg_tiles1", `colorFill${type+1}_yellow`)[2];}
        else if(this.currentColor == "CARD_BLUE")  { fillTile = _GFX.funcs.getTilemap("bg_tiles1", `colorFill${type+1}_blue`)[2];  }
        else if(this.currentColor == "CARD_RED")   { fillTile = _GFX.funcs.getTilemap("bg_tiles1", `colorFill${type+1}_red`)[2];   }
        else if(this.currentColor == "CARD_GREEN") { fillTile = _GFX.funcs.getTilemap("bg_tiles1", `colorFill${type+1}_green`)[2]; }

        let data = Gameboard.pos_colorIndicators[playerKey];

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
    nextFrame_colorIndicators(){
        // Time to change frames?
        if(this.colorIndicator_framesCount < this.colorIndicator_framesMax){ 
            this.colorIndicator_framesCount += 1; 
        }
        else {
            // Reset the frames counter.
            this.colorIndicator_framesCount = 0;
            
            // Toggle the indictor type.
            this.colorIndicator_type = !this.colorIndicator_type;

            // Set the new tilemap.
            this.generateColorIndicatorBar(this.currentPlayer, this.colorIndicator_type);
            this._changed = true;
        }
    };

    // DIRECTION INDICATORS
    flipDirectionIndicators(){
        if     (this.currentDirection == "F"){ this.setDirectionIndicators("R");}
        else if(this.currentDirection == "R"){ this.setDirectionIndicators("F");}
    };
    setDirectionIndicators(dir){
        // _APP.shared.gameBoard.setDirectionIndicators("F");
        // _APP.shared.gameBoard.setDirectionIndicators("N");
        // _APP.shared.gameBoard.setDirectionIndicators("R");
        // console.log("this.currentDirection WAS:", this.currentDirection);
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
        // DEBUG
        else if(dir == "N"){
            _GFX.layerObjs.removeOne( "direction_tl" );
            _GFX.layerObjs.removeOne( "direction_tr" );
            _GFX.layerObjs.removeOne( "direction_bl" );
            _GFX.layerObjs.removeOne( "direction_br" );
        }

        // console.log("this.currentDirection IS NOW:", this.currentDirection);
    };

    // Update the text for each player corner.
    updatePlayerText(ignoreWinOrUno=false){
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
            if     (playerKey == "P1"){ location = "CARD_LOCATION_PLAYER1"; }
            else if(playerKey == "P2"){ location = "CARD_LOCATION_PLAYER2"; }
            else if(playerKey == "P3"){ location = "CARD_LOCATION_PLAYER3"; }
            else if(playerKey == "P4"){ location = "CARD_LOCATION_PLAYER4"; }
            let cardCount = this.parent.deck.deck.filter(d=>d.location==location).length;

            // Update "UNO" and the card count.
            if(!ignoreWinOrUno){
                if     (cardCount == 1 && _APP.game.gs2 == "playerTurn"){ textKey_uno.text   = "UNO!"; }
                else if(cardCount == 0 && _APP.game.gs2 == "playerTurn"){ textKey_uno.text   = "WIN!"; }
                else                   { 
                    // Removing an already removed object does not throw an error.
                    _GFX.layerObjs.removeOne( textKey_uno.layerObjKey );
                }
            }
            
            textKey_count.text = cardCount.toString(); // centered?
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

