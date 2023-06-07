// @ts-nocheck

_APP.debugActive = false;
// _APP.debugActive = true;
_APP.configObj = {
    appName: "UNO!",

    // Controls if the loop will wait for the graphics draw to finish before continuing.
    // awaitDraw: true,
    awaitDraw: false,

    // generateCoreImageDataAssets: true,
    generateCoreImageDataAssets: false,

    // disableCache: true,
    disableCache: false,

    // Offset x and y for all drawings by this number of tiles.
    // useGlobalOffsets: true,
    useGlobalOffsets: false,
    globalOffsets:{
        x: 1,
        y: 1,
    },

    // Relative paths need to be correctly relative to whatever loads this file (the web page or the web worker.)
    tilesetFiles: [
        "../UAM/JSON/bg_tiles1.json",
        // "../UAM/JSON/bg_tiles2.json",
        "../UAM/JSON/font_tiles1.json",
        "../UAM/JSON/sprite_tiles1.json",
    ],
    
    dimensions: {
        "tileWidth" : 8,
        "tileHeight": 8,
        "rows":28, 
        "cols":28
        // "rows":30, 
        // "cols":30
    },

    layers:[
        { "name": "L1", "canvasOptions": { "willReadFrequently": false, "alpha": true }, css:[ {k:"z-index", v:"105"}, {k:"background-color", v:"#181818"} ] },
        { "name": "L2", "canvasOptions": { "willReadFrequently": false, "alpha": true }, css:[ {k:"z-index", v:"110"} ] },
        { "name": "L3", "canvasOptions": { "willReadFrequently": false, "alpha": true }, css:[ {k:"z-index", v:"115"} ] },
        { "name": "L4", "canvasOptions": { "willReadFrequently": false, "alpha": true }, css:[ {k:"z-index", v:"120"} ] },
    ],
    
    inputConfig :{
        "useKeyboard"   : true, 
        "useGamepads"   : true,
        "listeningElems": ["output"],
        "webElem"       : "controls_navBar1_view_input",
    }
};
_APP.initOutputScaleControls = function(){
    let canvasOutputContainer = document.getElementById("output");
    let firstLayerCanvas      = document.querySelector(".canvasLayer");
    let scaleSlider           = document.getElementById("scaleSlider");
    let scaleSliderText       = document.getElementById("scaleSliderText");
    
    function resizeParent() {
        let scale = parseFloat(scaleSlider.value);
        let newW = firstLayerCanvas.width  * scale;
        let newH = firstLayerCanvas.height * scale;
        canvasOutputContainer.style.width  = newW + "px";
        canvasOutputContainer.style.height = newH + "px";
        scaleSlider.title = `Scale: ${scale.toFixed(2)}x (${newW + "px"}, ${newH + "px"})`;
        scaleSliderText.value = scaleSlider.title;
    }
    resizeParent();

    scaleSlider.addEventListener("input", resizeParent, false);
};

