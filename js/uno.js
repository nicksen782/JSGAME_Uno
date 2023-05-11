
const _APP = {
    usingJSGAME: false,
    usingJSGAME_INPUT: false,
    debugActive: true,
    // debugActive: false,
    configObj: {
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
            "rows":36, 
            "cols":28
        },

        layers:[
            // { "name": "BG1" , "canvasOptions": { "willReadFrequently": false, "alpha": true }, css:[ {k:"z-index", v:"105"} ] },
            { "name": "BG1", "type":"grid"  , "canvasOptions": { "willReadFrequently": false, "alpha": true }, css:[ {k:"z-index", v:"105"}, {k:"background-color", v:"#181818"} ] },
            { "name": "BG2", "type":"grid"  , "canvasOptions": { "willReadFrequently": false, "alpha": true }, css:[ {k:"z-index", v:"110"} ] },
            { "name": "SP1", "type":"sprite", "canvasOptions": { "willReadFrequently": false, "alpha": true }, css:[ {k:"z-index", v:"115"} ] },
            { "name": "TX1", "type":"grid"  , "canvasOptions": { "willReadFrequently": false, "alpha": true }, css:[ {k:"z-index", v:"120"} ] },
        ],
        
        waitUntilFrameDrawn: true,
    },

    gamestate: {
        // gs1: "gs_JSG",
        gs1: "gs_N782",
        // gs1: "gs_TITLE",
        // gs1: "gs_OPTIONS",
        // gs1: "gs_RULES",
        // gs1: "gs_PLAYING",

        gs2: "",
        
        gs1_new: "",
        gs2_new: "",
        gs1_prev: "",
        gs2_prev: "",

        changeGs1_triggered: false,
        changeGs2_triggered: false,
        changeGs1: function(){},
        changeGs2: function(){},
    },
    gamestates: {},
    gamestates_list: {},
    gameLoop: {
        frameCounter     : 0,
        frameDrawCounter : 0,
        raf_id       : null,
        running      : false,
        fps          : 60,
        msFrame      : null,
        thisLoopStart: 0,
        lastLoopRun  : 0,
        delta        : undefined,
        loopType     : "raf", // Can be "raf" or "to".
        lastDebug    : 0,
        debugDelay   : undefined,
        fadeIsBlocking: false,

        // Calculates the average frames per second.
        fpsCalc : {
            // colxi: https://stackoverflow.com/a/55644176/2731377
            sampleSize   : undefined,
            _sample_     : undefined,
            average      : undefined,
            avgMsPerFrame: undefined,
            _index_      : undefined,
            _lastTick_   : undefined,

            // Internal within tick.
            __delta_     : undefined,
            __fps_       : undefined,
            __average_   : undefined,
            __average_i_ : undefined,

            tick : function tick(now){
                // if is first tick, just set tick timestamp and return
                if( !this._lastTick_ ){ this._lastTick_ = now; return 0; }

                // Determine the fps for this tick. 
                __delta_ = (now - this._lastTick_) / 1000;
                __fps_ = (1 / __delta_) << 0; // Round down fps.
                
                // Add to fps samples the current tick fps value.
                this._sample_[ this._index_ ] = __fps_;
                
                // Get the fps average by summing all samples and dividing by the sample count. 
                __average_ = 0;
                this.__average_i_ = this._sample_.length; 
                while (this.__average_i_--) { __average_ += this._sample_[this.__average_i_]; } 
                __average_ = ( __average_ / this._sample_.length);
        
                // Set the new FPS average.
                this.average = __average_;
                this.avgMsPerFrame = 1000 / __average_;

                // Store current timestamp
                this._lastTick_ = now;

                // Increase the sample index counter
                this._index_ += 1;

                // Reset the sample index counter if it excedes the maximum sampleSize limit
                if( this._index_ == this.sampleSize) this._index_ = 0;
                
                return this.average;
            },
            init: function init(sampleSize){
                // Set initial values.
                this.sampleSize = sampleSize;
                this._index_    = 0 ;
                this.average    = 0 ;
                this.avgMsPerFrame = 0 ;
                this._lastTick_ = 0 ;

                // Create new samples Uint8Array and fill with the default value.
                this._sample_ = new Uint8Array( new ArrayBuffer(this.sampleSize) );
                this._sample_.fill(0);
                // this._sample_.fill(sampleSize);
            },
        },
    
        loop_start: function(){
            // Stop the gameLoop if it is running.
            if(_APP.gameLoop.running){ this.loop_stop(); }
            
            // Start the gameLoop.
            _APP.gameLoop.running = true; 

            // Schedule the next gameloop run.
            this.loop_schedule_nextRun();
        },
        loop_stop: function(){
            // Cancel the current animation frame. 
            if     (_APP.gameLoop.loopType == "raf"){ window.cancelAnimationFrame(_APP.gameLoop.raf_id);  }
            else if(_APP.gameLoop.loopType == "to") { window.clearTimeout(_APP.gameLoop.raf_id); }
            else{ console.error("Invalid loopType:", _APP.gameLoop.loopType); }

            // Set the gameLoop.running to false. 
            _APP.gameLoop.running = false;
        },
        loop_schedule_nextRun: function(){
            if     (_APP.gameLoop.loopType == "raf"){ _APP.gameLoop.raf_id = window.requestAnimationFrame( (ts)=>{ _APP.gameLoop.loop( ts ); } ); }
            else if(_APP.gameLoop.loopType == "to") { _APP.gameLoop.raf_id = setTimeout(                   (  )=>{ _APP.gameLoop.loop( performance.now() ); }, 0 ); }
            else{ console.error("Invalid loopType:", _APP.gameLoop.loopType); }
        },
        endOfLoopTasks: function(){
            // Request the next frame.
            this.loop_schedule_nextRun();
        },
        loop: async function loop(timestamp){
            // Is the loop active?
            if(this.running){
                // Calculate the time difference between the thisLoopStart and the last loop run. 
                this.thisLoopStart = timestamp;
                this.delta = timestamp - this.lastLoopRun;
                this.frameCounter += 1;

                // Is it time to run the next loop?
                
                if( (this.delta >= this.msFrame) ){
                    // Update this.lastLoopRun with this timestamp.
                    this.lastLoopRun = this.thisLoopStart - (this.delta % this.msFrame);
    
                    // Track performance.
                    this.fpsCalc.tick(this.thisLoopStart - (this.delta % this.msFrame));
                    this.frameCounter += 1;

                    // NETWORK
                    //

                    // INPUT
                    _INPUT.util.getStatesForPlayers();

                    if(typeof _INPUT.customized.updateLiveGamepadDisplay != "undefined"){
                        _INPUT.customized.updateLiveGamepadDisplay();
                    }

                    // DEBUG
                    // if(_INPUT.util.checkButton("p1", ["release"], [] )){
                    //     // let state = _INPUT.util.stateByteToObj(_INPUT.states["p1"].press);
                    //     // console.log("state: ", Object.keys(state).filter(key => state[key]));

                    //     // let state2 = _INPUT.util.stateByteToObj2("p1", false);
                    //     let state2 = _INPUT.util.stateByteToObj2("p1", true);
                    //     console.log("state2: ", state2);
                    // }

                    // LOGIC
                    // await _APP.gamestates[_APP.gamestate.gs1].main();
                    _APP.gamestates[_APP.gamestate.gs1].main();
                    
                    // DRAW
                    if(_APP.gamestates[_APP.gamestate.gs1].render){ _APP.gamestates[_APP.gamestate.gs1].render(); };

                    // Send a draw request if there are changes for any layer.
                    if(
                        (
                            _GFX.currentData["BG1"].changes ||
                            _GFX.currentData["BG2"].changes ||
                            _GFX.currentData["SP1"].changes ||
                            _GFX.currentData["TX1"].changes
                        )
                    ){
                        // Synchronize the gameLoop with the rendering.
                        if(_APP.configObj.waitUntilFrameDrawn){ await _GFX.funcs.sendGfxUpdates(true);  }
                        
                        // Send the graphics updates without waiting. (This could be a problem where there are many graphics updates.)
                        else                                  {       _GFX.funcs.sendGfxUpdates(false); }

                        this.frameDrawCounter += 1;
                    }

                    // DEBUG
                    // console.log(this.frameCounter, _APP.gameLoop.loopType, this.fpsCalc.average.toFixed(2), this.fpsCalc.avgMsPerFrame.toFixed(2));
                }

                // End the loop and run any end of loop tasks.
                this.endOfLoopTasks();
            }
            // No. 
            else{
                // console.log("gameLoop is not running.");
            }
        },
        DEMOloop: async function loop(timestamp){
            // Is the loop running?
                // YES
                // Calculate the time difference between the thisLoopStart and the last loop run. 
                // Is it time to run the next loop?
                    // YES
                    // Update this.lastLoopRun with this timestamp.
                    // Handle change of gamestate.
                    // Get the input states.
                    // Handle game logic.
                    // Send the draw requests.
                    // Run end of loop tasks.

                    // NO
                    // Run end of loop tasks.

                    // if(_APP.debugActive){ _DEBUG.endOfLoop(); }

            // NO The loop is not running.
            if( this.running ){
                // Calculate the time difference between the thisLoopStart and the last loop run. 
                this.thisLoopStart = timestamp;
                this.delta = timestamp - this.lastLoopRun;
                
                // Is it time to run the next loop?
                if( (this.delta >= this.msFrame) ){
                    // Update this.lastLoopRun with this timestamp.
                    this.lastLoopRun = this.thisLoopStart - (this.delta % this.msFrame);
    
                    // Track performance.
                    this.fpsCalc.tick(this.thisLoopStart - (this.delta % this.msFrame));
                    this.frameCounter += 1;
    
                    // Network tasks.
                    // Should this client skip the next frame to catch up to the other client?
    
                    // HANDLE GAMESTATE CHANGES.
                    // if(_APP.game.gamestate1ChangeTriggered){ _APP.game._changeGamestate1(); }
                    // if(_APP.game.gamestate2ChangeTriggered){ _APP.game._changeGamestate2(); }
    
                    // FADE
                    
                    // Function processFading will determine when the fade level needs to change.
                    // If processFading returns true then the LOGIC and INPUT should be skipped.
                    // this.fadeIsBlocking = await _GFX.fade.processFading();
                    // if( this.fadeIsBlocking ){
                        
                    //     // Count this as a draw frame if fade frame will be drawn.
                    //     if(_GFX.fade.framesSinceLastFadeChange == _GFX.fade.framesBetweenFadeChanges){ this.frameDrawCounter += 1; }
    
                    //     // Draw (the fade level.)
                    //     await _GFX.VRAM.draw(); 
                        
                    //     // Run the end of loop tasks and schedule the next loop. 
                    //     this.endOfLoopTasks();
                    //     return;
                    // }
                    // else{
                    // }
    
                    // INPUT
                    // await _INPUT.util.getStatesForPlayers();
                    //
    
                    // Network tasks.
                    // Should p1 or p2 input be replaced by data from the other client?
                    
                    // LOGIC
                    // await _APP.game.gamestates[_APP.game.gamestate1].main();
    
                    // DRAW
                    
                    // Count this as a draw frame if there are changes. 
                    // if(_GFX.VRAM.changesStats.new){ this.frameDrawCounter += 1; }
    
                    // TODO
                    // "Sprite draw" to update VRAM before it gets drawn?
    
                    // Draw.
                    // await _GFX.VRAM.draw(); 
    
                    // Run the end of loop tasks and schedule the next loop. 
                    // this.endOfLoopTasks();
                }
    
                // No.
                else{
                    // Run the end of loop tasks and schedule the next loop. 
                    // this.endOfLoopTasks();
                    return;
                }
            }
            
            // No. Nothing to do until this.running is true again.
            else{
                //
                console.log("gameLoop is not running.");
            }


        },
        init: async function(){
            // Calculate the ms required per frame.
            this.msFrame = 1000 / this.fps;

            // Init the fps object.
            this.fpsCalc.init(this.fps);

            // Get initial input states.
            await _INPUT.util.getStatesForPlayers();
        },
    },
};

