_APP.game.gamestates["gs_PLAYING"] = {
    gameSettings: {
        P1  : "HUMAN",
        P2  : "CPU",
        P3  : "NONE",
        P4  : "NONE",
        WIN : "atZeroCards", // ["at500pts", "atZeroCards"]
        DRAW: "one",      // ["one", "until"]
    },
    // Run once upon changing to this game state.
    init: function(){
        // Clear the screen and the graphics caches.
        _GFX.funcs.clearAllLayers(true);
        _GFX.layerObjs.clearAll(_APP.game.gs1);

        console.log("In gs_PLAYING. Here are the gameSettings:", this.gameSettings);

        // Set the L1 background color.
        // _GFX.funcs.updateL1BgColorRgba([0,128,64,255]);
        _GFX.funcs.updateL1BgColorRgba([32,32,48,255]);

        _GFX.layerObjs.updateOne(Cursor1, { x:0, y:0, layerObjKey: `debugCursor`   , layerKey: "L3", xyByGrid: true, settings:{rotation: 90} } );

        // Run the debug init.
        if(_APP.debugActive && _DEBUG2){ _DEBUG2.debugGamestate.uninit(_APP.game.gs1, _APP.game.gs2_new); }

        // Set the inited flag.
        this.inited = true;
    },

    // Main function of this game state. Calls other functions/handles logic, etc.
    main: function(){
        // Run init and return if this gamestate is not yet inited.
        if(!this.inited){ this.init(); return; }

        // Gamepad input.
        let state = _INPUT.util.stateByteToObj2("p1"); 
        if(state.press.BTN_B) { 
            _APP.game.changeGs1("gs_OPTIONS");
            _APP.game.changeGs2("init");
            return;
        }

        // DEBUG CURSOR.
        _GFX.layerObjs.getOne("debugCursor").nextFrame();
        if(state.held.BTN_SR && state.press.BTN_UP)   { _GFX.layerObjs.getOne("debugCursor").y--; }
        if(state.held.BTN_SR && state.press.BTN_DOWN) { _GFX.layerObjs.getOne("debugCursor").y++; }
        if(state.held.BTN_SR && state.press.BTN_LEFT) { _GFX.layerObjs.getOne("debugCursor").x--; }
        if(state.held.BTN_SR && state.press.BTN_RIGHT){ _GFX.layerObjs.getOne("debugCursor").x++; }

        if(_APP.debugActive && _DEBUG){ this.debug(); }
    },

    // Should be called by the game loop.
    // Calls debug functions specific to this gamestate.
    debug: function(){
        // console.log("DEBUG");
        if(_APP.debugActive && _DEBUG2){ _DEBUG2.debugGamestate.run(_APP.game.gs1, _APP.game.gs2)}
    },
};