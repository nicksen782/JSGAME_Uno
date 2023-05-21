_APP.game.gamestates["gs_CREDITS"] = {
    // Run once upon changing to this game state.
    init: function(){
        // Clear the screen and the graphics caches.
        _GFX.funcs.clearAllLayers(true);
        _GFX.layerObjs.clearAll(_APP.game.gs1);

        // Set the L1 background color.
        // _GFX.funcs.updateL1BgColorRgba([0,128,64,255]);
        // _GFX.funcs.updateL1BgColorRgba([255,32,48,255]);
        _GFX.funcs.updateL1BgColorRgba([32,32,48,255]);

        _APP.shared.border.createBorder1({
            x:0, y:0, w: 28, h: 28, 
            layerObjKey: `border1`, layerKey: "L2", xyByGrid: true, tilesetKey: "bg_tiles1"
        });
        let = y=1;
        _GFX.layerObjs.updateOne(PrintText, { text: "PROGRAMMING: ", x:2, y: y+=1,           layerObjKey: `text1`, layerKey: "L4", xyByGrid: true, });
        _GFX.layerObjs.updateOne(PrintText, { text: "   NICKSEN782", x:2, y: y+=1,           layerObjKey: `text2`, layerKey: "L4", xyByGrid: true, });
        y+=1;
        _GFX.layerObjs.updateOne(PrintText, { text: "GRAPHICS:", x:2, y: y+=1,               layerObjKey: `text3`, layerKey: "L4", xyByGrid: true, });
        _GFX.layerObjs.updateOne(PrintText, { text: "   NICKSEN782", x:2, y: y+=1,           layerObjKey: `text4`, layerKey: "L4", xyByGrid: true, });
        y+=1;
        _GFX.layerObjs.updateOne(PrintText, { text: "MUSIC:", x:2, y: y+=1,                  layerObjKey: `text5`, layerKey: "L4", xyByGrid: true, });
        _GFX.layerObjs.updateOne(PrintText, { text: "   ..........", x:2, y: y+=1,           layerObjKey: `text6`, layerKey: "L4", xyByGrid: true, });
        y+=1;
        _GFX.layerObjs.updateOne(PrintText, { text: "SOUND EFFECTS:", x:2, y: y+=1,          layerObjKey: `text7`, layerKey: "L4", xyByGrid: true, });
        _GFX.layerObjs.updateOne(PrintText, { text: "   ..........", x:2, y: y+=1,           layerObjKey: `text8`, layerKey: "L4", xyByGrid: true, });
        _GFX.layerObjs.updateOne(PrintText, { text: "   ..........", x:2, y: y+=1,           layerObjKey: `text9`, layerKey: "L4", xyByGrid: true, });
        _GFX.layerObjs.updateOne(PrintText, { text: "   ..........", x:2, y: y+=1,           layerObjKey: `text10`, layerKey: "L4", xyByGrid: true, });
        y+=1;
        _GFX.layerObjs.updateOne(PrintText, { text: "ORIGINAL GAME:", x:2, y: y+=1,          layerObjKey: `text11`, layerKey: "L4", xyByGrid: true, });
        _GFX.layerObjs.updateOne(PrintText, { text: "   MERLE ROBBINS (1971)", x:2, y: y+=1, layerObjKey: `text12`, layerKey: "L4", xyByGrid: true, });
        y+=6;
        _GFX.layerObjs.updateOne(PrintText, { text: " UNO IS THE PROPERTY OF", x:2, y: y+=1, layerObjKey: `text13`, layerKey: "L4", xyByGrid: true, });
        _GFX.layerObjs.updateOne(PrintText, { text: "     MATTEL (1992)", x:2, y: y+=1,           layerObjKey: `text14`, layerKey: "L4", xyByGrid: true, });

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
        let state = {}
        if(_INPUT.util.checkButton("p1", ["press"], [] )){ state = _INPUT.util.stateByteToObj(_INPUT.states["p1"].press); }
        
        // Make selection.
        if(state.BTN_A || state.BTN_B || state.BTN_X || state.BTN_Y || state.BTN_START){ 
            _APP.game.changeGs1("gs_TITLE");
            _APP.game.changeGs2("init");
            return;
        }


        if(_APP.debugActive && _DEBUG){ this.debug(); }
    },

    // Should be called by the game loop.
    // Calls debug functions specific to this gamestate.
    debug: function(){
        // console.log("DEBUG");
        if(_APP.debugActive && _DEBUG2){ _DEBUG2.debugGamestate.run(_APP.game.gs1, _APP.game.gs2)}
    },
};