_APP.utility = {
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
};

// For loading customized wrappers for plug-ins.
_APP.loader = {
    loadPlugins : async function(){
        return new Promise(async (resolve,reject)=>{
            // WEB WORKER PLUGIN.
            await new Promise( async (res,rej) => { await _APP.utility.addFile({f:"js/webv.js", t:"js"  }, "."); res(); } );
            
            // GRAPHICS PLUGIN.
            await new Promise( async (res,rej) => { await _APP.utility.addFile({f:"js/gfx.js"       , t:"js"  }, "."); res(); } );
            await new Promise( async (res,rej) => { await _APP.utility.addFile({f:"js/gfxClasses.js", t:"js"  }, "."); res(); } );
            
            // INPUT PLUGIN.
            // _INPUT core and customizations.
            if(!_APP.usingJSGAME_INPUT){
                await new Promise( async (res,rej) => { await _APP.utility.addFile({f:"js/INPUT_A/inputModeA_core.js", t:"js"  }, "."); res(); } );
            }
            else{
                await new Promise( async (res,rej) => { await _APP.utility.addFile({f:"shared/plugins/INPUT_A/inputModeA_core.js", t:"js"  }, "."); res(); } );
            }
            await new Promise( async (res,rej) => { await _APP.utility.addFile({f:"js/inputModeA_customized.js"  , t:"js"  }, "."); res(); } );

            // DEBUG PLUGIN.
            if(_APP.debugActive){
                await new Promise( async (res,rej) => { await _APP.utility.addFile({f:"js/debug.js" , t:"js"    }, "."); res(); } );
            }

            resolve();
        });
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
        if(typeof _INPUT != undefined){
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
            else{
                console.log(
                    `NAVBAR1: NOT FOUND:`+ 
                    `\n  tab : ${this.DOM[key].tab }` +
                    `\n  view: ${this.DOM[key].view}` +
                    ``
                );
            }
        }

        //
        this.DOM2.aux = document.getElementById(this.DOM2.aux);
    },
};

