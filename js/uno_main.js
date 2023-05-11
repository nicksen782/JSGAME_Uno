_APP.game = {
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

    gamestates: {},
    gamestates_list: {},

    // KEYS THAT ARE POPULATED LATER WITHIN THIS FILE. 
    gameLoop: {}, 
};

_APP.game.gameLoop = {
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
        if(this.running){ this.loop_stop(); }
        
        // Start the gameLoop.
        this.running = true; 

        // Schedule the next gameloop run.
        this.loop_schedule_nextRun();
    },
    loop_stop: function(){
        // Cancel the current animation frame. 
        if     (this.loopType == "raf"){ window.cancelAnimationFrame(this.raf_id);  }
        else if(this.loopType == "to") { window.clearTimeout(this.raf_id); }
        else{ console.error("Invalid loopType:", this.loopType); }

        // Set the gameLoop.running to false. 
        this.running = false;
    },
    loop_schedule_nextRun: function(){
        if     (this.loopType == "raf"){ this.raf_id = window.requestAnimationFrame( (ts)=>{ this.loop( ts ); } ); }
        else if(this.loopType == "to") { this.raf_id = setTimeout(                   (  )=>{ this.loop( performance.now() ); }, 0 ); }
        else{ console.error("Invalid loopType:", this.loopType); }
    },
    endOfLoopTasks: function(){
        // Request the next frame.
        this.loop_schedule_nextRun();
    },
    loop: async function loop(timestamp){
        // return;
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
                // await _APP.game.gamestates[_APP.game.gs1].main();
                _APP.game.gamestates[_APP.game.gs1].main();
                
                // DRAW
                if( _APP.game.gamestates[_APP.game.gs1].render){ _APP.game.gamestates[_APP.game.gs1].render(); };
                
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
    init: async function(){
        // Calculate the ms required per frame.
        this.msFrame = 1000 / this.fps;

        // Init the fps object.
        this.fpsCalc.init(this.fps);

        // Get initial input states.
        await _INPUT.util.getStatesForPlayers();
    },
};