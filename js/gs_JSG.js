/*
This is a simple gamestate. It should be active for long.
Display starts fully faded to black.
JSGAME logo is drawn.
Display is faded in.
JSGAME logo cycles colors for a period of time then stops.
Display is fully faded to black.
Gamestate will then change to the next gamestate.
*/
_APP.game.gamestates["gs_JSG"] = {
    colors: {    
        // JSGAME_C1 : [72, 72 , 85 , 255], // JSGAME: darkBlueGray
        // JSGAME_C1b: [72, 72 , 85 , 255], // JSGAME: slateGray
        
        JSGAME_C2 : [0 , 145, 170, 255], // JSGAME: darkCyan
        JSGAME_C2b: [0 , 109, 170, 255], // JSGAME: deepSkyBlue

        JSGAME_C3 : [0 , 182, 255, 255], // JSGAME: brightSkyBlue
        JSGAME_C3b: [0 , 145, 255, 255], // JSGAME: brightSkyBlue2
    },
    JSGAME_LOGO: null, 
    current_logo_palette: 1,
    logo_palettes: [],
    blinkCountMax: 4,
    blinkCount: 0,

    // Run once upon changing to this game state.
    init: function(){
        // Clear the screen and the graphics caches.
        _GFX.funcs.clearAllLayers(true);
        _GFX.layerObjs.removeAll(_APP.game.gs1_prev);
        _GFX.layerObjs.removeAll(_APP.game.gs1);

        _GFX.funcs.updateL1BgColorRgba([0,0,0,255]);

        // Turn off any existing global fades.
        _GFX.funcs.setFade("ALL", null);

        // Fade directly to black.
        // _GFX.funcs.setFade("ALL", 10);

        // Run the debug2 init.
        if(_APP.debugActive && _DEBUG2){ 
            _DEBUG2.debugGamestate.uninit(_APP.game.gs1, _APP.game.gs2_new); 
        }
        this.blinkCount = 0;
        this.logo_palettes = [
            // No change
            [], 
            // Alternate colors
            [
                [this.colors.JSGAME_C2, this.colors.JSGAME_C2b],
                [this.colors.JSGAME_C3, this.colors.JSGAME_C3b],
            ],
        ];

        _GFX.layerObjs.createOne(LayerObject, { 
            tilesetKey: `combined1`, 
            layerObjKey: `JSGAME_LOGO`, 
            layerKey   : "L2", 
            tmap       : _GFX.funcs.getTilemap("combined1", "JSGAME_LOGO"), 
            xyByGrid   : true,
            x          : 2, 
            y          : 4, 
            settings   : { colorData: this.logo_palettes[0] }, 
            hidden: false,
        } );

        _APP.shared.genTimer.create("genWaitTimer1", 0);
        _APP.shared.genTimer.create("genWaitTimer2", 0);

        this.JSGAME_LOGO = _GFX.layerObjs.getOne(`JSGAME_LOGO`);

        // Set the initial gamestate 2.
        _APP.game.changeGs2("");
        
        // Set the inited flag.
        this.inited = true;
    },

    // Should be called by the game loop.
    // Calls debug functions specific to this gamestate.
    debug: function(){
        if(_APP.debugActive && _DEBUG2){ _DEBUG2.debugGamestate.run(_APP.game.gs1, _APP.game.gs2)}
    },

    // Main function of this game state. Calls other functions/handles logic, etc.
    main: function(){
        // Run init and return if this gamestate is not yet inited.
        if(!this.inited){ this.init(); return; }

        // Gamepad input.
        let gpInput = _APP.shared.getAllGamepadStates();

        // Allow the user to skip this sequence by pressing any button.
        if(gpInput.ANY_bool.release)    {
            _APP.game.changeGs1("gs_N782");
            _APP.game.changeGs2("DONE");
            return;
        }

        // Wait? (general) 
        if     (!_APP.shared.genTimer.check("genWaitTimer1")){ } 
        else if(!_APP.shared.genTimer.check("genWaitTimer2")){ } 
        
        // Run
        else{
            if(this.blinkCount < this.blinkCountMax){
                this.blinkCount += 1;
                _APP.shared.genTimer.create("genWaitTimer1", 17, _APP.game.gs1, ()=>{
                    this.JSGAME_LOGO.setSetting("colorData", this.logo_palettes[this.current_logo_palette]);
                    this.current_logo_palette = +(!this.current_logo_palette);
                });
            }
            else{
                _APP.shared.genTimer.create("genWaitTimer1", 60, _APP.game.gs1, ()=>{
                    // console.log("DONE");
                    // _APP.game.changeGs1("gs_JSG");
                    _APP.game.changeGs1("gs_N782");
                });
            }
        }

        // DEBUG
        if(_APP.debugActive){ this.debug(); }
    },
};