_APP.utility = {
    //
    ww_ImageDataAssetsGenerated: false, 
    generateCoreImageDataAssets: async function(){
        // _APP.game.gameLoop.loop_stop();
        // _APP.utility.await generateCoreImageDataAssets();
        // _APP.game.gameLoop.loop_start();

        if(this.ww_ImageDataAssetsGenerated){ console.log("Already done!"); return; }
        this.ww_ImageDataAssetsGenerated = true;
        
        let list = {
            "bg_tiles1":{
                "mapObjs"  : {},
                "mapKeys"  : [],
                "mapsArray": [
                    // UNO LETTERS large
                    // { "baseMapKey": "letter_uno_u",         "mapKey": "_letter_uno_u_C1", "settings": { } },
                    // { "baseMapKey": "letter_uno_n",         "mapKey": "_letter_uno_n_C1", "settings": { } },
                    // { "baseMapKey": "letter_uno_o",         "mapKey": "_letter_uno_o_C1", "settings": { } },

                    { "baseMapKey": "letter_uno_u",         "mapKey": "_letter_uno_u_C2", "settings": { colorData: [[UnoLetter.colors.base, UnoLetter.colors.blue ]] } },
                    { "baseMapKey": "letter_uno_n",         "mapKey": "_letter_uno_n_C2", "settings": { colorData: [[UnoLetter.colors.base, UnoLetter.colors.blue ]] } },
                    { "baseMapKey": "letter_uno_o",         "mapKey": "_letter_uno_o_C2", "settings": { colorData: [[UnoLetter.colors.base, UnoLetter.colors.blue ]] } },
                    
                    { "baseMapKey": "letter_uno_u",         "mapKey": "_letter_uno_u_C3", "settings": { colorData: [[UnoLetter.colors.base, UnoLetter.colors.red ]] } },
                    { "baseMapKey": "letter_uno_n",         "mapKey": "_letter_uno_n_C3", "settings": { colorData: [[UnoLetter.colors.base, UnoLetter.colors.red ]] } },
                    { "baseMapKey": "letter_uno_o",         "mapKey": "_letter_uno_o_C3", "settings": { colorData: [[UnoLetter.colors.base, UnoLetter.colors.red ]] } },
                    
                    { "baseMapKey": "letter_uno_u",         "mapKey": "_letter_uno_u_C4", "settings": { colorData: [[UnoLetter.colors.base, UnoLetter.colors.green ]] } },
                    { "baseMapKey": "letter_uno_n",         "mapKey": "_letter_uno_n_C4", "settings": { colorData: [[UnoLetter.colors.base, UnoLetter.colors.green ]] } },
                    { "baseMapKey": "letter_uno_o",         "mapKey": "_letter_uno_o_C4", "settings": { colorData: [[UnoLetter.colors.base, UnoLetter.colors.green ]] } },

                    { "baseMapKey": "letter_uno_u",         "mapKey": "_letter_uno_u_C5", "settings": { colorData: [[UnoLetter.colors.base, UnoLetter.colors.black ]] } },
                    { "baseMapKey": "letter_uno_n",         "mapKey": "_letter_uno_n_C5", "settings": { colorData: [[UnoLetter.colors.base, UnoLetter.colors.black ]] } },
                    { "baseMapKey": "letter_uno_o",         "mapKey": "_letter_uno_o_C5", "settings": { colorData: [[UnoLetter.colors.base, UnoLetter.colors.black ]] } },
                    
                    // UNO LETTERS small
                    // { "baseMapKey": "letter_uno2_u",         "mapKey": "_letter_uno_u2_C1", "settings": { } },
                    // { "baseMapKey": "letter_uno2_n",         "mapKey": "_letter_uno_n2_C1", "settings": { } },
                    // { "baseMapKey": "letter_uno2_o",         "mapKey": "_letter_uno_o2_C1", "settings": { } },

                    { "baseMapKey": "letter_uno2_u",         "mapKey": "_letter_uno_u2_C2", "settings": { colorData: [[UnoLetter.colors.base, UnoLetter.colors.blue ]] } },
                    { "baseMapKey": "letter_uno2_n",         "mapKey": "_letter_uno_n2_C2", "settings": { colorData: [[UnoLetter.colors.base, UnoLetter.colors.blue ]] } },
                    { "baseMapKey": "letter_uno2_o",         "mapKey": "_letter_uno_o2_C2", "settings": { colorData: [[UnoLetter.colors.base, UnoLetter.colors.blue ]] } },
                    
                    { "baseMapKey": "letter_uno2_u",         "mapKey": "_letter_uno_u2_C3", "settings": { colorData: [[UnoLetter.colors.base, UnoLetter.colors.red ]] } },
                    { "baseMapKey": "letter_uno2_n",         "mapKey": "_letter_uno_n2_C3", "settings": { colorData: [[UnoLetter.colors.base, UnoLetter.colors.red ]] } },
                    { "baseMapKey": "letter_uno2_o",         "mapKey": "_letter_uno_o2_C3", "settings": { colorData: [[UnoLetter.colors.base, UnoLetter.colors.red ]] } },
                    
                    { "baseMapKey": "letter_uno2_u",         "mapKey": "_letter_uno_u2_C4", "settings": { colorData: [[UnoLetter.colors.base, UnoLetter.colors.green ]] } },
                    { "baseMapKey": "letter_uno2_n",         "mapKey": "_letter_uno_n2_C4", "settings": { colorData: [[UnoLetter.colors.base, UnoLetter.colors.green ]] } },
                    { "baseMapKey": "letter_uno2_o",         "mapKey": "_letter_uno_o2_C4", "settings": { colorData: [[UnoLetter.colors.base, UnoLetter.colors.green ]] } },

                    { "baseMapKey": "letter_uno2_u",         "mapKey": "_letter_uno_u2_C5", "settings": { colorData: [[UnoLetter.colors.base, UnoLetter.colors.black ]] } },
                    { "baseMapKey": "letter_uno2_n",         "mapKey": "_letter_uno_n2_C5", "settings": { colorData: [[UnoLetter.colors.base, UnoLetter.colors.black ]] } },
                    { "baseMapKey": "letter_uno2_o",         "mapKey": "_letter_uno_o2_C5", "settings": { colorData: [[UnoLetter.colors.base, UnoLetter.colors.black ]] } },

                    // RED: Small cards
                    // { "baseMapKey": "card_sm_0",         "mapKey": "_RED_card_sm_0",          "settings": {}  },
                    // { "baseMapKey": "card_sm_1",         "mapKey": "_RED_card_sm_1",          "settings": {}  },
                    // { "baseMapKey": "card_sm_2",         "mapKey": "_RED_card_sm_2",          "settings": {}  },
                    // { "baseMapKey": "card_sm_3",         "mapKey": "_RED_card_sm_3",          "settings": {}  },
                    // { "baseMapKey": "card_sm_4",         "mapKey": "_RED_card_sm_4",          "settings": {}  },
                    // { "baseMapKey": "card_sm_5",         "mapKey": "_RED_card_sm_5",          "settings": {}  },
                    // { "baseMapKey": "card_sm_6",         "mapKey": "_RED_card_sm_6",          "settings": {}  },
                    // { "baseMapKey": "card_sm_7",         "mapKey": "_RED_card_sm_7",          "settings": {}  },
                    // { "baseMapKey": "card_sm_8",         "mapKey": "_RED_card_sm_8",          "settings": {}  },
                    // { "baseMapKey": "card_sm_9",         "mapKey": "_RED_card_sm_9",          "settings": {}  },
                    // { "baseMapKey": "card_sm_draw2",     "mapKey": "_RED_card_sm_draw2",      "settings": {}  },
                    // { "baseMapKey": "card_sm_skip",      "mapKey": "_RED_card_sm_skip",       "settings": {}  },
                    // { "baseMapKey": "card_sm_reverse",   "mapKey": "_RED_card_sm_reverse",    "settings": {}  },
                    
                    // YELLOW: Small cards
                    { "baseMapKey": "card_sm_0",         "mapKey": "_YEL_card_sm_0",          "settings": { colorData: [[Card.colors.base, Card.colors.yellow ]] } },
                    { "baseMapKey": "card_sm_1",         "mapKey": "_YEL_card_sm_1",          "settings": { colorData: [[Card.colors.base, Card.colors.yellow ]] } },
                    { "baseMapKey": "card_sm_2",         "mapKey": "_YEL_card_sm_2",          "settings": { colorData: [[Card.colors.base, Card.colors.yellow ]] } },
                    { "baseMapKey": "card_sm_3",         "mapKey": "_YEL_card_sm_3",          "settings": { colorData: [[Card.colors.base, Card.colors.yellow ]] } },
                    { "baseMapKey": "card_sm_4",         "mapKey": "_YEL_card_sm_4",          "settings": { colorData: [[Card.colors.base, Card.colors.yellow ]] } },
                    { "baseMapKey": "card_sm_5",         "mapKey": "_YEL_card_sm_5",          "settings": { colorData: [[Card.colors.base, Card.colors.yellow ]] } },
                    { "baseMapKey": "card_sm_6",         "mapKey": "_YEL_card_sm_6",          "settings": { colorData: [[Card.colors.base, Card.colors.yellow ]] } },
                    { "baseMapKey": "card_sm_7",         "mapKey": "_YEL_card_sm_7",          "settings": { colorData: [[Card.colors.base, Card.colors.yellow ]] } },
                    { "baseMapKey": "card_sm_8",         "mapKey": "_YEL_card_sm_8",          "settings": { colorData: [[Card.colors.base, Card.colors.yellow ]] } },
                    { "baseMapKey": "card_sm_9",         "mapKey": "_YEL_card_sm_9",          "settings": { colorData: [[Card.colors.base, Card.colors.yellow ]] } },
                    { "baseMapKey": "card_sm_draw2",     "mapKey": "_YEL_card_sm_draw2",      "settings": { colorData: [[Card.colors.base, Card.colors.yellow ]] } },
                    { "baseMapKey": "card_sm_skip",      "mapKey": "_YEL_card_sm_skip",       "settings": { colorData: [[Card.colors.base, Card.colors.yellow ]] } },
                    { "baseMapKey": "card_sm_reverse",   "mapKey": "_YEL_card_sm_reverse",    "settings": { colorData: [[Card.colors.base, Card.colors.yellow ]] } },
                    
                    // BLUE: Small cards
                    { "baseMapKey": "card_sm_0",         "mapKey": "_BLU_card_sm_0",          "settings": { colorData: [[Card.colors.base, Card.colors.blue ]] } },
                    { "baseMapKey": "card_sm_1",         "mapKey": "_BLU_card_sm_1",          "settings": { colorData: [[Card.colors.base, Card.colors.blue ]] } },
                    { "baseMapKey": "card_sm_2",         "mapKey": "_BLU_card_sm_2",          "settings": { colorData: [[Card.colors.base, Card.colors.blue ]] } },
                    { "baseMapKey": "card_sm_3",         "mapKey": "_BLU_card_sm_3",          "settings": { colorData: [[Card.colors.base, Card.colors.blue ]] } },
                    { "baseMapKey": "card_sm_4",         "mapKey": "_BLU_card_sm_4",          "settings": { colorData: [[Card.colors.base, Card.colors.blue ]] } },
                    { "baseMapKey": "card_sm_5",         "mapKey": "_BLU_card_sm_5",          "settings": { colorData: [[Card.colors.base, Card.colors.blue ]] } },
                    { "baseMapKey": "card_sm_6",         "mapKey": "_BLU_card_sm_6",          "settings": { colorData: [[Card.colors.base, Card.colors.blue ]] } },
                    { "baseMapKey": "card_sm_7",         "mapKey": "_BLU_card_sm_7",          "settings": { colorData: [[Card.colors.base, Card.colors.blue ]] } },
                    { "baseMapKey": "card_sm_8",         "mapKey": "_BLU_card_sm_8",          "settings": { colorData: [[Card.colors.base, Card.colors.blue ]] } },
                    { "baseMapKey": "card_sm_9",         "mapKey": "_BLU_card_sm_9",          "settings": { colorData: [[Card.colors.base, Card.colors.blue ]] } },
                    { "baseMapKey": "card_sm_draw2",     "mapKey": "_BLU_card_sm_draw2",      "settings": { colorData: [[Card.colors.base, Card.colors.blue ]] } },
                    { "baseMapKey": "card_sm_skip",      "mapKey": "_BLU_card_sm_skip",       "settings": { colorData: [[Card.colors.base, Card.colors.blue ]] } },
                    { "baseMapKey": "card_sm_reverse",   "mapKey": "_BLU_card_sm_reverse",    "settings": { colorData: [[Card.colors.base, Card.colors.blue ]] } },
                    
                    // GREEN: Small cards
                    { "baseMapKey": "card_sm_0",         "mapKey": "_GRE_card_sm_0",          "settings": { colorData: [[Card.colors.base, Card.colors.green ]] } },
                    { "baseMapKey": "card_sm_1",         "mapKey": "_GRE_card_sm_1",          "settings": { colorData: [[Card.colors.base, Card.colors.green ]] } },
                    { "baseMapKey": "card_sm_2",         "mapKey": "_GRE_card_sm_2",          "settings": { colorData: [[Card.colors.base, Card.colors.green ]] } },
                    { "baseMapKey": "card_sm_3",         "mapKey": "_GRE_card_sm_3",          "settings": { colorData: [[Card.colors.base, Card.colors.green ]] } },
                    { "baseMapKey": "card_sm_4",         "mapKey": "_GRE_card_sm_4",          "settings": { colorData: [[Card.colors.base, Card.colors.green ]] } },
                    { "baseMapKey": "card_sm_5",         "mapKey": "_GRE_card_sm_5",          "settings": { colorData: [[Card.colors.base, Card.colors.green ]] } },
                    { "baseMapKey": "card_sm_6",         "mapKey": "_GRE_card_sm_6",          "settings": { colorData: [[Card.colors.base, Card.colors.green ]] } },
                    { "baseMapKey": "card_sm_7",         "mapKey": "_GRE_card_sm_7",          "settings": { colorData: [[Card.colors.base, Card.colors.green ]] } },
                    { "baseMapKey": "card_sm_8",         "mapKey": "_GRE_card_sm_8",          "settings": { colorData: [[Card.colors.base, Card.colors.green ]] } },
                    { "baseMapKey": "card_sm_9",         "mapKey": "_GRE_card_sm_9",          "settings": { colorData: [[Card.colors.base, Card.colors.green ]] } },
                    { "baseMapKey": "card_sm_draw2",     "mapKey": "_GRE_card_sm_draw2",      "settings": { colorData: [[Card.colors.base, Card.colors.green ]] } },
                    { "baseMapKey": "card_sm_skip",      "mapKey": "_GRE_card_sm_skip",       "settings": { colorData: [[Card.colors.base, Card.colors.green ]] } },
                    { "baseMapKey": "card_sm_reverse",   "mapKey": "_GRE_card_sm_reverse",    "settings": { colorData: [[Card.colors.base, Card.colors.green ]] } },
                    
                    // BLACK: Small cards
                    // { "baseMapKey": "card_sm_back",      "mapKey": "_BLA_card_sm_back",       "settings": {}  },
                    // { "baseMapKey": "card_sm_wild",      "mapKey": "_BLA_card_sm_wild",       "settings": {}  },
                    // { "baseMapKey": "card_sm_wildDraw4", "mapKey": "_BLA_card_sm_wildDraw4",  "settings": {}  },

                    // RED: Large cards
                    // { "baseMapKey": "card_lg_0",         "mapKey": "_RED_card_lg_0",          "settings": {}  },
                    // { "baseMapKey": "card_lg_1",         "mapKey": "_RED_card_lg_1",          "settings": {}  },
                    // { "baseMapKey": "card_lg_2",         "mapKey": "_RED_card_lg_2",          "settings": {}  },
                    // { "baseMapKey": "card_lg_3",         "mapKey": "_RED_card_lg_3",          "settings": {}  },
                    // { "baseMapKey": "card_lg_4",         "mapKey": "_RED_card_lg_4",          "settings": {}  },
                    // { "baseMapKey": "card_lg_5",         "mapKey": "_RED_card_lg_5",          "settings": {}  },
                    // { "baseMapKey": "card_lg_6",         "mapKey": "_RED_card_lg_6",          "settings": {}  },
                    // { "baseMapKey": "card_lg_7",         "mapKey": "_RED_card_lg_7",          "settings": {}  },
                    // { "baseMapKey": "card_lg_8",         "mapKey": "_RED_card_lg_8",          "settings": {}  },
                    // { "baseMapKey": "card_lg_9",         "mapKey": "_RED_card_lg_9",          "settings": {}  },
                    // { "baseMapKey": "card_lg_draw2",     "mapKey": "_RED_card_lg_draw2",      "settings": {}  },
                    // { "baseMapKey": "card_lg_skip",      "mapKey": "_RED_card_lg_skip",       "settings": {}  },
                    // { "baseMapKey": "card_lg_reverse",   "mapKey": "_RED_card_lg_reverse",    "settings": {}  },
                    
                    // YELLOW: Large cards
                    { "baseMapKey": "card_lg_0",         "mapKey": "_YEL_card_lg_0",          "settings": { colorData: [[Card.colors.base, Card.colors.yellow ]] } },
                    { "baseMapKey": "card_lg_1",         "mapKey": "_YEL_card_lg_1",          "settings": { colorData: [[Card.colors.base, Card.colors.yellow ]] } },
                    { "baseMapKey": "card_lg_2",         "mapKey": "_YEL_card_lg_2",          "settings": { colorData: [[Card.colors.base, Card.colors.yellow ]] } },
                    { "baseMapKey": "card_lg_3",         "mapKey": "_YEL_card_lg_3",          "settings": { colorData: [[Card.colors.base, Card.colors.yellow ]] } },
                    { "baseMapKey": "card_lg_4",         "mapKey": "_YEL_card_lg_4",          "settings": { colorData: [[Card.colors.base, Card.colors.yellow ]] } },
                    { "baseMapKey": "card_lg_5",         "mapKey": "_YEL_card_lg_5",          "settings": { colorData: [[Card.colors.base, Card.colors.yellow ]] } },
                    { "baseMapKey": "card_lg_6",         "mapKey": "_YEL_card_lg_6",          "settings": { colorData: [[Card.colors.base, Card.colors.yellow ]] } },
                    { "baseMapKey": "card_lg_7",         "mapKey": "_YEL_card_lg_7",          "settings": { colorData: [[Card.colors.base, Card.colors.yellow ]] } },
                    { "baseMapKey": "card_lg_8",         "mapKey": "_YEL_card_lg_8",          "settings": { colorData: [[Card.colors.base, Card.colors.yellow ]] } },
                    { "baseMapKey": "card_lg_9",         "mapKey": "_YEL_card_lg_9",          "settings": { colorData: [[Card.colors.base, Card.colors.yellow ]] } },
                    { "baseMapKey": "card_lg_draw2",     "mapKey": "_YEL_card_lg_draw2",      "settings": { colorData: [[Card.colors.base, Card.colors.yellow ]] } },
                    { "baseMapKey": "card_lg_skip",      "mapKey": "_YEL_card_lg_skip",       "settings": { colorData: [[Card.colors.base, Card.colors.yellow ]] } },
                    { "baseMapKey": "card_lg_reverse",   "mapKey": "_YEL_card_lg_reverse",    "settings": { colorData: [[Card.colors.base, Card.colors.yellow ]] } },
                    
                    // BLUE: Large cards
                    { "baseMapKey": "card_lg_0",         "mapKey": "_BLU_card_lg_0",          "settings": { colorData: [[Card.colors.base, Card.colors.blue ]] } },
                    { "baseMapKey": "card_lg_1",         "mapKey": "_BLU_card_lg_1",          "settings": { colorData: [[Card.colors.base, Card.colors.blue ]] } },
                    { "baseMapKey": "card_lg_2",         "mapKey": "_BLU_card_lg_2",          "settings": { colorData: [[Card.colors.base, Card.colors.blue ]] } },
                    { "baseMapKey": "card_lg_3",         "mapKey": "_BLU_card_lg_3",          "settings": { colorData: [[Card.colors.base, Card.colors.blue ]] } },
                    { "baseMapKey": "card_lg_4",         "mapKey": "_BLU_card_lg_4",          "settings": { colorData: [[Card.colors.base, Card.colors.blue ]] } },
                    { "baseMapKey": "card_lg_5",         "mapKey": "_BLU_card_lg_5",          "settings": { colorData: [[Card.colors.base, Card.colors.blue ]] } },
                    { "baseMapKey": "card_lg_6",         "mapKey": "_BLU_card_lg_6",          "settings": { colorData: [[Card.colors.base, Card.colors.blue ]] } },
                    { "baseMapKey": "card_lg_7",         "mapKey": "_BLU_card_lg_7",          "settings": { colorData: [[Card.colors.base, Card.colors.blue ]] } },
                    { "baseMapKey": "card_lg_8",         "mapKey": "_BLU_card_lg_8",          "settings": { colorData: [[Card.colors.base, Card.colors.blue ]] } },
                    { "baseMapKey": "card_lg_9",         "mapKey": "_BLU_card_lg_9",          "settings": { colorData: [[Card.colors.base, Card.colors.blue ]] } },
                    { "baseMapKey": "card_lg_draw2",     "mapKey": "_BLU_card_lg_draw2",      "settings": { colorData: [[Card.colors.base, Card.colors.blue ]] } },
                    { "baseMapKey": "card_lg_skip",      "mapKey": "_BLU_card_lg_skip",       "settings": { colorData: [[Card.colors.base, Card.colors.blue ]] } },
                    { "baseMapKey": "card_lg_reverse",   "mapKey": "_BLU_card_lg_reverse",    "settings": { colorData: [[Card.colors.base, Card.colors.blue ]] } },
                    
                    // GREEN: Large cards
                    { "baseMapKey": "card_lg_0",         "mapKey": "_GRE_card_lg_0",          "settings": { colorData: [[Card.colors.base, Card.colors.green ]] } },
                    { "baseMapKey": "card_lg_1",         "mapKey": "_GRE_card_lg_1",          "settings": { colorData: [[Card.colors.base, Card.colors.green ]] } },
                    { "baseMapKey": "card_lg_2",         "mapKey": "_GRE_card_lg_2",          "settings": { colorData: [[Card.colors.base, Card.colors.green ]] } },
                    { "baseMapKey": "card_lg_3",         "mapKey": "_GRE_card_lg_3",          "settings": { colorData: [[Card.colors.base, Card.colors.green ]] } },
                    { "baseMapKey": "card_lg_4",         "mapKey": "_GRE_card_lg_4",          "settings": { colorData: [[Card.colors.base, Card.colors.green ]] } },
                    { "baseMapKey": "card_lg_5",         "mapKey": "_GRE_card_lg_5",          "settings": { colorData: [[Card.colors.base, Card.colors.green ]] } },
                    { "baseMapKey": "card_lg_6",         "mapKey": "_GRE_card_lg_6",          "settings": { colorData: [[Card.colors.base, Card.colors.green ]] } },
                    { "baseMapKey": "card_lg_7",         "mapKey": "_GRE_card_lg_7",          "settings": { colorData: [[Card.colors.base, Card.colors.green ]] } },
                    { "baseMapKey": "card_lg_8",         "mapKey": "_GRE_card_lg_8",          "settings": { colorData: [[Card.colors.base, Card.colors.green ]] } },
                    { "baseMapKey": "card_lg_9",         "mapKey": "_GRE_card_lg_9",          "settings": { colorData: [[Card.colors.base, Card.colors.green ]] } },
                    { "baseMapKey": "card_lg_draw2",     "mapKey": "_GRE_card_lg_draw2",      "settings": { colorData: [[Card.colors.base, Card.colors.green ]] } },
                    { "baseMapKey": "card_lg_skip",      "mapKey": "_GRE_card_lg_skip",       "settings": { colorData: [[Card.colors.base, Card.colors.green ]] } },
                    { "baseMapKey": "card_lg_reverse",   "mapKey": "_GRE_card_lg_reverse",    "settings": { colorData: [[Card.colors.base, Card.colors.green ]] } },
                    
                    // BLACK: Large cards
                    // { "baseMapKey": "card_lg_back",      "mapKey": "_BLA_card_lg_back",       "settings": {}  },
                    // { "baseMapKey": "card_lg_wild",      "mapKey": "_BLA_card_lg_wild",       "settings": {}  },
                    // { "baseMapKey": "card_lg_wildDraw4", "mapKey": "_BLA_card_lg_wildDraw4",  "settings": {}  },
                ]
            },
            "sprite_tiles1":{
                "mapObjs"  : {},
                "mapKeys"  : [],
                "mapsArray": [
                    // { "baseMapKey": "cursor1_f1", "mapKey": "_cursor1_f1",  "settings": { rotation: 0 }  },
                    // { "baseMapKey": "cursor1_f2", "mapKey": "_cursor1_f2",  "settings": { rotation: 0 }  },
                    // { "baseMapKey": "cursor1_f1", "mapKey": "_cursor1_f1",  "settings": { rotation: 90 }  },
                    // { "baseMapKey": "cursor1_f2", "mapKey": "_cursor1_f2",  "settings": { rotation: 90 }  },
                ]
            },
        };
        
        for(let tilesetKey in list){ 
            for(let rec of list[tilesetKey].mapsArray){ 
                rec.ts = tilesetKey;
                list[tilesetKey].mapKeys.push(rec.mapKey);
            }
        }
        // list = null;
        await _WEBW_V.SEND("generateCoreImageDataAssets", {
            data:{ list:list },
            refs:[]
        }, true, false);
    },

    // Adds the specified file.
    addFile: function(rec, relativePath){
        return new Promise(async (res,rej)=>{
            switch(rec.t){
                case "js": { 
                    // Create the script. 
                    let script = document.createElement('script');

                    // Set the name. 
                    // if(rec.n){ script.setAttribute("name", rec.n); }
                    // else{ script.setAttribute("name", rec.f); }
                    script.setAttribute("name", rec.f); 

                    // Set defer.
                    script.defer=true;

                    // Onload.
                    script.onload = function () { res(); script.onload = null; };
                    script.onerror = function (err) { 
                        console.log("addFile: js: FAILURE:", `${relativePath}/${rec.f}`);
                        rej(err); script.onload = null; 
                    };

                    // Append the element. 
                    document.head.appendChild(script);

                    // Set source. 
                    script.src = `${relativePath}/${rec.f}`;
                    
                    break; 
                }

                case "image": {
                    // Get the data.
                    let img = new Image();
                    img.onload = function(){
                        // Determine the data name. 
                        // let dataName;
                        // if(rec.n){ dataName = rec.n; }
                        // else{ dataName = rec.f }

                        // Create the files key in the game if it doesn't exist. 
                        // if(!_APP.files){ _APP.files = {"_WARNING":"_WARNING"}};
                        
                        // // Save the data to the files object. 
                        // _APP.files[dataName] = img;
                        
                        res(img);
                        img.onload = null;
                    };
                    img.onerror = function (err) { 
                        console.log("addFile: image: FAILURE:", `${relativePath}/${rec.f}`);
                        rej(err); img.onload = null; 
                    };
                    img.src = `${relativePath}/${rec.f}`;

                    break; 
                }

                case "json": { 
                    // Get the data.
                    let data = await _JSG.net.http.send(`${relativePath}/${rec.f}`, { type:"json", method:"GET" }, 5000);
                    if(data === false){
                        console.log("addFile: json: FAILURE:", `${relativePath}/${rec.f}`);
                        rej(data); return;
                    }

                    // Determine the data name. 
                    // let dataName;
                    // if(rec.n){ dataName = rec.n; }
                    // else{ dataName = rec.f }

                    // Create the files key in the game if it doesn't exist. 
                    // if(!_APP.files){ _APP.files = {"_WARNING":"_WARNING"}};

                    // // Save the data to the files object. 
                    // _APP.files[dataName] = data;

                    res(data);
                    break; 
                }
                
                case "html": { 
                    // Get the data.
                    // let data = await _JSG.net.http.send(`${relativePath}/${rec.f}`, { type:"text", method:"GET" }, 5000);
                    let data = await (await fetch(`${relativePath}/${rec.f}`)).text();
                    // if(data === false){
                    //     console.log("addFile: html: FAILURE:", `${relativePath}/${rec.f}`);
                    //     rej(data); return;
                    // }

                    // Determine the data name. 
                    // let dataName;
                    // if(rec.n){ dataName = rec.n; }
                    // else{ dataName = rec.f }

                    // Create the files key in the game if it doesn't exist. 
                    // if(!_APP.files){ _APP.files = {"_WARNING":"_WARNING"}};

                    // // Save the data to the files object. 
                    // _APP.files[dataName] = data;

                    res(data);
                    break; 
                }

                case "css": { 
                    // Create CSS link.
                    let link = document.createElement('link');

                    // Set type and rel. 
                    link.type   = 'text/css';
                    link.rel    = 'stylesheet';

                    // Set the name.
                    // if(rec.n){ link.setAttribute("name", rec.n); }
                    // else{ link.setAttribute("name", rec.f); }
                    link.setAttribute("name", rec.f);

                    // Onload.
                    link.onload = function() { res(); link.onload = null; };
                    link.onerror = function (err) { 
                        console.log("addFile: css: FAILURE:", `${relativePath}/${rec.f}`, err);
                        rej(err); link.onload = null; 
                    };
                    // Append the element. 
                    document.head.appendChild( link );

                    // Set source.
                    link.href   = `${relativePath}/${rec.f}`;

                    break; 
                }

                default  : { 
                    let msg = `Cannot load: ${rec.f}. Unknown file type: ${rec.t}`;
                    console.log(msg);
                    rej(msg);
                    break; 
                }
            };
        });
    },

    // Error handler.
    errorHandler: {
        //
        DOM: {
            error_display:null,
            errorText_inner:null,
            error_display_close:null,
        },
        errorTriggered: false,

        handler: function(e){
            e.preventDefault();
            if(this.errorTriggered){ return false; }
            this.errorTriggered = true;
    
            if(e.type == "unhandledrejection"){
                try{
                    console.error( `ERRORHANDLER: ${e.type}\n  e.reason.message:`, e.reason ); 
                } 
                catch(innerError){
                    console.error( `ERRORHANDLER: ${e.type}\n  INNERERROR:`, e, innerError ); 
                }
            }
            else if(e.type == "uncaughtException"){
                console.error( `ERRORHANDLER: ${e.type}`, e.error ?? e.reason); 
            }
            else if(e.type == "uncaughtException"){
                console.error( `ERRORHANDLER: ${e.type}`, e.error ?? e.reason); 
            }
            else if(e.type == "error"){
                console.error( `ERRORHANDLER: ${e.type}`+ `\n  e.error: `, e.error ); 
            }
            else{
                console.error("UNKNOWN:", e);
            }
            
            // if(_APP.debugActive){
                // console.error( `ERRORHANDLER  ${e.type} (FULL EVENT):`, e.error ?? e.reason ); 
            // }
            
            try{
                // if(_APP.debugActive){
                //     let toggleGameLoop = document.getElementById("debug_test_toggleGameLoop");
                //     toggleGameLoop.classList.remove("debug_bgColor_on");
                //     toggleGameLoop.classList.add("debug_bgColor_off");
                //     toggleGameLoop.innerText = "LOOP: OFF";
                // }

                // Stop the game loop.
                _APP.game.gameLoop.loop_stop();

                // Display the error.
                this.displayError(e.message ?? e.reason.message);

                //
                console.error(`${_APP.configObj.appName}: STOPPED THE GAMELOOP DUE TO ERROR`);
                
                // Open the debugger.
                // if(_APP.debugActive){ setTimeout(()=>{debugger;}, 250); }
            }
            catch(innerError){
                console.log(e, innerError);
            }
    
            return false;
        },
        displayError: function(message){
            this.DOM.error_display.style.display = "";
            // this.DOM.errorText_inner.innerText = message + `${_APP.game.gs1 ? `GS1: ${_APP.game.gs1}, GS2: ${_APP.game.gs2}` : ``};
            if(_APP.debugActive){
                message += `${_APP.game.gs1 ? `\n\nGS1: ${_APP.game.gs1}\nGS2: ${_APP.game.gs2}` : `` }`;
            }
            this.DOM.errorText_inner.innerText = message;
        },
    
        // 
        closeError: function(){
            this.errorTriggered = false;
            this.DOM.error_display.style.display = "none";
        },
        
        init: function(){
            this.DOM.error_display   = document.getElementById("error_display");
            this.DOM.errorText_inner = document.getElementById("error_display_text_inner");
            this.DOM.error_display_close = document.getElementById("error_display_close");

            window.addEventListener('error'                      , (e)=>this.handler(e));
            window.addEventListener('unhandledrejection'         , (e)=>this.handler(e));
            window.addEventListener('DOMException'          , (e)=>this.handler(e)); // ?
            // window.addEventListener('uncaughtException'          , (e)=>this.handler(e)); // ?
            this.DOM.error_display_close.addEventListener('click', (e)=>this.closeError(e));
        },
    },

    // Get url params.
    getUrlParams: function(){
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params          = Object.fromEntries(urlSearchParams.entries());
        return params;
    },

    timeItData: {},
    timeIt: function(key, func, value=0){
        // _APP.utility.timeIt("KEY_NAME", "start");
        // _APP.utility.timeIt("KEY_NAME", "stop");
        // _APP.utility.timeIt("KEY_NAME", "get");
        // _APP.utility.timeIt("KEY_NAME", "reset");
        // _APP.utility.timeIt("KEY_NAME", "set", 14);
        // _APP.utility.timeIt("", "getAll");
        
        if     (func == "start"){
            this.timeItData[key] = { t:0, s:performance.now(), e:0 };
            return this.timeItData[key].t;
        }
        else if(func == "stop"){
            this.timeItData[key].e = performance.now();
            this.timeItData[key].t = this.timeItData[key].e - this.timeItData[key].s;
            return this.timeItData[key].t;
        }
        else if(func == "get"){
            return this.timeItData[key] ? this.timeItData[key].t : 0;
        }
        else if(func == "set"){
            return this.timeItData[key].t = value;
        }
        else if(func == "getAll"){
            let data = {};
            for(let key in this.timeItData){
                data[key] = this.timeItData[key].t;
            }
            return data;
        }
        else if(func == "reset"){
            this.timeItData[key] = { t:0, s:0, e:0 };
            return this.timeItData[key].t;
        }
    },
};

