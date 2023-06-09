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
        P3  : "HUMAN",
        P4  : "HUMAN",
        WIN : "atZeroCards", // ["at500pts", "atZeroCards"]
        DRAW: "one",         // ["one", "until"]
        
        P1_SCORE: 0,
        P2_SCORE: 0,
        P3_SCORE: 0,
        P4_SCORE: 0,
    },
    
    gameBoard:null,
    deck:null,

    anims: {
        objs:{},
        // add: function(){ console.log("add :", this.parent); },
    },

    // Move card to discard pile.
    moveCardToDiscardPile(card_layerObjKey, card){
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
        // this.gameBoard.parent = this;
        
        // Set parent for anims.
        this.anims.parent = this;

        // Create the deck.
        this.deck = new Deck({});

        // Create the gameboard.
        this.gameBoard = new Gameboard({
            parent       : this,
            deck         : this.deck,
            gameSettings : this.gameSettings,
        });

        this.gameBoard.initPlayers();
        this.deck.storeGameBoard(this.gameBoard);
        this.deck.createCardPlaceholders();

        // Set gamestate 2.
        _APP.game.changeGs2("getFirstPlayer");

        // Run the debug init.
        if(_APP.debugActive && _DEBUG2){ 
            // DEBUG CURSOR.
            _GFX.layerObjs.createOne(Cursor1, { x:5, y:5, layerObjKey: `debugCursor`   , layerKey: "L2", xyByGrid: true, settings:{rotation: 90} } );
            // _GFX.layerObjs.createOne(Cursor1, { x:5, y:6, layerObjKey: `debugCursor2`   , layerKey: "L3", xyByGrid: true, settings:{rotation: -90} } );

            _DEBUG2.debugGamestate.uninit(_APP.game.gs1, _APP.game.gs2_new); 
        }

        // this.gameBoard.displayMessage("playsFirst", "P1", false);

        // GAME RESET.

        // Set the inited flag.
        this.inited = true;
    },

    // State of card movement.
    cardMovements: [
        // { card: null,   : false, timerKey: "" }
    ],
    addCardMovement: function(type, obj){
        let cardMovement;
        if(type == "selected"){
            cardMovement = {
                timerKey    : obj.timerKey, 
                started     : false, 
                finished    : false, 
                card        : null,
                start: function(){
                    _APP.shared.genTimer.create(this.timerKey, 60);
                    this.card = _GFX.layerObjs.getOne(obj.layerObjKey),
                    this.card.moveCardToSelected(obj.playerKey); 
                    this.started=true; 
                }
            };
        }
        else if(type == "unselected"){
            cardMovement = {
                timerKey : obj.timerKey, 
                started  : obj.started, 
                finished : obj.finished, 
                card     : obj.card,
                start: function(){
                    _APP.shared.genTimer.create(this.timerKey, 60);
                    this.card = _GFX.layerObjs.getOne(obj.layerObjKey),
                    this.card.moveCardToUnselected(obj.playerKey); 
                    this.started=true; 
                }
            };
        }
        else if(type == "discard"){
            cardMovement = {
                timerKey : obj.timerKey, 
                started  : obj.started, 
                finished : obj.finished, 
                card     : obj.card,
                start: function(){
                    _APP.shared.genTimer.create(this.timerKey, 60);
                    this.card = _GFX.layerObjs.getOne(obj.layerObjKey),
                    this.card.moveCardToDiscard(obj.playerKey); 
                    this.started=true; 
                }
            };
        }
        else{
            console.error("addCardMovement: Unknown type specified:", type);
            return; 
        }
        this.cardMovements.push(cardMovement);
    },
    handleCardMovements: function(){
        let canRunGameLogic = true;
        // Go through each record in the cardMovements array...
        for(let recIndex in this.cardMovements){
            // Get the record.
            let rec = this.cardMovements[recIndex];

            // If this record is NOT finished...
            if(!rec.finished){
                // Set canRunGameLogic to false.
                canRunGameLogic = false;

                // Start the movement if needed.
                if(!rec.started){ rec.start(); break; }

                // If the movement is not done then run the next frame.
                if(!rec.card.movementDone){ 
                    rec.card.nextFrame(); 
                }
                // Movement done has the timer finished?
                else if(_APP.shared.genTimer.check( rec.timerKey )){ 
                    // Reset the timer.
                    _APP.shared.genTimer.reset( rec.timerKey ); 

                    // Set finished to true.
                    rec.finished = true;
                }
            }
        }

        // Remove all finished movements.
        this.cardMovements = this.cardMovements.filter(d=>!d.finished);

        // Return the canRunGameLogic flag.
        return canRunGameLogic;
    },
    
    // Main function of this game state. Calls other functions/handles logic, etc.
    main: function(){
        // Run init and return if this gamestate is not yet inited.
        if(!this.inited){ this.init(); return; }

        // Gamepad input.
        let gpInput = {
            "P1": _INPUT.util.stateByteToObj2("p1"),
            "P2": _INPUT.util.stateByteToObj2("p2"),
        }; 
        
        if(gpInput.P1.press.BTN_B) { 
            _APP.game.changeGs1("gs_OPTIONS");
            _APP.game.changeGs2("init");
            return;
        }

        // Are there any card movement animations active?
        let canRunGameLogic = true; 
        if(this.cardMovements.length){ canRunGameLogic = this.handleCardMovements(); }

        else if(canRunGameLogic){
            console.log("GAME LOGIC");
            // let card;
            // card = this.getNextCardFromDrawpile();
            // if(card){
            //     _GFX.layerObjs.createOne(Card, { size: "sm", color:card.color, value: card.value , x:0, y:0, layerObjKey: "p1card", layerKey: "L1", xyByGrid: true } );
            //     card.location = "CARD_LOCATION_PLAYER1";
            // }

            // this.getNextCardFromDrawpile().location="CARD_LOCATION_PLAYER2"
            // this.getNextCardFromDrawpile().location="CARD_LOCATION_PLAYER3"
            // this.getNextCardFromDrawpile().location="CARD_LOCATION_PLAYER4"
            // this.getNextCardFromDrawpile().location="CARD_LOCATION_DISCARD"
            // this.getNextCardFromDrawpile().location="CARD_LOCATION_DRAW"
            
            // this.anims.add();

            // return; 
            if(_APP.game.gs2 == "gamestart"){
                // Set flags.
                // _APP.shared.genTimer.create("timer1", 60); // After turn
                // _APP.shared.genTimer.create("timer2", 60); // 
                // _APP.shared.genTimer.create("timer3", 60); // 
                // _APP.shared.genTimer.create("timer4", 60); // 

                _APP.game.gs2 = "getFirstPlayer";
            }
            else if(_APP.game.gs2 == "getFirstPlayer"){
                if(0){
                    // Shuffle the deck.
                    this.deck.shuffleDeck();
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

                // // Reset the deck.
                // this.deck.resetDeck();

                // // Shuffle the deck.
                // this.deck.shuffleDeck();

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
        }

        if(_APP.debugActive && _DEBUG){ this.debug(gpInput); }
    },

    // Should be called by the game loop.
    // Calls debug functions specific to this gamestate.
    debug: function(gpInput){
        // DEBUG CURSOR.
        _GFX.layerObjs.getOne("debugCursor").nextFrame();
        // _GFX.layerObjs.getOne("debugCursor2").nextFrame();
        if(gpInput.P1.held.BTN_SR && gpInput.P1.press.BTN_UP)   { _GFX.layerObjs.getOne("debugCursor").y--; }
        if(gpInput.P1.held.BTN_SR && gpInput.P1.press.BTN_DOWN) { _GFX.layerObjs.getOne("debugCursor").y++; }
        if(gpInput.P1.held.BTN_SR && gpInput.P1.press.BTN_LEFT) { _GFX.layerObjs.getOne("debugCursor").x--; }
        if(gpInput.P1.held.BTN_SR && gpInput.P1.press.BTN_RIGHT){ _GFX.layerObjs.getOne("debugCursor").x++; }

        if(_APP.debugActive && _DEBUG2){ _DEBUG2.debugGamestate.run(_APP.game.gs1, _APP.game.gs2)}
    },
};