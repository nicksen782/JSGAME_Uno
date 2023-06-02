'use strict';

// Take care of vendor prefixes.
// self.postMessage = self.postMessage || self.webkitPostMessage;

var debugActive = false;
const messageFuncs = {
    timings: {
        gfx: {
            "L1" : {},
            "L2" : {},
            "L3" : {},
            "L4" : {},
            "gfx" : 0,
        },
        initConfigAndGraphics: {},
        initLayers: {},
        clearAllLayers: {},
    },
};

// Import the graphics modules (V4 or version 2).
// importScripts("createGraphicsAssets.js");
// importScripts("ww_sendGfxUpdatesV4.js");

// Import the graphics module (V5 or version 5).
importScripts("ww_gfxCoreV5.js");
importScripts("ww_gfxMainV5.js");
(async ()=>{
    if(typeof gfxCoreV5 != "undefined" && !gfxCoreV5.isModuleLoaded()){ await gfxCoreV5.module_init(this, "gfxCoreV5"); }
    if(typeof gfxMainV5 != "undefined" && !gfxMainV5.isModuleLoaded()){ await gfxMainV5.module_init(this, "gfxMainV5"); }
})();

const timeItData = {};
function timeIt(key, func){
    // timeIt("KEY_NAME", "start");
    // timeIt("KEY_NAME", "stop");
    // timeIt("KEY_NAME", "get");
    // timeIt("KEY_NAME", "reset");
    // timeIt("", "getAll");

    if     (func == "start"){
        if(!timeItData[key]){ 
            timeItData[key] = { t:0, s:0, e:0 }; 
        }
        timeItData[key].s = performance.now();
        timeItData[key].e = performance.now();
        timeItData[key].t = performance.now();
        return timeItData[key].t;
    }
    else if(func == "stop"){
        timeItData[key].t = performance.now() - timeItData[key].s;
        timeItData[key].s = 0;
        timeItData[key].e = 0;
        return timeItData[key].t;
    }
    else if(func == "get"){
        return timeItData[key].t;
    }
    else if(func == "getAll"){
        let data = {};
        for(let key in timeItData){
            data[key] = timeItData[key].t;
        }
        return data;
    }
    else if(func == "reset"){
        if(!timeItData[key]){ timeItData[key] = { t:0, s:0, e:0 };  }
        timeItData[key].t = 0;
        timeItData[key].s = 0;
        timeItData[key].e = 0;
        return timeItData[key].t;
    }
};
const _GFX = {
    // The configObj from the application.
    configObj: {},

    // Contains the canvas and ctx for each layer. Holds the imgDataCache which is used to update the canvas.
    layers: {},
    defaultSettings: {},
    currentData: {
        "L1":{
            bgColorRgba: [0,0,0,0],
            bgColor32bit: 0, // Used as a check to avoid repeatly changing to the same color.
            tilemaps : {},
            fade     : {},
        },
        "L2":{
            tilemaps : {},
            fade     : {},
        },
        "L3":{
            tilemaps : {},
            fade     : {},
        },
        "L4":{
            tilemaps : {},
            fade     : {},
        },
    },
    utilities: {
        // Look through a tileset for a map record that contains a match for the provided tilemap.
        findRelatedMapKey: function(ts, tmap){
            let tmap_same;
            let tmap2;
            for(let mapKey in _GFX.tilesets[ts].tilemaps){
                tmap2 = _GFX.tilesets[ts].tilemaps[mapKey];
                tmap_same = _GFX.utilities.areArraysEqual(tmap, tmap2);
                if(tmap_same){ return mapKey; };
            }
            return "";
        },

        // Convert array having values for r,g,b,a to 32-bit rgba value.
        rgbaTo32bit: function(rgbaArray){
            // Break out the values in rgbaArray.
            let [r, g, b, a] = rgbaArray;
            
            // Generate the 32-bit version of the rgbaArray.
            // let fillColor = (a << 24) | (b << 16) | (g << 8) | r;
            let fillColor = ((a << 24) | (b << 16) | (g << 8) | r) >>> 0;
            
            // Return the result.
            return fillColor;
        },

        // Returns a hash for the specified string. (Variation of Dan Bernstein's djb2 hash.)
        _djb2Hash: function(str) {
            if(typeof str != "string") { str = str.toString(); }
            var hash = 5381;
            for (var i = 0; i < str.length; i++) {
                hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
            }
            return hash;
        },

        // Axis-Aligned Bounding Box. (Determine if two rectangles are intersecting.)
        aabb_collisionDetection: function(rect1, rect2){
            // EXAMPLE USAGE:
            // aabb_collisionDetection({x:0,y:0,w:16,h:16}, {x:8,y:8,w:16,h:16});
    
            let collision = false;
            let overlapX, overlapY, overlapWidth, overlapHeight;
    
            // Check for overlap.
            if (
                rect1.x < rect2.x + rect2.w &&
                rect1.x + rect1.w > rect2.x &&
                rect1.y < rect2.y + rect2.h &&
                rect1.h + rect1.y > rect2.y
            ){ 
                collision = true;
    
                // Calculate the region that is overlapped.
                overlapX      = Math.max(rect1.x, rect2.x);
                overlapY      = Math.max(rect1.y, rect2.y);
                overlapWidth  = Math.min(rect1.x + rect1.w, rect2.x + rect2.w) - overlapX;
                overlapHeight = Math.min(rect1.y + rect1.h, rect2.y + rect2.h) - overlapY;
            }
            
            // Return the collision flag and the overlap region if applicable. 
            return {
                collision: collision,
                x: overlapX,
                y: overlapY,
                w: overlapWidth,
                h: overlapHeight
            };
        },

        // Checks if arrays are equal. (recursion)
        areArraysEqual: function(array1, array2) {
            // Check if the arrays are the same length. If they are then there is nothing more that needs to be checked.
            if (array1.length !== array2.length) { return false; }
        
            // Check if all items exist and are in the same order
            for (let i = 0; i < array1.length; i++) {
                // Handle arrays using recursion.
                if (
                    Array.isArray(array1[i]) && 
                    Array.isArray(array2[i])
                ) {
                    if (!this.areArraysEqual(array1[i], array2[i])) {
                        return false;
                    }
                } 
                // Handle normal properties. Are these properties that same value?
                else if (array1[i] !== array2[i]) {
                    return false;
                }
            }
        
            // If we have not returned false by this point then the arrays are equal.
            return true;
        },
        
        // Checks that settings objects are equal.
        areSettingsObjectsEqual: function(compareObj1, compareObj2=_GFX.defaultSettings) {
            // These are the keys that are required.
            let settingsKeys = Object.keys(_GFX.defaultSettings);
            
            // Check that obj1 and obj2 have all keys of settingsKeys.
            for (let key of settingsKeys) {
                if(!(key in compareObj1)){ 
                    console.log(`areSettingsObjectsEqual: Missing key: '${key}' compareObj1:`, compareObj1);
                    throw `areSettingsObjectsEqual: missing key in compareObj1: '${key}'`; 
                }
                if(!(key in compareObj2)){ 
                    console.log(`areSettingsObjectsEqual: Missing key: '${key}' compareObj2:`, compareObj2);
                    throw `areSettingsObjectsEqual: missing key in compareObj2: '${key}'`; 
                }
            }

            for (let key in compareObj1) {
                if (compareObj1.hasOwnProperty(key)) {
                    if (
                        Array.isArray(compareObj1[key]) && 
                        Array.isArray(compareObj2[key])
                    ) {
                        if (!this.areArraysEqual(compareObj1[key], compareObj2[key])) {
                            return false;
                        }
                    } 
                    else if (compareObj1[key] !== compareObj2[key]) {
                        return false;
                    }
                }
            }
            return true;
        },
    },
};

self.onmessage = async function(event) {
    if(! (event.data.version == 2 || event.data.version == 5) ){
        console.log("Mismatched version. Must be version 2 or 5.");
        self.postMessage( {mode: event.data, data: ""}, [] );
    }

    // VERSION 5 METHODS
    if(event.data.version == 5){ 
        gfxMainV5.messageHander(event);
    }

    // VERSION 2 METHODS
    else if(event.data.version == 2){ 
        messageFuncs.gfx.messageHander(event);
    }
};
