_APP.shared = {
    // Used for frame-count-based timing.
    genTimer: {
        timers:{},

        // Get a timer object.
        get: function(name, gamestate){
            // EXAMPLE USAGE:
            // _APP.shared.genTimer.get("timer1", null);
            // _APP.shared.genTimer.get("timer1", _APP.game.gs1);

            if(gamestate == undefined){ gamestate = _APP.game.gs1; }

            if(!this.timers[gamestate][name]){ 
                console.error("ERROR: genTimer:get: This timer does not exist:", `name: '${name}', gamestate: '${gamestate}'`);
                return; 
            }
            
            return this.timers[gamestate][name];
        },
        
        // Remove a timer object.
        removeOne: function(name, gamestate){
            // EXAMPLE USAGE:
            // _APP.shared.genTimer.removeOne("timer1", null);
            // _APP.shared.genTimer.removeOne("timer1", _APP.game.gs1);
    
            if(gamestate == undefined){ gamestate = _APP.game.gs1; }
    
            if(!this.timers[gamestate][name]){ 
                console.error("ERROR: genTimer:get: This timer does not exist:", `name: '${name}', gamestate: '${gamestate}'`);
                return; 
            }

            delete this.timers[gamestate][name];
        },
        
        // Remove all finished timer objects. (Accepts an ignore list of timer names.)
        removeFinished: function(gamestate, ignore=[]){
            // EXAMPLE USAGE:
            // _APP.shared.genTimer.removeFinished(null, ["genWaitTimer1", "genWaitTimer2"]);
            // _APP.shared.genTimer.removeFinished(_APP.game.gs1, ["genWaitTimer1", "genWaitTimer2"]);
    
            if(gamestate == undefined){ gamestate = _APP.game.gs1; }

            // Create a list of keys that ARE NOT in the ignore list.
            let keys = Object.keys(this.timers[gamestate]).filter(d=>ignore.indexOf(d) == -1);

            // Remove all non-ignored finished keys.
            for(let name of keys){
                if(this.timers[gamestate][name].finished){
                    // console.log("Removing finished timer:", name);
                    delete this.timers[gamestate][name];
                }
            }

            // console.log("Remaining timers:", this.timers[gamestate]);
        },
        
        // Remove all timer objects. (Accepts an ignore list of timer names.)
        removeAll: function(gamestate, ignore=[]){
            // EXAMPLE USAGE:
            // _APP.shared.genTimer.removeFinished(null, ["genWaitTimer1", "genWaitTimer2"]);
            // _APP.shared.genTimer.removeFinished(_APP.game.gs1, ["genWaitTimer1", "genWaitTimer2"]);
    
            if(gamestate == undefined){ gamestate = _APP.game.gs1; }

            // Create a list of keys that ARE NOT in the ignore list.
            let keys = Object.keys(this.timers[gamestate]).filter(d=>ignore.indexOf(d) == -1);

            // Remove all non-ignored keys.
            for(let name of keys){
                // console.log("Removing timer:", name);
                delete this.timers[gamestate][name];
            }

            // console.log("Remaining timers:", this.timers[gamestate]);
        },

        // Creates a timer. Check with check. Must be reset/recreated after it finishes before reusing.
        create: function(name, maxFrames, gamestate, callback=null){
            // EXAMPLE USAGE:
            // _APP.shared.genTimer.create("timer1", 60, null);
            // _APP.shared.genTimer.create("timer1", 60, _APP.game.gs1);
            // _APP.shared.genTimer.create("timer1", 60, _APP.game.gs1, function(){ console.log("I am the callback"); } );

            if(gamestate == undefined){ gamestate = _APP.game.gs1; }
            if(this.timers[gamestate] == undefined){ this.timers[gamestate] = {}; }

            this.timers[gamestate][name] = {
                finished  : false,
                maxFrames : maxFrames,
                frameCount: 0,
                callback  : callback,
            };
        },

        // Resets a timer to it's starting state. (To reuse).
        reset : function(name, gamestate){
            // EXAMPLE USAGE:
            // _APP.shared.genTimer.reset("timer1", null);
            // _APP.shared.genTimer.reset("timer1", _APP.game.gs1);

            if(gamestate == undefined){ gamestate = _APP.game.gs1; }

            if(!this.timers[gamestate][name]){ 
                console.error("ERROR: genTimer:reset: This timer does not exist:", `name: '${name}', gamestate: '${gamestate}'`);
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

        // Sets the timer to it's finished state. (Can be reset and used again.)
        finish: function(name, gamestate){
            // EXAMPLE USAGE:
            // _APP.shared.genTimer.finish("timer1", null);
            // _APP.shared.genTimer.finish("timer1", _APP.game.gs1);

            if(gamestate == undefined){ gamestate = _APP.game.gs1; }

            if(!this.timers[gamestate][name]){ 
                console.error("ERROR: genTimer:finish: This timer does not exist:", `name: '${name}', gamestate: '${gamestate}'`);
                return; 
            }
    
            // Finish the timer. 
            this.timers[gamestate][name] = {
                finished  : true,
                maxFrames : this.timers[gamestate][name].maxFrames,
                frameCount: this.timers[gamestate][name].maxFrames,
                callback: this.timers[gamestate][name].callback,
            };
        },

        // Returns true if the timer is complete. Otherwise it increments the timer's frameCount and returns false.
        check : function(name, gamestate){
            // EXAMPLE USAGE:
            // _APP.shared.genTimer.check("timer1", null);
            // _APP.shared.genTimer.check("timer1", _APP.game.gs1);
            
            if(gamestate == undefined){ gamestate = _APP.game.gs1; }

            if(!this.timers[gamestate][name]){ 
                console.error("ERROR: genTimer:check: This timer does not exist:", `name: '${name}', gamestate: '${gamestate}'`);
                return; 
            }

            // Return true if already finished.
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

            // If this is now finished and a callback was assigned...
            if(this.timers[gamestate][name].finished){ 
                // console.log( "FINISHED:", _APP.shared.genTimer.get(name), "RUNNING CALLBACK." );
                if(this.timers[gamestate][name].callback){
                    this.timers[gamestate][name].callback();
                };
            };

            return this.timers[gamestate][name].finished;
        },
    },

    // A queue of functions intended to be run once each and sequentially.
    funcQueue: {
        funcs: {},
        create: function(name, gamestate, funcObj){
            // Make sure that a function was specified.
            if(!funcObj.func){ 
                console.error("ERROR: funcQueue:get: A function was not specified.", `name: '${name}', gamestate: '${gamestate}'`);
                return; 
            }

            // Add the gamestate key to the funcs object if it is missing.
            if(this.funcs[gamestate] == undefined){ this.funcs[gamestate] = []; }

            // Add the function.
            let newEntry = {
                name: name,
                func: funcObj.func,
                args: funcObj.args ?? [],
                bind: funcObj.bind
            };
            this.funcs[gamestate].push(newEntry);
            return newEntry;
        },
        runNext: function(gamestate){
            // Add the gamestate key to the funcs object if it is missing.
            if(this.funcs[gamestate] == undefined){ this.funcs[gamestate] = []; }

            // Don't run if there are not any queued functions.
            if(!this.funcs[gamestate].length){ return true; }

            // Remove the first funcObj.
            let funcObj = this.funcs[gamestate].shift();

            // Run the funcObj.
            funcObj.func.bind(funcObj.bind)(...funcObj.args);

            // The funcObj is no longer part of this.funcs[gamestate].
            return false;
        },
        clearQueue: function(gamestate){
            // Add the gamestate key to the funcs object if it is missing.
            if(this.funcs[gamestate] == undefined){ this.funcs[gamestate] = []; }

            // Clear the queued functions.
            this.funcs[gamestate] = [];
        },
    },

    getAllGamepadStates: function(){
        // Get the gamepad states for p1 and p2.
        let gpInput = {
            "P1": _INPUT.util.stateByteToObj2("p1"),
            "P2": _INPUT.util.stateByteToObj2("p2"),
        };

        // Create a new key "ANY" that can be checked for any buttons pressed by either player.
        gpInput["ANY"] = {
            "held": {},
            "press": {},
            "release": {}
        };
        const states = ["held", "press", "release"];
        const buttons = _INPUT.consts.buttons;

        // Iterate through each state ("held", "press", "release").
        for (let i = 0; i < states.length; i++) {
            const state = states[i];

            // Iterate through each button.
            for (let j = 0; j < buttons.length; j++) {
                const button = buttons[j];

                // Set the value in "ANY" to true if either "P1" or "P2" has that property set to true.
                gpInput["ANY"][state][button] = gpInput["P1"][state][button] || gpInput["P2"][state][button];
            }
        }

        return gpInput;
    },
};
