/*
MAX CARDS EXPECTED TO BE ON SCREEN DURING PLAY:
    DRAW PILE (UNO BACK)
    DISCARD PILE FACE-UP CARD.
    PLAYER1 CARDS 0-4 (5 total displayed)
    PLAYER2 CARDS 0-4 (5 total displayed)
    PLAYER3 CARDS 0-4 (5 total displayed)
    PLAYER4 CARDS 0-4 (5 total displayed)
    Non-active players only show the back card.
    
MAX CARDS EXPECTED TO BE ON SCREEN DURING END OF ROUND:
    PLAYER1 CARDS 0-4 (5 total displayed)
    PLAYER2 CARDS 0-4 (5 total displayed)
    PLAYER3 CARDS 0-4 (5 total displayed)
    PLAYER4 CARDS 0-4 (5 total displayed)
    LARGE CARD: 1
    Players not actively adding to the score only show the back card.
*/
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
            P1: { type: "NONE", active:false },
            P2: { type: "NONE", active:false },
            P3: { type: "NONE", active:false },
            P4: { type: "NONE", active:false },
        },

        displayMessage: function(msgKey, playerKey, hide=false){
            // this.gameBoard.displayMessage("playsFirst", "P1", false);
            let pos = {
                msgBox: {
                    msgBox  : { x:7, y:18, w:13 , h:3, layerKey: "L1", layerObjKey: "msgBox_text" },
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
                _GFX.layerObjs.updateOne(PrintText, { text: " "  , x:data.x, y:data.y, layerObjKey: data.layerObjKey, layerKey: data.layerKey, xyByGrid: true });   
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
        },
        displayMenu: function(type="wild"){
            // types: ["wild", "menu"]
        },
        initPlayers: function(){
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
        },
        // TODO
        setCurrentPlayer: function(playerKey){
            // Set the playerKey value. 
            this.currentPlayer = playerKey;

            // Hide the active player indicators.
            //
            
            // Show the active player indicator for the active player.
            //
        },
        setColorIndicators: function(playerKey, color){
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
            _GFX.layerObjs.updateOne(LayerObject, {
                layerObjKey: data.layerObjKey, 
                layerKey   : data.layerKey, 
                tilesetKey : data.tilesetKey, 
                xyByGrid: true, settings: {},
                removeHashOnRemoval: true, noResort: false,
                x:data.x, y:data.y,
                tmap: new Uint8ClampedArray(
                    // Dimensions.
                    [ data.w, data.h ]
                    // Tiles
                    .concat(Array.from({ length: ((data.w) * (data.h)) }, () => fillTile))
                ),
            });
        },
        setDirectionIndicators: function(dir){
            // _APP.shared.gameBoard.setDirectionIndicators("F");
            // _APP.shared.gameBoard.setDirectionIndicators("N");
            // _APP.shared.gameBoard.setDirectionIndicators("R");
            this.currentDirection = dir;
            if(dir == "F"){
                _GFX.layerObjs.updateOne(LayerObject, { tmap: _GFX.funcs.getTilemap("bg_tiles1", "directionF_tl"), x:5, y:5, layerObjKey: `direction_tl`, layerKey: "L1", tilesetKey: "bg_tiles1", xyByGrid: true });
                _GFX.layerObjs.updateOne(LayerObject, { tmap: _GFX.funcs.getTilemap("bg_tiles1", "directionF_tr"), x:20, y:5, layerObjKey: `direction_tr`, layerKey: "L1", tilesetKey: "bg_tiles1", xyByGrid: true });
                _GFX.layerObjs.updateOne(LayerObject, { tmap: _GFX.funcs.getTilemap("bg_tiles1", "directionF_bl"), x:5, y:20, layerObjKey: `direction_bl`, layerKey: "L1", tilesetKey: "bg_tiles1", xyByGrid: true });
                _GFX.layerObjs.updateOne(LayerObject, { tmap: _GFX.funcs.getTilemap("bg_tiles1", "directionF_br"), x:20, y:20, layerObjKey: `direction_br`, layerKey: "L1", tilesetKey: "bg_tiles1", xyByGrid: true });
            }
            else if(dir == "R"){
                _GFX.layerObjs.updateOne(LayerObject, { tmap: _GFX.funcs.getTilemap("bg_tiles1", "directionR_tl"), x:5, y:5, layerObjKey: `direction_tl`, layerKey: "L1", tilesetKey: "bg_tiles1", xyByGrid: true });
                _GFX.layerObjs.updateOne(LayerObject, { tmap: _GFX.funcs.getTilemap("bg_tiles1", "directionR_tr"), x:20, y:5, layerObjKey: `direction_tr`, layerKey: "L1", tilesetKey: "bg_tiles1", xyByGrid: true });
                _GFX.layerObjs.updateOne(LayerObject, { tmap: _GFX.funcs.getTilemap("bg_tiles1", "directionR_bl"), x:5, y:20, layerObjKey: `direction_bl`, layerKey: "L1", tilesetKey: "bg_tiles1", xyByGrid: true });
                _GFX.layerObjs.updateOne(LayerObject, { tmap: _GFX.funcs.getTilemap("bg_tiles1", "directionR_br"), x:20, y:20, layerObjKey: `direction_br`, layerKey: "L1", tilesetKey: "bg_tiles1", xyByGrid: true });
            }
            else if(dir == "N"){
                _GFX.layerObjs.removeOne( "direction_tl" );
                _GFX.layerObjs.removeOne( "direction_tr" );
                _GFX.layerObjs.removeOne( "direction_bl" );
                _GFX.layerObjs.removeOne( "direction_br" );
            }
        },
        updatePlayerText: function(){
            let pos = {
                P1: {
                    uno  : { x:23, y:24, layerKey: "L1", layerObjKey: "p1Text_uno"   },
                    name : { x:23, y:25, layerKey: "L1", layerObjKey: "p1Text_name"  },
                    cards: { x:23, y:26, layerKey: "L1", layerObjKey: "p1Text_cards" },
                    count: { x:23, y:27, layerKey: "L1", layerObjKey: "p1Text_count" },
                },
                P2: {
                    uno  : { x:0, y:24, layerKey: "L1", layerObjKey: "p2Text_uno"   },
                    name : { x:0, y:25, layerKey: "L1", layerObjKey: "p2Text_name"  },
                    cards: { x:0, y:26, layerKey: "L1", layerObjKey: "p2Text_cards" },
                    count: { x:0, y:27, layerKey: "L1", layerObjKey: "p2Text_count" },
                },
                P3: {
                    name : { x:0, y:0, layerKey: "L1", layerObjKey: "p3Text_name"  },
                    cards: { x:0, y:1, layerKey: "L1", layerObjKey: "p3Text_cards" },
                    count: { x:0, y:2, layerKey: "L1", layerObjKey: "p3Text_count" },
                    uno  : { x:0, y:3, layerKey: "L1", layerObjKey: "p3Text_uno"   },
                },
                P4: {
                    name : { x:23, y:0, layerKey: "L1", layerObjKey: "p4Text_name"  },
                    cards: { x:23, y:1, layerKey: "L1", layerObjKey: "p4Text_cards" },
                    count: { x:23, y:2, layerKey: "L1", layerObjKey: "p4Text_count" },
                    uno  : { x:23, y:3, layerKey: "L1", layerObjKey: "p4Text_uno"   },
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
                let cardCount = this.parent.deck.filter(d=>d.location==location).length;

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

    anims: {
        objs:{},
        // add: function(){ console.log("add :", this.parent); },
    },

    // The deck (every card.)
    deck: [
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
    ], 

    cardPoints: {
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
    },

    // Sets the location of each card to the DRAW_PILE.
    resetDeck: function(){
        for(let card of this.deck){
            card.location = "CARD_LOCATION_DRAW";
        }
    },

    // Randomly shuffles the deck.
    shuffleDeck: function(){
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
    },

    // UNUSED
    // Randomly shuffles an array of cards.
    shuffleArray: function(cards){
        // Based on: Fisher-Yates (also known as Knuth) shuffle algorithm.
        let times = 2;

        // Do it X times.
        // let ts = performance.now();
        for(let c=0; c<times; c+=1){
            for (let i = cards.length - 1; i > 0; i--) {
                // const j = Math.floor(Math.random() * (i + 1));
                const j = (Math.random() * (i + 1)) | 0;
                [cards[i], cards[j]] = [cards[j], cards[i]];
            }
        }
        // console.log("Shuffle time:", performance.now() -ts);
    },

    // Move card to discard pile.
    moveCardToDiscardPile(card_layerObjKey, card){
    },

    // Get a random card from the draw pile (no assignment, just returns a random card.)
    getRandomCardFromDrawpile: function(){
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
    },

    // Get the next card from the draw pile (no assignment, just returns a card.)
    getNextCardFromDrawpile: function(){
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

            // Return the next card.
            return availableCards[0];
        }
        else{
            // Return the next card.
            return availableCards[0];
        }
    },

    // Run once upon changing to this game state.
    init: function(){
        // Clear the screen and the graphics caches.
        _GFX.funcs.clearAllLayers(true);
        _GFX.layerObjs.removeAll(_APP.game.gs1_prev);
        _GFX.layerObjs.removeAll(_APP.game.gs1);

        // Set the L1 background color.
        _GFX.funcs.updateL1BgColorRgba([32,32,48,255]);

        // Create the gameboard graphics.
        this.gameBoard.parent = this;
        this.gameBoard.createGameBoard();
        
        // Set parent for anims.
        this.anims.parent = this;

        // Determine which players are to be set as active and show their default texts.
        this.gameBoard.initPlayers();
        
        // Reset the deck and shuffle the deck.
        this.resetDeck();
        this.shuffleDeck();

        // console.log( this.getNextCardFromDrawpile().location="CARD_LOCATION_PLAYER1" );
        // console.log( this.getNextCardFromDrawpile().location="CARD_LOCATION_PLAYER1" );

        // setTimeout(()=>{
        //     this.getNextCardFromDrawpile().location="CARD_LOCATION_PLAYER1"
        //     this.getNextCardFromDrawpile().location="CARD_LOCATION_PLAYER2"
        //     this.getNextCardFromDrawpile().location="CARD_LOCATION_PLAYER3"
        //     this.getNextCardFromDrawpile().location="CARD_LOCATION_PLAYER4"
        //     this.getNextCardFromDrawpile().location="CARD_LOCATION_DISCARD"
        //     this.getNextCardFromDrawpile().location="CARD_LOCATION_DRAW"
        // }, 2000);

        // Set gamestate 2.
        _APP.game.changeGs2("getFirstPlayer");

        // layerKey = `lg_${color}_CARD_BACK`;
        // _GFX.layerObjs.updateOne(Card, { size: "lg", color:"CARD_BLACK", value: "CARD_BACK", x:10, y:11, layerObjKey: `lg_green_2`, layerKey: "L2", xyByGrid: true } );
        // _GFX.layerObjs.updateOne(Card, { size: "lg", color:"CARD_GREEN", value: "CARD_2", x:16, y:11, layerObjKey: `lg_back_back`, layerKey: "L2", xyByGrid: true } );

        _GFX.layerObjs.updateOne(Cursor1, { x:5, y:5, layerObjKey: `debugCursor`   , layerKey: "L1", xyByGrid: true, settings:{rotation: 90} } );
        // _GFX.layerObjs.updateOne(Cursor1, { x:14, y:15, layerObjKey: `debugCursor2`  , layerKey: "L1", xyByGrid: true, settings:{rotation: -90} } );
        // _GFX.layerObjs.updateOne(Cursor1, { x:14, y:15, layerObjKey: `debugCursor3`  , layerKey: "L1", xyByGrid: true, settings:{rotation: 180} } );

        // Run the debug init.
        if(_APP.debugActive && _DEBUG2){ _DEBUG2.debugGamestate.uninit(_APP.game.gs1, _APP.game.gs2_new); }

        // this.gameBoard.displayMessage("playsFirst", "P1", false);

        // Set the inited flag.
        this.inited = true;
    },

    // Main function of this game state. Calls other functions/handles logic, etc.
    main: function(){
        // Run init and return if this gamestate is not yet inited.
        if(!this.inited){ this.init(); return; }

        // Gamepad input.
        let gpInput = {}; 
        let gpInputP1 = _INPUT.util.stateByteToObj2("p1"); 
        let gpInputP2 = _INPUT.util.stateByteToObj2("p2"); 
        if(gpInputP1.press.BTN_B) { 
            _APP.game.changeGs1("gs_OPTIONS");
            _APP.game.changeGs2("init");
            return;
        }

        // DEBUG CURSOR.
        _GFX.layerObjs.getOne("debugCursor").nextFrame();
        // _GFX.layerObjs.getOne("debugCursor2").nextFrame();
        // _GFX.layerObjs.getOne("debugCursor3").nextFrame();
        if(gpInputP1.held.BTN_SR && gpInputP1.press.BTN_UP)   { _GFX.layerObjs.getOne("debugCursor").y--; }
        if(gpInputP1.held.BTN_SR && gpInputP1.press.BTN_DOWN) { _GFX.layerObjs.getOne("debugCursor").y++; }
        if(gpInputP1.held.BTN_SR && gpInputP1.press.BTN_LEFT) { _GFX.layerObjs.getOne("debugCursor").x--; }
        if(gpInputP1.held.BTN_SR && gpInputP1.press.BTN_RIGHT){ _GFX.layerObjs.getOne("debugCursor").x++; }

        // let card;
        // card = this.getNextCardFromDrawpile();
        // _GFX.layerObjs.updateOne(Card, { size: "sm", color:card.color, value: card.value , x:0, y:0, layerObjKey: "p1card", layerKey: "L1", xyByGrid: true } );
        // card.location = "CARD_LOCATION_PLAYER1";

        // this.getNextCardFromDrawpile().location="CARD_LOCATION_PLAYER2"
        // this.getNextCardFromDrawpile().location="CARD_LOCATION_PLAYER3"
        // this.getNextCardFromDrawpile().location="CARD_LOCATION_PLAYER4"
        // this.getNextCardFromDrawpile().location="CARD_LOCATION_DISCARD"
        // this.getNextCardFromDrawpile().location="CARD_LOCATION_DRAW"
        
        // this.anims.add();

        if(_APP.debugActive && _DEBUG){ this.debug(); }
        // return; 
        if(_APP.game.gs2 == "gamestart"){
            // Set flags.
            // _APP.shared.genTimer.create("timer1", 60); // After turn
            // _APP.shared.genTimer.create("timer2", 60); // 
            // _APP.shared.genTimer.create("timer3", 60); // 
            // _APP.shared.genTimer.create("timer4", 60); // 

            _APP.game.gs2 == "getFirstPlayer";
        }
        else if(_APP.game.gs2 == "getFirstPlayer"){
            if(0){
                // Shuffle the deck.
                this.shuffleDeck();
            }
            else if(0){
            }
            else if(0){
            }
            else if(0){
            }
            else if(0){
            }
            else{
            }

            // Deal 1 card to each player. 

            // What cards were they, who had them, and what is their value?
            // Highest value card gets to be first player. 

            // Set the current player.
            // this.gameBoard.setCurrentPlayer(winningPlayerKey);

            // Reset the deck.
            this.resetDeck();

            // Shuffle the deck.
            this.shuffleDeck();

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
        else if(_APP.game.gs2 == "winner"){
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