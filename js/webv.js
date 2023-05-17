var _WEBW_V = {
    worker: null,
    // Allowed SEND "modes."
    modes_SEND:[
        "initConfigAndGraphics",
        "initLayers",
        "sendTilesAndSprites",
        "sendGfxUpdates",
        "clearAllLayers",
        "_DEBUG.drawColorPalette",
        "_DEBUG.toggleDebugFlag",
    ],
    // Allowed RECEIVE "modes."
    modes_RECEIVE:[
        "initConfigAndGraphics",
        "initLayers",
        "sendTilesAndSprites",
        "sendGfxUpdates",
        "clearAllLayers",
        "_DEBUG.drawColorPalette",
        "_DEBUG.toggleDebugFlag",
    ],
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
    RECEIVE: function(e){
        try     { if(this.modes_RECEIVE.indexOf(e.data.mode) == -1){ console.error("Invalid mode for RECEIVE:", mode); return; } }
        catch(e){ console.error("RECEIVE: Error in 'e.data.mode'. ERROR:", e); return; }

        // Make sure there is data and a data.mode.
        if(e.data && e.data.mode){
            // if(e.data.data){ console.log("_WEBW_V: RECEIVE", e.data); }
            
            switch(e.data.mode){
                case "initConfigAndGraphics"     : {
                    _GFX.tilesets = e.data.data;
                    if(this.differedProms[e.data.mode]){ 
                        this.differedProms[e.data.mode].resolve(); 
                    }
                    break;
                }

                case "sendGfxUpdates"     : {
                    _GFX.funcs.afterDraw(e.data.data);

                    if(this.differedProms[e.data.mode]){ 
                        this.differedProms[e.data.mode].resolve(); 
                    }
                    break;
                }

                // Unmatched function.
                default     : { 
                    // 
                    if(this.differedProms[e.data.mode]){ 
                        // console.log("RECEIVE: No specific response accept function for:", e.data.mode);
                        this.differedProms[e.data.mode].resolve(); 
                    }
                    // else{
                    //     console.error("ERROR: Unmatched mode", e.data.mode); 
                    // }
                    break; 
                }
            }
        }
        else{ console.error(`ERROR: No mode? e.data: ${e.data}, e.data.mode: ${e.data.mode}, e:`, e); }

    },
    SEND: async function(mode, data, waitForResp=false, dataRequest=false){
        try     { if(this.modes_SEND.indexOf(mode) == -1){ console.error("Invalid mode for SEND:", mode); return; } }
        catch(e){ console.error("SEND: Error in 'e.data.mode'. ERROR:", e); return; }

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
    // Send the init request with the config data and transferred canvases.