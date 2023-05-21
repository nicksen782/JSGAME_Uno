_APP.game.gamestates["gs_OPTIONS"] = {
    genSection: function(section){
        if     (section == "start"){
            let x=0;
            let y=0;

            // Screen border and title.
            _APP.shared.border.createBorder1({
                x:x+0, y:y+0, w: 28, h: 28, 
                layerObjKey: `border1`, layerKey: "BG2", xyByGrid: true, tilesetKey: "bg_tiles1"
            });
            _GFX.layerObjs.updateOne(PrintText, { text: "OPTIONS", x:x+11, y: y+0, layerObjKey: `screen_title`, layerKey: "TX1", xyByGrid: true, settings: { bgColorRgba: [0,0,0,168] } });

            // UNO at the top.
            _GFX.layerObjs.updateOne(UnoLetter, { letter: "u2", x:x+3 , y: y+2, layerObjKey: `letter_uno2_u`, layerKey: "BG1", xyByGrid: true, framesBeforeIndexChange: 1, framesIndex: 0 });
            _GFX.layerObjs.updateOne(UnoLetter, { letter: "n2", x:x+11, y: y+2, layerObjKey: `letter_uno2_n`, layerKey: "BG1", xyByGrid: true, framesBeforeIndexChange: 1, framesIndex: 1 });
            _GFX.layerObjs.updateOne(UnoLetter, { letter: "o2", x:x+19, y: y+2, layerObjKey: `letter_uno2_o`, layerKey: "BG1", xyByGrid: true, framesBeforeIndexChange: 1, framesIndex: 2 });
        }
        else if(section == "players"){
            let x=2;
            let y=11;

            // Border around the players options. 
            _APP.shared.border.createBorder1({
                x:x+0, y:y+0, w: 12, h: 6, 
                layerObjKey: `border_playersB`, layerKey: "BG2", xyByGrid: true, tilesetKey: "bg_tiles1",
                settings: { bgColorRgba: [0,0,0,255] }
            });

            // "PLAYERS" text.
            _GFX.layerObjs.updateOne(PrintText, { text: "PLAYERS" , x:x+1, y: y-1, layerObjKey: `players_title`, layerKey: "TX1", xyByGrid: true });
            
            // Border around the "PLAYERS" text.
            _APP.shared.border.createBorder1({
                x:x+0, y:y-2, w: 9, h: 3, 
                layerObjKey: `border_playersA`, layerKey: "BG2", xyByGrid: true, tilesetKey: "bg_tiles1",
                settings: { bgColorRgba: [0,0,0,255] }
            });

            // Text for the player options. 
            _GFX.layerObjs.updateOne(PrintText, { text: "P1 HUMAN", x:x+2, y: y+1, layerObjKey: `P1_text`, layerKey: "TX1", xyByGrid: true });
            _GFX.layerObjs.updateOne(PrintText, { text: "P2 HUMAN", x:x+2, y: y+2, layerObjKey: `P2_text`, layerKey: "TX1", xyByGrid: true });
            _GFX.layerObjs.updateOne(PrintText, { text: "P3  NONE", x:x+2, y: y+3, layerObjKey: `P3_text`, layerKey: "TX1", xyByGrid: true });
            _GFX.layerObjs.updateOne(PrintText, { text: "P4  NONE", x:x+2, y: y+4, layerObjKey: `P4_text`, layerKey: "TX1", xyByGrid: true });
        }
        else if(section == "winStyle"){
            let x=15;
            let y=11;

            // Border around the win style options. 
            _APP.shared.border.createBorder1({
                x:x+0, y:y+0, w: 11, h: 6, 
                layerObjKey: `border_winStyle_B`, layerKey: "BG2", xyByGrid: true, tilesetKey: "bg_tiles1",
                settings: { bgColorRgba: [0,0,0,255] }
            });
            
            // "WIN STYLE" text.
            _GFX.layerObjs.updateOne(PrintText, { text: "WIN STYLE" , x:x+1, y: y-1, layerObjKey: `winStyle_title`, layerKey: "TX1", xyByGrid: true });
            
                // Border around the "WIN STYLE" text.
            _APP.shared.border.createBorder1({
                x:x+0, y:y-2, w: 11, h: 3, 
                layerObjKey: `border_winStyle_A`, layerKey: "BG2", xyByGrid: true, tilesetKey: "bg_tiles1",
                settings: { bgColorRgba: [0,0,0,255] }
            });

            // Text for the player options. 
            _GFX.layerObjs.updateOne(PrintText, { text: "1ST TO:", x:x+2, y: y+1, layerObjKey: `winStyle_text1`, layerKey: "TX1", xyByGrid: true });
            _GFX.layerObjs.updateOne(PrintText, { text: "500 PTS", x:x+2, y: y+3, layerObjKey: `winStyle_text2`, layerKey: "TX1", xyByGrid: true });
            _GFX.layerObjs.updateOne(PrintText, { text: "0 CARDS", x:x+2, y: y+4, layerObjKey: `winStyle_text3`, layerKey: "TX1", xyByGrid: true });
        }
        else if(section == "noPlayableCard"){
            let x=2;
            let y=20;

            // Border around the noPlayableCard options. 
            _APP.shared.border.createBorder1({
                x:x+0, y:y+0, w: 23, h: 4, 
                layerObjKey: `border_noPlayableCard_B`, layerKey: "BG2", xyByGrid: true, tilesetKey: "bg_tiles1",
                settings: { bgColorRgba: [0,0,0,255] }
            });
            
            // "IF NO PLAYABLE CARD" text.
            _GFX.layerObjs.updateOne(PrintText, { text: "IF NO PLAYABLE CARD" , x:x+1, y: y-1, layerObjKey: `noPlayableCard_title`, layerKey: "TX1", xyByGrid: true });
            
            // Border around the "IF NO PLAYABLE CARD" text.
            _APP.shared.border.createBorder1({
                x:x+0, y:y-2, w: 21, h: 3, 
                layerObjKey: `border_noPlayableCard_A`, layerKey: "BG2", xyByGrid: true, tilesetKey: "bg_tiles1",
                settings: { bgColorRgba: [0,0,0,255] }
            });

            // // Text for the player options. 
            _GFX.layerObjs.updateOne(PrintText, { text: "DRAW ONLY ONE CARD",  x:x+2, y: y+1, layerObjKey: `noPlayableCard_text1`, layerKey: "TX1", xyByGrid: true });
            _GFX.layerObjs.updateOne(PrintText, { text: "DRAW UNTIL PLAYABLE", x:x+2, y: y+2, layerObjKey: `noPlayableCard_text2`, layerKey: "TX1", xyByGrid: true });
            
            // Bottom text
            _GFX.layerObjs.updateOne(PrintText, { text: "A:ACCEPT    DPAD:CHANGE", x:x+0, y: y+5, layerObjKey: `noPlayableCard_text3`, layerKey: "TX1", xyByGrid: true });
            _GFX.layerObjs.updateOne(PrintText, { text: "B:BACK"                 , x:x+0, y: y+6, layerObjKey: `noPlayableCard_text4`, layerKey: "TX1", xyByGrid: true });
        }
    },
    // Run once upon changing to this game state.
    init: function(){
        // Clear the screen and the graphics caches.
        _GFX.funcs.clearAllLayers(true);
        _GFX.layerObjs.clearAll(_APP.game.gs1);

        // Set the BG1 background color.
        // _GFX.funcs.updateBG1BgColorRgba([0,128,64,255]);
        _GFX.funcs.updateBG1BgColorRgba([32,32,48,255]);

        this.genSection("start");
        this.genSection("players");
        this.genSection("winStyle");
        this.genSection("noPlayableCard");

        // Run the debug init.
        if(_APP.debugActive && _DEBUG2){ _DEBUG2.debugGamestate.uninit(_APP.game.gs1, _APP.game.gs2_new); }

        // Set the inited flag.
        this.inited = true;
    },
    // Main function of this game state. Calls other functions/handles logic, etc.
    main: function(){
        // Run init and return if this gamestate is not yet inited.
        if(!this.inited){ this.init(); return; }

        // Uno letters animation.
        _GFX.layerObjs.getOne("letter_uno2_u").nextFrame();
        _GFX.layerObjs.getOne("letter_uno2_n").nextFrame();
        _GFX.layerObjs.getOne("letter_uno2_o").nextFrame();

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