var _DEBUG = {
    gridCanvas: null,
    createGridCanvas: function(){
        // Copy the dimensions of the first canvas. 
        const canvas_src_BG1 = document.querySelector(".canvasLayer[name='BG1']");
    
        // Create a canvas for this layer.
        this.gridCanvas = document.createElement("canvas");
        this.gridCanvas.width  = canvas_src_BG1.width;
        this.gridCanvas.height = canvas_src_BG1.height;
        this.gridCanvas.id = "debug_grid_canvas";
        this.gridCanvas.style["z-index"] = "300";
        const ctx = this.gridCanvas.getContext('2d');
    
        // Add the class.
        this.gridCanvas.classList.add("canvasLayer");
        this.gridCanvas.classList.add("displayNone");
    
        const gridSize = 8;
        const offset = 0.5;
        ctx.lineWidth = 1;
        for (let x = 0; x <= this.gridCanvas.width; x += gridSize) {
          ctx.moveTo(x + offset, 0);
          ctx.lineTo(x + offset, this.gridCanvas.height);
        }
        for (let y = 0; y <= this.gridCanvas.height; y += gridSize) {
          ctx.moveTo(0, y + offset);
          ctx.lineTo(this.gridCanvas.width, y + offset);
        }
        ctx.strokeStyle = 'rgba(128,128,128, 1)';
        ctx.stroke();
    
        // Add a marker to every 5th square.
        ctx.fillStyle = 'rgba(128,128,128,1)';
        for (let x = 0; x <= this.gridCanvas.width; x += gridSize * 5) {
            for (let y = 0; y <= this.gridCanvas.height; y += gridSize * 5) {
                ctx.fillRect(
                    x + 3, 
                    y + 3, 
                    gridSize-5, 
                    gridSize-5
                );
            }
        }
    
        let outputDiv = document.getElementById("output");
        outputDiv.append(this.gridCanvas);
    
        document.getElementById("debug_test_toggleGridCanvas").addEventListener("click", ()=>_DEBUG.toggleGridCanvas(), false);
    },
    toggleGridCanvas: function(){
        this.gridCanvas.classList.toggle("displayNone");
    },

    gameLoopControl: function(){
        let stopGameLoop  = document.getElementById("debug_test_stopGameLoop");
        let startGameLoop = document.getElementById("debug_test_startGameLoop");
        let restartGS1 = document.getElementById("debug_test_restartGS1");
        let gotoGS_JSG = document.getElementById("debug_test_gotoGS_JSG");
        let gotoGS_N782 = document.getElementById("debug_test_gotoGS_N782");

        stopGameLoop .addEventListener("click", ()=>{ _APP.game.gameLoop.loop_stop(); }, false);
        startGameLoop.addEventListener("click", ()=>{ _APP.game.gameLoop.loop_start(); }, false);
        restartGS1.addEventListener("click", ()=>{ 
            _APP.game.gameLoop.loop_stop(); 
            _APP.game.gamestates[_APP.game.gs1].inited = false;
            _APP.game.gameLoop.loop_start(); 
        }, false);
        
        gotoGS_JSG .addEventListener("click", ()=>{ _APP.game.changeGs1("gs_JSG"); }, false);
        gotoGS_N782.addEventListener("click", ()=>{ _APP.game.changeGs1("gs_N782"); }, false);
    },
    
    waitForDrawControl: function(){
        let waitForDraw = document.getElementById("debug_test_toggleWaitForDraw");
        waitForDraw .addEventListener("click", ()=>{ 
            _APP.configObj.waitUntilFrameDrawn = !_APP.configObj.waitUntilFrameDrawn;
        }, false);
    },

    fadeHandler: function(){
        let fadeSliderALL     = document.getElementById("fadeSliderALL");
        let fadeSliderBG1     = document.getElementById("fadeSliderBG1");
        let fadeSliderBG2     = document.getElementById("fadeSliderBG2");
        let fadeSliderSP1     = document.getElementById("fadeSliderSP1");
        let fadeSliderTX1     = document.getElementById("fadeSliderTX1");
        let fadeSliderALLText = document.getElementById("fadeSliderALLText");
        let fadeSliderBG1Text = document.getElementById("fadeSliderBG1Text");
        let fadeSliderBG2Text = document.getElementById("fadeSliderBG2Text");
        let fadeSliderSP1Text = document.getElementById("fadeSliderSP1Text");
        let fadeSliderTX1Text = document.getElementById("fadeSliderTX1Text");

        function changeFade(layer, sliderElem, sliderTextElem) {
            let level;
            level = parseFloat(sliderElem.value);
            let level_text;
            
            if(level==0) { 
                _GFX.funcs.setFade(layer, null);
                level_text = "OFF"
            }
            else if(level==11){ 
                _GFX.funcs.setFade(layer, level-1);
                level_text = "BLACK";
            }
            else if(level==12){ 
                _GFX.funcs.setFade(layer, level-1);
                level_text = "CLEAR"; 
            }
            else{ 
                _GFX.funcs.setFade(layer, level-1); 
                level_text = `L:${(level-1).toString()}`;
            }

            sliderElem.title = `${layer}: ${level_text}`;
            // sliderTextElem.value = sliderElem.title;
            sliderTextElem.innerText = sliderElem.title;
        }
        changeFade("ALL", fadeSliderALL, fadeSliderALLText);
        changeFade("BG1", fadeSliderBG1, fadeSliderBG1Text);
        changeFade("BG2", fadeSliderBG2, fadeSliderBG2Text);
        changeFade("SP1", fadeSliderSP1, fadeSliderSP1Text);
        changeFade("TX1", fadeSliderTX1, fadeSliderTX1Text);

        fadeSliderALL.addEventListener("input", ()=>{ changeFade("ALL", fadeSliderALL, fadeSliderALLText); }, false);
        fadeSliderBG1.addEventListener("input", ()=>{ changeFade("BG1", fadeSliderBG1, fadeSliderBG1Text); }, false);
        fadeSliderBG2.addEventListener("input", ()=>{ changeFade("BG2", fadeSliderBG2, fadeSliderBG2Text); }, false);
        fadeSliderSP1.addEventListener("input", ()=>{ changeFade("SP1", fadeSliderSP1, fadeSliderSP1Text); }, false);
        fadeSliderTX1.addEventListener("input", ()=>{ changeFade("TX1", fadeSliderTX1, fadeSliderTX1Text); }, false);
    },

    toggleDebugFlag: function(){
        _APP.debugActive = !_APP.debugActive;
        _WEBW_V.SEND("_DEBUG.toggleDebugFlag", { 
            data: { debugActive: _APP.debugActive }, 
            refs:[]
        }, false, false);

        // Update the text on the button.
        let debug_toggleDebugActive = document.getElementById("debug_toggleDebugFlag");
        if(_APP.debugActive){
            debug_toggleDebugActive.innerText = "DEBUG: ON";
        }
        else{
            debug_toggleDebugActive.innerText = "DEBUG: OFF";
        }
    },
    elemsObj: {
        frameCounter       : { e: null, t:0 },
        frameDrawCounter   : { e: null, t:0 },
        fpsDisplay         : { e: null, t:0 },
        waitUntilFrameDrawn: { e: null, t:0 },
        debug_GS1Text      : { e: null, t:0 },
        debug_GS2Text      : { e: null, t:0 },
        DRAWNEEDED: { e: null, t: 0 },
        skipLogic: { e: null, t: 0 },
        time_LOOP   : { e0: null, e1: null, e2: null, t: 0 },
        time_LOGIC  : { e0: null, e1: null, e2: null, t: 0 },
        time_DRAW   : { e0: null, e1: null, e2: null, t: 0 },
    },
    cachedData : {
        changes: {
            "BG1": 0, 
            "BG2": 0, 
            "SP1": 0, 
            "TX1": 0, 
        }
    },
    elemsObjInit: function(){
        // Table 1.
        this.elemsObj.fpsDisplay.e    = document.getElementById("debug_fpsDisplay");
        this.elemsObj.debug_GS1Text.e = document.getElementById("debug_GS1Text");
        this.elemsObj.debug_GS2Text.e = document.getElementById("debug_GS2Text");
        
        // Table 2.
        this.elemsObj.frameCounter.e        = document.getElementById("debug_frameCounter");
        this.elemsObj.frameDrawCounter.e    = document.getElementById("debug_frameDrawCounter");
        this.elemsObj.waitUntilFrameDrawn.e = document.getElementById("debug_waitUntilFrameDrawn");
        this.elemsObj.DRAWNEEDED.e          = document.getElementById("debug_DRAWNEEDED");
        this.elemsObj.skipLogic.e           = document.getElementById("debug_skipLogic");
    },
    applyChange(newText, obj, activeTime, noTrim=false){
        // Trim the text.
        if(!noTrim){
            newText = newText.trim();
            oldText = obj.e.innerText.trim();
        }
        // Do not trim the text.
        else{
            newText = newText;
            oldText = obj.e.innerText;
        }

        // Determine if the active class can be removed once the old and new text match again.
        let canChange = (performance.now() - obj.t > activeTime) || obj.t == 0;

        // If the newText is different that the current text...
        if(oldText != newText){
            // Update the text.
            obj.e.innerText = newText;

            // Add the active class?
            if(!obj.e.classList.contains("active")){ obj.e.classList.add("active"); }
            
            // Update the timestamp.
            obj.t = performance.now();
        }
        
        else if(obj.e.classList.contains("active") && canChange){ 
            // Remove the active class.
            obj.e.classList.remove("active"); 
        }
    },
    endOfLoopDraw_funcs: function(timings){
        window.requestAnimationFrame((now)=>{
            let debugTs = now;
            
            // Display local settings/values/counts.
            this.loop_display_func();

            // Display the timing for the game loop (canvas draws are separate.)
            // this.loop_display_progressBarTimings(timings);
            
            // Display the canvas draw timings returned from the WebWorker.
            
            // Display the canvas draw timings data returned from the WebWorker.
            this.timingsDisplay.gfx.display_progressBars(now);
            this.timingsDisplay.gfx.display_layerChanges(now);
            
            // Display the timing for the game loop (canvas draws are separate.)
            this.timingsDisplay.loop.display_progressBars(now);
            this.timingsDisplay.loop.display_layerChanges(now);
            this.timingsDisplay.loop.display_tmapCountByLayer(now);
            
            _APP.game.gameLoop.lastDebug1_timestamp =  performance.now() - debugTs;
            // console.log(_APP.game.gameLoop.lastDebug1_timestamp);

            _DEBUG.timingsDisplay.gfx.dataIsUsed = true;
        });
    },
    timingsDisplay: {
        // prevValue and newValue should be values between 0-100.
        updateProgressBar2: function(container, bar, label, newValue, mult) {
            // newValue = Math.min( Math.max(newValue, 0), 100);
            let prevValue = +label.getAttribute("curr");
            let modifiedNewValue = newValue;
            let easingFactor = 0.05;
            let textOutput;
            let clampedPercent;
            let difference;
            let same = prevValue == newValue;
            let cssClasses = ["level1", "level2", "level3", "level4", "level5"];
            let cssClass = "";

            if(modifiedNewValue != 0){
                difference = (modifiedNewValue - +prevValue);
                modifiedNewValue += Math.round(difference * easingFactor);
                // modifiedNewValue = Math.round(modifiedNewValue / mult) * mult;
                modifiedNewValue = this.roundToNearestMultiple(modifiedNewValue, mult, "D");
                if(modifiedNewValue < 0)  { modifiedNewValue = 0; }
                // if(modifiedNewValue > 100){ modifiedNewValue = 100; }
            }

            // Adjust the width of the bar.
            if(!same){
                // Adjust the bar width.
                clampedPercent = Math.min( Math.max(modifiedNewValue, 0), 100) ;  // Ensure percent is within 0-100 range.
                bar.style.width = `${clampedPercent}%`;

                if     (clampedPercent < 20){ cssClass = "level1"; } // GREEN
                else if(clampedPercent < 40){ cssClass = "level2"; } // BLUE
                else if(clampedPercent < 60){ cssClass = "level3"; } // YELLOW
                else if(clampedPercent < 80){ cssClass = "level4"; } // ORANGE
                else                        { cssClass = "level5"; } // RED
                bar.classList.remove(...cssClasses);
                bar.classList.add(cssClass);

                // Adjust the values on the label.
                textOutput = `${modifiedNewValue}%`.padStart(3, " ");
                label.innerText = textOutput;
                
                // Adjust the attributes on the label.
                label.setAttribute("curr", modifiedNewValue); 
            }
        },
        roundToNearestMultiple: function(num, mult, dir){
            if(dir=="D")     { return Math.floor(num / mult) * mult; }
            else if(dir=="U"){ return Math.ceil(num / mult) * mult; }
        },
        forceToRange: function(num, min, max){
            return Math.min( Math.max(num, min), max) ;
        },
        applyChange(newText, obj, activeTime, noTrim=false){
            // Trim the text.
            if(!noTrim){
                newText = newText.trim();
                oldText = obj.e.innerText.trim();
            }
            // Do not trim the text.
            else{
                newText = newText;
                oldText = obj.e.innerText;
            }
    
            // Determine if the active class can be removed once the old and new text match again.
            let canChange = (performance.now() - obj.t > activeTime) || obj.t == 0;
    
            // If the newText is different that the current text...
            if(oldText != newText){
                // Update the text.
                obj.e.innerText = newText;
    
                // Add the active class?
                if(!obj.e.classList.contains("active")){ obj.e.classList.add("active"); }
                
                // Update the timestamp.
                obj.t = performance.now();
            }
            
            else if(obj.e.classList.contains("active") && canChange){ 
                // Remove the active class.
                obj.e.classList.remove("active"); 
            }
        },
        gfx :{
            elems:{},
            values:{},
            dataIsUsed: false,
            updateCache: function(data){
                // Save the data.
                this.values = data;
                this.dataIsUsed = false;

                // Add to the data key for each elem.
                this.elems.TOTAL_ALL.data = (this.values.sendGfxUpdates.toString());
                this.elems.TOTAL_BG1.data = (this.values.BG1.__TOTAL.toFixed() );
                this.elems.TOTAL_BG2.data = (this.values.BG2.__TOTAL.toFixed() );
                this.elems.TOTAL_SP1.data = (this.values.SP1.__TOTAL.toFixed() );
                this.elems.TOTAL_TX1.data = (this.values.TX1.__TOTAL.toFixed() );
                this.elems.A_BG1.data     = (this.values.BG1.A_clearLayer.toFixed());
                this.elems.A_BG2.data     = (this.values.BG2.A_clearLayer.toFixed());
                this.elems.A_SP1.data     = (this.values.SP1.A_clearLayer.toFixed());
                this.elems.A_TX1.data     = (this.values.TX1.A_clearLayer.toFixed());
                this.elems.B_BG1.data     = (this.values.BG1.B_clearRemovedData.toFixed());
                this.elems.B_BG2.data     = (this.values.BG2.B_clearRemovedData.toFixed());
                this.elems.B_SP1.data     = (this.values.SP1.B_clearRemovedData.toFixed());
                this.elems.B_TX1.data     = (this.values.TX1.B_clearRemovedData.toFixed());
                this.elems.C_BG1.data     = (this.values.BG1.C_createTilemaps.toFixed());
                this.elems.C_BG2.data     = (this.values.BG2.C_createTilemaps.toFixed());
                this.elems.C_SP1.data     = (this.values.SP1.C_createTilemaps.toFixed());
                this.elems.C_TX1.data     = (this.values.TX1.C_createTilemaps.toFixed());
                this.elems.D_BG1.data     = (this.values.BG1.D_drawFromDataCache.toFixed());
                this.elems.D_BG2.data     = (this.values.BG2.D_drawFromDataCache.toFixed());
                this.elems.D_SP1.data     = (this.values.SP1.D_drawFromDataCache.toFixed());
                this.elems.D_TX1.data     = (this.values.TX1.D_drawFromDataCache.toFixed());
                this.elems.E_BG1.data     = (this.values.BG1.E_drawImgDataCache.toFixed());
                this.elems.E_BG2.data     = (this.values.BG2.E_drawImgDataCache.toFixed());
                this.elems.E_SP1.data     = (this.values.SP1.E_drawImgDataCache.toFixed());
                this.elems.E_TX1.data     = (this.values.TX1.E_drawImgDataCache.toFixed());
            },
            init: function(){
                // Progress bar: draw.
                this.elems.time_DRAW = {
                    e0 : document.getElementById("debug_time_DRAW"),
                    e1 : document.getElementById("debug_time_DRAW").querySelector(".debug_innerProgressBar"),
                    e2 : document.getElementById("debug_time_DRAW").querySelector(".debug_progressBarLabel"),
                    t: 0
                }

                // Individual values: draw.
                // GFX TIMINGS TABLE.
                this.elems.TOTAL_BG1  = { e: document.getElementById("debug_timings_TOTAL_BG1"),    t: 0, data: 0 } 
                this.elems.TOTAL_BG2  = { e: document.getElementById("debug_timings_TOTAL_BG2"),    t: 0, data: 0 } 
                this.elems.TOTAL_SP1  = { e: document.getElementById("debug_timings_TOTAL_SP1"),    t: 0, data: 0 } 
                this.elems.TOTAL_TX1  = { e: document.getElementById("debug_timings_TOTAL_TX1"),    t: 0, data: 0 } 
                this.elems.A_BG1      = { e: document.getElementById("debug_timings_A_BG1"),        t: 0, data: 0 } 
                this.elems.A_BG2      = { e: document.getElementById("debug_timings_A_BG2"),        t: 0, data: 0 } 
                this.elems.A_SP1      = { e: document.getElementById("debug_timings_A_SP1"),        t: 0, data: 0 } 
                this.elems.A_TX1      = { e: document.getElementById("debug_timings_A_TX1"),        t: 0, data: 0 } 
                this.elems.B_BG1      = { e: document.getElementById("debug_timings_B_BG1"),        t: 0, data: 0 } 
                this.elems.B_BG2      = { e: document.getElementById("debug_timings_B_BG2"),        t: 0, data: 0 } 
                this.elems.B_SP1      = { e: document.getElementById("debug_timings_B_SP1"),        t: 0, data: 0 } 
                this.elems.B_TX1      = { e: document.getElementById("debug_timings_B_TX1"),        t: 0, data: 0 } 
                this.elems.C_BG1      = { e: document.getElementById("debug_timings_C_BG1"),        t: 0, data: 0 } 
                this.elems.C_BG2      = { e: document.getElementById("debug_timings_C_BG2"),        t: 0, data: 0 } 
                this.elems.C_SP1      = { e: document.getElementById("debug_timings_C_SP1"),        t: 0, data: 0 } 
                this.elems.C_TX1      = { e: document.getElementById("debug_timings_C_TX1"),        t: 0, data: 0 } 
                this.elems.D_BG1      = { e: document.getElementById("debug_timings_D_BG1"),        t: 0, data: 0 } 
                this.elems.D_BG2      = { e: document.getElementById("debug_timings_D_BG2"),        t: 0, data: 0 } 
                this.elems.D_SP1      = { e: document.getElementById("debug_timings_D_SP1"),        t: 0, data: 0 } 
                this.elems.D_TX1      = { e: document.getElementById("debug_timings_D_TX1"),        t: 0, data: 0 } 
                this.elems.E_BG1      = { e: document.getElementById("debug_timings_E_BG1"),        t: 0, data: 0 } 
                this.elems.E_BG2      = { e: document.getElementById("debug_timings_E_BG2"),        t: 0, data: 0 } 
                this.elems.E_SP1      = { e: document.getElementById("debug_timings_E_SP1"),        t: 0, data: 0 } 
                this.elems.E_TX1      = { e: document.getElementById("debug_timings_E_TX1"),        t: 0, data: 0 } 
                this.elems.TOTAL_ALL  = { e: document.getElementById("debug_timings_TOTAL_ALL"),    t: 0, data: 0 } 
            },
            display_progressBars: function(now){
                if(!this.values["sendGfxUpdates"] || this.values["sendGfxUpdates"] == 0){ 
                    // console.log("No timings yet.");
                    return; 
                }
    
                let activeTime = 200;
                let mult = 10;
                let newVal;
                let oldVal;
                let t;
                let canRun;
    
                newVal = (100*(this.elems.TOTAL_ALL.data / _APP.game.gameLoop.msFrame));
                if(this.dataIsUsed){
                    let value = +this.elems.TOTAL_ALL.data;
                    value = Math.round(value - (value/8));
                    // console.log("using used data", this.elems.TOTAL_ALL.data, value);
                    this.elems.TOTAL_ALL.data = value;
                    newVal = value;
                }
                
                oldVal = this.elems.time_DRAW.e2.getAttribute("curr");
                newVal = _DEBUG.timingsDisplay.roundToNearestMultiple(newVal, mult, "D");
                newVal = _DEBUG.timingsDisplay.forceToRange(newVal, 0, 999);
                t = this.elems.time_DRAW.t;
                canRun = ((now - t) > activeTime) || t == 0;
                if(newVal != oldVal && ( canRun )){
                    _DEBUG.timingsDisplay.updateProgressBar2(
                        this.elems.time_DRAW.e0,           // container
                        this.elems.time_DRAW.e1,           // bar
                        this.elems.time_DRAW.e2,           // label
                        newVal,
                        mult
                    );
                    this.elems.time_DRAW.t = now;
                }
            },
            display_layerChanges: function(now){
                if(!this.values["sendGfxUpdates"] || this.values["sendGfxUpdates"] == 0){ 
                    // console.log("No timings yet.");
                    return; 
                }

                let testText;
                let activeTime = 200;
                for(let eKey in this.elems){
                    if(eKey == "time_DRAW"){ continue; }
                    let elem = this.elems[eKey];
                    
                    testText = elem.data;
                    // if(this.dataIsUsed){ testText = "0"; }

                    // if(eKey == "TOTAL_ALL"){ testText = testText.padStart(3, "0"); }

                    _DEBUG.applyChange(testText, elem, activeTime, true);
                }
            },
        },
        loop:{
            elems:{},
            // values:{},
            init: function(){
                // display_progressBars: Progress bar: loop.
                this.elems.time_LOOP = {
                    e0 : document.getElementById("debug_time_LOOP"),
                    e1 : document.getElementById("debug_time_LOOP").querySelector(".debug_innerProgressBar"),
                    e2 : document.getElementById("debug_time_LOOP").querySelector(".debug_progressBarLabel"),
                    t: 0
                };

                // display_progressBars: Progress bar: loop + draw.
                this.elems.time_TOTAL = {
                    e0 : document.getElementById("debug_time_TOTAL"),
                    e1 : document.getElementById("debug_time_TOTAL").querySelector(".debug_innerProgressBar"),
                    e2 : document.getElementById("debug_time_TOTAL").querySelector(".debug_progressBarLabel"),
                    t: 0
                };

                // display_tmapCountByLayer: Tilemap counts by layer.
                this.elems.changesBG1 = { e: document.getElementById("debug_changesBG1"), t: 0 };
                this.elems.changesBG2 = { e: document.getElementById("debug_changesBG2"), t: 0 };
                this.elems.changesSP1 = { e: document.getElementById("debug_changesSP1"), t: 0 };
                this.elems.changesTX1 = { e: document.getElementById("debug_changesTX1"), t: 0 };
                
                // display_layerChanges: Display the number of layer objects per layer.
                this.elems.BG1_tms = { e: document.getElementById("debug_BG1_tms"), t: 0 };
                this.elems.BG2_tms = { e: document.getElementById("debug_BG2_tms"), t: 0 };
                this.elems.SP1_tms = { e: document.getElementById("debug_SP1_tms"), t: 0 };
                this.elems.TX1_tms = { e: document.getElementById("debug_TX1_tms"), t: 0 };
                
            },
            display_progressBars: function(now){
                let mult = 10;
                let newVal;
                let oldVal;
                let activeTime = 200;
                let t;
                let canRun;
    
                // LOOP
                newVal = +(100*(_APP.game.gameLoop.lastLoop_timestamp/_APP.game.gameLoop.msFrame)).toFixed(1);
                newVal = _DEBUG.timingsDisplay.forceToRange(newVal, 0, 999);
                newVal = _DEBUG.timingsDisplay.roundToNearestMultiple(newVal, mult, "D");
                oldVal = +this.elems.time_LOOP.e2.getAttribute("curr");
                if(newVal == oldVal){
                    // if(newVal > 10){
                        let value = +newVal;
                        // console.log(newVal, oldVal, value, _APP.game.gameLoop.lastLoop_timestamp.toFixed(1));
                        value = Math.round(value - (value/8));
                        newVal = _DEBUG.timingsDisplay.forceToRange(newVal, 0, 999);
                        newVal = _DEBUG.timingsDisplay.roundToNearestMultiple(newVal, mult, "D");
                    // }
                    // else{
                        // newVal = 0;
                    // }
                }
                t = this.elems.time_LOOP.t;
                canRun = ((now - t) > activeTime) || t == 0;
                if(newVal != oldVal && ( canRun )){
                    _DEBUG.timingsDisplay.updateProgressBar2(
                        this.elems.time_LOOP.e0,           // container
                        this.elems.time_LOOP.e1,           // bar
                        this.elems.time_LOOP.e2,           // label
                        newVal,
                        mult
                    );
                    this.elems.time_LOOP.t = now;
                }

                // TOTAL (LOOP AND DRAW)
                newVal = +newVal + +_DEBUG.timingsDisplay.gfx.elems.time_DRAW.e2.getAttribute("curr");
                oldVal = +this.elems.time_TOTAL.e2.getAttribute("curr");
                t = this.elems.time_TOTAL.t;
                canRun = ((now - t) > activeTime) || t == 0;
                if(newVal != oldVal && ( canRun )){
                    _DEBUG.timingsDisplay.updateProgressBar2(
                        this.elems.time_TOTAL.e0,           // container
                        this.elems.time_TOTAL.e1,           // bar
                        this.elems.time_TOTAL.e2,           // label
                        newVal,
                        mult
                    );
                    this.elems.time_TOTAL.t = now;
                }
            },
            display_layerChanges: function(now){
                // // Display which layers have changes on this frame. 
                let activeTime = 200;
                let testText = "";
    
                let changesBG1 = this.elems["changesBG1"];
                let changesBG2 = this.elems["changesBG2"];
                let changesSP1 = this.elems["changesSP1"];
                let changesTX1 = this.elems["changesTX1"];
    
                testText = `${_DEBUG.cachedData.changes["BG1"] ? "BG1" : "___"} `; _DEBUG.timingsDisplay.applyChange(testText, changesBG1, activeTime);
                testText = `${_DEBUG.cachedData.changes["BG2"] ? "BG2" : "___"} `; _DEBUG.timingsDisplay.applyChange(testText, changesBG2, activeTime);
                testText = `${_DEBUG.cachedData.changes["SP1"] ? "SP1" : "___"} `; _DEBUG.timingsDisplay.applyChange(testText, changesSP1, activeTime);
                testText = `${_DEBUG.cachedData.changes["TX1"] ? "TX1" : "___"} `; _DEBUG.timingsDisplay.applyChange(testText, changesTX1, activeTime);
            },
            display_tmapCountByLayer: function(now){
                let BG1_tms             = this.elems["BG1_tms"];
                let BG2_tms             = this.elems["BG2_tms"];
                let SP1_tms             = this.elems["SP1_tms"];
                let TX1_tms             = this.elems["TX1_tms"];
                let activeTime = 200;
                let testText = "";

                // Display the number of layer objects per layer.
                testText = Object.keys(_GFX.currentData["BG1"].tilemaps).length.toString(); _DEBUG.timingsDisplay.applyChange(testText, BG1_tms, activeTime);
                testText = Object.keys(_GFX.currentData["BG2"].tilemaps).length.toString(); _DEBUG.timingsDisplay.applyChange(testText, BG2_tms, activeTime);
                testText = Object.keys(_GFX.currentData["SP1"].tilemaps).length.toString(); _DEBUG.timingsDisplay.applyChange(testText, SP1_tms, activeTime);
                testText = Object.keys(_GFX.currentData["TX1"].tilemaps).length.toString(); _DEBUG.timingsDisplay.applyChange(testText, TX1_tms, activeTime);
            },
        },
    },

    loop_display_func: function(){
        let frameCounter        = this.elemsObj["frameCounter"];
        let frameDrawCounter    = this.elemsObj["frameDrawCounter"];
        let fpsDisplay          = this.elemsObj["fpsDisplay"];
        let waitUntilFrameDrawn = this.elemsObj["waitUntilFrameDrawn"];
        let debug_GS1Text       = this.elemsObj["debug_GS1Text"];
        let debug_GS2Text       = this.elemsObj["debug_GS2Text"];
        let DRAWNEEDED          = this.elemsObj["DRAWNEEDED"];
        let skipLogic           = this.elemsObj["skipLogic"];
        
        let activeTime = 200;
        let testText = "";
        
        // Show the frameCounter.
        testText = (_APP.game.gameLoop.frameCounter/1000).toFixed(1)+"k";
        this.applyChange(testText, frameCounter, activeTime);

        // Show the frameDrawCounter.
        testText = (_APP.game.gameLoop.frameDrawCounter/1000).toFixed(1)+"k";
        this.applyChange(testText, frameDrawCounter, activeTime);

        // Show the DRAWNEEDED.
        // testText = (_APP.game.gameLoop.DRAWNEEDED_prev ? "1" : "0").toString();
        testText = (_APP.game.gameLoop.DRAWNEEDED_prev).toString();
        this.applyChange(testText, DRAWNEEDED, activeTime);

        // Show the skipLogic flag.
        // testText = (_APP.game.gameLoop.skipLogic ? "1" : "0").toString();
        testText = (_APP.game.gameLoop.skipLogic).toString();
        this.applyChange(testText, skipLogic, activeTime);

        // Show average FPS, average ms per frame, how much off is the average ms per frame.
        let new_average       = _APP.game.gameLoop.fpsCalc.average.toFixed(0) ?? 0;
        let new_avgMsPerFrame = _APP.game.gameLoop.fpsCalc.avgMsPerFrame.toFixed(1) ?? 0;
        let msDiff            = (_APP.game.gameLoop.fpsCalc.avgMsPerFrame - _APP.game.gameLoop.msFrame).toFixed(1);
        // testText = `A: ${new_average} M: ${new_avgMsPerFrame} D: ${msDiff}`;
        testText = `AVG: ${new_average}, MS: ${new_avgMsPerFrame}, DELTA: ${msDiff}`;
        this.applyChange(testText, fpsDisplay, activeTime);

        // Show the waitUntilFrameDrawn flag.
        testText = (_APP.configObj.waitUntilFrameDrawn ? "true" : "false");
        this.applyChange(testText, waitUntilFrameDrawn, activeTime);

        // Update the displayed gamestate data. (gamestate 1.)
        testText = `'${_APP.game.gs1}' ${_APP.game.changeGs1_triggered?"**":""}`;
        this.applyChange(testText, debug_GS1Text, activeTime);
        
        // Update the displayed gamestate data. (gamestate 2.)
        testText = `'${_APP.game.gs2}' ${_APP.game.changeGs2_triggered?"**":""}`;
        this.applyChange(testText, debug_GS2Text, activeTime);
    },

};

