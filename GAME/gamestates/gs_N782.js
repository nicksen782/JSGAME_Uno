_APP.game.gamestates["gs_N782"] = {
    /* 
    This gamestate is an animation with timing.
    */
   colors: {
        n782Star: [36 , 72 , 255, 255], // 
    },
    numStars: 2,

    // Run once upon changing to this game state.
    init: function(){
        // Clear the screen and the graphics caches.
        _GFX.funcs.clearAllLayers(true);
        _GFX.layerObjs.removeAll(_APP.game.gs1_prev);
        _GFX.layerObjs.removeAll(_APP.game.gs1);

        _GFX.funcs.updateL1BgColorRgba([32,24,64,255]);
        // _GFX.funcs.updateL1BgColorRgba([0,0,0,0]);

        // Turn off any existing global fades.
        _GFX.funcs.setFade("ALL", null);

        // Fade directly to black.
        // _GFX.funcs.setFade("ALL", 10);

        // Run the debug2 init.
        if(_APP.debugActive && _APP.configObj.gameConfig.debug && 'DEBUG' in _APP.game){
            // _DEBUG2.debugGamestate.uninit(_APP.game.gs1, _APP.game.gs2_new); 
        }

        _GFX.layerObjs.createOne(N782_face_anim, { xyByGrid: true, layerObjKey: "N782_face_anim", layerKey: "L1", hidden: false });

        for(let i=0; i<this.numStars; i+=1){
            _GFX.layerObjs.createOne(N782_oneStar_anim, { star: i+1, xyByGrid: true, layerObjKey: `N782_star_anim${i+1}`, layerKey: "L1", tilesetKey: "combined1" });
        }

        _GFX.layerObjs.createOne(LayerObject, { 
            tilesetKey: `combined1`, 
            layerObjKey: `n782_text`, 
            layerKey   : "L1", 
            tmap       : _GFX.funcs.getTilemap("combined1", "N782_TEXTb"), 
            xyByGrid   : true,
            x          : 11, 
            y          : 16, 
            settings   : {}, 
            hidden: false,
        } );

        // Create general timers.
        _APP.shared.genTimer.create("genWaitTimer1", 0);
        _APP.shared.genTimer.create("genWaitTimer2", 0);

        // Set the initial gamestate 2.
        _APP.game.changeGs2("anim1");
        // _APP.game.changeGs2("anim2");

        // Set the inited flag.
        this.inited = true;
    },

    // Main function of this game state. Calls other functions/handles logic, etc.
    main: function(){
        // Run init and return if this gamestate is not yet inited.
        if(!this.inited){ this.init(); return; }

        // Gamepad input.
        let gpInput = _APP.shared.getAllGamepadStates();

        // Allow the user to skip this sequence by pressing any button.
        if(gpInput.ANY_bool.release)    {
            _APP.game.changeGs1("gs_TITLE");
            _APP.game.changeGs2("DONE");
            return;
        }

        // Wait? (general) 
        if     (!_APP.shared.genTimer.check("genWaitTimer1")){ } 
        else if(!_APP.shared.genTimer.check("genWaitTimer2")){ } 
        
        // Run
        else{
            switch (_APP.game.gs2){
                case "anim1": { this.logoAnimations1(); break; }
                case "anim2": { this.logoAnimations2(); break; }

                // These should not run.
                case "DONE" : { console.log("DONE");    throw "gs2 is 'DONE' but that should not happen.";  break; }
                default     : { console.log("default"); throw "gs2 is unknown but that should not happen."; break; }
            };
        }

        // DEBUG
        if(_APP.debugActive){ this.debug(); }
    },

    logoAnimations1 : function(){
        let doneCnt = 0;
        for(let i=0; i<this.numStars; i+=1){
            if(_GFX.layerObjs.getOne(`N782_star_anim${i+1}`).done){ doneCnt += 1; }
        }
        // Is it done yet?
        if( ! (doneCnt == this.numStars) ){
            // Set nextFrame.
            for(let i=0; i<this.numStars; i+=1){
                _GFX.layerObjs.getOne(`N782_star_anim${i+1}`).nextFrame()
            }
        }

        // It is done.
        else{
            _APP.shared.genTimer.create("genWaitTimer1", 20, _APP.game.gs1, ()=>{
                _APP.game.changeGs2("anim2");
            });
        }
    },

    logoAnimations2 : function(){
        // Is it done yet?
        if( ! (
            _GFX.layerObjs.getOne("N782_face_anim").done 
        ) ){
            // Set nextFrame.
            // console.log("next frame", _GFX.layerObjs.getOne("N782_face_anim").framesIndex);
            _GFX.layerObjs.getOne("N782_face_anim").nextFrame();
        }

        // It is done.
        else{
            _APP.shared.genTimer.create("genWaitTimer1", 60, _APP.game.gs1, ()=>{
                _APP.game.changeGs1("gs_TITLE");
                _APP.game.changeGs2("DONE");

                // _APP.game.changeGs1("gs_N782");
                // _APP.game.changeGs2("init");

            });
        }
    },

    // Should be called by the game loop.
    // Calls debug functions specific to this gamestate.
    debug: function(){
        if(_APP.debugActive && _APP.configObj.gameConfig.debug && 'DEBUG' in _APP.game){
            _DEBUG2.debugGamestate.run(_APP.game.gs1, _APP.game.gs2);
        }
    },

};