_APP.game.gamestates["gs_N782"] = {
    /* 
    This gamestate is an animation with timing.
    */

    // Creates empty object placeholders for this gamestate.
    createLayerObjectPlaceholders: function(){
        _GFX.layerObjs.createPlaceholder("N782_face_anim", _APP.game.gs1);
        _GFX.layerObjs.createPlaceholder("N782_text_anim", _APP.game.gs1);
    },

    // Run once upon changing to this game state.
    init: function(){
        // Clear the screen and the graphics caches.
        _GFX.funcs.clearAllLayers(true);
        this.createLayerObjectPlaceholders();
        _GFX.layerObjs.clearAll(_APP.game.gs1);

        _GFX.funcs.updateBG1BgColorRgba([32,24,48,255]);

        _GFX.layerObjs.updateOne(N782_face_anim, { layerObjKey: "N782_face_anim", layerKey: "SP1", tilesetKey: "bg_tiles2" });
        _GFX.layerObjs.updateOne(N782_text_anim, { layerObjKey: "N782_text_anim", layerKey: "SP1", tilesetKey: "bg_tiles2" });
        
        _GFX.layerObjs.updateOne(N782_oneStar_anim,  { layerObjKey: "N782_oneStar_anim1"  , layerKey: "SP1", tilesetKey: "bg_tiles2", y: ( 5 )*8});
        _GFX.layerObjs.updateOne(N782_oneStar_anim,  { layerObjKey: "N782_oneStar_anim2"  , layerKey: "SP1", tilesetKey: "bg_tiles2", y: ( 6 )*8});
        _GFX.layerObjs.updateOne(N782_oneStar_anim,  { layerObjKey: "N782_oneStar_anim3"  , layerKey: "SP1", tilesetKey: "bg_tiles2", y: ( 7 )*8});

        _GFX.layerObjs.updateOne(N782_oneStar_anim3, { layerObjKey: "N782_oneStar_anim3_1", layerKey: "SP1", tilesetKey: "bg_tiles2", y: ( 10 )*8}); // rotated text

        
        let x = 0;
        for(let i=0; i<28; i+=1){
            let key = `N782_oneStar_anim2_${(i)}`;
            _GFX.layerObjs.updateOne(N782_oneStar_anim2, { layerObjKey: key, layerKey: "BG2", tilesetKey: "bg_tiles2", y: ( i )*8, x: x});
            x+=6;
        }

        // Create general timers.
        _APP.shared.genTimer.create("timer1", 60);
        // _APP.shared.genTimer.create("timer2", 600);

        // Set the initial gamestate 2.
        _APP.game.changeGs2("anim1");

        // Run the debug init.
        if(_APP.debugActive && _DEBUG2){ _DEBUG2.debugGamestate.uninit(_APP.game.gs1, _APP.game.gs2_new); }

        // Set the inited flag.
        this.inited = true;
    },

    // Main function of this game state. Calls other functions/handles logic, etc.
    main: function(){
        // Run init and return if this gamestate is not yet inited.
        if(!this.inited){ this.init(); return; }

        _GFX.layerObjs.getOne("N782_oneStar_anim1").nextFrame();
        _GFX.layerObjs.getOne("N782_oneStar_anim2").nextFrame();
        _GFX.layerObjs.getOne("N782_oneStar_anim3").nextFrame();
        _GFX.layerObjs.getOne("N782_oneStar_anim3_1").nextFrame();
        
        for(let i=0; i<28; i+=1){
            let key = `N782_oneStar_anim2_${(i)}`;
            _GFX.layerObjs.getOne(key).nextFrame();
        }

        switch (_APP.game.gs2){
            case "anim1": { this.logoAnimations1(); break; }
            case "anim2": { this.logoAnimations2(); break; }

            // These should not run.
            case "DONE" : { console.log("DONE");    throw "gs2 is 'DONE' but that should not happen.";  break; }
            default     : { console.log("default"); throw "gs2 is unknown but that should not happen."; break; }
        };

        // DEBUG
        if(_APP.debugActive && _DEBUG){ this.debug(); }
    },

    logoAnimations1 : function(){
        // Animation frames first.
        if( ! (_GFX.layerObjs.getOne("N782_face_anim").done && _GFX.layerObjs.getOne("N782_text_anim").done) ){
            _GFX.layerObjs.getOne("N782_face_anim").nextFrame();
            _GFX.layerObjs.getOne("N782_text_anim").nextFrame();
        }
        else{
            // console.log("Animations are complete.");
            // _APP.game.changeGs1("gs_JSG");
            // _APP.game.changeGs1("gs_N782");

            _GFX.layerObjs.updateOne(N782_face_anim, { layerObjKey: "N782_face_anim", layerKey: "SP1" });
            _GFX.layerObjs.updateOne(N782_text_anim, { layerObjKey: "N782_text_anim", layerKey: "SP1" });

            _APP.game.changeGs2("anim2");
        }
    },

    logoAnimations2 : function(){
        // Animation frames first.
        if( ! (_GFX.layerObjs.getOne("N782_face_anim").done && _GFX.layerObjs.getOne("N782_text_anim").done) ){
            _GFX.layerObjs.getOne("N782_face_anim").nextFrame();
            _GFX.layerObjs.getOne("N782_text_anim").nextFrame();
        }
        else{
            if(_APP.shared.genTimer.check("timer1")){
                // _APP.game.changeGs1("gs_N782");
                // _APP.game.changeGs2("DONE");
                _APP.game.changeGs2("anim1");
                return;
            }
        }
    },

    // Should be called by the game loop.
    // Calls debug functions specific to this gamestate.
    debug: function(){
        // console.log("DEBUG");
        if(_APP.debugActive && _DEBUG2){ _DEBUG2.debugGamestate.run(_APP.game.gs1, _APP.game.gs2)}
    },
};