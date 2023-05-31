// Static methods and properties belong to the class and not to the instances of the class. 
// They cannot be used by an instance of the class.
// They can only be called by NameOfClass.property or NameOfClass.method.
// They are NOT inherited when the class is extended.

// Creates one LayerObject.
class OLDLayerObject {
    /* EXAMPLE USAGE:
    */

   // Set named colors.
   static colors = {
       red   : [218, 36 , 0  , 255], // Mario hat/overalls
       brown : [145, 109, 0  , 255], // Mario hair/arms/shoes
       white : [255, 255, 255, 255], // Luigi hat/overalls
       green : [0  , 145, 0  , 255], // Luigi hair/arms/shoes
       orange: [255, 145, 0  , 255], // Mario, Luigi skin
   };

    constructor(config){
        // layerObjKey (MapKey), layerKey, and tilesetKey.
        this.layerObjKey = config.layerObjKey;
        this.layerKey    = config.layerKey;
        this.tilesetKey  = config.tilesetKey;

        // Tilemap.
        this.tmap = config.tmap    ?? [0,0];

        // X position.
        this.x    = config.x    ?? 0;
        
        // Y position.
        this.y    = config.y    ?? 0;

        // Settings.
        this.settings = config.settings ?? {};

        // Add to _GFX.currentData.
        if(config.immediateAdd){
            this.firstRender();
        }
    }

    // Render function.
    firstRender(){
        this.render();
    }
    render(){
        _GFX.funcs.updateLayer(this.layerKey, 
            {
                ..._GFX.funcs.createLayerObjData({ 
                    mapKey: this.layerObjKey, x: this.x/8, y: this.y/8, ts: this.tilesetKey, settings: this.settings, 
                    tmap: this.tmap
                }),
            }
        );
    }
}

class Starman extends LayerObject {
    static colors = {
        eyes:[
            [182, 36,  0,255], // Frame 0: eyes: red
            [  0,  0,  0,255], // Frame 1: eyes: black
            [255,218,170,255], // Frame 2: eyes: yellow2
            [  0,145,  0,255], // Frame 3: eyes: green
        ],
        body:[
            [255,145,  0,255], // Frame 0: body: yellow1
            [145, 72,  0,255], // Frame 1: body: tan
            [182, 36,  0,255], // Frame 2: body: red
            [255,145,  0,255], // Frame 3: body: yellow1
        ]
    };
    static colorFrames = [
        // Frame 0: 
        [ 
            [ Starman.colors.eyes[0], Starman.colors.eyes[1] ],
            [ Starman.colors.body[0], Starman.colors.body[1] ],

        ],
        // Frame 1:
        [ 
            [ Starman.colors.eyes[0], Starman.colors.eyes[2] ],
            [ Starman.colors.body[0], Starman.colors.body[2] ],

        ],
        // Frame 2:
        [ 
            [ Starman.colors.eyes[0], Starman.colors.eyes[3] ],
            [ Starman.colors.body[0], Starman.colors.body[3] ],

        ],
        // Frame 3:
        [ 
            [ Starman.colors.eyes[0], Starman.colors.eyes[0] ],
            [ Starman.colors.body[0], Starman.colors.body[0] ],

        ]
    ];
    static rotations = [0, 90, 180, 270];
    
    constructor(config){
        // Send values to the parent class (LayerObject.)
        super(config);
        
        // Values not used by LayerObject will be set below.

        // Position: x
        this.xDir = config.actor.xDir ?? 1;
        this.minX = config.actor.minX ?? 0;
        this.maxX = config.actor.maxX ?? 256-16;
        this.incX = config.actor.incX ?? 2;
        
        // Position: y
        this.yDir = config.actor.yDir ?? 1;
        this.minY = config.actor.minY ?? 0;
        this.maxY = config.actor.maxY ?? 256-16;
        this.incY = config.actor.incY ?? 2;

        // Movement:
        this.changeMovement     = config.actor.changeMovement     ?? false;
        this.frameIndex         = config.actor.frameIndex         ?? 0;
        this.msBetweenMapFrames = config.actor.msBetweenMapFrames ?? 125;
        this.msLastMapFrame     = config.actor.msLastMapFrame     ?? 0;
        
        // Color changes:
        this.changeColors    = config.actor.changeColors    ?? false;
        this.colorIndex      = config.actor.colorIndex      ?? 0;
        this.msBetweenColors = config.actor.msBetweenColors ?? 32;
        this.msLastColor     = config.actor.msLastColor     ?? 0;
        
        // Set the current color.
        if(this.changeColors){
            this.settings.colorData = Starman.colorFrames[this.colorIndex];
        }
        
        // Rotations:
        this.changeRotations    = config.actor.changeRotations    ?? false;
        this.rotationIndex      = config.actor.rotationIndex      ?? 0;
        this.msBetweenRotations = config.actor.msBetweenRotations ?? 125;
        this.msLastRotation     = config.actor.msLastRotation     ?? 0;
        
        // Set the current rotation.
        if(this.changeRotations){
            this.settings.rotation = Starman.rotations[this.rotationIndex];
        }

        // Add to _GFX.currentData.
        if(config.immediateAdd){
            this.firstRender();
        }
    }