// For loading customized wrappers for plug-ins.
_APP.loader = {
    // If debug is requested this function makes sure that it is allowed.
    debugAuthCheck: function(params){
        let debugActive = ("debug" in params && params.debug === '1') ? true : false;
        if (debugActive && window.location.hostname !== 'localhost') {
            _APP.debugActive = false;

            // Change the 'debug' parameter in the URL to '0'.
            let url = new URL(window.location.href);
            let newParams = url.searchParams;
            newParams.set('debug', '0');
            url.search = newParams.toString();

            // Update the URL in the address bar without reloading the page.
            window.history.pushState({}, '', url.toString());

            console.error("Debug is not availble from this location:", window.location.hostname);
        }
        else{
            _APP.debugActive = debugActive;
        }
    },
    loadFiles: async function(){
        return new Promise(async (resolve,reject)=>{
            let relPath = ".";
            if(_APP.usingJSGAME){ relPath = "./games/JSGAME_Uno"; }

            // URL params can affect app settings.
            let params = _APP.utility.getUrlParams();
            if( ("debug" in params && params.debug === '1') ? true : false ) { 
                // Make sure that debug can be activated.
                this.debugAuthCheck(params); 

                // Change these settings for debug mode.
                if(_APP.debugActive){
                    _APP.configObj.awaitDraw = true;
                    // _APP.configObj.awaitDraw = false;
                    // _APP.configObj.disableCache = true;
                    // _APP.configObj.disableCache = false;
                    // _APP.configObj.generateCoreImageDataAssets;
                    // _APP.configObj.useGlobalOffsets = true;
                    // _APP.configObj.useGlobalOffsets = false;
                    // _APP.configObj.globalOffsets.x = 0;
                    // _APP.configObj.globalOffsets.y = 0;
                }
            }

            // Download these files sequentially as some depend on the others.
            await _APP.utility.addFile( { f:"css/uno.css"                  , t:"css" }, relPath); // GAME
            await _APP.utility.addFile( { f:"js/uno_main.js"               , t:"js"  }, relPath); // GAME
            await _APP.utility.addFile( { f:"js/shared.js"                 , t:"js"  }, relPath); // GAME
            await _APP.utility.addFile( { f:"js/webv.js"                   , t:"js"  }, relPath); // CORE
            await _APP.utility.addFile( { f:"js/gfx.js"                    , t:"js"  }, relPath); // CORE
            await _APP.utility.addFile( { f:"js/gfxClasses.js"             , t:"js"  }, relPath); // GAME
            await _APP.utility.addFile( { f:"js/INPUT_A/inputModeA_core.js", t:"js"  }, relPath); // CORE
            await _APP.utility.addFile( { f:"js/inputModeA_customized.js"  , t:"js"  }, relPath); // _INPUT customizer
            if(_APP.debugActive) { await _APP.utility.addFile( { f:"js/debug.js"  , t:"js"  }, relPath); }

            // Download these files in parallel. The only depend on the previously loaded files.
            let files2 = [
                _APP.utility.addFile( {f:"js/gs_JSG.js"    , t:"js" }, relPath), // GAME
                _APP.utility.addFile( {f:"js/gs_N782.js"   , t:"js" }, relPath), // GAME
                _APP.utility.addFile( {f:"js/gs_TITLE.js"  , t:"js" }, relPath), // GAME
                _APP.utility.addFile( {f:"js/gs_RULES.js"  , t:"js" }, relPath), // GAME
                _APP.utility.addFile( {f:"js/gs_CREDITS.js", t:"js" }, relPath), // GAME
                _APP.utility.addFile( {f:"js/gs_OPTIONS.js", t:"js" }, relPath), // GAME
                _APP.utility.addFile( {f:"js/gs_PLAYING.js", t:"js" }, relPath), // GAME
            ];
            await Promise.all(files2);

            resolve();
        });
    },
    loadHtml: async function(){
        let relPath = ".";
        if(_APP.usingJSGAME){ relPath = "./games/JSGAME_Uno"; }

        // Add the HTML
        let html;
        await new Promise( async (res,rej) => { html = await _APP.utility.addFile({f:"index.html", t:"html"  }, relPath); res(); } );
        let dest = document.getElementById("jsgame_app");
        dest.innerHTML = "";

        let div = document.createElement("div");
        div.innerHTML = html;
        dest.append( div.querySelector("#wrapper") );
    },
    inits: async function(){
        // INITS
        await _WEBW_V.init();
        await _GFX.init();
        await _INPUT.customized.init(_APP.configObj.inputConfig);
        if(_APP.debugActive && _DEBUG && _DEBUG.init){ await _DEBUG.init(); }
        _APP.navBar1.init();
        
        if(_APP.debugActive && _DEBUG && _DEBUG.init){ _APP.navBar1.showOne("view_debug"); }
        else{
            _APP.navBar1.showOne("view_controls");
            // _APP.navBar1.showOne("view_input");
            // _APP.navBar1.showOne("view_debug");
        }
        
        _APP.initOutputScaleControls();

        await _APP.game.gameLoop.init();
    },
};

