_APP.game.gamestates["gs_RULES"] = {
    // Run once upon changing to this game state.
    init: function(){
        // Clear the screen and the graphics caches.
        _GFX.funcs.clearAllLayers(true);
        _GFX.layerObjs.removeAll(_APP.game.gs1_prev);
        _GFX.layerObjs.removeAll(_APP.game.gs1);

        // Set the L1 background color.
        // _GFX.funcs.updateL1BgColorRgba([0,128,64,255]);
        // _GFX.funcs.updateL1BgColorRgba([255,32,48,255]);
        // _GFX.funcs.updateL1BgColorRgba([0,255,48,255]);
        _GFX.funcs.updateL1BgColorRgba([32,32,48,255]);

        Border.createBorder({
            x:0, y:0, w: 28, h: 28, 
            layerObjKey: `border1`, layerKey: "L2", xyByGrid: true, tilesetKey: "bg_tiles1"
        });

        let linesConfig = {
            x:1, y:1, 
            layerObjKey: "rules_text", tilesetKey: "font_tiles1", layerKey: "L4", 
            // settings: {},
            lines: [
                { t: `BE THE FIRST TO DISCARD `   },
                { t: `ALL CARDS IN YOUR HAND `    },
                { t: `TO WIN THE ROUND!`          },
                { t: ``                           },
                { t: `BE THE FIRST TO REACH 500 ` },
                { t: `POINTS TO WIN THE GAME!`    },
                { t: ``                           },
                { t: `TO PLAY A TURN THE PLAYER ` },
                { t: `MUST DISCARD A CARD FROM `  },
                { t: `THEIR HAND THAT HAS EITHER `},
                { t: `A MATCHING VALUE OR COLOR ` },
                { t: `AS THE DISCARD PILE, OR A ` },
                { t: `WILD CARD`                  },
                { t: ``                           },
                { t: `WILD DRAW FOUR CAN ONLY `   },
                { t: `BE PLAYED IF THE PLAYER`    },
                { t: `DOES NOT HAVE A CARD THAT ` },
                { t: `MATCHES THE CURRENT PLAY`   },
                { t: `COLOR.`                     },
                { t: ``                           },
                { t: `PLAYER MUST DECLARE "UNO" ` },
                { t: `ON EACH TURN WHERE THEY `   },
                { t: `ONLY HAVE ONE CARD`         },
                { t: `REMAINING`                  },
                { t: ``                           },
                { t: ` PRESS BUTTON TO CONTINUE`  , s: { colorData: [ [ [255,255,255,255], [255,96,96,255] ]] } },
            ],
        };
        let linesConfig2 = {
            x:1, y:1, 
            layerObjKey: "rules_text", tilesetKey: "font_tiles1", layerKey: "L4", 
            // settings: {},
            lines: [
                { t: `SKIP    : SKIP NEXT PLAYER` },
                { t: `          TURN.`            },
                { t: ``                           },
                { t: `REVERSE : PLAY DIRECTION`   },
                { t: `          CHANGES.`         },
                { t: ``                           },
                { t: `DRAW TWO: NEXT PLAYER`      },
                { t: `          DRAWS TWO CARDS.` },
                { t: `          AND LOSES`        },
                { t: `          THEIR TURN.`      },
                { t: ``                           },
                { t: `WILD    : CHANGE THE PLAY`  },
                { t: `          COLOR.`           },
                { t: ``                           },
                { t: `WILD DRAW FOUR:`            },
                { t: ` LIKE A WILD BUT THE NEXT`  },
                { t: ` PLAYER ALSO DRAWS FOUR`    },
                { t: ` CARDS AND LOSES THEIR`     },
                { t: ` TURN.`                     },
                { t: ``                           },
                { t: `IN A TWO PLAYER GAME A `    },
                { t: `REVERSE CARD ACTS LIKE A`   },
                { t: `SKIP CARD`                  },
                { t: ``                           },
                { t: ``                           },
                { t: ` PRESS BUTTON TO CONTINUE` , s: { colorData: [ [ [255,255,255,255], [255,96,96,255] ]] } },
            ],
        };
        PrintText.genMultipleLines(linesConfig);
        // PrintText.genMultipleLines(linesConfig2);

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