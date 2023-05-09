var _DEBUG2 = {};
_DEBUG2.classTest1 = async function(){
    let debug_classTest1 = document.getElementById("debug_classTest1");
    let objs = [];

    let layerObj1 = new LayerObject({
        immediateAdd: false,
        layerObjKey: "demo_luigi1", layerKey: "BG2", tilesetKey: "bg_tiles2",
        tmap: _GFX.funcs.getTilemap("bg_tiles2", "luigi_idle"),
        x: 0, y: 0,
        settings : {
            xFlip: false, yFlip: false, rotation: 0, colorData:[]
        }
    });
    let layerObj2 = new LayerObject({
        immediateAdd: false,
        layerObjKey: "demo_mario1", layerKey: "BG2", tilesetKey: "bg_tiles2",
        tmap: _GFX.funcs.getTilemap("bg_tiles2", "luigi_idle"),
        x: 16, y: 0,
        settings : {
            xFlip: false, yFlip: false, rotation: 0, colorData:[ 
                [ 
                    LayerObject.colors.white, // Color to replace.
                    LayerObject.colors.red    // Replacement color.
                ], [ 
                    LayerObject.colors.green, // Color to replace.
                    LayerObject.colors.brown  // Replacement color.
                ] 
            ]
        }
    });
    let layerObj3 = new Starman({
        immediateAdd: false,
        layerObjKey: "demo_starman1", layerKey: "SP1", tilesetKey: "bg_tiles2",
        tmap: _GFX.funcs.getTilemap("bg_tiles2", "starman"),
        x:32, y: 0,
        settings : {
            xFlip: false, yFlip: false, rotation: 0, colorData: []
        },
        actor: {
            // Position:
            xDir: 1, minX: 0, maxX: 256-16, incX: 2, 
            yDir: 1, minY: 0, maxY: 256-16, incY: 2,

            // Movement:
            frameIndex: 0, msBetweenMapFrames: 125, msLastMapFrame: 0,
            
            // Color changes:
            changeColors: true, colorIndex: 0, msBetweenColors: 32, msLastColor: 0, 
            
            // Rotation changes:
            changeRotations: true, rotationIndex: 0, msBetweenRotations: 125, msLastRotation: 0,

            // Automatic movement:
            changeMovement: false,
        }

    });
    let layerObj4 = new Starman({
        immediateAdd: false,
        layerObjKey: "demo_starman2", layerKey: "SP1", tilesetKey: "bg_tiles2",
        tmap: _GFX.funcs.getTilemap("bg_tiles2", "starman"),
        x: 48, y: 0,
        settings : {
            xFlip: false, yFlip: false, rotation: 0, colorData:[]
        },
        actor: {
            // Position:
            xDir: 1, minX: 0, maxX: 256-16, incX: 2, 
            yDir: 1, minY: 0, maxY: 256-16, incY: 2, 

            // Movement:
            frameIndex : 0, msBetweenMapFrames : 125, msLastMapFrame : 0,

            // Color changes:
            changeColors: true, colorIndex: 0, msBetweenColors: 250, msLastColor: 0, 

            // Rotation changes:
            changeRotations: true,
            rotationIndex: 0, msBetweenRotations: 50, msLastRotation: 0, 

            // Automatic movement:
            changeMovement: false,
        }
    });
    let layerObj5 = new Starman({
        immediateAdd: false,
        layerObjKey: "demo_starman3", layerKey: "SP1", tilesetKey: "bg_tiles2",
        tmap: _GFX.funcs.getTilemap("bg_tiles2", "starman"),
        x: 0, y: 176,
        settings : {
            xFlip: false, yFlip: false, rotation: 0, colorData:[]
        },
        actor: {
            // Position:
            xDir: 1, minX: 0  , maxX: 256-16, incX: 1, 
            yDir: 1, minY: 176, maxY: 256-16, incY: 2, 

            // Movement:
            frameIndex : 0, msBetweenMapFrames : 125, msLastMapFrame : 0,

            // Color changes:
            changeColors: true, colorIndex: 0, msBetweenColors: 32, msLastColor: 0, 

            // Rotation changes:
            changeRotations: false,
            rotationIndex: 0, msBetweenRotations: 50, msLastRotation: 0, 

            // Automatic movement:
            changeMovement: true,
        }
    });
    let layerObj6 = new Mario({
        immediateAdd: false,
        layerObjKey: "demo_mario2", layerKey: "SP1", tilesetKey: "bg_tiles2",
        tmap: _GFX.funcs.getTilemap("bg_tiles2", "luigi_idle"),
        x: 0, y: 32,
        settings : {
            xFlip: false, yFlip: false, rotation: 0, colorData:[]
        },
        actor: {
            // Position:
            xDir: 1, minX: 0, maxX: 256-16, incX: 1, 
            yDir: 1, minY: 0, maxY: 256-16, incY: 2, 

            // Movement:
            frameIndex : 0, msBetweenMapFrames : 125, msLastMapFrame : 0,

            // Color changes:
            changeColors: false, colorIndex: 0, msBetweenColors: 32, msLastColor: 0, 

            // Rotation changes:
            changeRotations: false,
            rotationIndex: 0, msBetweenRotations: 50, msLastRotation: 0, 

            // Automatic movement:
            changeMovement: true,
        }
    });
    let layerObj7 = new Mario({
        immediateAdd: false,
        layerObjKey: "demo_luigi2", layerKey: "SP1", tilesetKey: "bg_tiles2",
        tmap: _GFX.funcs.getTilemap("bg_tiles2", "luigi_idle"),
        x: 0, y: 64,
        settings : {
            xFlip: false, yFlip: false, rotation: 0, colorData:[ 
                [ 
                    LayerObject.colors.white, // Color to replace.
                    LayerObject.colors.red    // Replacement color.
                ], [ 
                    LayerObject.colors.green, // Color to replace.
                    LayerObject.colors.brown  // Replacement color.
                ] 
            ]
        },
        actor: {
            // Position:
            xDir: 1, minX: 0, maxX: 256-16, incX: 1, 
            yDir: 1, minY: 0, maxY: 256-16, incY: 2, 

            // Movement:
            frameIndex : 0, msBetweenMapFrames : 125, msLastMapFrame : 0,

            // Color changes:
            changeColors: false, colorIndex: 0, msBetweenColors: 32, msLastColor: 0, 

            // Rotation changes:
            changeRotations: false,
            rotationIndex: 0, msBetweenRotations: 50, msLastRotation: 0, 

            // Automatic movement:
            changeMovement: true,
        }
    });

    objs.push(layerObj1, layerObj2, layerObj3, layerObj4, layerObj5, layerObj6, layerObj7);
    
    let timerId;
    debug_classTest1.addEventListener("click", ()=>{
        if(timerId){ clearInterval(timerId); timerId = null; console.log("classTest1 STOPPED"); return; }
        console.log("classTest1 STARTED"); 

        timerId = setInterval(()=>{
            for(let i=0; i<objs.length; i+=1){
                objs[i].render();
            }
            _GFX.funcs.sendGfxUpdates();
        }, 16.6);
    }, false);
};
_DEBUG2.init = async function(){
    return new Promise(async (resolve,reject)=>{

        // Init classTest1 button.
        let ts_classTest1 = performance.now(); 
        _DEBUG2.classTest1();
        ts_classTest1 = performance.now() - ts_classTest1;

        // Output some timing info.
        console.log("DEBUG: init2:");
        console.log("  ts_classTest1               :", ts_classTest1.toFixed(3));

        resolve();
    });

};
