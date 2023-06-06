// @ts-nocheck

var _DEBUG = {
};

_DEBUG.init = async function(){
    return new Promise(async (resolve,reject)=>{
        await _new_DEBUG.init();

        // _DEBUG.timingsDisplay.gfx.init();
        // _DEBUG.timingsDisplay.loop.init();
        // _DEBUG.timingsDisplay.debug.init();

        // Init init2.
        let ts_init2 = performance.now(); 
        await _DEBUG2.init();
        ts_init2 = performance.now() - ts_init2;
        
        resolve();
    });
}

var _new_DEBUG = {
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
            toggleCacheButton: null,
        },
        setCurrentStates: function(){
            let checks = [
                { check: !_new_DEBUG.gridCanvas.canvas.classList.contains("displayNone"), elem: this.DOM["gridCanvasButton"] },
                { check:  _APP.game.gameLoop.running,                                     elem: this.DOM["toggleGameLoop"] },
                { check: !_APP.game.gameLoop.skipLogic,                                   elem: this.DOM["toggleLogic"] },
                { check:  _APP.configObj.awaitDraw,                                       elem: this.DOM["awaitDraw"] },
                { check:  _APP.debugActive,                                               elem: this.DOM["debugButton"] },
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
            this.DOM.toggleCacheButton = document.getElementById("debug_toggleCacheFlag");
            
            // Add toggle logic/event listeners.

            // SHOW GRID
            this.DOM.gridCanvasButton.addEventListener("click", ()=>{
                let home = _new_DEBUG.gridCanvas;
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
            this.DOM.debugButton.addEventListener("click", ()=>{ 
                _APP.debugActive = !_APP.debugActive;
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
                _WEBW_V.SEND("_DEBUG.toggleDebugFlag", { 
                    data: { debugActive: _APP.debugActive }, 
                    refs:[]
                }, false, false);
            }, false);

            // HASH CACHE
            this.DOM.toggleCacheButton.addEventListener("click", ()=>{ 
                _APP.configObj.disableCache = !_APP.configObj.disableCache;
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
                _WEBW_V.SEND("_DEBUG.toggleCacheFlag", { 
                    data: { disableCache: _APP.configObj.disableCache }, 
                    refs:[]
                }, false, false);
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
            _new_DEBUG.updateIfChanged(this.DOM.GS1Text        , _APP.game.gs1.trim() );
            _new_DEBUG.updateIfChanged(this.DOM.GS2Text        , _APP.game.gs2.trim() );

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

            // hashCacheStats1                         : {},
            // hashCacheStats1_hashCacheHashBASEsInUse : [],
            // hashCacheStats1_hashCacheHashesInUse    : [],
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
            // lastNormalrun
            // lastNormalrunWait
            // if(!this.values.lastForcedrun || performance.now() - this.values.lastForcedrun > this.values.lastForcedrunWait){
            // this.values.lastForcedrun = performance.now();

            let updated1 = _new_DEBUG.hashCache.displayTop(data);
            let updated2 = _new_DEBUG.hashCache.displayBottom(data);
            if(forced || updated1 || updated2){
                let newText = `Refreshed: ${this.getFormattedDateTime()}`;
                if(this.DOM.refreshLast.innerText != newText){
                    this.DOM.refreshLast.innerText = newText;
                }
            }
        },
        // Display of updated data.
        displayTop: function(newData){
            performance.mark('displayTop_Start');

            let top_changes = [];
            let lhcs2 = newData.hashCacheStats2;

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

                performance.mark('displayTop_End');
                performance.measure('displayTop', 'displayTop_Start', 'displayTop_End');

                return true;
            }

            performance.mark('displayBottom_End');
            performance.measure('displayTop', 'displayTop_Start', 'displayTop_End');
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
            let div_container = document.createElement("div");
            div_container.classList.add("hashCacheStats1_entry");
            div_container.setAttribute("hashCacheHash", rec.hashCacheHash);
            div_container.setAttribute("hashCacheHash_BASE", rec.hashCacheHash_BASE);
            div_container.setAttribute("relatedMapKey", rec.relatedMapKey);
            div_container.setAttribute("origin", rec.origin);
            // div_container.setAttribute("origin", rec.origin);

            // if(rec.text){ _GFX.currentData[layer].tilemaps[tilemapKey].text = tilemap.text; }

            let settingsDifferences = this.getSettingsDifferences(_GFX.defaultSettings, rec.settings);
            let activeSettingsArray = [];
            let activeSettings = ``;
            for(let key in settingsDifferences){
                activeSettingsArray.push(`${key}:${settingsDifferences[key]}`);
            }
            activeSettings = activeSettingsArray.join(", ");
            // console.log(rec);
            div_container.innerText = `` +
            `'${rec.relatedMapKey ? (rec.relatedMapKey+"'").padEnd(18, " ") : ("CUSTOM'").padEnd(20, " ") }` +
            `'${(rec.ts+"'").padEnd(14, " ")} w:${rec.w}, h:${rec.h}` +
            `\n  Bytes: ${(rec.hashCacheDataLength/1000).toFixed(2)} KB, genTime: ${rec.genTime.toFixed(2)} ms` + 
            `\n` +
            `${activeSettings ? "  " + activeSettings + "" : ""}` +
            `\n` +
            `${rec.text ? "  (TEXT): '" + rec.text.slice(0, 40) + "'" : ""}` +
            `\n` +
            ``;

            if(rec.text){ div_container.title = rec.text; }

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
            performance.mark('displayBottom_Start');

            let hasChanges = false;

            // Gather data.
            let data = this.createDisplayBottomData(newData);

            // Checkly end if there are no changes.
            if(
                !data.hasChanges.BASE_ALL  &&
                !data.hasChanges.COPY_ALL  &&
                !data.hasChanges.BASE_PERM &&
                !data.hasChanges.BASE_TEMP
            ){
                performance.mark('displayBottom_End');
                performance.measure('displayBottom', 'displayBottom_Start', 'displayBottom_End');

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
                    if( oldCount.innerText != newCount.size){ oldCount.innerText = newCount.size; }

                    // Get the removals.
                    data.removals[key]  = new Set([...this.values.last_hashCacheStats2[key1][key2]].filter(x => !newData.hashCacheStats2[key1][key2].has(x)));
                    
                    // Get the additions.
                    data.additions[key] = new Set([...newData.hashCacheStats2[key1][key2]]         .filter(x => !this.values.last_hashCacheStats2[key1][key2].has(x)));
                    
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
                        let cacheObj = newData.partial_hashCache.get(hash);
                        // After a hashCache clear it is very possible that the cacheObj does not have the former entries. 
                        if(!cacheObj){
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
                        // else if(!cacheObj.text){ 
                            // continue; 
                        // }
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
                        let cacheObj = newData.partial_hashCache.get(hash);
                        // if(!cacheObj.text){ continue; }
                        let entry = this.createEntryDiv(cacheObj);
                        if     (cacheObj.origin == fragKeys[0]){ data.fragments[key][fragKeys[0]].prepend(entry); count1 += 1; }
                        else if(cacheObj.origin == fragKeys[1]){ data.fragments[key][fragKeys[1]].prepend(entry); count2 += 1; }
                        else if(cacheObj.origin == fragKeys[2]){ data.fragments[key][fragKeys[2]].prepend(entry); count3 += 1; }
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

            performance.mark('displayBottom_End');
            performance.measure('displayBottom', 'displayBottom_Start', 'displayBottom_End');

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
                    await _WEBW_V.SEND("_DEBUG.updateDebugTimings", { 
                        data: { }, 
                        refs:[]
                    }, false, true);
                }
            }, false);

            // delegatedListener
            this.DOM.debug_navBarViews3 = document.getElementById("debug_navBarViews3");
            this.DOM.debug_navBarViews3.addEventListener("click", (e)=>this.delegatedListener(e), true);
        },
    },
    // Manages the LayerObjs viewer/editor.
    layerObjs : {
        DOM:{
            "contextMenu1": "debug_layerObjEdit_contextMenu1",

            // SHARED
            "className"   : "debug_layerObjEdit_contextMenu1_className",
            "tilesetKey"  : "debug_layerObjEdit_contextMenu1_tilesetKey",
            "layerKey"    : "debug_layerObjEdit_contextMenu1_layerKey",
            "gs"          : "debug_layerObjEdit_contextMenu1_gs",
            "layerObjKey" : "debug_layerObjEdit_contextMenu1_layerObjKey",
            "x"           : "debug_layerObjEdit_contextMenu1_x",
            "y"           : "debug_layerObjEdit_contextMenu1_y",
            "rotation"    : "debug_layerObjEdit_contextMenu1_rotation", 
            
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
            
            // PRINTTEXT
            "printTextTableDiv"   : "debug_printTextTableDiv",
            "printText_newText"   : "debug_printText_newText",
            "printText_attributes": "debug_printText_attributes",
            
            // CARD
            "cardTableDiv" : "debug_cardTableDiv",
            "cardTable_attributes" : "debug_cardTable_attributes",
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
            else if(_new_DEBUG.navBar1){
                _new_DEBUG.navBar1.showOne("view_layerObjEdit")
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
        display: function(forced){
            // Do not update if the tab is not active.
            let tab = document.getElementById("debug_navBar1_tab_layerObjects");
            if(!tab.classList.contains("active")){ 
                // console.log("tab not active"); 
                return false; 
            }

            // lastNormalrun
            // lastNormalrunWait
            let updated1;
            if(forced || !this.lastForcedrun || performance.now() - this.lastForcedrun > this.lastForcedrunWait){
                this.lastForcedrun = performance.now();
                updated1 = this.displayLayerObjects();
            }

            if(updated1){
                let newText = `Refreshed: ${this.getFormattedDateTime()}`;
                if(this.DOM.refreshLast.innerText != newText){
                    this.DOM.refreshLast.innerText = newText;
                    return true;
                }
                else{
                    // console.log("1 layerObjs: no display update needed.");
                    return false;
                }
            }
            else{
                // console.log("2 layerObjs: no display update needed.");
            }
            return false;
        },
        displayLayerObject_console: function(gs, key){
            data = _GFX.layerObjs.objs[gs][key];
            console.log(`LAYER OBJECT ENTRY: gs: '${gs}', key: '${key}'`);
            console.log("  ", data);
            console.log(`  ACCESS: _GFX.layerObjs.objs['${gs}']['${key}']`);
        },
        displayLayerObjects: function(){
            // Display the layerObjects for the current gamestate.
            // Display the layeKeys in reverse order (L4 on top.)
            // Display the layerObjects in reverse draw order (last on top.)
            // let tab = document.getElementById("debug_navBar1_tab_layerObjects");
            // if(!tab.classList.contains("active")){ return false; }

            let elem = document.getElementById("layerObjectList1");
            if(!elem.hasAttribute("onmouseleave")){
                elem.setAttribute("onmouseleave", "_new_DEBUG.layerObjs.highlightOnHover(0, 0, 0, 0, 0);"); 
            }
    
            // If the gamestate key is not in layerObjs then return.
            if(! ( _APP.game.gs1 in _GFX.layerObjs.objs ) ){ return false; }
    
            // Get the list of layer keys and reverse them. 
            let layerKeys = Object.keys(_GFX.currentData).reverse();
            
            // Get the list of layerObject keys and reverse them. 
            let layerObjKeys = Object.keys(_GFX.layerObjs.objs[_APP.game.gs1]).reverse();
    
            // Get the current text.
            let oldHash = elem.getAttribute("hash");
            let newText = ``;
    
            // Go through all layer keys.
            let layerTextSet = false;
            let coords;
            let name;
            let dims;
            let rotation;
            let settings;
            let fade;
    
            // TODO:
            // oncontextmenu="event.preventDefault(); _DEBUG.loadLayerObj(gs_PLAYING, deckControl);"
    
            let firstLayer = true; 
            for(let layerKey of layerKeys){ 
                layerTextSet = false;
    
                // Go through all layerObjects for this gamestate.
                for(let layerObjKey of layerObjKeys){ 
                    // Break-out the data.
                    data = _GFX.layerObjs.objs[_APP.game.gs1][layerObjKey];
                    
                    // Only work with layerObjs on the current layer. 
                    if(data.layerKey == layerKey){
                        // Display the layer header?
                        if(!layerTextSet){ 
                            if(!firstLayer){
                                newText += "\n" + `LAYER: ${data.layerKey}:\n`; layerTextSet = true; 
                            }
                            else{
                                newText += `LAYER: ${data.layerKey}:\n`; layerTextSet = true; 
                                firstLayer = false; 
                            }
                            
                        }
                        
                        let w = data.tmap[0];
                        let h = data.tmap[1];
                        let x = data.x;
                        let y = data.y;
                        if(data.xyByGrid){
                            w = w * _APP.configObj.dimensions.tileWidth;
                            h = h * _APP.configObj.dimensions.tileHeight;
                            x = x * _APP.configObj.dimensions.tileWidth;
                            y = y * _APP.configObj.dimensions.tileHeight;
                        }
                        // coords = `${data.x.toString().padStart(3, " ")}, ${data.y.toString().padStart(3, " ")}`;
                        coords     = `x: ${data.x}, y: ${data.y}`;
                        name       = `${layerObjKey.padEnd(16, " ")}`;
                        dims       = `w: ${w}, h: ${h}`;
                        fade = data.settings.fade;
                        fade = typeof fade !== "number" ? "OFF" : fade;
    
                        let settingsDifferences = this.getSettingsDifferences(_GFX.defaultSettings, data.settings);
                        let activeSettingsArray = [];
                        let settings = ``;
                        for(let key in settingsDifferences){
                            activeSettingsArray.push(`${key}:${settingsDifferences[key]}`);
                        }
                        settings = activeSettingsArray.join(", ");
    
                        // settings = `fade: ${fade}, xFlip: ${data.settings.xFlip?"ON ":"OFF"}, yFlip: ${data.settings.yFlip?"ON ":"OFF"}, rotation: ${data.settings.rotation??0}`;
    
                        // Update the newText string.
                        newText += `<div ` +
                        `onmouseenter="_new_DEBUG.layerObjs.highlightOnHover(${x}, ${y}, ${w}, ${h}, ${data.settings.rotation});"` + 
                        `oncontextmenu="event.preventDefault(); _new_DEBUG.layerObjs.contextMenu1_open(event, '${_APP.game.gs1}','${layerObjKey}');" ` +
                        `onclick="_new_DEBUG.layerObjs.displayLayerObject_console('${_APP.game.gs1}','${layerObjKey}');" ` +
                        `class="layerObjectsStats1_entry">` +
                        `${name} : ${data.className}\n  (${coords} ${dims})` +
                        `\n  ${settings}` + 
                        `\n  ` + 
                        `${data.text ? "(TEXT): '" + data.text.slice(0, 40) + "'" : ""}` +
                        `</div>`;
                    }
                }
            }
    
            // If the newText is different than the currentText replace the elem.innerText with the newText.
            let newHash = _GFX.utilities.djb2Hash( newText );
            if(oldHash != newHash){
                // console.log("Changing", maxLen);
                elem.innerHTML = newText;
                elem.setAttribute("hash", newHash);
                return true;
            }
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
            this.DOM.fpsDisplay     = document.getElementById("debug_fpsDisplay");
            this.DOM.frameCounter     = document.getElementById("debug_frameCounter");
            this.DOM.frameDrawCounter = document.getElementById("debug_frameDrawCounter");
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
            _new_DEBUG.updateIfChanged(this.DOM.frameCounter    , (_APP.game.gameLoop.frameCounter/1000).toFixed(1)+"k" );
            _new_DEBUG.updateIfChanged(this.DOM.frameDrawCounter, (_APP.game.gameLoop.frameDrawCounter/1000).toFixed(1)+"k" );

            // Tilemap counts per layer. 
            _new_DEBUG.updateIfChanged(this.DOM.L1_tms, Object.keys(_GFX.currentData["L1"].tilemaps).length.toString() );
            _new_DEBUG.updateIfChanged(this.DOM.L2_tms, Object.keys(_GFX.currentData["L2"].tilemaps).length.toString() );
            _new_DEBUG.updateIfChanged(this.DOM.L3_tms, Object.keys(_GFX.currentData["L3"].tilemaps).length.toString() );
            _new_DEBUG.updateIfChanged(this.DOM.L4_tms, Object.keys(_GFX.currentData["L4"].tilemaps).length.toString() );

            // Current FPS.
            // Show average FPS, average ms per frame, how much off is the average ms per frame.
            let new_average       = _APP.game.gameLoop.fpsCalc.average.toFixed(0) ?? 0;
            let new_avgMsPerFrame = _APP.game.gameLoop.fpsCalc.avgMsPerFrame.toFixed(1) ?? 0;
            let msDiff            = (_APP.game.gameLoop.fpsCalc.avgMsPerFrame - _APP.game.gameLoop.msFrame).toFixed(1);
            testText = `AVG: ${new_average}, MS: ${new_avgMsPerFrame}, DELTA: ${msDiff}`;
            _new_DEBUG.updateIfChanged(this.DOM.fpsDisplay, testText);

            // Last draw: Individual timings.
            _new_DEBUG.updateIfChanged(this.DOM.timings_TOTAL_L1,  newData.ALLTIMINGS["L1___TOTAL"]            .toFixed(1)+"");
            _new_DEBUG.updateIfChanged(this.DOM.timings_A_L1,      newData.ALLTIMINGS["L1_A_clearLayer"]       .toFixed(1)+"");
            _new_DEBUG.updateIfChanged(this.DOM.timings_B_L1,      newData.ALLTIMINGS["L1_B_clearRemovedData"] .toFixed(1)+"");
            _new_DEBUG.updateIfChanged(this.DOM.timings_C_L1,      newData.ALLTIMINGS["L1_C_createTilemaps"]   .toFixed(1)+"");
            _new_DEBUG.updateIfChanged(this.DOM.timings_D_L1,      newData.ALLTIMINGS["L1_D_drawFromDataCache"].toFixed(1)+"");
            _new_DEBUG.updateIfChanged(this.DOM.timings_E_L1,      newData.ALLTIMINGS["L1_E_drawImgDataCache"] .toFixed(1)+"");
            _new_DEBUG.updateIfChanged(this.DOM.timings_TOTAL_L2,  newData.ALLTIMINGS["L2___TOTAL"]            .toFixed(1)+"");
            _new_DEBUG.updateIfChanged(this.DOM.timings_A_L2,      newData.ALLTIMINGS["L2_A_clearLayer"]       .toFixed(1)+"");
            _new_DEBUG.updateIfChanged(this.DOM.timings_B_L2,      newData.ALLTIMINGS["L2_B_clearRemovedData"] .toFixed(1)+"");
            _new_DEBUG.updateIfChanged(this.DOM.timings_C_L2,      newData.ALLTIMINGS["L2_C_createTilemaps"]   .toFixed(1)+"");
            _new_DEBUG.updateIfChanged(this.DOM.timings_D_L2,      newData.ALLTIMINGS["L2_D_drawFromDataCache"].toFixed(1)+"");
            _new_DEBUG.updateIfChanged(this.DOM.timings_E_L2,      newData.ALLTIMINGS["L2_E_drawImgDataCache"] .toFixed(1)+"");
            _new_DEBUG.updateIfChanged(this.DOM.timings_TOTAL_L3,  newData.ALLTIMINGS["L3___TOTAL"]            .toFixed(1)+"");
            _new_DEBUG.updateIfChanged(this.DOM.timings_A_L3,      newData.ALLTIMINGS["L3_A_clearLayer"]       .toFixed(1)+"");
            _new_DEBUG.updateIfChanged(this.DOM.timings_B_L3,      newData.ALLTIMINGS["L3_B_clearRemovedData"] .toFixed(1)+"");
            _new_DEBUG.updateIfChanged(this.DOM.timings_C_L3,      newData.ALLTIMINGS["L3_C_createTilemaps"]   .toFixed(1)+"");
            _new_DEBUG.updateIfChanged(this.DOM.timings_D_L3,      newData.ALLTIMINGS["L3_D_drawFromDataCache"].toFixed(1)+"");
            _new_DEBUG.updateIfChanged(this.DOM.timings_E_L3,      newData.ALLTIMINGS["L3_E_drawImgDataCache"] .toFixed(1)+"");
            _new_DEBUG.updateIfChanged(this.DOM.timings_TOTAL_L4,  newData.ALLTIMINGS["L4___TOTAL"]            .toFixed(1)+"");
            _new_DEBUG.updateIfChanged(this.DOM.timings_A_L4,      newData.ALLTIMINGS["L4_A_clearLayer"]       .toFixed(1)+"");
            _new_DEBUG.updateIfChanged(this.DOM.timings_B_L4,      newData.ALLTIMINGS["L4_B_clearRemovedData"] .toFixed(1)+"");
            _new_DEBUG.updateIfChanged(this.DOM.timings_C_L4,      newData.ALLTIMINGS["L4_C_createTilemaps"]   .toFixed(1)+"");
            _new_DEBUG.updateIfChanged(this.DOM.timings_D_L4,      newData.ALLTIMINGS["L4_D_drawFromDataCache"].toFixed(1)+"");
            _new_DEBUG.updateIfChanged(this.DOM.timings_E_L4,      newData.ALLTIMINGS["L4_E_drawImgDataCache"] .toFixed(1)+"");
            _new_DEBUG.updateIfChanged(this.DOM.timings_TOTAL_ALL, newData.ALLTIMINGS["gfx"].toFixed(1)+" ms");
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

    // TODO
    updateTimingBars: {
        DOM: {
            debug_progressBar_canvas: null
        },
        ctx: null,
        positions: {
            "debugBar": { x:80, y:5+0  , w:540, h:20 },
            "LoopBar" : { x:80, y:5+30 , w:540, h:20 },
            "GfxBar"  : { x:80, y:5+60 , w:540, h:20 },
        },
        mapToWidth: function(value, maxWidth) {
            canvasWidth = maxWidth; // this.ctx.canvas.width;

            // Make sure the value is clamped between 0 and 100
            value = Math.max(0, Math.min(100, value));

            // Map the value to the width of the canvas
            return ((value / 100) * canvasWidth) << 0;
        },
        updateOneBar: function(barKey, newValue, newValue2=""){
            // Get the bar dimensions/position.
            let pos = this.positions[barKey];

            // Map the newValue to fit the bar. 
            let newWidth = this.mapToWidth(newValue, pos.w);

            // Clear this bar.
            this.ctx.clearRect(pos.x, pos.y, pos.w, pos.h);

            // Draw the outer rectangle.
            this.ctx.strokeStyle = '#000';
            this.ctx.strokeRect(pos.x-3, pos.y-3, pos.w+6, pos.h+6);
            
            // Draw the inner filled rectangle.
            this.ctx.fillStyle = '#ddd';
            this.ctx.fillRect(pos.x, pos.y, newWidth, pos.h);
            
            // Draw the newValue and newValue2 in the center of the bar.
            this.ctx.font = '15px Courier New, monospace';
            this.ctx.fillStyle = '#000';
            this.ctx.textAlign = "center";     // Center the text horizontally
            this.ctx.fillText(newValue.toFixed(2)+"% " + newValue2 +"", pos.x + (pos.w / 2), pos.y + (pos.h / 2));
        },
        init: function(){
            // Save the DOM.
            this.DOM.progressBar_canvas = document.getElementById("debug_progressBar_canvas");

            // Get device pixel ratio
            let dpr = window.devicePixelRatio || 1;

            // Set the size of the canvas in pixels, taking into account the device pixel ratio
            this.DOM.progressBar_canvas.width  = this.DOM.progressBar_canvas.width * dpr;
            this.DOM.progressBar_canvas.height = this.DOM.progressBar_canvas.height * dpr;

            // Set the size of the canvas in CSS pixels
            this.DOM.progressBar_canvas.style.width = (this.DOM.progressBar_canvas.width / dpr) + "px";
            this.DOM.progressBar_canvas.style.height = (this.DOM.progressBar_canvas.height / dpr) + "px";

            this.ctx = this.DOM.progressBar_canvas.getContext("2d");

            // Scale all drawing operations by the dpr
            this.ctx.scale(dpr, dpr);
            this.ctx.translate(0.5, 0.5);

            // Clear the canvas
            this.ctx.clearRect(0, 0, this.DOM.progressBar_canvas.width / dpr, this.DOM.progressBar_canvas.height / dpr);

            // Draw the labels.
            this.ctx.fillStyle = '#000';
            this.ctx.font = 'bold 15px Courier New, monospace';
            this.ctx.textAlign = "left";     // 
            this.ctx.textBaseline = "middle";  // Center the text vertically
            this.ctx.fillText("DEBUG", 5, this.positions.debugBar.y + this.positions.debugBar.h -8);
            this.ctx.fillText("LOOP", 5, this.positions.LoopBar.y   + this.positions.LoopBar.h  -8);
            this.ctx.fillText("DRAW", 5, this.positions.GfxBar.y    + this.positions.GfxBar.h   -8);

            // Draw the initial bars display.
            this.updateOneBar("debugBar", 0);
            this.updateOneBar("LoopBar" , 0);
            this.updateOneBar("GfxBar"  , 0);
        },

        last_debugTime: 0,
        last_loopTime : 0,
        last_drawTime : 0,

        display: function(newData){
            // Calculate the new debugTime, loopTime, and drawTime
            let debugTime = (100*(_APP.utility.timeIt("debug_total", "get") / _APP.game.gameLoop.msFrame));
            let loopTime  = (100*(_APP.game.gameLoop.lastLoop_timestamp     / _APP.game.gameLoop.msFrame));
            let drawTime  = (100*( newData.ALLTIMINGS.gfx                   / _APP.game.gameLoop.msFrame));
        
            // Ensure the new values are within the range 0 - 100.
            debugTime = Math.max(0, Math.min(100, debugTime));
            loopTime  = Math.max(0, Math.min(100, loopTime));
            drawTime  = Math.max(0, Math.min(100, drawTime));
        
            // Update the bars with new times.
            this.updateOneBar("debugBar", debugTime, `${_APP.utility.timeIt("debug_total", "get").toFixed(1)} ms`);
            this.updateOneBar("LoopBar" , loopTime ,  `${_APP.game.gameLoop.lastLoop_timestamp.toFixed(1)} ms`);
            this.updateOneBar("GfxBar"  , drawTime ,  `${ newData.ALLTIMINGS.gfx.toFixed(1)} ms`);
        
            // Update the last times. 
            this.last_debugTime = debugTime;
            this.last_loopTime  = loopTime;
            this.last_drawTime  = drawTime;
        }
    },

    // UTILITY.
    updateIfChanged: function(elem, newValue, method="innerText"){
        if(elem[method].trim() != newValue.toString().trim()){ elem[method] = newValue.toString().trim(); }
    },

    // ** DEBUG TASK RUNNER **
    // ***********************

    // runDebug_wait: 1000 * 0.25, // 0.25 seconds
    // runDebug_wait: 1000 * 0.5, // 0.5 seconds
    runDebug_wait: 1000 * 0.75, // 0.75 seconds
    // runDebug_wait: 1000 * 1, // 1 seconds
    // runDebug_wait: 1000 * 2, // 2 seconds
    // runDebug_wait: 1000 * 3, // 3 seconds
    // runDebug_wait: 1000 * 4, // 4 seconds
    // runDebug_wait: 1000 * 5, // 5 seconds
    runDebug_last: 0,
    runDebug_lastDuration: 0,
    debugTasks: async function(){
        // Don't run debug until it is time. 
        let lastRunDiff = performance.now() - this.runDebug_last;
        if( !(this.runDebug_last == 0 | lastRunDiff > this.runDebug_wait) ){
            // console.log("not ready", lastRunDiff.toFixed(2), this.runDebug_wait);
            return;
        }
        // Store the timestamp for the next run.
        this.runDebug_last = performance.now();
        // console.log("RUNNING");

        let ts = performance.now();
        _APP.utility.timeIt("debug_total", "start");

        // Set the debug is running flag.
        _DEBUG.debugRunning = true; 

        // Reset timers.
        _APP.utility.timeIt("_DEBUG.updateDebugTimings", "reset");
        _APP.utility.timeIt("layerObjs.display", "reset");
        _APP.utility.timeIt("hashCache.display", "reset");
        _APP.utility.timeIt("drawTimings.display", "reset");
        _APP.utility.timeIt("bars.display", "reset");
        _APP.utility.timeIt("showGamestate.display", "reset");

        // Determine if data needs to be requested.

        let doDataRequest = false;
        if(document.getElementById("debug_navBar1_tab_drawStats")      .classList.contains("active")){ doDataRequest = true; }
        if(document.getElementById("debug_navBar1_tab_hashCacheStats1").classList.contains("active")){ doDataRequest = true; }
        if(document.getElementById("debug_navBar1_tab_drawStats")      .classList.contains("active")){ doDataRequest = true; }
        doDataRequest = true;

        // REQUEST TIMING DATA.
        let newData;
        if(doDataRequest){
            _APP.utility.timeIt("_DEBUG.updateDebugTimings", "start");
            newData = await _WEBW_V.SEND("_DEBUG.updateDebugTimings", {
                data:{},
                refs:[]
            }, true, true);
            newData = newData.data;
            _APP.utility.timeIt("_DEBUG.updateDebugTimings", "stop");
        }

        // showGamestate VIEWER
        _APP.utility.timeIt("showGamestate.display", "start");
        _new_DEBUG.showGamestate.display(false);
        _APP.utility.timeIt("showGamestate.display", "stop");

        // LAYER OBJECTS VIEWER/EDITOR
        _APP.utility.timeIt("layerObjs.display", "start");
        _new_DEBUG.layerObjs.display(false);
        _APP.utility.timeIt("layerObjs.display", "stop");
        
        // HASH CACHE VIEWER
        if(doDataRequest){
            _APP.utility.timeIt("hashCache.display", "start");
            _new_DEBUG.hashCache.display(newData, false);
            _APP.utility.timeIt("hashCache.display", "stop");
        }
        
        // DRAW TIMINGS
        if(doDataRequest){
            _APP.utility.timeIt("drawTimings.display", "start");
            _new_DEBUG.drawTimings.display(newData, false);
            _APP.utility.timeIt("drawTimings.display", "stop");
        }
        
        // DONE. 
        this.runDebug_lastDuration = performance.now() - ts;
        _APP.utility.timeIt("debug_total", "stop");

        // BARS
        _APP.utility.timeIt("bars.display", "start");
        _new_DEBUG.updateTimingBars.display(newData, false);
        _APP.utility.timeIt("bars.display", "stop");

        // Update changed elements. 
        this.updateIfChanged(document.getElementById("debug_timings_total")        , _APP.utility.timeIt("debug_total"              , "get").toFixed(1) + " ms");
        this.updateIfChanged(document.getElementById("debug_timings_doDataRequest"), doDataRequest ? "YES" : "NO");
        this.updateIfChanged(document.getElementById("debug_timings_dataRequest")  , _APP.utility.timeIt("_DEBUG.updateDebugTimings", "get").toFixed(1) + " ms");
        this.updateIfChanged(document.getElementById("debug_timings_hashCache")    , _APP.utility.timeIt("hashCache.display"        , "get").toFixed(1) + " ms");
        this.updateIfChanged(document.getElementById("debug_timings_layerObjs")    , _APP.utility.timeIt("layerObjs.display"        , "get").toFixed(1) + " ms");
        this.updateIfChanged(document.getElementById("debug_timings_drawTimings")  , _APP.utility.timeIt("drawTimings.display"      , "get").toFixed(1) + " ms");
        this.updateIfChanged(document.getElementById("debug_timings_bars")         , _APP.utility.timeIt("bars.display"             , "get").toFixed(1) + " ms");
        this.updateIfChanged(document.getElementById("debug_timings_showGamestate"), _APP.utility.timeIt("showGamestate.display"    , "get").toFixed(1) + " ms");

        // if(this.runDebug_lastDuration > 8){
            // console.log(
            //     `DEBUG took this long: ${this.runDebug_lastDuration.toFixed(2)} ms` + 
            //     `\n  _DEBUG.updateDebugTimings: ${_APP.utility.timeIt("_DEBUG.updateDebugTimings", "get").toFixed(2)} ms` +
            //     `\n  layerObjs.display        : ${_APP.utility.timeIt("layerObjs.display", "get").toFixed(2)} ms` +
            //     `\n  hashCache.display        : ${_APP.utility.timeIt("hashCache.display", "get").toFixed(2)} ms` +
            //     `\n  drawTimings.display      : ${_APP.utility.timeIt("drawTimings.display", "get").toFixed(2)} ms` +
            //     ``
            // );
        // }
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
        // _new_DEBUG.navBar1.showOne("view_colorFinder");
        _new_DEBUG.navBar1.showOne("view_drawStats");
        // _new_DEBUG.navBar1.showOne("view_fade");
        // _new_DEBUG.navBar1.showOne("view_hashCacheStats1");
        // _new_DEBUG.navBar1.showOne("view_layerObjects");
        // _new_DEBUG.navBar1.showOne("view_layerObjEdit");
        
        // Load the hashCache.
        
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
        // _new_DEBUG.navBar3.showOne("view_all_base"); 
        // _new_DEBUG.navBar3.showOne("view_perm_base");
        // _new_DEBUG.navBar3.showOne("view_temp_base"); 
        _new_DEBUG.navBar3.showOne("view_all_copy");
        // _new_DEBUG.navBar3.showOne("view_temp"); 
        // _new_DEBUG.navBar3.showOne("view_temp_copy");

        // Set the output scaling (only in debug mode.)
        // let scaleSlider = document.getElementById("scaleSlider");
        // scaleSlider.value = "2.75";
        // scaleSlider.dispatchEvent(new Event("input"));

        // Start the debug loop.
        // setTimeout(()=>this.debugTasks(), 1000);

        console.log("new_DEBUG loaded");
    },
};