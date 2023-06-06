_APP.game.gamestates["gs_JSG"] = {
    // Holds static config for this game state.
    staticConfig: {
        enums: {
            // // CARD LOCATIONS
            // CARD_LOCATION_PLAYER1 : 0,
            // CARD_LOCATION_PLAYER2 : 1,
            // CARD_LOCATION_PLAYER3 : 2,
            // CARD_LOCATION_PLAYER4 : 3,
            // CARD_LOCATION_DRAW    : 4,
            // CARD_LOCATION_DISCARD : 5,
            
            // // CARD VALUES
            // CARD_0          : 0  ,
            // CARD_1          : 1  ,
            // CARD_2          : 2  ,
            // CARD_3          : 3  ,
            // CARD_4          : 4  ,
            // CARD_5          : 5  ,
            // CARD_6          : 6  ,
            // CARD_7          : 7  ,
            // CARD_8          : 8  ,
            // CARD_9          : 9  ,
            
            // CARD_DRAW2      : 10 ,
            // CARD_SKIP       : 11 ,
            // CARD_REV        : 12 ,

            // CARD_WILD       : 13 ,
            // CARD_WILD_DRAW4 : 14 ,
            
            // // CARD COLOR
            // CARD_ORANGE : 0,
            // CARD_YELLOW : 1,
            // CARD_BLUE   : 2,
            // CARD_RED    : 3,
            // CARD_GREEN  : 4,
            // CARD_BLACK  : 5,

            // // CARDS FACE SHOWN
            // CARDS_FACEDOWN : 0,
            // CARDS_FACEUP   : 1,

            // // PLAY DIRECTION
            // FORWARD  : 0,
            // BACKWARD : 1,

            // // CARD SIZES
            // SMALL_CARD : 0,
            // LARGE_CARD : 1,

            // // PLAYER TYPES
            // NONE  : 0,
            // HUMAN : 1,
            // CPU   : 2,

            // // WIN TYPES
            // FIRSTTO500POINTS: 0 ,
            // FIRSTTO0CARDS   : 1 ,

            // // DRAW TYPES
            // DRAW1         : 0 ,
            // DRAWREPEATEDLY: 1 ,
        },
        cardCounts: {
        },

        TOTALCARDSINDECK: 108,
        cardPos: {
            p1: [ [7 ,24], [10,24], [13,24], [16,24], [19,24] ], // CARDS: p1_pos
            p2: [ [1 ,7 ], [1 ,10], [1 ,13], [1 ,16], [1 ,19] ], // CARDS: p2_pos
            p3: [ [7 ,1 ], [10,1 ], [13,1 ], [16,1 ], [19,1 ] ], // CARDS: p3_pos
            p4: [ [24,7 ], [24,10], [24,13], [24,16], [24,19] ], // CARDS: p4_pos
        },
        cardCursorsPos: {
            p1: [ [7 ,23], [10,23], [13,23], [16,23], [19,23] ], // CARD CURSORS: p1_pos_cursor
            p2: [ [4 ,7 ], [4 ,10], [4 ,13], [4 ,16], [4 ,19] ], // CARD CURSORS: p2_pos_cursor
            p3: [ [7 ,4 ], [10,4 ], [13,4 ], [16,4 ], [19,4 ] ], // CARD CURSORS: p3_pos_cursor
            p4: [ [23,7 ], [23,10], [23,13], [23,16], [23,19] ], // CARD CURSORS: p4_pos_cursor
        },
        wildCursorPos : [ [9 ,15], [12,15], [15,15], [18,15] ], // CURSORS IN WILD MENU  : wild_pos_cursor
        pauseCursorPos: [ [8 ,12], [8 ,13], [8 ,14], [8 ,15] ], // CURSORS IN PAUSE MENU : pause_pos_cursor
        drawPos         : [ 10,11 ], // Draw Pile          : draw_pos
        drawPosBelow    : [ 10,15 ], // Under Draw Pile    : draw_pos_below
        discardPos      : [ 15,11 ], // Discard Pile       : discard_pos
        discardPosBelow : [ 15,15 ], // Under Discard Pile : discard_pos_below
    },

    // Holds active configs for this game state.
    config: {
        deck: new Array (108),
    },

    // Run once upon changing to this game state.
    init: function(){
        // Clear the screen and the graphics caches.
        _GFX.funcs.clearAllLayers(true);
        _GFX.layerObjs.removeAll(_APP.game.gs1_prev);
        _GFX.layerObjs.removeAll(_APP.game.gs1);

        // _GFX.funcs.setFade("ALL", null);
        // _GFX.funcs.setFade("ALL", 0);
        // _GFX.funcs.setFade("ALL", 5);

        _GFX.funcs.updateL1BgColorRgba([0,0,84,255]);
        // _GFX.funcs.updateL1BgColorRgba( [64,64,64,255] );
        // _GFX.funcs.updateL1BgColorRgba( [8,8,8,255] );

        // Draw the board to L1.
        // _GFX.layerObjs.createOne(OLD_GameBoard, {
        //     layerObjKey: `board_28x28`, layerKey: "L1", xyByGrid: true,
        //     settings : { bgColorRgba:[128,128,0,255] }
        // });

        // Reset the deck and shuffle the deck.
        this.resetDeck();
        this.shuffleDeck();
        // this.updateUnderPiles();

        // DEBUG. 
        // this.debug_cardTest1(); // Small cards.
        // this.debug_cardTest2(); // Large cards.
        this.debug_cardTest3(); // Player cards face down.
        this.debug_cardTest4(); // Draw and discard piles.

        // Set the initial gamestate 2.
        _APP.game.changeGs2("");

        // Run the debug init.
        if(_APP.debugActive && _DEBUG2){ _DEBUG2.debugGamestate.uninit(_APP.game.gs1, _APP.game.gs2); }

        // Set the inited flag.
        this.inited = true;
    },

    // Resets the deck to it's unshuffled state with all cards in the DRAW_PILE
    resetDeck: function(){
        // WILD
        this.config.deck[0] = { location: "CARD_LOCATION_DRAW", value: "CARD_WILD", color: "CARD_BLACK" };
        this.config.deck[1] = { location: "CARD_LOCATION_DRAW", value: "CARD_WILD", color: "CARD_BLACK" };
        this.config.deck[2] = { location: "CARD_LOCATION_DRAW", value: "CARD_WILD", color: "CARD_BLACK" };
        this.config.deck[3] = { location: "CARD_LOCATION_DRAW", value: "CARD_WILD", color: "CARD_BLACK" };

        // WILD DRAW FOUR
        this.config.deck[4] = { location: "CARD_LOCATION_DRAW", value: "CARD_WILD_DRAW4", color: "CARD_BLACK" };
        this.config.deck[5] = { location: "CARD_LOCATION_DRAW", value: "CARD_WILD_DRAW4", color: "CARD_BLACK" };
        this.config.deck[6] = { location: "CARD_LOCATION_DRAW", value: "CARD_WILD_DRAW4", color: "CARD_BLACK" };
        this.config.deck[7] = { location: "CARD_LOCATION_DRAW", value: "CARD_WILD_DRAW4", color: "CARD_BLACK" };

        // YELLOW
        this.config.deck[8]  = { location: "CARD_LOCATION_DRAW", value: "CARD_0"    , color: "CARD_YELLOW" }; // CARD_0
        this.config.deck[9]  = { location: "CARD_LOCATION_DRAW", value: "CARD_1"    , color: "CARD_YELLOW" }; // CARD_1
        this.config.deck[10] = { location: "CARD_LOCATION_DRAW", value: "CARD_1"    , color: "CARD_YELLOW" }; // CARD_1
        this.config.deck[11] = { location: "CARD_LOCATION_DRAW", value: "CARD_2"    , color: "CARD_YELLOW" }; // CARD_2
        this.config.deck[12] = { location: "CARD_LOCATION_DRAW", value: "CARD_2"    , color: "CARD_YELLOW" }; // CARD_2
        this.config.deck[13] = { location: "CARD_LOCATION_DRAW", value: "CARD_3"    , color: "CARD_YELLOW" }; // CARD_3
        this.config.deck[14] = { location: "CARD_LOCATION_DRAW", value: "CARD_3"    , color: "CARD_YELLOW" }; // CARD_3
        this.config.deck[15] = { location: "CARD_LOCATION_DRAW", value: "CARD_4"    , color: "CARD_YELLOW" }; // CARD_4
        this.config.deck[16] = { location: "CARD_LOCATION_DRAW", value: "CARD_4"    , color: "CARD_YELLOW" }; // CARD_4
        this.config.deck[17] = { location: "CARD_LOCATION_DRAW", value: "CARD_5"    , color: "CARD_YELLOW" }; // CARD_5
        this.config.deck[18] = { location: "CARD_LOCATION_DRAW", value: "CARD_5"    , color: "CARD_YELLOW" }; // CARD_5
        this.config.deck[19] = { location: "CARD_LOCATION_DRAW", value: "CARD_6"    , color: "CARD_YELLOW" }; // CARD_6
        this.config.deck[20] = { location: "CARD_LOCATION_DRAW", value: "CARD_6"    , color: "CARD_YELLOW" }; // CARD_6
        this.config.deck[21] = { location: "CARD_LOCATION_DRAW", value: "CARD_7"    , color: "CARD_YELLOW" }; // CARD_7
        this.config.deck[22] = { location: "CARD_LOCATION_DRAW", value: "CARD_7"    , color: "CARD_YELLOW" }; // CARD_7
        this.config.deck[23] = { location: "CARD_LOCATION_DRAW", value: "CARD_8"    , color: "CARD_YELLOW" }; // CARD_8
        this.config.deck[24] = { location: "CARD_LOCATION_DRAW", value: "CARD_8"    , color: "CARD_YELLOW" }; // CARD_8
        this.config.deck[25] = { location: "CARD_LOCATION_DRAW", value: "CARD_9"    , color: "CARD_YELLOW" }; // CARD_9
        this.config.deck[26] = { location: "CARD_LOCATION_DRAW", value: "CARD_9"    , color: "CARD_YELLOW" }; // CARD_9
        this.config.deck[27] = { location: "CARD_LOCATION_DRAW", value: "CARD_DRAW2", color: "CARD_YELLOW" }; // CARD_DRAW2
        this.config.deck[28] = { location: "CARD_LOCATION_DRAW", value: "CARD_DRAW2", color: "CARD_YELLOW" }; // CARD_DRAW2
        this.config.deck[29] = { location: "CARD_LOCATION_DRAW", value: "CARD_SKIP" , color: "CARD_YELLOW" }; // CARD_SKIP
        this.config.deck[30] = { location: "CARD_LOCATION_DRAW", value: "CARD_SKIP" , color: "CARD_YELLOW" }; // CARD_SKIP
        this.config.deck[31] = { location: "CARD_LOCATION_DRAW", value: "CARD_REV"  , color: "CARD_YELLOW" }; // CARD_REV
        this.config.deck[32] = { location: "CARD_LOCATION_DRAW", value: "CARD_REV"  , color: "CARD_YELLOW" }; // CARD_REV
        
        // BLUE
        this.config.deck[33] = { location: "CARD_LOCATION_DRAW", value: "CARD_0"    , color: "CARD_BLUE" }; // CARD_0
        this.config.deck[34] = { location: "CARD_LOCATION_DRAW", value: "CARD_1"    , color: "CARD_BLUE" }; // CARD_1
        this.config.deck[35] = { location: "CARD_LOCATION_DRAW", value: "CARD_1"    , color: "CARD_BLUE" }; // CARD_1
        this.config.deck[36] = { location: "CARD_LOCATION_DRAW", value: "CARD_2"    , color: "CARD_BLUE" }; // CARD_2
        this.config.deck[37] = { location: "CARD_LOCATION_DRAW", value: "CARD_2"    , color: "CARD_BLUE" }; // CARD_2
        this.config.deck[38] = { location: "CARD_LOCATION_DRAW", value: "CARD_3"    , color: "CARD_BLUE" }; // CARD_3
        this.config.deck[39] = { location: "CARD_LOCATION_DRAW", value: "CARD_3"    , color: "CARD_BLUE" }; // CARD_3
        this.config.deck[40] = { location: "CARD_LOCATION_DRAW", value: "CARD_4"    , color: "CARD_BLUE" }; // CARD_4
        this.config.deck[41] = { location: "CARD_LOCATION_DRAW", value: "CARD_4"    , color: "CARD_BLUE" }; // CARD_4
        this.config.deck[42] = { location: "CARD_LOCATION_DRAW", value: "CARD_5"    , color: "CARD_BLUE" }; // CARD_5
        this.config.deck[43] = { location: "CARD_LOCATION_DRAW", value: "CARD_5"    , color: "CARD_BLUE" }; // CARD_5
        this.config.deck[44] = { location: "CARD_LOCATION_DRAW", value: "CARD_6"    , color: "CARD_BLUE" }; // CARD_6
        this.config.deck[45] = { location: "CARD_LOCATION_DRAW", value: "CARD_6"    , color: "CARD_BLUE" }; // CARD_6
        this.config.deck[46] = { location: "CARD_LOCATION_DRAW", value: "CARD_7"    , color: "CARD_BLUE" }; // CARD_7
        this.config.deck[47] = { location: "CARD_LOCATION_DRAW", value: "CARD_7"    , color: "CARD_BLUE" }; // CARD_7
        this.config.deck[48] = { location: "CARD_LOCATION_DRAW", value: "CARD_8"    , color: "CARD_BLUE" }; // CARD_8
        this.config.deck[49] = { location: "CARD_LOCATION_DRAW", value: "CARD_8"    , color: "CARD_BLUE" }; // CARD_8
        this.config.deck[50] = { location: "CARD_LOCATION_DRAW", value: "CARD_9"    , color: "CARD_BLUE" }; // CARD_9
        this.config.deck[51] = { location: "CARD_LOCATION_DRAW", value: "CARD_9"    , color: "CARD_BLUE" }; // CARD_9
        this.config.deck[52] = { location: "CARD_LOCATION_DRAW", value: "CARD_DRAW2", color: "CARD_BLUE" }; // CARD_DRAW2
        this.config.deck[53] = { location: "CARD_LOCATION_DRAW", value: "CARD_DRAW2", color: "CARD_BLUE" }; // CARD_DRAW2
        this.config.deck[54] = { location: "CARD_LOCATION_DRAW", value: "CARD_SKIP" , color: "CARD_BLUE" }; // CARD_SKIP
        this.config.deck[55] = { location: "CARD_LOCATION_DRAW", value: "CARD_SKIP" , color: "CARD_BLUE" }; // CARD_SKIP
        this.config.deck[56] = { location: "CARD_LOCATION_DRAW", value: "CARD_REV"  , color: "CARD_BLUE" }; // CARD_REV
        this.config.deck[57] = { location: "CARD_LOCATION_DRAW", value: "CARD_REV"  , color: "CARD_BLUE" }; // CARD_REV

        this.config.deck[58] = { location: "CARD_LOCATION_DRAW", value: "CARD_0"    , color: "CARD_RED" }; // CARD_0
        this.config.deck[59] = { location: "CARD_LOCATION_DRAW", value: "CARD_1"    , color: "CARD_RED" }; // CARD_1
        this.config.deck[60] = { location: "CARD_LOCATION_DRAW", value: "CARD_1"    , color: "CARD_RED" }; // CARD_1
        this.config.deck[61] = { location: "CARD_LOCATION_DRAW", value: "CARD_2"    , color: "CARD_RED" }; // CARD_2
        this.config.deck[62] = { location: "CARD_LOCATION_DRAW", value: "CARD_2"    , color: "CARD_RED" }; // CARD_2
        this.config.deck[63] = { location: "CARD_LOCATION_DRAW", value: "CARD_3"    , color: "CARD_RED" }; // CARD_3
        this.config.deck[64] = { location: "CARD_LOCATION_DRAW", value: "CARD_3"    , color: "CARD_RED" }; // CARD_3
        this.config.deck[65] = { location: "CARD_LOCATION_DRAW", value: "CARD_4"    , color: "CARD_RED" }; // CARD_4
        this.config.deck[66] = { location: "CARD_LOCATION_DRAW", value: "CARD_4"    , color: "CARD_RED" }; // CARD_4
        this.config.deck[67] = { location: "CARD_LOCATION_DRAW", value: "CARD_5"    , color: "CARD_RED" }; // CARD_5
        this.config.deck[68] = { location: "CARD_LOCATION_DRAW", value: "CARD_5"    , color: "CARD_RED" }; // CARD_5
        this.config.deck[69] = { location: "CARD_LOCATION_DRAW", value: "CARD_6"    , color: "CARD_RED" }; // CARD_6
        this.config.deck[70] = { location: "CARD_LOCATION_DRAW", value: "CARD_6"    , color: "CARD_RED" }; // CARD_6
        this.config.deck[71] = { location: "CARD_LOCATION_DRAW", value: "CARD_7"    , color: "CARD_RED" }; // CARD_7
        this.config.deck[72] = { location: "CARD_LOCATION_DRAW", value: "CARD_7"    , color: "CARD_RED" }; // CARD_7
        this.config.deck[73] = { location: "CARD_LOCATION_DRAW", value: "CARD_8"    , color: "CARD_RED" }; // CARD_8
        this.config.deck[74] = { location: "CARD_LOCATION_DRAW", value: "CARD_8"    , color: "CARD_RED" }; // CARD_8
        this.config.deck[75] = { location: "CARD_LOCATION_DRAW", value: "CARD_9"    , color: "CARD_RED" }; // CARD_9
        this.config.deck[76] = { location: "CARD_LOCATION_DRAW", value: "CARD_9"    , color: "CARD_RED" }; // CARD_9
        this.config.deck[77] = { location: "CARD_LOCATION_DRAW", value: "CARD_DRAW2", color: "CARD_RED" }; // CARD_DRAW2
        this.config.deck[78] = { location: "CARD_LOCATION_DRAW", value: "CARD_DRAW2", color: "CARD_RED" }; // CARD_DRAW2
        this.config.deck[79] = { location: "CARD_LOCATION_DRAW", value: "CARD_SKIP" , color: "CARD_RED" }; // CARD_SKIP
        this.config.deck[80] = { location: "CARD_LOCATION_DRAW", value: "CARD_SKIP" , color: "CARD_RED" }; // CARD_SKIP
        this.config.deck[81] = { location: "CARD_LOCATION_DRAW", value: "CARD_REV"  , color: "CARD_RED" }; // CARD_REV
        this.config.deck[82] = { location: "CARD_LOCATION_DRAW", value: "CARD_REV"  , color: "CARD_RED" }; // CARD_REV

        this.config.deck[83] = { location: "CARD_LOCATION_DRAW", value: "CARD_0"    , color: "CARD_GREEN" }; // CARD_0
        this.config.deck[84] = { location: "CARD_LOCATION_DRAW", value: "CARD_1"    , color: "CARD_GREEN" }; // CARD_1
        this.config.deck[85] = { location: "CARD_LOCATION_DRAW", value: "CARD_1"    , color: "CARD_GREEN" }; // CARD_1
        this.config.deck[86] = { location: "CARD_LOCATION_DRAW", value: "CARD_2"    , color: "CARD_GREEN" }; // CARD_2
        this.config.deck[87] = { location: "CARD_LOCATION_DRAW", value: "CARD_2"    , color: "CARD_GREEN" }; // CARD_2
        this.config.deck[88] = { location: "CARD_LOCATION_DRAW", value: "CARD_3"    , color: "CARD_GREEN" }; // CARD_3
        this.config.deck[89] = { location: "CARD_LOCATION_DRAW", value: "CARD_3"    , color: "CARD_GREEN" }; // CARD_3
        this.config.deck[90] = { location: "CARD_LOCATION_DRAW", value: "CARD_4"    , color: "CARD_GREEN" }; // CARD_4
        this.config.deck[91] = { location: "CARD_LOCATION_DRAW", value: "CARD_4"    , color: "CARD_GREEN" }; // CARD_4
        this.config.deck[92] = { location: "CARD_LOCATION_DRAW", value: "CARD_5"    , color: "CARD_GREEN" }; // CARD_5
        this.config.deck[93] = { location: "CARD_LOCATION_DRAW", value: "CARD_5"    , color: "CARD_GREEN" }; // CARD_5
        this.config.deck[94] = { location: "CARD_LOCATION_DRAW", value: "CARD_6"    , color: "CARD_GREEN" }; // CARD_6
        this.config.deck[95] = { location: "CARD_LOCATION_DRAW", value: "CARD_6"    , color: "CARD_GREEN" }; // CARD_6
        this.config.deck[96] = { location: "CARD_LOCATION_DRAW", value: "CARD_7"    , color: "CARD_GREEN" }; // CARD_7
        this.config.deck[97] = { location: "CARD_LOCATION_DRAW", value: "CARD_7"    , color: "CARD_GREEN" }; // CARD_7
        this.config.deck[98] = { location: "CARD_LOCATION_DRAW", value: "CARD_8"    , color: "CARD_GREEN" }; // CARD_8
        this.config.deck[99] = { location: "CARD_LOCATION_DRAW", value: "CARD_8"    , color: "CARD_GREEN" }; // CARD_8
        this.config.deck[100] ={ location: "CARD_LOCATION_DRAW", value: "CARD_9"    , color: "CARD_GREEN" }; // CARD_9
        this.config.deck[101] ={ location: "CARD_LOCATION_DRAW", value: "CARD_9"    , color: "CARD_GREEN" }; // CARD_9
        this.config.deck[102] ={ location: "CARD_LOCATION_DRAW", value: "CARD_DRAW2", color: "CARD_GREEN" }; // CARD_DRAW2
        this.config.deck[103] ={ location: "CARD_LOCATION_DRAW", value: "CARD_DRAW2", color: "CARD_GREEN" }; // CARD_DRAW2
        this.config.deck[104] ={ location: "CARD_LOCATION_DRAW", value: "CARD_SKIP" , color: "CARD_GREEN" }; // CARD_SKIP
        this.config.deck[105] ={ location: "CARD_LOCATION_DRAW", value: "CARD_SKIP" , color: "CARD_GREEN" }; // CARD_SKIP
        this.config.deck[106] ={ location: "CARD_LOCATION_DRAW", value: "CARD_REV"  , color: "CARD_GREEN" }; // CARD_REV
        this.config.deck[107] ={ location: "CARD_LOCATION_DRAW", value: "CARD_REV"  , color: "CARD_GREEN" }; // CARD_REV
    },
    shuffleDeck: function(){
        // Based on: Fisher-Yates (also known as Knuth) shuffle algorithm.
        for (let i = this.config.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.config.deck[i], this.config.deck[j]] = [this.config.deck[j], this.config.deck[i]];
        }
    },

    // Should be called by the game loop.
    // Calls debug functions specific to this gamestate.
    debug: function(){
        // console.log("DEBUG");
        // if(_APP.debugActive && _DEBUG2){ _DEBUG2.debugGamestate.run(_APP.game.gs1, _APP.game.gs2)}
    },

    // Main function of this game state. Calls other functions/handles logic, etc.
    main: function(){
        // Run init and return if this gamestate is not yet inited.
        if(!this.inited){ this.init(); return; }

        // console.log("MAIN:", _APP.game.gs1);

        // DEBUG
        // if(_APP.debugActive && _new_DEBUG){ this.debug(); }
    },

    // Draws the card on the discard pile (Only draws the card.)
    drawCardOnDiscardPile: function(value, color){
        let x4 = this.staticConfig.discardPos[0]; 
        let y4 = this.staticConfig.discardPos[1]; 
        _GFX.layerObjs.createOne(Card, {
            layerObjKey: `discardPileFaceUpCard`, layerKey: "L2", tilesetKey: "bg_tiles1",
            x: x4, y: y4, xyByGrid: true,
            settings : { xFlip: false, yFlip: false, rotation: 0, colorData:[] },
            size: "lg", value: value, color: color
        });
    },
    // Sends a card to the discard pile (does not move the card.)
    discardCard: function(cardIndex){
        // Set the card's location to the discard pile. 
        // console.log(cardIndex, this.config.deck[cardIndex]);
        this.config.deck[cardIndex].location = "CARD_LOCATION_DISCARD";

        // Update the displayed heights of the draw and discard piles.
        this.updateUnderPiles();
    },
    // Updates the displayed heights of the draw and discard piles. 
    updateUnderPiles: function(){
        return;
        let offBlackTile = _GFX.funcs.getTilemap("bg_tiles1", "offBlackTile")[2];

        // DRAW PILE
        let x_draw = this.staticConfig.drawPosBelow[0]; 
        let y_draw = this.staticConfig.drawPosBelow[1]; 
        let tmap_draw;
        let drawPileCount = this.config.deck.filter(d=>d.location=="CARD_LOCATION_DRAW").length;
        if     (drawPileCount == 0  ) { tmap_draw = [ 3,1, offBlackTile, offBlackTile, offBlackTile ];}
        else if(drawPileCount <  27 ) { tmap_draw = _GFX.funcs.getTilemap("bg_tiles1", "cardsBelow_lg_lt27"); }
        else if(drawPileCount <  54 ) { tmap_draw = _GFX.funcs.getTilemap("bg_tiles1", "cardsBelow_lg_lt54"); }
        else if(drawPileCount <  81 ) { tmap_draw = _GFX.funcs.getTilemap("bg_tiles1", "cardsBelow_lg_lt81"); }
        else                          { tmap_draw = _GFX.funcs.getTilemap("bg_tiles1", "cardsBelow_lg_lt108"); }
        _GFX.layerObjs.createOne(LayerObject, {
            layerObjKey: "drawPileHeight", layerKey: "L2", tilesetKey: "bg_tiles1",
            tmap: tmap_draw,
            x: x_draw*8, y: y_draw*8, 
            settings : {
                xFlip: false, yFlip: false, rotation: 0, colorData:[]
            }
        });

        // DISCARD PILE
        let x_discard = this.staticConfig.discardPosBelow[0]; 
        let y_discard = this.staticConfig.discardPosBelow[1]; 
        let tmap_discard;
        let discardPileCount = this.config.deck.filter(d=>d.location=="CARD_LOCATION_DISCARD").length;
        if     (discardPileCount == 0  ) { tmap_discard = [ 3,1, offBlackTile, offBlackTile, offBlackTile ];}
        else if(discardPileCount <  27 ) { tmap_discard = _GFX.funcs.getTilemap("bg_tiles1", "cardsBelow_lg_lt27"); }
        else if(discardPileCount <  54 ) { tmap_discard = _GFX.funcs.getTilemap("bg_tiles1", "cardsBelow_lg_lt54"); }
        else if(discardPileCount <  81 ) { tmap_discard = _GFX.funcs.getTilemap("bg_tiles1", "cardsBelow_lg_lt81"); }
        else                             { tmap_discard = _GFX.funcs.getTilemap("bg_tiles1", "cardsBelow_lg_lt108"); }
        _GFX.layerObjs.createOne(LayerObject, {
            layerObjKey: "discardPileHeight", layerKey: "L2", tilesetKey: "bg_tiles1",
            tmap: tmap_discard,
            x: x_discard*8, y: y_discard*8, 
            settings : {
                xFlip: false, yFlip: false, rotation: 0, colorData:[]
            }
        });

        // Update top card on the draw pile. (Only draws the card.)
        this.updateDrawPileTopCard(drawPileCount);

        // console.log("drawPileCount   :", drawPileCount);
        // console.log("discardPileCount:", discardPileCount);
    },
    // Either draws or removes the displayed card based on drawPileCount.
    updateDrawPileTopCard: function(drawPileCount=null){
        return;
        let x = this.staticConfig.drawPos[0]; 
        let y = this.staticConfig.drawPos[1]; 

        // If a count was not provided then get a count here.
        if(drawPileCount === null){ drawPileCount = this.config.deck.filter(d=>d.location=="CARD_LOCATION_DRAW").length; }
        // console.log("updateDrawPileTopCard: drawPileCount   :", drawPileCount);

        let offBlackTile = _GFX.funcs.getTilemap("bg_tiles1", "offBlackTile")[2];
        let tmap_draw;
        if(drawPileCount){
            tmap_draw = _GFX.funcs.getTilemap("bg_tiles1", "card_back_lg");
        }
        else{
            tmap_draw = _GFX.funcs.getTilemap("bg_tiles1", "card_back_lg");
            for (let i = 2; i < tmap_draw.length; i++) {
                tmap_draw[i] = offBlackTile;
            }
        }

        // Draw. 
        _GFX.layerObjs.createOne(LayerObject, {
            layerObjKey: "drawPileFaceDownCard", layerKey: "L2", tilesetKey: "bg_tiles1",
            tmap: tmap_draw,
            x: x*8, y: y*8, 
            settings : {
                xFlip: false, yFlip: false, rotation: 0, colorData:[]
            }
        });
    },


    // Displays all the SMALL card types (no repeats.)
    debug_cardTest1: function(){
        let colors = [
            "CARD_BLACK",
            "CARD_BACK",
            "CARD_YELLOW",
            "CARD_BLUE",
            "CARD_RED",
            "CARD_GREEN",
        ];
        let values = [
            "CARD_0",
            "CARD_1",
            "CARD_2",
            "CARD_3",
            "CARD_4",
            "CARD_5",
            "CARD_6",
            "CARD_7",
            "CARD_8",
            "CARD_9",
            "CARD_DRAW2",
            "CARD_SKIP",
            "CARD_REV",
        ];
        let x=0;
        let y=4;
        for(let c=0; c<colors.length; c+=1){
            let color = colors[c];
            if(color=="CARD_BLACK"){
                _GFX.layerObjs.createOne(Card, {
                    layerObjKey: `debug_${color}_WILD`, layerKey: "L2", tilesetKey: "bg_tiles1",
                    x: 0, y: 0, xyByGrid: true,
                    settings : { xFlip: false, yFlip: false, rotation: 0, colorData:[] },
                    size: "sm", value: "CARD_WILD", color: color
                });
                _GFX.layerObjs.createOne(Card, {
                    layerObjKey: `debug_${color}_CARD_WILD_DRAW4`, layerKey: "L2", tilesetKey: "bg_tiles1",
                    x: 2, y: 0, xyByGrid: true,
                    settings : { xFlip: false, yFlip: false, rotation: 0, colorData:[] },
                    size: "sm", value: "CARD_WILD_DRAW4", color: color
                });
            }
            else if(color=="CARD_BACK"){
                _GFX.layerObjs.createOne(Card, {
                    layerObjKey: `debug_${color}_card_back_sm_0deg`, layerKey: "L2", tilesetKey: "bg_tiles1",
                    x: 4, y: 0, xyByGrid: true, 
                    settings : { xFlip: false, yFlip: false, rotation: 0, colorData:[] },
                    size: "sm", value: "CARD_BACK", color: color
                });
            }
            else{
                for(let v=0; v<values.length; v+=1){
                    let value = values[v];
                    _GFX.layerObjs.createOne(Card, {
                        layerObjKey: `debug_${color}_${value}`, layerKey: "L2", tilesetKey: "bg_tiles1",
                        x: x, y: y, xyByGrid: true,
                        settings : { xFlip: false, yFlip: false, rotation: 0, colorData:[] },
                        size: "sm", value: value, color: color
                    });
                    x+=2;
                }
                x=0;
                y+=4;
            }
        }
    },
    // Displays the LARGE card types (no repeats.)
    debug_cardTest2: function(){
        let colors = [
            "CARD_BLACK",
            "CARD_BACK",
            "CARD_YELLOW",
            "CARD_BLUE",
            "CARD_RED",
            "CARD_GREEN",
        ];
        let values = [
            "CARD_0",
            "CARD_1",
            "CARD_2",
            "CARD_3",
            "CARD_4",
            "CARD_5",
            "CARD_6",
            "CARD_7",
            "CARD_8",
            "CARD_9",
            "CARD_DRAW2",
            "CARD_SKIP",
            "CARD_REV",
        ];
        let x=0;
        let y=4;
        for(let c=0; c<colors.length; c+=1){
            let color = colors[c];
            if(color=="CARD_BLACK"){
                _GFX.layerObjs.createOne(Card, {
                    layerObjKey: `debug_large_${color}_WILD`, layerKey: "L2", tilesetKey: "bg_tiles1",
                    x: 0, y: 0, xyByGrid: true,
                    settings : { xFlip: false, yFlip: false, rotation: 0, colorData:[] },
                    size: "lg", value: "CARD_WILD", color: color
                });
                _GFX.layerObjs.createOne(Card, {
                    layerObjKey: `debug_large_${color}_CARD_WILD_DRAW4`, layerKey: "L2", tilesetKey: "bg_tiles1",
                    x: 3, y: 0, xyByGrid: true,
                    settings : { xFlip: false, yFlip: false, rotation: 0, colorData:[] },
                    size: "lg", value: "CARD_WILD_DRAW4", color: color
                });
            }
            else if(color=="CARD_BACK"){
                _GFX.layerObjs.createOne(Card, {
                    layerObjKey: `debug_large_${color}_card_back_lg`, layerKey: "L2", tilesetKey: "bg_tiles1",
                    x: 6, y: 0, xyByGrid: true,
                    settings : { xFlip: false, yFlip: false, rotation: 0, colorData:[] },
                    size: "lg", value: "card_back_lg", color: color
                });
            }
            else{
                // First portion...
                for(let v=0; v<9; v+=1){
                    let value = values[v];
                    _GFX.layerObjs.createOne(Card, {
                        layerObjKey: `debug_large_${color}_${value}`, layerKey: "L2", tilesetKey: "bg_tiles1",
                        x: x, y: y, xyByGrid: true,
                        settings : { xFlip: false, yFlip: false, rotation: 0, colorData:[] },
                        size: "lg", value: value, color: color
                    });
                    x+=3;
                }

                // Second portion...
                x=0;
                y+=4;
                for(let v=9; v<values.length; v+=1){
                    let value = values[v];
                    _GFX.layerObjs.createOne(Card, {
                        layerObjKey: `debug_large_${color}_${value}`, layerKey: "L2", tilesetKey: "bg_tiles1",
                        x: x, y: y, xyByGrid: true,
                        settings : { xFlip: false, yFlip: false, rotation: 0, colorData:[] },
                        size: "lg", value: value, color: color
                    });
                    x+=3;
                }

                // Reset x, increment y for the next color values.
                x=0;
                y+=4;
            }
        }
    },
    // Displays cards in their player positions face down.
    debug_cardTest3: function(){
        // let p1 = this.staticConfig.cardPos["p1"];
        // let p2 = this.staticConfig.cardPos["p2"];
        // let p3 = this.staticConfig.cardPos["p3"];
        // let p4 = this.staticConfig.cardPos["p4"];

        for(let playerKey in this.staticConfig.cardPos){
            let pos = this.staticConfig.cardPos[playerKey];
            
            for(let p=0; p<pos.length; p+=1){
                let x = pos[p][0];
                let y = pos[p][1];
                let rotation;
                if     (playerKey=="p1"){ rotation = 0;   }
                else if(playerKey=="p2"){ rotation = 90;  }
                else if(playerKey=="p3"){ rotation = 180; }
                else if(playerKey=="p4"){ rotation = -90; }

                _GFX.layerObjs.createOne(Card, {
                    layerObjKey: `${playerKey}_card_${p}`, layerKey: "L2", tilesetKey: "bg_tiles1",
                    x: x, y: y, xyByGrid: true,
                    settings : { xFlip: false, yFlip: false, rotation: rotation, colorData:[] },
                    size: "sm", value: "CARD_BACK", color: "CARD_BLACK"
                });
            }
        }

    },
    // Displays the draw pile and cards for discard and draw piles.
    debug_cardTest4: function(){
        // Add the draw pile card face-down.
        this.updateUnderPiles();
        this.updateDrawPileTopCard();

        // Find the first matching card and get it's index in the deck array.
        let cardIndex = this.config.deck.findIndex(d=>{
            return d.location == "CARD_LOCATION_DRAW" && d.value == "CARD_2" && d.color == "CARD_YELLOW";
            // return d.location == "CARD_LOCATION_PLAYER1" && d.value == "CARD_2" && d.color == "CARD_YELLOW";
        });

        // Draw the discarded card on the discard pile. 
        this.drawCardOnDiscardPile("CARD_2", "CARD_YELLOW");

        // Update the card to be discarded.
        this.discardCard(cardIndex);

        // this.config.deck[cardIndex].location = "CARD_LOCATION_DISCARD";
    },
};