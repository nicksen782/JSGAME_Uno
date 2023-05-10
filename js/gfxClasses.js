// Static methods and properties belong to the class and not to the instances of the class. 
// They cannot be used by an instance of the class.
// They can only be called by NameOfClass.property or NameOfClass.method.
// They are NOT inherited when the class is extended.

// Creates one LayerObject.
class LayerObject {
    /* EXAMPLE USAGE:
    */

    constructor(config){
        this.orgConfig  = config;
        this.immediateAdd = config.immediateAdd ?? false;

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

        // Hidden.
        this.hidden = false; 

        // Add to _GFX.currentData.
        if(config.immediateAdd){
            this.firstRender();
        }
    };
    
    // Remove the LayerObject from _GFX.currentData, set the hidden flag, return the orgConfig
    hideLayerObject(){
        // Remove from _GFX.currentData and return the original config. (Helpful when changing layers.)
        return this.removeLayerObject();
    }
    // Removes the LayerObject data from _GFX.currentData. (Causing the drawing to be removed.)
    // Unsets the hidden flag to enable the render functions for this LayerObject. (So that drawing will work.)
    unhideLayerObject(){
        // Allow rendering by unsetting the hidden flag.
        this.hidden = false; 

        // Render the LayerObject.
        // this.render();
    }
    
    removeLayerObject(){
        // Remove the layer object from the cache.
        _GFX.funcs.removeLayerObj(this.layerKey, this.layerObjKey);
        
        // Prevent further rendering by settings the hidden flag.
        this.hidden = true; 
        
        // Return the original config. (Helpful when changing layers.)
        return this.orgConfig;
    };

    // Render functions.
    firstRender(){
        if(this.hidden){ return; }
        this.render();
    };

    render(){
        if(this.hidden){ return; }
        _GFX.funcs.updateLayer(this.layerKey, 
            {
                ..._GFX.funcs.createLayerObjData({ 
                    mapKey: this.layerObjKey, x: this.x/8, y: this.y/8, ts: this.tilesetKey, settings: this.settings, 
                    tmap: this.tmap
                }),
            }
        );
    };
}


class N782_face extends LayerObject{
    constructor(config){
        super(config);
    }
};
class N782_text extends LayerObject{
    constructor(config){
        super(config);
    }
};
class N782_star extends LayerObject{
    constructor(config){
        super(config);
    }
};

class Card extends LayerObject{
    // Set named colors.
    static colors = {
        cardOrange: [182, 72,  0,255], // tile_orange_color
        cardYellow: [255,182, 85,255], // tile_yellow_color
        cardBlue  : [ 72,109,170,255], // tile_blue_color
        cardRed   : [218,  0,  0,255], // tile_red_color
        cardGreen : [  0,145,  0,255], // tile_green_color
    };

