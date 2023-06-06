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
        "_new_DEBUG.toggleDebugFlag",
        "requestHashCacheEntry",
        "_new_DEBUG.toggleCacheFlag",
        "_new_DEBUG.updateDebugTimings",
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
        "_new_DEBUG.toggleDebugFlag",
        "requestHashCacheEntry",
        "_new_DEBUG.toggleCacheFlag",
        "_new_DEBUG.updateDebugTimings",
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
                    if(e.data.data.minimalReturnData){
                        // Save the timings and counts.
                        _GFX.timings.initConfigAndGraphics = {
                            ...e.data.data.timings,
                            ...e.data.data.counts,
                        };
                        _GFX.tilesets = e.data.data.minimalReturnData;
                    }
                    else{
                        _GFX.tilesets = e.data.data;
                    }
                    
                    break;
                }

                case "initLayers"     : {
                    // Save the timings.
                    if(e.data.data.timings){
                        _GFX.timings.initLayers = e.data.data.timings;
                    }

                    break;
                }

                case "sendGfxUpdates"     : {
                    // Send data to afterDraw.
                    _GFX.funcs.afterDraw(e.data.data, false);

                    break;
                }

                case "_new_DEBUG.updateDebugTimings"     : {
                    // console.log(e.data.data);
                    // return e.data.data;
                    // Send data to afterDraw.
                    // _GFX.funcs.afterDraw(e.data.data, true);
                    // _GFX.funcs.afterDraw(e.data.data, false);

                    // if(_new_DEBUG.hashCache){
                    //     _new_DEBUG.hashCache.display(e.data.data, true);
                    // }

                    break;
                }

                // Unmatched function.
                default     : { 
                    // console.log("RECEIVE: No specific RECEIVE function for:", e.data.mode);
                    break; 
                }
            }

            // Resolve differed promise if applicable.
            if(this.differedProms[e.data.mode]){ 
                this.differedProms[e.data.mode].resolve(e.data); 
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
                    // version: 2,
                    version: 5,
                },
                data.refs ?? [],
            );

            // Wait until finished?
            if(waitForResp){ 
                this.differedProms[mode] = this.createDeferredPromise();
                let retData = await this.differedProms[mode].promise;
                // delete this.differedProms[mode];
                resolve(retData); 
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
        // this.worker = new Worker( `${relPath}/js/video_webworker.js`, { type: 'module' } );
        this.worker.addEventListener("message", (e)=>_WEBW_V.RECEIVE(e), false);

        resolve();
    });
};
