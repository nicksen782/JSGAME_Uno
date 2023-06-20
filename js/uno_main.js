_APP.game = {
    // Gamestate 1 values.
    gs1: "",                    // Current gamestate 1.
    changeGs1_triggered: false, // Flag: gamestate 1 change triggered.
    gs1_new: "",                // The new scheduled gamestate 1.
    gs1_prev: "",               // The previous gamestate 1.
    
    // Gamestate 1 values.
    gs2: "",                    // Current gamestate 2.
    changeGs2_triggered: false, // Flag: gamestate 2 change triggered.
    gs2_new: "",                // The new scheduled gamestate 2.
    gs2_prev: "",               // The previous gamestate 2.

    // Schedules a gamestate 1 change.
    changeGs1: function(new_gs1){
        // Make sure that this is a valid gamestate 1.
        if(this.gamestates_list.indexOf(new_gs1) == -1){
            throw `changesGs1: Unknown gamestate for new_gs1: ${new_gs1}.`;
        }

        // Set the gamestate change trigger.
        this.changeGs1_triggered = true; 

        // Set the previous gamestate.
        this.gs1_prev = this.gs1; 
        
        // Set the new gamestate.
        this.gs1_new = new_gs1; 
    },
    // Changes the gamestate 1.
    _changeGs1: function(){
        // Unset the gamestate change trigger.
        this.changeGs1_triggered = false; 
        
        // Set the new gamestate.
        this.gs1 = this.gs1_new;
        
        // Clear gamestate 2.
        // this.gs2 = "";
        
        // Reset the inited flag for this gamestate.
        if(this.gs1 == ""){ return; }
        _APP.game.gamestates[this.gs1].inited = false;

        // console.log(`gs1 has changed from '${this.gs1_prev}' to '${this.gs1_new}'`);
    },

    // Schedules a gamestate 2 change.
    changeGs2: function(new_gs2){
        // Set the gamestate change trigger.
        this.changeGs2_triggered = true; 

        // Set the previous gamestate.
        this.gs2_prev = this.gs2; 
        
        // Set the new gamestate.
        this.gs2_new = new_gs2; 
    },
    // Changes the gamestate 2.
    _changeGs2: function(){
        // Unset the gamestate change trigger.
        this.changeGs2_triggered = false; 
        
        // Set the new gamestate.
        this.gs2 = this.gs2_new;

        // console.log(`gs2 has changed from '${this.gs2_prev}' to '${this.gs2_new}'`);
    },

    // Gamestate code will be placed here by each gamestate.
    gamestates: {},

    // A list of available gamestates for gs1.
    gamestates_list: {},

    // Code for running the gameloop.
    gameLoop: {
        frameCounter    : 0,         // Count of every game loop iteration.
        frameDrawCounter: 0,         // Count of every draw update.
        loopType        : "raf",     // Can be "raf" for requestAnimationFrame or "to" for setTimeout.
        raf_id          : null,      // Used for stopping the game loop. 
        running         : false,     // The game loop will only run if this is set to true.
        fps             : 60,        // The target Frames Per Second value. (Max of 60.)
        msFrame         : null,      // Calculated value of the duration of one frame in milliseconds.
        DRAWNEEDED_prev : false,     // Used by the loop (and debug) to track the previous state of _GFX.DRAWNEEDED.
        lastLoopRun     : 0,         // Timestamp for when the last game loop began.
        delta           : undefined, // The difference between now and the lastLoopRun
        fadeIsBlocking  : false,     // TODO: Flag indicating if a fadeIn or fadeOut is logic-blocking while in progress.
        skipLogic       : false,
        lastLoop_timestamp   : 0,
        lastDebug1_timestamp : 0,

        // Starts the game loop after stopping it if it is running. Schedules the next frame.
        loop_start: function(){
            // Stop the next scheduled gameLoop if the gameLoop is running.
            if(this.running){ this.loop_stop(); }
            
            // Start the gameLoop.
            this.running = true; 
        
            // Schedule the next gameloop run.
            this.loop_schedule_nextRun();
        },

        // Stops the game loop (Cancels the next frame.)
        loop_stop: function(){
            // Set the gameLoop.running to false. 
            this.running = false;

            // Cancel the next scheduled animation frame. 
            if     (this.loopType == "raf"){ window.cancelAnimationFrame(this.raf_id);  }
            else if(this.loopType == "to") { window.clearTimeout(this.raf_id); }
            else{ console.error("Invalid loopType:", this.loopType); }
        },

        // Requests the next game loop iteration.
        loop_schedule_nextRun: function(){
            if     (this.loopType == "raf"){ this.raf_id = window.requestAnimationFrame( (ts)=>{ this.loop( ts ); } ); }
            else if(this.loopType == "to") { this.raf_id = setTimeout(                   (  )=>{ this.loop( performance.now() ); }, 0 ); }
            else{ console.error("Invalid loopType:", this.loopType); }
        },

        // Runs at the end of every game loop iteration. 
        endOfLoopTasks: async function(timestamp){
            // Update the 
            if(timestamp){
                // GAMESTATE CHANGES
                if(_APP.game.changeGs2_triggered){ _APP.game._changeGs2(); } 
                if(_APP.game.changeGs1_triggered){ _APP.game._changeGs1(); } 

                // If debug is active and awaitDraw is active then run the debugTasks for dummy draws.
                if(_APP.debugActive && _DEBUG.doDummyDraw){
                    await _DEBUG.debugTasks(2)
                }
            }

            // Request the next frame.
            this.loop_schedule_nextRun();
        },

        // Game loop init.
        init: async function(){
            // Calculate the ms required per frame.
            this.msFrame = 1000 / this.fps;
        
            // Init the fps object.
            this.fpsCalc.init(this.fps);
        
            // Generate all graphics on the WebWorker.
            if(_APP.configObj.generateCoreImageDataAssets){
                await _APP.utility.generateCoreImageDataAssets();
            }

            // Give default values to avoid "jumpy values" at start.
            _APP.game.gameLoop.fpsCalc.average = this.fps;
            _APP.game.gameLoop.fpsCalc.avgMsPerFrame = _APP.game.gameLoop.msFrame;
            _APP.game.gameLoop.lastLoopRun = performance.now() - _APP.game.gameLoop.msFrame;
        
            // Get initial input states.
            await _INPUT.util.getStatesForPlayers();
        
            // Get a list of the gamestates. 
            _APP.game.gamestates_list = Object.keys(_APP.game.gamestates);
        
            // Set the first gamestate.
            // _APP.game.changeGs1("gs_JSG");
            // _APP.game.changeGs1("gs_N782");
            // _APP.game.changeGs1("gs_TITLE");
            // _APP.game.changeGs1("gs_RULES");
            // _APP.game.changeGs1("gs_OPTIONS");
            _APP.game.changeGs1("gs_PLAYING");
        
            // Change to the set gamestate.
            _APP.game._changeGs1();
        },

        // Calculates the average frames per second.
        fpsCalc: {
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
                this.__delta_ = (now - this._lastTick_) / 1000;
                this.__fps_ = (1 / this.__delta_) << 0; // Round down fps.
                
                // Add to fps samples the current tick fps value.
                this._sample_[ this._index_ ] = this.__fps_;
                
                // Get the fps average by summing all samples and dividing by the sample count. 
                this.__average_ = 0;
                this.__average_i_ = this._sample_.length; 
                while (this.__average_i_--) { this.__average_ += this._sample_[this.__average_i_]; } 
                this.__average_ = ( this.__average_ / this._sample_.length);

                // Set the new FPS average.
                this.average = this.__average_;
                this.avgMsPerFrame = 1000 / this.__average_;

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
                // this._sample_.fill(0);
                // this._sample_.fill(30);
                this._sample_.fill(sampleSize);
            },
        },

        // THE GAME LOOP FUNCTION.
        loop: async function loop(timestamp){
            // Is the loop active?
            if(this.running){
                // Calculate the time difference between the new timestamp and the lastLoopRun. 
                this.delta = timestamp - this.lastLoopRun;

                // Is it time to run the next loop?
                if( (this.delta >= this.msFrame) ){
                    // Track performance.
                    this.fpsCalc.tick(timestamp - (this.delta % this.msFrame));
                    this.lastLoopRun = timestamp - (this.delta % this.msFrame);
                    this.frameCounter += 1;

                    _APP.utility.timeIt("loop_total", "reset");
                    // _APP.utility.timeIt("draw_total", "reset");
                    let lastLoop_timestamp = performance.now();
                    _APP.utility.timeIt("loop_total", "start");

                    // Do not run the logic loop if the gamestate value is "".
                    if(_APP.game.gs1 != ""){
                        // Do not run the logic loop if the skipLogic value is true.
                        if(!this.skipLogic){
                            // -- NETWORK --
                            //

                            // -- INPUT --
                            await _INPUT.util.getStatesForPlayers();
                            if(typeof _INPUT.customized.updateLiveGamepadDisplay != "undefined"){
                                _INPUT.customized.updateLiveGamepadDisplay();
                            }

                            // -- LOGIC --
                            _APP.game.gamestates[_APP.game.gs1].main();
                            
                            // -- RENDER --
                            // Render using the _GFX.layerObjs.render function.
                            if( !_APP.game.gamestates[_APP.game.gs1].render){ _GFX.layerObjs.render(_APP.game.gs1); }
                            
                            // Render using the gamestate's render function.
                            else { _APP.game.gamestates[_APP.game.gs1].render(); }

                            // -- DRAW --
                            // Determine if there are any draw updates. (Returns true/false and also sets _GFX.DRAWNEEDED.)
                            this.DRAWNEEDED_prev = _GFX.funcs.isDrawNeeded();
                            
                            // Send a draw request if there are changes for any layer.
                            _APP.utility.timeIt("draw_total", "start");
                            if( _GFX.DRAWNEEDED ) {
                                // Send the graphics updates without waiting. (This could be a problem where there are many graphics updates.)
                                // awaitDraw is false.
                                if(!_APP.configObj.awaitDraw)         {             _GFX.funcs.sendGfxUpdates(false); }
                                
                                // Synchronize the gameLoop with the rendering.
                                // awaitDraw is true.
                                else                                  {       await _GFX.funcs.sendGfxUpdates(true); }

                                this.frameDrawCounter += 1;
                                
                                // DEBUG: Clear the dummyDraw values.
                                if(_APP.debugActive){ _DEBUG.doDummyDraw = false; }
                            }
                            _APP.utility.timeIt("draw_total", "stop");
                            
                            // DEBUG
                            if(_APP.debugActive && !_GFX.DRAWNEEDED){ _DEBUG.doDummyDraw = true; }
                        }
                    }
                    
                    _APP.utility.timeIt("loop_total", "stop");
                    this.lastLoop_timestamp = performance.now() - lastLoop_timestamp;
                    
                    // End the loop and run any end of loop tasks.
                    this.endOfLoopTasks(timestamp);
                }
                else{
                    // console.log("THE LOOP DID NOT RUN THIS TIME:", new Date());
                    // End the loop and run any end of loop tasks.
                    this.endOfLoopTasks(false);
                }
            }
            // No. 
            else{
                // console.log("gameLoop is not running.");
            }
        },
    }, 
};
