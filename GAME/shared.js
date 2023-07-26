_APP.shared = {
    // Used for frame-count-based timing.
    // Also can accept a callback to run when the timer finishes.
    genTimer: {
        // Contains the timers. Each key in the object should be a gamestate1 and is an object of timers.
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
            // _APP.shared.genTimer.create("timer1", 60, _APP.game.gs1, function(){ console.log("I am the callback! I run when this timer finishes."); } );

            if(gamestate == undefined){ gamestate = _APP.game.gs1; }
            if(this.timers[gamestate] == undefined){ this.timers[gamestate] = {}; }

            this.timers[gamestate][name] = {
                finished  : false,
                maxFrames : maxFrames,
                frameCount: 0,
                callback  : callback,
            };
        },

        // Resets a timer to it's starting state. (Helpful when reusing a timer. You can also just create it again with the same values.)
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
                callback  : this.timers[gamestate][name].callback,
            };
        },

        // Returns true if the timer is complete. Otherwise it increments the timer's frameCount and returns false.
        check : function(name, gamestate){
            // EXAMPLE USAGE:
            // _APP.shared.genTimer.check("timer1", null);
            // _APP.shared.genTimer.check("timer1", _APP.game.gs1);
            
            if(gamestate == undefined){ gamestate = _APP.game.gs1; }

            // Cannot operate on a timer that does not exist!
            if(!this.timers[gamestate][name]){ 
                console.error("ERROR: genTimer:check: This timer does not exist:", `name: '${name}', gamestate: '${gamestate}'`);
                return; 
            }

            // Return true if already finished. (This avoids running the callback function again.)
            if(this.timers[gamestate][name].finished){ return true; };

            // Check and update the timer. 
            if( this.timers[gamestate][name].frameCount >= this.timers[gamestate][name].maxFrames ){
                // Set the finished flag.
                this.timers[gamestate][name].finished = true;
            }
            else{
                // Increment the frameCount by 1.
                this.timers[gamestate][name].frameCount += 1;
            }

            // If this timer is now marked as finished check if there is a callback function assigned to it.
            if(this.timers[gamestate][name].finished){ 
                // If there is a callback function assigned then run the callback function.
                if(this.timers[gamestate][name].callback){
                    this.timers[gamestate][name].callback();
                };
            };

            // Return the state of the timer (If finished then true, otherwise, false.)
            return this.timers[gamestate][name].finished;
        },
    },

    // A queue of functions intended to be run once each and sequentially.
    // NOTES: 
    // runNext: The next func does not wait for the prev func to finish. Await is NOT used by runNext.
    // For example, when queuing a reverse and a skip then the skip would nearly immediately override the reverse.
    // If you need to run functions sequentially then you can nest genTimers instead. The callback function runs AFTER the timer completes.
    // Functions are expected to be tied to a gamestate1. If changing gamestates old functions can remain so they should be cleared at the start of a gamestate1.
    funcQueue: {
        // Contains the functions. Each key in the object should be a gamestate1 and is an array of functions.
        funcs: {}, 

        // Adds a new function to the funcQueue. (funcs)
        add: function(name, gamestate, funcObj){ this.create(name, gamestate, funcObj); },
        create: function(name, gamestate, funcObj){
            // EXAMPLE USAGE:
            // _APP.shared.funcQueue.create("timer1", null, ()=>{});
            // _APP.shared.funcQueue.create("timer1", _APP.game.gs1, ()=>{ console.log("I am the callback! I run in sequence to any other functions in the funcQueue."); });

            // Make sure that a function was specified.
            if(!funcObj.func){ 
                console.error("ERROR: funcQueue:create: A function was not specified.", `name: '${name}', gamestate: '${gamestate}'`);
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
        
        // Shifts off the first function from the funcs[gamestate] array and runs it.
        runNext: function(gamestate){
            // EXAMPLE USAGE:
            // _APP.shared.funcQueue.runNext(null);
            // _APP.shared.funcQueue.runNext(_APP.game.gs1);

            // Add the gamestate key to the funcs object if it is missing.
            if(this.funcs[gamestate] == undefined){ this.funcs[gamestate] = []; }

            // Don't run if there are not any queued functions.
            if(!this.funcs[gamestate].length){ return true; }

            // Run the funcObj using the binding provided.
            let funcObj = this.funcs[gamestate].shift();

            // Run the funcObj.
            funcObj.func.bind(funcObj.bind)(...funcObj.args);

            // The funcObj is no longer part of this.funcs[gamestate].
            return false;
        },

        // Clears the funcs[gamestate] array.
        clearQueue: function(gamestate){
            // EXAMPLE USAGE:
            // _APP.shared.funcQueue.clearQueue(null);
            // _APP.shared.funcQueue.clearQueue(_APP.game.gs1);

            // Add the gamestate key to the funcs object if it is missing.
            if(this.funcs[gamestate] == undefined){ this.funcs[gamestate] = []; }

            // Clear the queued functions.
            this.funcs[gamestate] = [];
        },
    },

    // Utility function to retrieve gamestates for P1 and P2.
    getAllGamepadStates: function(){
        if(!_APP.configObj.inputConfig.enabled){ return {}; }

        // ANY is a combination of P1 and P2 states.
        // ANY_bool is simply a true/false for the combination of P1 and P2 states.
        // The button states are "held", "press", "release".
        // Button names: 
        //   BTN_SR   , BTN_SL                       // Shoulder buttons (top.)
        //   BTN_X    , BTN_A     , BTN_Y, BTN_B     // Face buttons (right side.)
        //   BTN_RIGHT, BTN_LEFT  , BTN_DOWN, BTN_UP // Directional buttons (left side.)
        //   BTN_START, BTN_SELECT                   // Center buttons (center.)
        
        // Get the gamepad states for p1 and p2.
        let gpInput = {
            "P1": _INPUT.util.stateByteToObj2("p1"),
            "P2": _INPUT.util.stateByteToObj2("p2"),
        };

        // Create a new key "ANY" that can be checked for any buttons pressed by either player.
        gpInput["ANY"] = {
            "held"   : {},
            "press"  : {},
            "release": {}
        };

        // Create a new key "ANY_bool" that only provides true/false for a button state.
        gpInput["ANY_bool"] = {
            "held"   : false,
            "press"  : false,
            "release": false
        };

        // Available button states.
        const states = ["held", "press", "release"];

        // Available buttons. 
        const buttons = _INPUT.consts.buttons;

        // Populate "ANY" and "ANY_bool"...
        // Iterate through each state ("held", "press", "release").
        for (let i = 0; i < states.length; i++) {
            // Get the state name.
            const state = states[i];

            // Iterate through each button for this state.
            for (let j = 0; j < buttons.length; j++) {
                // Get the button name. 
                const button = buttons[j];

                // Set the value in "ANY" to true if either "P1" or "P2" has that property set to true.
                gpInput["ANY"][state][button] = gpInput["P1"][state][button] || gpInput["P2"][state][button];

                // Any button pressed on a state should update ANY_bool to true for that button state.
                if(
                    // Don't update if already set.
                    !gpInput["ANY_bool"][state] && 
                    // If either P1 or P2 for the state and button are true.
                    gpInput["P1"][state][button] || gpInput["P2"][state][button]
                ){
                    // Set ANY_bool's value for the state.
                    gpInput["ANY_bool"][state] = true;
                }
            }
        }

        // Return the completed gamepad input.
        return gpInput;
    },
};
