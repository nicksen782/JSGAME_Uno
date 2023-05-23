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
            'view_gs_PLAYING': {
                'tab' : 'debug_navBar2_tab_gs_PLAYING',
                'view': 'debug_navBar2_view_gs_PLAYING',
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
                
                "drawCards"   : "debug_drawCards",
                "discardCards": "debug_discardCards",
                "P1Cards"     : "debug_P1Cards",
                "P2Cards"     : "debug_P2Cards",
                "P3Cards"     : "debug_P3Cards",
                "P4Cards"     : "debug_P4Cards",
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
                    _GFX.funcs.updateL1BgColorRgba(value);
                }, false);
                this.DOM["bgColorButton"].addEventListener("click" , ()=>{ 
                    let value = this.DOM["bgColorSelect"].value.split(",");
                    _GFX.funcs.updateL1BgColorRgba(value);
                }, false);
            },
            init: function(){
                this.inited = true; 
            },
            createCardElem: function(cardObj){
                let colors = {
                    "CARD_YELLOW": "yellow",
                    "CARD_BLUE"  : "blue",
                    "CARD_RED"   : "red",
                    "CARD_GREEN" : "green",
                    "CARD_BLACK" : "black",
                };
                let values = {
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
                };

                return `<span class="card ${colors[cardObj.color]}"><span class="label">${values[cardObj.value]}</span></span>`.trim();
            },
            gs1: function(){
                // **************************
                // Update the cards locations
                // **************************

                // Get the old values. 
                let drawCards_old    = this.DOM["drawCards"].innerHTML;
                let discardCards_old = this.DOM["discardCards"].innerHTML;
                let P1Cards_old      = this.DOM["P1Cards"].innerHTML;
                let P2Cards_old      = this.DOM["P2Cards"].innerHTML;
                let P3Cards_old      = this.DOM["P3Cards"].innerHTML;
                let P4Cards_old      = this.DOM["P4Cards"].innerHTML;
                
                // Start new values. 
                let drawCards_new    = '';
                let discardCards_new = '';
                let P1Cards_new      = '';
                let P2Cards_new      = '';
                let P3Cards_new      = '';
                let P4Cards_new      = '';

                // Filter the deck by location.
                let location_DISCARD = _APP.game.gamestates["gs_PLAYING"].deck.filter(d=>d.location=="CARD_LOCATION_DISCARD");
                let location_DRAW    = _APP.game.gamestates["gs_PLAYING"].deck.filter(d=>d.location=="CARD_LOCATION_DRAW");
                let location_PLAYER1 = _APP.game.gamestates["gs_PLAYING"].deck.filter(d=>d.location=="CARD_LOCATION_PLAYER1");
                let location_PLAYER2 = _APP.game.gamestates["gs_PLAYING"].deck.filter(d=>d.location=="CARD_LOCATION_PLAYER2");
                let location_PLAYER3 = _APP.game.gamestates["gs_PLAYING"].deck.filter(d=>d.location=="CARD_LOCATION_PLAYER3");
                let location_PLAYER4 = _APP.game.gamestates["gs_PLAYING"].deck.filter(d=>d.location=="CARD_LOCATION_PLAYER4");

                // Add cards by location.
                for(let card of location_DISCARD){ discardCards_new += this.createCardElem(card); }
                for(let card of location_DRAW)   { drawCards_new    += this.createCardElem(card); }
                for(let card of location_PLAYER1){ P1Cards_new      += this.createCardElem(card); }
                for(let card of location_PLAYER2){ P2Cards_new      += this.createCardElem(card); }
                for(let card of location_PLAYER3){ P3Cards_new      += this.createCardElem(card); }
                for(let card of location_PLAYER4){ P4Cards_new      += this.createCardElem(card); }

                // Update the display if the HTMl has changed.
                if(drawCards_old    != drawCards_new)   { console.log("CHANGE: drawCards");    this.DOM["drawCards"]   .innerHTML = drawCards_new; }
                if(discardCards_old != discardCards_new){ console.log("CHANGE: discardCards"); this.DOM["discardCards"].innerHTML = discardCards_new; }
                if(P1Cards_old      != P1Cards_new)     { console.log("CHANGE: P1Cards");      this.DOM["P1Cards"]     .innerHTML = P1Cards_new; }
                if(P2Cards_old      != P2Cards_new)     { console.log("CHANGE: P2Cards");      this.DOM["P2Cards"]     .innerHTML = P2Cards_new; }
                if(P3Cards_old      != P3Cards_new)     { console.log("CHANGE: P3Cards");      this.DOM["P3Cards"]     .innerHTML = P3Cards_new; }
                if(P4Cards_old      != P4Cards_new)     { console.log("CHANGE: P4Cards");      this.DOM["P4Cards"]     .innerHTML = P4Cards_new; }
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
                if(this[key].initOnce){
                    this[key].initOnce();
                }
            }

            // Set parents.
            this.gs_TITLE.parent = this;
            this.gs_JSG.parent = this;
            this.gs_N782.parent = this;
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
