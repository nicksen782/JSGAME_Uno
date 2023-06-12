// @ts-nocheck

var _DEBUG = {
    // Displays a canvas on top of all canvases with a grid drawn to it.
    gridCanvas: {
        canvas:null,
        ctx:null,
        init: function(){
            // Copy the dimensions of the first canvas. 
            const canvas_src = document.querySelector(".canvasLayer");

            // Create a canvas for this layer.
            this.canvas = document.createElement("canvas");
            this.canvas.width  = canvas_src.width;
            this.canvas.height = canvas_src.height;
            this.canvas.id = "debug_grid_canvas";
            this.canvas.style["z-index"] = "300";
            this.ctx = this.canvas.getContext('2d');
        
            // Add the class.
            this.canvas.classList.add("canvasLayer");
            this.canvas.classList.add("displayNone");

            // Draw a grid pattern.
            const gridSize = 8;
            const offset = 0.5;
            this.ctx.lineWidth = 1;
            for (let x = 0; x <= this.canvas.width; x += gridSize) {
                this.ctx.moveTo(x + offset, 0);
                this.ctx.lineTo(x + offset, this.canvas.height);
            }
            for (let y = 0; y <= this.canvas.height; y += gridSize) {
                this.ctx.moveTo(0, y + offset);
                this.ctx.lineTo(this.canvas.width, y + offset);
            }
            this.ctx.strokeStyle = 'rgba(128,128,128, 1)';
            this.ctx.stroke();
        
            // Add a marker to every 5th square.
            this.ctx.fillStyle = 'rgba(128,128,128,1)';
            for (let x = 0; x <= this.canvas.width; x += gridSize * 5) {
                for (let y = 0; y <= this.canvas.height; y += gridSize * 5) {
                    this.ctx.fillRect(
                        x + 3, 
                        y + 3, 
                        gridSize-5, 
                        gridSize-5
                    );
                }
            }
        
            // Add the new canvas to the output div.
            let outputDiv = document.getElementById("output");
            outputDiv.append(this.canvas);
        },
    },
    // Control of the toggle buttons: loop, logic, await draw, debug, hashcache, grid.
    toggleButtons1: {
        DOM: {
            gridCanvasButton : null,
            toggleGameLoop   : null,
            toggleLogic      : null,
            awaitDraw        : null,
            debugButton      : null,
            debug2Button      : null,
            toggleCacheButton: null,
        },
        setCurrentStates: function(){
            let checks = [
                { check: !_DEBUG.gridCanvas.canvas.classList.contains("displayNone"), elem: this.DOM["gridCanvasButton"] },
                { check:  _APP.game.gameLoop.running,                                     elem: this.DOM["toggleGameLoop"] },
                { check: !_APP.game.gameLoop.skipLogic,                                   elem: this.DOM["toggleLogic"] },
                { check:  _APP.configObj.awaitDraw,                                       elem: this.DOM["awaitDraw"] },
                { check:  _APP.debugActive,                                               elem: this.DOM["debugButton"] },
                { check:  _APP.debug2Active,                                              elem: this.DOM["debug2Button"] },
                { check: !_APP.configObj.disableCache,                                    elem: this.DOM["toggleCacheButton"] },
            ];
            let classes = [
                "debug_bgColor_on",
                "debug_bgColor_off",
            ];

            for(let rec of checks){
                // If the check is true (meaning that the setting is on...
                if(rec.check){
                    rec.elem.classList.remove(...classes);
                    rec.elem.classList.add("debug_bgColor_on");
                    rec.elem.innerText = "ON";
                }
                // The the setting is off...
                else{
                    rec.elem.classList.remove(...classes);
                    rec.elem.classList.add("debug_bgColor_off");
                    rec.elem.innerText = "OFF";
                }
            }
        },
        init: function(){
            // Save DOM.
            this.DOM.gridCanvasButton  = document.getElementById("debug_test_toggleGridCanvas");
            this.DOM.toggleGameLoop    = document.getElementById("debug_test_toggleGameLoop");
            this.DOM.toggleLogic       = document.getElementById("debug_test_toggleLogic");
            this.DOM.awaitDraw         = document.getElementById("debug_test_toggleDrawAsync");
            this.DOM.debugButton       = document.getElementById("debug_toggleDebugFlag");
            this.DOM.debug2Button      = document.getElementById("debug_toggleDebug2Flag");
            this.DOM.toggleCacheButton = document.getElementById("debug_toggleCacheFlag");
            
            // Add toggle logic/event listeners.

            // SHOW GRID
            this.DOM.gridCanvasButton.addEventListener("click", ()=>{
                let home = _DEBUG.gridCanvas;
                home.canvas.classList.toggle("displayNone");
                if(home.canvas.classList.contains("displayNone")){
                    this.DOM.gridCanvasButton.innerText = "OFF";
                    this.DOM.gridCanvasButton.classList.remove("debug_bgColor_on");
                    this.DOM.gridCanvasButton.classList.add("debug_bgColor_off");
                }
                else{
                    this.DOM.gridCanvasButton.classList.add("debug_bgColor_on");
                    this.DOM.gridCanvasButton.classList.remove("debug_bgColor_off");
                    this.DOM.gridCanvasButton.innerText = "ON ";
                }
            }, false);

            // GAMELOOP
            this.DOM.toggleGameLoop .addEventListener("click", ()=>{ 
                if(_APP.game.gameLoop.running){
                    this.DOM.toggleGameLoop.classList.remove("debug_bgColor_on");
                    this.DOM.toggleGameLoop.classList.add("debug_bgColor_off");
                    this.DOM.toggleGameLoop.innerText = "OFF";
                    _APP.game.gameLoop.loop_stop(); 
                } 
                else {
                    this.DOM.toggleGameLoop.classList.remove("debug_bgColor_off");
                    this.DOM.toggleGameLoop.classList.add("debug_bgColor_on");
                    this.DOM.toggleGameLoop.innerText = "ON";
                    _APP.game.gameLoop.loop_start(); 
                } 
            }, false);

            // LOGIC
            this.DOM.toggleLogic.addEventListener("click", ()=>{
                _APP.game.gameLoop.skipLogic = !_APP.game.gameLoop.skipLogic;
                if(_APP.game.gameLoop.skipLogic){
                    this.DOM.toggleLogic.classList.remove("debug_bgColor_on");
                    this.DOM.toggleLogic.classList.add("debug_bgColor_off");
                    this.DOM.toggleLogic.innerText = "OFF";
                } 
                else {
                    this.DOM.toggleLogic.classList.remove("debug_bgColor_off");
                    this.DOM.toggleLogic.classList.add("debug_bgColor_on");
                    this.DOM.toggleLogic.innerText = "ON";
                } 
            }, false);

            // AWAIT DRAW
            this.DOM.awaitDraw.addEventListener("click", ()=>{ 
                _APP.configObj.awaitDraw = !_APP.configObj.awaitDraw;
                if(_APP.configObj.awaitDraw){
                    this.DOM.awaitDraw.classList.remove("debug_bgColor_off");
                    this.DOM.awaitDraw.classList.add("debug_bgColor_on");
                    this.DOM.awaitDraw.innerText = "ON";
                } 
                else {
                    this.DOM.awaitDraw.classList.remove("debug_bgColor_on");
                    this.DOM.awaitDraw.classList.add("debug_bgColor_off");
                    this.DOM.awaitDraw.innerText = "OFF";
                } 
            }, false);

            // DEBUG
            let debug_inToggle = false;
            this.DOM.debugButton.addEventListener("click", ()=>{ 
                // Do not allow further toggles until this flag is false again.
                if(debug_inToggle){ 
                    // console.log("ALREADY IN DEBUG TOGGLE");
                    return; 
                }

                // Set the toggle flag to true. 
                debug_inToggle = true;

                // Save the current running state for the gameloop and then pause the gameloop.
                let wasRunning = _APP.game.gameLoop.running;
                _APP.game.gameLoop.loop_stop(); 

                // Wait before completing the task.
                setTimeout(async ()=>{
                    // Toggle the setting locally.
                    _APP.debugActive = !_APP.debugActive;
                    
                    // Adjust the display of the toggle button.
                    if(_APP.debugActive){
                        this.DOM.debugButton.classList.remove("debug_bgColor_off");
                        this.DOM.debugButton.classList.add("debug_bgColor_on");
                        this.DOM.debugButton.innerText = "ON";
                    } 
                    else {
                        this.DOM.debugButton.classList.remove("debug_bgColor_on");
                        this.DOM.debugButton.classList.add("debug_bgColor_off");
                        this.DOM.debugButton.innerText = "OFF";
                    } 

                    // Request and await the result.
                    await _WEBW_V.SEND("_DEBUG.toggleDebugFlag", { 
                        data: { debugActive: _APP.debugActive }, 
                        refs:[]
                    }, true, false);

                    // Start the gameloop after a delay.
                    if(wasRunning){
                        setTimeout(()=>{
                            // Start the loop.
                            _APP.game.gameLoop.loop_start(); 

                            // Clear the toggle flag.
                            debug_inToggle = false;
                        }, 1 * _APP.game.gameLoop.msFrame);
                    }

                    // Just clear the toggle flag.
                    else{
                        // Clear the toggle flag.
                        debug_inToggle = false;
                    }
                }, 4 * _APP.game.gameLoop.msFrame);
            }, false);

            // DEBUG2
            let debug2_inToggle = false;
            this.DOM.debug2Button.addEventListener("click", ()=>{ 
                // Do not allow further toggles until this flag is false again.
                if(debug2_inToggle){ 
                    // console.log("ALREADY IN DEBUG TOGGLE");
                    return; 
                }

                // Set the toggle flag to true. 
                debug2_inToggle = true;

                // Toggle the setting locally.
                _APP.debug2Active = !_APP.debug2Active;
                
                // Adjust the display of the toggle button.
                if(_APP.debug2Active){
                    this.DOM.debug2Button.classList.remove("debug_bgColor_off");
                    this.DOM.debug2Button.classList.add("debug_bgColor_on");
                    this.DOM.debug2Button.innerText = "ON";
                } 
                else {
                    this.DOM.debug2Button.classList.remove("debug_bgColor_on");
                    this.DOM.debug2Button.classList.add("debug_bgColor_off");
                    this.DOM.debug2Button.innerText = "OFF";
                } 

                // Clear the toggle flag.
                debug2_inToggle = false;
            }, false);

            // HASH CACHE
            let hashCache_inToggle = false;
            this.DOM.toggleCacheButton.addEventListener("click", async ()=>{ 
                // Do not allow further toggles until this flag is false again.
                if(hashCache_inToggle){ 
                    // console.log("ALREADY IN HASHCACHE TOGGLE");
                    return; 
                }

                // Set the toggle flag to true. 
                hashCache_inToggle = true;

                // Save the current running state for the gameloop and then pause the gameloop.
                let wasRunning = _APP.game.gameLoop.running;
                _APP.game.gameLoop.loop_stop(); 

                // Wait before completing the task.
                setTimeout(async ()=>{
                    // Toggle the setting locally.
                    _APP.configObj.disableCache = !_APP.configObj.disableCache;

                    // Adjust the display of the toggle button.
                    if(_APP.configObj.disableCache){
                        this.DOM.toggleCacheButton.classList.remove("debug_bgColor_on");
                        this.DOM.toggleCacheButton.classList.add("debug_bgColor_off");
                        this.DOM.toggleCacheButton.innerText = "OFF";
                    } 
                    else {
                        this.DOM.toggleCacheButton.classList.remove("debug_bgColor_off");
                        this.DOM.toggleCacheButton.classList.add("debug_bgColor_on");
                        this.DOM.toggleCacheButton.innerText = "ON";
                    }

                    // Request and await the result.
                    await _WEBW_V.SEND("_DEBUG.toggleCacheFlag", { 
                        data: { disableCache: _APP.configObj.disableCache }, 
                        refs:[]
                    }, true, false);

                    // Start the gameloop after a delay.
                    if(wasRunning){
                        setTimeout(()=>{
                            // Start the loop.
                            _APP.game.gameLoop.loop_start(); 

                            // Clear the toggle flag.
                            hashCache_inToggle = false;
                        }, 1 * _APP.game.gameLoop.msFrame);
                    }
                    // Just clear the toggle flag.
                    else{
                        // Clear the toggle flag.
                        hashCache_inToggle = false;
                    }
                }, 4 * _APP.game.gameLoop.msFrame);

            }, false);

            // Set initial toggle button states.
            this.setCurrentStates();
        },
    },
    // Color finder: hover to see the tile and the RGBA colors for each pixel of that tile.
    colorFinder:{
        DOM: {
            "canvas_src_L1": null,
            "canvas_src_L2": null,
            "canvas_src_L3": null,
            "canvas_src_L4": null,
            "copyCanvas": null,
            "zoomCanvas": null,
            "pixelRGBA": null,
            "debug_test_copyLayer_L1": null,
            "debug_test_copyLayer_L2": null,
            "debug_test_copyLayer_L3": null,
            "debug_test_copyLayer_L4": null,
            "debug_test_copyLayer_ALL": null,
        },
        replaceCopyCanvas: function(canvas_src, copyCanvasCtx){
            copyCanvasCtx.clearRect(0, 0, copyCanvasCtx.canvas.width, copyCanvasCtx.canvas.height);
            copyCanvasCtx.drawImage(canvas_src, 0, 0);
        },
        copyAll : function(copyCanvasCtx){
            copyCanvasCtx.clearRect(0, 0, copyCanvasCtx.canvas.width, copyCanvasCtx.canvas.height);
            copyCanvasCtx.drawImage(this.DOM.canvas_src_L1, 0, 0);
            copyCanvasCtx.drawImage(this.DOM.canvas_src_L2, 0, 0);
            copyCanvasCtx.drawImage(this.DOM.canvas_src_L3, 0, 0);
            copyCanvasCtx.drawImage(this.DOM.canvas_src_L4, 0, 0);
        },
        hover1: function(event, copyCanvasCtx, zoomCanvasCtx){
            let last_regionX;
            let last_regionY;
            const regionWidth  = 8;
            const regionHeight = 8;

            const rect = this.DOM.copyCanvas.getBoundingClientRect();
            const scaleX = this.DOM.copyCanvas.width / rect.width;
            const scaleY = this.DOM.copyCanvas.height / rect.height;
    
            // Calculate the scaled mouse position.
            const mouseX = (event.clientX - rect.left) * scaleX;
            const mouseY = (event.clientY - rect.top) * scaleY;
    
            // Calculate the 8x8px region under the mouse cursor
            const regionX = Math.floor(mouseX / regionWidth) * regionWidth;
            const regionY = Math.floor(mouseY / regionHeight) * regionHeight;
            
            // Determine if we should continue.
            if( last_regionX == regionX && last_regionY == regionY ) { return; }
            last_regionX = regionX; 
            last_regionY = regionY;
    
            // Extract the ImageData of the region from the main canvas
            const regionImageData = copyCanvasCtx.getImageData(regionX, regionY, regionWidth, regionHeight);
    
            // Clear the zoom canvas
            zoomCanvasCtx.clearRect(0, 0, this.DOM.zoomCanvas.width, this.DOM.zoomCanvas.height);
            
            // Draw the extracted ImageData on the zoom canvas
            zoomCanvasCtx.putImageData(regionImageData, 0, 0);
    
            // Display pixel values rgba as hex.
            let text = "R0: ";
            let rowNum = 0;
            for(let i=0; i<regionImageData.data.length; i+=4){
                if(i%(8*4)==0 && i!=0){ rowNum+=1; text += `\nR${rowNum}: `; }
                let r = regionImageData.data[i+0];
                let g = regionImageData.data[i+1];
                let b = regionImageData.data[i+2];
                let a = regionImageData.data[i+3];
                text += `` +
                `[` +
                    `${r.toString().padStart(3, " ").toUpperCase()},` +
                    `${g.toString().padStart(3, " ").toUpperCase()},` +
                    `${b.toString().padStart(3, " ").toUpperCase()},` +
                    `${a.toString().padStart(3, " ").toUpperCase()}` +
                `] ` ;
            }
            this.DOM.pixelRGBA.innerText = text;
        },
        init: function(){
            // Save DOM.
            this.DOM.canvas_src_L1 = document.querySelector(".canvasLayer[name='L1']");
            this.DOM.canvas_src_L2 = document.querySelector(".canvasLayer[name='L2']");
            this.DOM.canvas_src_L3 = document.querySelector(".canvasLayer[name='L3']");
            this.DOM.canvas_src_L4 = document.querySelector(".canvasLayer[name='L4']");
            this.DOM.copyCanvas    = document.getElementById("debug_colorFinder_src");
            this.DOM.zoomCanvas = document.getElementById("debug_colorFinder_zoom");
            this.DOM.pixelRGBA  = document.getElementById("debug_colorFinder_pixelRGBA");
            this.DOM.debug_test_copyLayer_L1  = document.getElementById("debug_test_copyLayer_L1");
            this.DOM.debug_test_copyLayer_L2  = document.getElementById("debug_test_copyLayer_L2");
            this.DOM.debug_test_copyLayer_L3  = document.getElementById("debug_test_copyLayer_L3");
            this.DOM.debug_test_copyLayer_L4  = document.getElementById("debug_test_copyLayer_L4");
            this.DOM.debug_test_copyLayer_ALL = document.getElementById("debug_test_copyLayer_ALL");

            this.DOM.copyCanvas.width  = this.DOM.canvas_src_L1.width;
            this.DOM.copyCanvas.height = this.DOM.canvas_src_L1.height;
            let copyCanvasCtx = this.DOM.copyCanvas.getContext("2d", { willReadFrequently: true } );
            let zoomCanvasCtx = this.DOM.zoomCanvas.getContext("2d");

            // Event listeners.

            // Copy buttons:
            this.DOM.debug_test_copyLayer_L1 .addEventListener("click", ()=>this.replaceCopyCanvas(this.DOM.canvas_src_L1, copyCanvasCtx), false);
            this.DOM.debug_test_copyLayer_L2 .addEventListener("click", ()=>this.replaceCopyCanvas(this.DOM.canvas_src_L2, copyCanvasCtx), false);
            this.DOM.debug_test_copyLayer_L3 .addEventListener("click", ()=>this.replaceCopyCanvas(this.DOM.canvas_src_L3, copyCanvasCtx), false);
            this.DOM.debug_test_copyLayer_L4 .addEventListener("click", ()=>this.replaceCopyCanvas(this.DOM.canvas_src_L4, copyCanvasCtx), false);
            this.DOM.debug_test_copyLayer_ALL.addEventListener("click", ()=>this.copyAll(copyCanvasCtx), false);

            // Mouse move hover.
            this.DOM.copyCanvas.addEventListener('mousemove', (event) => this.hover1(event, copyCanvasCtx, zoomCanvasCtx), false);
        },
    },
    // Allows for changing the global fade via slider bar.
    fade: {
        DOM: {
            "fadeSliderALL"    : null,
            "fadeSliderL1"     : null,
            "fadeSliderL2"     : null,
            "fadeSliderL3"     : null,
            "fadeSliderL4"     : null,
            "fadeSliderALLText": null,
            "fadeSliderL1Text" : null,
            "fadeSliderL2Text" : null,
            "fadeSliderL3Text" : null,
            "fadeSliderL4Text" : null,
        },
        changeFade: function(layer, sliderElem, sliderTextElem) {
            let level;
            level = parseFloat(sliderElem.value);
            let level_text;
            
            // FADE: OFF
            if(level==0) { 
                _GFX.funcs.setFade(layer, null);
                level_text = "OFF"
            }
            // FADE: CLEAR
            else if(level==-1){ 
                _GFX.funcs.setFade(layer, 11);
                level_text = "CLEAR"; 
            }
            // FADE: BLACK
            else if(level==11){ 
                _GFX.funcs.setFade(layer, 10);
                level_text = "BLACK";
            }
            // FADE: LEVEL
            else{ 
                _GFX.funcs.setFade(layer, level-1); 
                level_text = `L:${(level-1).toString()}`;
            }

            // Update the hover title.
            sliderElem.title = `${layer}: ${level_text}`;
            
            // Update the slider text to match the title.
            sliderTextElem.innerText = sliderElem.title;
        },
        init: function(){
            // Save DOM.
            this.DOM.fadeSliderALL     = document.getElementById("fadeSliderALL");
            this.DOM.fadeSliderL1      = document.getElementById("fadeSliderL1");
            this.DOM.fadeSliderL2      = document.getElementById("fadeSliderL2");
            this.DOM.fadeSliderL3      = document.getElementById("fadeSliderL3");
            this.DOM.fadeSliderL4      = document.getElementById("fadeSliderL4");
            this.DOM.fadeSliderALLText = document.getElementById("fadeSliderALLText");
            this.DOM.fadeSliderL1Text  = document.getElementById("fadeSliderL1Text");
            this.DOM.fadeSliderL2Text  = document.getElementById("fadeSliderL2Text");
            this.DOM.fadeSliderL3Text  = document.getElementById("fadeSliderL3Text");
            this.DOM.fadeSliderL4Text  = document.getElementById("fadeSliderL4Text");

            // Set the default values. (Set to the OFF value.)
            this.DOM.fadeSliderALL.value = 0;
            this.DOM.fadeSliderL1.value  = 0;
            this.DOM.fadeSliderL2.value  = 0;
            this.DOM.fadeSliderL3.value  = 0;
            this.DOM.fadeSliderL4.value  = 0;

            // Make sure those values are displayed properly on the slider and slider text.
            this.changeFade("ALL", this.DOM.fadeSliderALL, this.DOM.fadeSliderALLText);
            this.changeFade("L1" , this.DOM.fadeSliderL1 , this.DOM.fadeSliderL1Text);
            this.changeFade("L2" , this.DOM.fadeSliderL2 , this.DOM.fadeSliderL2Text);
            this.changeFade("L3" , this.DOM.fadeSliderL3 , this.DOM.fadeSliderL3Text);
            this.changeFade("L4" , this.DOM.fadeSliderL4 , this.DOM.fadeSliderL4Text);

            // Event listeners.
            this.DOM.fadeSliderALL.addEventListener("input", ()=>this.changeFade("ALL", this.DOM.fadeSliderALL, this.DOM.fadeSliderALLText), false);
            this.DOM.fadeSliderL1 .addEventListener("input", ()=>this.changeFade("L1" , this.DOM.fadeSliderL1 , this.DOM.fadeSliderL1Text ), false);
            this.DOM.fadeSliderL2 .addEventListener("input", ()=>this.changeFade("L2" , this.DOM.fadeSliderL2 , this.DOM.fadeSliderL2Text ), false);
            this.DOM.fadeSliderL3 .addEventListener("input", ()=>this.changeFade("L3" , this.DOM.fadeSliderL3 , this.DOM.fadeSliderL3Text ), false);
            this.DOM.fadeSliderL4 .addEventListener("input", ()=>this.changeFade("L4" , this.DOM.fadeSliderL4 , this.DOM.fadeSliderL4Text ), false);
        },
    },
    // Allows the changing of gamestate 1.
    gamestateChanger: {
        DOM: {
            "debug_changeGs1Select": null,
            "debug_changeGs1Button": null,
            "debug_test_restartGS1": null,
        },
        init: function(){
            // Save DOM.
            this.DOM.changeGs1Select = document.getElementById("debug_changeGs1Select");
            this.DOM.changeGs1Button = document.getElementById("debug_changeGs1Button");
            this.DOM.restartGS1      = document.getElementById("debug_test_restartGS1");

            this.DOM.changeGs1Select.addEventListener("change", ()=>{ 
                let value = this.DOM.changeGs1Select.value;
                _APP.game.changeGs1(value);
                _APP.game._changeGs1(value);
            }, false);

            this.DOM.changeGs1Button.addEventListener("click" , ()=>{ 
                let value = this.DOM.changeGs1Select.value;
                _APP.game.changeGs1(value);
                _APP.game._changeGs1(value);
            }, false);

            this.DOM.restartGS1.addEventListener("click", ()=>{ 
                _APP.game.gameLoop.loop_stop(); 
                _APP.game.gamestates[_APP.game.gs1].inited = false;
                _APP.game.gameLoop.loop_start(); 
            }, false);
        },
    },
    // Shows the current gamestates.
    showGamestate: {
        DOM: {
        },
        init: function(){
            this.DOM.changeGs1Select = document.getElementById("debug_changeGs1Select");
            this.DOM.GS1Text         = document.getElementById("debug_GS1Text");
            this.DOM.GS2Text         = document.getElementById("debug_GS2Text");
        },
        display: function(){
            _DEBUG.updateIfChanged2(this.DOM.GS1Text, "_DEBUG.vault.gamestate.gs1", _APP.game.gs1 );
            _DEBUG.updateIfChanged2(this.DOM.GS2Text, "_DEBUG.vault.gamestate.gs2", _APP.game.gs2 );

            if(this.DOM.changeGs1Select.value != _APP.game.gs1){
                this.DOM.changeGs1Select.value = _APP.game.gs1;
            }
        },
    },
    // Shows the hashCache data.
    hashCache : {
        DOM: {
            // "fadeSliderALL"    : null,
            // Entries
            // Total Size
            // genTime
            // output (use something nicer like divs.)

            // Top portion elements.
            totalSize_all       : null,
            totalSize_perm      : null,
            totalSize_temp      : null,
            totalSum            : null,
            totalSumPerm        : null,
            totalSumTemp        : null,
            totalSum_genTimeAll : null,
            totalSum_genTimePerm: null,
            totalSum_genTimeTemp: null,
            ALL_base_size : null,
            ALL_copy_size : null,
            PERM_base_size: null,
            PERM_copy_size: null,
            TEMP_base_size: null,
            TEMP_copy_size: null,

            // Bottom portion elements.
            hashCacheList1: null,
        },
        // Values that were used the last time and are currently displayed.
        values: {
            lastNormalrun: 0,
            lastNormalrunWait: 1000,
            lastForcedrun: 0,
            lastForcedrunWait: 1000,

            totalSize_all           : 0,
            totalSize_temp          : 0,
            totalSize_perm          : 0,
            totalSum                : 0,
            totalSumTemp            : 0,
            totalSumPerm            : 0,
            totalSum_genTimeAll     : 0,
            totalSum_genTimeTemp    : 0,
            totalSum_genTimePerm    : 0,
            ALL_base_size : 0,
            ALL_copy_size : 0,
            PERM_base_size: 0,
            PERM_copy_size: 0,
            TEMP_base_size: 0,
            TEMP_copy_size: 0,

            last_hashCacheStats2: {
                ALL : { base: new Set(), copy: new Set(), baseHash: null, copyHash: null },
                PERM: { base: new Set(), baseHash: null },
                TEMP: { base: new Set(), baseHash: null },
            },
        },
        // Requests that the WebWorker send the requested data to the console.
        toConsole: function(title, hash, hashBase){
            _WEBW_V.SEND('requestHashCacheEntry', { 
                data:{ 
                    title   : title, 
                    hash    : hash, 
                    hashBase: hashBase
                }, 
                refs:[] }, false, false
            );
        },
        getFormattedDateTime: function() {
            const date = new Date();
            const year = date.getFullYear();
        
            let month = date.getMonth() + 1;
            month = (month < 10 ? "0" : "") + month;
        
            let day = date.getDate();
            day = (day < 10 ? "0" : "") + day;
        
            let hour = date.getHours();
            let ampm = hour >= 12 ? 'pm' : 'am';
            hour = hour % 12;
            hour = hour ? hour : 12; // the hour '0' should be '12'
            hour = (hour < 10 ? "0" : "") + hour;
        
            let min = date.getMinutes();
            min = (min < 10 ? "0" : "") + min;
        
            let sec = date.getSeconds();
            sec = (sec < 10 ? "0" : "") + sec;
        
            return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec + " " + ampm;
        },
        getSettingsDifferences: function(obj1, obj2) {
            let differences = {};

            // Check obj1 keys
            for (let key in obj1) {
                if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
                    if (obj1[key].length !== obj2[key].length) {
                        // differences[key] = obj1[key].length;
                        differences[key] = true;
                    }
                } else if (obj2[key] === undefined || obj1[key] !== obj2[key]) {
                    differences[key] = obj1[key];
                }
            }

            // Check obj2 keys
            for (let key in obj2) {
                if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
                    if (obj1[key].length !== obj2[key].length) {
                        // differences[key] = obj2[key].length;
                        differences[key] = true;
                    }
                } else if (obj1[key] === undefined || obj1[key] !== obj2[key]) {
                    differences[key] = obj2[key];
                }
            }

            return differences;
        },
        display:function(data, forced=false){
            // If the hashCache is disabled then whatever data received may be incorrect. Skip.
            if(_APP.configObj.disableCache){ 
                // console.log(`hashCache.display: HASHCACHE IS DISABLED. _APP.configObj.disableCache: ${_APP.configObj.disableCache}`);
                return; 
            }

            // Do not update if the tab is not active.
            let tab = _DEBUG.navBar1.DOM.view_hashCacheStats1.tab;
            if(!tab.classList.contains("active")){ 
                // console.log("tab not active"); 
                return false; 
            }

            // Run the updates.
            let updated1 = _DEBUG.hashCache.displayTop(data);
            let updated2 = _DEBUG.hashCache.displayBottom(data);

            // Update the refresh time (if an update took place.)
            if(forced || updated1 || updated2){
                let newText = `Refreshed: ${this.getFormattedDateTime()}`;
                if(this.DOM.refreshLast.innerText != newText){
                    this.DOM.refreshLast.innerText = newText;
                }
            }
        },
        // Display of updated data.
        displayTop: function(newData){
            // If the hashCache is disabled then whatever data received may be incorrect. Skip.
            if(_APP.configObj.disableCache){ 
                // console.log(`hashCache.display: HASHCACHE IS DISABLED. _APP.configObj.disableCache: ${_APP.configObj.disableCache}`);
                return; 
            }

            let top_changes = [];
            let lhcs2 = newData.hashCacheStats2;
            if(!lhcs2){
                console.log("MISSING: newData.hashCacheStats2");
                return false;
            }

            // RECORD COUNTS
            if(newData.totalSize_all  != this.values.totalSize_all)  { this.values.totalSize_all  = newData.totalSize_all  ; top_changes.push( {elem: this.DOM.totalSize_all , value: (newData.totalSize_all/1000000) .toFixed(2).padStart(5, " ") + " MB" } ); }
            if(newData.totalSize_perm != this.values.totalSize_perm) { this.values.totalSize_perm = newData.totalSize_perm ; top_changes.push( {elem: this.DOM.totalSize_perm, value: (newData.totalSize_perm/1000000).toFixed(2).padStart(5, " ") + " MB" } ); }
            if(newData.totalSize_temp != this.values.totalSize_temp) { this.values.totalSize_temp = newData.totalSize_temp ; top_changes.push( {elem: this.DOM.totalSize_temp, value: (newData.totalSize_temp/1000000).toFixed(2).padStart(5, " ") + " MB" } ); }
            
            // RECORD SIZES
            if(newData.totalSum     != this.values.totalSum)     { this.values.totalSum     = newData.totalSum            ; top_changes.push( {elem: this.DOM.totalSum     , value: newData.totalSum     } ); }
            if(newData.totalSumPerm != this.values.totalSumPerm) { this.values.totalSumPerm = newData.totalSumPerm        ; top_changes.push( {elem: this.DOM.totalSumPerm , value: newData.totalSumPerm } ); }
            if(newData.totalSumTemp != this.values.totalSumTemp) { this.values.totalSumTemp = newData.totalSumTemp        ; top_changes.push( {elem: this.DOM.totalSumTemp , value: newData.totalSumTemp } ); }
            
            // RECORD GENERATION TIMES
            if(newData.totalSum_genTimeAll  != this.values.totalSum_genTimeAll)  { this.values.totalSum_genTimeAll  = newData.totalSum_genTimeAll ; top_changes.push( {elem: this.DOM.totalSum_genTimeAll , value: newData.totalSum_genTimeAll .toFixed(2).padStart(6, " ") + " ms" } ); }
            if(newData.totalSum_genTimePerm != this.values.totalSum_genTimePerm) { this.values.totalSum_genTimePerm = newData.totalSum_genTimePerm; top_changes.push( {elem: this.DOM.totalSum_genTimePerm, value: newData.totalSum_genTimePerm.toFixed(2).padStart(6, " ") + " ms" } ); }
            if(newData.totalSum_genTimeTemp != this.values.totalSum_genTimeTemp) { this.values.totalSum_genTimeTemp = newData.totalSum_genTimeTemp; top_changes.push( {elem: this.DOM.totalSum_genTimeTemp, value: newData.totalSum_genTimeTemp.toFixed(2).padStart(6, " ") + " ms" } ); }

            // ALL: bases and copies.
            if(lhcs2.ALL.base.size != this.values.ALL_base_size) { this.values.ALL_base_size = lhcs2.ALL.base.size; top_changes.push( {elem: this.DOM.ALL_base_size, value: lhcs2.ALL.base.size } ); }
            if(lhcs2.ALL.copy.size != this.values.ALL_copy_size) { this.values.ALL_copy_size = lhcs2.ALL.copy.size; top_changes.push( {elem: this.DOM.ALL_copy_size, value: lhcs2.ALL.copy.size } ); }
            
            // PERM: bases and copies.
            if(lhcs2.PERM.base.size != this.values.PERM_base_size) { this.values.PERM_base_size = lhcs2.PERM.base.size; top_changes.push( {elem: this.DOM.PERM_base_size, value: lhcs2.PERM.base.size } ); }
            if(lhcs2.PERM.copy.size != this.values.PERM_copy_size) { this.values.PERM_copy_size = lhcs2.PERM.copy.size; top_changes.push( {elem: this.DOM.PERM_copy_size, value: lhcs2.PERM.copy.size } ); }
            
            // TEMP: bases and copies.
            if(lhcs2.TEMP.base.size != this.values.TEMP_base_size) { this.values.TEMP_base_size = lhcs2.TEMP.base.size; top_changes.push( {elem: this.DOM.TEMP_base_size, value: lhcs2.TEMP.base.size } ); }
            if(lhcs2.TEMP.copy.size != this.values.TEMP_copy_size) { this.values.TEMP_copy_size = lhcs2.TEMP.copy.size; top_changes.push( {elem: this.DOM.TEMP_copy_size, value: lhcs2.TEMP.copy.size } ); }
            
            // Apply the changes.
            if(top_changes.length){
                for(let rec of top_changes){
                    rec.elem.innerText = rec.value;
                }

                return true;
            }

            return false;
        },
        
        delegatedListener: function(e){
            // Is this an entry row?
            let isEntry = e.target.classList.contains("hashCacheStats1_entry");
            if(isEntry){
                // Get the stored attributes of the element. 
                let hashCacheHash      = Number(e.target.getAttribute("hashCacheHash"));
                let hashCacheHash_BASE = Number(e.target.getAttribute("hashCacheHash_BASE"));
                let relatedMapKey      = e.target.getAttribute("relatedMapKey");

                // Request the data to be displayed to the console.
                this.toConsole(`'${relatedMapKey}'`, hashCacheHash, hashCacheHash_BASE);
            }
        },
        createEntryDiv: function(rec){
            // Create the new entry container and add classes and attributes.
            let div_container = document.createElement("div");
            div_container.classList.add("hashCacheStats1_entry");
            div_container.setAttribute("hashCacheHash", rec.hashCacheHash);
            div_container.setAttribute("hashCacheHash_BASE", rec.hashCacheHash_BASE);
            div_container.setAttribute("relatedMapKey", rec.relatedMapKey);
            div_container.setAttribute("origin", rec.origin);

            // Generate the settings text.
            let settingsDifferences = this.getSettingsDifferences(_GFX.defaultSettings, rec.settings);
            let activeSettingsArray = [];
            let activeSettings = ``;
            for(let key in settingsDifferences){
                activeSettingsArray.push(`${key}:${settingsDifferences[key]}`);
            }
            activeSettings = activeSettingsArray.join(", ");
            
            // Add the texts to the entry container.
            div_container.innerText = `` +
            `RelatedMapKey: ${rec.relatedMapKey ? ("'"+rec.relatedMapKey+"'").padEnd(18, " ") : ("["+"CUSTOM"+"]").padEnd(20, " ") }` +
            `\n  Bytes: ${(rec.hashCacheDataLength/1000).toFixed(2)} KB, genTime: ${rec.genTime.toFixed(2)} ms` + 
            `\n  ${"TS: '"+(rec.ts+"'").padEnd(14, " ")}, D: w: ${rec.w}, h: ${rec.h}` +
            `\n  S:${activeSettings ? "" + activeSettings + "" : ""}` +
            `\n  T: ${rec.text ? "'" + rec.text.slice(0, 40) + "'" : ""}` +
            `\n` +
            ``;

            // Set the text as the title of this entry if the data contains text.
            if(rec.text){ div_container.title = rec.text; }

            // Return the completed entry container.
            return div_container;
        },
        createChildNodeClone: function(srcs=[]){
            let arr = [];
            for(let src of srcs){
                let frag = document.createDocumentFragment();
                let children = src.childNodes;
                for (let child of children) { frag.appendChild(child.cloneNode(true)); }
                arr.push(frag);
            }
            return arr; 
        },

        // Display of updated data.
        createDisplayBottomData: function(newData){
            // Gather data.
            let data = {
                strings: {
                    BASE_ALL :{ key1: "ALL" , key2: "base" },
                    COPY_ALL :{ key1: "ALL" , key2: "copy" },
                    BASE_PERM:{ key1: "PERM", key2: "base" },
                    BASE_TEMP:{ key1: "TEMP", key2: "base" },
                },
                elems: {
                    BASE_ALL : { div:null, counter: this.DOM.tab_count_allBase  },
                    COPY_ALL : { div:null, counter: this.DOM.tab_count_allCopy  },
                    BASE_PERM: { div:null, counter: this.DOM.tab_count_permBase },
                    BASE_TEMP: { div:null, counter: this.DOM.tab_count_tempBase },
                },
                hasChanges: {
                    BASE_ALL : this.values.last_hashCacheStats2.ALL.baseHash  != newData.hashCacheStats2.ALL.baseHash ,
                    COPY_ALL : this.values.last_hashCacheStats2.ALL.copyHash  != newData.hashCacheStats2.ALL.copyHash ,
                    BASE_PERM: this.values.last_hashCacheStats2.PERM.baseHash != newData.hashCacheStats2.PERM.baseHash,
                    BASE_TEMP: this.values.last_hashCacheStats2.TEMP.baseHash != newData.hashCacheStats2.TEMP.baseHash,
                },
                curr: {
                    BASE_ALL : this.values.last_hashCacheStats2.ALL.base,
                    COPY_ALL : this.values.last_hashCacheStats2.ALL.copy,
                    BASE_PERM: this.values.last_hashCacheStats2.PERM.base,
                    BASE_TEMP: this.values.last_hashCacheStats2.TEMP.base,
                },
                currHashs: {
                    BASE_ALL : this.values.last_hashCacheStats2.ALL.baseHash,
                    COPY_ALL : this.values.last_hashCacheStats2.ALL.copyHash,
                    BASE_PERM: this.values.last_hashCacheStats2.PERM.baseHash,
                    BASE_TEMP: this.values.last_hashCacheStats2.TEMP.baseHash,
                },
                new: {
                    BASE_ALL : newData.hashCacheStats2.ALL.base,
                    COPY_ALL : newData.hashCacheStats2.ALL.copy,
                    BASE_PERM: newData.hashCacheStats2.PERM.base,
                    BASE_TEMP: newData.hashCacheStats2.TEMP.base,
                },
                newHashs: {
                    BASE_ALL : newData.hashCacheStats2.ALL.baseHash,
                    COPY_ALL : newData.hashCacheStats2.ALL.copyHash,
                    BASE_PERM: newData.hashCacheStats2.PERM.baseHash,
                    BASE_TEMP: newData.hashCacheStats2.TEMP.baseHash,
                },
                removals :{
                    BASE_ALL : null,
                    COPY_ALL : null,
                    BASE_PERM: null,
                    BASE_TEMP: null,
                },
                additions:{
                    BASE_ALL : null,
                    COPY_ALL : null,
                    BASE_PERM: null,
                    BASE_TEMP: null,
                },
                domSources: {
                    BASE_ALL :{
                        CUSTOM: this.DOM.hashCacheSection_view_all_base_ORIGIN_CUSTOM,
                        USER  : this.DOM.hashCacheSection_view_all_base_ORIGIN_USER  ,
                        BASE  : this.DOM.hashCacheSection_view_all_base_ORIGIN_BASE  ,
                    },
                    COPY_ALL :{
                        CUSTOM_MODIFIED: this.DOM.hashCacheSection_view_all_copy_ORIGIN_CUSTOM_MODIFIED,
                        USER_MODIFIED  : this.DOM.hashCacheSection_view_all_copy_ORIGIN_USER_MODIFIED,
                        BASE_MODIFIED  : this.DOM.hashCacheSection_view_all_copy_ORIGIN_BASE_MODIFIED,
                    },
                    BASE_PERM:{
                        CUSTOM: this.DOM.hashCacheSection_view_perm_base_ORIGIN_CUSTOM,
                        USER  : this.DOM.hashCacheSection_view_perm_base_ORIGIN_USER,
                        BASE  : this.DOM.hashCacheSection_view_perm_base_ORIGIN_BASE,
                    },
                    BASE_TEMP:{
                        CUSTOM: this.DOM.hashCacheSection_view_temp_base_ORIGIN_CUSTOM,
                        USER  : this.DOM.hashCacheSection_view_temp_base_ORIGIN_USER,
                        BASE  : this.DOM.hashCacheSection_view_temp_base_ORIGIN_BASE,
                    },
                },
                fragments :{
                    BASE_ALL : {
                        CUSTOM         : null,
                        USER           : null,
                        BASE           : null,
                    },
                    COPY_ALL : {
                        CUSTOM_MODIFIED: null,
                        USER_MODIFIED  : null,
                        BASE_MODIFIED  : null,
                    },
                    BASE_PERM: {
                        CUSTOM         : null,
                        USER           : null,
                        BASE           : null,
                    },
                    BASE_TEMP: {
                        CUSTOM         : null,
                        USER           : null,
                        BASE           : null,
                    },
                },
            };

            return data;
        },
        displayBottom: function(newData){
            // If the hashCache is disabled then whatever data received may be incorrect. Skip.
            if(_APP.configObj.disableCache){ 
                // console.log(`hashCache.display: HASHCACHE IS DISABLED. _APP.configObj.disableCache: ${_APP.configObj.disableCache}`);
                return; 
            }

            let hasChanges = false;

            if(!newData.hashCacheStats2){
                console.log("MISSING: newData.hashCacheStats2");
                return false;
            }

            // Gather data.
            let data = this.createDisplayBottomData(newData);

            // Checkly end if there are no changes.
            if(
                !data.hasChanges.BASE_ALL  &&
                !data.hasChanges.COPY_ALL  &&
                !data.hasChanges.BASE_PERM &&
                !data.hasChanges.BASE_TEMP
            ){
                return false;
            }

            // Update the display of data (using document fragments to minimize DOM changes and repaints.)
            for(let key in data.hasChanges){
                if(data.hasChanges[key]){
                    if(!hasChanges){ hasChanges = true; }

                    // Update counts.
                    let count1 = 0;
                    let count2 = 0;
                    let count3 = 0;

                    // Clone the destinations.
                    let fragKeys = Object.keys(data.fragments[key]);
                    let sources = data.domSources[key];
                    [
                        data.fragments[key][fragKeys[0]],
                        data.fragments[key][fragKeys[1]],
                        data.fragments[key][fragKeys[2]]
                    ] = this.createChildNodeClone([
                        sources[fragKeys[0]],
                        sources[fragKeys[1]],
                        sources[fragKeys[2]]
                    ]);

                    // Update the displayed counter.
                    let key1 = data.strings[key].key1;
                    let key2 = data.strings[key].key2;
                    let oldCount = data.elems[key].counter;
                    let newCount = newData.hashCacheStats2[key1][key2];
                    if( data.elems[key].counter != newCount.size){ oldCount.innerText = newCount.size; }

                    // Get the removals and remove the value of undefined.
                    data.removals[key]  = new Set([...this.values.last_hashCacheStats2[key1][key2]].filter(x => !newData.hashCacheStats2[key1][key2].has(x)));
                    data.removals[key].delete(undefined);
                    
                    // Get the additions and remove the value of undefined.
                    data.additions[key] = new Set([...newData.hashCacheStats2[key1][key2]]         .filter(x => !this.values.last_hashCacheStats2[key1][key2].has(x)));
                    data.additions[key].delete(undefined);

                    // Update the stored current values. 
                    this.values.last_hashCacheStats2[key1][key2].clear()
                    for (let item of newData.hashCacheStats2[key1][key2]) {
                        this.values.last_hashCacheStats2[key1][key2].add(item);
                    }
                    // Update the stored hash of hashes value.
                    this.values.last_hashCacheStats2[key1][key2+"Hash"] = newData.hashCacheStats2[key1][key2+"Hash"]

                    // Remove the removals from the cloned nodes.
                    for(let hash of data.removals[key]){
                        let elem;
                        // if(!hash){ console.log("REMOVE: Invalid hash", hash); continue; }
                        let cacheObj = newData.partial_hashCache.get(hash);

                        // Was NOT found in the hashCache.
                        // After a hashCache clear it is very possible that the cacheObj does not have the former entries. 
                        if(!cacheObj){
                            // console.log("REMOVE: Missing cacheObj", hash);
                            // if(!cacheObj.text){ continue; }

                            // We don't know the origin so we are just going to check all three and remove the element if we find it.
                            let elem1 = data.fragments[key][fragKeys[0]].querySelector(`[hashcachehash='${hash.toString()}']`);
                            let elem2 = data.fragments[key][fragKeys[1]].querySelector(`[hashcachehash='${hash.toString()}']`);
                            let elem3 = data.fragments[key][fragKeys[2]].querySelector(`[hashcachehash='${hash.toString()}']`);
                            if     (elem1){ 
                                // console.log(`Removed using '${fragKeys[0]}' to find the element. (missing cacheObj)`); 
                                elem1.remove(); count1 += 1; 
                            }
                            else if(elem2){ 
                                // console.log(`Removed using '${fragKeys[1]}' to find the element. (missing cacheObj)`); 
                                elem2.remove(); count2 += 1; 
                            }
                            else if(elem3){ 
                                // console.log(`Removed using '${fragKeys[2]}' to find the element. (missing cacheObj)`); 
                                elem3.remove(); count3 += 1; 
                            }
                            else{
                                // console.log("(missing cacheObj) REMOVAL: Element not found:", key, hash, [fragKeys[0], fragKeys[1], fragKeys[2]]);
                                continue;
                            }
                            continue; 
                        }

                        // Was found in the hashCache.
                        else if(cacheObj.origin == fragKeys[0]){ elem = data.fragments[key][fragKeys[0]].querySelector(`[hashcachehash='${hash.toString()}']`); if(elem){ count1 += 1; } }
                        else if(cacheObj.origin == fragKeys[1]){ elem = data.fragments[key][fragKeys[1]].querySelector(`[hashcachehash='${hash.toString()}']`); if(elem){ count2 += 1; } }
                        else if(cacheObj.origin == fragKeys[2]){ elem = data.fragments[key][fragKeys[2]].querySelector(`[hashcachehash='${hash.toString()}']`); if(elem){ count3 += 1; } }
                        else{
                            console.log("Invalid origin:", hash, cacheObj.origin);
                            continue;
                        }
                        if(!elem){
                            console.log("REMOVAL: Element not found:", elem, cacheObj.origin, cacheObj);
                            continue;
                        }
                        elem.remove();
                    }

                    // Add the additions to the cloned nodes.
                    for(let hash of data.additions[key]){
                        // if(!hash){ console.log("ADD: Invalid hash", hash, newData); continue; }

                        let cacheObj = newData.partial_hashCache.get(hash);

                        if(!cacheObj){ console.log("ADD: Missing cacheObj", hash); continue; }
                        
                        // if(!cacheObj.text){ continue; }
                        let entry = this.createEntryDiv(cacheObj);
                        
                        let elem = data.fragments[key][cacheObj.origin].querySelector(`.hashCacheStats1_entry[hashcachehash='${hash}']`);
                        if(elem){
                            let same = elem.isEqualNode(entry);
                            if(!same){ data.fragments[key][cacheObj.origin].replaceChild(entry, elem); }
                        }
                        else{ data.fragments[key][cacheObj.origin].prepend(entry);  }

                        if     (cacheObj.origin == fragKeys[0]){ count1 += 1; }
                        else if(cacheObj.origin == fragKeys[1]){ count2 += 1; }
                        else if(cacheObj.origin == fragKeys[2]){ count3 += 1; }
                        else{
                            if(cacheObj.text){
                                console.log("BAD ORIGIN:", cacheObj.text, cacheObj.isBase?"BASE":"COPY", "Invalid origin:", key, cacheObj.relatedMapKey||"NONE", "***", cacheObj.hashCacheHash_BASE, cacheObj.hashCacheHash, "***", cacheObj.origin, [fragKeys[0], fragKeys[1], fragKeys[2]]);
                                // this.toConsole(`${cacheObj.text?"**(TEXT)**":""}'${cacheObj.relatedMapKey||"NONE"}'`, cacheObj.hashCacheHash, cacheObj.hashCacheHash_BASE);
                            }
                            continue;
                        }
                    }

                    // Replace the destination with the modified clones.
                    if(count1){ sources[fragKeys[0]].replaceChildren( data.fragments[key][fragKeys[0]] ); }
                    if(count2){ sources[fragKeys[1]].replaceChildren( data.fragments[key][fragKeys[1]] ); }
                    if(count3){ sources[fragKeys[2]].replaceChildren( data.fragments[key][fragKeys[2]] ); }
                }
            }

            if(hasChanges){ return true; }
            return false;
        },
        init: function(){
            // Save DOM.

            // Top portion elements.
            this.DOM.totalSize_all        = document.getElementById("debug_hashCacheTable1_totalSize_all");
            this.DOM.totalSize_perm       = document.getElementById("debug_hashCacheTable1_totalSize_perm");
            this.DOM.totalSize_temp       = document.getElementById("debug_hashCacheTable1_totalSize_temp");
            this.DOM.totalSum             = document.getElementById("debug_hashCacheTable1_totalSum");
            this.DOM.totalSumPerm         = document.getElementById("debug_hashCacheTable1_totalSumPerm");
            this.DOM.totalSumTemp         = document.getElementById("debug_hashCacheTable1_totalSumTemp");
            this.DOM.totalSum_genTimeAll  = document.getElementById("debug_hashCacheTable1_totalSum_genTimeAll");
            this.DOM.totalSum_genTimePerm = document.getElementById("debug_hashCacheTable1_totalSum_genTimePerm");
            this.DOM.totalSum_genTimeTemp = document.getElementById("debug_hashCacheTable1_totalSum_genTimeTemp");
            this.DOM.ALL_base_size  = document.getElementById("debug_hashCacheTable1_totalSum_bases");
            this.DOM.ALL_copy_size  = document.getElementById("debug_hashCacheTable1_totalSum_copies");
            this.DOM.PERM_base_size = document.getElementById("debug_hashCacheTable1_totalSumPerm_bases");
            this.DOM.PERM_copy_size = document.getElementById("debug_hashCacheTable1_totalSumPerm_copies");
            this.DOM.TEMP_base_size = document.getElementById("debug_hashCacheTable1_totalSumTemp_bases");
            this.DOM.TEMP_copy_size = document.getElementById("debug_hashCacheTable1_totalSumTemp_copies");
            
            // Bottom portion elements.
            this.DOM.hashCacheList1 = document.getElementById("debug_hashCacheList1");

            this.DOM.view_all_base  = document.getElementById("debug_navBar3_view_all_base");
            this.DOM.view_all_copy  = document.getElementById("debug_navBar3_view_all_copy");
            this.DOM.view_perm_base = document.getElementById("debug_navBar3_view_perm_base");
            this.DOM.view_temp_base = document.getElementById("debug_navBar3_view_temp_base");

            this.DOM.tab_count_allBase  = document.getElementById("debug_tab_hashCache_count_allBase");
            this.DOM.tab_count_permBase = document.getElementById("debug_tab_hashCache_count_permBase");
            this.DOM.tab_count_tempBase = document.getElementById("debug_tab_hashCache_count_tempBase");
            this.DOM.tab_count_allCopy  = document.getElementById("debug_tab_hashCache_count_allCopy");

            this.DOM.hashCacheSection_view_all_base_ORIGIN_CUSTOM = document.getElementById("debug_hashCacheSection_view_all_base_ORIGIN_CUSTOM");
            this.DOM.hashCacheSection_view_all_base_ORIGIN_USER   = document.getElementById("debug_hashCacheSection_view_all_base_ORIGIN_USER");
            this.DOM.hashCacheSection_view_all_base_ORIGIN_BASE   = document.getElementById("debug_hashCacheSection_view_all_base_ORIGIN_BASE");

            this.DOM.hashCacheSection_view_all_copy_ORIGIN_CUSTOM_MODIFIED = document.getElementById("debug_hashCacheSection_view_all_copy_ORIGIN_CUSTOM_MODIFIED");
            this.DOM.hashCacheSection_view_all_copy_ORIGIN_USER_MODIFIED   = document.getElementById("debug_hashCacheSection_view_all_copy_ORIGIN_USER_MODIFIED");
            this.DOM.hashCacheSection_view_all_copy_ORIGIN_BASE_MODIFIED   = document.getElementById("debug_hashCacheSection_view_all_copy_ORIGIN_BASE_MODIFIED");

            this.DOM.hashCacheSection_view_perm_base_ORIGIN_CUSTOM = document.getElementById("debug_hashCacheSection_view_perm_base_ORIGIN_CUSTOM");
            this.DOM.hashCacheSection_view_perm_base_ORIGIN_USER   = document.getElementById("debug_hashCacheSection_view_perm_base_ORIGIN_USER");
            this.DOM.hashCacheSection_view_perm_base_ORIGIN_BASE   = document.getElementById("debug_hashCacheSection_view_perm_base_ORIGIN_BASE");

            this.DOM.hashCacheSection_view_temp_base_ORIGIN_CUSTOM = document.getElementById("debug_hashCacheSection_view_temp_base_ORIGIN_CUSTOM");
            this.DOM.hashCacheSection_view_temp_base_ORIGIN_USER   = document.getElementById("debug_hashCacheSection_view_temp_base_ORIGIN_USER");
            this.DOM.hashCacheSection_view_temp_base_ORIGIN_BASE   = document.getElementById("debug_hashCacheSection_view_temp_base_ORIGIN_BASE");
            
            // Last time refreshed text.
            this.DOM.refreshLast = document.getElementById("debug_hashCacheStats1_refreshLast");
            
            // Forced refresh.
            let refresh = document.getElementById("debug_hashCacheStats1_refresh");
            refresh.addEventListener("click", async ()=>{
                if(!this.values.lastForcedrun || performance.now() - this.values.lastForcedrun > this.values.lastForcedrunWait){
                    this.values.lastForcedrun = performance.now();

                    // Request the debug timings.
                    let newData = await _WEBW_V.SEND("_DEBUG.updateDebugTimings", {
                        data:{},
                        refs:[]
                    }, true, true);
                    newData = newData.data;

                    this.display(newData, true);
                }
            }, false);

            // delegatedListener
            this.DOM.debug_navBarViews3 = document.getElementById("debug_navBarViews3");
            this.DOM.debug_navBarViews3.addEventListener("click", (e)=>this.delegatedListener(e), true);
        },
    },
    // Manages the LayerObjs viewer/editor.
    layerObjs : {
        changes: {
            L1: false,
            L2: false,
            L3: false,
            L4: false,
        },
        // True means to show. False means to hide.
        values: {
            showHide_LayerObject: true,
            showHide_PrintText  : true,
            showHide_Cursor1    : true,
            showHide_Card       : true,
            showHide_UnoLetter  : true,
            showHide_Border     : false,
            showHide_hidden     : false,
        },
        classNames : [
            "LayerObject",
            "PrintText",
            "Cursor1",
            "Card",
            "UnoLetter",
            "Border",
        ],
        DOM:{
            "contextMenu1": "debug_layerObjEdit_contextMenu1",

            // Layer divs (L1 - L4)
            "L1_div"   : "debug_layerObjectList1_L1",
            "L2_div"   : "debug_layerObjectList1_L2",
            "L3_div"   : "debug_layerObjectList1_L3",
            "L4_div"   : "debug_layerObjectList1_L4",

            // SHARED
            "className"   : "debug_layerObjEdit_contextMenu1_className",
            "tilesetKey"  : "debug_layerObjEdit_contextMenu1_tilesetKey",
            "layerKey"    : "debug_layerObjEdit_contextMenu1_layerKey",
            "gs"          : "debug_layerObjEdit_contextMenu1_gs",
            "layerObjKey" : "debug_layerObjEdit_contextMenu1_layerObjKey",
            "x"           : "debug_layerObjEdit_contextMenu1_x",
            "y"           : "debug_layerObjEdit_contextMenu1_y",
            "rotation"    : "debug_layerObjEdit_contextMenu1_rotation", 
            "hidden"      : "debug_layerObjEdit_contextMenu1_hidden", 
            
            // SHARED
            "layerObjectTableDiv" : "debug_layerObjectTableDiv",
            "edit_className"  : "debug_layerObjEdit_className",
            "edit_tilesetKey" : "debug_layerObjEdit_tilesetKey",
            "edit_layerKey"   : "debug_layerObjEdit_layerKey",
            "edit_gs"         : "debug_layerObjEdit_gs",
            "edit_layerObjKey": "debug_layerObjEdit_layerObjKey",
            "edit_x"          : "debug_layerObjEdit_x",
            "edit_y"          : "debug_layerObjEdit_y",
            "edit_rotation"   : "debug_layerObjEdit_rotation", 
            "edit_fade"       : "debug_layerObjEdit_fade", 
            "edit_hidden"     : "debug_layerObjEdit_hidden", 
            
            // PRINTTEXT
            "printTextTableDiv"   : "debug_printTextTableDiv",
            "printText_newText"   : "debug_printText_newText",
            "printText_attributes": "debug_printText_attributes",
            
            // CARD
            "cardTableDiv" : "debug_cardTableDiv",
            "cardTable_attributes" : "debug_cardTable_attributes",
        },
        srcDOM: {
            L1: null, 
            L2: null, 
            L3: null, 
            L4: null, 
        },
        frags: {
            L1: null, 
            L2: null, 
            L3: null, 
            L4: null, 
        },
        highlightCanvas   : null,
        highlightCanvasCtx: null,
        lastNormalrun: 0,
        lastNormalrunWait: 1000,
        lastForcedrun: 0,
        lastForcedrunWait: 1000,
        _redisplay: false,

        init: function(parent){
            this.parent = parent;
            for(let elemKey in this.DOM){
                this.DOM[elemKey] = document.getElementById(this.DOM[elemKey]);
            }

            this.srcDOM.L1 = this.DOM.L1_div;
            this.srcDOM.L2 = this.DOM.L2_div;
            this.srcDOM.L3 = this.DOM.L3_div;
            this.srcDOM.L4 = this.DOM.L4_div;

            // Create and add the highlight canvas to the top.
            // Save the canvas and the draw context.

            // Copy the dimensions of the first canvas. 
            const canvas_src_L1 = document.querySelector(".canvasLayer[name='L1']");
            
            // Create a canvas for this layer.
            this.highlightCanvas = document.createElement("canvas");
            this.highlightCanvas.width  = canvas_src_L1.width; 
            this.highlightCanvas.height = canvas_src_L1.height;
            this.highlightCanvas.id = "debug_highlight_canvas";
            this.highlightCanvas.style["z-index"] = "400";
            this.highlightCanvasCtx = this.highlightCanvas.getContext('2d');

            // Add the class.
            this.highlightCanvas.classList.add("canvasLayer");
            // this.highlightCanvas.classList.add("displayNone");

            // Add the canvas to the output.
            let outputDiv = document.getElementById("output");
            outputDiv.append(this.highlightCanvas);

            // Last time refreshed text.
            this.DOM.refreshLast = document.getElementById("debug_layerObjects_refreshLast");
            
            // Forced refresh.
            let refresh = document.getElementById("debug_layerObjects_refresh");
            refresh.addEventListener("click", async ()=>{
                if(!this.lastForcedrun || performance.now() - this.lastForcedrun > this.lastForcedrunWait){
                    this.lastForcedrun = performance.now();
                    this.display(true);
                }
            }, false);

            // Delegated listener.
            let divs = [
                this.DOM.L1_div,
                this.DOM.L2_div,
                this.DOM.L3_div,
                this.DOM.L4_div
            ];
            for(let elem of divs){
                elem.addEventListener("click"      , (e)=>this.delegatedListener(e), true);
                elem.addEventListener("contextmenu", (e)=>this.delegatedListener(e), true);
                elem.addEventListener("mouseenter" , (e)=>this.delegatedListener(e), true);
                elem.addEventListener("mouseleave" , (e)=>this.delegatedListener(e), true);
            }

            // Checkboxes for className filters.
            this.DOM.showHide_LayerObject = document.getElementById("debug_layerObjects_showHide_LayerObject");
            this.DOM.showHide_PrintText   = document.getElementById("debug_layerObjects_showHide_PrintText");
            this.DOM.showHide_Cursor1     = document.getElementById("debug_layerObjects_showHide_Cursor1");
            this.DOM.showHide_Card        = document.getElementById("debug_layerObjects_showHide_Card");
            this.DOM.showHide_UnoLetter   = document.getElementById("debug_layerObjects_showHide_UnoLetter");
            this.DOM.showHide_Border   = document.getElementById("debug_layerObjects_showHide_Border");
            this.DOM.showHide_hidden   = document.getElementById("debug_layerObjects_showHide_hidden");

            // Add change event listeners.
            this.DOM.showHide_LayerObject.addEventListener("change", ()=>{ this.values.showHide_LayerObject = this.DOM.showHide_LayerObject.checked; this.showHideByClassName(); }, false);
            this.DOM.showHide_PrintText  .addEventListener("change", ()=>{ this.values.showHide_PrintText   = this.DOM.showHide_PrintText  .checked; this.showHideByClassName(); }, false);
            this.DOM.showHide_Cursor1    .addEventListener("change", ()=>{ this.values.showHide_Cursor1     = this.DOM.showHide_Cursor1    .checked; this.showHideByClassName(); }, false);
            this.DOM.showHide_Card       .addEventListener("change", ()=>{ this.values.showHide_Card        = this.DOM.showHide_Card       .checked; this.showHideByClassName(); }, false);
            this.DOM.showHide_UnoLetter  .addEventListener("change", ()=>{ this.values.showHide_UnoLetter   = this.DOM.showHide_UnoLetter  .checked; this.showHideByClassName(); }, false);
            this.DOM.showHide_Border     .addEventListener("change", ()=>{ this.values.showHide_Border      = this.DOM.showHide_Border     .checked; this.showHideByClassName(); }, false);
            this.DOM.showHide_hidden     .addEventListener("change", ()=>{ this.values.showHide_hidden      = this.DOM.showHide_hidden     .checked; this.showHideByClassName(); }, false);

            // Set the default states.
            this.DOM.showHide_LayerObject.checked = this.values.showHide_LayerObject;
            this.DOM.showHide_PrintText  .checked = this.values.showHide_PrintText;
            this.DOM.showHide_Cursor1    .checked = this.values.showHide_Cursor1;
            this.DOM.showHide_Card       .checked = this.values.showHide_Card;
            this.DOM.showHide_UnoLetter  .checked = this.values.showHide_UnoLetter;
            this.DOM.showHide_Border     .checked = this.values.showHide_Border;
            this.DOM.showHide_hidden     .checked = this.values.showHide_hidden;
        },
        
        // ** VIEWER **
        // ************
        highlightOnHover: function(x, y, w, h, rotation){
            // Clear the canvas.
            this.highlightCanvasCtx.clearRect(0, 0, this.highlightCanvas.width, this.highlightCanvas.height);

            // DEBUG: 
            if(rotation == 90 || rotation == -90 || rotation == 270){
                ([w,h] = [h,w])
            }

            // Draw a semi-transparent rectangle covering the region occupied by this layer object.
            this.highlightCanvasCtx.fillStyle="rgba(244, 67, 54, 0.7)";
            this.highlightCanvasCtx.strokeStyle="white";
            this.highlightCanvasCtx.lineWidth=0.5;
            this.highlightCanvasCtx.fillRect( x, y, w, h );
            this.highlightCanvasCtx.strokeRect( x, y, w, h );
        },
        contextMenu1_open  : function(e, gs, key){
            e.preventDefault();
            let data = _GFX.layerObjs.objs[gs][key];
            
            this.DOM["className"]   .innerText = data.className;
            this.DOM["tilesetKey"]  .innerText = data.tilesetKey;
            this.DOM["layerKey"]    .innerText = data.layerKey;
            this.DOM["gs"]          .innerText = gs;
            this.DOM["layerObjKey"] .innerText = key;
            this.DOM["x"]           .innerText = data.x
            this.DOM["y"]           .innerText = data.y
            this.DOM["rotation"]    .innerText = data.settings.rotation;
            this.DOM["hidden"]      .innerText = data.hidden;

            // Set the position of the context menu and display it
            let top  = Math.max(0, e.layerY - 20);
            let left = Math.max(0, e.layerX - 140);
            this.DOM["contextMenu1"].style.top  = (top) + 'px';
            this.DOM["contextMenu1"].style.left = (left) + 'px';
            this.DOM["contextMenu1"].style.display = 'block';
        },
        contextMenu1_select: function(){
            let gs = this.DOM["gs"].innerText;
            let key = this.DOM["layerObjKey"].innerText;
            let data = _GFX.layerObjs.objs[gs][key];

            // Close the menu.
            this.contextMenu1_close();

            // Switch to the LayerObj Edit tab.
            if(_DEBUG.navBar1){
                _DEBUG.navBar1.showOne("view_layerObjEdit");
            }
            else if(_DEBUG.navBar1){
                _DEBUG.navBar1.showOne("view_layerObjEdit")
            }
            else{
                console.log("Missing nav tab: 'view_layerObjEdit'");
            }

            // Load the data into that view.
            this.DOM["edit_className"]  .innerText = data.className;
            this.DOM["edit_tilesetKey"] .innerText = data.tilesetKey;
            this.DOM["edit_layerKey"]   .innerText = data.layerKey;
            this.DOM["edit_gs"]         .innerText = gs;
            this.DOM["edit_layerObjKey"].innerText = data.layerObjKey;
            this.DOM["edit_x"]          .innerText = data.x;
            this.DOM["edit_y"]          .innerText = data.y;
            this.DOM["edit_rotation"]   .innerText = data.settings.rotation;
            this.DOM["edit_fade"]       .innerText = data.settings.fade;
            this.DOM["edit_hidden"]     .innerText = data.hidden;

            // Show/Hide DOM specific to the className.
            let elems = document.querySelectorAll(".debug_classDiv");
            elems.forEach(d=>{ d.classList.add("displayNone"); });

            this.DOM["layerObjectTableDiv"].classList.remove("displayNone"); 
            
            if(data.className == "Card"){ 
                this.DOM["cardTableDiv"].classList.remove("displayNone"); 
                this.card_displayAttribute(data);
            }
            else if(data.className == "PrintText"){
                this.DOM["printTextTableDiv"].classList.remove("displayNone"); 
                this.DOM["printText_newText"].value = data.text;
                this.printText_attributes(data);
            }
        },
        contextMenu1_close : function(){
            // Close the contextMenu.
            this.DOM["contextMenu1"].style.display = 'none';
        },
        getSettingsDifferences: function(obj1, obj2) {
            let differences = {};

            // Check obj1 keys
            for (let key in obj1) {
                if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
                    if (obj1[key].length !== obj2[key].length) {
                        // differences[key] = obj1[key].length;
                        differences[key] = true;
                    }
                } else if (obj2[key] === undefined || obj1[key] !== obj2[key]) {
                    differences[key] = obj1[key];
                }
            }

            // Check obj2 keys
            for (let key in obj2) {
                if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
                    if (obj1[key].length !== obj2[key].length) {
                        // differences[key] = obj2[key].length;
                        differences[key] = true;
                    }
                } else if (obj1[key] === undefined || obj1[key] !== obj2[key]) {
                    differences[key] = obj2[key];
                }
            }

            return differences;
        },
        getFormattedDateTime: function() {
            const date = new Date();
            const year = date.getFullYear();
        
            let month = date.getMonth() + 1;
            month = (month < 10 ? "0" : "") + month;
        
            let day = date.getDate();
            day = (day < 10 ? "0" : "") + day;
        
            let hour = date.getHours();
            let ampm = hour >= 12 ? 'pm' : 'am';
            hour = hour % 12;
            hour = hour ? hour : 12; // the hour '0' should be '12'
            hour = (hour < 10 ? "0" : "") + hour;
        
            let min = date.getMinutes();
            min = (min < 10 ? "0" : "") + min;
        
            let sec = date.getSeconds();
            sec = (sec < 10 ? "0" : "") + sec;
        
            return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec + " " + ampm;
        },
        display: function(){
            // Do not update if the tab is not active.
            let tab = _DEBUG.navBar1.DOM.view_layerObjects.tab;
            if(!tab.classList.contains("active")){ 
                // console.log("tab not active"); 
                return false; 
            }

            // Run the update.
            updated1 = this.displayLayerObjects();
            if(updated1){
                let newText = `Refreshed: ${this.getFormattedDateTime()}`;
                return _DEBUG.updateIfChanged2(this.DOM.refreshLast, "_DEBUG.vault.layerObjs.lastRefresh", newText )
            }
            else{
                // console.log("2 layerObjs: no display update needed.");
            }
            return false;
        },
        displayLayerObject_console: function(gs, key){
            data = _GFX.layerObjs.objs[gs][key];
            console.log(`LAYER OBJECT ENTRY: gs: '${gs}', key: '${key}'`);
            console.log(`  ACCESS: _GFX.layerObjs.objs['${gs}']['${key}']`);
            console.log("  DATA  :", data);
        },
        

        lastLayerHashes: {
            L1: 0,
            L2: 0,
            L3: 0,
            L4: 0,
        },
        createChildNodeClone: function(srcs=[]){
            let arr = [];
            for(let src of srcs){
                let frag = document.createDocumentFragment();
                let children = src.childNodes;
                for (let child of children) { frag.appendChild(child.cloneNode(true)); }
                arr.push(frag);
            }
            return arr; 
        },
        showHideByClassName: function(){
            /*
            For each displayed layer:
            Based on attribute "className"
            Show/hide based on the states of checkboxes.
            */

            // Get the list of layerKeys.
            let layerKeys = Object.keys(_GFX.currentData);

            // Go through each layerKey...
            for(let layerKey of layerKeys){ 
                let updateSource = false;

                // Clone the source.
                [ this.frags[layerKey] ] = this.createChildNodeClone( [ this.srcDOM[layerKey] ] );

                // Go through each className...
                for(let className of this.classNames){ 
                    // Get the entries that have this className.
                    let elems = this.frags[layerKey].querySelectorAll(`.layerObjectsStats1_entry[className='${className}']`);

                    // Skip if there are not any matches.
                    if(!elems.length){ continue; }
                    
                    // Go through the list of className matched entries...
                    for(let elem of elems){
                        // If this is hidden
                        if(this.values.showHide_hidden && elem.getAttribute("hidden" == "false")){
                            // Remove the displayNone class if it IS already there.
                            if(elem.classList.contains("displayNone")){
                                elem.classList.remove("displayNone");
                                
                                // Set the updateSource flag.
                                updateSource = true;
                            }
                        }

                        // If the setting is to show...
                        else if(this.values[`showHide_${className}`]){
                            // Remove the displayNone class if it IS already there.
                            if(elem.classList.contains("displayNone")){
                                elem.classList.remove("displayNone");
                                
                                // Set the updateSource flag.
                                updateSource = true;
                            }
                        }

                        else{
                            // Add the displayNone class if it is NOT already there.
                            if(!elem.classList.contains("displayNone")){
                                elem.classList.add("displayNone");
                                
                                // Set the updateSource flag.
                                updateSource = true;
                            }
                        }
                    }
                }

                // If the updateSource flag is set then replace the source with the modified fragment.
                if(updateSource){
                    this.srcDOM[layerKey].replaceChildren(this.frags[layerKey]);
                }
            }
        },

        createEntryDiv: function(data){
            // Create the new entry container and add classes and attributes.
            let div_container = document.createElement("div");
            div_container.classList.add("layerObjectsStats1_entry");
            div_container.setAttribute("layerObjKey", data.layerObjKey);
            div_container.setAttribute("layerKey"   , data.layerKey);
            div_container.setAttribute("className"  , data.className);
            div_container.setAttribute("hidden"     , data.hidden);

            // Should this element be hidden?
            for(let className of this.classNames){ 
                // If this entry className matches className AND the setting is to hide...
                if(data.className == className && !this.values[`showHide_${className}`] ){ 
                    // Add the displayNone class to hide this entry.
                    div_container.classList.add("displayNone"); 
                }
            }
            if(!this.values.showHide_hidden && data.hidden){
                div_container.classList.add("displayNone"); 
            }

            // Is the entry have the setting of 'hidden' set?
            let hidden;
            if(data.hidden){
                // console.log("is hidden");
                hidden = ` (HIDDEN)`;
            }

            // Generate the dimensions text.
            let w = data.tmap[0];
            let h = data.tmap[1];
            let x = data.x;
            let y = data.y;
            let dims       = `` + 
                `x: ${data.xyByGrid ? x * _APP.configObj.dimensions.tileWidth  : x}, ` +
                `y: ${data.xyByGrid ? y * _APP.configObj.dimensions.tileHeight : y}, ` +
                `w: ${data.xyByGrid ? w * _APP.configObj.dimensions.tileWidth  : w}, ` +
                `h: ${data.xyByGrid ? h * _APP.configObj.dimensions.tileHeight : h}`;

            // Generate the className and name text.
            let className  = `${data.className.padEnd(12, " ")}`;
            let name       = `${data.layerObjKey}`;

            // Generate the settings text.
            let settingsDifferences = this.getSettingsDifferences(_GFX.defaultSettings, data.settings);
            let activeSettingsArray = [];
            let settings = ``;
            for(let key in settingsDifferences){
                activeSettingsArray.push(`${key.slice(0,3)}:${settingsDifferences[key]}`);
            }
            settings = activeSettingsArray.join(", ");

            // Add the texts to the entry container.
            div_container.innerText = `` +
            `C: ${className} : K: ${name}` + `${hidden ? hidden : ""}` +
            `\n  D: ${dims}` +
            `\n  S: ${settings}` + 
            `\n  P: ${data.text ? "(TEXT): '" + data.text.slice(0, 40) + "'" : ""}` +
            ``;

            // Return the completed entry container.
            return div_container;
        },
        delegatedListener: function(e){
            let elem = e.target;
            let isEntry = elem.classList.contains("layerObjectsStats1_entry");
            if(!isEntry){ 
                // console.log("NOT AN ENTRY", elem);
                return; 
            }

            if(e.type == "click")      {
                let layerObjKey = elem.getAttribute("layerObjKey");
                let data = _GFX.layerObjs.objs[_APP.game.gs1][layerObjKey];
                _DEBUG.layerObjs.displayLayerObject_console(_APP.game.gs1, data.layerObjKey);
            }
            if(e.type == "contextmenu"){
                e.preventDefault(); 
                let layerObjKey = elem.getAttribute("layerObjKey");
                _DEBUG.layerObjs.contextMenu1_open( e, _APP.game.gs1, layerObjKey );
            }
            if(e.type == "mouseenter") {
                let layerObjKey = elem.getAttribute("layerObjKey");
                let data = _GFX.layerObjs.objs[_APP.game.gs1][layerObjKey];
                let w = data.tmap[0];
                let h = data.tmap[1];
                let x = data.x;
                let y = data.y;
                _DEBUG.layerObjs.highlightOnHover(
                    ( data.xyByGrid ? x * _APP.configObj.dimensions.tileWidth  : x ), 
                    ( data.xyByGrid ? y * _APP.configObj.dimensions.tileHeight : y ), 
                    ( data.xyByGrid ? w * _APP.configObj.dimensions.tileWidth  : w ), 
                    ( data.xyByGrid ? h * _APP.configObj.dimensions.tileHeight : h ), 
                    data.settings.rotation
                );
            }
            if(e.type == "mouseleave") { _DEBUG.layerObjs.highlightOnHover(0, 0, 0, 0, 0); }
        },
        displayLayerObjects: function(){
            // If the gamestate key is not in layerObjs then return.
            if(! ( _APP.game.gs1 in _GFX.layerObjs.objs ) ){ return false; }
 
            // Get the list of layer keys.
            let layerKeys = Object.keys(_GFX.currentData);
            
            /*
            Go through each layer.
            Only operate on layers that had changes.
            Clone the current div.
            Get the list of layerObjKeys for the layer.
            Search the clone for all elems that need to be removed.
            Update elems or add as needed.
            Use the fragment to replace the children elems of the current div.
            */
           
           // Set the hasChanges flag to initially be false.
           let hasChanges = false;

           // Go through each layer key...
           for(let layerKey of layerKeys){ 
               // Only operate on layers that had changes.
               if(!_DEBUG.layerObjs.changes[layerKey]){ continue; }

               // Set the hasChanges flag.
               if(!hasChanges){ hasChanges = true; }

                // Clone the current div.
                [ this.frags[layerKey] ] = this.createChildNodeClone( [ this.srcDOM[layerKey] ] );

                // Get the current list of entries for this layer.
                let elems = this.frags[layerKey].querySelectorAll(`.layerObjectsStats1_entry`);

                // Determine the layerObjKeys for this layer.
                let loks_thisLayer = new Set();
                for(let key in _GFX.layerObjs.objs[_APP.game.gs1]){
                    if(_GFX.layerObjs.objs[_APP.game.gs1][key].layerKey == layerKey){
                        loks_thisLayer.add(key);
                    }
                }

                // Remove elems that do not match a layerObj.
                if(elems.length){
                    for(let elem of elems){ 
                        let elemLayerObjKey = elem.getAttribute("layerObjKey");
                        if(!loks_thisLayer.has(elemLayerObjKey)){ 
                            elem.remove();
                        }
                    }
                    
                }

                // Go through the layerObjKeys for this layer. Update or add as needed.
                for(let layerObjKey of loks_thisLayer){ 
                    // Break-out the data.
                    let data = _GFX.layerObjs.objs[_APP.game.gs1][layerObjKey];

                    // Get this elem.
                    let elem = this.frags[layerKey].querySelector(`.layerObjectsStats1_entry[layerObjKey='${layerObjKey}']`);

                    // Create the replacement entry.
                    let entry = this.createEntryDiv(data);

                    // Was the elem found? 
                    if(elem){
                        // Does the elem match the entry?
                        let same = elem.isEqualNode(entry);

                        // Not the same?
                        if(!same){
                            // Replace the old elem with the new entry elem.
                            this.frags[layerKey].replaceChild(entry, elem);
                        }
                    }

                    // Elem not found. Add the element. 
                    else{
                        // Add the entry.
                        this.frags[layerKey].prepend( entry );
                    }
                }

                // Add the frag back to the source.
                this.srcDOM[layerKey].replaceChildren(this.frags[layerKey]);

                // Clear the layer changes flag.
                _DEBUG.layerObjs.changes[layerKey] = false;
            }

            // Return true on hasChanges and false if not hashChanges.
            if(hasChanges){ return true; }
            return false;
        },

        // ** EDITOR **
        // ************
        adjustX       : function(inc){
            let gs   = this.DOM["edit_gs"].innerText;
            let key  = this.DOM["edit_layerObjKey"].innerText;
            if(!gs || !key){ console.log("NOT LOADED"); return; }
            let data = _GFX.layerObjs.objs[gs][key];
            data.x += inc;
            this.DOM["edit_x"]          .innerText = data.x;
        },
        adjustFade: function(fadeLevel){
            let gs   = this.DOM["edit_gs"].innerText;
            let key  = this.DOM["edit_layerObjKey"].innerText;
            if(!gs || !key){ console.log("NOT LOADED"); return; }
            let data = _GFX.layerObjs.objs[gs][key];
            data.setSetting("fade", fadeLevel);
            this.DOM["edit_fade"]          .innerText = data.settings.fade;

            // `<span>F:'${(data.settings.fade ?? "null").toString()}'</span>, ` +
        },
        adjustY       : function(inc){
            let gs   = this.DOM["edit_gs"].innerText;
            let key  = this.DOM["edit_layerObjKey"].innerText;
            if(!gs || !key){ console.log("NOT LOADED"); return; }
            let data = _GFX.layerObjs.objs[gs][key];
            data.y += inc;
            this.DOM["edit_y"]          .innerText = data.y;
        },
        adjustRotation: function(rotation){
            let gs   = this.DOM["edit_gs"].innerText;
            let key  = this.DOM["edit_layerObjKey"].innerText;
            if(!gs || !key){ console.log("NOT LOADED"); return; }
            let data = _GFX.layerObjs.objs[gs][key];
            data.setSetting("rotation", rotation);
            this.DOM["edit_rotation"]          .innerText = data.settings.rotation;
        },
        adjustLayerKey: function(newValue){
            let gs   = this.DOM["edit_gs"].innerText;
            let key  = this.DOM["edit_layerObjKey"].innerText;
            if(!gs || !key){ console.log("NOT LOADED"); return; }
            let data = _GFX.layerObjs.objs[gs][key];
            data.layerKey = newValue;
            this.DOM["edit_layerKey"]            .innerText = data.layerKey;
        },
        adjustHidden: function(newValue){
            let gs   = this.DOM["edit_gs"].innerText;
            let key  = this.DOM["edit_layerObjKey"].innerText;
            if(!gs || !key){ console.log("NOT LOADED"); return; }
            let data = _GFX.layerObjs.objs[gs][key];
            data.hidden = newValue;
            this.DOM["edit_hidden"]            .innerText = data.hidden;
        },

        // PRINTTEXT
        printText_attributes: function(data){
            this.DOM["printText_attributes"].innerHTML = `` +
            `<span>TEXT: '${Array.isArray(data.text) ? JSON.stringify(data.text) : data.text}'</span> ` +
            ``;
        },
        printText_adjustText: function(){
            let gs   = this.DOM["edit_gs"].innerText;
            let key  = this.DOM["edit_layerObjKey"].innerText;
            if(!gs || !key){ console.log("NOT LOADED"); return; }
            let data = _GFX.layerObjs.objs[gs][key];

            let text = this.DOM["printText_newText"].value;
            if(text.trim().split("\n").length == 1){ data.text = text.trim(); }
            else                            { data.text = text.trim().split("\n"); }
            this.printText_attributes(data);
        },

        // CARD
        card_displayAttribute: function(data){
            this.DOM["cardTable_attributes"].innerHTML = `` +
                `<span>S:'${data.size}'</span>, ` +
                `<span>C:'${data.color.replace("CARD_", "")}'</span>, ` +
                `<span>V:'${data.value.replace("CARD_", "")}'</span>` +
                ``
        },
        card_adjustSize: function(size){
            let gs   = this.DOM["edit_gs"].innerText;
            let key  = this.DOM["edit_layerObjKey"].innerText;
            if(!gs || !key){ console.log("NOT LOADED"); return; }
            let data = _GFX.layerObjs.objs[gs][key];
            data.size = size;
            this.card_displayAttribute(data);
        },
        card_adjustColor: function(color){
            let gs   = this.DOM["edit_gs"].innerText;
            let key  = this.DOM["edit_layerObjKey"].innerText;
            if(!gs || !key){ console.log("NOT LOADED"); return; }
            let data = _GFX.layerObjs.objs[gs][key];
            data.color = color;
            this.card_displayAttribute(data);
        },
        card_adjustValue: function(value){
            let gs   = this.DOM["edit_gs"].innerText;
            let key  = this.DOM["edit_layerObjKey"].innerText;
            if(!gs || !key){ console.log("NOT LOADED"); return; }
            let data = _GFX.layerObjs.objs[gs][key];
            data.value = value;
            this.card_displayAttribute(data);
        },
    },
    // Shows the draw timings.
    drawTimings: {
        DOM: {
            "fpsDisplay"             : null,
            "debug_L1_tms"           : null,
            "debug_L2_tms"           : null,
            "debug_L3_tms"           : null,
            "debug_L4_tms"           : null,
            "debug_timings_A_L1"     : null,
            "debug_timings_A_L2"     : null,
            "debug_timings_A_L3"     : null,
            "debug_timings_A_L4"     : null,
            "debug_timings_B_L1"     : null,
            "debug_timings_B_L2"     : null,
            "debug_timings_B_L3"     : null,
            "debug_timings_B_L4"     : null,
            "debug_timings_C_L1"     : null,
            "debug_timings_C_L2"     : null,
            "debug_timings_C_L3"     : null,
            "debug_timings_C_L4"     : null,
            "debug_timings_D_L1"     : null,
            "debug_timings_D_L2"     : null,
            "debug_timings_D_L3"     : null,
            "debug_timings_D_L4"     : null,
            "debug_timings_E_L1"     : null,
            "debug_timings_E_L2"     : null,
            "debug_timings_E_L3"     : null,
            "debug_timings_E_L4"     : null,
            "debug_timings_TOTAL_L1" : null,
            "debug_timings_TOTAL_L2" : null,
            "debug_timings_TOTAL_L3" : null,
            "debug_timings_TOTAL_L4" : null,
            "debug_timings_TOTAL_ALL": null,

        },
        init: function(){
            // Save DOM.
            this.DOM.fpsDisplay       = document.getElementById("debug_fpsDisplay");
            this.DOM.frameCounter     = document.getElementById("debug_frameCounter");
            this.DOM.frameDrawCounter = document.getElementById("debug_frameDrawCounter");
            this.DOM.frameDrawCounterDummy = document.getElementById("debug_frameDrawCounterDummy");
            this.DOM.L1_tms            = document.getElementById("debug_L1_tms");
            this.DOM.L2_tms            = document.getElementById("debug_L2_tms");
            this.DOM.L3_tms            = document.getElementById("debug_L3_tms");
            this.DOM.L4_tms            = document.getElementById("debug_L4_tms");
            this.DOM.timings_A_L1      = document.getElementById("debug_timings_A_L1");
            this.DOM.timings_A_L2      = document.getElementById("debug_timings_A_L2");
            this.DOM.timings_A_L3      = document.getElementById("debug_timings_A_L3");
            this.DOM.timings_A_L4      = document.getElementById("debug_timings_A_L4");
            this.DOM.timings_B_L1      = document.getElementById("debug_timings_B_L1");
            this.DOM.timings_B_L2      = document.getElementById("debug_timings_B_L2");
            this.DOM.timings_B_L3      = document.getElementById("debug_timings_B_L3");
            this.DOM.timings_B_L4      = document.getElementById("debug_timings_B_L4");
            this.DOM.timings_C_L1      = document.getElementById("debug_timings_C_L1");
            this.DOM.timings_C_L2      = document.getElementById("debug_timings_C_L2");
            this.DOM.timings_C_L3      = document.getElementById("debug_timings_C_L3");
            this.DOM.timings_C_L4      = document.getElementById("debug_timings_C_L4");
            this.DOM.timings_D_L1      = document.getElementById("debug_timings_D_L1");
            this.DOM.timings_D_L2      = document.getElementById("debug_timings_D_L2");
            this.DOM.timings_D_L3      = document.getElementById("debug_timings_D_L3");
            this.DOM.timings_D_L4      = document.getElementById("debug_timings_D_L4");
            this.DOM.timings_E_L1      = document.getElementById("debug_timings_E_L1");
            this.DOM.timings_E_L2      = document.getElementById("debug_timings_E_L2");
            this.DOM.timings_E_L3      = document.getElementById("debug_timings_E_L3");
            this.DOM.timings_E_L4      = document.getElementById("debug_timings_E_L4");
            this.DOM.timings_TOTAL_L1  = document.getElementById("debug_timings_TOTAL_L1");
            this.DOM.timings_TOTAL_L2  = document.getElementById("debug_timings_TOTAL_L2");
            this.DOM.timings_TOTAL_L3  = document.getElementById("debug_timings_TOTAL_L3");
            this.DOM.timings_TOTAL_L4  = document.getElementById("debug_timings_TOTAL_L4");
            this.DOM.timings_TOTAL_ALL = document.getElementById("debug_timings_TOTAL_ALL");
        },
        display: function(newData){
            // Frame counters.
            _DEBUG.updateIfChanged2(this.DOM.frameCounter         , "_DEBUG.vault.frameCounters.frameCounter"         , (_APP.game.gameLoop.frameCounter    /1000).toFixed(1)+"k" );
            _DEBUG.updateIfChanged2(this.DOM.frameDrawCounter     , "_DEBUG.vault.frameCounters.frameDrawCounter"     , (_APP.game.gameLoop.frameDrawCounter/1000).toFixed(1)+"k" );
            _DEBUG.updateIfChanged2(this.DOM.frameDrawCounterDummy, "_DEBUG.vault.frameCounters.doDummyDrawCountTOTAL", (_DEBUG.doDummyDrawCountTOTAL       /1000).toFixed(1)+"k" );

            // Tilemap counts per layer. 
            _DEBUG.updateIfChanged2(this.DOM.L1_tms, "_DEBUG.vault.tilemapCounters.L1_tilemaps", Object.keys(_GFX.currentData["L1"].tilemaps).length.toString() );
            _DEBUG.updateIfChanged2(this.DOM.L2_tms, "_DEBUG.vault.tilemapCounters.L2_tilemaps", Object.keys(_GFX.currentData["L2"].tilemaps).length.toString() );
            _DEBUG.updateIfChanged2(this.DOM.L3_tms, "_DEBUG.vault.tilemapCounters.L3_tilemaps", Object.keys(_GFX.currentData["L3"].tilemaps).length.toString() );
            _DEBUG.updateIfChanged2(this.DOM.L4_tms, "_DEBUG.vault.tilemapCounters.L4_tilemaps", Object.keys(_GFX.currentData["L4"].tilemaps).length.toString() );

            // Current FPS.
            // Show average FPS, average ms per frame, how much off is the average ms per frame.
            let new_average       = _APP.game.gameLoop.fpsCalc.average.toFixed(0) ?? 0;
            let new_avgMsPerFrame = _APP.game.gameLoop.fpsCalc.avgMsPerFrame.toFixed(1) ?? 0;
            let msDiff            = (_APP.game.gameLoop.fpsCalc.avgMsPerFrame - _APP.game.gameLoop.msFrame).toFixed(1);
            testText = `AVG: ${new_average}, MS: ${new_avgMsPerFrame}, DELTA: ${msDiff}`;
            _DEBUG.updateIfChanged2(this.DOM.fpsDisplay, "_DEBUG.vault.frameCounters.fpsDisplay", testText);

            if(!newData.ALLTIMINGS || !Object.keys(newData.ALLTIMINGS).length){
                console.log("MISSING: newData.ALLTIMINGS");
                return;
            }

            // Last draw: Individual timings.
            _DEBUG.updateIfChanged2(this.DOM.timings_TOTAL_L1,  '_DEBUG.vault.ALLTIMINGS.L1___TOTAL'            , newData.ALLTIMINGS["L1___TOTAL"]            .toFixed(1)+"");
            _DEBUG.updateIfChanged2(this.DOM.timings_A_L1,      '_DEBUG.vault.ALLTIMINGS.L1_A_clearLayer'       , newData.ALLTIMINGS["L1_A_clearLayer"]       .toFixed(1)+"");
            _DEBUG.updateIfChanged2(this.DOM.timings_B_L1,      '_DEBUG.vault.ALLTIMINGS.L1_B_clearRemovedData' , newData.ALLTIMINGS["L1_B_clearRemovedData"] .toFixed(1)+"");
            _DEBUG.updateIfChanged2(this.DOM.timings_C_L1,      '_DEBUG.vault.ALLTIMINGS.L1_C_createTilemaps'   , newData.ALLTIMINGS["L1_C_createTilemaps"]   .toFixed(1)+"");
            _DEBUG.updateIfChanged2(this.DOM.timings_D_L1,      '_DEBUG.vault.ALLTIMINGS.L1_D_drawFromDataCache', newData.ALLTIMINGS["L1_D_drawFromDataCache"].toFixed(1)+"");
            _DEBUG.updateIfChanged2(this.DOM.timings_E_L1,      '_DEBUG.vault.ALLTIMINGS.L1_E_drawImgDataCache' , newData.ALLTIMINGS["L1_E_drawImgDataCache"] .toFixed(1)+"");
            _DEBUG.updateIfChanged2(this.DOM.timings_TOTAL_L2,  '_DEBUG.vault.ALLTIMINGS.L2___TOTAL'            , newData.ALLTIMINGS["L2___TOTAL"]            .toFixed(1)+"");
            _DEBUG.updateIfChanged2(this.DOM.timings_A_L2,      '_DEBUG.vault.ALLTIMINGS.L2_A_clearLayer'       , newData.ALLTIMINGS["L2_A_clearLayer"]       .toFixed(1)+"");
            _DEBUG.updateIfChanged2(this.DOM.timings_B_L2,      '_DEBUG.vault.ALLTIMINGS.L2_B_clearRemovedData' , newData.ALLTIMINGS["L2_B_clearRemovedData"] .toFixed(1)+"");
            _DEBUG.updateIfChanged2(this.DOM.timings_C_L2,      '_DEBUG.vault.ALLTIMINGS.L2_C_createTilemaps'   , newData.ALLTIMINGS["L2_C_createTilemaps"]   .toFixed(1)+"");
            _DEBUG.updateIfChanged2(this.DOM.timings_D_L2,      '_DEBUG.vault.ALLTIMINGS.L2_D_drawFromDataCache', newData.ALLTIMINGS["L2_D_drawFromDataCache"].toFixed(1)+"");
            _DEBUG.updateIfChanged2(this.DOM.timings_E_L2,      '_DEBUG.vault.ALLTIMINGS.L2_E_drawImgDataCache' , newData.ALLTIMINGS["L2_E_drawImgDataCache"] .toFixed(1)+"");
            _DEBUG.updateIfChanged2(this.DOM.timings_TOTAL_L3,  '_DEBUG.vault.ALLTIMINGS.L3___TOTAL'            , newData.ALLTIMINGS["L3___TOTAL"]            .toFixed(1)+"");
            _DEBUG.updateIfChanged2(this.DOM.timings_A_L3,      '_DEBUG.vault.ALLTIMINGS.L3_A_clearLayer'       , newData.ALLTIMINGS["L3_A_clearLayer"]       .toFixed(1)+"");
            _DEBUG.updateIfChanged2(this.DOM.timings_B_L3,      '_DEBUG.vault.ALLTIMINGS.L3_B_clearRemovedData' , newData.ALLTIMINGS["L3_B_clearRemovedData"] .toFixed(1)+"");
            _DEBUG.updateIfChanged2(this.DOM.timings_C_L3,      '_DEBUG.vault.ALLTIMINGS.L3_C_createTilemaps'   , newData.ALLTIMINGS["L3_C_createTilemaps"]   .toFixed(1)+"");
            _DEBUG.updateIfChanged2(this.DOM.timings_D_L3,      '_DEBUG.vault.ALLTIMINGS.L3_D_drawFromDataCache', newData.ALLTIMINGS["L3_D_drawFromDataCache"].toFixed(1)+"");
            _DEBUG.updateIfChanged2(this.DOM.timings_E_L3,      '_DEBUG.vault.ALLTIMINGS.L3_E_drawImgDataCache' , newData.ALLTIMINGS["L3_E_drawImgDataCache"] .toFixed(1)+"");
            _DEBUG.updateIfChanged2(this.DOM.timings_TOTAL_L4,  '_DEBUG.vault.ALLTIMINGS.L4___TOTAL'            , newData.ALLTIMINGS["L4___TOTAL"]            .toFixed(1)+"");
            _DEBUG.updateIfChanged2(this.DOM.timings_A_L4,      '_DEBUG.vault.ALLTIMINGS.L4_A_clearLayer'       , newData.ALLTIMINGS["L4_A_clearLayer"]       .toFixed(1)+"");
            _DEBUG.updateIfChanged2(this.DOM.timings_B_L4,      '_DEBUG.vault.ALLTIMINGS.L4_B_clearRemovedData' , newData.ALLTIMINGS["L4_B_clearRemovedData"] .toFixed(1)+"");
            _DEBUG.updateIfChanged2(this.DOM.timings_C_L4,      '_DEBUG.vault.ALLTIMINGS.L4_C_createTilemaps'   , newData.ALLTIMINGS["L4_C_createTilemaps"]   .toFixed(1)+"");
            _DEBUG.updateIfChanged2(this.DOM.timings_D_L4,      '_DEBUG.vault.ALLTIMINGS.L4_D_drawFromDataCache', newData.ALLTIMINGS["L4_D_drawFromDataCache"].toFixed(1)+"");
            _DEBUG.updateIfChanged2(this.DOM.timings_E_L4,      '_DEBUG.vault.ALLTIMINGS.L4_E_drawImgDataCache' , newData.ALLTIMINGS["L4_E_drawImgDataCache"] .toFixed(1)+"");
            _DEBUG.updateIfChanged2(this.DOM.timings_TOTAL_ALL, '_DEBUG.vault.ALLTIMINGS.gfx'                   , newData.ALLTIMINGS["gfx"].toFixed(1)+" ms");
        },
    },
    // NavBar1 buttons for the left-side debug view.
    navBar1:{
        // Holds the DOM for the nav buttons and nav views.
        DOM: {
            'view_colorFinder': {
                'tab' : 'debug_navBar1_tab_colorFinder',
                'view': 'debug_navBar1_view_colorFinder',
            },
            'view_drawStats': {
                'tab' : 'debug_navBar1_tab_drawStats',
                'view': 'debug_navBar1_view_drawStats',
            },
            'view_fade': {
                'tab' : 'debug_navBar1_tab_fade',
                'view': 'debug_navBar1_view_fade',
            },
            'view_layerObjEdit': {
                'tab' : 'debug_navBar1_tab_layerObjEdit',
                'view': 'debug_navBar1_view_layerObjEdit',
            },
            'view_hashCacheStats1': {
                'tab' : 'debug_navBar1_tab_hashCacheStats1',
                'view': 'debug_navBar1_view_hashCacheStats1',
            },
            'view_layerObjects': {
                'tab' : 'debug_navBar1_tab_layerObjects',
                'view': 'debug_navBar1_view_layerObjects',
            },
            // 'view_hashCacheStats2': {
            //     'tab' : 'debug_navBar1_tab_hashCacheStats2',
            //     'view': 'debug_navBar1_view_hashCacheStats2',
            // },
        },
        hideAll: _APP.navBar1.hideAll,
        showOne: _APP.navBar1.showOne,
        init   : _APP.navBar1.init,
    },
    // NavBar2 buttons for the hashCache sections.
    navBar3:{
        // Holds the DOM for the nav buttons and nav views.
        DOM: {
            'view_all_base': {
                'tab' : 'debug_navBar3_tab_all_base',
                'view': 'debug_navBar3_view_all_base',
            },
            'view_perm_base': {
                'tab' : 'debug_navBar3_tab_perm_base',
                'view': 'debug_navBar3_view_perm_base',
            },
            'view_temp_base': {
                'tab' : 'debug_navBar3_tab_temp_base',
                'view': 'debug_navBar3_view_temp_base',
            },
            'view_all_copy': {
                'tab' : 'debug_navBar3_tab_all_copy',
                'view': 'debug_navBar3_view_all_copy',
            },
        },
        hideAll: _APP.navBar1.hideAll,
        showOne: _APP.navBar1.showOne,
        init   : _APP.navBar1.init,
    },

    // 
    updateTimingBars: {
        DOM: {
            progressBar_canvas: null
        },
        ctx: null,
        positions: {
            "debugBar": { x:70, y:5+0  , w:560, h:20 },
            "LoopBar" : { x:70, y:5+30 , w:560, h:20 },
            "GfxBar"  : { x:70, y:5+60 , w:560, h:20 },
        },
        mapToWidth: function(value, maxWidth) {
            canvasWidth = maxWidth; // this.ctx.canvas.width;

            // Make sure the value is clamped between 0 and 100
            value = Math.max(0, Math.min(100, value));

            // Map the value to the width of the canvas
            return ((value / 100) * canvasWidth) << 0;
        },
        drawSeparators: function(pos){
            this.ctx.strokeStyle = '#fff';

            // Set the line style to dotted
            this.ctx.setLineDash([3, 3]);
            
            // Array of percentages for the lines
            let percentages = [18, 36, 54, 72, 90];
            
            // Draw the lines
            for(let i = 0; i < percentages.length; i++) {
                let xPosition = pos.x + (percentages[i]/100) * pos.w;
            
                this.ctx.beginPath();
                this.ctx.moveTo(xPosition, pos.y);
                this.ctx.lineTo(xPosition, pos.y + pos.h);
                this.ctx.stroke();
            }
            
            // Reset the line style to solid
            this.ctx.setLineDash([]);
        },
        updateOneBar: function(barKey, newValue, newValue2=""){
            // Get the bar dimensions/position.
            let pos = this.positions[barKey];

            // Map the newValue to fit the bar. 
            let newWidth = this.mapToWidth(newValue, pos.w);

            // Clear this bar.
            this.ctx.clearRect(pos.x-2, pos.y-2, pos.w+4, pos.h+4);
            
            // Draw the outer rectangle.
            this.ctx.strokeStyle = '#000';
            this.ctx.strokeRect(pos.x-2, pos.y-2, pos.w+4, pos.h+4);

            // Draw the inner filled rectangle. (full)
            this.ctx.fillStyle = '#b0c4de';
            this.ctx.fillRect(pos.x, pos.y, pos.w, pos.h);

            // Draw the inner filled rectangle. (partial)
            if     (newValue < 18){ this.ctx.fillStyle = '#18a521'; }
            else if(newValue < 36){ this.ctx.fillStyle = '#1a3cac'; }
            else if(newValue < 54){ this.ctx.fillStyle = '#a89922'; }
            else if(newValue < 72){ this.ctx.fillStyle = '#df9e2f'; }
            else if(newValue < 90){ this.ctx.fillStyle = '#fa3131'; }
            else                  { this.ctx.fillStyle = '#ff0000'; }
            this.ctx.fillRect(pos.x, pos.y, newWidth, pos.h);

            // Draw the separation of ranges.
            this.drawSeparators(pos);

            // Draw the newValue and newValue2 in the center of the bar.
            this.ctx.font = '15px Courier New, monospace';
            this.ctx.fillStyle = '#000';
            this.ctx.textAlign = "center";     // Center the text horizontally
            newValue  = newValue .toFixed(0).padStart(5, " ") + "%"
            newValue2 = newValue2.toFixed(1).padStart(5+5, " ") + "ms"
            this.ctx.fillText(newValue + " " + newValue2 +"", pos.x + (pos.w / 2), pos.y + (pos.h / 2));
        },
        init: function(){
            // Save the DOM.
            this.DOM.progressBar_canvas = document.getElementById("debug_progressBar_canvas");

            // Get device pixel ratio
            let dpr = window.devicePixelRatio || 1;

            // Set the size of the canvas in pixels, taking into account the device pixel ratio
            this.DOM.progressBar_canvas.width  = this.DOM.progressBar_canvas.width  * dpr;
            this.DOM.progressBar_canvas.height = this.DOM.progressBar_canvas.height * dpr;

            // Set the size of the canvas in CSS pixels
            this.DOM.progressBar_canvas.style.width  = (this.DOM.progressBar_canvas.width  / dpr) + "px";
            this.DOM.progressBar_canvas.style.height = (this.DOM.progressBar_canvas.height / dpr) + "px";

            // this.ctx = this.DOM.progressBar_canvas.getContext("2d", { alpha: true } );
            this.ctx = this.DOM.progressBar_canvas.getContext("2d", { alpha: false } );

            // Scale all drawing operations by the dpr
            this.ctx.scale(dpr, dpr);
            this.ctx.translate(0.5, 0.5);

            // Clear the canvas
            this.ctx.fillStyle = '#a9a9a9'; // darkgray
            this.ctx.fillRect(0, 0, this.DOM.progressBar_canvas.width / dpr, this.DOM.progressBar_canvas.height / dpr);

            // Draw the labels.
            this.ctx.fillStyle = '#000';
            this.ctx.font = 'bold 15px Courier New, monospace';
            this.ctx.textAlign = "left";     // 
            this.ctx.textBaseline = "middle";  // Center the text vertically
            this.ctx.fillText("DEBUG:", 5, this.positions.debugBar.y + this.positions.debugBar.h -8);
            this.ctx.fillText("LOOP :", 5, this.positions.LoopBar.y   + this.positions.LoopBar.h  -8);
            this.ctx.fillText("DRAW :", 5, this.positions.GfxBar.y    + this.positions.GfxBar.h   -8);

            // Draw the initial bars display.
            this.updateOneBar("debugBar", 0, 0);
            this.updateOneBar("LoopBar" , 0, 0);
            this.updateOneBar("GfxBar"  , 0, 0);
        },

        last_debugTime: 0,
        last_loopTime : 0,
        last_drawTime : 0,

        calcPercentOfFrameTime: function(value){
            // Convert to percent of gameloop frame.
            let percent = 100 * (value / _APP.game.gameLoop.msFrame)

            // Keep the new value in the range of 0 - 100.
            // percent = Math.max(0, Math.min(100, percent));

            // Return the completed value.
            return percent;
        },
        display_one: function(barKey, newData){
            if(!newData.ALLTIMINGS || !Object.keys(newData.ALLTIMINGS).length){
                console.log("MISSING: newData.ALLTIMINGS");
                return;
            }

            let data;
            let percent;
            let ms;

            if(barKey == "debugBar"){
                // data = _APP.utility.timeIt("debug_total", "get");
                data = _DEBUG.runDebug_lastDuration;
                percent = this.calcPercentOfFrameTime( data );
                ms = data;
            }
            else if(barKey == "LoopBar") {
                // data = _APP.utility.timeIt("loop_total", "get");
                data = _APP.game.gameLoop.lastLoop_timestamp;
                percent = this.calcPercentOfFrameTime( data );
                ms = data;
            }
            else if(barKey == "GfxBar")  {
                // data = _APP.utility.timeIt("draw_total", "get");
                data = newData.ALLTIMINGS.gfx; 
                percent = this.calcPercentOfFrameTime( data );
                ms = data;
            }
            else{
                return;
            }

            // Update the specific bar.
            this.updateOneBar(barKey, percent, ms);
        },
        display: function(newData){
            if(!newData.ALLTIMINGS || !Object.keys(newData.ALLTIMINGS).length){
                console.log("MISSING: newData.ALLTIMINGS");
                return;
            }

            // Update all bars.
            this.display_one("debugBar", newData);
            this.display_one("LoopBar", newData);
            this.display_one("GfxBar", newData);
        }
    },

    // ** UTILITIES **
    // ***************

    doDummyDraw: false, 
    doDummyDrawCountTOTAL: 0, 
    prevGfxTimings: {},
    prevDummyGfxTimings: {},
    savePrevGfxTimings: function(data){
        this.prevGfxTimings = { ...data };
        this.prevDummyGfxTimings = { ...data };
    },
    reducePrevGfxTimings: function(){
        // Get the keys to operate on.
        let keys = Object.keys(this.prevGfxTimings.ALLTIMINGS);
    
        // For each key, reduce the value by one-tenth of the original value.
        let reducedTimings = {};
    
        for(let i = 0, len = keys.length; i < len; i += 1) {
            let key = keys[i];

            // If it is already 0 then do nothing.
            if(this.prevGfxTimings.ALLTIMINGS[key] == 0){ reducedTimings[key] = 0; continue; }

            // Decrement to 0 in x steps.
            // let decrementValue = this.prevDummyGfxTimings.ALLTIMINGS[key] / 10; 
            let decrementValue = this.prevDummyGfxTimings.ALLTIMINGS[key] / 5; 
            reducedTimings[key] = this.prevGfxTimings.ALLTIMINGS[key] - decrementValue; 

            // If the new value is less than 0.1 just set it to 0.
            if(reducedTimings[key] < 0.1) { reducedTimings[key] = 0; }
        }
    
        // Replace the ALLTIMINGS with the reduced timings.
        // Update the values in prevGfxTimings to be used in the next iteration.
        this.prevGfxTimings.ALLTIMINGS = reducedTimings;
    
        // Set the return data.
        returnData = this.prevGfxTimings;
        return returnData;
    },
    configDummyDraw: async function(){
        // Reduce existing data.
        _DEBUG.prevGfxTimings = _DEBUG.reducePrevGfxTimings();
        _DEBUG.doDummyDrawCountTOTAL += 1;
        _DEBUG.doDummyDraw = false;
    },

    // Stores values for later compare (and update.) (Needed by updateIfChanged2.)
    vault: {
        layerObjs: {
            lastRefresh: "",
        },
        frameCounters:{
            "frameCounter"          : 0,
            "frameDrawCounter"      : 0,
            "doDummyDrawCountTOTAL" : 0,
            "fpsDisplay": "",
        },
        tilemapCounters:{
            "L1_tilemaps": 0,
            "L2_tilemaps": 0,
            "L3_tilemaps": 0,
            "L4_tilemaps": 0,
        },
        gamestate:{
            "gs1": "",
            "gs2": "",
        },
        debugTimers:{
            "debug_total"          : 0,
            "hashCache_display"    : 0,
            "layerObjs_display"    : 0,
            "drawTimings_display"  : 0,
            "bars_display"         : 0,
            "showGamestate_display": 0,
        },
        ALLTIMINGS: {
            "L1___TOTAL"             : 0,
            "L1_A_clearLayer"        : 0,
            "L1_B_clearRemovedData"  : 0,
            "L1_C_createTilemaps"    : 0,
            "L1_D_drawFromDataCache" : 0,
            "L1_E_drawImgDataCache"  : 0,
            "L2___TOTAL"             : 0,
            "L2_A_clearLayer"        : 0,
            "L2_B_clearRemovedData"  : 0,
            "L2_C_createTilemaps"    : 0,
            "L2_D_drawFromDataCache" : 0,
            "L2_E_drawImgDataCache"  : 0,
            "L3___TOTAL"             : 0,
            "L3_A_clearLayer"        : 0,
            "L3_B_clearRemovedData"  : 0,
            "L3_C_createTilemaps"    : 0,
            "L3_D_drawFromDataCache" : 0,
            "L3_E_drawImgDataCache"  : 0,
            "L4___TOTAL"             : 0,
            "L4_A_clearLayer"        : 0,
            "L4_B_clearRemovedData"  : 0,
            "L4_C_createTilemaps"    : 0,
            "L4_D_drawFromDataCache" : 0,
            "L4_E_drawImgDataCache"  : 0,
            "gfx"                    : 0,
        },
    },
    
    getReference: function(obj, str) {
        const parts = str.split('.');
        let ref = window;
    
        for (let i = 0; i < parts.length; i++) {
            ref = ref[parts[i]];
        }
    
        return ref;
    },
    updateReference: function(obj, str, newValue) {
        const parts = str.split('.');
        let ref = window;
    
        for (let i = 0; i < parts.length - 1; i++) {
            ref = ref[parts[i]];
        }
    
        ref[parts[parts.length - 1]] = newValue;
    },

    // DOM value updater. Only changes if the value is different than the current value. (works with _DEBUG.vault.)
    updateIfChanged2: function(elem, oldValueRefStr, newValue, method="innerText"){
        // Compare each value trimed.
        let ref = this.getReference(window, oldValueRefStr);
        if(undefined == ref){ console.log("bad ref", oldValueRefStr); return; }
        
        let oldValue = ref.toString().trim();
        newValue = newValue.toString().trim();
        if(oldValue != newValue){
            // console.log("CHANGED", oldValueRefStr);
            // Store the trimmed value to the DOM.
            elem[method] = newValue; 

            // Update the value in the vault.
            this.updateReference(window, oldValueRefStr, newValue);
            return true;
        }
        return false;
    },

    // ** DEBUG TASK RUNNER **
    // ***********************

    runDebug_wait: 1000 * 0.25,
    runDebug_last: 0,
    runDebug_lastDuration: 0,

    DOM:{
        debug_timings_total        : null, 
        debug_timings_hashCache    : null, 
        debug_timings_layerObjs    : null, 
        debug_timings_drawTimings  : null, 
        debug_timings_bars         : null, 
        debug_timings_showGamestate: null, 
    },
    debugTasks: async function(type=1){
        // Don't run debug until it is time. 
        let debugCanRun     = (performance.now() - this.runDebug_last) > this.runDebug_wait;
        if( !debugCanRun ){
            // console.log("not ready", (performance.now() - this.runDebug_last).toFixed(2), this.runDebug_wait.toFixed(2));
            return;
        }

        // Store the timestamp for the next run.
        let debug_ts = performance.now();
        
        // Get the last saved data.
        newData = _DEBUG.prevGfxTimings;

        // Dummy type?
        if(type==2){
            this.configDummyDraw();
        }

        performance.mark('START_debug_total');
        
        // SHOWGAMESTATE VIEWER
        performance.mark('START_showGamestate.display');
        _DEBUG.showGamestate.display(false);
        performance.mark('END_showGamestate.display');
        
        // LAYER OBJECTS VIEWER/EDITOR
        performance.mark('START_layerObjs.display');
        _DEBUG.layerObjs.display(false);
        performance.mark('END_layerObjs.display');
        
        // HASH CACHE VIEWER
        performance.mark('START_hashCache.display');
        _DEBUG.hashCache.display(newData, false);
        performance.mark('END_hashCache.display');
        
        // DRAW TIMINGS
        performance.mark('START_drawTimings.display');
        _DEBUG.drawTimings.display(newData, false);
        performance.mark('END_drawTimings.display');
        
        // DONE WITH DEBUG. 
        this.runDebug_lastDuration = performance.now() - debug_ts;

        // BARS
        performance.mark('START_bars.display');
        _DEBUG.updateTimingBars.display(newData, false);
        performance.mark('END_bars.display');

        this.runDebug_last = performance.now();

        performance.mark('END_debug_total');

        performance.measure('showGamestate.display', 'START_showGamestate.display', 'END_showGamestate.display');
        performance.measure('layerObjs.display'    , 'START_layerObjs.display'    , 'END_layerObjs.display');
        performance.measure('hashCache.display'    , 'START_hashCache.display'    , 'END_hashCache.display');
        performance.measure('drawTimings.display'  , 'START_drawTimings.display'  , 'END_drawTimings.display');
        performance.measure('bars.display'         , 'START_bars.display'         , 'END_bars.display');
        performance.measure('debug_total'          , 'START_debug_total'          , 'END_debug_total');
    },

    init: async function(){
        // Load the debug files.
        await (async ()=>{
            let relPath = ".";
            if(_APP.usingJSGAME){ relPath = "./games/JSGAME_Uno"; }
            await new Promise( async (res,rej) => { await _APP.utility.addFile({f:"css/debug.css", t:"css"   }, relPath); res(); } );
            await new Promise( async (res,rej) => { await _APP.utility.addFile({f:"js/debug2.js" , t:"js"    }, relPath); res(); } );
            await new Promise( async (res,rej) => { 
                // Create the debug nav tab and view.
                let navBar1Tabs  = document.getElementById("controls_navBarTabs1");
                let navBar1Views = document.getElementById("controls_navBarViews");
                
                // Tab
                let tab = document.createElement("div");
                tab.id = "controls_navBar1_tab_debug1"; 
                tab.classList.add("controls_navBarTabs");
                tab.innerText = "DEBUG";
                
                // View
                let view = document.createElement("div");
                view.id = "controls_navBar1_view_debug1"; 
                view.classList.add("controls_navBarViews");
                
                // Inner debug div
                let innerDebugDiv = document.createElement("div");
                innerDebugDiv.id = "debug";
                
                // Append
                view.append(innerDebugDiv);
                navBar1Tabs.append(tab);
                navBar1Views.append(view);
    
                // Add the HTML to the inner debug div.
                let data = await _APP.utility.addFile({f:"debug.html"  , t:"html"  }, relPath); 
                innerDebugDiv.innerHTML = data;
    
                // Move the alwaysVisible div to the bottom of controls.
                // document.getElementById("controls").append( document.getElementById("debug_test_alwaysVisible") ); 
                
                // Move the alwaysVisible div below the canvav output.
                // document.getElementById("outputContainer").append( document.getElementById("debug_test_alwaysVisible") ); 
    
                // Move the debug_test_gamestates to the side of the game output.
                // document.getElementById("outputContainer").append( document.getElementById("debug_test_gamestates") ); 
                document.getElementById("outputContainer").append( document.getElementById("debug_sideDiv") ); 
    
                // Init init2.
                let ts_init2 = performance.now(); 
                await _DEBUG2.init();
                ts_init2 = performance.now() - ts_init2;

                res(); 
            } );
        })();

        // Load the grid canvas.
        this.gridCanvas.init();

        // Load the Color Finder.
        this.colorFinder.init();
        
        // Load the toggle buttons.
        this.toggleButtons1.init();
        
        // Load the fade.
        this.fade.init();

        // Load the gamestateChanger.
        this.gamestateChanger.init();

        // Load the showGamestate.
        this.showGamestate.init();
        
        // Load the navBar1 tabs.
        this.navBar1.init();
        // _DEBUG.navBar1.showOne("view_colorFinder");
        // _DEBUG.navBar1.showOne("view_drawStats");
        _DEBUG.navBar1.showOne("view_fade");
        // _DEBUG.navBar1.showOne("view_hashCacheStats1");
        // _DEBUG.navBar1.showOne("view_layerObjects");
        // _DEBUG.navBar1.showOne("view_layerObjEdit");
        
        // Load the HashCache viewer.
        this.hashCache.init();

        // Load the LayerObjects viewer.
        this.layerObjs.init();

        // Load the drawTimings viewer.
        this.drawTimings.init();
        
        // Load the updateTimingBars.
        this.updateTimingBars.init();
        
        // Load the navBar3 tabs.
        this.navBar3.init();
        // _DEBUG.navBar3.showOne("view_all_base"); 
        // _DEBUG.navBar3.showOne("view_perm_base");
        // _DEBUG.navBar3.showOne("view_temp_base"); 
        _DEBUG.navBar3.showOne("view_all_copy");
        // _DEBUG.navBar3.showOne("view_temp"); 
        // _DEBUG.navBar3.showOne("view_temp_copy");

        // Set the output scaling (only in debug mode.)
        let scaleSlider = document.getElementById("scaleSlider");
        scaleSlider.value = "2.5";
        scaleSlider.dispatchEvent(new Event("input"));

        // DEBUG DOM:
        // this.DOM.debug_timings_total         = document.getElementById("debug_timings_total");
        // this.DOM.debug_timings_hashCache     = document.getElementById("debug_timings_hashCache");
        // this.DOM.debug_timings_layerObjs     = document.getElementById("debug_timings_layerObjs");
        // this.DOM.debug_timings_drawTimings   = document.getElementById("debug_timings_drawTimings");
        // this.DOM.debug_timings_bars          = document.getElementById("debug_timings_bars");
        // this.DOM.debug_timings_showGamestate = document.getElementById("debug_timings_showGamestate");
    },
};