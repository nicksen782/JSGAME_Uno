_APP.game.gamestates["gs_PLAYING"] = {
    gameSettings: {
        P1  : "HUMAN",
        P2  : "HUMAN",
        P3  : "NONE",
        P4  : "NONE",
        WIN : "atZeroCards", // ["at500pts", "atZeroCards"]
        DRAW: "one",         // ["one", "until"]
        
        P1_SCORE: 0,
        P2_SCORE: 0,
        P3_SCORE: 0,
        P4_SCORE: 0,
    },
    gameBoard:{
        parent: null,
        currentColor: "CARD_BLACK",
        currentDirection: "F",
        currentPlayer: "P1",
        players: {
            P1: { active:false },
            P2: { active:false },
            P3: { active:false },
            P4: { active:false },
        },

        setCurrentPlayer: function(playerKey){
            // Set the playerKey value. 
            this.currentPlayer = playerKey;

            // Show the active player indicator.
            //
        },
        setColorIndicators: function(color){
            // Set the color value. 
            this.currentColor = color;

            // Display the active color.
            //
        },
        setDirectionIndicators: function(dir){
            // _APP.shared.gameBoard.setDirectionIndicators("F");
            // _APP.shared.gameBoard.setDirectionIndicators("R");
            if(dir == "F"){
                _GFX.layerObjs.updateOne(LayerObject, { tmap: _GFX.funcs.getTilemap("bg_tiles1", "directionF_tl"), x:5, y:5, layerObjKey: `direction_tl`, layerKey: "L1", tilesetKey: "bg_tiles1", xyByGrid: true });
                _GFX.layerObjs.updateOne(LayerObject, { tmap: _GFX.funcs.getTilemap("bg_tiles1", "directionF_tr"), x:20, y:5, layerObjKey: `direction_tr`, layerKey: "L1", tilesetKey: "bg_tiles1", xyByGrid: true });
                _GFX.layerObjs.updateOne(LayerObject, { tmap: _GFX.funcs.getTilemap("bg_tiles1", "directionF_bl"), x:5, y:20, layerObjKey: `direction_bl`, layerKey: "L1", tilesetKey: "bg_tiles1", xyByGrid: true });
                _GFX.layerObjs.updateOne(LayerObject, { tmap: _GFX.funcs.getTilemap("bg_tiles1", "directionF_br"), x:20, y:20, layerObjKey: `direction_br`, layerKey: "L1", tilesetKey: "bg_tiles1", xyByGrid: true });

                this.currentDirection = dir;
            }
            else if(dir == "R"){
                _GFX.layerObjs.updateOne(LayerObject, { tmap: _GFX.funcs.getTilemap("bg_tiles1", "directionR_tl"), x:5, y:5, layerObjKey: `direction_tl`, layerKey: "L1", tilesetKey: "bg_tiles1", xyByGrid: true });
                _GFX.layerObjs.updateOne(LayerObject, { tmap: _GFX.funcs.getTilemap("bg_tiles1", "directionR_tr"), x:20, y:5, layerObjKey: `direction_tr`, layerKey: "L1", tilesetKey: "bg_tiles1", xyByGrid: true });
                _GFX.layerObjs.updateOne(LayerObject, { tmap: _GFX.funcs.getTilemap("bg_tiles1", "directionR_bl"), x:5, y:20, layerObjKey: `direction_bl`, layerKey: "L1", tilesetKey: "bg_tiles1", xyByGrid: true });
                _GFX.layerObjs.updateOne(LayerObject, { tmap: _GFX.funcs.getTilemap("bg_tiles1", "directionR_br"), x:20, y:20, layerObjKey: `direction_br`, layerKey: "L1", tilesetKey: "bg_tiles1", xyByGrid: true });

                this.currentDirection = dir;
            }
        },
        updatePlayerText: function(playerKey, clear=false){
            let pos = {
                P1: {
                    uno  : { x:23, y:24, w:0 , h:0, layerKey: "L1", layerObjKey: "p1Text_uno"   },
                    name : { x:23, y:25, w:0 , h:0, layerKey: "L1", layerObjKey: "p1Text_name"  },
                    cards: { x:23, y:26, w:0 , h:0, layerKey: "L1", layerObjKey: "p1Text_cards" },
                    count: { x:23, y:27, w:0 , h:0, layerKey: "L1", layerObjKey: "p1Text_count" },
                },
                P2: {
                    uno  : { x:0, y:24, w:0 , h:0, layerKey: "L1", layerObjKey: "p2Text_uno"   },
                    name : { x:0, y:25, w:0 , h:0, layerKey: "L1", layerObjKey: "p2Text_name"  },
                    cards: { x:0, y:26, w:0 , h:0, layerKey: "L1", layerObjKey: "p2Text_cards" },
                    count: { x:0, y:27, w:0 , h:0, layerKey: "L1", layerObjKey: "p2Text_count" },
                },
                P3: {
                    name : { x:0, y:0, w:0 , h:0, layerKey: "L1", layerObjKey: "p3Text_name"  },
                    cards: { x:0, y:1, w:0 , h:0, layerKey: "L1", layerObjKey: "p3Text_cards" },
                    count: { x:0, y:2, w:0 , h:0, layerKey: "L1", layerObjKey: "p3Text_count" },
                    uno  : { x:0, y:3, w:0 , h:0, layerKey: "L1", layerObjKey: "p3Text_uno"   },
                },
                P4: {
                    name : { x:23, y:0, w:0 , h:0, layerKey: "L1", layerObjKey: "p4Text_name"  },
                    cards: { x:23, y:1, w:0 , h:0, layerKey: "L1", layerObjKey: "p4Text_cards" },
                    count: { x:23, y:2, w:0 , h:0, layerKey: "L1", layerObjKey: "p4Text_count" },
                    uno  : { x:23, y:3, w:0 , h:0, layerKey: "L1", layerObjKey: "p4Text_uno"   },
                },
            };

            // Try to access.
            let textKey_uno   = _GFX.layerObjs.getOne( pos[playerKey].uno.layerObjKey   );
            let textKey_name  = _GFX.layerObjs.getOne( pos[playerKey].name.layerObjKey  );
            let textKey_count = _GFX.layerObjs.getOne( pos[playerKey].count.layerObjKey );
            let textKey_cards = _GFX.layerObjs.getOne( pos[playerKey].cards.layerObjKey );
            
            // If not found then create it.
            let data;
            if(!textKey_uno)  { 
                data = pos[playerKey].uno;
                console.log("Adding uno:", playerKey, data);
                _GFX.layerObjs.updateOne(PrintText, { text: "    "  , x:data.x, y:data.y, layerObjKey: data.layerObjKey, layerKey: data.layerKey, xyByGrid: true });   
                textKey_uno   = _GFX.layerObjs.getOne( pos[playerKey].uno.layerObjKey   );
            }
            if(!textKey_name) { 
                data = pos[playerKey].name;
                _GFX.layerObjs.updateOne(PrintText, { text: playerKey  , x:data.x, y:data.y, layerObjKey: data.layerObjKey, layerKey: data.layerKey, xyByGrid: true });  
                textKey_name  = _GFX.layerObjs.getOne( pos[playerKey].name.layerObjKey  );
            }
            if(!textKey_count){ 
                data = pos[playerKey].count;
                _GFX.layerObjs.updateOne(PrintText, { text: "  10  "  , x:data.x, y:data.y, layerObjKey: data.layerObjKey, layerKey: data.layerKey, xyByGrid: true }); 
                textKey_count = _GFX.layerObjs.getOne( pos[playerKey].count.layerObjKey );
            }
            if(!textKey_cards){ 
                data = pos[playerKey].cards;
                _GFX.layerObjs.updateOne(PrintText, { text: "CARDS"  , x:data.x, y:data.y, layerObjKey: data.layerObjKey, layerKey: data.layerKey, xyByGrid: true }); 
                textKey_cards = _GFX.layerObjs.getOne( pos[playerKey].cards.layerObjKey );
            }

            // Get the card count for the player.
            let location;
            if     (playerKey == 1){ location = CARD_LOCATION_PLAYER1; }
            else if(playerKey == 2){ location = CARD_LOCATION_PLAYER2; }
            else if(playerKey == 3){ location = CARD_LOCATION_PLAYER3; }
            else if(playerKey == 4){ location = CARD_LOCATION_PLAYER4; }
            // let cardCount =  5; //_APP.game.gamestates["gs_PLAYING"].config.deck.filter(d=>d.location==location).length;
            let cardCount = this.parent.deck.filter(d=>d.location==location).length;

            // Update "UNO" and the card count.
            if     (cardCount == 1){ textKey_uno.text   = "UNO!"; }
            // else if(cardCount == 0){ textKey_uno.text   = "WIN!"; }
            else                   { textKey_uno.text   = "    "; }
            
            textKey_count.text = cardCount.toString(); // centered
            textKey_name .text = playerKey;
            textKey_cards.text = "CARDS";

            textKey_uno.changed = true; 
            textKey_count.changed = true; 
            textKey_name.changed = true; 
            textKey_cards.changed = true; 
        },
        createGameBoard: function(){
            let pos = {
                centerBorder: { x:5 , y:5 , w:18, h:18 },
                p1Border    : { x:6 , y:23, w:16, h:5  },
                p2Border    : { x:0 , y:6 , w:5 , h:16 },
                p3Border    : { x:6 , y:0 , w:16, h:5  },
                p4Border    : { x:23, y:6 , w:5 , h:16 },
                drawBorder  : { x:9 , y:10, w:5 , h:7  },
                discBorder  : { x:15, y:10, w:5 , h:7  },
            };

            // border/fill: center
            _APP.shared.border.createBorder1({
                x:pos.centerBorder.x, y:pos.centerBorder.y, w: pos.centerBorder.w, h: pos.centerBorder.h, 
                layerObjKey: `cBorder`, layerKey: "L1", xyByGrid: true, tilesetKey: "bg_tiles1", 
                fill: true, fillTile: _GFX.funcs.getTilemap("bg_tiles1", "border2_row")[2], borderType: 2 
            });

            // Border/fill: player 1
            _APP.shared.border.createBorder1({
                x:pos.p1Border.x, y:pos.p1Border.y, w: pos.p1Border.w, h: pos.p1Border.h, 
                layerObjKey: `p1Border`, layerKey: "L1", xyByGrid: true, tilesetKey: "bg_tiles1",
                fill: true, fillTile: _GFX.funcs.getTilemap("bg_tiles1", "wood2")[2], borderType: 1 
            });
            
            // Border/fill: player 2
            _APP.shared.border.createBorder1({
                x:pos.p2Border.x, y:pos.p2Border.y, w: pos.p2Border.w, h: pos.p2Border.h, 
                layerObjKey: `p2Border`, layerKey: "L1", xyByGrid: true, tilesetKey: "bg_tiles1",
                fill: true, fillTile: _GFX.funcs.getTilemap("bg_tiles1", "wood2")[2], borderType: 1 
            });
            
            // Border/fill: player 3
            _APP.shared.border.createBorder1({
                x:pos.p3Border.x, y:pos.p3Border.y, w: pos.p3Border.w, h: pos.p3Border.h, 
                layerObjKey: `p3Border`, layerKey: "L1", xyByGrid: true, tilesetKey: "bg_tiles1",
                fill: true, fillTile: _GFX.funcs.getTilemap("bg_tiles1", "wood2")[2], borderType: 1 
            });
            
            // Border/fill: player 4
            _APP.shared.border.createBorder1({
                x:pos.p4Border.x, y:pos.p4Border.y, w: pos.p4Border.w, h: pos.p4Border.h, 
                layerObjKey: `p4Border`, layerKey: "L1", xyByGrid: true, tilesetKey: "bg_tiles1",
                fill: true, fillTile: _GFX.funcs.getTilemap("bg_tiles1", "wood2")[2], borderType: 1 
            });

            // Border/fill: draw pile
            _APP.shared.border.createBorder1({
                x:pos.drawBorder.x, y:pos.drawBorder.y, w: pos.drawBorder.w, h: pos.drawBorder.h, 
                layerObjKey: `drapBorder`, layerKey: "L1", xyByGrid: true, tilesetKey: "bg_tiles1",
                fill: true, fillTile: _GFX.funcs.getTilemap("bg_tiles1", "wood2")[2], borderType: 1 
            });
            
            // Border/fill: discard pile
            _APP.shared.border.createBorder1({
                x:pos.discBorder.x, y:pos.discBorder.y, w: pos.discBorder.w, h: pos.discBorder.h, 
                layerObjKey: `dispBorder`, layerKey: "L1", xyByGrid: true, tilesetKey: "bg_tiles1",
                fill: true, fillTile: _GFX.funcs.getTilemap("bg_tiles1", "wood2")[2], borderType: 1 
            });
        }
    },

    // The deck (every card.)
    deck: new Array(108), 
    // Resets the deck to it's unshuffled state with all cards in the DRAW_PILE
    resetDeck: function(){
        // WILD
        this.deck[0] = { location: "CARD_LOCATION_DRAW", value: "CARD_WILD", color: "CARD_BLACK" };
        this.deck[1] = { location: "CARD_LOCATION_DRAW", value: "CARD_WILD", color: "CARD_BLACK" };
        this.deck[2] = { location: "CARD_LOCATION_DRAW", value: "CARD_WILD", color: "CARD_BLACK" };
        this.deck[3] = { location: "CARD_LOCATION_DRAW", value: "CARD_WILD", color: "CARD_BLACK" };

        // WILD DRAW FOUR
        this.deck[4] = { location: "CARD_LOCATION_DRAW", value: "CARD_WILD_DRAW4", color: "CARD_BLACK" };
        this.deck[5] = { location: "CARD_LOCATION_DRAW", value: "CARD_WILD_DRAW4", color: "CARD_BLACK" };
        this.deck[6] = { location: "CARD_LOCATION_DRAW", value: "CARD_WILD_DRAW4", color: "CARD_BLACK" };
        this.deck[7] = { location: "CARD_LOCATION_DRAW", value: "CARD_WILD_DRAW4", color: "CARD_BLACK" };

        // YELLOW
        this.deck[8]  = { location: "CARD_LOCATION_DRAW", value: "CARD_0"    , color: "CARD_YELLOW" }; // CARD_0
        this.deck[9]  = { location: "CARD_LOCATION_DRAW", value: "CARD_1"    , color: "CARD_YELLOW" }; // CARD_1
        this.deck[10] = { location: "CARD_LOCATION_DRAW", value: "CARD_1"    , color: "CARD_YELLOW" }; // CARD_1
        this.deck[11] = { location: "CARD_LOCATION_DRAW", value: "CARD_2"    , color: "CARD_YELLOW" }; // CARD_2
        this.deck[12] = { location: "CARD_LOCATION_DRAW", value: "CARD_2"    , color: "CARD_YELLOW" }; // CARD_2
        this.deck[13] = { location: "CARD_LOCATION_DRAW", value: "CARD_3"    , color: "CARD_YELLOW" }; // CARD_3
        this.deck[14] = { location: "CARD_LOCATION_DRAW", value: "CARD_3"    , color: "CARD_YELLOW" }; // CARD_3
        this.deck[15] = { location: "CARD_LOCATION_DRAW", value: "CARD_4"    , color: "CARD_YELLOW" }; // CARD_4
        this.deck[16] = { location: "CARD_LOCATION_DRAW", value: "CARD_4"    , color: "CARD_YELLOW" }; // CARD_4
        this.deck[17] = { location: "CARD_LOCATION_DRAW", value: "CARD_5"    , color: "CARD_YELLOW" }; // CARD_5
        this.deck[18] = { location: "CARD_LOCATION_DRAW", value: "CARD_5"    , color: "CARD_YELLOW" }; // CARD_5
        this.deck[19] = { location: "CARD_LOCATION_DRAW", value: "CARD_6"    , color: "CARD_YELLOW" }; // CARD_6
        this.deck[20] = { location: "CARD_LOCATION_DRAW", value: "CARD_6"    , color: "CARD_YELLOW" }; // CARD_6
        this.deck[21] = { location: "CARD_LOCATION_DRAW", value: "CARD_7"    , color: "CARD_YELLOW" }; // CARD_7
        this.deck[22] = { location: "CARD_LOCATION_DRAW", value: "CARD_7"    , color: "CARD_YELLOW" }; // CARD_7
        this.deck[23] = { location: "CARD_LOCATION_DRAW", value: "CARD_8"    , color: "CARD_YELLOW" }; // CARD_8
        this.deck[24] = { location: "CARD_LOCATION_DRAW", value: "CARD_8"    , color: "CARD_YELLOW" }; // CARD_8
        this.deck[25] = { location: "CARD_LOCATION_DRAW", value: "CARD_9"    , color: "CARD_YELLOW" }; // CARD_9
        this.deck[26] = { location: "CARD_LOCATION_DRAW", value: "CARD_9"    , color: "CARD_YELLOW" }; // CARD_9
        this.deck[27] = { location: "CARD_LOCATION_DRAW", value: "CARD_DRAW2", color: "CARD_YELLOW" }; // CARD_DRAW2
        this.deck[28] = { location: "CARD_LOCATION_DRAW", value: "CARD_DRAW2", color: "CARD_YELLOW" }; // CARD_DRAW2
        this.deck[29] = { location: "CARD_LOCATION_DRAW", value: "CARD_SKIP" , color: "CARD_YELLOW" }; // CARD_SKIP
        this.deck[30] = { location: "CARD_LOCATION_DRAW", value: "CARD_SKIP" , color: "CARD_YELLOW" }; // CARD_SKIP
        this.deck[31] = { location: "CARD_LOCATION_DRAW", value: "CARD_REV"  , color: "CARD_YELLOW" }; // CARD_REV
        this.deck[32] = { location: "CARD_LOCATION_DRAW", value: "CARD_REV"  , color: "CARD_YELLOW" }; // CARD_REV
        
        // BLUE
        this.deck[33] = { location: "CARD_LOCATION_DRAW", value: "CARD_0"    , color: "CARD_BLUE" }; // CARD_0
        this.deck[34] = { location: "CARD_LOCATION_DRAW", value: "CARD_1"    , color: "CARD_BLUE" }; // CARD_1
        this.deck[35] = { location: "CARD_LOCATION_DRAW", value: "CARD_1"    , color: "CARD_BLUE" }; // CARD_1
        this.deck[36] = { location: "CARD_LOCATION_DRAW", value: "CARD_2"    , color: "CARD_BLUE" }; // CARD_2
        this.deck[37] = { location: "CARD_LOCATION_DRAW", value: "CARD_2"    , color: "CARD_BLUE" }; // CARD_2
        this.deck[38] = { location: "CARD_LOCATION_DRAW", value: "CARD_3"    , color: "CARD_BLUE" }; // CARD_3
        this.deck[39] = { location: "CARD_LOCATION_DRAW", value: "CARD_3"    , color: "CARD_BLUE" }; // CARD_3
        this.deck[40] = { location: "CARD_LOCATION_DRAW", value: "CARD_4"    , color: "CARD_BLUE" }; // CARD_4
        this.deck[41] = { location: "CARD_LOCATION_DRAW", value: "CARD_4"    , color: "CARD_BLUE" }; // CARD_4
        this.deck[42] = { location: "CARD_LOCATION_DRAW", value: "CARD_5"    , color: "CARD_BLUE" }; // CARD_5
        this.deck[43] = { location: "CARD_LOCATION_DRAW", value: "CARD_5"    , color: "CARD_BLUE" }; // CARD_5
        this.deck[44] = { location: "CARD_LOCATION_DRAW", value: "CARD_6"    , color: "CARD_BLUE" }; // CARD_6
        this.deck[45] = { location: "CARD_LOCATION_DRAW", value: "CARD_6"    , color: "CARD_BLUE" }; // CARD_6
        this.deck[46] = { location: "CARD_LOCATION_DRAW", value: "CARD_7"    , color: "CARD_BLUE" }; // CARD_7
        this.deck[47] = { location: "CARD_LOCATION_DRAW", value: "CARD_7"    , color: "CARD_BLUE" }; // CARD_7
        this.deck[48] = { location: "CARD_LOCATION_DRAW", value: "CARD_8"    , color: "CARD_BLUE" }; // CARD_8
        this.deck[49] = { location: "CARD_LOCATION_DRAW", value: "CARD_8"    , color: "CARD_BLUE" }; // CARD_8
        this.deck[50] = { location: "CARD_LOCATION_DRAW", value: "CARD_9"    , color: "CARD_BLUE" }; // CARD_9
        this.deck[51] = { location: "CARD_LOCATION_DRAW", value: "CARD_9"    , color: "CARD_BLUE" }; // CARD_9
        this.deck[52] = { location: "CARD_LOCATION_DRAW", value: "CARD_DRAW2", color: "CARD_BLUE" }; // CARD_DRAW2
        this.deck[53] = { location: "CARD_LOCATION_DRAW", value: "CARD_DRAW2", color: "CARD_BLUE" }; // CARD_DRAW2
        this.deck[54] = { location: "CARD_LOCATION_DRAW", value: "CARD_SKIP" , color: "CARD_BLUE" }; // CARD_SKIP
        this.deck[55] = { location: "CARD_LOCATION_DRAW", value: "CARD_SKIP" , color: "CARD_BLUE" }; // CARD_SKIP
        this.deck[56] = { location: "CARD_LOCATION_DRAW", value: "CARD_REV"  , color: "CARD_BLUE" }; // CARD_REV
        this.deck[57] = { location: "CARD_LOCATION_DRAW", value: "CARD_REV"  , color: "CARD_BLUE" }; // CARD_REV

        this.deck[58] = { location: "CARD_LOCATION_DRAW", value: "CARD_0"    , color: "CARD_RED" }; // CARD_0
        this.deck[59] = { location: "CARD_LOCATION_DRAW", value: "CARD_1"    , color: "CARD_RED" }; // CARD_1
        this.deck[60] = { location: "CARD_LOCATION_DRAW", value: "CARD_1"    , color: "CARD_RED" }; // CARD_1
        this.deck[61] = { location: "CARD_LOCATION_DRAW", value: "CARD_2"    , color: "CARD_RED" }; // CARD_2
        this.deck[62] = { location: "CARD_LOCATION_DRAW", value: "CARD_2"    , color: "CARD_RED" }; // CARD_2
        this.deck[63] = { location: "CARD_LOCATION_DRAW", value: "CARD_3"    , color: "CARD_RED" }; // CARD_3
        this.deck[64] = { location: "CARD_LOCATION_DRAW", value: "CARD_3"    , color: "CARD_RED" }; // CARD_3
        this.deck[65] = { location: "CARD_LOCATION_DRAW", value: "CARD_4"    , color: "CARD_RED" }; // CARD_4
        this.deck[66] = { location: "CARD_LOCATION_DRAW", value: "CARD_4"    , color: "CARD_RED" }; // CARD_4
        this.deck[67] = { location: "CARD_LOCATION_DRAW", value: "CARD_5"    , color: "CARD_RED" }; // CARD_5
        this.deck[68] = { location: "CARD_LOCATION_DRAW", value: "CARD_5"    , color: "CARD_RED" }; // CARD_5
        this.deck[69] = { location: "CARD_LOCATION_DRAW", value: "CARD_6"    , color: "CARD_RED" }; // CARD_6
        this.deck[70] = { location: "CARD_LOCATION_DRAW", value: "CARD_6"    , color: "CARD_RED" }; // CARD_6
        this.deck[71] = { location: "CARD_LOCATION_DRAW", value: "CARD_7"    , color: "CARD_RED" }; // CARD_7
        this.deck[72] = { location: "CARD_LOCATION_DRAW", value: "CARD_7"    , color: "CARD_RED" }; // CARD_7
        this.deck[73] = { location: "CARD_LOCATION_DRAW", value: "CARD_8"    , color: "CARD_RED" }; // CARD_8
        this.deck[74] = { location: "CARD_LOCATION_DRAW", value: "CARD_8"    , color: "CARD_RED" }; // CARD_8
        this.deck[75] = { location: "CARD_LOCATION_DRAW", value: "CARD_9"    , color: "CARD_RED" }; // CARD_9
        this.deck[76] = { location: "CARD_LOCATION_DRAW", value: "CARD_9"    , color: "CARD_RED" }; // CARD_9
        this.deck[77] = { location: "CARD_LOCATION_DRAW", value: "CARD_DRAW2", color: "CARD_RED" }; // CARD_DRAW2
        this.deck[78] = { location: "CARD_LOCATION_DRAW", value: "CARD_DRAW2", color: "CARD_RED" }; // CARD_DRAW2
        this.deck[79] = { location: "CARD_LOCATION_DRAW", value: "CARD_SKIP" , color: "CARD_RED" }; // CARD_SKIP
        this.deck[80] = { location: "CARD_LOCATION_DRAW", value: "CARD_SKIP" , color: "CARD_RED" }; // CARD_SKIP
        this.deck[81] = { location: "CARD_LOCATION_DRAW", value: "CARD_REV"  , color: "CARD_RED" }; // CARD_REV
        this.deck[82] = { location: "CARD_LOCATION_DRAW", value: "CARD_REV"  , color: "CARD_RED" }; // CARD_REV

        this.deck[83] = { location: "CARD_LOCATION_DRAW", value: "CARD_0"    , color: "CARD_GREEN" }; // CARD_0
        this.deck[84] = { location: "CARD_LOCATION_DRAW", value: "CARD_1"    , color: "CARD_GREEN" }; // CARD_1
        this.deck[85] = { location: "CARD_LOCATION_DRAW", value: "CARD_1"    , color: "CARD_GREEN" }; // CARD_1
        this.deck[86] = { location: "CARD_LOCATION_DRAW", value: "CARD_2"    , color: "CARD_GREEN" }; // CARD_2
        this.deck[87] = { location: "CARD_LOCATION_DRAW", value: "CARD_2"    , color: "CARD_GREEN" }; // CARD_2
        this.deck[88] = { location: "CARD_LOCATION_DRAW", value: "CARD_3"    , color: "CARD_GREEN" }; // CARD_3
        this.deck[89] = { location: "CARD_LOCATION_DRAW", value: "CARD_3"    , color: "CARD_GREEN" }; // CARD_3
        this.deck[90] = { location: "CARD_LOCATION_DRAW", value: "CARD_4"    , color: "CARD_GREEN" }; // CARD_4
        this.deck[91] = { location: "CARD_LOCATION_DRAW", value: "CARD_4"    , color: "CARD_GREEN" }; // CARD_4
        this.deck[92] = { location: "CARD_LOCATION_DRAW", value: "CARD_5"    , color: "CARD_GREEN" }; // CARD_5
        this.deck[93] = { location: "CARD_LOCATION_DRAW", value: "CARD_5"    , color: "CARD_GREEN" }; // CARD_5
        this.deck[94] = { location: "CARD_LOCATION_DRAW", value: "CARD_6"    , color: "CARD_GREEN" }; // CARD_6
        this.deck[95] = { location: "CARD_LOCATION_DRAW", value: "CARD_6"    , color: "CARD_GREEN" }; // CARD_6
        this.deck[96] = { location: "CARD_LOCATION_DRAW", value: "CARD_7"    , color: "CARD_GREEN" }; // CARD_7
        this.deck[97] = { location: "CARD_LOCATION_DRAW", value: "CARD_7"    , color: "CARD_GREEN" }; // CARD_7
        this.deck[98] = { location: "CARD_LOCATION_DRAW", value: "CARD_8"    , color: "CARD_GREEN" }; // CARD_8
        this.deck[99] = { location: "CARD_LOCATION_DRAW", value: "CARD_8"    , color: "CARD_GREEN" }; // CARD_8
        this.deck[100] ={ location: "CARD_LOCATION_DRAW", value: "CARD_9"    , color: "CARD_GREEN" }; // CARD_9
        this.deck[101] ={ location: "CARD_LOCATION_DRAW", value: "CARD_9"    , color: "CARD_GREEN" }; // CARD_9
        this.deck[102] ={ location: "CARD_LOCATION_DRAW", value: "CARD_DRAW2", color: "CARD_GREEN" }; // CARD_DRAW2
        this.deck[103] ={ location: "CARD_LOCATION_DRAW", value: "CARD_DRAW2", color: "CARD_GREEN" }; // CARD_DRAW2
        this.deck[104] ={ location: "CARD_LOCATION_DRAW", value: "CARD_SKIP" , color: "CARD_GREEN" }; // CARD_SKIP
        this.deck[105] ={ location: "CARD_LOCATION_DRAW", value: "CARD_SKIP" , color: "CARD_GREEN" }; // CARD_SKIP
        this.deck[106] ={ location: "CARD_LOCATION_DRAW", value: "CARD_REV"  , color: "CARD_GREEN" }; // CARD_REV
        this.deck[107] ={ location: "CARD_LOCATION_DRAW", value: "CARD_REV"  , color: "CARD_GREEN" }; // CARD_REV
    },
    // Randomly shuffles the deck.
    shuffleDeck: function(){
        // Based on: Fisher-Yates (also known as Knuth) shuffle algorithm.
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    },
    // Run once upon changing to this game state.
    init: function(){
        // Clear the screen and the graphics caches.
        _GFX.funcs.clearAllLayers(true);
        _GFX.layerObjs.removeAll(_APP.game.gs1);

        console.log("In gs_PLAYING. Here are the gameSettings:", this.gameSettings);

        // Set the L1 background color.
        _GFX.funcs.updateL1BgColorRgba([32,32,48,255]);

        _GFX.layerObjs.updateOne(Cursor1, { x:14, y:14, layerObjKey: `debugCursor`   , layerKey: "L4", xyByGrid: true, settings:{rotation: 90} } );
        
        // Create the gameboard graphics.
        this.gameBoard.parent = this;
        this.gameBoard.createGameBoard();

        // Determine which players are to be set as active.
        if(this.gameSettings.P1 != "NONE"){ this.gameBoard.players["P1"].active = true; } else { this.gameBoard.players["P1"].active = false; }
        if(this.gameSettings.P2 != "NONE"){ this.gameBoard.players["P2"].active = true; } else { this.gameBoard.players["P2"].active = false; }
        if(this.gameSettings.P3 != "NONE"){ this.gameBoard.players["P3"].active = true; } else { this.gameBoard.players["P3"].active = false; }
        if(this.gameSettings.P4 != "NONE"){ this.gameBoard.players["P4"].active = true; } else { this.gameBoard.players["P4"].active = false; }
        
        // Add the text. (For each active player.)
        for(let playerKey in this.gameBoard.players){
            // this.gameBoard.updatePlayerText(playerKey, true);
            if(this.gameBoard.players[playerKey].active){
                this.gameBoard.updatePlayerText(playerKey, false);
            }
        }

        // Reset the deck and shuffle the deck.
        this.resetDeck();
        this.shuffleDeck();

        // Set gamestate 2.
        _APP.game.changeGs2("getFirstPlayer");

        // layerKey = `lg_${color}_CARD_BACK`;
        // _GFX.layerObjs.updateOne(Card, { size: "lg", color:"CARD_BLACK", value: "CARD_BACK", x:10, y:11, layerObjKey: `lg_green_2`, layerKey: "L2", xyByGrid: true } );
        // _GFX.layerObjs.updateOne(Card, { size: "lg", color:"CARD_GREEN", value: "CARD_2", x:16, y:11, layerObjKey: `lg_back_back`, layerKey: "L2", xyByGrid: true } );

        // Run the debug init.
        if(_APP.debugActive && _DEBUG2){ _DEBUG2.debugGamestate.uninit(_APP.game.gs1, _APP.game.gs2_new); }

        // Set the inited flag.
        this.inited = true;
    },

    // Main function of this game state. Calls other functions/handles logic, etc.
    main: function(){
        // Run init and return if this gamestate is not yet inited.
        if(!this.inited){ this.init(); return; }

        // Gamepad input.
        let state = _INPUT.util.stateByteToObj2("p1"); 
        if(state.press.BTN_B) { 
            _APP.game.changeGs1("gs_OPTIONS");
            _APP.game.changeGs2("init");
            return;
        }

        // DEBUG CURSOR.
        _GFX.layerObjs.getOne("debugCursor").nextFrame();
        if(state.held.BTN_SR && state.press.BTN_UP)   { _GFX.layerObjs.getOne("debugCursor").y--; }
        if(state.held.BTN_SR && state.press.BTN_DOWN) { _GFX.layerObjs.getOne("debugCursor").y++; }
        if(state.held.BTN_SR && state.press.BTN_LEFT) { _GFX.layerObjs.getOne("debugCursor").x--; }
        if(state.held.BTN_SR && state.press.BTN_RIGHT){ _GFX.layerObjs.getOne("debugCursor").x++; }

        if(_APP.game.gs2 == "getFirstPlayer"){
            // Shuffle the deck.
            this.shuffleDeck();

            // Deal 1 card to each player. 

            // What cards were they, who had them, and what is their value?
            // Highest value card gets to be first player. 

            // Set the current player.
            // this.gameBoard.setCurrentPlayer(winningPlayerKey);

            // Reset the deck.
            this.resetDeck();

            // Switch to the main dealing mode.
            // _APP.game.changeGs2("dealing");
        }
        else if(_APP.game.gs2 == "dealing"){
            // Deal 1 card to each player in order of P1 to P4 until each player has 7 cards.


            // // Set the current color and indicator.
            // this.gameBoard.setColorIndicators("CARD_BLACK");

            // // Add the direction indicators.
            // this.gameBoard.setDirectionIndicators("F");

            // Determine who goes first.

            // Pause
        }
        else if(_APP.game.gs2 == "playerTurn"){
            //.Is the player allowed to play? (skip, draw, reverse)

            // Reveal the current player's cards.

            // Show the cursor.

            // Allow start button to bring up the menu

            // Allow cursor movement.

            // Allow card selection.
                // Check if the card is valid (warning message if not.)
                // Card valid, move it up. Display "Play or Pass" message.
                // Accept play or pass.
                    // Move card to the discard pile.
                    // Handle wild card color chooser menu.
                    // Adjust direction.
                    // Adjust current color
                    // Queue skip, reverse, draw 2, draw 4 to the next player.
                    // Does the player have 1 cards remaining? (UNO)
                    // Does the player have 0 cards remaining? (WIN)
                    // Determine next player's turn.
        }

        if(_APP.debugActive && _DEBUG){ this.debug(); }
    },

    // Should be called by the game loop.
    // Calls debug functions specific to this gamestate.
    debug: function(){
        // console.log("DEBUG");
        if(_APP.debugActive && _DEBUG2){ _DEBUG2.debugGamestate.run(_APP.game.gs1, _APP.game.gs2)}
    },
};