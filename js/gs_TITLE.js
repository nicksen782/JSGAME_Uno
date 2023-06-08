_APP.game.gamestates["gs_TITLE"] = {
    // this.gs2_init.title.bind(this)();
    // gs2_init: {
    //     parent: null, 
    //     "title"    : function(){ console.log("title"); },
    //     "cardTest1": function(){ console.log("cardTest1"); },
    //     "cardTest2": function(){ console.log("cardTest2"); },
    // },

    cursorPosition: 0,
    cursorPositions: [
        { x:4, y:16, action: function(){ this.menuAction_playGameLocal();   } },
        // { x:4, y:18, action: function(){ this.menuAction_playGameNetwork(); } },
        { x:4, y:20, action: function(){ this.menuAction_showRules();       } },
        { x:4, y:22, action: function(){ this.menuAction_showCredits();     } },
    ],

    // Run once upon changing to this game state.
    init: function(){
        // Clear the screen and the graphics caches.
        _GFX.funcs.clearAllLayers(true);
        _GFX.layerObjs.removeAll(_APP.game.gs1_prev);
        _GFX.layerObjs.removeAll(_APP.game.gs1);

        // Set the L1 background color.
        // _GFX.funcs.updateL1BgColorRgba([0,128,64,255]);
        _GFX.funcs.updateL1BgColorRgba([32,32,48,255]);

        // Set the initial gamestate 2.
        _APP.game.changeGs2("title"); let test = "title";
        // _APP.game.changeGs2("cardTest1"); let test = "cardTest1";
        // _APP.game.changeGs2("cardTest2"); let test = "cardTest2";

        // Create general timers.
        // _APP.shared.genTimer.create("timer1", 60);
        // _APP.shared.genTimer.create("timer2", 600);

        if(test == "title"){
            _GFX.layerObjs.createOne(UnoLetter, { letter: "u", x:2 , y: 1, layerObjKey: `letter_uno_u`, layerKey: "L1", xyByGrid: true, framesBeforeIndexChange: 15, framesIndex: 0 });
            _GFX.layerObjs.createOne(UnoLetter, { letter: "n", x:10, y: 3, layerObjKey: `letter_uno_n`, layerKey: "L1", xyByGrid: true, framesBeforeIndexChange: 15, framesIndex: 1 });
            _GFX.layerObjs.createOne(UnoLetter, { letter: "o", x:18, y: 5, layerObjKey: `letter_uno_o`, layerKey: "L1", xyByGrid: true, framesBeforeIndexChange: 15, framesIndex: 2 });

            let y = 12;
            Border.createBorder({
                x:2, y:y+=2, w: 24, h: 11, 
                layerObjKey: `border1`, layerKey: "L2", xyByGrid: true, tilesetKey: "bg_tiles1"
            });
            _GFX.layerObjs.createOne(PrintText, { text: "PLAY GAME (LOCAL)"  , x:6, y: y+=2, layerObjKey: `text1`, layerKey: "L4", xyByGrid: true, });
            _GFX.layerObjs.createOne(PrintText, { text: "PLAY GAME (NETPLAY)", x:6, y: y+=2, layerObjKey: `text2`, layerKey: "L4", xyByGrid: true, settings: { colorData: [ [[255,255,255,255],[64,64,64,255] ]] } } );
            _GFX.layerObjs.createOne(PrintText, { text: "RULES"              , x:6, y: y+=2, layerObjKey: `text3`, layerKey: "L4", xyByGrid: true, });
            _GFX.layerObjs.createOne(PrintText, { text: "CREDITS"            , x:6, y: y+=2, layerObjKey: `text4`, layerKey: "L4", xyByGrid: true, });

            _GFX.layerObjs.createOne(PrintText, { text: "NICKSEN782 2023"    , x:6, y:26, layerObjKey: `text6`, layerKey: "L4", xyByGrid: true, });
            _GFX.layerObjs.createOne(PrintText, { text: "MATTEL 1992"        , x:6, y:27, layerObjKey: `text7`, layerKey: "L4", xyByGrid: true, });
            
            let cursorPosition = this.cursorPositions[this.cursorPosition];
            _GFX.layerObjs.createOne(Cursor1, { x:cursorPosition.x, y:cursorPosition.y, layerObjKey: `menuCursor1`, layerKey: "L3", xyByGrid: true, settings:{rotation: 90} } );
            
            // Uno small cards (left side)
            y = -3;
            _GFX.layerObjs.createOne(Card, { size: "sm", color:"CARD_BLACK", value: "CARD_BACK", x:0, y:y+=4, layerObjKey: `card_l_1`, layerKey: "L2", xyByGrid: true } );
            _GFX.layerObjs.createOne(Card, { size: "sm", color:"CARD_BLACK", value: "CARD_BACK", x:0, y:y+=4, layerObjKey: `card_l_2`, layerKey: "L2", xyByGrid: true } );
            _GFX.layerObjs.createOne(Card, { size: "sm", color:"CARD_BLACK", value: "CARD_BACK", x:0, y:y+=4, layerObjKey: `card_l_3`, layerKey: "L2", xyByGrid: true } );
            _GFX.layerObjs.createOne(Card, { size: "sm", color:"CARD_BLACK", value: "CARD_BACK", x:0, y:y+=4, layerObjKey: `card_l_4`, layerKey: "L2", xyByGrid: true } );
            _GFX.layerObjs.createOne(Card, { size: "sm", color:"CARD_BLACK", value: "CARD_BACK", x:0, y:y+=4, layerObjKey: `card_l_5`, layerKey: "L2", xyByGrid: true } );
            _GFX.layerObjs.createOne(Card, { size: "sm", color:"CARD_BLACK", value: "CARD_BACK", x:0, y:y+=4, layerObjKey: `card_l_6`, layerKey: "L2", xyByGrid: true } );
            _GFX.layerObjs.createOne(Card, { size: "sm", color:"CARD_BLACK", value: "CARD_BACK", x:0, y:y+=4, layerObjKey: `card_l_7`, layerKey: "L2", xyByGrid: true } );
            
            // Uno small cards (right side)
            y = -4;
            _GFX.layerObjs.createOne(Card, { size: "sm", color:"CARD_BLACK", value: "CARD_BACK", x:26, y:y+=4, layerObjKey: `card_r_1`, layerKey: "L2", xyByGrid: true } );
            _GFX.layerObjs.createOne(Card, { size: "sm", color:"CARD_BLACK", value: "CARD_BACK", x:26, y:y+=4, layerObjKey: `card_r_2`, layerKey: "L2", xyByGrid: true } );
            _GFX.layerObjs.createOne(Card, { size: "sm", color:"CARD_BLACK", value: "CARD_BACK", x:26, y:y+=4, layerObjKey: `card_r_3`, layerKey: "L2", xyByGrid: true } );
            _GFX.layerObjs.createOne(Card, { size: "sm", color:"CARD_BLACK", value: "CARD_BACK", x:26, y:y+=4, layerObjKey: `card_r_4`, layerKey: "L2", xyByGrid: true } );
            _GFX.layerObjs.createOne(Card, { size: "sm", color:"CARD_BLACK", value: "CARD_BACK", x:26, y:y+=4, layerObjKey: `card_r_5`, layerKey: "L2", xyByGrid: true } );
            _GFX.layerObjs.createOne(Card, { size: "sm", color:"CARD_BLACK", value: "CARD_BACK", x:26, y:y+=4, layerObjKey: `card_r_6`, layerKey: "L2", xyByGrid: true } );
            _GFX.layerObjs.createOne(Card, { size: "sm", color:"CARD_BLACK", value: "CARD_BACK", x:26, y:y+=4, layerObjKey: `card_r_7`, layerKey: "L2", xyByGrid: true } );
        }
        else if(test == "cardTest1"){
            let colors = [
                "CARD_YELLOW",
                "CARD_BLUE",
                "CARD_RED",
                "CARD_GREEN",
                "CARD_BACK",
                "CARD_BLACK",
            ];
            let values = [
                "CARD_0",
                "CARD_1",
                "CARD_2",
                "CARD_3",
                "CARD_4",
                "CARD_5",
                "CARD_6",
                "CARD_7",
                "CARD_8",
                "CARD_9",
                "CARD_DRAW2",
                "CARD_SKIP",
                "CARD_REV",
            ];
            let layerKey = ``;
            let x=0;
            let y=0;
            for(let c=0; c<colors.length; c+=1){
                let color = colors[c];
                if(color=="CARD_BACK"){
                    layerKey = `sm_${color}_CARD_BACK`;
                    _GFX.layerObjs.createOne(Card, { size: "sm", color:"CARD_BLACK", value: "CARD_BACK", x:x, y:y, layerObjKey: layerKey, layerKey: "L1", xyByGrid: true } );
                    x+=2;
                    if(x >= 26){ x=0; y+=3; }
                }
                else if(color=="CARD_BLACK"){
                    layerKey = `sm_${color}_CARD_WILD`;
                    _GFX.layerObjs.createOne(Card, { size: "sm", color:"CARD_BLACK", value: "CARD_WILD"      , x:x, y:y, layerObjKey: layerKey      , layerKey: "L1", xyByGrid: true } );
                    x+=2;
                    if(x >= 26){ x=0; y+=3; }

                    layerKey = `sm_${color}_CARD_WILD_DRAW4`;
                    _GFX.layerObjs.createOne(Card, { size: "sm", color:"CARD_BLACK", value: "CARD_WILD_DRAW4", x:x, y:y, layerObjKey: layerKey, layerKey: "L1", xyByGrid: true } );
                    x+=2;
                    if(x >= 26){ x=0; y+=3; }
                }
                else{
                    for(let v=0; v<values.length; v+=1){
                        let value = values[v];
                        layerKey = `sm_${color}_${value}`;
                        _GFX.layerObjs.createOne(Card, { size: "sm", color:color, value: value, x:x, y:y, layerObjKey: layerKey, layerKey: "L1", xyByGrid: true } );
                        x+=2;
                        if(x >= 26){ x=0; y+=3; }
                    }
                }
            }
        }
        else if(test == "cardTest2"){
            let colors = [
                "CARD_YELLOW",
                "CARD_BLUE",
                "CARD_RED",
                "CARD_GREEN",
                "CARD_BACK",
                "CARD_BLACK",
            ];
            let values = [
                "CARD_0",
                "CARD_1",
                "CARD_2",
                "CARD_3",
                "CARD_4",
                "CARD_5",
                "CARD_6",
                "CARD_7",
                "CARD_8",
                "CARD_9",
                "CARD_DRAW2",
                "CARD_SKIP",
                "CARD_REV",
            ];
            let layerKey = ``;
            let x=0;
            let y=0;
            for(let c=0; c<colors.length; c+=1){
                let color = colors[c];
                if(color=="CARD_BACK"){
                    layerKey = `lg_${color}_CARD_BACK`;
                    _GFX.layerObjs.createOne(Card, { size: "lg", color:"CARD_BLACK", value: "CARD_BACK", x:x, y:y, layerObjKey: layerKey, layerKey: "L1", xyByGrid: true } );
                    x+=3;
                    if(x >= 26){ x=0; y+=4; }
                }
                else if(color=="CARD_BLACK"){
                    layerKey = `lg_${color}_CARD_WILD`;
                    _GFX.layerObjs.createOne(Card, { size: "lg", color:"CARD_BLACK", value: "CARD_WILD"      , x:x, y:y, layerObjKey: layerKey      , layerKey: "L1", xyByGrid: true } );
                    x+=3;
                    if(x >= 26){ x=0; y+=4; }

                    layerKey = `lg_${color}_CARD_WILD_DRAW4`;
                    _GFX.layerObjs.createOne(Card, { size: "lg", color:"CARD_BLACK", value: "CARD_WILD_DRAW4", x:x, y:y, layerObjKey: layerKey, layerKey: "L1", xyByGrid: true } );
                    x+=3;
                    if(x >= 26){ x=0; y+=4; }
                }
                else{
                    for(let v=0; v<values.length; v+=1){
                        let value = values[v];
                        layerKey = `lg_${color}_${value}`;
                        _GFX.layerObjs.createOne(Card, { size: "lg", color:color, value: value, x:x, y:y, layerObjKey: layerKey, layerKey: "L1", xyByGrid: true } );
                        x+=3;
                        if(x >= 26){ x=0; y+=4; }
                    }
                }
            }
        }

        // Run the debug init.
        if(_APP.debugActive && _DEBUG2){ _DEBUG2.debugGamestate.uninit(_APP.game.gs1, _APP.game.gs2_new); }

        // Set the inited flag.
        this.inited = true;
    },

    // Main function of this game state. Calls other functions/handles logic, etc.
    main: function(){
        // Run init and return if this gamestate is not yet inited.
        if(!this.inited){ this.init(); return; }

        if(_APP.game.gs2 == "title"){
            // Gamepad input.
            let state = {}
            if(_INPUT.util.checkButton("p1", ["press"], [] )){ state = _INPUT.util.stateByteToObj(_INPUT.states["p1"].press); }

            // Move cursor.
            if     (state.BTN_UP){
                if(this.cursorPosition > 0){ this.cursorPosition -= 1; }
                else                       { this.cursorPosition = this.cursorPositions.length-1; }
                _GFX.layerObjs.getOne("menuCursor1").y = this.cursorPositions[this.cursorPosition].y;
            }
            else if(state.BTN_DOWN){
                if(this.cursorPosition +1 < this.cursorPositions.length){ this.cursorPosition += 1; }
                else                       { this.cursorPosition = 0; }
                _GFX.layerObjs.getOne("menuCursor1").y = this.cursorPositions[this.cursorPosition].y;
            }
            // Make selection.
            else if(state.BTN_A || state.BTN_B || state.BTN_X || state.BTN_Y || state.BTN_START){ 
                this.cursorPositions[this.cursorPosition].action.bind(this)();
            }

            // Cursor animation.
            _GFX.layerObjs.getOne("menuCursor1").nextFrame();

            // Color animations for the Uno logo 
            _GFX.layerObjs.getOne("letter_uno_u").nextFrame();
            _GFX.layerObjs.getOne("letter_uno_n").nextFrame();
            _GFX.layerObjs.getOne("letter_uno_o").nextFrame();
        }
        else if(_APP.game.gs2 == "cardtest"){
        }

        if(_APP.debugActive && _DEBUG){ this.debug(); }
    },

    menuAction_playGameLocal  : function(){ _APP.game.changeGs1("gs_OPTIONS"); _APP.game.changeGs2("init"); },
    // menuAction_playGameNetwork: function(){ console.log("menuAction_playGameNetwork", this); },
    menuAction_showRules      : function(){ _APP.game.changeGs1("gs_RULES"); _APP.game.changeGs2("init"); },
    menuAction_showCredits    : function(){ _APP.game.changeGs1("gs_CREDITS"); _APP.game.changeGs2("init"); },

    // Should be called by the game loop.
    // Calls debug functions specific to this gamestate.
    debug: function(){
        // console.log("DEBUG");
        if(_APP.debugActive && _DEBUG2){ _DEBUG2.debugGamestate.run(_APP.game.gs1, _APP.game.gs2)}
    },
};