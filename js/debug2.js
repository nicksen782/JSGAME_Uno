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
            init: function(){
                this.inited = true; 
            },
            gs1: function(){},
        },
        
        // Debug object for: gamestate 1: gs_JSG
        gs_JSG: {
            parent: null,
            inited: false,
            init: function(){
                this.inited = true; 
            },
            gs1: function(){},
        },
        
        // Debug object for: gamestate 1: gs_N782
        gs_N782: {
            parent: null,
            inited: false,
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

        init: async function(){
            // DEBUG2 NAV 1
            _DEBUG2.navBar1.init();
            // _DEBUG2.navBar1.showOne("view_gs_JSG");
            // _DEBUG2.navBar1.showOne("view_gs_N782");
            _DEBUG2.navBar1.showOne("view_gs_TITLE");

            // Set parents.
            this.gs_TITLE.parent = this;
            this.gs_JSG.parent = this;
            this.gs_N782.parent = this;
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
