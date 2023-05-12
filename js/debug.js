var _DEBUG = {
    // Testing card movement1.
    objs : [],
    test1: function(){
        // BOARD
        this.objs[0] = new LayerObject({
            immediateAdd: false,
            layerObjKey: "demo_board", layerKey: "BG2", tilesetKey: "bg_tiles",
            tmap: _GFX.funcs.getTilemap("bg_tiles", "board_28x28"),
            x: 0*8, y: 0*8, 
            settings : {
                xFlip: false, yFlip: false, rotation: 0, colorData:[]
            }
        });

        // PLAYER 1 CARDS
        this.objs[1] = new LayerObject({
            immediateAdd: false,
            layerObjKey: "demo_orangeCard1", layerKey: "BG2", tilesetKey: "bg_tiles",
            tmap: _GFX.funcs.getTilemap("bg_tiles", "card_front_orange_sm"),
            x: 7*8, y: 24*8, 
            settings : {
                xFlip: false, yFlip: false, rotation: 0, colorData:[]
            }
        });
        this.objs[2] = new LayerObject({
            immediateAdd: false,
            layerObjKey: "demo_yellowCard1", layerKey: "BG2", tilesetKey: "bg_tiles",
            tmap: _GFX.funcs.getTilemap("bg_tiles", "card_front_orange_sm"),
            x: 10*8, y: 24*8, 
            settings : {
                xFlip: false, yFlip: false, rotation: 0, colorData:[
                    [ Card.colors.cardOrange, Card.colors.cardYellow ]
                ]
            }
        });
        this.objs[3] = new LayerObject({
            immediateAdd: false,
            layerObjKey: "demo_blueCard1", layerKey: "BG2", tilesetKey: "bg_tiles",
            tmap: _GFX.funcs.getTilemap("bg_tiles", "card_front_orange_sm"),
            x: 13*8, y: 24*8,  
            settings : {
                xFlip: false, yFlip: false, rotation: 0, colorData:[
                    [ Card.colors.cardOrange, Card.colors.cardBlue ]
                ]
            }
        });
        this.objs[4]  = new LayerObject({
            immediateAdd: false,
            layerObjKey: "demo_redCard1", layerKey: "BG2", tilesetKey: "bg_tiles",
            tmap: _GFX.funcs.getTilemap("bg_tiles", "card_front_orange_sm"),
            x: 16*8, y: 24*8, 
            settings : {
                xFlip: false, yFlip: false, rotation: 0, colorData:[
                    [ Card.colors.cardOrange, Card.colors.cardRed ]
                ]
            }
        });
        this.objs[5]  = new LayerObject({
            immediateAdd: false,
            layerObjKey: "demo_greenCard1", layerKey: "BG2", tilesetKey: "bg_tiles",
            tmap: _GFX.funcs.getTilemap("bg_tiles", "card_front_orange_sm"),
            x: 19*8, y: 24*8, 
            settings : {
                xFlip: false, yFlip: false, rotation: 0, colorData:[
                    [ Card.colors.cardOrange, Card.colors.cardGreen ]
                ]
            }
        });

        // PLAYER 2 CARDS
        this.objs[6]  = new LayerObject({
            immediateAdd: false,
            layerObjKey: "demo_orangeCard2", layerKey: "BG2", tilesetKey: "bg_tiles",
            tmap: _GFX.funcs.getTilemap("bg_tiles", "card_front_orange_sm"),
            x: 1*8, y: 7*8, 
            settings : {
                xFlip: false, yFlip: false, rotation: 90, colorData:[]
            }
        });
        this.objs[7]  = new LayerObject({
            immediateAdd: false,
            layerObjKey: "demo_yellowCard2", layerKey: "BG2", tilesetKey: "bg_tiles",
            tmap: _GFX.funcs.getTilemap("bg_tiles", "card_front_orange_sm"),
            x: 1*8, y: 10*8, 
            settings : {
                xFlip: false, yFlip: false, rotation: 90, colorData:[
                    [ Card.colors.cardOrange, Card.colors.cardYellow ]
                ]
            }
        });
        this.objs[8]  = new LayerObject({
            immediateAdd: false,
            layerObjKey: "demo_blueCard2", layerKey: "BG2", tilesetKey: "bg_tiles",
            tmap: _GFX.funcs.getTilemap("bg_tiles", "card_front_orange_sm"),
            x: 1*8, y: 13*8,  
            settings : {
                xFlip: false, yFlip: false, rotation: 90, colorData:[
                    [ Card.colors.cardOrange, Card.colors.cardBlue ]
                ]
            }
        });
        this.objs[9]  = new LayerObject({
            immediateAdd: false,
            layerObjKey: "demo_redCard2", layerKey: "BG2", tilesetKey: "bg_tiles",
            tmap: _GFX.funcs.getTilemap("bg_tiles", "card_front_orange_sm"),
            x: 1*8, y: 16*8, 
            settings : {
                xFlip: false, yFlip: false, rotation: 90, colorData:[
                    [ Card.colors.cardOrange, Card.colors.cardRed ]
                ]
            }
        });
        this.objs[10] = new LayerObject({
            immediateAdd: false,
            layerObjKey: "demo_greenCard2", layerKey: "BG2", tilesetKey: "bg_tiles",
            tmap: _GFX.funcs.getTilemap("bg_tiles", "card_front_orange_sm"),
            x: 1*8, y: 19*8, 
            settings : {
                xFlip: false, yFlip: false, rotation: 90, colorData:[
                    [ Card.colors.cardOrange, Card.colors.cardGreen ]
                ]
            }
        });
        
        // PLAYER 3 CARDS
        this.objs[11]  = new LayerObject({
            immediateAdd: false,
            layerObjKey: "demo_orangeCard3", layerKey: "BG2", tilesetKey: "bg_tiles",
            tmap: _GFX.funcs.getTilemap("bg_tiles", "card_front_orange_sm"),
            x: 7*8, y: 1*8, 
            settings : {
                xFlip: false, yFlip: false, rotation: 0, colorData:[]
            }
        });
        this.objs[12]  = new LayerObject({
            immediateAdd: false,
            layerObjKey: "demo_yellowCard3", layerKey: "BG2", tilesetKey: "bg_tiles",
            tmap: _GFX.funcs.getTilemap("bg_tiles", "card_front_orange_sm"),
            x: 10*8, y: 1*8, 
            settings : {
                xFlip: false, yFlip: false, rotation: 0, colorData:[
                    [ Card.colors.cardOrange, Card.colors.cardYellow ]
                ]
            }
        });
        this.objs[13]  = new LayerObject({
            immediateAdd: false,
            layerObjKey: "demo_blueCard3", layerKey: "BG2", tilesetKey: "bg_tiles",
            tmap: _GFX.funcs.getTilemap("bg_tiles", "card_front_orange_sm"),
            x: 13*8, y: 1*8,  
            settings : {
                xFlip: false, yFlip: false, rotation: 0, colorData:[
                    [ Card.colors.cardOrange, Card.colors.cardBlue ]
                ]
            }
        });
        this.objs[14]  = new LayerObject({
            immediateAdd: false,
            layerObjKey: "demo_redCard3", layerKey: "BG2", tilesetKey: "bg_tiles",
            tmap: _GFX.funcs.getTilemap("bg_tiles", "card_front_orange_sm"),
            x: 16*8, y: 1*8,  
            settings : {
                xFlip: false, yFlip: false, rotation: 0, colorData:[
                    [ Card.colors.cardOrange, Card.colors.cardRed ]
                ]
            }
        });
        this.objs[15] = new LayerObject({
            immediateAdd: false,
            layerObjKey: "demo_greenCard3", layerKey: "BG2", tilesetKey: "bg_tiles",
            tmap: _GFX.funcs.getTilemap("bg_tiles", "card_front_orange_sm"),
            x: 19*8, y: 1*8,  
            settings : {
                xFlip: false, yFlip: false, rotation: 0, colorData:[
                    [ Card.colors.cardOrange, Card.colors.cardGreen ]
                ]
            }
        });
        

        // PLAYER 4 CARDS
        this.objs[16]  = new LayerObject({
            immediateAdd: false,
            layerObjKey: "demo_orangeCard4", layerKey: "BG2", tilesetKey: "bg_tiles",
            tmap: _GFX.funcs.getTilemap("bg_tiles", "card_front_orange_sm"),
            x: 24*8, y: 7*8, 
            settings : {
                xFlip: false, yFlip: false, rotation: 90, colorData:[]
            }
        });
        this.objs[17]  = new LayerObject({
            immediateAdd: false,
            layerObjKey: "demo_yellowCard4", layerKey: "BG2", tilesetKey: "bg_tiles",
            tmap: _GFX.funcs.getTilemap("bg_tiles", "card_front_orange_sm"),
            x: 24*8, y: 10*8, 
            settings : {
                xFlip: false, yFlip: false, rotation: 90, colorData:[
                    [ Card.colors.cardOrange, Card.colors.cardYellow ]
                ]
            }
        });
        this.objs[18]  = new LayerObject({
            immediateAdd: false,
            layerObjKey: "demo_blueCard4", layerKey: "BG2", tilesetKey: "bg_tiles",
            tmap: _GFX.funcs.getTilemap("bg_tiles", "card_front_orange_sm"),
            x: 24*8, y: 13*8,  
            settings : {
                xFlip: false, yFlip: false, rotation: 90, colorData:[
                    [ Card.colors.cardOrange, Card.colors.cardBlue ]
                ]
            }
        });
        this.objs[19]  = new LayerObject({
            immediateAdd: false,
            layerObjKey: "demo_redCard4", layerKey: "BG2", tilesetKey: "bg_tiles",
            tmap: _GFX.funcs.getTilemap("bg_tiles", "card_front_orange_sm"),
            x: 24*8, y: 16*8, 
            settings : {
                xFlip: false, yFlip: false, rotation: 90, colorData:[
                    [ Card.colors.cardOrange, Card.colors.cardRed ]
                ]
            }
        });
        this.objs[20] = new LayerObject({
            immediateAdd: false,
            layerObjKey: "demo_greenCard4", layerKey: "BG2", tilesetKey: "bg_tiles",
            tmap: _GFX.funcs.getTilemap("bg_tiles", "card_front_orange_sm"),
            x: 24*8, y: 19*8, 
            settings : {
                xFlip: false, yFlip: false, rotation: 90, colorData:[
                    [ Card.colors.cardOrange, Card.colors.cardGreen ]
                ]
            }
        });

        for(let i=0; i<this.objs.length; i+=1){ if(this.objs[i]) { this.objs[i].render(); } }
        _GFX.funcs.sendGfxUpdates();

        setTimeout(()=>{
            let newConfig = this.objs[19].removeLayerObject();
            console.log(newConfig);
            newConfig.x -= 24;
            newConfig.layerKey = "SP1";
            delete this.objs[19];
            this.objs[19] = new LayerObject(newConfig);
            this.objs[19].render();
            _GFX.funcs.sendGfxUpdates();
        }, 1000);
        setTimeout(()=>{
            let newConfig = this.objs[19].removeLayerObject();
            console.log(newConfig);
            newConfig.x += 24;
            newConfig.layerKey = "BG2";
            this.objs[19] = new LayerObject(newConfig);
            this.objs[19].render();
            _GFX.funcs.sendGfxUpdates(); 
        }, 2000);

        // for(let i=0; i<this.objs.length; i+=1){ this.objs[i].render(); }

        // this.objs[20].x-=8;
        // this.objs[20].render();
        // _GFX.funcs.sendGfxUpdates();
    },

    obs2:[],
    test2:function(){
    },

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
        
        let goToGs = function(gs){
            _APP.game.gamestates[_APP.game.gs1].inited = false;
            _APP.game.gameLoop.loop_stop(); 
            _APP.game.gs1 = gs;
            _APP.game.gamestates[_APP.game.gs1].inited = false;
            _APP.game.gameLoop.loop_start(); 
        }
        gotoGS_JSG .addEventListener("click", ()=>{ goToGs("gs_JSG"); }, false);
        gotoGS_N782.addEventListener("click", ()=>{ goToGs("gs_N782"); }, false);

        // <button id="debug_test_gotoGS_JSG">Goto: gs_JSG</button>
        // <button id="debug_test_gotoGS_N782">Goto: gs_N782</button>
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

            if(level==0){ _GFX.funcs.setFade(layer, null);    level = "null"; }
            else        { _GFX.funcs.setFade(layer, level-1); level = (level-1).toString(); }

            sliderElem.title = `${layer}: FADE: ${level}`;
            sliderTextElem.value = sliderElem.title;
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

    countHandler: function(){
        let frameCounter     = document.getElementById("debug_frameCounter");
        let frameDrawCounter = document.getElementById("debug_frameDrawCounter");
        let fpsDisplay = document.getElementById("debug_fpsDisplay");
        let waitUntilFrameDrawn = document.getElementById("debug_waitUntilFrameDrawn");

        setInterval(()=>{
            // Show the frameCounter.
            if(frameCounter.innerText != _APP.game.gameLoop.frameCounter.toString()){
                frameCounter    .innerText = _APP.game.gameLoop.frameCounter;
            }
            // Show the frameDrawCounter.
            if(frameDrawCounter.innerText != _APP.game.gameLoop.frameDrawCounter.toString()){
                frameDrawCounter.innerText = _APP.game.gameLoop.frameDrawCounter;
            }

            // Show average FPS, average ms per frame, how much off is the average ms per frame.
            let new_average       = _APP.game.gameLoop.fpsCalc.average.toFixed(0) ?? 0;
            let new_avgMsPerFrame = _APP.game.gameLoop.fpsCalc.avgMsPerFrame.toFixed(1) ?? 0;
            let msDiff            = (_APP.game.gameLoop.fpsCalc.avgMsPerFrame - _APP.game.gameLoop.msFrame).toFixed(1);
            let fpsText           = `A: ${new_average} M: ${new_avgMsPerFrame} D: ${msDiff}`;
            if(fpsDisplay.innerText != fpsText){ fpsDisplay.innerText = fpsText; }
            
            // Show the waitUntilFrameDrawn flag.
            if(waitUntilFrameDrawn.innerText != (_APP.configObj.waitUntilFrameDrawn ? "true" : "false")){
                waitUntilFrameDrawn.innerText = _APP.configObj.waitUntilFrameDrawn ? "true" : "false";
            }
        }, 100);
    },
};