_APP.init = async function(){
    return new Promise(async (resolve,reject)=>{
        // Has this application been loaded through JSGAME? If so then set the usingJSGAME flag.
        _APP.usingJSGAME       = typeof _JSG !== "undefined";
        _APP.usingJSGAME_INPUT = typeof _INPUT !== "undefined";
        // if(!_APP.usingJSGAME){}

        // Load plugins.
        let ts_loadPlugins = performance.now(); 
        await _APP.loader.loadPlugins();
        ts_loadPlugins = performance.now() - ts_loadPlugins;
        
        // Init the WebWorker.
        let ts_WEBW_V = performance.now(); 
        await _WEBW_V.init();
        ts_WEBW_V = performance.now() - ts_WEBW_V;
        
        // Init the graphics.
        let ts_GFX = performance.now(); 
        await _GFX.init();
        ts_GFX = performance.now() - ts_GFX;
        
        // Use the customized init for _INPUT.
        let ts_INPUT = performance.now(); 
        let config = {
            "useKeyboard"   : true, 
            "useGamepads"   : true,
            "listeningElems": ["output"],
            "webElem"       : "controls_navBar1_view_input",
        };
        await _INPUT.customized.init(config);
        ts_INPUT = performance.now() - ts_INPUT;

        // Init debug if _DEBUG is set.
        if(_APP.debugActive && _DEBUG && _DEBUG.init){ await _DEBUG.init(); }

        let ts_navBar1 = performance.now(); 
        _APP.navBar1.init();
        ts_navBar1 = performance.now() - ts_navBar1;
        _APP.navBar1.showOne("view_controls");
        // _APP.navBar1.showOne("view_input");
        // _APP.navBar1.showOne("view_debug");

        // Setup the output scaling controls. 
        const initOutputScaleControls = function(){
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
        initOutputScaleControls();

        // Populate the gamestates list.
        _APP.gamestates_list = Object.keys(_APP.gamestates);

        // Init the game loop.
        _APP.gameLoop.init();

        // TODO
        // Start the game loop.
        this.gameLoop.loop_start();

        resolve();
    });
};

(
    function(){
        let handler = async () => {
            // Remove this listener.
            window.removeEventListener('load', handler);

            // Init and start the application.
            await _APP.init();
        };
        window.addEventListener('load', handler);
    }
)();