_APP.navBar1 = {
    // Holds the DOM for the nav buttons and nav views.
    DOM: {
        'view_controls': {
            'tab': 'controls_navBar1_tab_controls',
            'view': 'controls_navBar1_view_controls',
        },
        'view_input': {
            'tab': 'controls_navBar1_tab_input',
            'view': 'controls_navBar1_view_input',
        },
        'view_debug': {
            'tab': 'controls_navBar1_tab_debug1',
            'view': 'controls_navBar1_view_debug1',
        },
    },
    DOM2: { "aux":"aux" },

    // Deactivates all nav buttons and views. 
    hideAll: function() {
        // Deactivate all views and nav buttons.
        for (let key in this.DOM) {
            if(typeof this.DOM[key].tab != "string"){
                this.DOM[key].tab .classList.remove("active");
                this.DOM[key].view.classList.remove("active");
            }
        }
    },

    // Activates one nav buttons and view. 
    showOne: function(key) {
        // Check that the nav key is valid.
        if (Object.keys(this.DOM).indexOf(key) == -1) {
            console.log("WARN: Invalid nav key.", key);
            return;
        }

        // Deactivate all views and nav buttons.
        this.hideAll();

        // Active this view and nav button.
        if(typeof this.DOM[key].tab != "string"){
            this.DOM[key].tab .classList.add("active");
            this.DOM[key].view.classList.add("active");
        }

        // Handling the loop for the gamepad config.
        if(typeof _INPUT != undefined && _INPUT.web){
            if(this.DOM2 && this.DOM2.aux){
                if(key == "view_input"){ 
                    _INPUT.web.mainView.showInput_hideOthers();
                    this.DOM2.aux.classList.add("wide");
                    this.DOM2.aux.classList.remove("wide2");
                }
                else if(_APP.debugActive && key == "view_debug"){ 
                    this.DOM2.aux.classList.remove("wide");
                    this.DOM2.aux.classList.add("wide2");
                }
                else{ 
                    _INPUT.web.mainView.hideInput_restoreOthers(); 
                    this.DOM2.aux.classList.remove("wide"); 
                    this.DOM2.aux.classList.remove("wide2"); 
                }
            }
        }
    },

    // Init for the nav (side.)
    init: function() {
        // Create the DOM cache and add the click event listener to the nav tabs.
        for (let key in this.DOM) {
            // Skip DOM that has already been processed.
            if(typeof this.DOM[key].tab != "string" || typeof this.DOM[key].view != "string"){ 
                // console.log("Already processed:", this.DOM[key].tab, this.DOM[key].view); 
                continue; 
            }

            // Cache the DOM.
            let tab  = document.getElementById(this.DOM[key].tab) ;
            let view = document.getElementById(this.DOM[key].view);
            
            if(tab && view){
                this.DOM[key].tab  = tab;
                this.DOM[key].view = view;
                
                // Add event listeners to the tab.
                this.DOM[key].tab.addEventListener("click", () => { this.showOne(key); }, false);
            }
        }

        //
        if(this.DOM2 && this.DOM2.aux){
            this.DOM2.aux = document.getElementById(this.DOM2.aux);
        }
    },
};

