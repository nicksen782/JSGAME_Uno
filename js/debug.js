var _DEBUG = {
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
        console.log(this);
        this.gridCanvas.classList.toggle("displayNone");
    },

    fadeHandler: function(){
        let fadeSlider     = document.getElementById("fadeSlider");
        let fadeSliderText = document.getElementById("fadeSliderText");

        function changeFade() {
            let level;
            level = parseFloat(fadeSlider.value);

            if(level==0){ 
                _GFX.funcs.setFade("ALL", null);
                level = "null";
            }
            else{
                _GFX.funcs.setFade("ALL", level-1);
                level = (level-1).toString();
            }

            fadeSlider.title = `FADE: ${level}`;
            fadeSliderText.value = fadeSlider.title;
        }
        changeFade();

        fadeSlider.addEventListener("input", changeFade, false);

        document.getElementById("debug_test_fade_null").addEventListener("click", ()=>{ fadeSlider.value = (0);    changeFade(); }, false);
        document.getElementById("debug_test_fade_0")   .addEventListener("click", ()=>{ fadeSlider.value = (0+1);  changeFade(); }, false);
        document.getElementById("debug_test_fade_1")   .addEventListener("click", ()=>{ fadeSlider.value = (1+1);  changeFade(); }, false);
        document.getElementById("debug_test_fade_2")   .addEventListener("click", ()=>{ fadeSlider.value = (2+1);  changeFade(); }, false);
        document.getElementById("debug_test_fade_3")   .addEventListener("click", ()=>{ fadeSlider.value = (3+1);  changeFade(); }, false);
        document.getElementById("debug_test_fade_4")   .addEventListener("click", ()=>{ fadeSlider.value = (4+1);  changeFade(); }, false);
        document.getElementById("debug_test_fade_5")   .addEventListener("click", ()=>{ fadeSlider.value = (5+1);  changeFade(); }, false);
        document.getElementById("debug_test_fade_6")   .addEventListener("click", ()=>{ fadeSlider.value = (6+1);  changeFade(); }, false);
        document.getElementById("debug_test_fade_7")   .addEventListener("click", ()=>{ fadeSlider.value = (7+1);  changeFade(); }, false);
        document.getElementById("debug_test_fade_8")   .addEventListener("click", ()=>{ fadeSlider.value = (8+1);  changeFade(); }, false);
        document.getElementById("debug_test_fade_9")   .addEventListener("click", ()=>{ fadeSlider.value = (9+1);  changeFade(); }, false);
        document.getElementById("debug_test_fade_10")  .addEventListener("click", ()=>{ fadeSlider.value = (10+1); changeFade(); }, false);


    },

    countHandler: function(){
        let frameCounter     = document.getElementById("debug_frameCounter");
        let frameDrawCounter = document.getElementById("debug_frameDrawCounter");

        // let BG1_changes = document.getElementById("debug_BG1_changes");
        // let SP1_changes = document.getElementById("debug_SP1_changes");
        // let BG2_changes = document.getElementById("debug_BG2_changes");
        // let TX1_changes = document.getElementById("debug_TX1_changes");

        let BG1_fade_fade = document.getElementById("debug_BG1_fade_fade");
        let BG1_fade_curr = document.getElementById("debug_BG1_fade_curr");
        // let BG1_fade_prev = document.getElementById("debug_BG1_fade_prev");
        
        let BG2_fade_fade = document.getElementById("debug_BG2_fade_fade");
        let BG2_fade_curr = document.getElementById("debug_BG2_fade_curr");
        // let BG2_fade_prev = document.getElementById("debug_BG2_fade_prev");
        
        let SP1_fade_fade = document.getElementById("debug_SP1_fade_fade");
        let SP1_fade_curr = document.getElementById("debug_SP1_fade_curr");
        // let SP1_fade_prev = document.getElementById("debug_SP1_fade_prev");
        
        let TX1_fade_fade = document.getElementById("debug_TX1_fade_fade");
        let TX1_fade_curr = document.getElementById("debug_TX1_fade_curr");
        // let TX1_fade_prev = document.getElementById("debug_TX1_fade_prev");

        setInterval(()=>{
            frameCounter    .innerText = _APP.gameLoop.frameCounter;
            frameDrawCounter.innerText = _APP.gameLoop.frameDrawCounter;

            // BG1_changes.innerText = _GFX.currentData["BG1"].changes;
            // SP1_changes.innerText = _GFX.currentData["SP1"].changes;
            // BG2_changes.innerText = _GFX.currentData["BG2"].changes;
            // TX1_changes.innerText = _GFX.currentData["TX1"].changes;

            BG1_fade_fade.innerText = _GFX.currentData["BG1"].fade.fade     ?? "null";
            BG2_fade_fade.innerText = _GFX.currentData["BG2"].fade.fade     ?? "null";
            SP1_fade_fade.innerText = _GFX.currentData["SP1"].fade.fade     ?? "null";
            TX1_fade_fade.innerText = _GFX.currentData["TX1"].fade.fade     ?? "null";
            BG1_fade_curr.innerText = _GFX.currentData["BG1"].fade.currFade ?? "null";
            BG2_fade_curr.innerText = _GFX.currentData["BG2"].fade.currFade ?? "null";
            SP1_fade_curr.innerText = _GFX.currentData["SP1"].fade.currFade ?? "null";
            TX1_fade_curr.innerText = _GFX.currentData["TX1"].fade.currFade ?? "null";
            // BG1_fade_prev.innerText = _GFX.currentData["BG1"].fade.prevFade ?? "null";
            // BG2_fade_prev.innerText = _GFX.currentData["BG2"].fade.prevFade ?? "null";
            // SP1_fade_prev.innerText = _GFX.currentData["SP1"].fade.prevFade ?? "null";
            // TX1_fade_prev.innerText = _GFX.currentData["TX1"].fade.prevFade ?? "null";
        }, 100);
    },
};

