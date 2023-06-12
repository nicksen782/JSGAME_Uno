(() => {
    const funcs = {
        gamestart: function() {
            // Shuffle the deck.
            this.deck.shuffleDeck();

            // Set next gs2.
            _APP.game.gs2 = "getFirstPlayer";

            // Set dealing flag.
            this.flags.dealing = true;
        },
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

                let func = (playerKey)=>{
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
                };

                // Return the cards to the draw pile.
                _APP.shared.genTimer.create("genWaitTimer1", 10);
                for(let playerIndex in this.gameBoard.activePlayerKeys){
                    let playerKey = this.gameBoard.activePlayerKeys[playerIndex];
                    if(playerIndex == 0){ _APP.shared.genTimer.create("genWaitTimer2", 1, _APP.game.gs1, ()=>{ func.bind(this)(playerKey); }) }
                    if(playerIndex == 1){ _APP.shared.genTimer.create("genWaitTimer3", 1, _APP.game.gs1, ()=>{ func.bind(this)(playerKey); }) }
                    if(playerIndex == 2){ _APP.shared.genTimer.create("genWaitTimer4", 1, _APP.game.gs1, ()=>{ func.bind(this)(playerKey); }) }
                    if(playerIndex == 3){ _APP.shared.genTimer.create("genWaitTimer5", 1, _APP.game.gs1, ()=>{ func.bind(this)(playerKey); }) }
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
                        timerKey   : "moveDrawToCard"+layerObjKey   , 
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
                                // d.value == "CARD_DRAW2"
                                // d.value == "CARD_SKIP"
                                d.value == "CARD_REV"
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
                                    timerKey     : "moveCardToDiscard" + `_initialDiscard`, 
                                    timerFrames  : 20,
                                    movementSpeed: this.movementSpeeds.dealOneCard,
                                    layerObjKey  : `discard_card`,
                                    finish       : function(){ _APP.shared.genTimer.removeOne(this.timerKey, null); }
                            });

                            _APP.shared.genTimer.create("genWaitTimer2", 60, _APP.game.gs1, ()=>{
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
                                else if(discardCard.value == "CARD_WILD")      { this.flags2.playerDraws4  = true; this.flags2.playerColorChange = true; }
                                else if(discardCard.value == "CARD_WILD_DRAW4"){ this.flags2.playerDraws4  = true; this.flags2.playerColorChange = true; }
    
                                // Change gamestate 2.
                                _APP.game.changeGs2("playerTurn");
    
                                // Set playerTurn_start (init) for playerTurn.
                                this.flags2.playerTurn_start = true;

                                // Clear the no longer needed timer keys.
                                // _APP.shared.genTimer.removeOne("tied_determineHighestCard", null);
                                // _APP.shared.genTimer.removeOne("ready_determineHighestCard", null);
                                _APP.shared.genTimer.removeFinished(null, ["genWaitTimer1", "genWaitTimer2", , "genWaitTimer3", , "genWaitTimer4", , "genWaitTimer5", "genWaitTimer6"]);
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

        action_draw: function(playerKey, numCards){
            // Ready the temp_card for use.
            let tempCard = _GFX.layerObjs.getOne("temp_card");
            // Set the initial location to the draw pile.
            tempCard.x = Deck.drawPos[0]; 
            tempCard.y = Deck.drawPos[1];
            // Set the rotation to match the player card rotation.
            tempCard.setSetting("rotation", Deck.playerCardRotations[playerKey]);
            tempCard.hidden = false;

            let func = (playerKey)=>{
                let _this = this;
                _APP.game.gamestates.gs_PLAYING.addCardMovement(
                    "draw"  , { 
                        timerKey   : "moveDrawToCard"+`${playerKey}`   , 
                        timerFrames: 10,
                        movementSpeed: _this.movementSpeeds.draw2,
                        playerKey  : playerKey  , 
                        layerObjKey: "temp_card", // `${playerKey}_card_2`,
                        cardSlot   : 0,
                        finish: function(){ 
                            tempCard.hidden = true;
                            let newCard = _this.deck.getNextCardFromDrawpile();
                            newCard.location = Deck.playerCardLocations[playerKey];
                            // console.log(newCard);
                            _APP.shared.genTimer.removeOne(this.timerKey, null);
                        }
                    }
                );
            };

            if(numCards == 1){
                _APP.shared.genTimer.create("genWaitTimer2", 1, _APP.game.gs1, ()=>{ func.bind(this)(playerKey); }); 
            }
            if(numCards == 2){
                _APP.shared.genTimer.create("genWaitTimer2", 1, _APP.game.gs1, ()=>{ func.bind(this)(playerKey); }); 
                _APP.shared.genTimer.create("genWaitTimer3", 1, _APP.game.gs1, ()=>{ func.bind(this)(playerKey); }); 
            }
            else if(numCards == 3){
                _APP.shared.genTimer.create("genWaitTimer2", 1, _APP.game.gs1, ()=>{ func.bind(this)(playerKey); }); 
                _APP.shared.genTimer.create("genWaitTimer3", 1, _APP.game.gs1, ()=>{ func.bind(this)(playerKey); }); 
                _APP.shared.genTimer.create("genWaitTimer4", 1, _APP.game.gs1, ()=>{ func.bind(this)(playerKey); }); 
            }
            else if(numCards == 4){
                _APP.shared.genTimer.create("genWaitTimer2", 1, _APP.game.gs1, ()=>{ func.bind(this)(playerKey); }); 
                _APP.shared.genTimer.create("genWaitTimer3", 1, _APP.game.gs1, ()=>{ func.bind(this)(playerKey); }); 
                _APP.shared.genTimer.create("genWaitTimer4", 1, _APP.game.gs1, ()=>{ func.bind(this)(playerKey); }); 
                _APP.shared.genTimer.create("genWaitTimer5", 1, _APP.game.gs1, ()=>{ func.bind(this)(playerKey); }); 
            }
            else{
                console.error("Invalid numCards for action_draw.");
            }
        },
        action_skip: function(playerKey){
        },
    };
    
    const assign = function() {
        // Get all the keys of funcs.
        let keys = Object.keys(funcs);
        let newParent = _APP.game.gamestates["gs_PLAYING"];
        
        for(let i = 0, len = keys.length; i < len; i++) {
            if(typeof funcs[keys[i]] === "function"){
                newParent[keys[i]] = funcs[keys[i]].bind(newParent);
            }
            else{
                newParent[keys[i]] = funcs[keys[i]];
            }
        }
    };
    
    assign();
})();
