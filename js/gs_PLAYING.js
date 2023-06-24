_APP.game.gamestates["gs_PLAYING"] = {
    gameSettings: {
        P1  : "HUMAN",
        P2  : "HUMAN",
        P3  : "NONE",
        P4  : "NONE",
        WIN : "atZeroCards", // ["at500pts", "atZeroCards"]
        // WIN : "at500pts", // ["at500pts", "atZeroCards"]
        DRAW: "one",         // ["one", "until"]
    },
    
    startScores: {
        P1: 0,
        P2: 0,
        P3: 0,
        P4: 0,
    },
    gameBoard   : null,
    deck        : null,
    colorChanger: null,
    pauseMenu   : null,

    // Array of timer keys that should remain after clearing finished timers.
    timerKeysKeep : [
        "genWaitTimer1", 
        "genWaitTimer2", 
        "discardWait", 
        "drawWait", 
        "skipWait", 
        "reverseWait", 
        "endOfTurnWait",
    ],

    movementSpeeds:{
        // GetFirstPlayer:
        dealOneCard  : 15, // 20, // Dealing (this.flags.getFirstPlayer.highCardDeal)
        returnOneCard: 20, // 30, // Returning (this.flags.getFirstPlayer.checkHighCard)
        dealingMany  : 10, // 10, // Deal hands (this.flags.getFirstPlayer.initDeal)

        // playerTurn:
        unselectCard: 30,
        selectCard  : 10,
        playCard    : 20,
        draw2       : 20,
        draw4       : 15,

        // Scoring:
        scoreCardReturn: 20,
    },
    
    timerDelays: {
        cannotPlayCard : 50,
        endOfTurn      : 20,
        unselectCard   : 10,
        winsRound      : 120,
        scoreCardReturn: 20,
    },

    cardMovements: [],
    flags: {
        getFirstPlayer: {
            highCardDeal : false, // Flag
            checkHighCard: false, // Flag
            goesFirst    : ""   , // Var
            tied         : false, // Flag
            highCard_end : false, // Flag
            initDeal     : false, // Flag
            initDealPos  : false, // Var
        },
        playerTurn     : {
            play_init    : false, // Flag
            playing      : false, // Flag
            card_select  : false, // Flag
            card_selected: false, // Flag
            play_pass    : false, // Flag
        },
        endOfRound    : {
            active      : false, // Flag
            colorChange : false, // Flag
            setNextFlags: false, // Flag
        },
        nextRoundFlags: {
            skipFlagCheck: false, // Flag
            draw2        : false, // Flag
            skip         : false, // Flag
            reverse      : false, // Flag
            draw4        : false, // Flag
            colorChange  : false, // Flag
        },
        winsRound: {
            init        : false, // Flag
            scoring     : false, // Flag
            // currentPlayerKey: "", // Var
            checkGameWin: false, // Flag
            GameWin     : false, // Flag
            nextRound   : false, // Flag
        }
    },
    debugFlags: {
        // Value of false means not active. 
        // Value of true or a non-empty string value means active.

        skipCardValidityCheck   : false, // Allows any card to be played (No validation check.)
        showAllPlayerCardsFaceUp: false, // Shows all player cards face up at the start of each turn.
        forcedWinner            : "", // (example: "P1") Forces this player to be the winner of the first turn.
        forcedWinnerOnTie       : "", // (example: "P1") On tie this or the first active player will be set as the winner as the first turn.
        
        forcedFirstDiscard: false,             // (example: "CARD_9") Forces the value of the initial discard. Can be any valid card value (may arrive as any color.)
        // forcedFirstDiscard: 'CARD_9',          // (example: "CARD_9") Forces the value of the initial discard. Can be any valid card value (may arrive as any color.)
        // forcedFirstDiscard: 'CARD_WILD',       // (example: "CARD_9") Forces the value of the initial discard. Can be any valid card value (may arrive as any color.)
        // forcedFirstDiscard: 'CARD_DRAW2',      // (example: "CARD_9") Forces the value of the initial discard. Can be any valid card value (may arrive as any color.)
        // forcedFirstDiscard: 'CARD_SKIP',       // (example: "CARD_9") Forces the value of the initial discard. Can be any valid card value (may arrive as any color.)
        // forcedFirstDiscard: 'CARD_REV',        // (example: "CARD_9") Forces the value of the initial discard. Can be any valid card value (may arrive as any color.)
        // forcedFirstDiscard: 'CARD_WILD_DRAW4', // (example: "CARD_9") Forces the value of the initial discard. Can be any valid card value (may arrive as any color.)
    },
    lastCardPlayed : null, 
    lastDrawnCard : null, 
    winningPlayerKey: "",

    // Run once upon changing to this game state.
    init: function(){
        // Clear the screen and the graphics caches.
        _GFX.funcs.clearAllLayers(true);
        _GFX.layerObjs.removeAll(_APP.game.gs1_prev);
        _GFX.layerObjs.removeAll(_APP.game.gs1);

        // Set the L1 background color.
        _GFX.funcs.updateL1BgColorRgba([32,32,48,255]);

        // Turn off any existing global fades.
        _GFX.funcs.setFade("ALL", null);

        // Create the deck.
        this.deck = new Deck({ 
            parent: this, 
        });

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

        // Clear cardMovements.
        this.cardMovements = [];

        // Clear funcQueue.
        _APP.shared.funcQueue.clearQueue(_APP.game.gs1);

        // Init the gameBoard and the deck.
        this.gameBoard.initPlayers(this.startScores);
        this.gameBoard.currentPlayer = "P1";
        this.gameBoard.setDirectionIndicators("F");
        this.gameBoard.updatePlayerText(true);
        this.deck.storeGameBoard(this.gameBoard);
        this.deck.createCardPlaceholders();

        // Create the pauseMenu menu.
        this.pauseMenu = new PauseMenu({
            parent       : this,
        });

        // Create general wait timers.
        _APP.shared.genTimer.create("genWaitTimer1", 0); // Used by: [ getFirstPlayer, ]
        _APP.shared.genTimer.create("genWaitTimer2", 0); // Used by: [ ]
        _APP.shared.genTimer.create("discardWait", 0);   // Used by: [ ]
        _APP.shared.genTimer.create("drawWait", 0);      // Used by: [ action_draw, ]
        _APP.shared.genTimer.create("skipWait", 0);      // Used by: [ action_skip, ]
        _APP.shared.genTimer.create("reverseWait", 0);   // Used by: [ action_reverse, ]
        _APP.shared.genTimer.create("endOfTurnWait", 0); // Used by: [ ]
        
        this.lastCardPlayed   = null,
        this.lastDrawnCard    = null,
        this.winningPlayerKey = "";

        // Run the debug2 init.
        if(_APP.debugActive && _DEBUG2){ 
            _DEBUG2.debugGamestate.uninit(_APP.game.gs1, _APP.game.gs2_new); 
        }

        // Unset the debug flags if the game was not started in debug mode.
        if(!_APP.debugActive){
            for(let key in this.debugFlags){ this.debugFlags[key] = false; }
        }

        // Reset game flags.
        this.resetFlags();

        // Set gamestate 2.
        _APP.game.changeGs2("gamestart");

        // Set the inited flag.
        this.inited = true;
    },

    // Main function of this game state. Calls other functions/handles logic, etc.
    main: function(){
        // Run init and return if this gamestate is not yet inited.
        if(!this.inited){ this.init(); return; }

        // Gamepad input.
        let gpInput = _APP.shared.getAllGamepadStates();
        
        // Pause menu activation/deactivation?
        if(_APP.game.gs2 != "winner" && gpInput.ANY.press.BTN_START)  { 
            if(this.pauseMenu.active){ this.pauseMenu.hide(); }
            else                     { this.pauseMenu.show(); }
        }

        // Pause menu active?
        else if(this.pauseMenu.active){ this.action_pauseMenu(gpInput); }

        // Are there any card movement animations active? (blocking to the rest of the game loop until complete.)
        else if(this.cardMovements.length){ this.handleCardMovements(); }
        
        // Queued functions.
        else if(!_APP.shared.funcQueue.runNext(_APP.game.gs1)){}
        
        // Wait? (specific) 
        else if(!_APP.shared.genTimer.check("discardWait"))  {}
        else if(!_APP.shared.genTimer.check("drawWait"))     {}
        else if(!_APP.shared.genTimer.check("skipWait"))     {}
        else if(!_APP.shared.genTimer.check("reverseWait"))  {}
        else if(!_APP.shared.genTimer.check("endOfTurnWait")){}

        // Wait? (general) 
        else if(!_APP.shared.genTimer.check("genWaitTimer1")){} 
        else if(!_APP.shared.genTimer.check("genWaitTimer2")){} 

        // Color changer.
        else if(this.colorChanger.active){ this.action_changeColor(gpInput); }

        // 
        else {
            // This runs at the start of each round. 
            if     (_APP.game.gs2 == "gamestart")     { this.gamestart(); }
            
            // This runs at the start of each round. 
            else if(_APP.game.gs2 == "getFirstPlayer"){ this.getFirstPlayer(); }
            
            // This runs every round. 
            else if(_APP.game.gs2 == "playerTurn"){
                if     (this.flags.playerTurn.play_init){ this.playerTurn_start(); }
                else if(this.flags.playerTurn.playing)  { this.playerTurn(gpInput); }
                else if(this.flags.endOfRound.active)   { this.endOfRound(gpInput); }
            }

            // This runs after the end of a round when there is a winner.
            else if(_APP.game.gs2 == "winner"){ this.winsRound(gpInput); }
        }

        if(_APP.debugActive){ this.debug(); }
    },

    // Should be called by the game loop.
    // Calls debug functions specific to this gamestate.
    debug: function(){
        if(_APP.debugActive && _DEBUG2){ _DEBUG2.debugGamestate.run(_APP.game.gs1, _APP.game.gs2)}
    },

    // State of card movements.
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
        else if(type == "score"){
            cardMovement.func = "moveCardToScoring";
            cardMovement.start = function(){
                _APP.shared.genTimer.create(cardMovement.timerKey, cardMovement.timerFrames);
                cardMovement.timer = _APP.shared.genTimer.get(cardMovement.timerKey);
                cardMovement.card = _GFX.layerObjs.getOne(cardMovement.layerObjKey);
                cardMovement.card.moveCardToScoring( cardMovement.movementSpeed ); 
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
};