_DEBUG.init = async function(){
    const loadFiles = async function(){
        // Load the second debug.js file.
        await new Promise(async (res,rej)=>{
            //
            let jsFile = "js/debug2.js";

            // Create the script. 
            let script = document.createElement('script');

            // Set the name. 
            script.setAttribute("name", jsFile);

            // Set defer.
            script.defer=true;

            // Onload.
            script.onload = async function () { script.onload = null; res(); };
            script.onerror = function (err)   { script.onload = null; rej(err); console.log("js: FAILURE:", jsFile, err); };

            // Append the element. 
            document.head.appendChild(script);

            // Set source. 
            script.src = jsFile;
        });

        // Load the CSS
        await new Promise(async (res,rej)=>{
            let cssFile = "css/debug.css";
            let link = document.createElement('link');
            link.type   = 'text/css';
            link.rel    = 'stylesheet';
            link.setAttribute("name", cssFile);
            link.onload  = function()     { link.onload = null; res(); };
            link.onerror = function (err) { link.onload = null; rej(err); console.log("css: FAILURE:", cssFile, err); };
            document.head.appendChild(link);
            link.href   = cssFile;
        });
    
        // Load the HTML
        let htmlFile = "debug.html";
        let html = await (await fetch(htmlFile)).text();
        let debugDiv = document.getElementById("debug");
        debugDiv.innerHTML = html;
        debugDiv.classList.remove("displayNone");
    };
    const loadColorFinder = function(){
        const canvas_src_BG1 = document.querySelector(".canvasLayer[name='BG1']");
        const canvas_src_BG2 = document.querySelector(".canvasLayer[name='BG2']");
        const canvas_src_SP1 = document.querySelector(".canvasLayer[name='SP1']");
        const canvas_src_TX1 = document.querySelector(".canvasLayer[name='TX1']");
        let copyCanvas    = document.getElementById("debug_colorFinder_src");
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
            copyCanvasCtx.clearRect(0, 0, canvas_src.width, canvas_src.height);
            copyCanvasCtx.drawImage(canvas_src, 0, 0);
        };
        let copyAll = function(){
            copyCanvasCtx.clearRect(0, 0, copyCanvasCtx.canvas.width, copyCanvasCtx.canvas.height);
            copyCanvasCtx.drawImage(canvas_src_BG1, 0, 0);
            copyCanvasCtx.drawImage(canvas_src_BG2, 0, 0);
            copyCanvasCtx.drawImage(canvas_src_SP1, 0, 0);
            copyCanvasCtx.drawImage(canvas_src_TX1, 0, 0);
        };

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

        // Copy buttons: event listeners.
        debug_test_copyLayer_BG1 .addEventListener("click", ()=>{ replaceCopyCanvas(canvas_src_BG1);  }, false);
        debug_test_copyLayer_BG2 .addEventListener("click", ()=>{ replaceCopyCanvas(canvas_src_BG2);  }, false);
        debug_test_copyLayer_SP1 .addEventListener("click", ()=>{ replaceCopyCanvas(canvas_src_SP1);  }, false);
        debug_test_copyLayer_TEXT.addEventListener("click", ()=>{ replaceCopyCanvas(canvas_src_TX1); }, false);
        debug_test_copyLayer_ALL.addEventListener("click", copyAll, false);
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
        // Load the remaining debug files. 
        let tsLoadFiles = performance.now(); 
        await loadFiles(); 
        tsLoadFiles = performance.now() - tsLoadFiles;
        
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

        // Output some timing info.
        // console.log("DEBUG: init:");
        // console.log("  tsLoadFiles                 :", tsLoadFiles.toFixed(3));
        // console.log("  tsLoadColorFinder           :", tsLoadColorFinder.toFixed(3));
        // console.log("  ts_drawColorPalette         :", ts_drawColorPalette.toFixed(3));
        // console.log("  ts_createGridCanvas         :", ts_createGridCanvas.toFixed(3));
        // console.log("  ts_fadeHandler              :", ts_fadeHandler.toFixed(3));
        // console.log("  ts_countHandler             :", ts_countHandler.toFixed(3));
        
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
