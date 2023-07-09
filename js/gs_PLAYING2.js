(() => {
    const funcs = {
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
            // Reset and shuffle the deck.
            this.deck.resetDeck();
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
                if(card){
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
                }

                // Update the player text (ignoring the win and uno states.)
                this.gameBoard.updatePlayerText(true);

                // Update the pile height indicators. (draw/discard.)
                this.deck.updateUnderPiles();

                // Change to next player.
                this.gameBoard.setNextPlayer(false, true);

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

                // DEBUG: Force the winner?
                if(this.debugFlags.forcedWinner){
                    console.log(`DEBUG: Forced win. Setting '${this.debugFlags.forcedWinner} as the winner of the first turn.'`);
                    winner.playerKeys = [this.debugFlags.forcedWinner];
                }

                // DEBUG: Force the winner on ties?
                else if(this.debugFlags.forcedWinnerOnTie && winner.playerKeys.length != 1){
                    if(this.gameBoard.activePlayerKeys.indexOf(this.debugFlags.forcedWinnerOnTie) == -1){
                        console.log(`DEBUG: TIED: (missing override value). Setting '${this.gameBoard.activePlayerKeys[0]} as the winner of the first turn.'`);
                        winner.playerKeys = [this.gameBoard.activePlayerKeys[0]];
                    }
                    else{
                        console.log(`DEBUG: TIED: (using override value). Setting '${this.debugFlags.forcedWinnerOnTie} as the winner of the first turn.'`);
                        winner.playerKeys = [this.debugFlags.forcedWinnerOnTie]; 
                    }
                }

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

                                        // Update the player text (ignoring the win and uno states.)
                                        _this.gameBoard.updatePlayerText(true);

                                        // Update the pile height indicators. (draw/discard.)
                                        _this.deck.updateUnderPiles();
        
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

                    // Reset all cards in each player's hand.
                    for(let playerKey of this.gameBoard.activePlayerKeys){
                        this.deck.resetCardPositions(playerKey);
                    }

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
                // Get the next card in the deck and assign to the player.
                let card = this.deck.getNextCardFromDrawpile();
                if(card){
                    card.location = Deck.playerCardLocations[this.gameBoard.currentPlayer];
                    let layerObjKey = `${this.gameBoard.currentPlayer}_card_${this.flags.getFirstPlayer.initDealPos%5}`;
                    _GFX.layerObjs.getOne(layerObjKey).change_wholeCard("sm", "CARD_BLACK", "CARD_BACK"); ;

                    // Start deal animation.
                    let _this = this;
                    _APP.game.gamestates.gs_PLAYING.addCardMovement(
                        "draw"  , { 
                            timerKey   : "moveDrawToCard_"+layerObjKey   , 
                            timerFrames: 0,
                            movementSpeed: this.movementSpeeds.dealingMany,
                            playerKey  : this.gameBoard.currentPlayer  , 
                            layerObjKey: `${this.gameBoard.currentPlayer}_card_${this.flags.getFirstPlayer.initDealPos%5}`,
                            // layerObjKey: `temp_card`,
                            cardSlot   : (this.flags.getFirstPlayer.initDealPos % 5),
                            finish: function(){ 
                                _APP.shared.genTimer.removeOne(this.timerKey, null);
                            }
                    });
                }

                // Change to next player.
                this.gameBoard.setNextPlayer(false, false); // Don't reset the current row.

                // Repeat until a card has been assigned to each active player. (Back to the first active player again.)
                if(this.gameBoard.currentPlayer == this.gameBoard.activePlayerKeys[0]){
                    // Was the last card dealt the last card to be dealt for the initial deal?
                    // if(1+this.flags.getFirstPlayer.initDealPos >= 4) { // ONE ROW
                    // if(1+this.flags.getFirstPlayer.initDealPos >= 11){ // THREE ROWS
                    // if(1+this.flags.getFirstPlayer.initDealPos >= 1) { // ONE ROW
                    if(1+this.flags.getFirstPlayer.initDealPos >= 7) { // TWO ROWS (default)
                        // Clear the initDeal flag.
                        this.flags.getFirstPlayer.initDeal = false;

                        // Flip all cards down, display row 0 for each player.
                        _APP.shared.genTimer.create("genWaitTimer1", 20, _APP.game.gs1, ()=>{
                            for(let playerKey of this.gameBoard.activePlayerKeys){
                                let row = 0;
                                this.deck.flipPlayerCardsDown(playerKey, row);
                            }
                        });

                        // After a delay set the first discard card.
                        _APP.shared.genTimer.create("genWaitTimer2", 60, _APP.game.gs1, ()=>{
                            let discardCard;

                            // Forced initial discard?
                            if(!this.debugFlags.forcedFirstDiscard){
                                // Get the next card in the deck and assign to the discard pile.
                                // The first card cannot be wild draw 4. 
                                let location_DRAW    = this.deck.deck.filter(d => d.location == "CARD_LOCATION_DRAW" && d.value != "CARD_WILD_DRAW4");
                                discardCard = location_DRAW[0];
                            }
                            // Normal discard.
                            else{
                                discardCard = this.deck.deck.find(d => 
                                    d.location == "CARD_LOCATION_DRAW" && 
                                    d.value == this.debugFlags.forcedFirstDiscard
                                );
                            }
                            
                            // Display the discard card and assign it to the discard pile.
                            discardCard.location = "CARD_LOCATION_DISCARD";
                            this.deck.updateDiscardCard(discardCard);

                            // Change the position of the discard card to the draw pile and hide it.
                            let cardObj = _GFX.layerObjs.getOne("discard_card");
                            cardObj.x = Deck.drawPos[0];
                            cardObj.y = Deck.drawPos[1];
                            cardObj.hidden = false; 

                            // Add a movement to move the card from the draw pile to the discard pile. 
                            let _this = this;
                            _APP.game.gamestates.gs_PLAYING.addCardMovement(
                                "discard"  , { 
                                    timerKey     : `moveCardInitialDiscard`, 
                                    timerFrames  : 10,
                                    movementSpeed: this.movementSpeeds.dealOneCard,
                                    layerObjKey  : `discard_card`,
                                    finish       : function(){ 
                                        _this.lastDrawnCard = discardCard;
                                        // console.log("FIRST CARD: DISCARD: discardCard:", discardCard, _this.lastDrawnCard);
                                        _APP.shared.genTimer.removeOne(this.timerKey, null); 
                                    }
                            });

                            // Ready the game flags for the first turn.
                            _APP.shared.genTimer.create("genWaitTimer2", 60, _APP.game.gs1, ()=>{
                                // Record the last card played.
                                this.lastCardPlayed = discardCard;

                                // Set the first player.
                                this.gameBoard.currentPlayer = this.flags.getFirstPlayer.goesFirst;

                                // Set the color indicator.
                                this.gameBoard.setColorIndicators(this.gameBoard.currentPlayer, discardCard.color);

                                // Reset flags.
                                this.resetFlags();
                                
                                // Change gamestate 2.
                                _APP.game.changeGs2("playerTurn");
    
                                // Set playerTurn_start (init) for playerTurn.
                                this.flags.playerTurn.play_init = true;

                                // Set game flags.
                                this.flags.nextRoundFlags.draw2  = false;
                                this.flags.nextRoundFlags.skip = false;
                                this.flags.nextRoundFlags.reverse = false;
                                this.flags.nextRoundFlags.draw4  = false;
                                this.flags.nextRoundFlags.colorChange = false;
                                if     (discardCard.value == "CARD_DRAW2")     { this.flags.nextRoundFlags.draw2  = true; }
                                else if(discardCard.value == "CARD_SKIP")      { this.flags.nextRoundFlags.skip = true; }
                                else if( discardCard.value == "CARD_REV"){
                                    this.flags.nextRoundFlags.reverse = true;
                                    if(this.gameBoard.activePlayerKeys.length == 2){
                                        this.flags.nextRoundFlags.skip = true;
                                    }
                                }
                                else if(discardCard.value == "CARD_WILD")      { this.flags.nextRoundFlags.colorChange = true; }
                                else if(discardCard.value == "CARD_WILD_DRAW4"){ this.flags.nextRoundFlags.draw4  = true; this.flags.nextRoundFlags.colorChange = true; }

                                // Clear the no longer needed timer keys.
                                _APP.shared.genTimer.removeFinished(null, this.timerKeysKeep);
                            });
                        });
                    }
                    // There are still more cards to deal.
                    else{
                        // Wait for the last card to land before continuing.
                        _APP.shared.genTimer.create("genWaitTimer1", 1, _APP.game.gs1, ()=>{
                            // Increment the initDealPos value.
                            this.flags.getFirstPlayer.initDealPos += 1;

                            // Do we need to change the displayed row?
                            if( this.flags.getFirstPlayer.initDealPos != 0 && this.flags.getFirstPlayer.initDealPos % 5 == 0){
                                // For each active player...
                                for(let playerKey of this.gameBoard.activePlayerKeys){
                                    // Increment the row for the player.
                                    this.gameBoard.players[playerKey].currentRow += 1;
                                    
                                    // Get the current row for the player.
                                    row = this.gameBoard.players[playerKey].currentRow;
                                    
                                    // Flip the currently displayed cards down. (No cards will be displayed which is normal.)
                                    this.deck.flipPlayerCardsDown(playerKey, row);
                                }
                            }
                        });
                    }
                }

                // Update the player text (card count.)
                this.gameBoard.updatePlayerText();

                // Update the pile height indicators. (draw/discard.)
                this.deck.updateUnderPiles();
            }
        },

        playerTurn_start: function(gpInput){
            // console.log("run once.", "playerTurn!", this.gameBoard.currentPlayer);
            this.gameBoard.updatePlayerText();
            this.deck.updateUnderPiles();

            // All player cards face down.
            for(let playerKey of this.gameBoard.activePlayerKeys){
                this.gameBoard.players[playerKey].currentRow = 0;
                this.deck.flipPlayerCardsDown(playerKey, this.gameBoard.players[playerKey].currentRow);
            }

            // Show the current color.
            if(!this.winningPlayerKey){
                this.gameBoard.setColorIndicators(this.gameBoard.currentPlayer, this.gameBoard.currentColor);
            }
            else{
                this.gameBoard.hideColorIndictors();
                // this.gameBoard.setColorIndicators(this.winningPlayerKey, this.gameBoard.currentColor);
            }

            // Check flags.
            let canContinueRound = true;
            let colorChange = false;
            let skipTurn = false;
            let mustDraw = false;
            if(this.flags.nextRoundFlags.draw2)      { mustDraw = true; }
            if(this.flags.nextRoundFlags.skip)       { skipTurn = true; }
            if(this.flags.nextRoundFlags.reverse)    { skipTurn = true; }
            if(this.flags.nextRoundFlags.draw4)      { mustDraw = true; }
            if(this.flags.nextRoundFlags.colorChange){ 
                console.log("COLOR CHANGE! THIS SHOULD ONLY BE POSSIBLE HERE ON THE FIRST TURN."); 
                colorChange = true; 
            }

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
                    // console.log(this.gameBoard.currentPlayer, "CANNOT continue the round due to: DRAW2");
                    this.action_draw({playerKey: this.gameBoard.currentPlayer, numCards: 2, msgName: "d2LoseTurn", endDelay: 30});
                }
                else if(this.flags.nextRoundFlags.draw4){
                    // console.log(this.gameBoard.currentPlayer, "CANNOT continue the round due to: DRAW4");
                    this.action_draw({playerKey: this.gameBoard.currentPlayer, numCards: 4, msgName: "d4LoseTurn", endDelay: 30});
                }

                this.resetFlags();
                
                // Unset canContinueRound.
                canContinueRound = false;

                // Set flags and change to the next player.
                this.flags.playerTurn.play_init = true;
                this.flags.playerTurn.playing = false;
                this.gameBoard.setNextPlayer(false, true);
            }

            // SKIP/REVERSE
            if(skipTurn){
                // In two-player mode a reverse should act like a skip (and the flags should include the skip flag if a reverse was played.)
                if( this.flags.nextRoundFlags.reverse && this.flags.nextRoundFlags.skip ){
                    // Need genTimers in order to run each affect sequentially. 
                    
                    // Reverse.
                    _APP.shared.genTimer.create("genWaitTimer2", 5, _APP.game.gs1, ()=>{
                        this.action_reverse({playerKey: this.gameBoard.currentPlayer, msgName: "reversed", endDelay: 45});

                        // Skip.
                        _APP.shared.genTimer.create("genWaitTimer2", 5, _APP.game.gs1, ()=>{
                            this.action_skip({playerKey: this.gameBoard.currentPlayer, msgName: "skipLoseTurn", endDelay: 45});
                            
                            // Next player.
                            _APP.shared.genTimer.create("genWaitTimer2", 5, _APP.game.gs1, ()=>{
                                this.gameBoard.setNextPlayer(false, true);
                            });
                        });
                    });
                }
                else if(this.flags.nextRoundFlags.reverse){
                    // console.log(this.gameBoard.currentPlayer, "CANNOT continue the round due to: REVERSE");
                    this.action_reverse({playerKey: this.gameBoard.currentPlayer, msgName: "reversed", endDelay: 90});
                }
                else if(this.flags.nextRoundFlags.skip){
                    // console.log(this.gameBoard.currentPlayer, "CANNOT continue the round due to: SKIP");
                    this.action_skip({playerKey: this.gameBoard.currentPlayer, msgName: "skipLoseTurn", endDelay: 90});
                    this.gameBoard.setNextPlayer(false, true);
                }
                this.resetFlags();

                // Unset canContinueRound.
                canContinueRound = false;

                // Set flags and change to the next player.
                this.flags.playerTurn.play_init = true;
                this.flags.playerTurn.playing = false;
            }
            
            if(this.winningPlayerKey){
                canContinueRound = false;
                console.log("WINNER IS:", this.winningPlayerKey);
                
                // Reset flags.
                this.resetFlags();

                _APP.shared.genTimer.create("genWaitTimer1", 1, _APP.game.gs1, ()=>{
                    // All player cards face down. (This will display any cards drawn by the next player.)
                    for(let playerKey of this.gameBoard.activePlayerKeys){
                        this.gameBoard.players[playerKey].currentRow = 0;
                        this.deck.flipPlayerCardsDown(playerKey, this.gameBoard.players[playerKey].currentRow);
                    }
                });

                // After a delay, switch to the winner screen.
                _APP.shared.genTimer.create("genWaitTimer2", 1, _APP.game.gs1, ()=>{
                    // Display the winner message.
                    this.gameBoard.displayMessage("winsRound"  , this.winningPlayerKey, false);

                    _APP.shared.genTimer.create("genWaitTimer2", this.timerDelays.winsRound, _APP.game.gs1, ()=>{
                        this.gameBoard.displayMessage("none"  , this.winningPlayerKey, false);
                        this.flags.winsRound.init = true;
                        _APP.game.changeGs2("winner");
                    });
                });
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

                
                // ALL Cards face-up on the first row?
                if(this.debugFlags.showAllPlayerCardsFaceUp){
                    for(let playerKey of this.gameBoard.activePlayerKeys){
                        this.deck.flipPlayerCardsUp(playerKey, 0);
                    }
                }
                else{
                    // Player cards face-up for the first row.
                    this.deck.flipPlayerCardsUp(this.gameBoard.currentPlayer, 0);
                }

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
            //   this.flags.endOfRound.skipFlagCheck :: Skips the flag assignments for the last discarded card after a pass.

            this.gameBoard.nextFrame_colorIndicators();
            
            // Card select and row select.
            if(this.flags.playerTurn.card_select){
                this.gameBoard.nextCursorFrame();

                // Row changes. (P1 and P3 use the same buttons. P2 and P4 each use different buttons.)
                if(this.gameBoard.currentPlayer == "P1" || this.gameBoard.currentPlayer == "P3"){
                    // Row change.
                    if(gpInput.ANY.press.BTN_DOWN)  {
                        // Get the card count and the maxRow.
                        let cardCount = this.deck.countPlayerCards(this.gameBoard.currentPlayer);
                        let maxRow = Math.ceil(cardCount / 5);

                        // Would adding 1 to currentRow be less than or equal to maxRow -1?
                        if( !(this.gameBoard.players[this.gameBoard.currentPlayer].currentRow +1 > maxRow-1) ){
                            this.gameBoard.players[this.gameBoard.currentPlayer].currentRow += 1;  // Increment the row for the player.
                            row = this.gameBoard.players[this.gameBoard.currentPlayer].currentRow; // Get the current row for the player.
                            this.deck.flipPlayerCardsUp(this.gameBoard.currentPlayer, row);        // Flip the cards up to show the new row's cards.
                        }
                    }
                    else if(gpInput.ANY.press.BTN_UP){ 
                        // Can move up if the current row is not 0.
                        if(this.gameBoard.players[this.gameBoard.currentPlayer].currentRow !=0){
                            this.gameBoard.players[this.gameBoard.currentPlayer].currentRow -= 1;  // Increment the row for the player.
                            row = this.gameBoard.players[this.gameBoard.currentPlayer].currentRow; // Get the current row for the player.
                            this.deck.flipPlayerCardsUp(this.gameBoard.currentPlayer, row);        // Flip the cards up to show the new row's cards.
                        }
                    }
                }
                if(this.gameBoard.currentPlayer == "P2"){
                    // Row change.
                    if(gpInput.ANY.press.BTN_LEFT)  {
                        // Get the card count and the maxRow.
                        let cardCount = this.deck.countPlayerCards(this.gameBoard.currentPlayer);
                        let maxRow = Math.ceil(cardCount / 5);

                        // Would adding 1 to currentRow be less than or equal to maxRow -1?
                        if( !(this.gameBoard.players[this.gameBoard.currentPlayer].currentRow +1 > maxRow-1) ){
                            this.gameBoard.players[this.gameBoard.currentPlayer].currentRow += 1;  // Increment the row for the player.
                            row = this.gameBoard.players[this.gameBoard.currentPlayer].currentRow; // Get the current row for the player.
                            this.deck.flipPlayerCardsUp(this.gameBoard.currentPlayer, row);        // Flip the cards up to show the new row's cards.
                        }
                    }
                    else if(gpInput.ANY.press.BTN_RIGHT){ 
                        if(this.gameBoard.players[this.gameBoard.currentPlayer].currentRow !=0){
                            this.gameBoard.players[this.gameBoard.currentPlayer].currentRow -= 1;  // Increment the row for the player.
                            row = this.gameBoard.players[this.gameBoard.currentPlayer].currentRow; // Get the current row for the player.
                            this.deck.flipPlayerCardsUp(this.gameBoard.currentPlayer, row);        // Flip the cards up to show the new row's cards.
                        }
                    }
                }
                if(this.gameBoard.currentPlayer == "P4"){
                    // Row change.
                    if(gpInput.ANY.press.BTN_RIGHT)  {
                        // Get the card count and the maxRow.
                        let cardCount = this.deck.countPlayerCards(this.gameBoard.currentPlayer);
                        let maxRow = Math.ceil(cardCount / 5);

                        // Would adding 1 to currentRow be less than or equal to maxRow -1?
                        if( !(this.gameBoard.players[this.gameBoard.currentPlayer].currentRow +1 > maxRow-1) ){
                            // Increment the row for the player.
                            // Get the current row for the player.
                            // Flip the cards up to show the new row's cards.
                            this.gameBoard.players[this.gameBoard.currentPlayer].currentRow += 1;
                            row = this.gameBoard.players[this.gameBoard.currentPlayer].currentRow;
                            this.deck.flipPlayerCardsUp(this.gameBoard.currentPlayer, row);
                        }
                    }
                    else if(gpInput.ANY.press.BTN_LEFT){ 
                        // Increment the row for the player.
                        // Get the current row for the player.
                        // Flip the cards up to show the new row's cards.
                        if(this.gameBoard.players[this.gameBoard.currentPlayer].currentRow !=0){
                            this.gameBoard.players[this.gameBoard.currentPlayer].currentRow -= 1;
                            row = this.gameBoard.players[this.gameBoard.currentPlayer].currentRow;
                            this.deck.flipPlayerCardsUp(this.gameBoard.currentPlayer, row);
                        }
                    }
                }

                // P1, P3: Row or cursor position change?
                if(this.gameBoard.currentPlayer == "P1" || this.gameBoard.currentPlayer == "P3"){
                    // Card cursor change.
                    if     (gpInput.ANY.press.BTN_LEFT) { this.gameBoard.moveCursor(-1, this.gameBoard.currentPlayer); }
                    else if(gpInput.ANY.press.BTN_RIGHT){ this.gameBoard.moveCursor(1, this.gameBoard.currentPlayer);  }
                }

                // P2, P4: Row or cursor position change?
                if(this.gameBoard.currentPlayer == "P2" || this.gameBoard.currentPlayer == "P4"){
                    // Card cursor change.
                    if     (gpInput.ANY.press.BTN_UP)  { this.gameBoard.moveCursor(-1, this.gameBoard.currentPlayer); }
                    else if(gpInput.ANY.press.BTN_DOWN){ this.gameBoard.moveCursor(1, this.gameBoard.currentPlayer);  }
                }

                // Selection made?
                if(gpInput.ANY.press.BTN_A)    {
                    // Make the selection
                    let selectedCard;
                    selectedCard = this.gameBoard.acceptCursor(this.gameBoard.currentPlayer);
                    
                    // Was there a card there?
                    if(!selectedCard){
                        // No card. Accept cannot be allowed.
                        // console.log("invalid card");
                        return;
                    }

                    // Make sure the selected card is valid.
                    if(!this.debugFlags.skipCardValidityCheck){
                        // Is the card valid? It must be a normal WILD, same color, or same value.
                        // It can only be a wild draw 4 if they have no other cards that match the current color.
                        
                        let sameColor    = false;
                        let sameValue    = false;
                        let isNormalWild = false;
                        let isWildDraw4  = false;
                        if     ( this.gameBoard.currentColor == selectedCard.color || selectedCard.color == this.lastCardPlayed.color){ sameColor    = true; } // Color check
                        else if(this.lastCardPlayed.value   == selectedCard.value){ sameValue    = true; } // Value check
                        else if(selectedCard.value == "CARD_WILD")                { isNormalWild = true; } // Wild check
                        else if(selectedCard.value == "CARD_WILD_DRAW4")          { isWildDraw4  = true; } // Wild d4 check

                        // console.log(
                        //     `CARD SELECTED` + `\n` + 
                        //     `currentColor    : ${this.gameBoard.currentColor}` + `\n` + 
                        //     `selectedCard    :`, selectedCard.color, selectedCard.value, `\n` +
                        //     `lastCardPlayed  :`, this.lastCardPlayed.color, this.lastCardPlayed.value, `\n` +
                        //     `sameColor   :`, sameColor   , `\n` +
                        //     `sameValue   :`, sameValue   , `\n` +
                        //     `isNormalWild:`, isNormalWild, `\n` +
                        //     `isWildDraw4 :`, isWildDraw4 , `\n` +
                        //     ``
                        // ); 

                        // Allow these.
                        if(sameColor || sameValue || isNormalWild){}
                        
                        // Perform additional checks for the wild draw 4.
                        else if(isWildDraw4){
                            // Check for cards in the player's hand that match the current color.
                            let count = this.deck.countColorMatches(this.gameBoard.currentPlayer, this.gameBoard.currentColor);

                            // Found matching color cards? Deny the card from being played.
                            if(count){
                                // Cannot play this card right now.
                                // console.log(`card_select: Cannot play WILD_DRAW_4 now because the player has '${count}' playable cards of the same color.`);

                                this.gameBoard.displayMessage("invalidCard"  , this.gameBoard.currentPlayer, false);
                            
                                // Wait to clear the message.
                                _APP.shared.genTimer.create("genWaitTimer2", this.timerDelays.cannotPlayCard, _APP.game.gs1, ()=>{
                                    this.gameBoard.displayMessage("none", this.gameBoard.currentPlayer, false);
                                });

                                return;
                            }
                            else{
                                // None found? Allow the card to be played.
                                // console.log(`card_select: Can play WILD_DRAW_4.`);
                            }
                        }

                        // This card cannot be played.
                        else{
                            // Cannot play this card.
                            // console.log(
                            //     `CARD_SELECT: THIS CARD CANNOT BE PLAYED.\n`+
                            //     `selectedCard    :`, selectedCard.color, selectedCard.value, `\n` +
                            //     `currentColor    : ${this.gameBoard.currentColor}` + `\n` + 
                            //     `lastCardPlayed  :`, this.lastCardPlayed.color, this.lastCardPlayed.value, `\n` +
                            //     `FLAGS:\n` + 
                            //     `  sameColor   :`, sameColor   , `\n` +
                            //     `  sameValue   :`, sameValue   , `\n` +
                            //     `  isNormalWild:`, isNormalWild, `\n` +
                            //     `  isWildDraw4 :`, isWildDraw4 , `\n` +
                            //     ``
                            // ); 

                            this.gameBoard.displayMessage("invalidCard"  , this.gameBoard.currentPlayer, false);
                            
                            // Wait to clear the message.
                            _APP.shared.genTimer.create("genWaitTimer2", this.timerDelays.cannotPlayCard, _APP.game.gs1, ()=>{
                                this.gameBoard.displayMessage("none", this.gameBoard.currentPlayer, false);
                            });
                            return;
                        }
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
                            timerFrames: 0, // Frames to wait after the completion of the movement.
                            playerKey  : this.gameBoard.currentPlayer  , 
                            layerObjKey: layerObjKey ,
                            movementSpeed: _APP.game.gamestates.gs_PLAYING.movementSpeeds.selectCard,

                            // When the movement finishes, display playCancel message.
                            finish: ()=>{ this.gameBoard.displayMessage("playCancel"  , this.gameBoard.currentPlayer, false); },
                    });
                    
                    // Clear flag: this.flags.playerTurn.card_select
                    this.flags.playerTurn.card_select = false;
                    
                    // Set flag  : this.flags.playerTurn.card_selected
                    this.flags.playerTurn.card_selected = true;
                    
                    // INIT FOR THE NEXT PART.

                    // Display play/pass message.
                    // this.gameBoard.displayMessage("playCancel"  , this.gameBoard.currentPlayer, false);
                }

                // Pass this round?
                if(gpInput.ANY.press.BTN_B)    {
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
                if     (gpInput.ANY.press.BTN_A) { 
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

                                // Set the current color.
                                _this.gameBoard.currentColor = deckCard.color;

                                // console.log(
                                //     `CARD PLAYED` + `\n` + 
                                //     `currentColor    : ${_this.gameBoard.currentColor}` + `\n` + 
                                //     `deckCard        :`, deckCard.color, deckCard.value, `\n` +
                                //     `lastSelectedCard:`, _this.lastSelectedCard.color, _this.lastSelectedCard.value, `\n` +
                                //     `lastCardPlayed  :`, _this.lastCardPlayed.color, _this.lastCardPlayed.value, `\n` +
                                //     ``
                                // ); 

                                // Save the last card played.
                                _this.lastCardPlayed = deckCard;
                                _this.lastSelectedCard = _this.lastCardPlayed;
                                _this.lastDrawnCard = deckCard;
                                // console.log("NORMAL PLAY: DISCARD: deckCard:", deckCard, _this.lastDrawnCard);

                                _this.gameBoard.updatePlayerText();
                                _this.deck.updateUnderPiles();

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

                                // Set flag: this.flags.endOfRound.colorChange (The first part of endOfRound. Is a check.)
                                _this.flags.endOfRound.colorChange = true;

                                // Force a short wait.
                                _APP.shared.genTimer.create("genWaitTimer2", _this.timerDelays.endOfTurn, _APP.game.gs1, ()=>{
                                    // All player cards face down.
                                    for(let playerKey of _this.gameBoard.activePlayerKeys){
                                        _this.deck.flipPlayerCardsDown(playerKey, 0);
                                    }
                                });
                            },
                    });
                    
                }
                
                // CANCEL
                else if(gpInput.ANY.press.BTN_B){ 
                    // Clear play/pass message.
                    this.gameBoard.displayMessage("none"  , this.gameBoard.currentPlayer, false);

                    // Get the selected card.
                    let layerObjKey = `${this.gameBoard.currentPlayer}_card_${this.gameBoard.cursorsPosIndex}`;
                    let _this = this;
                    
                    // Move card down to home. 
                    _APP.game.gamestates.gs_PLAYING.addCardMovement(
                        "home"  , { 
                            timerKey   : "moveCardToHome", 
                            timerFrames: 0,
                            playerKey  : this.gameBoard.currentPlayer  , 
                            layerObjKey: layerObjKey ,
                            cardSlot: this.gameBoard.cursorsPosIndex,
                            movementSpeed: _APP.game.gamestates.gs_PLAYING.movementSpeeds.returnOneCard,
                            finish: function(){
                                // Force a short wait.
                                _APP.shared.genTimer.create("genWaitTimer2", _this.timerDelays.unselectCard, _APP.game.gs1, ()=>{
                                    // Clear/set flags.
                                    _this.flags.playerTurn.card_selected = false;
                                    _this.flags.playerTurn.card_select = true;

                                    // Activate/position cursor.
                                    _this.gameBoard.showCursor(_this.gameBoard.currentPlayer);
                                });
                            },
                    });

                    // Clear flags. (The correct flags will be set after "finish.")
                    this.flags.playerTurn.card_selected = false;
                    this.flags.playerTurn.card_select = false;
                }
                
            }

            // No card selected. (needs pass/cancel)
            else if(this.flags.playerTurn.play_pass){
                // Awaiting player choice.

                // Accept the pass. Hide cards, draw one card, end turn.
                if(gpInput.ANY.press.BTN_A)    {
                    // Clear the displayed message.
                    // this.gameBoard.displayMessage("none"  , this.gameBoard.currentPlayer, false);
                    this.gameBoard.displayMessage("turnPassed", this.gameBoard.currentPlayer, false);

                    // Flip player cards down.
                    this.deck.flipPlayerCardsDown(this.gameBoard.currentPlayer, 0);

                    // Draw one card.
                    this.action_draw({playerKey: this.gameBoard.currentPlayer, numCards: 1, msgName: "", endDelay: this.timerDelays.endOfTurn});
                    
                    // End turn.
                    let _this = this;
                    _APP.shared.genTimer.create("genWaitTimer2", this.timerDelays.endOfTurn, _APP.game.gs1, ()=>{
                        // this.action_draw({playerKey: _this.gameBoard.currentPlayer, numCards: 1, msgName: "", endDelay: _this.timerDelays.endOfTurn});
                        this.gameBoard.displayMessage("none"  , this.gameBoard.currentPlayer, false);
                    });

                    // Clear all flags.
                    this.resetFlags();

                    // Change flags:
                    this.flags.endOfRound.active    = true;
                    this.flags.endOfRound.colorChange   = false; // Skip the check for a wild card.
                    this.flags.endOfRound.setNextFlags  = true;
                    
                    // Set a flag to prevent assigning of flags against this.lastPlayedCard.
                    this.flags.endOfRound.skipFlagCheck  = true;
                }

                // Go back to Card and row select, round pass.
                if(gpInput.ANY.press.BTN_B)    {
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
                let skipFlagCheck = this.flags.endOfRound.skipFlagCheck;

                // Clear all flags.
                this.resetFlags();

                // Determine what flags to set based on the last card played.
                if(!skipFlagCheck){
                    if     (this.lastCardPlayed.value == "CARD_DRAW2")     { this.flags.nextRoundFlags.draw2 = true; }
                    else if(this.lastCardPlayed.value == "CARD_WILD_DRAW4"){ this.flags.nextRoundFlags.draw4 = true; }
                    else if(this.lastCardPlayed.value == "CARD_SKIP")      { this.flags.nextRoundFlags.skip  = true; }
                    
                    // In two-player mode a reverse should act like a skip (and the flags should include the skip flag if a reverse was played.)
                    else if(this.lastCardPlayed.value == "CARD_REV"){
                        // Set the reverse flag.
                        this.flags.nextRoundFlags.reverse = true;

                        // Also set the skip flag if there are only 2 players.
                        if(this.gameBoard.activePlayerKeys.length == 2){ this.flags.nextRoundFlags.skip = true; }
                    }
                }

                // Set these flags.
                this.flags.playerTurn.play_init = true;

                // Did this player just win (has a card count of 0?)
                let playerKey = this.gameBoard.currentPlayer;
                let location = Deck.playerCardLocations[playerKey];
                let cardCount = this.deck.deck.filter(d=>d.location==location).length;
                
                // WIN?
                if(cardCount == 0){
                    // Set winner to the playerKey.
                    this.winningPlayerKey = playerKey;
                    console.log("winningPlayerKey:", this.winningPlayerKey);
                }

                this.gameBoard.setNextPlayer(this.flags.nextRoundFlags.reverse, true);
            }
            else{ console.log("endOfRound: INVALID FLAGS"); }
        },

        winsRound: function(gpInput){
            /* 
            LOGIC:
            One player at a time, cards will be moved from the player's hand to the new discard area.
            The color, value and points are displayed as soon as the card starts moving.
            
            The cards travel large and arrive large. (they are then hidden and their original size/rotation values are restored.)
            Cards are taken one-by-one, changing rows as needed.
            Each card adds to the displayed score for the player.
            The winning player receives the points. 

            When all cards are moved, move on to the next player.
            Process repeats until each player's cards have been moved.
            */

            // Update the largeCardBg colors if it is there.
            // let winRound_largeCardBg = _GFX.layerObjs.objs['gs_PLAYING']['winRound_largeCardBg'];
            // if(winRound_largeCardBg){ winRound_largeCardBg.nextFrame(); }

            if(this.flags.winsRound.init){
                this.gameBoard.winRound_start(this.winningPlayerKey);

                // All player cards face down.
                for(let playerKey of this.gameBoard.activePlayerKeys){
                    this.gameBoard.players[playerKey].currentRow = 0;
                    this.deck.flipPlayerCardsDown(playerKey, this.gameBoard.players[playerKey].currentRow);
                }

                // Set direction to forward.
                this.gameBoard.setDirectionIndicators("F");

                // Set the current player to the winning player.
                this.gameBoard.currentPlayer = this.winningPlayerKey;
                this.gameBoard.setNextPlayer(false, false); // Don't reset the current row.

                // Set flags.
                this.resetFlags();
                this.flags.winsRound.init = false;
                this.flags.winsRound.scoring = true;
            }
            else if(this.flags.winsRound.scoring){
                // LOGIC:
                // Cards move card by card, row by row, one player at a time to the destination.
                // The start of each card movement needs to update the text for the card color, value, and points.
                // Start with the player directly after the winning player (forward direction.)
                // Stop when the current player matches the winning player.
                // Get the max row count for the current player.
                // Get the current row for the current player.
                // Get the number of remaining displayed cards for the current player.
                // There are up to 5 card "slots" availble for display at a time.
                // If there are no more cards displayed and there is another row then switch to that row.
                // Repeat until all rows and cards have been moved.
                // THEN switch to the next player. 

                // Is this the last player to have their cards removed?
                if(this.gameBoard.currentPlayer == this.winningPlayerKey){
                    this.gameBoard.winRound_end_part1();

                    // Set flags.
                    this.resetFlags();
                    this.flags.winsRound.scoring = false;
                    this.flags.winsRound.checkGameWin = true;

                    // Short delay.
                    _APP.shared.genTimer.create("genWaitTimer1", 40, _APP.game.gs1, ()=>{});
                    
                    return;
                }

                let canQueue = false;
                let playerKey = this.gameBoard.currentPlayer;
                let slots = [
                    `${playerKey}_card_0`,
                    `${playerKey}_card_1`,
                    `${playerKey}_card_2`,
                    `${playerKey}_card_3`,
                    `${playerKey}_card_4`,
                ];
                let playerCardCount = this.deck.deck.filter(d => d.location == location).length;
                let curRowValue = this.gameBoard.players[playerKey].currentRow;
                let maxRowValue = (Math.ceil(playerCardCount / 5)) -1;
                if(maxRowValue < 0){ maxRowValue = 0; }
                
                // Flip up the cards.
                this.deck.flipPlayerCardsUp(playerKey, curRowValue);
                
                let displayedCardCount = slots.filter(d=>_GFX.layerObjs.getOne(d).hidden==false).length;

                let func = function(playerKey, timerKey, layerObjKey, cardSlot){
                    let _this = this;

                    // Update the points for the player.
                    let activeCard = _GFX.layerObjs.getOne(layerObjKey);
                    let color = activeCard.color.replace("CARD_", "");
                    let value = activeCard.value.replace("CARD_", "");
                    if(!isNaN(value)){ value = "CARD_" + value; }

                    let points = Deck.cardPoints[activeCard.value]
                    _this.gameBoard.players[this.winningPlayerKey].score += points;

                    // Update the card's rotation.
                    activeCard.setSetting("rotation", 0);

                    // Update the card's size.
                    activeCard.size = "lg";

                    // Update the display.
                    _this.gameBoard.winRound_updateScores(color, value, points);

                    // Update the text for the color, value, points.
                    // Points are added to the total score when the card is finished moving. 
                    _APP.game.gamestates.gs_PLAYING.addCardMovement(
                        "score"  , { 
                            timerKey     : timerKey, 
                            timerFrames  : _this.timerDelays.scoreCardReturn,
                            movementSpeed: _this.movementSpeeds.scoreCardReturn,
                            playerKey    : playerKey, 
                            layerObjKey  : layerObjKey,
                            cardSlot     : cardSlot,
                            finish: function(){ 
                                // console.log("Finish: score:", layerObjKey);
                                // Find the first instance of this card in the deck.
                                let cardInDeck = _this.deck.deck.find(d=>
                                    d.color==this.card.color && 
                                    d.value==this.card.value && 
                                    d.location != "CARD_LOCATION_DISCARD" &&
                                    d.location != "CARD_LOCATION_DRAW"
                                );

                                // This should not happen.
                                if(!cardInDeck){
                                    console.log("CARD NOT FOUND IN DECK/LOCATION:", this.card);
                                    debugger;
                                }

                                // Change the location to discard.
                                cardInDeck.location = "CARD_LOCATION_DISCARD";
                                
                                // Restore the correct card rotation.
                                activeCard.size = "sm";
                                activeCard.setSetting("rotation", Deck.playerCardRotations[playerKey]);
                                
                                // Set the card LayerObject to hidden.
                                let cardObj = this.card;
                                cardObj.hidden = true;

                                _this.gameBoard.updatePlayerText();
                                _this.deck.updateUnderPiles();
                                
                                _APP.shared.genTimer.removeOne(this.timerKey, null);
                            }
                        }
                    );
                };

                // Queue up card movements for this row for this player?
                if(displayedCardCount){
                    // console.log("There are cards to move on this row.");
                    canQueue = true;
                }

                // No cards visible. Is there another row?
                else if(curRowValue != maxRowValue){
                    console.log("Next row for:", playerKey);

                    // Change the row and flip up the cards.
                    curRowValue += 1;
                    this.deck.flipPlayerCardsUp(playerKey, curRowValue);

                    // Get the new visible cards.
                    displayedCardCount = slots.filter(d=>_GFX.layerObjs.getOne(d).hidden==false).length;

                    canQueue = true;
                }

                // Done with this player's cards.
                else{
                    // Change to next player.
                    this.gameBoard.setNextPlayer(false, true);
                }

                // Will we be moving cards?
                if(canQueue){
                    // Queue the movements.
                    for(let i=0, len=slots.length; i<len; i+=1){
                        if(_GFX.layerObjs.getOne(slots[i]).hidden==true){ continue; }

                        let funcName = `score_${playerKey}_card_${i}`;
                        _APP.shared.funcQueue.create(funcName, _APP.game.gs1, {
                            args: [playerKey, funcName, slots[i], i],
                            bind: this,
                            func: func
                        });
                    }
                }
            }

            else if(this.flags.winsRound.checkGameWin){
                // Game won atZeroCards?
                let gameOver = false;
                if(this.gameSettings.WIN == "atZeroCards"){ gameOver = true; }

                // Game won at500pts?
                else if(this.gameSettings.WIN == "at500pts"){
                    if(this.gameBoard.players[this.winningPlayerKey].score >= 500){ gameOver = true; }
                }
                else{
                    console.error("INVALID 'WIN' condition");
                }

                // Is this the end of the game?
                if(gameOver){
                    // Set flags.
                    this.resetFlags();
                    this.flags.winsRound.checkGameWin = false;
                    this.flags.winsRound.GameWin = true;

                    // Short delay.
                    _APP.shared.genTimer.create("genWaitTimer1", 40, _APP.game.gs1, ()=>{});
                }
                
                // No. There will be another round. 
                else{
                    // Set flags.
                    this.resetFlags();
                    this.flags.winsRound.checkGameWin = false;
                    this.flags.winsRound.nextRound = true;
    
                    // Short delay.
                    _APP.shared.genTimer.create("genWaitTimer1", 40, _APP.game.gs1, ()=>{});
                }
            }
            else if(this.flags.winsRound.GameWin){
                this.gameBoard.displayMessage("winsGame"  , this.winningPlayerKey, false); 

                // Wait for a button to be released before continuing.
                if(gpInput.ANY_bool.release)    { 
                    // Reset flags.
                    this.resetFlags();
                    
                    // Clear the inited flag.
                    this.inited = false;

                    // Clear the startScores.
                    for(let playerKey in this.gameBoard.players){
                        this.startScores[playerKey] = 0;
                    }

                    // Change gamestate to the title screen.
                    _APP.game.changeGs1("gs_TITLE");
                    _APP.game.changeGs2("init");

                    return;
                }
            }
            else if(this.flags.winsRound.nextRound){
                // Display message.
                this.gameBoard.displayMessage("startNextRound"  , this.winningPlayerKey, false); 

                // Short delay then clear message and restart the game.
                _APP.shared.genTimer.create("genWaitTimer1", this.timerDelays.winsRound, _APP.game.gs1, ()=>{
                    // Clear the message.
                    this.gameBoard.displayMessage("none", this.gameBoard.currentPlayer, false);

                    // Wait and then reset the game. 
                    _APP.shared.genTimer.create("genWaitTimer1", 40, _APP.game.gs1, ()=>{
                        // Remove the black background.
                        this.gameBoard.winRound_end_part2();

                        this.resetFlags();
                        this.inited = false;
                        _APP.game.changeGs2("init");

                        return;
                    });
                });
            }
            else{ 
                console.log("winsRound: INVALID FLAGS"); 
                _APP.shared.genTimer.create("genWaitTimer1", 40, _APP.game.gs1, ()=>{});
            }
        },

        // Actions based on cards: WILD, WILD_DRAW4, DRAW2, SKIP, REVERSE
        action_changeColor: function(gpInput){
            this.colorChanger.nextFrame();
            if(gpInput.ANY.press.BTN_LEFT) { this.colorChanger.moveCursor(-1); }
            if(gpInput.ANY.press.BTN_RIGHT){ this.colorChanger.moveCursor(1); }
            if(gpInput.ANY.press.BTN_A)    { 
                // Accept the color change. (and hides the colorChanger.)
                this.colorChanger.accept(); 
                // console.log(`Color changed by: ${this.gameBoard.currentPlayer} to: ${this.gameBoard.currentColor}`);

                _APP.shared.genTimer.create("genWaitTimer2", this.timerDelays.endOfTurn, _APP.game.gs1, ()=>{});
            }
        },
        action_pauseMenu: function(gpInput){
            // Animate the cursor.
            this.pauseMenu.nextFrame();

            // Move the cursor?
            if(gpInput.ANY.press.BTN_UP) { this.pauseMenu.moveCursor(-1); }
            else if(gpInput.ANY.press.BTN_DOWN){ this.pauseMenu.moveCursor(1); }

            // Exit the pause menu?
            else if(gpInput.ANY.press.BTN_B)    { 
                this.pauseMenu.hide();
            }

            // Make a selection.
            else if(gpInput.ANY.press.BTN_A)    { 
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
                                    _this.lastDrawnCard = newCard;
                                    // console.log("newCard:", newCard, _this.lastDrawnCard);

                                    _this.gameBoard.updatePlayerText();
                                    _this.deck.updateUnderPiles();
                                    
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