_APP.init_standAlone = async function(){
    return new Promise(async (resolve,reject)=>{
        await _APP.loader.loadFiles();
        _APP.utility.errorHandler.init();

        // INITS
        await _APP.loader.inits();

        resolve();
    });
};

// JSGAME REQUESTS THIS FUNCTION FIRST.
_APP.init = async function(){
    return new Promise(async (resolve,reject)=>{
        // Set flags. 
        _APP.standAlone       = false;
        _APP.usingJSGAME      = true;
        _APP.usingJSGAME_INPUT= false;

        await _APP.loader.loadFiles();
        
        // Add the HTML
        await _APP.loader.loadHtml();
        _APP.utility.errorHandler.init();

        // INITS
        await _APP.loader.inits();

        resolve();
    });
};

// JSGAME REQUESTS THIS FUNCTION SECOND.
_APP.start = async function(){
    return new Promise(async (resolve,reject)=>{
        let loadTime = performance.now() - _JSG.appStart_timestamp;
        console.log(`${_APP.configObj.appName} (JSGAMEV2 version) load time: ${loadTime.toFixed(2)}ms`);
        // alert(`${_APP.configObj.appName} (JSGAMEV2 version) load time: ${loadTime.toFixed(2)}ms`);

        // Start the game loop.
        setTimeout(()=>{ 
            _APP.game.gameLoop.loop_start(); 
            if(_APP.debugActive){_DEBUG.toggleButtons1.setCurrentStates(); }
        }, 250);
        resolve();
    });
};