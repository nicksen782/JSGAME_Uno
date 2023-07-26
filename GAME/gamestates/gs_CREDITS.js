_APP.game.gamestates["gs_CREDITS"] = {
    // Run once upon changing to this game state.
    init: function(){
        // Clear the screen and the graphics caches.
        _GFX.funcs.clearAllLayers(true);
        _GFX.layerObjs.removeAll(_APP.game.gs1_prev);
        _GFX.layerObjs.removeAll(_APP.game.gs1);

        // Set the L1 background color.
        // _GFX.funcs.updateL1BgColorRgba([0,128,64,255]);
        // _GFX.funcs.updateL1BgColorRgba([255,32,48,255]);
        _GFX.funcs.updateL1BgColorRgba([32,32,48,255]);

        Border.createBorder({
            x:0, y:0, w: 28, h: 28, 
            layerObjKey: `border1`, layerKey: "L2", xyByGrid: true, tilesetKey: "combined1"
        });

        let linesConfig = {
            x:2, y:1, 
            layerObjKey: "rules_text", tilesetKey: "combined1", layerKey: "L4", 
            // settings: {},
            lines: [
                { t: ``                          },
                { t: `PROGRAMMING:             ` },
                { t: `   NICKSEN782            ` },
                { t: ``                          },
                { t: `GRAPHICS:                ` },
                { t: `   NICKSEN782            ` },
                { t: ``                          },
                { t: `MUSIC:                   ` },
                { t: `   ..........            ` },
                { t: ``                          },
                { t: `SOUND EFFECTS:           ` },
                { t: `   ..........            ` },
                { t: `   ..........            ` },
                { t: `   ..........            ` },
                { t: ``                          },
                { t: `ORIGINAL GAME:           ` },
                { t: `   MERLE ROBBINS (1971)  ` },
                { t: ``                          },
                { t: ``                          },
                { t: ``                          },
                { t: ``                          },
                { t: ``                          },
                { t: ``                          },
                { t: ` UNO IS THE PROPERTY OF  `, s: { colorData: [ [ [255,255,255,255], [255,128,128,255] ]] } },
                { t: `     MATTEL (1992)       `, s: { colorData: [ [ [255,255,255,255], [255,128,128,255] ]] } },
            ],
        };
        PrintText.genMultipleLines(linesConfig);

        // Run the debug init.
        if(_APP.debugActive && _APP.configObj.gameConfig.debug && 'DEBUG' in _APP.game){ 
            // _DEBUG2.debugGamestate.uninit(_APP.game.gs1, _APP.game.gs2_new); 
        }

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


        if(_APP.debugActive){ this.debug(); }
    },

    // Should be called by the game loop.
    // Calls debug functions specific to this gamestate.
    debug: function(){
        // console.log("DEBUG");
        if(_APP.debugActive && _APP.configObj.gameConfig.debug && 'DEBUG' in _APP.game){ _DEBUG2.debugGamestate.run(_APP.game.gs1, _APP.game.gs2)}
    },
};