_DEBUG.init = async function(){
    const loadFiles = async function(useJsgamePath){
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
            document.getElementById("controls").append( document.getElementById("debug_test_alwaysVisible") ); 

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
            }, true);
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
        let ts_countHandler = performance.now(); 
        this.countHandler();
        ts_countHandler = performance.now() - ts_countHandler;

        // Init gameLoopControl.
        let ts_gameLoopControl = performance.now(); 
        this.gameLoopControl();
        ts_gameLoopControl = performance.now() - ts_gameLoopControl;

        // Init waitForDrawControl.
        let ts_waitForDrawControl = performance.now(); 
        this.waitForDrawControl();
        ts_waitForDrawControl = performance.now() - ts_waitForDrawControl;

        // Output some timing info.
        // console.log("DEBUG: init:");
        // console.log("  ts_loadFiles                :", ts_loadFiles.toFixed(3));
        // console.log("  tsLoadColorFinder           :", tsLoadColorFinder.toFixed(3));
        // console.log("  ts_drawColorPalette         :", ts_drawColorPalette.toFixed(3));
        // console.log("  ts_createGridCanvas         :", ts_createGridCanvas.toFixed(3));
        // console.log("  ts_fadeHandler              :", ts_fadeHandler.toFixed(3));
        // console.log("  ts_countHandler             :", ts_countHandler.toFixed(3));
        // console.log("  ts_gameLoopControl          :", ts_gameLoopControl.toFixed(3));
        // console.log("  ts_waitForDrawControl       :", ts_waitForDrawControl.toFixed(3));
        
        // Init init2.
        let ts_init2 = performance.now(); 
        // await _DEBUG2.init();
        ts_init2 = performance.now() - ts_init2;
        
        // console.log("  ts_init2                    :", ts_init2.toFixed(3));
        
        resolve();
    });
}
_DEBUG.endOfLoop = function(){
    console.log("endOfLoop");
};
