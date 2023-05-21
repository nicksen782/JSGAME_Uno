var _DEBUG = {
    gridCanvas: null,
    createGridCanvas: function(){
        // Copy the dimensions of the first canvas. 
        const canvas_src_L1 = document.querySelector(".canvasLayer[name='L1']");
    
        // Create a canvas for this layer.
        this.gridCanvas = document.createElement("canvas");
        this.gridCanvas.width  = canvas_src_L1.width;
        this.gridCanvas.height = canvas_src_L1.height;
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
        // TOGGLE: GAMELOOP
        let toggleGameLoop = document.getElementById("debug_test_toggleGameLoop");
        toggleGameLoop .addEventListener("click", ()=>{ 
            if(_APP.game.gameLoop.running){
                toggleGameLoop.classList.remove("debug_bgColor_on");
                toggleGameLoop.classList.add("debug_bgColor_off");
                toggleGameLoop.innerText = "LOOP: OFF";
                _APP.game.gameLoop.loop_stop(); 
            } 
            else {
                toggleGameLoop.classList.remove("debug_bgColor_off");
                toggleGameLoop.classList.add("debug_bgColor_on");
                toggleGameLoop.innerText = "LOOP: ON";
                _APP.game.gameLoop.loop_start(); 
            } 
        }, false);

        // TOGGLE: LOGIC
        let toggleLogic = document.getElementById("debug_test_toggleLogic");
        toggleLogic.addEventListener("click", ()=>{
            _APP.game.gameLoop.skipLogic = !_APP.game.gameLoop.skipLogic;
            if(_APP.game.gameLoop.skipLogic){
                toggleLogic.classList.remove("debug_bgColor_on");
                toggleLogic.classList.add("debug_bgColor_off");
                toggleLogic.innerText = "LOGIC: OFF";
            } 
            else {
                toggleLogic.classList.remove("debug_bgColor_off");
                toggleLogic.classList.add("debug_bgColor_on");
                toggleLogic.innerText = "LOGIC: ON";
            } 
        }, false);

        // TOGGLE: ASYNC DRAW
        let drawAsync = document.getElementById("debug_test_toggleDrawAsync");
        drawAsync.addEventListener("click", ()=>{ 
            _APP.configObj.drawAsync = !_APP.configObj.drawAsync;
            if(_APP.configObj.drawAsync){
                drawAsync.classList.remove("debug_bgColor_on");
                drawAsync.classList.add("debug_bgColor_off");
                drawAsync.innerText = "ASYNC: OFF";
            } 
            else {
                drawAsync.classList.remove("debug_bgColor_off");
                drawAsync.classList.add("debug_bgColor_on");
                drawAsync.innerText = "ASYNC: ON";
            } 
        }, false);

        // GO TO GAMESTATE
        let gotoGS_JSG = document.getElementById("debug_test_gotoGS_JSG");
        let gotoGS_TITLE = document.getElementById("debug_test_gotoGS_TITLE");
        let gotoGS_N782 = document.getElementById("debug_test_gotoGS_N782");
        
        // RESTART THE CURRENT GAMESTATE
        let restartGS1 = document.getElementById("debug_test_restartGS1");
        restartGS1.addEventListener("click", ()=>{ 
            _APP.game.gameLoop.loop_stop(); 
            _APP.game.gamestates[_APP.game.gs1].inited = false;
            _APP.game.gameLoop.loop_start(); 
        }, false);
        
        gotoGS_JSG .addEventListener("click", ()=>{ _APP.game.changeGs1("gs_JSG"); }, false);
        gotoGS_TITLE.addEventListener("click", ()=>{ _APP.game.changeGs1("gs_TITLE"); }, false);
        gotoGS_N782.addEventListener("click", ()=>{ _APP.game.changeGs1("gs_N782"); }, false);
    },
    
    waitForDrawControl: function(){
    },

    fadeHandler: function(){
        let fadeSliderALL     = document.getElementById("fadeSliderALL");
        let fadeSliderL1     = document.getElementById("fadeSliderL1");
        let fadeSliderL2     = document.getElementById("fadeSliderL2");
        let fadeSliderL3     = document.getElementById("fadeSliderL3");
        let fadeSliderL4     = document.getElementById("fadeSliderL4");
        let fadeSliderALLText = document.getElementById("fadeSliderALLText");
        let fadeSliderL1Text = document.getElementById("fadeSliderL1Text");
        let fadeSliderL2Text = document.getElementById("fadeSliderL2Text");
        let fadeSliderL3Text = document.getElementById("fadeSliderL3Text");
        let fadeSliderL4Text = document.getElementById("fadeSliderL4Text");

        function changeFade(layer, sliderElem, sliderTextElem) {
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

            sliderElem.title = `${layer}: ${level_text}`;
            sliderTextElem.innerText = sliderElem.title;
        }
        changeFade("ALL", fadeSliderALL, fadeSliderALLText);
        changeFade("L1", fadeSliderL1, fadeSliderL1Text);
        changeFade("L2", fadeSliderL2, fadeSliderL2Text);
        changeFade("L3", fadeSliderL3, fadeSliderL3Text);
        changeFade("L4", fadeSliderL4, fadeSliderL4Text);

        fadeSliderALL.addEventListener("input", ()=>{ changeFade("ALL", fadeSliderALL, fadeSliderALLText); }, false);
        fadeSliderL1.addEventListener("input", ()=>{ changeFade("L1", fadeSliderL1, fadeSliderL1Text); }, false);
        fadeSliderL2.addEventListener("input", ()=>{ changeFade("L2", fadeSliderL2, fadeSliderL2Text); }, false);
        fadeSliderL3.addEventListener("input", ()=>{ changeFade("L3", fadeSliderL3, fadeSliderL3Text); }, false);
        fadeSliderL4.addEventListener("input", ()=>{ changeFade("L4", fadeSliderL4, fadeSliderL4Text); }, false);
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
        debug_GS1Text      : { e: null, t:0 },
        debug_GS2Text      : { e: null, t:0 },
        DRAWNEEDED: { e: null, t: 0 },
        time_LOOP   : { e0: null, e1: null, e2: null, t: 0 },
        time_LOGIC  : { e0: null, e1: null, e2: null, t: 0 },
        time_DRAW   : { e0: null, e1: null, e2: null, t: 0 },
    },
    cachedData : {
        changes: {
            "L1": 0, 
            "L2": 0, 
            "L3": 0, 
            "L4": 0, 
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
        this.elemsObj.DRAWNEEDED.e          = document.getElementById("debug_DRAWNEEDED");
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
            // let v1 = _DEBUG.timingsDisplay.gfx.dataIsUsed;
            // let v2 = _DEBUG.timingsDisplay.gfx.dataIsUsed;;
            if(
                this.timingsDisplay.gfx.display_progressBars(now) &&
                this.timingsDisplay.gfx.display_layerChanges(now) 
            ){ 
                _DEBUG.timingsDisplay.gfx.dataIsUsed = true;
                // v2 = _DEBUG.timingsDisplay.gfx.dataIsUsed;
            }
            // console.log("dataIsUsed was:", v1, ", now:", v2);
            
            // Display the timing for the game loop (canvas draws are separate.)
            this.timingsDisplay.loop.display_progressBars(now);
            this.timingsDisplay.loop.display_layerChanges(now);
            this.timingsDisplay.loop.display_tmapCountByLayer(now);
            
            _APP.game.gameLoop.lastDebug1_timestamp =  performance.now() - debugTs;
            // console.log(_APP.game.gameLoop.lastDebug1_timestamp);

        });
    },
    timingsDisplay: {
        // prevValue and newValue should be values between 0-100.
        updateProgressBar2: function(container, bar, label, newValue, mult, label2="") {
            // newValue = Math.min( Math.max(newValue, 0), 100);
            let prevValue  = +label.getAttribute("curr");
            let prevValue2 = +label.getAttribute("curr2");
            let same  = +prevValue  === +newValue;
            let same2 = +prevValue2 === +label2;
            if(same && same2){ return; }

            let modifiedNewValue = newValue;
            let easingFactor = 0.05;
            let textOutput;
            let clampedPercent;
            let difference;
            let cssClasses = ["level1", "level2", "level3", "level4", "level5"];
            let cssClass = "";
            
            if(modifiedNewValue != 0){
                difference = (modifiedNewValue - +prevValue);
                modifiedNewValue += Math.round(difference * easingFactor);
                modifiedNewValue = this.roundToNearestMultiple(modifiedNewValue, mult, "D");
                if(modifiedNewValue < 0)  { modifiedNewValue = 0; }
                // if(modifiedNewValue > 100){ modifiedNewValue = 100; }
            }
            
            let part1 = `${modifiedNewValue}%`.padStart(5, " ");
            let part2 = `(${parseInt(label2).toFixed(1)}ms)`.padStart(9, " ");

            // if(!same || !same2){
                // Generate the values for the label.
                if(label2){ textOutput = `${part1} ${part2}`; }
                else      { textOutput = `${part1} `; }
                
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
                    
                    // Adjust the attributes on the label.
                    // label.setAttribute("curr", modifiedNewValue); 
                }
                
                if(!same2){
                    // Adjust the attributes on the label.
                    // label.setAttribute("curr2", label2); 
                }
                
                // Adjust the values on the label.
                label.innerText = textOutput;
                label.setAttribute("curr", modifiedNewValue); 
                label.setAttribute("curr2", label2); 
            // }
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
            if(!canChange){ return; }

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
            lastUpdate1: 0,
            updateCache: function(data){
                // Save the data.
                this.values = data;
                this.dataIsUsed = false;
                this.lastUpdate1 = performance.now();

                // Add to the data key for each elem.
                this.elems.TOTAL_ALL.data = (this.values.sendGfxUpdates.toString());
                this.elems.TOTAL_L1.data = (this.values.L1.__TOTAL.toFixed() );
                this.elems.TOTAL_L2.data = (this.values.L2.__TOTAL.toFixed() );
                this.elems.TOTAL_L3.data = (this.values.L3.__TOTAL.toFixed() );
                this.elems.TOTAL_L4.data = (this.values.L4.__TOTAL.toFixed() );
                this.elems.A_L1.data     = (this.values.L1.A_clearLayer.toFixed());
                this.elems.A_L2.data     = (this.values.L2.A_clearLayer.toFixed());
                this.elems.A_L3.data     = (this.values.L3.A_clearLayer.toFixed());
                this.elems.A_L4.data     = (this.values.L4.A_clearLayer.toFixed());
                this.elems.B_L1.data     = (this.values.L1.B_clearRemovedData.toFixed());
                this.elems.B_L2.data     = (this.values.L2.B_clearRemovedData.toFixed());
                this.elems.B_L3.data     = (this.values.L3.B_clearRemovedData.toFixed());
                this.elems.B_L4.data     = (this.values.L4.B_clearRemovedData.toFixed());
                this.elems.C_L1.data     = (this.values.L1.C_createTilemaps.toFixed());
                this.elems.C_L2.data     = (this.values.L2.C_createTilemaps.toFixed());
                this.elems.C_L3.data     = (this.values.L3.C_createTilemaps.toFixed());
                this.elems.C_L4.data     = (this.values.L4.C_createTilemaps.toFixed());
                this.elems.D_L1.data     = (this.values.L1.D_drawFromDataCache.toFixed());
                this.elems.D_L2.data     = (this.values.L2.D_drawFromDataCache.toFixed());
                this.elems.D_L3.data     = (this.values.L3.D_drawFromDataCache.toFixed());
                this.elems.D_L4.data     = (this.values.L4.D_drawFromDataCache.toFixed());
                this.elems.E_L1.data     = (this.values.L1.E_drawImgDataCache.toFixed());
                this.elems.E_L2.data     = (this.values.L2.E_drawImgDataCache.toFixed());
                this.elems.E_L3.data     = (this.values.L3.E_drawImgDataCache.toFixed());
                this.elems.E_L4.data     = (this.values.L4.E_drawImgDataCache.toFixed());
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
                this.elems.TOTAL_L1  = { e: document.getElementById("debug_timings_TOTAL_L1"),    t: 0, data: 0 } 
                this.elems.TOTAL_L2  = { e: document.getElementById("debug_timings_TOTAL_L2"),    t: 0, data: 0 } 
                this.elems.TOTAL_L3  = { e: document.getElementById("debug_timings_TOTAL_L3"),    t: 0, data: 0 } 
                this.elems.TOTAL_L4  = { e: document.getElementById("debug_timings_TOTAL_L4"),    t: 0, data: 0 } 
                this.elems.A_L1      = { e: document.getElementById("debug_timings_A_L1"),        t: 0, data: 0 } 
                this.elems.A_L2      = { e: document.getElementById("debug_timings_A_L2"),        t: 0, data: 0 } 
                this.elems.A_L3      = { e: document.getElementById("debug_timings_A_L3"),        t: 0, data: 0 } 
                this.elems.A_L4      = { e: document.getElementById("debug_timings_A_L4"),        t: 0, data: 0 } 
                this.elems.B_L1      = { e: document.getElementById("debug_timings_B_L1"),        t: 0, data: 0 } 
                this.elems.B_L2      = { e: document.getElementById("debug_timings_B_L2"),        t: 0, data: 0 } 
                this.elems.B_L3      = { e: document.getElementById("debug_timings_B_L3"),        t: 0, data: 0 } 
                this.elems.B_L4      = { e: document.getElementById("debug_timings_B_L4"),        t: 0, data: 0 } 
                this.elems.C_L1      = { e: document.getElementById("debug_timings_C_L1"),        t: 0, data: 0 } 
                this.elems.C_L2      = { e: document.getElementById("debug_timings_C_L2"),        t: 0, data: 0 } 
                this.elems.C_L3      = { e: document.getElementById("debug_timings_C_L3"),        t: 0, data: 0 } 
                this.elems.C_L4      = { e: document.getElementById("debug_timings_C_L4"),        t: 0, data: 0 } 
                this.elems.D_L1      = { e: document.getElementById("debug_timings_D_L1"),        t: 0, data: 0 } 
                this.elems.D_L2      = { e: document.getElementById("debug_timings_D_L2"),        t: 0, data: 0 } 
                this.elems.D_L3      = { e: document.getElementById("debug_timings_D_L3"),        t: 0, data: 0 } 
                this.elems.D_L4      = { e: document.getElementById("debug_timings_D_L4"),        t: 0, data: 0 } 
                this.elems.E_L1      = { e: document.getElementById("debug_timings_E_L1"),        t: 0, data: 0 } 
                this.elems.E_L2      = { e: document.getElementById("debug_timings_E_L2"),        t: 0, data: 0 } 
                this.elems.E_L3      = { e: document.getElementById("debug_timings_E_L3"),        t: 0, data: 0 } 
                this.elems.E_L4      = { e: document.getElementById("debug_timings_E_L4"),        t: 0, data: 0 } 
                this.elems.TOTAL_ALL  = { e: document.getElementById("debug_timings_TOTAL_ALL"),    t: 0, data: 0 } 
            },
            calcValuesForProgressBars: function(obj){
                let mult         = obj.mult;
                let activeTime   = obj.activeTime;
                let elems        = obj.elems;
                let now          = obj.now;
                
                let label1_new   = "";
                let label1_old   = "";
                let label2_new   = "";
                let label2_old   = "";
                let tmpValue     = "";
                let adjusted     = false;

                // Determine if enough time has occurred for the next update.
                let lastDrawTime = elems.bar.t;
                let canRun = ((now - lastDrawTime) > activeTime) || lastDrawTime == 0 ; 

                if(canRun){
                    // (%) Generate label1 (reduce the value if the data is stale.)
                    label1_new = (100*(elems.new.data / _APP.game.gameLoop.msFrame));
                    if(this.dataIsUsed || (now - this.lastUpdate1 > activeTime)){
                        tmpValue = +elems.new.data;
                        tmpValue = + (tmpValue - (tmpValue/2)) .toFixed(1);
                        // tmpValue = _DEBUG.timingsDisplay.roundToNearestMultiple(tmpValue, 1, "D");
                        if(tmpValue <= 0.1) { tmpValue = 0; }
                        elems.new.data = tmpValue;
                        label1_new = (100*(tmpValue / _APP.game.gameLoop.msFrame));
                        adjusted = true;
                    }

                    label1_new = _DEBUG.timingsDisplay.roundToNearestMultiple(label1_new, mult, "D");
                    label1_new = _DEBUG.timingsDisplay.forceToRange(label1_new, 0, 999);
                    label1_old = +elems.bar.e2.getAttribute("curr");
                    
                    // (ms) Generate label2.
                    label2_new = +elems.new.data || "0";
                    label2_old = +elems.bar.e2.getAttribute("curr2");
                    
                    // Determine if there should be an update.
                    canRun = (label1_new != label1_old || label2_new != label2_old);
                }
                
                return {
                    canRun    : canRun,
                    label1_new: label1_new,
                    label2_new: label2_new,
                    bar       : elems.bar,
                    adjusted  : adjusted,
                };
            },
            display_progressBars: function(now){
                if(!this.values["sendGfxUpdates"] || this.values["sendGfxUpdates"] == 0){ 
                    // console.log("No timings yet.");
                    return false; 
                }

                let lastDrawTime = this.elems.time_DRAW.t;
                let activeTime = 200;
                let mult = 1;
                
                // Determine if enough time has occurred for the next update.
                let canRun = ((now - lastDrawTime) > activeTime) || lastDrawTime == 0 ; 
                if(!canRun){ return false; }

                // Calculate the values for the progress bar.
                let obj = this.calcValuesForProgressBars({
                    elems: { 
                        new: this.elems.TOTAL_ALL, 
                        bar: this.elems.time_DRAW 
                    },
                    activeTime: activeTime,
                    mult      : mult,
                    now       : now,
                });
                let {
                    bar: bar,
                    label1_new: label1_new, // %
                    label2_new: label2_new, // ms
                    adjusted: noLabel,
                } = obj;

                ({ canRun: canRun } = obj);
                // console.log(obj);

                // Run the update.
                if(canRun){
                    _DEBUG.timingsDisplay.updateProgressBar2(
                        bar.e0,           // container
                        bar.e1,           // bar
                        bar.e2,           // label
                        label1_new, mult, 
                        label2_new
                        // noLabel ? " " : label2_new
                    );
                    bar.t = now;
                    return true;
                }

                return false;
            },
            display_layerChanges: function(now){
                if(!this.values["sendGfxUpdates"] || this.values["sendGfxUpdates"] == 0){ 
                    // console.log("No timings yet.");
                    return false; 
                }

                let testText;
                let activeTime = 200;
                for(let eKey in this.elems){
                    if(eKey == "time_DRAW"){ continue; }
                    let elem = this.elems[eKey];
                    
                    testText = elem.data;
                    // if(this.dataIsUsed){ testText = "0"; }

                    // if(eKey == "TOTAL_ALL"){ testText = testText.padStart(3, "0"); }

                    _DEBUG.timingsDisplay.applyChange(testText, elem, activeTime, true);
                    // _DEBUG.timingsDisplay.applyChange(testText, elem, 0, true);
                }

                return true; 
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
                this.elems.changesL1 = { e: document.getElementById("debug_changesL1"), t: 0 };
                this.elems.changesL2 = { e: document.getElementById("debug_changesL2"), t: 0 };
                this.elems.changesL3 = { e: document.getElementById("debug_changesL3"), t: 0 };
                this.elems.changesL4 = { e: document.getElementById("debug_changesL4"), t: 0 };
                
                // display_layerChanges: Display the number of layer objects per layer.
                this.elems.L1_tms = { e: document.getElementById("debug_L1_tms"), t: 0 };
                this.elems.L2_tms = { e: document.getElementById("debug_L2_tms"), t: 0 };
                this.elems.L3_tms = { e: document.getElementById("debug_L3_tms"), t: 0 };
                this.elems.L4_tms = { e: document.getElementById("debug_L4_tms"), t: 0 };
                
            },
            // TODO: FIX.
            display_progressBars: function(now){
                let mult = 1;
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
                        , `${_APP.game.gameLoop.lastLoop_timestamp.toFixed(1)}`
                    );
                    this.elems.time_LOOP.t = now;
                }

                // TOTAL (LOOP AND DRAW)
                newVal = +newVal + +_DEBUG.timingsDisplay.gfx.elems.time_DRAW.e2.getAttribute("curr");
                oldVal = +this.elems.time_TOTAL.e2.getAttribute("curr");
                let drawVal = (+_DEBUG.timingsDisplay.gfx.elems.TOTAL_ALL.data).toFixed(1);
                t = this.elems.time_TOTAL.t;
                canRun = ((now - t) > activeTime) || t == 0;
                if(newVal != oldVal && ( canRun )){
                    _DEBUG.timingsDisplay.updateProgressBar2(
                        this.elems.time_TOTAL.e0,           // container
                        this.elems.time_TOTAL.e1,           // bar
                        this.elems.time_TOTAL.e2,           // label
                        newVal,
                        mult
                        , `${(_APP.game.gameLoop.lastLoop_timestamp + +drawVal).toFixed(1)}`
                    );
                    this.elems.time_TOTAL.t = now;
                }
            },
            display_layerChanges: function(now){
                // // Display which layers have changes on this frame. 
                let activeTime = 200;
                let testText = "";
    
                let changesL1 = this.elems["changesL1"];
                let changesL2 = this.elems["changesL2"];
                let changesL3 = this.elems["changesL3"];
                let changesL4 = this.elems["changesL4"];
    
                testText = `${_DEBUG.cachedData.changes["L1"] ? "L1" : "___"} `; _DEBUG.timingsDisplay.applyChange(testText, changesL1, activeTime);
                testText = `${_DEBUG.cachedData.changes["L2"] ? "L2" : "___"} `; _DEBUG.timingsDisplay.applyChange(testText, changesL2, activeTime);
                testText = `${_DEBUG.cachedData.changes["L3"] ? "L3" : "___"} `; _DEBUG.timingsDisplay.applyChange(testText, changesL3, activeTime);
                testText = `${_DEBUG.cachedData.changes["L4"] ? "L4" : "___"} `; _DEBUG.timingsDisplay.applyChange(testText, changesL4, activeTime);
            },
            display_tmapCountByLayer: function(now){
                let L1_tms             = this.elems["L1_tms"];
                let L2_tms             = this.elems["L2_tms"];
                let L3_tms             = this.elems["L3_tms"];
                let L4_tms             = this.elems["L4_tms"];
                let activeTime = 200;
                let testText = "";

                // Display the number of layer objects per layer.
                testText = Object.keys(_GFX.currentData["L1"].tilemaps).length.toString(); _DEBUG.timingsDisplay.applyChange(testText, L1_tms, activeTime);
                testText = Object.keys(_GFX.currentData["L2"].tilemaps).length.toString(); _DEBUG.timingsDisplay.applyChange(testText, L2_tms, activeTime);
                testText = Object.keys(_GFX.currentData["L3"].tilemaps).length.toString(); _DEBUG.timingsDisplay.applyChange(testText, L3_tms, activeTime);
                testText = Object.keys(_GFX.currentData["L4"].tilemaps).length.toString(); _DEBUG.timingsDisplay.applyChange(testText, L4_tms, activeTime);
            },
        },
    },

    loop_display_func: function(){
        let frameCounter        = this.elemsObj["frameCounter"];
        let frameDrawCounter    = this.elemsObj["frameDrawCounter"];
        let fpsDisplay          = this.elemsObj["fpsDisplay"];
        let debug_GS1Text       = this.elemsObj["debug_GS1Text"];
        let debug_GS2Text       = this.elemsObj["debug_GS2Text"];
        let DRAWNEEDED          = this.elemsObj["DRAWNEEDED"];
        // let skipLogic           = this.elemsObj["skipLogic"];
        
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
        // testText = (_APP.game.gameLoop.skipLogic).toString();
        // this.applyChange(testText, skipLogic, activeTime);

        // Show average FPS, average ms per frame, how much off is the average ms per frame.
        let new_average       = _APP.game.gameLoop.fpsCalc.average.toFixed(0) ?? 0;
        let new_avgMsPerFrame = _APP.game.gameLoop.fpsCalc.avgMsPerFrame.toFixed(1) ?? 0;
        let msDiff            = (_APP.game.gameLoop.fpsCalc.avgMsPerFrame - _APP.game.gameLoop.msFrame).toFixed(1);
        // testText = `A: ${new_average} M: ${new_avgMsPerFrame} D: ${msDiff}`;
        testText = `AVG: ${new_average}, MS: ${new_avgMsPerFrame}, DELTA: ${msDiff}`;
        this.applyChange(testText, fpsDisplay, activeTime);

        // Update the displayed gamestate data. (gamestate 1.)
        testText = `'${_APP.game.gs1}' ${_APP.game.changeGs1_triggered?"**":""}`;
        this.applyChange(testText, debug_GS1Text, activeTime);
        
        // Update the displayed gamestate data. (gamestate 2.)
        testText = `'${_APP.game.gs2}' ${_APP.game.changeGs2_triggered?"**":""}`;
        this.applyChange(testText, debug_GS2Text, activeTime);
    },

};