_DEBUG.init = async function(){
    const loadFiles = async function(){
        let relPath = ".";
        if(_APP.usingJSGAME){ relPath = "./games/JSGAME_Uno"; }

        await new Promise( async (res,rej) => { await _APP.utility.addFile({f:"js/debug2.js" , t:"js"    }, relPath); res(); } );
        await new Promise( async (res,rej) => { await _APP.utility.addFile({f:"css/debug.css", t:"css"   }, relPath); res(); } );
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
            document.getElementById("outputContainer").append( document.getElementById("debug_test_alwaysVisible") ); 

            res(); 
        } );
    };
    const loadColorFinder = function(){
        const canvas_src_BG1 = document.querySelector(".canvasLayer[name='BG1']");
        const canvas_src_BG2 = document.querySelector(".canvasLayer[name='BG2']");
        const canvas_src_SP1 = document.querySelector(".canvasLayer[name='SP1']");
        const canvas_src_TX1 = document.querySelector(".canvasLayer[name='TX1']");
        let copyCanvas    = document.getElementById("debug_colorFinder_src");
        copyCanvas.width = canvas_src_BG1.width;
        copyCanvas.height = canvas_src_BG1.height;

        let copyCanvasCtx = copyCanvas.getContext("2d", { willReadFrequently: true } );
        let zoomCanvas = document.getElementById("debug_colorFinder_zoom");
        let zoomCanvasCtx = zoomCanvas.getContext("2d");
        let pixelRGBA = document.getElementById("debug_colorFinder_pixelRGBA");
        let debug_test_copyLayer_BG1 = document.getElementById("debug_test_copyLayer_BG1");
        let debug_test_copyLayer_BG2 = document.getElementById("debug_test_copyLayer_BG2");
        let debug_test_copyLayer_SP1 = document.getElementById("debug_test_copyLayer_SP1");
        let debug_test_copyLayer_TEXT = document.getElementById("debug_test_copyLayer_TEXT");
        let debug_test_copyLayer_ALL = document.getElementById("debug_test_copyLayer_ALL");

        let replaceCopyCanvas = function(canvas_src){
            // copyCanvasCtx.clearRect(0, 0, canvas_src.width, canvas_src.height);
            copyCanvasCtx.clearRect(0, 0, copyCanvasCtx.canvas.width, copyCanvasCtx.canvas.height);
            copyCanvasCtx.drawImage(canvas_src, 0, 0);
        };
        let copyAll = function(){
            copyCanvasCtx.clearRect(0, 0, copyCanvasCtx.canvas.width, copyCanvasCtx.canvas.height);
            copyCanvasCtx.drawImage(canvas_src_BG1, 0, 0);
            copyCanvasCtx.drawImage(canvas_src_BG2, 0, 0);
            copyCanvasCtx.drawImage(canvas_src_SP1, 0, 0);
            copyCanvasCtx.drawImage(canvas_src_TX1, 0, 0);
        };

        // Copy buttons: event listeners.
        debug_test_copyLayer_BG1 .addEventListener("click", ()=>{ replaceCopyCanvas(canvas_src_BG1);  }, false);
        debug_test_copyLayer_BG2 .addEventListener("click", ()=>{ replaceCopyCanvas(canvas_src_BG2);  }, false);
        debug_test_copyLayer_SP1 .addEventListener("click", ()=>{ replaceCopyCanvas(canvas_src_SP1);  }, false);
        debug_test_copyLayer_TEXT.addEventListener("click", ()=>{ replaceCopyCanvas(canvas_src_TX1); }, false);
        debug_test_copyLayer_ALL .addEventListener("click", copyAll, false);

        // Mousemove event listener.
        let last_regionX;
        let last_regionY;
        const regionWidth  = 2;
        const regionHeight = 2;
        copyCanvas.addEventListener('mousemove', (event) => {
            const rect = copyCanvas.getBoundingClientRect();
            const scaleX = copyCanvas.width / rect.width;
            const scaleY = copyCanvas.height / rect.height;
    
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
            zoomCanvasCtx.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);
    
            // Draw the extracted ImageData on the zoom canvas
            zoomCanvasCtx.putImageData(regionImageData, 0, 0);
    
            // Display pixel values rgba as hex.
            let text = "";
            for(let i=0; i<regionImageData.data.length; i+=4){
                if(i%(2*4)==0 && i!=0){ text += "\n"; }
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
                `]` ;
            }
            pixelRGBA.innerText = text;
        });
    };
    const drawColorPalette = function(){
        let debug_test_drawColorPalette = document.getElementById("debug_test_drawColorPalette");
        debug_test_drawColorPalette.addEventListener("click", async ()=>{
            await _WEBW_V.SEND("_DEBUG.drawColorPalette", { 
                data:{}, 
                refs:[]
            }, true, false);
        }, false);
        let debug_test_copyLayer_TEXT = document.getElementById("debug_test_copyLayer_TEXT");
        debug_test_copyLayer_TEXT.click();
    };

    return new Promise(async (resolve,reject)=>{
        // Init the color finder.
        let ts_loadFiles = performance.now(); 
        await loadFiles();
        ts_loadFiles = performance.now() - ts_loadFiles;

        // Init the color finder.
        let tsLoadColorFinder = performance.now(); 
        loadColorFinder();
        tsLoadColorFinder = performance.now() - tsLoadColorFinder;
        
        // Init drawColorPalette button.
        let ts_drawColorPalette = performance.now(); 
        drawColorPalette();
        ts_drawColorPalette = performance.now() - ts_drawColorPalette;

        // Init createGridCanvas.
        let ts_createGridCanvas = performance.now(); 
        this.createGridCanvas();
        ts_createGridCanvas = performance.now() - ts_createGridCanvas;

        // Init fadeHandler.
        let ts_fadeHandler = performance.now(); 
        this.fadeHandler();
        ts_fadeHandler = performance.now() - ts_fadeHandler;

        // Init countHandler.
        let ts_elemsObjInit = performance.now(); 
        this.elemsObjInit();
        ts_elemsObjInit = performance.now() - ts_elemsObjInit;

        // Init gameLoopControl.
        let ts_gameLoopControl = performance.now(); 
        this.gameLoopControl();
        ts_gameLoopControl = performance.now() - ts_gameLoopControl;

        // Init waitForDrawControl.
        let ts_waitForDrawControl = performance.now(); 
        this.waitForDrawControl();
        ts_waitForDrawControl = performance.now() - ts_waitForDrawControl;

        // Add event listener to the toggle debug button.
        let debug_toggleDebugActive = document.getElementById("debug_toggleDebugFlag");
        debug_toggleDebugActive.addEventListener("click", ()=>{_DEBUG.toggleDebugFlag(); }, false);
        
        let debug_test_toggleLogic = document.getElementById("debug_test_toggleLogic");
        debug_test_toggleLogic.addEventListener("click", ()=>{
            _APP.game.gameLoop.skipLogic = !_APP.game.gameLoop.skipLogic;
            // console.log("skipLogic value is now:", _APP.game.gameLoop.skipLogic);
        }, false);

        _DEBUG.timingsDisplay.gfx.init()
        _DEBUG.timingsDisplay.loop.init()

        // Output some timing info.
        // console.log("DEBUG: init:");
        // console.log("  ts_loadFiles                :", ts_loadFiles.toFixed(3));
        // console.log("  tsLoadColorFinder           :", tsLoadColorFinder.toFixed(3));
        // console.log("  ts_drawColorPalette         :", ts_drawColorPalette.toFixed(3));
        // console.log("  ts_createGridCanvas         :", ts_createGridCanvas.toFixed(3));
        // console.log("  ts_fadeHandler              :", ts_fadeHandler.toFixed(3));
        // console.log("  ts_elemsObjInit             :", ts_elemsObjInit.toFixed(3));
        // console.log("  ts_gameLoopControl          :", ts_gameLoopControl.toFixed(3));
        // console.log("  ts_waitForDrawControl       :", ts_waitForDrawControl.toFixed(3));
        
        // Init init2.
        let ts_init2 = performance.now(); 
        await _DEBUG2.init();
        ts_init2 = performance.now() - ts_init2;
        
        // console.log("  ts_init2                    :", ts_init2.toFixed(3));
        
        resolve();
    });
}
_DEBUG.endOfLoop = function(){
    console.log("endOfLoop");
};
