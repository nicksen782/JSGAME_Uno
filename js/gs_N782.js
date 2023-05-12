_APP.game.gamestates["gs_N782"] = {
    /* 
    This gamestate is an animation with timing.
    */
    
    // Holds the LayerObjects object. (KEYS PRE-DEFINED HERE.)
    layerObjs: {
        "p1_card_0": {},
    },
    clearLayerObjs: function(){
        for(let key in this.layerObjs){ this.layerObjs[key] = {}; }
    },
    updateLayerObject: function(className, config){
        /* 
        // EXAMPLE USAGE:
        this.updateLayerObject(LayerObject, {
            immediateAdd: false,
            layerObjKey: "demo_board", layerKey: "BG1", tilesetKey: "bg_tiles",
            tmap: _GFX.funcs.getTilemap("bg_tiles", "board_28x28"),
            x: 0*8, y: 0*8, 
            settings : {
                xFlip: false, yFlip: false, rotation: 0, colorData:[]
            }
        });
        */
        this.layerObjs[ config.layerObjKey ] = new className(config);
    },

    // Run once upon changing to this game state.
    init: function(){
        // Clear the screen and the graphics caches.
        _GFX.funcs.clearAllLayers(true);

        _GFX.funcs.updateBG1BgColorRgba([16,16,16,255]);

        this.updateLayerObject(N782_face_anim, { layerObjKey: "N782_face_anim", layerKey: "BG2", tilesetKey: "bg_tiles2" });

        this.updateLayerObject(N782_text_anim, { layerObjKey: "N782_text_anim", layerKey: "BG2", tilesetKey: "bg_tiles2" });

        // Set the inited flag.
        this.inited = true;
    },

    // Main function of this game state. Calls other functions/handles logic, etc.
    main: function(){
        // Run init and return if this gamestate is not yet inited.
        if(!this.inited){ this.init(); return; }

        this.layerObjs["N782_face_anim"].nextFrame();
        this.layerObjs["N782_text_anim"].nextFrame();
    },

    //
    render: function(){
        for(let key in this.layerObjs){
            if(this.layerObjs[key].render){ this.layerObjs[key].render() }
        }
    },
};