_DEBUG.navBar1 = {
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
        'view_buttons1': {
            'tab' : 'debug_navBar1_tab_buttons1',
            'view': 'debug_navBar1_view_buttons1',
        },
        'view_hashCacheStats1': {
            'tab' : 'debug_navBar1_tab_hashCacheStats1',
            'view': 'debug_navBar1_view_hashCacheStats1',
        },
        // 'view_hashCacheStats2': {
        //     'tab' : 'debug_navBar1_tab_hashCacheStats2',
        //     'view': 'debug_navBar1_view_hashCacheStats2',
        // },
    },
    hideAll: _APP.navBar1.hideAll,
    showOne: _APP.navBar1.showOne,
    init   : _APP.navBar1.init,
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
            // document.getElementById("outputContainer").append( document.getElementById("debug_test_alwaysVisible") ); 

            // Move the debug_test_gamestates to the side of the game output.
            // document.getElementById("outputContainer").append( document.getElementById("debug_test_gamestates") ); 
            document.getElementById("outputContainer").append( document.getElementById("debug_sideDiv") ); 

            res(); 
        } );
    };
    const loadColorFinder = function(){
        const canvas_src_L1 = document.querySelector(".canvasLayer[name='L1']");
        const canvas_src_L2 = document.querySelector(".canvasLayer[name='L2']");
        const canvas_src_L3 = document.querySelector(".canvasLayer[name='L3']");
        const canvas_src_L4 = document.querySelector(".canvasLayer[name='L4']");
        let copyCanvas    = document.getElementById("debug_colorFinder_src");
        copyCanvas.width = canvas_src_L1.width;
        copyCanvas.height = canvas_src_L1.height;

        let copyCanvasCtx = copyCanvas.getContext("2d", { willReadFrequently: true } );
        let zoomCanvas = document.getElementById("debug_colorFinder_zoom");
        let zoomCanvasCtx = zoomCanvas.getContext("2d");
        let pixelRGBA = document.getElementById("debug_colorFinder_pixelRGBA");
        let debug_test_copyLayer_L1 = document.getElementById("debug_test_copyLayer_L1");
        let debug_test_copyLayer_L2 = document.getElementById("debug_test_copyLayer_L2");
        let debug_test_copyLayer_L3 = document.getElementById("debug_test_copyLayer_L3");
        let debug_test_copyLayer_L4 = document.getElementById("debug_test_copyLayer_L4");
        let debug_test_copyLayer_ALL = document.getElementById("debug_test_copyLayer_ALL");

        let replaceCopyCanvas = function(canvas_src){
            // copyCanvasCtx.clearRect(0, 0, canvas_src.width, canvas_src.height);
            copyCanvasCtx.clearRect(0, 0, copyCanvasCtx.canvas.width, copyCanvasCtx.canvas.height);
            copyCanvasCtx.drawImage(canvas_src, 0, 0);
        };
        let copyAll = function(){
            copyCanvasCtx.clearRect(0, 0, copyCanvasCtx.canvas.width, copyCanvasCtx.canvas.height);
            copyCanvasCtx.drawImage(canvas_src_L1, 0, 0);
            copyCanvasCtx.drawImage(canvas_src_L2, 0, 0);
            copyCanvasCtx.drawImage(canvas_src_L3, 0, 0);
            copyCanvasCtx.drawImage(canvas_src_L4, 0, 0);
        };

        // Copy buttons: event listeners.
        debug_test_copyLayer_L1 .addEventListener("click", ()=>{ replaceCopyCanvas(canvas_src_L1);  }, false);
        debug_test_copyLayer_L2 .addEventListener("click", ()=>{ replaceCopyCanvas(canvas_src_L2);  }, false);
        debug_test_copyLayer_L3 .addEventListener("click", ()=>{ replaceCopyCanvas(canvas_src_L3);  }, false);
        debug_test_copyLayer_L4.addEventListener("click", ()=>{ replaceCopyCanvas(canvas_src_L4); }, false);
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
        let debug_test_copyLayer_L4 = document.getElementById("debug_test_copyLayer_L4");
        debug_test_copyLayer_L4.click();
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

        // // Init waitForDrawControl.
        // let ts_waitForDrawControl = performance.now(); 
        // this.waitForDrawControl();
        // ts_waitForDrawControl = performance.now() - ts_waitForDrawControl;

        // Add event listener to the toggle debug button.
        let debug_toggleDebugActive = document.getElementById("debug_toggleDebugFlag");
        debug_toggleDebugActive.addEventListener("click", ()=>{_DEBUG.toggleDebugFlag(); }, false);
        
        _DEBUG.timingsDisplay.gfx.init()
        _DEBUG.timingsDisplay.loop.init()

        // Resize
        let scaleSlider = document.getElementById("scaleSlider");
        // scaleSlider.value = "2.50";
        scaleSlider.value = "3.00";
        scaleSlider.dispatchEvent(new Event("input"));

        // DEBUG NAV 1
        _DEBUG.navBar1.init();
        // _DEBUG.navBar1.showOne("view_colorFinder");
        _DEBUG.navBar1.showOne("view_drawStats");
        // _DEBUG.navBar1.showOne("view_fade");
        // _DEBUG.navBar1.showOne("view_buttons1");
        // _DEBUG.navBar1.showOne("view_hashCacheStats1");
        // _DEBUG.navBar1.showOne("view_hashCacheStats2");

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