    firstRender(){
        _GFX.funcs.updateLayer(this.layerKey, 
            {
                ..._GFX.funcs.createLayerObjData({ 
                    mapKey: this.layerObjKey, x: this.x/8, y: this.y/8, ts: this.tilesetKey, settings: this.settings, 
                    tmap: this.tmap
                }),
            }
        );
    }
    render(timestamp=performance.now()){
        let perfNow = timestamp;

        // Determine if the rotation needs to change.
        if(this.changeRotations){
            if(perfNow - this.msLastRotation > this.msBetweenRotations){
                this.msLastRotation = perfNow;
                this.rotationIndex+=1;
                if(this.rotationIndex >= Starman.rotations.length){ this.rotationIndex = 0; }
                this.settings.rotation = Starman.rotations[this.rotationIndex];
            }
        }

        // Determine if the color frame needs to change.
        if(this.changeColors){
            if(perfNow - this.msLastColor > this.msBetweenColors){
                this.msLastColor = perfNow;
                this.colorIndex+=1;
                if(this.colorIndex >= Starman.colorFrames.length){ this.colorIndex = 0; }
                this.settings.colorData = Starman.colorFrames[this.colorIndex];
            }
        }

        // Determine if this LayerObject needs to move.
        if(this.changeMovement){
            // Go back and forth horizontally.
            // if     (this.xDir ==  1 &&   this.x >= this.maxX) { this.xDir *= -1; this.settings.xFlip = !this.settings.xFlip; }
            // else if(this.xDir == -1 && !(this.x >  this.minX)){ this.xDir *= -1; this.settings.xFlip = !this.settings.xFlip; }
            // this.x += this.xDir * this.incX;

            // Bounce around the provided region.
            this.x += this.xDir * this.incX;
            this.y += this.yDir * this.incY;
            if (this.y <= this.minY || this.y >= this.maxY) { this.yDir *= -1; }
            if (this.x <= this.minX || this.x >= this.maxX) { this.xDir *= -1; this.settings.xFlip = !this.settings.xFlip; }
        }

        _GFX.funcs.updateLayer(this.layerKey, 
            {
                ..._GFX.funcs.createLayerObjData({ 
                    mapKey: this.layerObjKey, x: this.x/8, y: this.y/8, ts: this.tilesetKey, settings: this.settings, 
                    tmap: this.tmap
                }),
            }
        );
    }
}

class Mario extends LayerObject {
    // Set named colors.
    static colors = {
        mario: {
            red   : [218, 36 , 0  , 255], // Mario hat/overalls
            orange: [255, 145, 0  , 255], // Mario hair/arms/shoes
            brown : [145, 109, 0  , 255], // Mario, Luigi skin
        },
        luigi: {
            white : [255, 255, 255, 255], // Luigi hat/overalls
            orange: [255, 145, 0  , 255], // Luigi hair/arms/shoes
            green : [0  , 145, 0  , 255], // Luigi skin
        },
    };

    // static tmaps_big = {
    //     idle : _GFX.funcs.getTilemap("bg_tiles2", "luigi_idle"),
    //     walk1: _GFX.funcs.getTilemap("bg_tiles2", "luigi_walk1"),
    //     walk3: _GFX.funcs.getTilemap("bg_tiles2", "luigi_walk3"),
    //     walk2: _GFX.funcs.getTilemap("bg_tiles2", "luigi_walk2"),
    //     walk3: _GFX.funcs.getTilemap("bg_tiles2", "luigi_walk3"),
    // };
    // static tmaps_big = {
    //     idle : { ts: "bg_tiles2", map: "luigi_idle"  },
    //     walk1: { ts: "bg_tiles2", map: "luigi_walk1" },
    //     walk3: { ts: "bg_tiles2", map: "luigi_walk3" },
    //     walk2: { ts: "bg_tiles2", map: "luigi_walk2" },
    //     walk3: { ts: "bg_tiles2", map: "luigi_walk3" },
    // };
    static frames_walk_big = [ "walk1", "walk3", "walk2", "walk3", ];

    static rotations = [0, 90, 180, 270];
    
