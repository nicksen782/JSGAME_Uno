(() => {
    const funcs = {
        array: [],
        movementSpeeds:{
            // GetFirstPlayer.
            dealOneCard  : 20, // Dealing (this.flags.getFirstPlayer.highCardDeal)
            returnOneCard: 30, // Returning (this.flags.getFirstPlayer.checkHighCard)
            dealingMany  : 10, // Deal hands (this.flags.getFirstPlayer.initDeal)

            // playerTurn
            unselectCard: 30,
            selectCard  : 10,
            playCard    : 20,
            draw2       : 20,
            draw4       : 15,
        },

        resetFlags: function(){
            // Reset flags2.
            for(let key in this.flags2){ 
                this.flags2[key] = false;
            }

            // Reset flags.
            for(let key1 in this.flags){ 
                for(let key2 in this.flags[key1]){ 
                    let type = typeof this.flags[key1][key2];
                    if     (type === "boolean"){ this.flags[key1][key2] = 0;  }
                    else if(type === "string") { this.flags[key1][key2] = ""; }
                    else                       { this.flags[key1][key2] = false; }
                }
            }
        },

        gamestart: function() {
            // Shuffle the deck.
            this.deck.shuffleDeck();

            // Set next gs2.
            _APP.game.gs2 = "getFirstPlayer";

            // Set dealing flag.
            this.flags.getFirstPlayer.highCardDeal = true;
        },
        getFirstPlayer: function() {
            // Handle dealing of a card to each active player.
            if(this.flags.getFirstPlayer.highCardDeal){
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
                    this.flags.getFirstPlayer.highCardDeal = false;
                    this.flags.getFirstPlayer.checkHighCard = true;
                    _APP.shared.genTimer.create("genWaitTimer1", 60, _APP.game.gs1, null);
                }
            }
            else if(this.flags.getFirstPlayer.checkHighCard){
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
                    this.flags.getFirstPlayer.goesFirst = winner.playerKeys[0];
                    this.flags.getFirstPlayer.checkHighCard = false;
                    this.flags.getFirstPlayer.tied = true;
                    _APP.shared.genTimer.create("ready_determineHighestCard", 60);

                    // Display the player goes first message.
                    this.gameBoard.displayMessage("playsFirst", this.flags.getFirstPlayer.goesFirst, false);
                    this.gameBoard.setColorIndicators(this.flags.getFirstPlayer.goesFirst, "CARD_BLACK");
                }
                // Multiple tied winners.
                else{
                    // console.log("tied winners:", winner.playerKeys.length, winner.playerKeys);
                    this.flags.getFirstPlayer.checkHighCard = false;
                    this.flags.getFirstPlayer.highCard_end = true;
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
            else if(this.flags.getFirstPlayer.tied){
                // Wait for the timer to finish before going back to dealing for first player.
                if(_APP.shared.genTimer.check("ready_determineHighestCard")){
                    this.gameBoard.displayMessage("none", "", false);
                    this.deck.resetDeck();
                    this.deck.shuffleDeck();
                    this.flags.getFirstPlayer.tied = false;
                    this.flags.getFirstPlayer.initDeal = true;
                    this.flags.getFirstPlayer.initDealPos    = 0;

                    // Hide the discard card.
                    _GFX.layerObjs.getOne("discard_card").hidden = true;
                }
            }
            else if(this.flags.getFirstPlayer.highCard_end){
                // Wait for the timer to finish before going back to dealing for first player.
                if(_APP.shared.genTimer.check("tied_determineHighestCard")){
                    this.gameBoard.displayMessage("none", "", false);
                    this.flags.getFirstPlayer.highCardDeal = true;
                    // this.deck.resetDeck();
                    // this.deck.shuffleDeck();
                    this.flags.getFirstPlayer.highCard_end = false;
                }
            }
            else if(this.flags.getFirstPlayer.initDeal){
                // console.log("this.flags.getFirstPlayer.initDealPos:", this.flags.getFirstPlayer.initDealPos);

                // Get the next card in the deck and assign to the player.
                let card = this.deck.getNextCardFromDrawpile();
                card.location = Deck.playerCardLocations[this.gameBoard.currentPlayer];
                let layerObjKey = `${this.gameBoard.currentPlayer}_card_${this.flags.getFirstPlayer.initDealPos%5}`;
                _GFX.layerObjs.getOne(layerObjKey).change_wholeCard("sm", "CARD_BLACK", "CARD_BACK"); ;
                // console.log("Dealing for the first turn!", "layerObjKey:", layerObjKey);

                // Start deal animation.
                let _this = this;
                _APP.game.gamestates.gs_PLAYING.addCardMovement(
                    "draw"  , { 
                        timerKey   : "moveDrawToCard_"+layerObjKey   , 
                        timerFrames: 1,
                        movementSpeed: this.movementSpeeds.dealingMany,
                        playerKey  : this.gameBoard.currentPlayer  , 
                        layerObjKey: `${this.gameBoard.currentPlayer}_card_${this.flags.getFirstPlayer.initDealPos%5}`,
                        // layerObjKey: `temp_card`,
                        cardSlot   : (this.flags.getFirstPlayer.initDealPos % 5),
                        finish: function(){ 
                            // console.log("DONE:", this.card.layerObjKey);
                            _APP.shared.genTimer.removeOne(this.timerKey, null);
                        }
                });

                // Change to next player.
                this.gameBoard.setNextPlayer();

                // Repeat until a card has been assigned to each active player. (Back to the first active player again.)
                if(this.gameBoard.currentPlayer == this.gameBoard.activePlayerKeys[0]){
                    // console.log("done?", this.gameBoard.currentPlayer, this.gameBoard.activePlayerKeys[0], this.flags.getFirstPlayer.initDealPos);
                    
                    // Change the row?
                    if( this.flags.getFirstPlayer.initDealPos == 5 ){
                        console.log("this.flags.getFirstPlayer.initDealPos:", this.flags.getFirstPlayer.initDealPos);
                        this.currentRow +=1 ;
                        this.deck.flipPlayerCardsDown(this.gameBoard.currentPlayer, this.currentRow);
                    }

                    // Last card?
                    if(1+this.flags.getFirstPlayer.initDealPos >= 7){
                        this.flags.getFirstPlayer.initDeal = false;

                        // console.log("cards deal timer started");
                        _APP.shared.genTimer.create("genWaitTimer1", 60, _APP.game.gs1, ()=>{
                            // Get the next card in the deck and assign to the discard pile.
                            // The first card cannot be wild draw 4. 
                            let location_DRAW    = this.deck.deck.filter(d => d.location == "CARD_LOCATION_DRAW" && d.value != "CARD_WILD_DRAW4");
                            let discardCard = location_DRAW[0];
                            // let discardCard = this.deck.deck.find(d => 
                            //     d.location == "CARD_LOCATION_DRAW" && 
                            //     // d.value == "CARD_WILD_DRAW4"
                            //     d.value == "CARD_DRAW2"
                            //     // d.value == "CARD_SKIP"
                            //     // d.value == "CARD_REV"
                            //     // d.value == "CARD_WILD"
                            // );
                            // discardCard.location = "CARD_LOCATION_DISCARD";
                            
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
                                this.gameBoard.currentPlayer = this.flags.getFirstPlayer.goesFirst;
                                this.gameBoard.setColorIndicators(this.gameBoard.currentPlayer, discardCard.color);
                                
                                this.flags.nextRoundFlags.draw2  = false;
                                this.flags.nextRoundFlags.skip = false;
                                this.flags.nextRoundFlags.reverse = false;
                                this.flags.nextRoundFlags.draw4  = false;
                                this.flags.nextRoundFlags.colorChange = false;
                                if     (discardCard.value == "CARD_DRAW2")     { this.flags.nextRoundFlags.draw2  = true; }
                                else if(discardCard.value == "CARD_SKIP")      { this.flags.nextRoundFlags.skip = true; }
                                else if(discardCard.value == "CARD_REV")       { this.flags.nextRoundFlags.reverse = true; }
                                else if(discardCard.value == "CARD_WILD")      { this.flags.nextRoundFlags.colorChange = true; }
                                else if(discardCard.value == "CARD_WILD_DRAW4"){ this.flags.nextRoundFlags.draw4  = true; this.flags.nextRoundFlags.colorChange = true; }
    
                                this.lastCardPlayed = discardCard;

                                // Change gamestate 2.
                                _APP.game.changeGs2("playerTurn");
    
                                // Set playerTurn_start (init) for playerTurn.
                                this.flags.playerTurn.play_init = true;

                                // Clear the no longer needed timer keys.
                                _APP.shared.genTimer.removeFinished(null, this.timerKeysKeep);
                            });
                        });
                    }
                    else{
                        // console.log("nope! continue", JSON.stringify(this.flags));
                        this.flags.getFirstPlayer.initDealPos += 1;
                    }
                }

                this.gameBoard.updatePlayerText();
                this.deck.updateUnderPiles();
            }
        },

        playerTurn_start: function(gpInput){
            // console.log("run once.", "playerTurn!", this.gameBoard.currentPlayer);
            this.gameBoard.updatePlayerText();
            this.deck.updateUnderPiles();

            // All player cards face down.
            for(let playerKey of this.gameBoard.activePlayerKeys){
                this.deck.flipPlayerCardsDown(playerKey, 0);
            }

            // Show the current color.
            this.gameBoard.setColorIndicators(this.gameBoard.currentPlayer, this.gameBoard.currentColor);

            // Check flags.
            let canContinueRound = true;
            let colorChange = false;
            let skipTurn = false;
            let mustDraw = false;
            if(this.flags.nextRoundFlags.draw2)     { mustDraw = true; }
            if(this.flags.nextRoundFlags.skip)    { skipTurn = true; }
            if(this.flags.nextRoundFlags.reverse)    { skipTurn = true; }
            if(this.flags.nextRoundFlags.draw4)     { mustDraw = true; }
            if(this.flags.nextRoundFlags.colorChange){ console.log("COLOR CHANGE! FIRST TURN?"); colorChange = true; }

            // COLOR CHANGE: NOTE: This would only happen on the first turn. 
            if(colorChange){
                console.log(this.gameBoard.currentPlayer, "can continue the round.");
                console.log("YOU SHOULD ONLY SEE ME ON THE FIRST TURN.");
                // Show the color changer message.
                this.colorChanger.show();
                this.resetFlags();

                // Set flags to playerTurn.
                this.flags.playerTurn.playing = true;
                this.flags.playerTurn.card_select = true;
            }

            // DRAW
            if(mustDraw){
                if     (this.flags.nextRoundFlags.draw2){
                    console.log(this.gameBoard.currentPlayer, "CANNOT continue the round due to: DRAW2");
                    this.action_draw({playerKey: this.gameBoard.currentPlayer, numCards: 2, msgName: "d2LoseTurn", endDelay: 30});
                }
                else if(this.flags.nextRoundFlags.draw4){
                    console.log(this.gameBoard.currentPlayer, "CANNOT continue the round due to: DRAW4");
                    this.action_draw({playerKey: this.gameBoard.currentPlayer, numCards: 4, msgName: "d4LoseTurn", endDelay: 30});
                }
                this.resetFlags();
                
                // Unset canContinueRound.
                canContinueRound = false;

                // Set flags and change to the next player.
                this.flags.playerTurn.play_init = true;
                this.flags.playerTurn.playing = false;
                this.gameBoard.setNextPlayer();
            }

            // SKIP/REVERSE
            if(skipTurn){
                if(this.flags.nextRoundFlags.reverse){
                    console.log(this.gameBoard.currentPlayer, "CANNOT continue the round due to: REVERSE");
                    this.action_reverse({playerKey: this.gameBoard.currentPlayer, msgName: "reversed", endDelay: 90});
                }
                else if(this.flags.nextRoundFlags.skip){
                    console.log(this.gameBoard.currentPlayer, "CANNOT continue the round due to: SKIP");
                    this.action_skip({playerKey: this.gameBoard.currentPlayer, msgName: "skipLoseTurn", endDelay: 90});
                    this.gameBoard.setNextPlayer();
                }
                this.resetFlags();

                // Unset canContinueRound.
                canContinueRound = false;

                // Set flags and change to the next player.
                this.flags.playerTurn.play_init = true;
                this.flags.playerTurn.playing = false;
            }

            // THE PLAYER CAN CONTINUE THE ROUND.
            if(canContinueRound){
                // console.log(this.gameBoard.currentPlayer, "can continue the round.");
                // Clear the no longer needed timer keys.
                _APP.shared.genTimer.removeFinished(null, this.timerKeysKeep);

                // Reset flags. 
                this.resetFlags();

                // Set flags to playerTurn.
                this.flags.playerTurn.play_init = false;
                this.flags.playerTurn.playing = true;
                this.flags.playerTurn.card_select = true;

                // Cards face-up for the first row.
                this.deck.flipPlayerCardsUp(this.gameBoard.currentPlayer, 0);

                // Activate/position cursor.
                this.gameBoard.showCursor(this.gameBoard.currentPlayer);
            }
        },
        playerTurn: function(gpInput){
            // Flags set/cleared/used here:
            //   this.flags.playerTurn.playing       :: Required for this function.
            //   this.flags.playerTurn.card_select   :: Card and row select, round pass.
            //   this.flags.playerTurn.card_selected :: Confirm/cancel on selected card.
            //   this.flags.playerTurn.play_pass     :: Confirm/cancel on round pass.
            //   this.flags.endOfRound.active        :: Required when switching to endOfRound.
            //   this.flags.endOfRound.colorChange   :: Check for wild card.

            this.gameBoard.nextFrame_colorIndicators();
            
            // Card select and row select.
            if(this.flags.playerTurn.card_select){
                this.gameBoard.nextCursorFrame();

                // P1, P3: Row or cursor position change?
                if(this.gameBoard.currentPlayer == "P1" || this.gameBoard.currentPlayer == "P3"){
                    // Card cursor change.
                    if     (gpInput.P1.press.BTN_LEFT) { this.gameBoard.moveCursor(-1, this.gameBoard.currentPlayer); }
                    else if(gpInput.P1.press.BTN_RIGHT){ this.gameBoard.moveCursor(1, this.gameBoard.currentPlayer);  }
                    
                    // Row change.
                    else if(gpInput.P1.press.BTN_UP)  {
                        this.currentRow += 1;
                    }
                    else if(gpInput.P1.press.BTN_DOWN){ 
                        if(this.currentRow != 0){ this.currentRow -= 1; }
                    }
                }

                // P2, P4: Row or cursor position change?
                if(this.gameBoard.currentPlayer == "P2" || this.gameBoard.currentPlayer == "P4"){
                    // Card cursor change.
                    if     (gpInput.P1.press.BTN_UP)  { this.gameBoard.moveCursor(-1, this.gameBoard.currentPlayer); }
                    else if(gpInput.P1.press.BTN_DOWN){ this.gameBoard.moveCursor(1, this.gameBoard.currentPlayer);  }

                    // Row change.
                    // if     (gpInput.P1.press.BTN_LEFT) { this.gameBoard.moveCursor(-1, this.gameBoard.currentPlayer); }
                    // else if(gpInput.P1.press.BTN_RIGHT){ this.gameBoard.moveCursor(1, this.gameBoard.currentPlayer);  }
                }

                // Selection made?
                if(gpInput.P1.press.BTN_A)    {
                    // Make the selection
                    let selectedCard;
                    selectedCard = this.gameBoard.acceptCursor(this.gameBoard.currentPlayer);
                    
                    // Was there a card there?
                    if(!selectedCard){
                        // No card. Accept cannot be allowed.
                        // console.log("invalid card");
                        return;
                    }

                    // Save the lastSelectedCard.
                    this.lastSelectedCard = selectedCard;

                    // Hide the cursor and stop animations.
                    this.gameBoard.hideCursor();
                    
                    // Move card up from home. 
                    let layerObjKey = `${this.gameBoard.currentPlayer}_card_${this.gameBoard.cursorsPosIndex}`;

                    _APP.game.gamestates.gs_PLAYING.addCardMovement(
                        "selected"  , { 
                            timerKey   : "moveCardToSelected", 
                            timerFrames: 20,
                            playerKey  : this.gameBoard.currentPlayer  , 
                            layerObjKey: layerObjKey ,
                            movementSpeed: _APP.game.gamestates.gs_PLAYING.movementSpeeds.selectCard,
                    });
                    
                    // Clear flag: this.flags.playerTurn.card_select
                    this.flags.playerTurn.card_select = false;
                    
                    // Set flag  : this.flags.playerTurn.card_selected
                    this.flags.playerTurn.card_selected = true;
                    
                    // INIT FOR THE NEXT PART.
                    // Display play/pass message.
                    this.gameBoard.displayMessage("playCancel"  , this.gameBoard.currentPlayer, false);
                }

                // Pass this round?
                if(gpInput.P1.press.BTN_B)    {
                    // Display pass/cancel message.
                    this.gameBoard.displayMessage("passCancel"  , this.gameBoard.currentPlayer, false);

                    // Change flags:
                    this.flags.playerTurn.card_select = false;
                    this.flags.playerTurn.card_selected = false;
                    this.flags.playerTurn.play_pass = true;
                    
                    // Hide the cursor.
                    this.gameBoard.hideCursor(this.gameBoard.currentPlayer);
                }
            }
            
            // Card selected. (needs confirm/pass)
            else if(this.flags.playerTurn.card_selected){
                // PLAY
                if     (gpInput.P1.press.BTN_A) { 
                    // Already selected for play.

                    // Clear play/pass message.
                    this.gameBoard.displayMessage("none"  , this.gameBoard.currentPlayer, false);

                    // Move card to discard pile.
                    let layerObjKey = `${this.gameBoard.currentPlayer}_card_${this.gameBoard.cursorsPosIndex}`;
                    // let card = _GFX.layerObjs.getOne(layerObjKey);
                    let _this = this;
                    _APP.game.gamestates.gs_PLAYING.addCardMovement(
                        "discard"  , { 
                            timerKey   : "moveCardToDiscard", 
                            timerFrames: 0,
                            playerKey  : this.gameBoard.currentPlayer  , 
                            layerObjKey: layerObjKey ,
                            cardSlot: this.gameBoard.cursorsPosIndex,
                            movementSpeed: _APP.game.gamestates.gs_PLAYING.movementSpeeds.returnOneCard,
                            finish: function(){
                                // Get the player location.
                                let location = Deck.playerCardLocations[_this.gameBoard.currentPlayer];

                                // Find this card in the deck.
                                let deckCard    = _this.deck.deck.find(d => 
                                    d.location == location && 
                                    d.color    == this.card.color && 
                                    d.value    == this.card.value
                                );
                                
                                // Change the card's location.
                                deckCard.location = "CARD_LOCATION_DISCARD";
                                
                                // Display the discard card.
                                _this.deck.updateDiscardCard(deckCard);

                                // Save the last card played.
                                _this.lastCardPlayed = deckCard;
                                _this.lastSelectedCard = {..._this.lastCardPlayed};

                                // All player cards face down.
                                for(let playerKey of _this.gameBoard.activePlayerKeys){
                                    _this.deck.flipPlayerCardsDown(playerKey);
                                }

                                // Clear flag: this.flags.playerTurn.playing
                                _this.flags.playerTurn.playing = false;

                                // Clear flag: this.flags.playerTurn.card_select
                                _this.flags.playerTurn.card_select = false;

                                // Clear flag: this.flags.playerTurn.card_selected
                                _this.flags.playerTurn.card_selected = false;

                                // Clear flag: this.flags.playerTurn.play_pass
                                _this.flags.playerTurn.play_pass = false;
                                
                                // Set flag: this.flags.endOfRound.active
                                _this.flags.endOfRound.active = true;

                                // Set flag: this.flags.endOfRound.colorChange
                                _this.flags.endOfRound.colorChange = true;
                            },
                    });
                    
                }
                
                // CANCEL
                else if(gpInput.P1.press.BTN_B){ 
                    // this.gameBoard.moveCursor(1, this.gameBoard.currentPlayer);  

                    // Cancelled select for play.
                    // Clear play/pass message.
                    // Move card down to home. 
                    // Clear flag: this.flags.playerTurn.card_selected
                    // Set flag  : this.flags.playerTurn.card_select
                }
                
            }

            // No card selected. (needs pass/cancel)
            else if(this.flags.playerTurn.play_pass){
                // Awaiting player choice.

                // Accept the pass. Hide cards, draw one card, end turn.
                if(gpInput.P1.press.BTN_A)    {}
                // Go back to Card and row select, round pass.
                if(gpInput.P1.press.BTN_B)    {
                    // Clear the displayed message.
                    this.gameBoard.displayMessage("none"  , this.gameBoard.currentPlayer, false);

                    // Change flags:
                    this.flags.playerTurn.card_select = true;
                    this.flags.playerTurn.card_selected = false;
                    this.flags.playerTurn.play_pass = false;

                    // Show the cursor.
                    this.gameBoard.showCursor(this.gameBoard.currentPlayer);
                }
            }
            else{ console.log("playerTurn: INVALID FLAGS"); }
        },

        endOfRound: function(gpInput){
            // Flags set/cleared/used here:
            //   this.flags.endOfRound.active    :: Required when switching to endOfRound.
            //   this.flags.endOfRound.colorChange :: Check for wild card.
            //   this.flags.endOfRound.setNextFlags :: Assign flags for next round.
            //   this.flags.playerTurn.playing    :: Required for this function.
            //   this.flags.playerTurn.card_select :: Card and row select, round pass.

            // console.log(
            //     "endOfRound: ", this.flags.endOfRound.active, 
            //     "p1:", this.flags.endOfRound.colorChange, 
            //     "p2:", this.flags.endOfRound.setNextFlags
            // );

            // Determine if the color changer needs to be activated.
            if     (this.flags.endOfRound.colorChange){
                // Display the color changer?
                if(this.lastCardPlayed.color == "CARD_BLACK"){
                    // console.log("colorChanger should only be called once here.");
                    this.colorChanger.show();
                }

                // Clear all flags.
                this.resetFlags();

                // Set these flags:
                this.flags.endOfRound.active = true;
                this.flags.endOfRound.setNextFlags = true;
            }
            // Set end of round flags.
            else if(this.flags.endOfRound.setNextFlags){
                // Clear all flags.
                this.resetFlags();

                // Determine what flags to set based on the last card played.
                if     (this.lastCardPlayed.value == "CARD_DRAW2")     { this.flags.nextRoundFlags.draw2  = true; }
                else if(this.lastCardPlayed.value == "CARD_WILD_DRAW4"){ this.flags.nextRoundFlags.draw4  = true; }
                else if(this.lastCardPlayed.value == "CARD_SKIP")      { this.flags.nextRoundFlags.skip = true; }
                else if(this.lastCardPlayed.value == "CARD_REV")       { this.flags.nextRoundFlags.reverse = true; }

                // Set these flags.
                this.flags.playerTurn.play_init = true;

                this.gameBoard.setNextPlayer(this.flags.nextRoundFlags.reverse);
            }
            else{ console.log("endOfRound: INVALID FLAGS"); }
        },

        // Actions based on cards: WILD, WILD_DRAW4, DRAW2, SKIP, REVERSE
        action_changeColor: function(gpInput){
            this.colorChanger.nextFrame();
            if(gpInput.P1.press.BTN_LEFT) { this.colorChanger.moveCursor(-1); }
            if(gpInput.P1.press.BTN_RIGHT){ this.colorChanger.moveCursor(1); }
            if(gpInput.P1.press.BTN_A)    { 
                // Accept the color change. (and hides the colorChanger.)
                this.colorChanger.accept(); 
                // console.log(`Color changed by: ${this.gameBoard.currentPlayer} to: ${this.gameBoard.currentColor}`);
            }
        },
        action_pauseMenu: function(gpInput){
            // Animate the cursor.
            this.pauseMenu.nextFrame();

            // Move the cursor?
            if(gpInput.P1.press.BTN_UP) { this.pauseMenu.moveCursor(-1); }
            else if(gpInput.P1.press.BTN_DOWN){ this.pauseMenu.moveCursor(1); }

            // Exit the pause menu?
            else if(gpInput.P1.press.BTN_B)    { 
                this.pauseMenu.hide();
            }

            // Make a selection.
            else if(gpInput.P1.press.BTN_A)    { 
                // Accept the action. (and hides the pauseMenu.)
                let newAction = this.pauseMenu.accept(); 
                // console.log(`Action set by: ${this.gameBoard.currentPlayer} to: ${PauseMenu.cursorsPos[this.pauseMenu.cursorsPosIndex].action}`);

                if     (newAction == "RESET_ROUND"){
                    // Reset flags to prevent anything else in the current loop from running. 
                    this.resetFlags();
                    
                    // Restart the gamestate.
                    _APP.game.gameLoop.loop_stop(); 
                    _APP.game.gamestates[_APP.game.gs1].inited = false;
                    _APP.game.gameLoop.loop_start(); 
                }
                else if(newAction == "EXIT_GAME")  {
                    // Reset flags to prevent anything else in the current loop from running. 
                    this.resetFlags();

                    // Return the to the title screen. 
                    _APP.game.changeGs1("gs_TITLE");
                    _APP.game.changeGs2("title");
                }
                // TODO
                else if(newAction == "AUTO_PLAY")  {
                    // TODO
                }
                else if(newAction == "CANCEL")     {
                    // The accept method should have already hidden the pauseMenu.
                    // this.pauseMenu.hide();
                }
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
            if( !(config.numCards >= 1 && config.numCards <= 4) ){
                console.error("action_draw", config);
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