    constructor(config){
        super(config);

        this.orgConfig  = config;
        this.immediateAdd = config.immediateAdd ?? false;
        this.card = config.card ?? { size: "small", value: "CARD_0", color: "CARD_YELLOW" };

        // What type of card is this?
        if(config.card.size=="small"){ 
            // Wild cards.
            if(config.card.color=="CARD_BLACK"){
                // Set the card tilemap. 

                // WILD
                if      (config.card.value=="CARD_WILD"){
                    this.tmap = _GFX.funcs.getTilemap("bg_tiles", "card_wild_front_sm");
                }

                // WILD Draw 4
                else if (config.card.value=="CARD_WILD_DRAW4"){
                    this.tmap = _GFX.funcs.getTilemap("bg_tiles", "card_wild_d4front_sm");
                }
            }
            // Back of cards.
            else if(config.card.color=="CARD_BACK"){
                this.tmap = _GFX.funcs.getTilemap("bg_tiles", "card_back_sm_0deg");
            }
            else{
                // Set the card tilemap. 
                this.tmap = _GFX.funcs.getTilemap("bg_tiles", "card_front_orange_sm");

                // Handle the changing of the card color.
                if     (config.card.color=="CARD_YELLOW"){
                    this.settings.colorData = [ [ Card.colors.cardOrange, Card.colors.cardYellow ] ];
                }
                else if(config.card.color=="CARD_BLUE"){
                    this.settings.colorData = [ [ Card.colors.cardOrange, Card.colors.cardBlue ] ];
                }
                else if(config.card.color=="CARD_RED"){
                    this.settings.colorData = [ [ Card.colors.cardOrange, Card.colors.cardRed] ];
                }
                else if(config.card.color=="CARD_GREEN"){
                    this.settings.colorData = [ [ Card.colors.cardOrange, Card.colors.cardGreen] ];
                }

                // Determine what the corner tiles (uppper-left, lower-right) tiles will need to be.
                let tmpMap1;
                let tmpMap2;
                
                if     (config.card.value == "CARD_0"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_0b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_0b_180"); }
                else if(config.card.value == "CARD_1"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_1b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_1b_180"); }
                else if(config.card.value == "CARD_2"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_2b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_2b_180"); }
                else if(config.card.value == "CARD_3"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_3b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_3b_180"); }
                else if(config.card.value == "CARD_4"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_4b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_4b_180"); }
                else if(config.card.value == "CARD_5"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_5b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_5b_180"); }
                else if(config.card.value == "CARD_6"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_6b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_6b_180"); }
                else if(config.card.value == "CARD_7"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_7b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_7b_180"); }
                else if(config.card.value == "CARD_8"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_8b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_8b_180"); }
                else if(config.card.value == "CARD_9"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_9b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_9b_180"); }
                else if(config.card.value == "CARD_DRAW2"){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_smDraw2b");  tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_smDraw2b_180"); }
                else if(config.card.value == "CARD_SKIP" ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_smSkipb");   tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_smSkipb_180"); }
                else if(config.card.value == "CARD_REV"  ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_smReverse"); tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_smReverse_180"); }
                else{
                    throw `ERROR: Bad config.card.value: ${config.card.value}`;
                }

                // Replace the corner tiles. 
                this.tmap[2] = tmpMap1[2];
                this.tmap[this.tmap.length-1] = tmpMap2[2];
            }
        }
        // TODO: INCOMPLETE
        else if(config.card.size=="large"){ 
            
            // What type of card is this?
            if(config.card.color=="CARD_BLACK"){
                // Set the card tilemap. 

                // WILD
                if      (config.card.value=="CARD_WILD"){
                    this.tmap = _GFX.funcs.getTilemap("bg_tiles", "card_wild_front_lg");
                }

                // WILD Draw 4
                else if (config.card.value=="CARD_WILD_DRAW4"){
                    this.tmap = _GFX.funcs.getTilemap("bg_tiles", "card_wild_draw4_front_lg");
                }
            }
            // Back of cards.
            else if(config.card.color=="CARD_BACK"){
                this.tmap = _GFX.funcs.getTilemap("bg_tiles", "card_back_lg"); 
            }
            else{
                // Set the card tilemap. 
                this.tmap = _GFX.funcs.getTilemap("bg_tiles", "card_front_orange_lg");

                // Handle the changing of the card color.
                if     (config.card.color=="CARD_YELLOW"){
                    this.settings.colorData = [ [ Card.colors.cardOrange, Card.colors.cardYellow ] ];
                }
                else if(config.card.color=="CARD_BLUE"){
                    this.settings.colorData = [ [ Card.colors.cardOrange, Card.colors.cardBlue ] ];
                }
                else if(config.card.color=="CARD_RED"){
                    this.settings.colorData = [ [ Card.colors.cardOrange, Card.colors.cardRed] ];
                }
                else if(config.card.color=="CARD_GREEN"){
                    this.settings.colorData = [ [ Card.colors.cardOrange, Card.colors.cardGreen] ];
                }

                // Determine what the corner tiles (uppper-left, lower-right) tiles will need to be.
                let tmpMap1;
                let tmpMap2;
                
                if     (config.card.value == "CARD_0"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_0b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_0b_180"); }
                else if(config.card.value == "CARD_1"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_1b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_1b_180"); }
                else if(config.card.value == "CARD_2"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_2b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_2b_180"); }
                else if(config.card.value == "CARD_3"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_3b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_3b_180"); }
                else if(config.card.value == "CARD_4"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_4b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_4b_180"); }
                else if(config.card.value == "CARD_5"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_5b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_5b_180"); }
                else if(config.card.value == "CARD_6"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_6b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_6b_180"); }
                else if(config.card.value == "CARD_7"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_7b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_7b_180"); }
                else if(config.card.value == "CARD_8"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_8b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_8b_180"); }
                else if(config.card.value == "CARD_9"    ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_9b");        tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_9b_180"); }
                else if(config.card.value == "CARD_DRAW2"){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_smDraw2b");  tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_smDraw2b_180"); }
                else if(config.card.value == "CARD_SKIP" ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_smSkipb");   tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_smSkipb_180"); }
                else if(config.card.value == "CARD_REV"  ){ tmpMap1 = _GFX.funcs.getTilemap("bg_tiles", "tile_smReverse"); tmpMap2 = _GFX.funcs.getTilemap("bg_tiles", "tile_smReverse_180"); }
                else{
                    throw `ERROR: Bad config.card.value: ${config.card.value}`;
                }

                // Replace the corner tiles. 
                this.tmap[2] = tmpMap1[2];
                this.tmap[this.tmap.length-1] = tmpMap2[2];
            }
        }
    };

    // Render function.
    firstRender(){ this.render(); };

    render(){
        _GFX.funcs.updateLayer(this.layerKey, 
            {
                ..._GFX.funcs.createLayerObjData({ 
                    mapKey: this.layerObjKey, x: this.x/8, y: this.y/8, ts: this.tilesetKey, settings: this.settings, 
                    tmap: this.tmap
                }),
            }
        );
    };
};

class Cursor extends LayerObject{
    constructor(config){
        super(config);
    }
};