    constructor(config){
        // Send values to the parent class (LayerObject.)
        super(config);
        
        // Values not used by LayerObject will be set below.

        // Position: x
        this.xDir = config.actor.xDir ?? 1;
        this.minX = config.actor.minX ?? 0;
        this.maxX = config.actor.maxX ?? 256-16;
        this.incX = config.actor.incX ?? 2;
        
        // Position: y
        this.yDir = config.actor.yDir ?? 1;
        this.minY = config.actor.minY ?? 0;
        this.maxY = config.actor.maxY ?? 256-16;
        this.incY = config.actor.incY ?? 2;

        // Movement:
        this.changeMovement     = config.actor.changeMovement     ?? false;
        this.frameIndex         = config.actor.frameIndex         ?? 0;
        this.msBetweenMapFrames = config.actor.msBetweenMapFrames ?? 125;
        this.msLastMapFrame     = config.actor.msLastMapFrame     ?? 0;
        
        // Color changes:
        this.changeColors    = config.actor.changeColors    ?? false;
        this.colorIndex      = config.actor.colorIndex      ?? 0;
        this.msBetweenColors = config.actor.msBetweenColors ?? 32;
        this.msLastColor     = config.actor.msLastColor     ?? 0;
        
        // Set the current color.
        if(this.changeColors){
            this.settings.colorData = Starman.colorFrames[this.colorIndex];
        }
        
        // Rotations:
        this.changeRotations    = config.actor.changeRotations    ?? false;
        this.rotationIndex      = config.actor.rotationIndex      ?? 0;
        this.msBetweenRotations = config.actor.msBetweenRotations ?? 125;
        this.msLastRotation     = config.actor.msLastRotation     ?? 0;
        
        // Set the current rotation.
        if(this.changeRotations){
            this.settings.rotation = Starman.rotations[this.rotationIndex];
        }

        //
        this.frames = [
            // _GFX.funcs.getTilemap("bg_tiles2", "luigi_idle"),
            _GFX.funcs.getTilemap("bg_tiles2", "luigi_walk1"),
            _GFX.funcs.getTilemap("bg_tiles2", "luigi_walk3"),
            _GFX.funcs.getTilemap("bg_tiles2", "luigi_walk2"),
            _GFX.funcs.getTilemap("bg_tiles2", "luigi_walk3"),
        ];

        // Add to _GFX.currentData.
        if(config.immediateAdd){
            this.firstRender();
        }
    }

    firstRender(){
        _GFX.funcs.updateLayer(this.layerKey, 
            {
                ..._GFX.funcs.createLayerObjData({ 
                    mapKey: this.layerObjKey, x: this.x/8, y: this.y/8, ts: this.tilesetKey, settings: this.settings, 
                    tmap: this.tmap
                }),
            }
        );
    }
    render(timestamp=performance.now()){
        let perfNow = timestamp;

        // Determine if the rotation needs to change.
        if(this.changeRotations){
            if(perfNow - this.msLastRotation > this.msBetweenRotations){
                this.msLastRotation = perfNow;
                this.rotationIndex+=1;
                if(this.rotationIndex >= Starman.rotations.length){ this.rotationIndex = 0; }
                this.settings.rotation = Starman.rotations[this.rotationIndex];
            }
        }

        // Determine if the color frame needs to change.
        if(this.changeColors){
            if(perfNow - this.msLastColor > this.msBetweenColors){
                this.msLastColor = perfNow;
                this.colorIndex+=1;
                if(this.colorIndex >= Starman.colorFrames.length){ this.colorIndex = 0; }
                this.settings.colorData = Starman.colorFrames[this.colorIndex];
            }
        }

        // Determine if this LayerObject needs to move.
        if(this.changeMovement){
            // Go back and forth horizontally.
            if     (this.xDir ==  1 &&   this.x >= this.maxX) { this.xDir *= -1; this.settings.xFlip = !this.settings.xFlip; }
            else if(this.xDir == -1 && !(this.x >  this.minX)){ this.xDir *= -1; this.settings.xFlip = !this.settings.xFlip; }
            this.x += this.xDir * this.incX;

            // Bounce around the provided region.
            // this.x += this.xDir * this.incX;
            // this.y += this.yDir * this.incY;
            // if (this.y <= this.minY || this.y >= this.maxY) { this.yDir *= -1; }
            // if (this.x <= this.minX || this.x >= this.maxX) { this.xDir *= -1; this.settings.xFlip = !this.settings.xFlip; }

            // Determine if the walk frame needs to change.
            if(perfNow - this.msLastMapFrame > this.msBetweenMapFrames){
                this.msLastMapFrame = perfNow;
                this.frameIndex+=1;
                if(this.frameIndex >= this.frames.length){ this.frameIndex = 0; }
                this.tmap = this.frames[this.frameIndex];
            }
        }

        _GFX.funcs.updateLayer(this.layerKey, 
            {
                ..._GFX.funcs.createLayerObjData({ 
                    mapKey: this.layerObjKey, x: this.x/8, y: this.y/8, ts: this.tilesetKey, settings: this.settings, 
                    tmap: this.tmap
                }),
            }
        );
    }
}

// class luigi {
//     constructor(){
//     }
// }