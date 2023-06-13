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

    // Run once upon changing to this game state.
    init: function(){
        // Clear the screen and the graphics caches.
        _GFX.funcs.clearAllLayers(true);
        _GFX.layerObjs.removeAll(_APP.game.gs1_prev);
        _GFX.layerObjs.removeAll(_APP.game.gs1);

        // Set the L1 background color.
        _GFX.funcs.updateL1BgColorRgba([32,32,48,255]);

        // Create the deck.
        this.deck = new Deck({});

        // Create the gameboard.
        this.gameBoard = new Gameboard({
            parent       : this,
            deck         : this.deck,
            gameSettings : this.gameSettings,
        });

        // Create the colorChanger menu.
        this.colorChanger = new ColorChanger({
            parent       : this,
        });

        // Create the pauseMenu menu.
        // this.pauseMenu = new PauseMenu({
        //     parent       : this,
        // });

        // Init the gameBoard and the deck.
        this.gameBoard.initPlayers();
        this.gameBoard.currentPlayer = "P1";
        this.gameBoard.setDirectionIndicators("F");
        // this.gameBoard.setDirectionIndicators("R");
        this.gameBoard.updatePlayerText(true);
        this.deck.storeGameBoard(this.gameBoard);
        this.deck.createCardPlaceholders();

        // Create general wait timers.
        _APP.shared.genTimer.create("genWaitTimer1", 0); // Used by: [ getFirstPlayer, ]
        _APP.shared.genTimer.create("genWaitTimer2", 0); // Used by: [ ]
        _APP.shared.genTimer.create("discardWait", 0);   // Used by: [ ]
        _APP.shared.genTimer.create("drawWait", 0);      // Used by: [ action_draw, ]
        _APP.shared.genTimer.create("skipWait", 0);      // Used by: [ action_skip, ]
        _APP.shared.genTimer.create("reverseWait", 0);   // Used by: [ action_reverse, ]
        _APP.shared.genTimer.create("endOfTurnWait", 0); // Used by: [ ]

        // Array of timer keys that should remain after clearing finished timers.
        this.timerKeysKeep = [
            "genWaitTimer1", 
            "genWaitTimer2", 
            "discardWait", 
            "drawWait", 
            "skipWait", 
            "reverseWait", 
            "endOfTurnWait",
        ];

        // Run the debug init.
        if(_APP.debugActive && _DEBUG2){ 
            // DEBUG CURSOR.
            // _GFX.layerObjs.createOne(Cursor1, { x:5, y:5, layerObjKey: `debugCursor`   , layerKey: "L2", xyByGrid: true, settings:{rotation: 90} } );

            _DEBUG2.debugGamestate.uninit(_APP.game.gs1, _APP.game.gs2_new); 
        }

        // Set gamestate 2.
        _APP.game.changeGs2("gamestart");

        // Set the inited flag.
        this.inited = true;
    },

    // State of card movement.
    cardMovements: [],
    addCardMovement: function(type, obj){
        let cardMovement = {
            layerObjKey  : obj.layerObjKey,
            timerKey     : obj.timerKey, 
            timerFrames  : obj.timerFrames ?? 20,
            movementSpeed: obj.movementSpeed ?? 1,
            started      : obj.started, 
            card         : obj.card ?? null,
            finished     : obj.finished, 
            finish       : obj.finish ?? (()=>{}),
            playerKey    : obj.playerKey ?? null,
            cardSlot     : obj.cardSlot ?? null,
            func: "",
        };
        if(type == "selected"){
            cardMovement.func = "moveCardToSelected";
            cardMovement.start = (function(){
                _APP.shared.genTimer.create(cardMovement.timerKey, obj.timerFrames);
                cardMovement.timer = _APP.shared.genTimer.get(cardMovement.timerKey);
                cardMovement.card = _GFX.layerObjs.getOne(obj.layerObjKey);
                cardMovement.card.moveCardToSelected(obj.playerKey, obj.movementSpeed); 
                cardMovement.started=true; 
                cardMovement.card.hidden = false;
            });
        }
        else if(type == "unselected"){
            cardMovement.func = "moveCardToUnselected";
            cardMovement.start = (function(){
                _APP.shared.genTimer.create(cardMovement.timerKey, cardMovement.timerFrames);
                cardMovement.timer = _APP.shared.genTimer.get(cardMovement.timerKey);
                cardMovement.card = _GFX.layerObjs.getOne(cardMovement.layerObjKey);
                cardMovement.card.moveCardToUnselected(cardMovement.playerKey, cardMovement.movementSpeed); 
                cardMovement.started=true; 
                cardMovement.card.hidden = false;
            });
        }
        else if(type == "discard"){
            cardMovement.func = "moveCardToDiscard";
            cardMovement.start = (function(){
                _APP.shared.genTimer.create(cardMovement.timerKey, cardMovement.timerFrames);
                cardMovement.timer = _APP.shared.genTimer.get(cardMovement.timerKey);
                cardMovement.card = _GFX.layerObjs.getOne(cardMovement.layerObjKey);
                cardMovement.card.moveCardToDiscard(cardMovement.movementSpeed); 
                cardMovement.started=true; 
                cardMovement.card.hidden = false;
            });
        }
        else if(type == "draw"){
            cardMovement.func = "moveDrawCardToHome";
            cardMovement.start = function(){
                _APP.shared.genTimer.create(cardMovement.timerKey, cardMovement.timerFrames);
                cardMovement.timer = _APP.shared.genTimer.get(cardMovement.timerKey);
                cardMovement.card = _GFX.layerObjs.getOne(cardMovement.layerObjKey);
                cardMovement.card.moveDrawCardToHome(cardMovement.playerKey, cardMovement.cardSlot, cardMovement.movementSpeed); 
                cardMovement.started=true; 
                cardMovement.card.hidden = false;
            };
        }
        else if(type == "home"){
            cardMovement.func = "home";
            cardMovement.start = (function(){
                let [playerKey, cardSlot] = cardMovement.layerObjKey.split("_card_");
                _APP.shared.genTimer.create(cardMovement.timerKey, cardMovement.timerFrames);
                cardMovement.timer = _APP.shared.genTimer.get(cardMovement.timerKey);
                cardMovement.card = _GFX.layerObjs.getOne(cardMovement.layerObjKey);
                cardMovement.card.moveCardToHome(playerKey, +cardSlot, cardMovement.movementSpeed); 
                cardMovement.started=true; 
                cardMovement.card.hidden = false;
            });
        }
        else{
            console.error("addCardMovement: Unknown type specified:", type);
            return; 
        }
        this.cardMovements.push(cardMovement);
    },
    handleCardMovements: function(){
        let clearFinish = false; 
        // Go through each record in the cardMovements array...
        for(let recIndex in this.cardMovements){
            // Get the record.
            let rec = this.cardMovements[recIndex];

            // If this record is NOT finished...
            if(!rec.finished){
                // Start the movement if needed.
                if(!rec.started && rec.start){ rec.start(); }

                // If the movement is not done then run the next frame.
                if(!rec.card.movementDone){ rec.card.nextFrame(); }

                // Movement done has the timer finished?
                else if(_APP.shared.genTimer.check( rec.timerKey )){ 
                    // Run the finish function if it is present.
                    if(rec.finish){ rec.finish(); }

                    // Set finished to true.
                    rec.finished = true;
                    clearFinish = true; 
                }
            }
        }

        // Remove all finished movements.
        if(clearFinish){
            this.cardMovements = this.cardMovements.filter(d=>!d.finished);
        }
    },
    
    flags: {
        // SHARED

        // getFirstPlayer::
        dealing                    : false, // Flag
        determineHighestCard       : false, // Flag
        firstPlayer                : "",    // Var
        ready_determineHighestCard : false, // Flag
        tied_determineHighestCard  : false, // Flag
        dealing_firstTurn          : false, // Flag
        dealing_firstTurnCardPos   : 0,     // Var
    },
    flags2: {
        // playerTurn::
        playerTurn_start : false, // Flag
        playerTurn       : false, // Flag
        playerDraws2     : false, // Flag 
        playerSkipped    : false, // Flag 
        playerReverse    : false, // Flag 
        playerDraws4     : false, // Flag 
        playerColorChange: false, // Flag 
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

        // 
        // Are there any card movement animations active? (blocking to the rest of the game loop until complete.)
        if(this.cardMovements.length){ this.handleCardMovements(); }
        
        // Queued functions.
        else if(!_APP.shared.funcQueue.runNext(_APP.game.gs1)){}

        // Wait? (specific) 
        else if(!_APP.shared.genTimer.check("discardWait")){ }
        else if(!_APP.shared.genTimer.check("drawWait")){ }
        else if(!_APP.shared.genTimer.check("skipWait")){ }
        else if(!_APP.shared.genTimer.check("reverseWait")){ }
        else if(!_APP.shared.genTimer.check("endOfTurnWait")){ }

        // Wait? (general) 
        else if(!_APP.shared.genTimer.check("genWaitTimer1")){ } 
        else if(!_APP.shared.genTimer.check("genWaitTimer2")){ } 

        // Color changer.
        else if(this.colorChanger.active){ this.action_changeColor(gpInput); }

        // Pause menu.
        // else if(this.pauseMenu.active){ this.pauseMenu(gpInput); }

        // 
        else {
            // console.log(_APP.game.gs2);
            // This runs at the start of each round. 
            if     (_APP.game.gs2 == "gamestart")     { this.gamestart(); }
            else if(_APP.game.gs2 == "getFirstPlayer"){ this.getFirstPlayer(); }
            else if(_APP.game.gs2 == "playerTurn"){
                if(this.flags2.playerTurn_start){
                    // console.log("run once.", "playerTurn!", this.gameBoard.currentPlayer);
                    this.gameBoard.updatePlayerText();
                    this.deck.updateUnderPiles();

                    // Show the current color.
                    let discardCard = _GFX.layerObjs.getOne("discard_card");
                    this.gameBoard.setColorIndicators(this.gameBoard.currentPlayer, discardCard.color);

                    // Check flags.
                    let colorChange = false;
                    let skipTurn = false;
                    let mustDraw = false;
                    if(this.flags2.playerDraws2)     { mustDraw = true; }
                    if(this.flags2.playerSkipped)    { skipTurn = true; }
                    if(this.flags2.playerReverse)    { skipTurn = true; }
                    if(this.flags2.playerDraws4)     { mustDraw = true; }
                    if(this.flags2.playerColorChange){ colorChange = true; mustDraw = false; }

                    // COLOR CHANGE: NOTE: This would only happen on the first turn. 
                    if(colorChange){
                        // Show the color changer message.
                        this.colorChanger.show();
                        this.resetFlags();
                    }

                    // DRAW
                    else if(mustDraw){
                        if     (this.flags2.playerDraws2){
                            this.action_draw({playerKey: this.gameBoard.currentPlayer, numCards: 2, msgName: "d2LoseTurn", endDelay: 30});
                        }
                        else if(this.flags2.playerDraws4){
                            this.action_draw({playerKey: this.gameBoard.currentPlayer, numCards: 4, msgName: "d4LoseTurn", endDelay: 30});
                        }
                        this.resetFlags();
                    }

                    // SKIP/REVERSE
                    else if(skipTurn){
                        if(this.flags2.playerReverse){
                            this.action_reverse({playerKey: this.gameBoard.currentPlayer, msgName: "reversed", endDelay: 90});
                        }
                        else if(this.flags2.playerSkipped){
                            this.action_skip({playerKey: this.gameBoard.currentPlayer, msgName: "skipLoseTurn", endDelay: 90});
                        }
                        this.resetFlags();
                    }

                    // THE PLAYER CAN CONTINUE THE ROUND.
                    else{
                        // Clear the no longer needed timer keys.
                        _APP.shared.genTimer.removeFinished(null, this.timerKeysKeep);

                        // Reset flags. 
                        this.resetFlags();

                        // Set flags to playerTurn.
                        this.flags2.playerTurn_start = false;
                        this.flags2.playerTurn = true;

                        // Set initial row.
                        // Cards face-up.
                        // Activate/position cursor.
                    }
                }
                else if(this.flags2.playerTurn){
                    // console.log("run many.", "playerTurn!", this.gameBoard.currentPlayer);

                    // Pause Menu?
                    // Reset round
                    // Exit game
                    // Auto play
                    // Cancel (default)

                    // Move cursor.
                    // Animate cursor.
                    // Attempt to play a card.
                    // Attempt to pass a turn.
                    // Change the displayed row?

                    // Set flags (for the next player) based on player card choice?
                    // this.flags2.playerDraws2
                    // this.flags2.playerSkipped
                    // this.flags2.playerReverse
                    // this.flags2.playerDraws4

                    // Did the player play a wild card?
                    // Does the player only have one card left? (UNO!)
                    // Does the player have 0 card left? (WIN!)

                    // Flip the player's cards face-down.

                    // Set the next player.

                    // Is the game on AUTOPLAY?
                    // Is the player the CPU?
                    // Is the player a HUMAN?

                }
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
            else if(_APP.game.gs2 == "endOfRound"){
            }
        }

        if(_APP.debugActive){ this.debug(gpInput); }
    },

    // Should be called by the game loop.
    // Calls debug functions specific to this gamestate.
    debug: function(gpInput){
        // DEBUG CURSOR.
        // _GFX.layerObjs.getOne("debugCursor").nextFrame();
        // if(gpInput.P1.held.BTN_SR && gpInput.P1.press.BTN_UP)   { _GFX.layerObjs.getOne("debugCursor").y--; }
        // if(gpInput.P1.held.BTN_SR && gpInput.P1.press.BTN_DOWN) { _GFX.layerObjs.getOne("debugCursor").y++; }
        // if(gpInput.P1.held.BTN_SR && gpInput.P1.press.BTN_LEFT) { _GFX.layerObjs.getOne("debugCursor").x--; }
        // if(gpInput.P1.held.BTN_SR && gpInput.P1.press.BTN_RIGHT){ _GFX.layerObjs.getOne("debugCursor").x++; }

        if(_APP.debugActive && _DEBUG2){ _DEBUG2.debugGamestate.run(_APP.game.gs1, _APP.game.gs2)}
    },
};