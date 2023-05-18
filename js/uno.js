// _APP.debugActive = false;
_APP.debugActive = true;
_APP.configObj = {
    appName: "UNO!",

    // waitUntilFrameDrawn: true,
    waitUntilFrameDrawn: false,

    generateAllCoreImageDataAssets: true,
    // generateAllCoreImageDataAssets: false,

    // Offset x and y for all drawings by this number of tiles.
    useGlobalOffsets: true,
    globalOffsets:{
        x: 1,
        y: 1,
    },

    // Relative paths need to be correctly relative to whatever loads this file (the web page or the web worker.)
    tilesetFiles: [
        "../UAM/JSON/bg_tiles2.json",
        "../UAM/JSON/bg_tiles.json",
        "../UAM/JSON/font_tiles.json",
        "../UAM/JSON/sprite_tiles.json",
    ],
    
    dimensions: {
        "tileWidth" : 8,
        "tileHeight": 8,
        // "rows":28, 
        // "cols":28
        "rows":30, 
        "cols":30
    },

    layers:[
        { "name": "BG1", "type":"grid"  , "canvasOptions": { "willReadFrequently": false, "alpha": true }, css:[ {k:"z-index", v:"105"}, {k:"background-color", v:"#181818"} ] },
        { "name": "BG2", "type":"grid"  , "canvasOptions": { "willReadFrequently": false, "alpha": true }, css:[ {k:"z-index", v:"110"} ] },
        { "name": "SP1", "type":"sprite", "canvasOptions": { "willReadFrequently": false, "alpha": true }, css:[ {k:"z-index", v:"115"} ] },
        { "name": "TX1", "type":"grid"  , "canvasOptions": { "willReadFrequently": false, "alpha": true }, css:[ {k:"z-index", v:"120"} ] },
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
        console.log("resizeParent", scale);
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

    //
    generateAllCoreImageDataAssets: async function(){
        // _APP.game.gameLoop.loop_stop();
        // _APP.utility.await generateAllCoreImageDataAssets();
        // _APP.game.gameLoop.loop_start();

        if(this.ww_ImageDataAssetsGenerated){ console.log("Already done!"); return; }
        this.ww_ImageDataAssetsGenerated = true;
        
        await _WEBW_V.SEND("generateAllCoreImageDataAssets", {
            data:{            },
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
    //
    errorTriggered: false,
    errorHandler: function(e){
        e.preventDefault();
        if(this.errorTriggered){ return false; }
        this.errorTriggered = true;

        console.log(
            `ERRORHANDLER:`+
            // `\n  e.filename: ${e.filename}`+
            `\n  e.error   : `, e.error
        ); 

        try{
            _APP.game.gameLoop.running = false;
            _APP.game.gameLoop.loop_stop();
            _APP.utility.displayError(e.message);
            console.error(`${_APP.configObj.appName}: STOPPED THE GAMELOOP DUE TO ERROR`);
            
            // Open the debugger.
            // if(_APP.debugActive){ setTimeout(()=>{debugger;}, 250); }
        }
        catch(e){
            console.log(e);
        }

        return false;
    },
    displayError: function(message){
        let error_display = document.getElementById("error_display")
        let text = document.getElementById("error_display_text_inner")
        error_display.style.display = "";

        text .innerText = message;
        console.log(message);
    },
};

// For loading customized wrappers for plug-ins.
_APP.loader = {
    loadFiles: async function(){
        return new Promise(async (resolve,reject)=>{
            let relPath = ".";
            if(_APP.usingJSGAME){ relPath = "./games/JSGAME_Uno"; }

            // Download these files sequentially.
            await _APP.utility.addFile( { f:"js/uno_main.js"               , t:"js"  }, relPath);
            await _APP.utility.addFile( { f:"js/shared.js"                 , t:"js"  }, relPath);
            await _APP.utility.addFile( { f:"css/uno.css"                  , t:"css" }, relPath);
            await _APP.utility.addFile( { f:"js/webv.js"                   , t:"js"  }, relPath);
            await _APP.utility.addFile( { f:"js/gfx.js"                    , t:"js"  }, relPath);
            await _APP.utility.addFile( { f:"js/gfxClasses.js"             , t:"js"  }, relPath);
            await _APP.utility.addFile( { f:"js/INPUT_A/inputModeA_core.js", t:"js"  }, relPath);
            await _APP.utility.addFile( { f:"js/inputModeA_customized.js"  , t:"js"  }, relPath);
            if(_APP.debugActive) { await _APP.utility.addFile( { f:"js/debug.js"  , t:"js"  }, relPath); }

            // Download these files in parallel.
            let files2 = [
                _APP.utility.addFile( {f:"js/gs_JSG.js"    , t:"js" }, relPath),
                _APP.utility.addFile( {f:"js/gs_N782.js"   , t:"js" }, relPath),
                _APP.utility.addFile( {f:"js/gs_TITLE.js"  , t:"js" }, relPath),
                _APP.utility.addFile( {f:"js/gs_OPTIONS.js", t:"js" }, relPath),
                _APP.utility.addFile( {f:"js/gs_RULES.js"  , t:"js" }, relPath),
                _APP.utility.addFile( {f:"js/gs_PLAYING.js", t:"js" }, relPath),
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
            if(key == "view_input"){ 
                try{ 
                    _INPUT.web.mainView.showInput_hideOthers();
                    this.DOM2.aux.classList.add("wide");
                } catch(e){ console.log(e); };
            }
            else{ 
                try{ 
                    _INPUT.web.mainView.hideInput_restoreOthers(); 
                    this.DOM2.aux.classList.remove("wide"); 
                } catch(e){ console.log(e); };
            }
        }
    },

    // Init for the nav (side.)
    init: function() {
        // Create the DOM cache and add the click event listener to the nav tabs.
        for (let key in this.DOM) {
            // Cache the DOM.
            let tab  = document.getElementById(this.DOM[key].tab);
            let view = document.getElementById(this.DOM[key].view);
            if(tab && view){
                this.DOM[key].tab  = tab;
                this.DOM[key].view = view;
                
                // Add event listeners to the tab.
                this.DOM[key].tab.addEventListener("click", () => { this.showOne(key); }, false);
            }
            // else{
            //     console.log(
            //         `NAVBAR1: NOT FOUND:`+ 
            //         `\n  tab : ${this.DOM[key].tab }` +
            //         `\n  view: ${this.DOM[key].view}` +
            //         ``
            //     );
            // }
        }

        //
        this.DOM2.aux = document.getElementById(this.DOM2.aux);
    },
};

_APP.init_standAlone = async function(){
    return new Promise(async (resolve,reject)=>{
        window.addEventListener('error', _APP.utility.errorHandler);

        await _APP.loader.loadFiles();

        // INITS
        await _APP.loader.inits();

        resolve();
    });
};

// JSGAME REQUESTS THIS FUNCTION FIRST.
_APP.init = async function(){
    return new Promise(async (resolve,reject)=>{
        window.addEventListener('error', _APP.utility.errorHandler);

        // Set flags. 
        _APP.standAlone       = false;
        _APP.usingJSGAME      = true;
        _APP.usingJSGAME_INPUT= false;

        await _APP.loader.loadFiles();

        // Add the HTML
        await _APP.loader.loadHtml();

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
        // _APP.game.gameLoop.loop_start();
        setTimeout(()=>{ 
            _APP.game.gameLoop.loop_start(); 
        }, 250);
        resolve();
    });
};