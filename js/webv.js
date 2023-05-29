var _WEBW_V = {
    worker: null,
    // Allowed SEND "modes."
    modes_SEND:[
        "initConfigAndGraphics",
        "initLayers",
        "sendTilesAndSprites",
        "sendGfxUpdates",
        "clearAllLayers",
        "generateCoreImageDataAssets",
        // DEBUG
        "_DEBUG.toggleDebugFlag",
        "requestHashCacheEntry",
        "_DEBUG.toggleCacheFlag",
    ],
    
    // Allowed RECEIVE "modes."
    modes_RECEIVE:[
        "initConfigAndGraphics",
        "initLayers",
        "sendTilesAndSprites",
        "sendGfxUpdates",
        "clearAllLayers",
        "generateCoreImageDataAssets",
        // DEBUG
        "_DEBUG.toggleDebugFlag",
        "requestHashCacheEntry",
        "_DEBUG.toggleCacheFlag",
    ],
    
    // Differed promises allow the system to wait for a response from the WebWorker.
    differedProms: {},
    createDeferredPromise : function(){
        var deferred = {};
        var promise = new Promise(function(resolve, reject) {
            deferred.resolve = resolve;
            deferred.reject  = reject;
        });
        deferred.promise = promise;
        return deferred;
    },

    // Handles the reception of responses.
    RECEIVE: function(e){
        // try     { if(this.modes_RECEIVE.indexOf(e.data.mode) == -1){ console.error("Invalid mode for RECEIVE:", mode); return; } }
        // catch(e){ console.error("RECEIVE: Error in 'e.data.mode'. ERROR:", e); return; }
        if(this.modes_RECEIVE.indexOf(e.data.mode) == -1){ console.error("Invalid mode for RECEIVE:", mode); return; }

        // Make sure there is data and a data.mode.
        if(e.data && e.data.mode){
            // if(e.data.data){ console.log("_WEBW_V: RECEIVE", e.data); }
            
            switch(e.data.mode){
                
                case "initConfigAndGraphics"     : {
                    // Save tileset/tilemap data.
                    _GFX.tilesets = e.data.data;
                    
                    // Resolve differed promise?
                    if(this.differedProms[e.data.mode]){ 
                        this.differedProms[e.data.mode].resolve(); 
                    }
                    break;
                }

                case "sendGfxUpdates"     : {
                    // Send data to afterDraw.
                    _GFX.funcs.afterDraw(e.data.data);

                    // Resolve differed promise?
                    if(this.differedProms[e.data.mode]){ 
                        this.differedProms[e.data.mode].resolve(); 
                    }
                    break;
                }

                // Unmatched function.
                default     : { 
                    // Resolve differed promise?
                    if(this.differedProms[e.data.mode]){ 
                        // console.log("RECEIVE: No specific response accept function for:", e.data.mode);
                        this.differedProms[e.data.mode].resolve(); 
                    }
                    break; 
                }
            }
        }
        else{ console.error(`ERROR: No mode? e.data: ${e.data}, e.data.mode: ${e.data.mode}, e:`, e); }
    },

    // Sends requests to the WebWorker. Can await a differed promise or request data.
    SEND: async function(mode, data, waitForResp=false, dataRequest=false){
        // try     { if(this.modes_SEND.indexOf(mode) == -1){ console.error("Invalid mode for SEND:", mode); return; } }
        // catch(e){ console.error("SEND: Error in 'e.data.mode'. ERROR:", e); return; }
        if(this.modes_SEND.indexOf(mode) == -1){ console.error("Invalid mode for SEND:", mode); return; } 

        return new Promise(async(resolve,reject)=>{
            // Inject debugActive into data.data.
            if(mode == "initConfigAndGraphics"){
                data.data.debugActive = _APP.debugActive ?? false;
            }

            // Send the message.
            this.worker.postMessage(
                {
                    mode: mode,
                    data: data.data,
                    flags: { waitForResp: waitForResp, dataRequest: dataRequest },
                    version: 2,
                },
                data.refs ?? [],
            );

            // Wait until finished?
            if(waitForResp){ 
                this.differedProms[mode] = this.createDeferredPromise();
                await this.differedProms[mode].promise;
                // delete this.differedProms[mode];
                resolve(); 
                return; 
            }
            else{
                resolve();
            }
        });
    },
};

// Starts the WebWorker and adds the "message" event listener to the WebWorker.
_WEBW_V.init = async function(){
    return new Promise(async (resolve,reject)=>{
        // Add the web worker and set the 'message' listener.
        let relPath = ".";
        if(_APP.usingJSGAME){ relPath = "./games/JSGAME_Uno"; }
        this.worker = new Worker( `${relPath}/js/video_webworker.js` );
        this.worker.addEventListener("message", (e)=>this.RECEIVE(e), false);

        resolve();
    });
};
