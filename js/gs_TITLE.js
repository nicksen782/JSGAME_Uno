_APP.game.gamestates["gs_TITLE"] = {
    // Creates empty object placeholders for this gamestate.
    createLayerObjectPlaceholders: function(){
        _GFX.layerObjs.createPlaceholder("text1", _APP.game.gs1);
        _GFX.layerObjs.createPlaceholder("text2", _APP.game.gs1);
        _GFX.layerObjs.createPlaceholder("text3", _APP.game.gs1);
        _GFX.layerObjs.createPlaceholder("text4", _APP.game.gs1);
        _GFX.layerObjs.createPlaceholder("text5", _APP.game.gs1);
        _GFX.layerObjs.createPlaceholder("text6", _APP.game.gs1);
        _GFX.layerObjs.createPlaceholder("text7", _APP.game.gs1);
        _GFX.layerObjs.createPlaceholder("text8", _APP.game.gs1);
    },

    // Run once upon changing to this game state.
    init: function(){
        // Clear the screen and the graphics caches.
        _GFX.funcs.clearAllLayers(true);
        _GFX.layerObjs.clearAll(_APP.game.gs1);
        this.createLayerObjectPlaceholders();

        // Set the BG1 background color.
        // _GFX.funcs.updateBG1BgColorRgba([0,128,64,255]);
        _GFX.funcs.updateBG1BgColorRgba([32,32,48,255]);

        // Set the initial gamestate 2.
        _APP.game.changeGs2("anim1");

        // Create general timers.
        // _APP.shared.genTimer.create("timer1", 60);
        // _APP.shared.genTimer.create("timer2", 600);

        _GFX.layerObjs.updateOne(UnoLetter, { letter: "u", x:2 , y: 1, layerObjKey: `letter_uno_u`, layerKey: "TX1", xyByGrid: true, });
        _GFX.layerObjs.updateOne(UnoLetter, { letter: "n", x:10, y: 3, tmap: _GFX.funcs.getTilemap("bg_tiles1", "letter_uno_n"), tilesetKey: "bg_tiles1", layerObjKey: `letter_uno_n`, layerKey: "TX1", xyByGrid: true, });
        _GFX.layerObjs.updateOne(UnoLetter, { letter: "o", x:18, y: 5, tmap: _GFX.funcs.getTilemap("bg_tiles1", "letter_uno_o"), tilesetKey: "bg_tiles1", layerObjKey: `letter_uno_o`, layerKey: "TX1", xyByGrid: true, });

        let y = 12;
        _APP.shared.border.createBorder1({
            x:2, y:y+=2, w: 24, h: 11, 
            layerObjKey: `border1`, layerKey: "TX1", xyByGrid: true, tilesetKey: "bg_tiles1"
        });
        _GFX.layerObjs.updateOne(PrintText, { text: "PLAY GAME (LOCAL)"  , x:6, y: y+=2, layerObjKey: `text1`, layerKey: "TX1", xyByGrid: true, });
        _GFX.layerObjs.updateOne(PrintText, { text: "PLAY GAME (NET)"    , x:6, y: y+=2, layerObjKey: `text2`, layerKey: "TX1", xyByGrid: true, });
        _GFX.layerObjs.updateOne(PrintText, { text: "RULES"              , x:6, y: y+=2, layerObjKey: `text3`, layerKey: "TX1", xyByGrid: true, });
        _GFX.layerObjs.updateOne(PrintText, { text: "CREDITS"            , x:6, y: y+=2, layerObjKey: `text4`, layerKey: "TX1", xyByGrid: true, });

        _GFX.layerObjs.updateOne(PrintText, { text: "NICKSEN782 2023"    , x:6, y:26, layerObjKey: `text6`, layerKey: "TX1", xyByGrid: true, });
        _GFX.layerObjs.updateOne(PrintText, { text: "MATTEL 1992"        , x:6, y:27, layerObjKey: `text7`, layerKey: "TX1", xyByGrid: true, });
        
        // _GFX.layerObjs.updateOne(CreateBorder1  , { x:3, y:10+8-2, w: 20, h: 8, layerObjKey: `border1`, layerKey: "TX1", xyByGrid: true, });


        // Run the debug init.
        if(_APP.debugActive && _DEBUG2){ _DEBUG2.debugGamestate.uninit(_APP.game.gs1, _APP.game.gs2_new); }

        // Set the inited flag.
        this.inited = true;
    },

    // Main function of this game state. Calls other functions/handles logic, etc.
    main: function(){
        // Run init and return if this gamestate is not yet inited.
        if(!this.inited){ this.init(); return; }

        _GFX.layerObjs.getOne("letter_uno_u").nextFrame();
        _GFX.layerObjs.getOne("letter_uno_n").nextFrame();
        _GFX.layerObjs.getOne("letter_uno_o").nextFrame();

        if(_APP.debugActive && _DEBUG){ this.debug(); }
    },

    // Should be called by the game loop.
    // Calls debug functions specific to this gamestate.
    debug: function(){
        // console.log("DEBUG");
        if(_APP.debugActive && _DEBUG2){ _DEBUG2.debugGamestate.run(_APP.game.gs1, _APP.game.gs2)}
    },
};