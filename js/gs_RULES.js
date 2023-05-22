_APP.game.gamestates["gs_RULES"] = {
    // Run once upon changing to this game state.
    init: function(){
        // Clear the screen and the graphics caches.
        _GFX.funcs.clearAllLayers(true);
        _GFX.layerObjs.removeAll(_APP.game.gs1);

        // Set the L1 background color.
        // _GFX.funcs.updateL1BgColorRgba([0,128,64,255]);
        // _GFX.funcs.updateL1BgColorRgba([255,32,48,255]);
        // _GFX.funcs.updateL1BgColorRgba([0,255,48,255]);
        _GFX.funcs.updateL1BgColorRgba([32,32,48,255]);

        _APP.shared.border.createBorder1({
            x:0, y:0, w: 28, h: 28, 
            layerObjKey: `border1`, layerKey: "L2", xyByGrid: true, tilesetKey: "bg_tiles1"
        });

        let linesConfig = {
            x:1, y:1, 
            layerObjKey: "rules_text", tilesetKey: "font_tiles1", layerKey: "L4", 
            // settings: {},
            lines: [
                `BE THE FIRST TO DISCARD `,
                `ALL CARDS IN YOUR HAND `,
                `TO WIN THE ROUND!`,
                ``,
                `BE THE FIRST TO REACH 500 `,
                `POINTS TO WIN THE GAME!`,
                ``,
                `TO PLAY A TURN THE PLAYER `,
                `MUST DISCARD A CARD FROM `,
                `THEIR HAND THAT HAS EITHER `,
                `A MATCHING VALUE OR COLOR `,
                `AS THE DISCARD PILE, OR A `,
                `WILD CARD`,
                ``,
                `WILD DRAW FOUR CAN ONLY `,
                `BE PLAYED IF THE PLAYER`,
                `DOES NOT HAVE A CARD THAT `,
                `MATCHES THE CURRENT PLAY`,
                `COLOR.`,
                ``,
                `PLAYER MUST DECLARE "UNO" `,
                `ON EACH TURN WHERE THEY `,
                `ONLY HAVE ONE CARD`,
                `REMAINING`,
                ``,
                ` PRESS BUTTON TO CONTINUE`,
            ],
        };
        let linesConfig2 = {
            x:1, y:1, 
            layerObjKey: "rules_text", tilesetKey: "font_tiles1", layerKey: "L4", 
            // settings: {},
            lines: [
                `SKIP    : SKIP NEXT PLAYER`,
                `          TURN.`,
                ``,
                `REVERSE : PLAY DIRECTION`,
                `          CHANGES.`,
                ``,
                `DRAW TWO: NEXT PLAYER`,
                `          DRAWS TWO CARDS.`,
                `          AND LOSES`,
                `          THEIR TURN.`,
                ``,
                `WILD    : CHANGE THE PLAY`,
                `          COLOR.`,
                ``,
                `WILD DRAW FOUR:`,
                ` LIKE A WILD BUT THE NEXT`,
                ` PLAYER ALSO DRAWS FOUR`,
                ` CARDS AND LOSES THEIR`,
                ` TURN.`,
                ``,
                `IN A TWO PLAYER GAME A `,
                `REVERSE CARD ACTS LIKE A`,
                `SKIP CARD`,
                ``,
                ``,
                ` PRESS BUTTON TO CONTINUE`,
            ],
        };
        _APP.shared.generateMultipleTextLines(linesConfig);
        // _APP.shared.generateMultipleTextLines(linesConfig2);

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