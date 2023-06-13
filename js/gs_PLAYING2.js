(() => {
    const funcs = {
        movementSpeeds:{
            // GetFirstPlayer.
            dealOneCard  : 20, // Dealing (this.flags.dealing)
            returnOneCard: 30, // Returning (this.flags.determineHighestCard)
            dealingMany  : 10, // Deal hands (this.flags.dealing_firstTurn)

            // playerTurn
            unselectCard: 30,
            selectCard  : 10,
            playCard    : 20,
            draw2       : 20,
            draw4       : 15,
        },

        resetFlags: function(){
            // Reset flags.
            this.flags2.playerTurn_start = false;
            this.flags2.playerTurn = false
            this.flags2.playerDraws2 = false;
            this.flags2.playerSkipped = false;
            this.flags2.playerReverse = false;
            this.flags2.playerDraws4 = false;
            this.flags2.playerColorChange = false;
        },

        gamestart: function() {
            // Shuffle the deck.
            this.deck.shuffleDeck();

            // Set next gs2.
            _APP.game.gs2 = "getFirstPlayer";

            // Set dealing flag.
            this.flags.dealing = true;
        },
        getFirstPlayer: function() {
            // Handle dealing of a card to each active player.
            if(this.flags.dealing){
                // Get the next card in the deck and assign to the player.
                let card = this.deck.getNextCardFromDrawpile();
                card.location = Deck.playerCardLocations[this.gameBoard.currentPlayer];

                let layerObjKey = `${this.gameBoard.currentPlayer}_card_2`;
                let cardLayerObj = _GFX.layerObjs.getOne(layerObjKey);
                cardLayerObj.change_wholeCard("sm", card.color, card.value);

                // Start deal animation.
                _APP.game.gamestates.gs_PLAYING.addCardMovement(
                    "draw"  , { 
                        timerKey   : "moveDrawToCard"+`${this.gameBoard.currentPlayer}_card_2`   , 
                        timerFrames: 10,
                        movementSpeed: this.movementSpeeds.dealOneCard,
                        playerKey  : this.gameBoard.currentPlayer  , 
                        layerObjKey: `${this.gameBoard.currentPlayer}_card_2`,
                        cardSlot   : 2,
                        finish: function(){ 
                            this.card.change_wholeCard("sm", card.color, card.value); 
                            _APP.shared.genTimer.removeOne(this.timerKey, null);
                        }
                });

                // Update the player text (ignoring the win and uno states.)
                this.gameBoard.updatePlayerText(true);

                // Change to next player.
                this.gameBoard.setNextPlayer();

                // Repeat until a card has been assigned to each active player. (Back to the first active player again.)
                if(this.gameBoard.currentPlayer == this.gameBoard.activePlayerKeys[0]){
                    this.flags.dealing = false;
                    this.flags.determineHighestCard = true;
                    _APP.shared.genTimer.create("genWaitTimer1", 60, _APP.game.gs1, null);
                }
            }
            else if(this.flags.determineHighestCard){
                // Determine which card has the highest points value. If there is a tie for the winner then repeat flags.dealing again.
                let winner = { points: 0, playerKeys: [], }
                for(let playerKey of this.gameBoard.activePlayerKeys){
                    let location = Deck.playerCardLocations[playerKey];
                    let card = this.deck.deck.find(d=>d.location == location);
                    let points = Deck.cardPoints[card.value];
                    if(points > winner.points){
                        winner.points = points;
                        winner.playerKeys = [playerKey];
                    }
                    else if(points == winner.points){
                        winner.playerKeys.push(playerKey);
                    }
                }

                // DEBUG: Force the winner.
                // winner.playerKeys = ["P1"];

                // One winner?
                if(winner.playerKeys.length == 1){
                    // console.log("winner:", winner.playerKeys.length, winner.playerKeys);
                    this.flags.firstPlayer = winner.playerKeys[0];
                    this.flags.determineHighestCard = false;
                    this.flags.ready_determineHighestCard = true;
                    _APP.shared.genTimer.create("ready_determineHighestCard", 60);

                    // Display the player goes first message.
                    this.gameBoard.displayMessage("playsFirst", this.flags.firstPlayer, false);
                    this.gameBoard.setColorIndicators(this.flags.firstPlayer, "CARD_BLACK");
                }
                // Multiple tied winners.
                else{
                    // console.log("tied winners:", winner.playerKeys.length, winner.playerKeys);
                    this.flags.determineHighestCard = false;
                    this.flags.tied_determineHighestCard = true;
                    _APP.shared.genTimer.create("tied_determineHighestCard", 60);

                    // Display the tied message.
                    this.gameBoard.displayMessage("tied", "", false);
                }

                // Return the cards to the draw pile.
                _APP.shared.genTimer.create("genWaitTimer1", 10);
                for(let playerIndex in this.gameBoard.activePlayerKeys){
                    let playerKey = this.gameBoard.activePlayerKeys[playerIndex];
                    _APP.shared.funcQueue.create(`discard_${playerKey}_card_2`, _APP.game.gs1, {
                        args: [playerKey],
                        bind: this,
                        func: function(playerKey){
                            let _this = this;
                            _APP.game.gamestates.gs_PLAYING.addCardMovement(
                                "discard"  , { 
                                    timerKey   : "moveCardToDiscard"+`${playerKey}_card_2`   , 
                                    timerFrames: 0,
                                    movementSpeed: _this.movementSpeeds.returnOneCard,
                                    playerKey  : playerKey  , 
                                    layerObjKey: `${playerKey}_card_2`,
                                    cardSlot   : 2,
                                    finish: function(){ 
                                        // Find the first instance of this card in the deck.
                                        let cardInDeck = _this.deck.deck.find(d=>
                                            d.color==this.card.color && 
                                            d.value==this.card.value && 
                                            d.location != "CARD_LOCATION_DISCARD" &&
                                            d.location != "CARD_LOCATION_DRAW"
                                        );
                                        // Change the location to discard.
                                        cardInDeck.location = "CARD_LOCATION_DISCARD";
                                        
                                        // Set the card LayerObject to hidden.
                                        let cardObj = this.card;
                                        cardObj.hidden = true;
                                        
                                        // Use the card LayerObject to update the displayed discard card.
                                        _this.deck.updateDiscardCard(this.card);
        
                                        // Unhide the discard card.
                                        _GFX.layerObjs.getOne("discard_card").hidden = false;
        
                                        _APP.shared.genTimer.removeOne(this.timerKey, null);
                                    }
                                }
                            );
                        }
                    });
                }
            }
            else if(this.flags.ready_determineHighestCard){
                // Wait for the timer to finish before going back to dealing for first player.
                if(_APP.shared.genTimer.check("ready_determineHighestCard")){
                    this.gameBoard.displayMessage("none", "", false);
                    this.deck.resetDeck();
                    this.deck.shuffleDeck();
                    this.flags.ready_determineHighestCard = false;
                    this.flags.dealing_firstTurn = true;
                    this.flags.dealing_firstTurnCardPos    = 0;

                    // Hide the discard card.
                    _GFX.layerObjs.getOne("discard_card").hidden = true;
                }
            }
            else if(this.flags.tied_determineHighestCard){
                // Wait for the timer to finish before going back to dealing for first player.
                if(_APP.shared.genTimer.check("tied_determineHighestCard")){
                    this.gameBoard.displayMessage("none", "", false);
                    this.flags.dealing = true;
                    // this.deck.resetDeck();
                    // this.deck.shuffleDeck();
                    this.flags.tied_determineHighestCard = false;
                }
            }
            else if(this.flags.dealing_firstTurn){
                // console.log("this.flags.dealing_firstTurnCardPos:", this.flags.dealing_firstTurnCardPos);

                // Get the next card in the deck and assign to the player.
                let card = this.deck.getNextCardFromDrawpile();
                card.location = Deck.playerCardLocations[this.gameBoard.currentPlayer];
                let layerObjKey = `${this.gameBoard.currentPlayer}_card_${this.flags.dealing_firstTurnCardPos}`;
                _GFX.layerObjs.getOne(layerObjKey).change_wholeCard("sm", "CARD_BLACK", "CARD_BACK"); ;
                // console.log("Dealing for the first turn!", "layerObjKey:", layerObjKey);

                // Start deal animation.
                _APP.game.gamestates.gs_PLAYING.addCardMovement(
                    "draw"  , { 
                        timerKey   : "moveDrawToCard_"+layerObjKey   , 
                        timerFrames: 0,
                        movementSpeed: this.movementSpeeds.dealingMany,
                        playerKey  : this.gameBoard.currentPlayer  , 
                        layerObjKey: `${this.gameBoard.currentPlayer}_card_${this.flags.dealing_firstTurnCardPos}`,
                        cardSlot   : this.flags.dealing_firstTurnCardPos,
                        finish: function(){ 
                            // this.card.change_wholeCard("sm", "CARD_BLACK", "CARD_BACK"); 
                            // console.log("DONE:", this.card.layerObjKey);
                            _APP.shared.genTimer.removeOne(this.timerKey, null);
                        }
                });

                // Change to next player.
                this.gameBoard.setNextPlayer();

                // Repeat until a card has been assigned to each active player. (Back to the first active player again.)
                if(this.gameBoard.currentPlayer == this.gameBoard.activePlayerKeys[0]){
                    // console.log("done?", this.gameBoard.currentPlayer, this.gameBoard.activePlayerKeys[0], this.flags.dealing_firstTurnCardPos);
                    
                    // Last card?
                    if(1+this.flags.dealing_firstTurnCardPos >= 5){
                        this.flags.dealing_firstTurn = false;

                        // console.log("cards deal timer started");
                        _APP.shared.genTimer.create("genWaitTimer1", 60, _APP.game.gs1, ()=>{
                            // Get the next card in the deck and assign to the discard pile.
                            // The first card cannot be wild draw 4. 
                            let location_DRAW    = this.deck.deck.filter(d => d.location == "CARD_LOCATION_DRAW" && d.value != "CARD_WILD_DRAW4");
                            // let discardCard = location_DRAW[0];
                            let discardCard = this.deck.deck.find(d => 
                                d.location == "CARD_LOCATION_DRAW" && 
                                // d.value == "CARD_WILD_DRAW4"
                                d.value == "CARD_DRAW2"
                                // d.value == "CARD_SKIP"
                                // d.value == "CARD_REV"
                                // d.value == "CARD_WILD"
                            );
                            discardCard.location = "CARD_LOCATION_DISCARD";
                            
                            // Display the discard card.
                            this.deck.updateDiscardCard(discardCard);

                            // Change the position of the discard card to the draw pile and hide it.
                            let cardObj = _GFX.layerObjs.getOne("discard_card");
                            cardObj.x = Deck.drawPos[0];
                            cardObj.y = Deck.drawPos[1];
                            cardObj.hidden = false; 

                            // Add a movement to move the card from the draw pile to the discard pile. 
                            _APP.game.gamestates.gs_PLAYING.addCardMovement(
                                "discard"  , { 
                                    timerKey     : `moveCardInitialDiscard`, 
                                    timerFrames  : 20,
                                    movementSpeed: this.movementSpeeds.dealOneCard,
                                    layerObjKey  : `discard_card`,
                                    finish       : function(){ _APP.shared.genTimer.removeOne(this.timerKey, null); }
                            });

                            _APP.shared.genTimer.create("genWaitTimer1", 60, _APP.game.gs1, ()=>{
                                this.gameBoard.currentPlayer = this.flags.firstPlayer;
                                this.gameBoard.setColorIndicators(this.gameBoard.currentPlayer, discardCard.color);
                                
                                this.flags2.playerDraws2  = false;
                                this.flags2.playerSkipped = false;
                                this.flags2.playerReverse = false;
                                this.flags2.playerDraws4  = false;
                                this.flags2.playerColorChange = false;
                                if     (discardCard.value == "CARD_DRAW2")     { this.flags2.playerDraws2  = true; }
                                else if(discardCard.value == "CARD_SKIP")      { this.flags2.playerSkipped = true; }
                                else if(discardCard.value == "CARD_REV")       { this.flags2.playerReverse = true; }
                                else if(discardCard.value == "CARD_WILD")      { this.flags2.playerColorChange = true; }
                                else if(discardCard.value == "CARD_WILD_DRAW4"){ this.flags2.playerDraws4  = true; this.flags2.playerColorChange = true; }
    
                                // Change gamestate 2.
                                _APP.game.changeGs2("playerTurn");
    
                                // Set playerTurn_start (init) for playerTurn.
                                this.flags2.playerTurn_start = true;

                                // Clear the no longer needed timer keys.
                                _APP.shared.genTimer.removeFinished(null, this.timerKeysKeep);
                            });
                        });
                    }
                    else{
                        // console.log("nope! continue", JSON.stringify(this.flags));
                        this.flags.dealing_firstTurnCardPos += 1;
                    }
                }

                this.gameBoard.updatePlayerText();
                this.deck.updateUnderPiles();
            }
        },

        // Actions based on cards: WILD, WILD_DRAW4, DRAW2, SKIP, REVERSE
        action_changeColor: function(gp_input){
            this.colorChanger.nextFrame();
            if(gp_input.P1.release.BTN_LEFT) { this.colorChanger.moveCursor(-1); }
            if(gp_input.P1.release.BTN_RIGHT){ this.colorChanger.moveCursor(1); }
            if(gp_input.P1.release.BTN_A)    { 
                // Set flags to continue the player's turn after the colorChange has completed.
                this.flags2.playerTurn_start = false;
                this.flags2.playerTurn = true;

                // Accept the color change.
                this.colorChanger.accept(); 
            }
        },
        action_draw: function(config){
            /*
                let config = {
                    endDelay: 30,
                    playerKey: "P1",
                    numCards: 2,
                    msgName: "d2LoseTurn",
                    // msgName: "d4LoseTurn",
                };
            */

            // Ensure that the number of cards specified is valid.
            if( !(config.numCards >= 1 && config.numCards < 4) ){
                console.error("ERROR");
                return;
            }
            
            // Display the message if specified.
            if     (config.msgName == "d2LoseTurn"){ this.gameBoard.displayMessage("d2LoseTurn"  , config.playerKey, false); }
            else if(config.msgName == "d4LoseTurn"){ this.gameBoard.displayMessage("d4LoseTurn"  , config.playerKey, false); }

            // Queue the individual draw card functions.
            for(let i=0; i<config.numCards; i+=1){
                _APP.shared.funcQueue.create(`drawCard_${i+1}_of_${config.numCards}`, _APP.game.gs1, {
                    args: [config.playerKey, 0],
                    bind: this,
                    func: function(playerKey, cardSlot){
                        // Get the temp_card.
                        let tempCard = _GFX.layerObjs.getOne("temp_card");
                
                        // Set the initial location to the draw pile.
                        tempCard.x = Deck.drawPos[0]; 
                        tempCard.y = Deck.drawPos[1];
                        
                        // Set the rotation for the temp_card to match the player card rotation.
                        tempCard.setSetting("rotation", Deck.playerCardRotations[playerKey]);
                
                        // Unhide the temp-card.
                        tempCard.hidden = false;

                        let _this = this;
                        _APP.game.gamestates.gs_PLAYING.addCardMovement(
                            "draw"  , { 
                                timerKey     : "moveDrawToCard_"+`${playerKey}`, 
                                timerFrames  : 10,
                                movementSpeed: _this.movementSpeeds.draw2,
                                playerKey    : playerKey  , 
                                layerObjKey  : "temp_card",
                                cardSlot     : cardSlot,
                                finish: function(){ 
                                    tempCard.hidden = true;
                                    let newCard = _this.deck.getNextCardFromDrawpile();
                                    newCard.location = Deck.playerCardLocations[playerKey];
                                    _APP.shared.genTimer.removeOne(this.timerKey, null);
                                }
                            }
                        );
                        
                    }
                });
            }

            // Add the removal of the displayed message.
            // Also end the player's turn.
            _APP.shared.funcQueue.create(`removeDrawMessage_${config.numCards}`, _APP.game.gs1, {
                args: [],
                bind: this,
                func: function(){
                    // Set flags and change to the next player.
                    this.flags2.playerTurn_start = true;
                    this.flags2.playerTurn = false;
                    this.gameBoard.setNextPlayer();
                    
                    // Add a delay before continuing?
                    if(config.endDelay){
                        // Wait to clear the message.
                        _APP.shared.genTimer.create("drawWait", config.endDelay, _APP.game.gs1, ()=>{
                            if(config.msgName){
                                this.gameBoard.displayMessage("none", this.gameBoard.currentPlayer, false);
                            }
                        });
                    }
                    // Clear the message immediately.
                    else if(config.msgName){
                        this.gameBoard.displayMessage("none", this.gameBoard.currentPlayer, false);
                    }
                },
            });
        },
        action_skip: function(config){
            // Display the message if specified.
            if     (config.msgName == "skipLoseTurn"){ this.gameBoard.displayMessage("skipLoseTurn"  , config.playerKey, false); }

            // Add the removal of the displayed message.
            // Also end the player's turn.
            _APP.shared.funcQueue.create(`removeSkipMessage_${config.numCards}`, _APP.game.gs1, {
                args: [],
                bind: this,
                func: function(){
                    // Set flags and change to the next player.
                    this.flags2.playerTurn_start = true;
                    this.flags2.playerTurn = false;
                    this.gameBoard.setNextPlayer();
                    
                    // Add a delay before continuing?
                    if(config.endDelay){
                        // Wait to clear the message.
                        _APP.shared.genTimer.create("skipWait", config.endDelay, _APP.game.gs1, ()=>{
                            if(config.msgName){
                                this.gameBoard.displayMessage("none", this.gameBoard.currentPlayer, false);
                            }
                        });
                    }
                    // Clear the message immediately.
                    else if(config.msgName){
                        this.gameBoard.displayMessage("none", this.gameBoard.currentPlayer, false);
                    }
                },
            });
        },
        action_reverse: function(config){
            // Display the message if specified.
            if     (config.msgName == "reversed"){ this.gameBoard.displayMessage("reversed"  , config.playerKey, false); }
    
            // Add the removal of the displayed message.
            // Also end the player's turn.
            _APP.shared.funcQueue.create(`removeReverseMessage_${config.numCards}`, _APP.game.gs1, {
                args: [],
                bind: this,
                func: function(){
                    // Flip the direction.
                    this.gameBoard.flipDirectionIndicators();

                    // Set flags and change to the next player.
                    this.flags2.playerTurn_start = true;
                    this.flags2.playerTurn = false;
                    this.gameBoard.setNextPlayer();
                    
                    // Add a delay before continuing?
                    if(config.endDelay){
                        // Wait to clear the message.
                        _APP.shared.genTimer.create("reverseWait", config.endDelay, _APP.game.gs1, ()=>{
                            if(config.msgName){
                                this.gameBoard.displayMessage("none", this.gameBoard.currentPlayer, false);
                            }
                        });
                    }
                    // Clear the message immediately.
                    else if(config.msgName){
                        this.gameBoard.displayMessage("none", this.gameBoard.currentPlayer, false);
                    }
                },
            });
        },

        //
        moveToDiscard: function(config){
        },
    };
    
    const assign = function() {
        // Get all the keys of funcs.
        let keys = Object.keys(funcs);

        // Get the destination for the contents of "funcs."
        let newParent = _APP.game.gamestates["gs_PLAYING"];
        
        // For each key in funcs...
        for(let i = 0, len = keys.length; i < len; i++) {
            // If the type is "function" assign but also bind to the destination parent.
            if(typeof funcs[keys[i]] === "function"){
                newParent[keys[i]] = funcs[keys[i]].bind(newParent);
            }
            // Otherwise just copy.
            else{
                newParent[keys[i]] = funcs[keys[i]];
            }
        }

        // Remove the values here. They have been copied.
        delete funcs;
        delete assign;
    };
    
    assign();
})();
