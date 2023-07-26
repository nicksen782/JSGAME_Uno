// This is the main config file for the game and any plug-ins. 
( async function(){
    _APP.configObj = {
        // INFO: _APP.game
        gameInfo: {
            "repo":{
                "author_title" : "JSGAME_Uno",
                "author_C"     : true,
                "author_year"  : "2023",
                "author_name"  : "Nickolas Andersen",
                "author_handle": "(nicksen782)",
                "repoType"     : "Github",
                "repoHref"     : "https://github.com/nicksen782/JSGAME_Uno",
                "repoText"     : "nicksen782/JSGAME_Uno"
            }
        },

        // CONFIG: _APP.game
        gameConfig: {
            enabled: true,
            debug  : false,
            
            // Used as the document root (For the JSGAME loader.)
            appRelPath: "JSGAME_Uno", 

            // Used for display.
            appNameText: "Uno", 

            files:[
                { f:"GAME/game.css"      , t:"css" },
                { f:"GAME/gfxClasses.js" , t:"js"  },
                { f:"GAME/shared.js"     , t:"js"  },
                { f:"GAME/gamestates/gs_JSG.js"     , t:"js"  },
                { f:"GAME/gamestates/gs_N782.js"    , t:"js"  },
                { f:"GAME/gamestates/gs_TITLE.js"   , t:"js"  },
                { f:"GAME/gamestates/gs_RULES.js"   , t:"js"  },
                { f:"GAME/gamestates/gs_CREDITS.js" , t:"js"  },
                { f:"GAME/gamestates/gs_OPTIONS.js" , t:"js"  },
                { f:"GAME/gamestates/gs_PLAYING.js" , t:"js"  },
                { f:"GAME/gamestates/gs_PLAYING2.js" , t:"js"  },
            ],
            debugFiles:[
                { f:"GAME/debug.js" , t:"js"  },
                { f:"GAME/debug.css", t:"css" },
            ],
    
            // First gamestate1.
            // firstGamestate1:"gs_JSG",
            // firstGamestate1:"gs_N782",
            // firstGamestate1:"gs_TITLE",
            // firstGamestate1:"gs_RULES",
            // firstGamestate1:"gs_CREDITS",
            // firstGamestate1:"gs_OPTIONS",
            firstGamestate1:"gs_PLAYING",
            
            // First gamestate2.
            firstGamestate2:"",
        },
    
        // CONFIG: _GFX
        gfxConfig: {
            enabled: true,
            debug  : true,
    
            files:[
                { f:"/SHARED/VIDEO_B/gfx.js" , t:"js" },
                { f:"/SHARED/VIDEO_B/gfx.css" , t:"css" },
            ],
            debugFiles:[
                { f:"/SHARED/VIDEO_B/debug.js"  , t:"js"  },
                { f:"/SHARED/VIDEO_B/debug.css" , t:"css" },
            ],
            debugFiles2:[
                { f:"/SHARED/VIDEO_B/debug.html", t:"html", destId: "navView_gfx_debug" },
            ],
            webWorker: "/SHARED/VIDEO_B/video_webworker.js",
    
            // Shared dimensions for each layer.
            dimensions: {
                "tileWidth" : 8,
                "tileHeight": 8,
                "rows":28, 
                "cols":28
            },
    
            // Layer config.
            layers:[
                { "clearType": "simple", "name": "L1", "useFlicker": true, "canvasOptions": { "willReadFrequently": false, "alpha": true }, css:[ {k:"z-index", v:"105"}, {k:"background-color", v:"#181818"} ] },
                { "clearType": "simple", "name": "L2", "useFlicker": true, "canvasOptions": { "willReadFrequently": false, "alpha": true }, css:[ {k:"z-index", v:"110"} ] },
                { "clearType": "simple", "name": "L3", "useFlicker": true, "canvasOptions": { "willReadFrequently": false, "alpha": true }, css:[ {k:"z-index", v:"115"} ] },
                { "clearType": "simple", "name": "L4", "useFlicker": true, "canvasOptions": { "willReadFrequently": false, "alpha": true }, css:[ {k:"z-index", v:"120"} ] },
            ],
            // Container for the canvas layers.
            outputDiv: "gameView",
            
            // For layout debugging.
            borders: {
                outputDiv   : false,
                canvasLayers: false,
            },
    
            // Element id to make full screen.
            // fullScreenElemId: "gameView",
            fullScreenElemId: "wrapper",
    
            // Controls if the loop will wait for the graphics draw to finish before continuing.
            // awaitDraw: true,
            awaitDraw: false,
    
            // generateCoreImageDataAssets: true,
            generateCoreImageDataAssets: false,
    
            // disableCache: true,
            disableCache: false,
    
            // Offset x and y for all drawings by this number of tiles (Grid-based.)
            // useGlobalOffsets: true,
            useGlobalOffsets: false,
            globalOffsets_x: 1,
            globalOffsets_y: 1,
    
            // Relative paths need to be relative to the appRoot. The WebWorker will resolve the path correctly.
            tilesetFiles: [
                "UAM/JSON/combined1.json",
            ],
            // This tileset is used as the default if one is not specified (may be incorrect!)
            defaultTileset: "combined1",
            defaultFontTileset: "combined1",
            
            // Configuration for text/font.
            fontObj: { ts: "combined1", tmap: "fontset_part1_UC", forceUpperCase: true },
    
            tabConfig: {
                destTabs   : "mainNavMenu_ul",
                destViews  : "mainNavMenuViews",
            //     destTabId  : "navTab_inputConfig",
            //     destViewId : "navView_inputConfig",
            //     destTabId2 : "navTab_input",
            //     destViewId2: "navView_input",
            },
        },
    
        // CONFIG: _INPUT
        inputConfig: {
            enabled: true,
            debug  : false,
    
            files:[
                { f: "/SHARED/INPUT_A/inputModeA_core.js"       , t:"js"  },
                { f: "/SHARED/INPUT_A/inputModeA_user.js"       , t:"js"  },
                { f: "/SHARED/INPUT_A/inputModeA_mappings.js"   , t:"js"  },
                { f: "/SHARED/INPUT_A/inputModeA_web.js"        , t:"js"  },
                { f: "/SHARED/INPUT_A/inputModeA_web.css"       , t:"css" },
                { f: "/SHARED/INPUT_A/inputModeA_customized.js" , t:"js"  },
            ],
            files2: [
                { f: "/SHARED/INPUT_A/inputModeA_web.html"      , t:"html", type:"webConfig" },
            ],
            debugFiles:[
                // { f: "INPUT_A/debug.js" , t:"js"  },
                // { f: "INPUT_A/debug.css", t:"css" },
            ],
            debugFiles2:[
            ],
    
            useKeyboard   : true, 
            useGamepads   : true,
            listeningElems: ["gameView", "navView_input"],
            webElem       : "navView_inputConfig",
            liveGamepadsDestId: "navView_input",
            tabConfig: {
                destTabs   : "mainNavMenu_ul",
                destViews  : "mainNavMenuViews",
                destTabId  : "navTab_inputConfig",
                destViewId : "navView_inputConfig",
                destTabId2 : "navTab_input",
                destViewId2: "navView_input",
            },
        },
    
        // CONFIG: _SND
        soundConfig: {
            enabled: false,
            debug  : false,
    
            files:[
                // { f:"/SHARED/SOUND_B/soundModeB_core.js", t:"js"  },
                // { f:"/SHARED/SOUND_B/soundModeB_user.js", t:"js"  },
                // { f:"/SHARED/SOUND_B/soundModeB.css", t:"css"  },
            ],
            debugFiles:[
                // { f:"/SHARED/SOUND_B/debug.js" , t:"js"  },
                // { f:"/SHARED/SOUND_B/debug.css", t:"css" },
            ],
            debugFiles2:[
            ],
    
            interActionNeededId      : "audio_userInputNeeded_container",
            blockLoopIfSoundNotLoaded: false,
        },

        // Detects little or big endianness for the browser.
        endianness : {
            isBigEndian    : new Uint8Array(new Uint32Array([0x12345678]).buffer)[0] === 0x12 ? true : false, // ARM?
            isLittleEndian : new Uint8Array(new Uint32Array([0x12345678]).buffer)[0] === 0x78 ? true : false, // x86
        },

        // List of config keys.
        configKeys: ["gfxConfig", "inputConfig", "soundConfig", "gameConfig"],
    };
})();