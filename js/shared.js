_APP.shared = {
    // Used for frame-count-based timing.
    genTimer: {
        timers:{},

        // Get a timer object.
        get: function(name, gamestate){
            // EXAMPLE USAGE:
            // _APP.shared.genTimer.get("timer1");
            // _APP.shared.genTimer.get("timer1", _APP.game.gs1);

            if(gamestate == undefined){ gamestate = _APP.game.gs1; }

            if(!this.timers[gamestate][name]){ 
                console.error("ERROR: genTimer:get: This timer does not exist:", name, gamestate);
                return; 
            }

            return this.timers[gamestate][name];
        },

        // Creates a timer. Check with check. Must be reset/recreated after it finishes before reusing.
        create: function(name, maxFrames, gamestate, callback=null){
            // EXAMPLE USAGE:
            // _APP.shared.genTimer.create("timer1", 60);
            // _APP.shared.genTimer.create("timer1", 60, _APP.game.gs1);
            // _APP.shared.genTimer.create("timer1", 60, _APP.game.gs1, function(){ console.log("I am the callback"); } );

            if(gamestate == undefined){ gamestate = _APP.game.gs1; }
            if(this.timers[gamestate] == undefined){ this.timers[gamestate] = {}; }

            this.timers[gamestate][name] = {
                finished  : false,
                maxFrames : maxFrames,
                frameCount: 0,
                callback: callback,
            };
        },

        // Resets a timer to it's starting state.
        reset : function(name, gamestate){
            // EXAMPLE USAGE:
            // _APP.shared.genTimer.reset("timer1");
            // _APP.shared.genTimer.reset("timer1", _APP.game.gs1);

            if(gamestate == undefined){ gamestate = _APP.game.gs1; }

            if(!this.timers[gamestate][name]){ 
                console.error("ERROR: genTimer:reset: This timer does not exist:", name, gamestate);
                return; 
            }
    
            // Reset the timer. 
            this.timers[gamestate][name] = {
                finished  : false,
                maxFrames : this.timers[gamestate][name].maxFrames,
                frameCount: 0,
                callback: this.timers[gamestate][name].callback,
            };
        },

        // Sets the timer to it's finished state.
        finish: function(name, gamestate){
            // EXAMPLE USAGE:
            // _APP.shared.genTimer.finish("timer1");
            // _APP.shared.genTimer.finish("timer1", _APP.game.gs1);

            if(gamestate == undefined){ gamestate = _APP.game.gs1; }

            if(!this.timers[gamestate][name]){ 
                console.error("ERROR: genTimer:finish: This timer does not exist:", name, gamestate);
                return; 
            }
    
            // Finish the timer. 
            this.timers[gamestate][name] = {
                finished  : true,
                maxFrames : this.timers[gamestate][name].maxFrames,
                frameCount: this.timers[gamestate][name].maxFrames,
            };
        },

        // Returns true if the timer is complete. Otherwise it increments the timer's frameCount and returns false.
        check : function(name, gamestate){
            // EXAMPLE USAGE:
            // _APP.shared.genTimer.check("timer1");
            // _APP.shared.genTimer.check("timer1", _APP.game.gs1);
            
            if(gamestate == undefined){ gamestate = _APP.game.gs1; }

            if(!this.timers[gamestate][name]){ 
                console.error("ERROR: genTimer:check: This timer does not exist:", name, gamestate);
                return; 
            }

            // Return true if finished.
            if(this.timers[gamestate][name].finished){ return true; };

            // Check and update the timer. 
            if(
                this.timers[gamestate][name].frameCount >= this.timers[gamestate][name].maxFrames && 
                !this.timers[gamestate][name].finished
            ){
                this.timers[gamestate][name].finished = true;
            }
            else{
                // Increment by 1.
                this.timers[gamestate][name].frameCount += 1;
            }

            if(this.timers[gamestate][name].finished){ 
                // console.log( "FINISHED:", _APP.shared.genTimer.get(name) );
                if(this.timers[gamestate][name].callback){
                    this.timers[gamestate][name].callback();
                };
                return true; 
            };
            return this.timers[gamestate][name].finished;
        },
    },
};
