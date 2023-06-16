var _DEBUG2 = {
    navBar1 : {
        // Holds the DOM for the nav buttons and nav views.
        DOM: {
            'view_gs_JSG': {
                'tab' : 'debug_navBar2_tab_gs_JSG',
                'view': 'debug_navBar2_view_gs_JSG',
            },
            'view_gs_N782': {
                'tab' : 'debug_navBar2_tab_gs_N782',
                'view': 'debug_navBar2_view_gs_N782',
            },
            'view_gs_TITLE': {
                'tab' : 'debug_navBar2_tab_gs_TITLE',
                'view': 'debug_navBar2_view_gs_TITLE',
            },
            'view_gs_RULES': {
                'tab' : 'debug_navBar2_tab_gs_RULES',
                'view': 'debug_navBar2_view_gs_RULES',
            },
            'view_gs_CREDITS': {
                'tab' : 'debug_navBar2_tab_gs_CREDITS',
                'view': 'debug_navBar2_view_gs_CREDITS',
            },
            'view_gs_OPTIONS': {
                'tab' : 'debug_navBar2_tab_gs_OPTIONS',
                'view': 'debug_navBar2_view_gs_OPTIONS',
            },
            'view_gs_PLAYING': {
                'tab' : 'debug_navBar2_tab_gs_PLAYING',
                'view': 'debug_navBar2_view_gs_PLAYING',
            },
        },
        hideAll: _APP.navBar1.hideAll,
        showOne: _APP.navBar1.showOne,
        init   : _APP.navBar1.init,
    },
    navBar_gs_PLAYING : {
        // Holds the DOM for the nav buttons and nav views.
        // debug_navBarTabs_gs_PLAYING
        // debug_navBarViews_gs_PLAYING
        DOM: {
            'view_settings': {
                'tab' : 'debug_navBar_gs_PLAYING_tab_settings',
                'view': 'debug_navBar_gs_PLAYING_view_settings',
            },
            'view_deck': {
                'tab' : 'debug_navBar_gs_PLAYING_tab_deck',
                'view': 'debug_navBar_gs_PLAYING_view_deck',
            },
            'view_cardMove': {
                'tab' : 'debug_navBar_gs_PLAYING_tab_cardMove',
                'view': 'debug_navBar_gs_PLAYING_view_cardMove',
            },
            'view_flags': {
                'tab' : 'debug_navBar_gs_PLAYING_tab_flags',
                'view': 'debug_navBar_gs_PLAYING_view_flags',
            },
        },
        hideAll: _APP.navBar1.hideAll,
        showOne: _APP.navBar1.showOne,
        init   : _APP.navBar1.init,
    },
    debugGamestate: {
        funcs: {
            // updateDisplayedValue: function(){},
        },

        // NOTE: debug object keys must match gs1. gs2 keys go within that key and must match gs2.

        // Set the inited false false for the specified debug object.
        uninit: function(gs1, gs2){ 
            // console.log(`Running debugGamestate.uninit for: gs1: '${gs1}', gs2: '${gs2}'`);
            if(!this[gs1]){ return; }
            this[gs1].inited = false; 
        },
        
        // Run the debug function(s) for the specified gs1 and gs2.
        run: function(gs1, gs2){
            if(!_APP.debug2Active){ return; }

            if(!this[gs1]){ return; }
            if(this[gs1].gs1){
                // Run gamestate debug init?
                if(!this[gs1].inited){ this[gs1].init(); }

                // Run the gamestate 1 debug.
                this[gs1].gs1();
                
                // Run the gamestate 2 debug.
                if(this[gs1][gs2]){ this[gs1][gs2](); }

                // Do not allow "DONE" for gs2.
                if(gs2 == "DONE"){ 
                    throw "debugGamestate: gs2 is 'DONE' but that should not happen."; 
                }
            }
            else{
                throw "debugGamestate: gs1 is unknown but that should not happen."; 
            }
        },

        // Debug object for: gamestate 1: gs_TITLE
        gs_TITLE: {
            parent: null,
            inited: false,
            DOM: {},
            initOnce: function(){},
            init: function(){
                _DEBUG2.navBar1.showOne("view_gs_TITLE");
                this.inited = true; 
            },
            gs1: function(){},
        },

        // Debug object for: gamestate 1: gs_RULES
        gs_RULES: {
            parent: null,
            inited: false,
            DOM: {},
            initOnce: function(){},
            init: function(){
                _DEBUG2.navBar1.showOne("view_gs_RULES");
                this.inited = true; 
            },
            gs1: function(){},
        },

        // Debug object for: gamestate 1: gs_CREDITS
        gs_CREDITS: {
            parent: null,
            inited: false,
            DOM: {},
            initOnce: function(){},
            init: function(){
                _DEBUG2.navBar1.showOne("view_gs_CREDITS");
                this.inited = true; 
            },
            gs1: function(){},
        },

        // Debug object for: gamestate 1: gs_TITLE
        gs_TITLE: {
            parent: null,
            inited: false,
            DOM: {},
            initOnce: function(){},
            init: function(){
                _DEBUG2.navBar1.showOne("view_gs_TITLE");
                this.inited = true; 
            },
            gs1: function(){},
        },

        // Debug object for: gamestate 1: gs_OPTIONS
        gs_OPTIONS: {
            parent: null,
            inited: false,
            DOM: {},
            initOnce: function(){},
            init: function(){
                _DEBUG2.navBar1.showOne("view_gs_OPTIONS");
                this.inited = true; 
            },
            gs1: function(){},
        },
        
        // Debug object for: gamestate 1: gs_JSG
        gs_JSG: {
            parent: null,
            inited: false,
            DOM: {},
            initOnce: function(){},
            init: function(){
                _DEBUG2.navBar1.showOne("view_gs_JSG");
                this.inited = true; 
            },
            gs1: function(){},
        },
        
        // Debug object for: gamestate 1: gs_N782
        gs_N782: {
            parent: null,
            inited: false,
            DOM: {},
            initOnce: function(){},
            init: function(){
                _DEBUG2.navBar1.showOne("view_gs_N782");
                this.inited = true; 
            },
            gs1: function(){
            },
            anim1: function(){
            },
            anim2: function(){
            },
        },
        
        // Debug object for: gamestate 1: gs_PLAYING
        gs_PLAYING: {
            parent: null,
            inited: false,
            DOM: {
                "messageSelect": "debug_PLAYING_messageSelect",
                "messageButton": "debug_PLAYING_messageButton",
                
                "colorPlayerSelect": "debug_PLAYING_colorPlayerSelect",
                "colorSelect"      : "debug_PLAYING_colorSelect",
                "colorButton"      : "debug_PLAYING_colorButton",
                
                "dirFButton": "debug_PLAYING_dirFButton",
                "dirNButton": "debug_PLAYING_dirNButton",
                "dirRButton": "debug_PLAYING_dirRButton",

                "bgColorSelect": "debug_PLAYING_bgColorSelect",
                "bgColorButton": "debug_PLAYING_bgColorButton",
            },
            initOnce: function(){
                // MESSAGE CHANGE
                this.DOM["messageSelect"].addEventListener("change", function(){ 
                    _APP.game.gamestates["gs_PLAYING"].gameBoard.displayMessage(this.value, "P1", false);
                }, false);
                this.DOM["messageButton"].addEventListener("click" , ()=>{ 
                    _APP.game.gamestates["gs_PLAYING"].gameBoard.displayMessage(this.DOM["messageSelect"].value, "P1", false);
                }, false);

                // COLOR CHANGE
                this.DOM["colorSelect"].addEventListener("change", ()=>{ 
                    let color     = this.DOM["colorSelect"].value;
                    let playerKey = this.DOM["colorPlayerSelect"].value;
                    _APP.game.gamestates["gs_PLAYING"].gameBoard.setColorIndicators(playerKey, color);
                }, false);
                this.DOM["colorButton"].addEventListener("click" , ()=>{ 
                    let color     = this.DOM["colorSelect"].value;
                    let playerKey = this.DOM["colorPlayerSelect"].value;
                    _APP.game.gamestates["gs_PLAYING"].gameBoard.setColorIndicators(playerKey, color);
                }, false);
                this.DOM["colorPlayerSelect"].addEventListener("change" , ()=>{ 
                    let color     = this.DOM["colorSelect"].value;
                    let playerKey = this.DOM["colorPlayerSelect"].value;
                    _APP.game.gamestates["gs_PLAYING"].gameBoard.setColorIndicators(playerKey, color);
                }, false);

                // DIRECTION CHANGE.
                this.DOM["dirFButton"].addEventListener("click", ()=>{ _APP.game.gamestates["gs_PLAYING"].gameBoard.setDirectionIndicators("F"); }, false);
                this.DOM["dirNButton"].addEventListener("click", ()=>{ _APP.game.gamestates["gs_PLAYING"].gameBoard.setDirectionIndicators("N"); }, false);
                this.DOM["dirRButton"].addEventListener("click", ()=>{ _APP.game.gamestates["gs_PLAYING"].gameBoard.setDirectionIndicators("R"); }, false);

                // BGCOLOR CHANGE
                this.DOM["bgColorSelect"].addEventListener("change", ()=>{ 
                    let value = this.DOM["bgColorSelect"].value.split(",");
                    value = value.map(d=>d|0);
                    _GFX.funcs.updateL1BgColorRgba(value);
                }, false);
                this.DOM["bgColorButton"].addEventListener("click" , ()=>{ 
                    let value = this.DOM["bgColorSelect"].value.split(",");
                    value = value.map(d=>d|0);
                    _GFX.funcs.updateL1BgColorRgba(value);
                }, false);

                // DECK SETTINGS.
                this.settings.init(this);

                // DECK CONTROL.
                this.deckControl.init(this);

                // CARD MOVE.
                this.cardMove.init(this);

                // FLAGS.
                this.flags.init(this);
            },
            init: function(){
                _DEBUG2.navBar1.showOne("view_gs_PLAYING");
                this.inited = true; 
            },
            flags: {
                parent:null,
                values : {
                    // flags1Text: "",
                    // flags2Text: "",

                    hashes: {
                        hash_getFirstPlayer : 0,
                        hash_playerTurn     : 0,
                        hash_endOfRound     : 0,
                        hash_nextRoundFlags : 0,
                    },

                    flags_getFirstPlayerText: "",
                    flags_playerTurnText: "",
                    flags_endOfRoundText: "",

                    cardsText: "",
                    funcQueue: "",
                },
                DOM: { 
                    // "flags1Text"    : "debug_flags_flags",
                    // "flags2Text"    : "debug_flags_flags2",

                    "getFirstPlayerText": "debug_flags_getFirstPlayer",
                    "playerTurnText"    : "debug_flags_playerTurn",
                    "endOfRoundText"    : "debug_flags_endOfRound",
                    "nextRoundFlagsText": "debug_flags_nextRoundFlags",

                    "cardMovements" : "debug_flags_cardMovements",
                    "funcQueue"     : "debug_flags_funcQueue",
                    "timers1Text"   : "debug_flags_timers1",
                    "timers2Text"   : "debug_flags_timers2",
                },
                init: function(parent){
                    this.parent = parent;
                    for(let elemKey in this.DOM){
                        this.DOM[elemKey] = document.getElementById(this.DOM[elemKey]);
                    }
                },
                updateGameFlags_data: {
                    getFirstPlayer: { domStr: "getFirstPlayerText", valueKey: "getFirstPlayer", flagsObjKey: "getFirstPlayer", newHash:0, prevHash: 0 },
                    playerTurn    : { domStr: "playerTurnText"    , valueKey: "playerTurn"    , flagsObjKey: "playerTurn"    , newHash:0, prevHash: 0 },
                    endOfRound    : { domStr: "endOfRoundText"    , valueKey: "endOfRound"    , flagsObjKey: "endOfRound"    , newHash:0, prevHash: 0 },
                    nextRoundFlags: { domStr: "nextRoundFlagsText", valueKey: "nextRoundFlags", flagsObjKey: "nextRoundFlags", newHash:0, prevHash: 0 },
                },
                updateGameFlags: function(){
                    let flagsObj = _APP.game.gamestates.gs_PLAYING.new_flags;
                    let data = this.updateGameFlags_data;
                    data.getFirstPlayer.newHash = _GFX.utilities.djb2Hash( JSON.stringify( flagsObj.getFirstPlayer ) );
                    data.playerTurn.newHash     = _GFX.utilities.djb2Hash( JSON.stringify( flagsObj.playerTurn ) );
                    data.endOfRound.newHash     = _GFX.utilities.djb2Hash( JSON.stringify( flagsObj.endOfRound ) );
                    data.nextRoundFlags.newHash = _GFX.utilities.djb2Hash( JSON.stringify( flagsObj.nextRoundFlags ) );

                    let newText;
                    let maxLen;
                    for(let key in data){
                        let rec = data[key];

                        // Are the hashes different?
                        if(rec.newHash != this.values[rec.valueKey]){
                            // Store the new hash.
                            this.values[rec.valueKey] = rec.newHash;

                            // Regenerate the text.
                            newText = ``;
                            maxLen = 0;
                            for(let key in flagsObj[rec.flagsObjKey]){ if(key.length > maxLen){ maxLen = key.length; } }
                            for(let key in flagsObj[rec.flagsObjKey]){ 
                                // Get the value. 
                                value = flagsObj[rec.flagsObjKey][key];
                                
                                // Convert true/false to 1/0.
                                type = typeof value;
                                if(type === "boolean"){ value = value ? 1: 0; }
                                // if(type === "string") { value = value ? 1: 0; }

                                // Add this as a line to newText.
                                newText += `${key.padEnd(maxLen, " ")}: ${value}\n`; 
                            }

                            // Update the displayed text.
                            this.DOM[rec.domStr].innerText = newText;
                        }
                    };
                },
                checkForChanges: function(){
                    // Update game flags.
                    this.updateGameFlags();

                    // Update card movements.
                    if(_APP.game.gamestates.gs_PLAYING.cardMovements.length){
                        newText = ``;
                        newText = _APP.game.gamestates.gs_PLAYING.cardMovements.length;
                        // for(let cardMovement of _APP.game.gamestates.gs_PLAYING.cardMovements){
                        //     if(!cardMovement.started){ continue; }
                        //     let timer = _APP.shared.genTimer.get(cardMovement.timerKey);
                        //     newText += `T:${timer.frameCount}/${timer.maxFrames}`;
                        //     newText += `, F:${cardMovement.func}`;
                        //     newText += `, C:${cardMovement.card.color.replace("CARD_", "")}, V:${cardMovement.card.value.replace("CARD_", "")}`;
                        //     newText += `\n`;
                        // }
                        if(newText != this.values.cardsText){
                            this.values.cardsText = newText; 
                            this.DOM.cardMovements.innerText = newText;
                        }
                    }
                    else{
                        if(this.values.cardsText != "NONE"){
                            this.values.cardsText = "NONE"; 
                            this.DOM.cardMovements.innerText = "NONE";
                        }
                    }
                    
                    // Update funcQueue
                    if(_APP.shared.funcQueue.funcs.gs_PLAYING){
                        if(_APP.shared.funcQueue.funcs.gs_PLAYING.length){
                            this.values.funcQueue = _APP.shared.funcQueue.funcs.gs_PLAYING.length;
                            this.DOM.funcQueue.innerText = _APP.shared.funcQueue.funcs.gs_PLAYING.length;
                        }
                        else{
                            if(this.values.funcQueue != "NONE"){
                                this.values.funcQueue = "NONE";
                                this.DOM.funcQueue.innerText = "NONE";
                            }
                        }
                    }

                    // Update timer data. (NOT the permanent ones.)
                    let keys = Object.keys(_APP.shared.genTimer.timers[_APP.game.gs1]).filter(d=> !_APP.game.gamestates.gs_PLAYING.timerKeysKeep.includes(d) )
                    newText = ``;
                    for(let name of keys){
                        let timer = _APP.shared.genTimer.get(name);
                        // newText += `N:${name} ::  T:${timer.frameCount}/${timer.maxFrames}\n`;
                        newText += `T: ${ (timer.frameCount +"/"+ timer.maxFrames).padEnd(6, " ")} :: ${name}\n`;
                    }
                    this.DOM.timers2Text.innerHTML = newText;

                    // Update timer data. (The permanent ones.)
                    keys = _APP.game.gamestates.gs_PLAYING.timerKeysKeep;
                    newText = ``;
                    for(let name of keys){
                        let timer = _APP.shared.genTimer.get(name);
                        newText += `T: ${ (timer.frameCount +"/"+ timer.maxFrames).padEnd(6, " ")} :: ${name}\n`;
                    }
                    this.DOM.timers1Text.innerHTML = newText;
                },
            },
            settings: {
                parent:null,
                DOM: { 
                    // "contextMenu"   : "debug_cardAssignment_contextMenu",
                },
                init: function(parent){
                    this.parent = parent;
                    for(let elemKey in this.DOM){
                        this.DOM[elemKey] = document.getElementById(this.DOM[elemKey]);
                    }
                },
            },
            cardMove: {
                parent:null,
                DOM: { 
                    "cardMoveTable"   : "debug_cardMoveTable",
                },

                createBr  : function(){
                    let elem = document.createElement("br");
                    return elem;
                },
                createSelectButton  : function(playerKey, layerObjKey){
                    let elem = document.createElement("button");
                    elem.title = layerObjKey;
                    elem.style.width = "56px";
                    elem.innerText = "SELE";
                    let timerKey = "moveCardToSelected";
                    elem.onclick = function(){
                        _APP.game.gamestates.gs_PLAYING.addCardMovement(
                            "selected"  , { 
                                timerKey   : timerKey   , 
                                timerFrames: 20,
                                playerKey  : playerKey  , 
                                layerObjKey: layerObjKey ,
                                movementSpeed: _APP.game.gamestates.gs_PLAYING.movementSpeeds.selectCard,
                        });
                    };
                    return elem;
                },
                createUnselectButton: function(playerKey, layerObjKey){
                    let elem = document.createElement("button");
                    elem.title = layerObjKey;
                    elem.style.width = "56px";
                    elem.innerText = "BACK";
                    let timerKey = "moveCardToUnselected";
                    elem.onclick = function(){
                        _APP.game.gamestates.gs_PLAYING.addCardMovement(
                            "unselected"  , { 
                                timerKey   : timerKey   , 
                                timerFrames: 20,
                                playerKey  : playerKey  , 
                                layerObjKey: layerObjKey ,
                                movementSpeed: _APP.game.gamestates.gs_PLAYING.movementSpeeds.unselectCard,
                        });
                    };
                    return elem;
                },
                createDiscButton    : function(playerKey, layerObjKey){
                    let elem = document.createElement("button");
                    elem.title = layerObjKey;
                    elem.style.width = "56px";
                    elem.innerText = "DISC";
                    let timerKey = "moveCardToDiscard";
                    elem.onclick = ()=>{
                        _APP.game.gamestates.gs_PLAYING.addCardMovement(
                            "discard"  , { 
                                timerKey   : timerKey   , 
                                timerFrames: 20,
                                movementSpeed: _APP.game.gamestates.gs_PLAYING.movementSpeeds.returnOneCard,
                                playerKey  : playerKey  , 
                                layerObjKey  : layerObjKey  , 
                        });
                    };
                    return elem;
                },
                createDrawButton    : function(playerKey, layerObjKey){
                    let elem = document.createElement("button");
                    elem.title = layerObjKey;
                    elem.style.width = "56px";
                    elem.innerText = "DRAW";
                    let timerKey = "moveDrawToCard";
                    elem.onclick = function(){
                        let [playerKey, cardSlot] = layerObjKey.split("_card_");
                        _APP.game.gamestates.gs_PLAYING.addCardMovement(
                            "draw"  , { 
                                timerKey   : timerKey   , 
                                timerFrames: 20,
                                movementSpeed: _APP.game.gamestates.gs_PLAYING.movementSpeeds.dealOneCard,
                                playerKey  : playerKey  , 
                                layerObjKey: layerObjKey,
                                cardSlot   : cardSlot,
                        });
                    };
                    return elem;
                },
                createHomeButton    : function(playerKey, layerObjKey){
                    let elem = document.createElement("button");
                    elem.title = layerObjKey;
                    elem.style.width = "56px";
                    elem.innerText = "HOME";
                    let timerKey = "moveCardHome";
                    elem.onclick = function(){
                        _APP.game.gamestates.gs_PLAYING.addCardMovement(
                            "home"  , { 
                                timerKey   : timerKey   , 
                                timerFrames: 20,
                                movementSpeed: _APP.game.gamestates.gs_PLAYING.movementSpeeds.returnOneCard,
                                playerKey  : playerKey  , 
                                layerObjKey: layerObjKey 
                        });
                    };
                    return elem;
                },
                buildUi: function(){
                    let layerObjKeys = {
                        "P1": [ "P1_card_0", "P1_card_1", "P1_card_2", "P1_card_3", "P1_card_4" ], 
                        "P2": [ "P2_card_0", "P2_card_1", "P2_card_2", "P2_card_3", "P2_card_4" ], 
                        "P3": [ "P3_card_0", "P3_card_1", "P3_card_2", "P3_card_3", "P3_card_4" ], 
                        "P4": [ "P4_card_0", "P4_card_1", "P4_card_2", "P4_card_3", "P4_card_4" ], 
                    };
                    let table = this.DOM.cardMoveTable;
                    for(let playerKey in layerObjKeys){
                        let tr = table.insertRow(-1);
                        let td = tr.insertCell();
                        td.classList.add("debug_td_header3")
                        td.innerText = playerKey;
                        for(let layerObjKey of layerObjKeys[playerKey]){
                            td = tr.insertCell();
                            td.append(
                                this.createSelectButton(playerKey, layerObjKey),
                                this.createUnselectButton(playerKey, layerObjKey),
                                this.createBr(),
                                this.createDiscButton(playerKey, layerObjKey),
                                this.createDrawButton(playerKey, layerObjKey),
                                this.createBr(),
                                this.createHomeButton(playerKey, layerObjKey),
                            );
                        }
                    }
                },
                init: function(parent){
                    this.parent = parent;
                    for(let elemKey in this.DOM){
                        this.DOM[elemKey] = document.getElementById(this.DOM[elemKey]);
                    }
                    this.buildUi();
                },
            },
            deckControl: {
                parent:null,
                values: {
                    hash_location_DISCARD: null,
                    hash_location_DRAW   : null,
                    hash_location_PLAYER1: null,
                    hash_location_PLAYER2: null,
                    hash_location_PLAYER3: null,
                    hash_location_PLAYER4: null,
                    hash_lastCardPlayed  : null, 
                    hash_lastSelectedCard: null, 
                },
                DOM: { 
                    "contextMenu"     : "debug_cardAssignment_contextMenu",
                    "drawCards"       : "debug_drawCards",
                    "discardCards"    : "debug_discardCards",
                    "P1Cards"         : "debug_P1Cards",
                    "P2Cards"         : "debug_P2Cards",
                    "P3Cards"         : "debug_P3Cards",
                    "P4Cards"         : "debug_P4Cards",
                    "lastCardPlayed"  : "debug_lastCardPlayed",
                    "lastSelectedCard": "debug_lastSelectedCard",
                },
                init: function(parent){
                    this.parent = parent;
                    for(let elemKey in this.DOM){
                        this.DOM[elemKey] = document.getElementById(this.DOM[elemKey]);
                    }
                },
                lastRun: 0,
                runDelay: 250,
                checkForDeckChanges_data: [
                    { locStr: "CARD_LOCATION_DISCARD", domStr: "discardCards", valStr: "hash_location_DISCARD" },
                    { locStr: "CARD_LOCATION_DRAW"   , domStr: "drawCards"   , valStr: "hash_location_DRAW"    },
                    { locStr: "CARD_LOCATION_PLAYER1", domStr: "P1Cards"     , valStr: "hash_location_PLAYER1" },
                    { locStr: "CARD_LOCATION_PLAYER2", domStr: "P2Cards"     , valStr: "hash_location_PLAYER2" },
                    { locStr: "CARD_LOCATION_PLAYER3", domStr: "P3Cards"     , valStr: "hash_location_PLAYER3" },
                    { locStr: "CARD_LOCATION_PLAYER4", domStr: "P4Cards"     , valStr: "hash_location_PLAYER4" },
                ],
                checkForDeckChanges: function(){
                    if( this.lastRun != 0 && (performance.now() - this.lastRun < this.runDelay) ){ 
                        // console.log("not running"); 
                        return; 
                    }
                    this.lastRun = performance.now();

                    // Generate a version of the current deck that also includes index values.
                    let deck = _APP.game.gamestates["gs_PLAYING"].deck.deck.map((d, i) => ({ index: i, value: d }));
                    let locations = this.checkForDeckChanges_data;
                    
                    let changes = [];
                    for(let location of locations){
                        // Filter for the current location. 
                        let filteredCards = deck.filter(d => d.value.location == location.locStr);
                        // Get the previous hash.
                        let prevHash = this.values[location.valStr];
                        // Generate a new hash.
                        let newHash =  _GFX.utilities.djb2Hash( JSON.stringify( filteredCards ) );
                        // If the hashes do not match then update.
                        if(newHash != prevHash){
                            // Update the prevHash with the newHash.
                            this.values[location.valStr] = newHash;

                            // Generate new HTML.
                            let frag = document.createDocumentFragment();
                            for(let card of filteredCards){ frag.append(this.createCardElem2(card.index, card.value)); }
                            
                            // Add to the changes.
                            changes.push({
                                target: this.DOM[location.domStr],
                                method: "replaceChildren",
                                frag: frag,
                            });
                        }
                    }

                    if(changes.length){
                        for(let change of changes){
                            // Add the new HTML.
                            change.target[change.method](change.frag); 
                        }
                    }

                    // lastCardPlayed
                    let elem;
                    if(_APP.game.gamestates.gs_PLAYING.lastCardPlayed){
                        let newHash = _GFX.utilities.djb2Hash( JSON.stringify( _APP.game.gamestates.gs_PLAYING.lastCardPlayed ) );
                        let oldHash = this.values.hash_lastCardPlayed;
                        if(oldHash != newHash){
                            elem = this.createCardElem2(0, _APP.game.gamestates.gs_PLAYING.lastCardPlayed);
                            this.DOM.lastCardPlayed.replaceChildren(elem);
                            this.values.hash_lastCardPlayed = newHash;
                        }
                    }
                    
                    // lastSelectedCard
                    if(_APP.game.gamestates.gs_PLAYING.lastSelectedCard){
                        let newHash = _GFX.utilities.djb2Hash( JSON.stringify( _APP.game.gamestates.gs_PLAYING.lastSelectedCard ) );
                        let oldHash = this.values.hash_lastSelectedCard;
                        if(oldHash != newHash){
                            elem = this.createCardElem2(0, _APP.game.gamestates.gs_PLAYING.lastSelectedCard);
                            this.DOM.lastSelectedCard.replaceChildren(elem);
                            this.values.hash_lastSelectedCard = newHash;
                        }
                    }
                },
                contextMenu1_open: function(e, elem){
                    e.preventDefault();
                    let cardIndex   = elem.getAttribute("cardIndex"); 
                    let cardColor   = elem.getAttribute("cardcolor"); 
                    let cardlocation= elem.getAttribute("cardlocation"); 
                    let cardvalue   = elem.getAttribute("cardvalue"); 
    
                    // Get the contextMenu element
                    let contextMenu = this.DOM["contextMenu"];
    
                    // Create the contents of the menu.
                    contextMenu.innerHTML = `` +
                    `<button onclick="_DEBUG2.debugGamestate.gs_PLAYING.deckControl.contextMenu1_close();">CANCEL</button>`+
                    `<br><br>`+
                    `<u>CARD:</u><br>` +
                    `  INDEX : ${cardIndex.replace(/CARD_/g, "")} (card index in deck)<br>` +
                    `  TYPE  : ${cardvalue.replace(/CARD_/g, "")} (${cardColor.replace(/CARD_/g, "")})<br>` +
                    `  OWNER : ${cardlocation.replace(/CARD_LOCATION_/g, "")}<br>` +
                    `<br>`+
                    `<u>ASSIGN TO:</u><br><br>` +
                    ` <div class="option ${cardlocation=="CARD_LOCATION_DRAW"   ?"notVisible":""}" onclick="_DEBUG2.debugGamestate.gs_PLAYING.deckControl.contextMenu1_select(${+cardIndex}, 'CARD_LOCATION_DRAW'   );">DRAW PILE</div>`+
                    ` <div class="option ${cardlocation=="CARD_LOCATION_DISCARD"?"notVisible":""}" onclick="_DEBUG2.debugGamestate.gs_PLAYING.deckControl.contextMenu1_select(${+cardIndex}, 'CARD_LOCATION_DISCARD');">DISCARD PILE</div>`+
                    `<br>`+
                    ` <div class="option ${cardlocation=="CARD_LOCATION_PLAYER1"?"notVisible":""}" onclick="_DEBUG2.debugGamestate.gs_PLAYING.deckControl.contextMenu1_select(${+cardIndex}, 'CARD_LOCATION_PLAYER1');">P1 HAND</div>`+
                    ` <div class="option ${cardlocation=="CARD_LOCATION_PLAYER2"?"notVisible":""}" onclick="_DEBUG2.debugGamestate.gs_PLAYING.deckControl.contextMenu1_select(${+cardIndex}, 'CARD_LOCATION_PLAYER2');">P2 HAND</div>`+
                    `<br>`+
                    ` <div class="option ${cardlocation=="CARD_LOCATION_PLAYER3"?"notVisible":""}" onclick="_DEBUG2.debugGamestate.gs_PLAYING.deckControl.contextMenu1_select(${+cardIndex}, 'CARD_LOCATION_PLAYER3');">P3 HAND</div>`+
                    ` <div class="option ${cardlocation=="CARD_LOCATION_PLAYER4"?"notVisible":""}" onclick="_DEBUG2.debugGamestate.gs_PLAYING.deckControl.contextMenu1_select(${+cardIndex}, 'CARD_LOCATION_PLAYER4');">P4 HAND</div>`+
                    ``;
    
                    // Set the position of the context menu and display it
                    let top  = Math.max(0, e.layerY - 20);
                    let left = Math.max(0, e.layerX - 140);
                    contextMenu.style.top  = top + 'px';
                    contextMenu.style.left = left + 'px';
                    contextMenu.style.display = 'block';
                },
                contextMenu1_select: function(cardIndex, location){
                    // Update the card object.
                    _APP.game.gamestates["gs_PLAYING"].deck.deck[cardIndex].location = location;
                    
                    // Set lastRun to 0 so that it runs again immediately.
                    this.lastRun = 0;
                    // this.lastRun = performance.now();

                    // Close the contextMenu.
                    this.contextMenu1_close();
                },
                contextMenu1_close: function(){
                    // Get the contextMenu element
                    let contextMenu = this.DOM["contextMenu"];
    
                    // Close the contextMenu.
                    contextMenu.style.display = 'none';
                },
                createCardElem_data: {
                    colors : {
                        "CARD_YELLOW": "yellow",
                        "CARD_BLUE"  : "blue",
                        "CARD_RED"   : "red",
                        "CARD_GREEN" : "green",
                        "CARD_BLACK" : "black",
                    },
                    values : {
                        "CARD_0"         : "0",
                        "CARD_1"         : "1",
                        "CARD_2"         : "2",
                        "CARD_3"         : "3",
                        "CARD_4"         : "4",
                        "CARD_5"         : "5",
                        "CARD_6"         : "6",
                        "CARD_7"         : "7",
                        "CARD_8"         : "8",
                        "CARD_9"         : "9",
                        "CARD_DRAW2"     : "D2",
                        "CARD_SKIP"      : "SKIP",
                        "CARD_REV"       : "REV",
                        "CARD_WILD"      : "WILD",
                        "CARD_WILD_DRAW4": "W_D4",
                        "CARD_BACK"      : "BACK",
                    },
                },
                createCardElem2: function(index, card){
                    // Get the colors and the values. 
                    let colors = this.createCardElem_data.colors;
                    let values = this.createCardElem_data.values;
                    
                    // Create the container.
                    let container = document.createElement("span");
                    container.setAttribute("cardIndex", index);
                    container.setAttribute("cardcolor", card.color);
                    container.setAttribute("cardlocation", card.location);
                    container.setAttribute("cardvalue", card.value);
                    container.setAttribute("oncontextmenu", `event.preventDefault(); _DEBUG2.debugGamestate.gs_PLAYING.deckControl.contextMenu1_open(event, this);`);
                    container.classList.add( "card", colors[card.color] );
                    
                    // Create the inner label. 
                    let inner = document.createElement("span");
                    inner.innerText = values[card.value];
                    inner.classList.add("label");

                    // Add the label to the container. 
                    container.append(inner);

                    // Return the container.
                    return container;
                },
            },
            gs1: function(){
                this.deckControl.checkForDeckChanges();
                this.flags.checkForChanges();
            },
            anim1: function(){
            },
            anim2: function(){
            },
        },

        init: async function(){
            // DEBUG2 NAV 1
            _DEBUG2.navBar1.init();
            // _DEBUG2.navBar1.showOne("view_gs_JSG");
            // _DEBUG2.navBar1.showOne("view_gs_N782");
            // _DEBUG2.navBar1.showOne("view_gs_TITLE");
            _DEBUG2.navBar1.showOne("view_gs_PLAYING");
            
            _DEBUG2.navBar_gs_PLAYING.init();
            // _DEBUG2.navBar_gs_PLAYING.showOne("view_settings");
            // _DEBUG2.navBar_gs_PLAYING.showOne("view_deck");
            // _DEBUG2.navBar_gs_PLAYING.showOne("view_cardMove");
            _DEBUG2.navBar_gs_PLAYING.showOne("view_flags");

            // KEYS
            let keys = [
                "gs_JSG",
                "gs_N782",
                "gs_TITLE",
                "gs_PLAYING",
            ];
            for(let key of keys){
                if(!this[key] || !this[key].DOM){ continue; }
                for(let elemKey in this[key].DOM){
                    this[key].DOM[elemKey] = document.getElementById(this[key].DOM[elemKey]);
                }
                if(this[key].initOnce){ this[key].initOnce(); }
            }

            // Set parents.
            this.gs_TITLE.parent   = this;
            this.gs_JSG.parent     = this;
            this.gs_N782.parent    = this;
            this.gs_PLAYING.parent = this;
        }
    },
};
_DEBUG2.init = async function(){
    return new Promise(async (resolve,reject)=>{

        // Init: debugGamestate
        let ts_debugGamestate = performance.now(); 
        await _DEBUG2.debugGamestate.init();
        ts_debugGamestate = performance.now() - ts_debugGamestate;

        // Output some timing info.
        // console.log("DEBUG: init2:");
        // console.log("  ts_debugGamestate           :", ts_debugGamestate.toFixed(3));

        resolve();
    });

};
