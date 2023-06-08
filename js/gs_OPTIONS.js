_APP.game.gamestates["gs_OPTIONS"] = {
    gameSettings: {
        PLAYERTYPES: ["HUMAN", "CPU", "NONE"],
        WINTYPES   : ["at500pts", "atZeroCards"],
        DRAWTYPES  : [["one", "until"]],
        P1  : "HUMAN",
        P2  : "CPU",
        P3  : "NONE",
        P4  : "NONE",
        WIN : "atZeroCards", // ["at500pts", "atZeroCards"]
        DRAW: "one",      // ["one", "until"]
    },

    //
    genSection: function(section){
        if     (section == "start"){
            let x=0;
            let y=0;

            // Screen border and title.
            Border.createBorder({
                x:x+0, y:y+0, w: 28, h: 28, 
                layerObjKey: `brdr_All`, layerKey: "L2", xyByGrid: true, tilesetKey: "bg_tiles1"
            });
            _GFX.layerObjs.createOne(PrintText, { text: "OPTIONS", x:x+11, y: y+0, layerObjKey: `screen_title`, layerKey: "L4", xyByGrid: true, settings: { bgColorRgba: [0,0,0,168] } });

            // UNO at the top.
            _GFX.layerObjs.createOne(UnoLetter, { letter: "u2", x:x+3 , y: y+2, layerObjKey: `letter_uno2_u`, layerKey: "L1", xyByGrid: true, framesBeforeIndexChange: 30, framesIndex: 0 });
            _GFX.layerObjs.createOne(UnoLetter, { letter: "n2", x:x+11, y: y+2, layerObjKey: `letter_uno2_n`, layerKey: "L1", xyByGrid: true, framesBeforeIndexChange: 30, framesIndex: 1 });
            _GFX.layerObjs.createOne(UnoLetter, { letter: "o2", x:x+19, y: y+2, layerObjKey: `letter_uno2_o`, layerKey: "L1", xyByGrid: true, framesBeforeIndexChange: 30, framesIndex: 2 });
        }
        else if(section == "players"){
            let x=2;
            let y=11;

            // Border around the players options. 
            Border.createBorder({
                x:x+0, y:y+0, w: 12, h: 6, 
                layerObjKey: `brdr_playersB`, layerKey: "L2", xyByGrid: true, tilesetKey: "bg_tiles1",
                settings: { bgColorRgba: [0,0,0,255] }
            });

            // "PLAYERS" text.
            _GFX.layerObjs.createOne(PrintText, { text: "PLAYERS" , x:x+1, y: y-1, layerObjKey: `players_title`, layerKey: "L4", xyByGrid: true });
            
            // Border around the "PLAYERS" text.
            Border.createBorder({
                x:x+0, y:y-2, w: 9, h: 3, 
                layerObjKey: `brdr_playersA`, layerKey: "L2", xyByGrid: true, tilesetKey: "bg_tiles1",
                settings: { bgColorRgba: [0,0,0,255] }
            });

            // Text for the player options. 
            let text = "";
            _GFX.layerObjs.createOne(PrintText, { text: "P1", x:x+2, y: y+1, layerObjKey: `P1_text`, layerKey: "L4", xyByGrid: true });
            if     (this.gameSettings["P1"] == "HUMAN"){ text = "HUMAN"; }
            else if(this.gameSettings["P1"] == "CPU")  { text = "  CPU"; }
            else if(this.gameSettings["P1"] == "NONE") { text = " NONE"; }
            _GFX.layerObjs.createOne(PrintText, { text: text, x:x+2+3, y: y+1, layerObjKey: `P1_text2`, layerKey: "L4", xyByGrid: true });
            
            _GFX.layerObjs.createOne(PrintText, { text: "P2", x:x+2, y: y+2, layerObjKey: `P2_text`, layerKey: "L4", xyByGrid: true });
            if     (this.gameSettings["P2"] == "HUMAN"){ text = "HUMAN"; }
            else if(this.gameSettings["P2"] == "CPU")  { text = "  CPU"; }
            else if(this.gameSettings["P2"] == "NONE") { text = " NONE"; }
            _GFX.layerObjs.createOne(PrintText, { text: text, x:x+2+3, y: y+2, layerObjKey: `P2_text2`, layerKey: "L4", xyByGrid: true });

            _GFX.layerObjs.createOne(PrintText, { text: "P3",  x:x+2, y: y+3, layerObjKey: `P3_text`, layerKey: "L4", xyByGrid: true });
            if     (this.gameSettings["P3"] == "HUMAN"){ text = "HUMAN"; }
            else if(this.gameSettings["P3"] == "CPU")  { text = "  CPU"; }
            else if(this.gameSettings["P3"] == "NONE") { text = " NONE"; }
            _GFX.layerObjs.createOne(PrintText, { text: text, x:x+2+3, y: y+3, layerObjKey: `P3_text2`, layerKey: "L4", xyByGrid: true });
            
            _GFX.layerObjs.createOne(PrintText, { text: "P4", x:x+2, y: y+4, layerObjKey: `P4_text`, layerKey: "L4", xyByGrid: true });
            if     (this.gameSettings["P4"] == "HUMAN"){ text = "HUMAN"; }
            else if(this.gameSettings["P4"] == "CPU")  { text = "  CPU"; }
            else if(this.gameSettings["P4"] == "NONE") { text = " NONE"; }
            _GFX.layerObjs.createOne(PrintText, { text: text, x:x+2+3, y: y+4, layerObjKey: `P4_text4`, layerKey: "L4", xyByGrid: true });
        }
        else if(section == "winStyle"){
            let x=15;
            let y=11;

            // Border around the win style options. 
            Border.createBorder({
                x:x+0, y:y+0, w: 11, h: 6, 
                layerObjKey: `brdr_winStyle_B`, layerKey: "L2", xyByGrid: true, tilesetKey: "bg_tiles1",
                settings: { bgColorRgba: [0,0,0,255] }
            });
            
            // "WIN STYLE" text.
            _GFX.layerObjs.createOne(PrintText, { text: "WIN STYLE" , x:x+1, y: y-1, layerObjKey: `winStyle_title`, layerKey: "L4", xyByGrid: true });
            
                // Border around the "WIN STYLE" text.
                Border.createBorder({
                x:x+0, y:y-2, w: 11, h: 3, 
                layerObjKey: `brdr_winStyle_A`, layerKey: "L2", xyByGrid: true, tilesetKey: "bg_tiles1",
                settings: { bgColorRgba: [0,0,0,255] }
            });

            // Text for the player options. 
            _GFX.layerObjs.createOne(PrintText, { text: "1ST TO:", x:x+2, y: y+1, layerObjKey: `winStyle_text1`, layerKey: "L4", xyByGrid: true });
            _GFX.layerObjs.createOne(PrintText, { text: "500 PTS", x:x+2, y: y+3, layerObjKey: `winStyle_text2`, layerKey: "L4", xyByGrid: true });
            _GFX.layerObjs.createOne(PrintText, { text: "0 CARDS", x:x+2, y: y+4, layerObjKey: `winStyle_text3`, layerKey: "L4", xyByGrid: true });
        }
        else if(section == "noPlayableCard"){
            let x=2;
            let y=20;

            // Border around the noPlayableCard options. 
            Border.createBorder({
                x:x+0, y:y+0, w: 23, h: 4, 
                layerObjKey: `brdr_npc_B`, layerKey: "L2", xyByGrid: true, tilesetKey: "bg_tiles1",
                settings: { bgColorRgba: [0,0,0,255] }
            });
            
            // "IF NO PLAYABLE CARD" text.
            _GFX.layerObjs.createOne(PrintText, { text: "IF NO PLAYABLE CARD" , x:x+1, y: y-1, layerObjKey: `npc_title`, layerKey: "L4", xyByGrid: true });
            
            // Border around the "IF NO PLAYABLE CARD" text.
            Border.createBorder({
                x:x+0, y:y-2, w: 21, h: 3, 
                layerObjKey: `brdr_npc_A`, layerKey: "L2", xyByGrid: true, tilesetKey: "bg_tiles1",
                settings: { bgColorRgba: [0,0,0,255] }
            });

            // // Text for the player options. 
            _GFX.layerObjs.createOne(PrintText, { text: "DRAW ONLY ONE CARD",  x:x+2, y: y+1, layerObjKey: `npc_text1`, layerKey: "L4", xyByGrid: true });
            _GFX.layerObjs.createOne(PrintText, { text: "DRAW UNTIL PLAYABLE", x:x+2, y: y+2, layerObjKey: `npc_text2`, layerKey: "L4", xyByGrid: true });
            
            // Bottom text
            _GFX.layerObjs.createOne(PrintText, { text: "A:ACCEPT    DPAD:CHANGE", x:x+0, y: y+5, layerObjKey: `npc_text3`, layerKey: "L4", xyByGrid: true });
            _GFX.layerObjs.createOne(PrintText, { text: "B:BACK"                 , x:x+0, y: y+6, layerObjKey: `npc_text4`, layerKey: "L4", xyByGrid: true });
        }
    },
    changeSection: function(section){
        this.currentSection = section;

        // Set all cursors false and their color to black.
        for(let key in this.cursorPositions){
            this.cursorPositions[key].active = false;
            _GFX.layerObjs.getOne( this.cursorPositions[key].cursorKey ).settings = { rotation: 90, colorData: [ [ Cursor1.colors.inner, Cursor1.colors.black ] ] };
        }

        // Set the active cursor to true and the color to white.
        this.cursorPositions[section].active = true;
        _GFX.layerObjs.getOne( this.cursorPositions[section].cursorKey ).settings = { rotation: 90, colorData: [ [ Cursor1.colors.inner, Cursor1.colors.white ] ] };
    },
    adjustCursor: function(section, dir){
        let cursorPosObj = this.cursorPositions[section];
        let cursorItem;
        let cursorKey = cursorPosObj.cursorKey;

        // UP
        if(dir == "UP"){
            if(cursorPosObj.currentIndex > 0){ cursorPosObj.currentIndex -= 1; }
            else                             { cursorPosObj.currentIndex = cursorPosObj.items.length-1; }
            cursorItem = cursorPosObj.items[cursorPosObj.currentIndex];
            _GFX.layerObjs.getOne(cursorKey).y = cursorItem.y;
        }
        // DOWN
        else if(dir == "DOWN"){
            if(cursorPosObj.currentIndex +1 < cursorPosObj.items.length){ cursorPosObj.currentIndex += 1; }
            else                                                        { cursorPosObj.currentIndex = 0; }
            cursorItem = cursorPosObj.items[cursorPosObj.currentIndex];
            _GFX.layerObjs.getOne(cursorKey).y = cursorItem.y;
        }
    },
    adjustPlayerValue: function(){
        let section = "players";

        // Always increment by one. Rollover on out-of-bounds.
        let cursorPosObj = this.cursorPositions[section];
        let playerKey = `P${cursorPosObj.currentIndex+1}`;
        let playerValue = this.gameSettings[playerKey];
        let typeIndex = this.gameSettings.PLAYERTYPES.indexOf(playerValue);
        
        if(typeIndex + 1 > this.gameSettings.PLAYERTYPES.length-1){ typeIndex = 0; }
        else{ typeIndex += 1; }

        this.gameSettings[playerKey] = this.gameSettings.PLAYERTYPES[typeIndex];
        this.genSection("players");
    },
    adjustWinStyleValue: function(){
        let section = "winStyle";

        let cursorPosObj = this.cursorPositions[section];
        let currentIndex = cursorPosObj.currentIndex;

        if     (currentIndex == 0){ this.gameSettings["WIN"] = "at500pts"; }
        else if(currentIndex == 1){ this.gameSettings["WIN"] = "atZeroCards"; }
    },
    adjustDrawValue: function(){
        let section = "noPlayableCard";

        let cursorPosObj = this.cursorPositions[section];
        let currentIndex = cursorPosObj.currentIndex;

        if     (currentIndex == 0){ this.gameSettings["DRAW"] = "one"; }
        else if(currentIndex == 1){ this.gameSettings["DRAW"] = "until"; }
    },
    currentSection: "players",
    // currentSection: "winStyle",
    // currentSection: "noPlayableCard",

    // Cursor positions.
    cursorPositions:{
        "players"       :{
            currentIndex: 0,
            active: false,
            cursorKey: "playersCursor",
            items: [
                { x:3, y:12, action: function(){} },
                { x:3, y:13, action: function(){} },
                { x:3, y:14, action: function(){} },
                { x:3, y:15, action: function(){} },
            ],
        },
        "winStyle"      :{
            currentIndex: 0,
            active: false,
            cursorKey: "winStyleCursor",
            items: [
                { x:16, y:14, action: function(){} },
                { x:16, y:15, action: function(){} },
            ],
        },
        "noPlayableCard":{
            currentIndex: 0,
            active: false,
            cursorKey: "npcCursor",
            items: [
                { x:3, y:21, action: function(){} },
                { x:3, y:22, action: function(){} },
            ],
        },
    },

    // Run once upon changing to this game state.
    init: function(){
        // Clear the screen and the graphics caches.
        _GFX.funcs.clearAllLayers(true);
        _GFX.layerObjs.removeAll(_APP.game.gs1_prev);
        _GFX.layerObjs.removeAll(_APP.game.gs1);

        // Set the L1 background color.
        // _GFX.funcs.updateL1BgColorRgba([0,128,64,255]);
        _GFX.funcs.updateL1BgColorRgba([32,32,48,255]);

        // _GFX.layerObjs.createOne(Cursor1, { x:0, y:0, layerObjKey: `debugCursor`   , layerKey: "L3", xyByGrid: true, settings:{rotation: 90} } );

        let cursorIndex;

        if(this.gameSettings["WIN"] == "at500pts")   { this.cursorPositions["winStyle"].currentIndex = 0; }
        if(this.gameSettings["WIN"] == "atZeroCards"){ this.cursorPositions["winStyle"].currentIndex = 1; }

        if(this.gameSettings["DRAW"] == "one")  { this.cursorPositions["noPlayableCard"].currentIndex = 0; }
        if(this.gameSettings["DRAW"] == "until"){ this.cursorPositions["noPlayableCard"].currentIndex = 1; }

        cursorPosObj = this.cursorPositions["players"];
        cursorIndex = cursorPosObj.currentIndex;
        cursorPos = cursorPosObj.items[cursorIndex];
        _GFX.layerObjs.createOne(Cursor1, { x:cursorPos.x, y:cursorPos.y, layerObjKey: `playersCursor` , layerKey: "L3", xyByGrid: true, settings:{rotation: 90} } );
        
        cursorPosObj = this.cursorPositions["winStyle"];
        cursorIndex = cursorPosObj.currentIndex;
        cursorPos = cursorPosObj.items[cursorIndex];
        _GFX.layerObjs.createOne(Cursor1, { x:cursorPos.x, y:cursorPos.y, layerObjKey: `winStyleCursor`, layerKey: "L3", xyByGrid: true, settings:{rotation: 90} } );
        
        cursorPosObj = this.cursorPositions["noPlayableCard"];
        cursorIndex = cursorPosObj.currentIndex;
        cursorPos = cursorPosObj.items[cursorIndex];
        _GFX.layerObjs.createOne(Cursor1, { x:cursorPos.x, y:cursorPos.y, layerObjKey: `npcCursor`     , layerKey: "L3", xyByGrid: true, settings:{rotation: 90} } );

        this.genSection("start");
        this.genSection("players");
        this.genSection("winStyle");
        this.genSection("noPlayableCard");

        // Run the debug init.
        if(_APP.debugActive && _DEBUG2){ _DEBUG2.debugGamestate.uninit(_APP.game.gs1, _APP.game.gs2_new); }

        this.changeSection("players");

        // Set the inited flag.
        this.inited = true;
    },
    // Main function of this game state. Calls other functions/handles logic, etc.
    main: function(){
        // Run init and return if this gamestate is not yet inited.
        if(!this.inited){ this.init(); return; }

        // Uno letters animation.
        _GFX.layerObjs.getOne("letter_uno2_u").nextFrame();
        _GFX.layerObjs.getOne("letter_uno2_n").nextFrame();
        _GFX.layerObjs.getOne("letter_uno2_o").nextFrame();
        
        // Gamepad input.
        let state = _INPUT.util.stateByteToObj2("p1"); 
        
        // DEBUG CURSOR.
        // _GFX.layerObjs.getOne("debugCursor").nextFrame();
        // if(state.held.BTN_SR && state.press.BTN_UP)   { _GFX.layerObjs.getOne("debugCursor").y--; }
        // if(state.held.BTN_SR && state.press.BTN_DOWN) { _GFX.layerObjs.getOne("debugCursor").y++; }
        // if(state.held.BTN_SR && state.press.BTN_LEFT) { _GFX.layerObjs.getOne("debugCursor").x--; }
        // if(state.held.BTN_SR && state.press.BTN_RIGHT){ _GFX.layerObjs.getOne("debugCursor").x++; }

        if     (this.currentSection == "players"){
            _GFX.layerObjs.getOne("playersCursor").nextFrame();

            // Cursor control.
            if(state.press.BTN_UP)   { 
                this.adjustCursor(this.currentSection, "UP", 1);
            }
            if(state.press.BTN_DOWN) { 
                this.adjustCursor(this.currentSection, "DOWN", 1);
            }
            // Change this setting. 
            if(state.press.BTN_LEFT || state.press.BTN_RIGHT) { 
                this.adjustPlayerValue();
            }
            if(state.press.BTN_B) { 
                _APP.game.changeGs1("gs_TITLE");
                _APP.game.changeGs2("init");
                return;
            }
            if(state.press.BTN_A) { 
                this.changeSection("winStyle");
            }
        }
        else if(this.currentSection == "winStyle"){
            _GFX.layerObjs.getOne("winStyleCursor").nextFrame();

            // Cursor control.
            if(state.press.BTN_UP)   { 
                this.adjustCursor(this.currentSection, "UP", 1);
            }
            if(state.press.BTN_DOWN) { 
                this.adjustCursor(this.currentSection, "DOWN", 1);
            }
            if(state.press.BTN_B) { 
                this.changeSection("players");
            }
            if(state.press.BTN_A) { 
                this.adjustWinStyleValue();
                this.changeSection("noPlayableCard");
                
            }
        }
        else if(this.currentSection == "noPlayableCard"){
            _GFX.layerObjs.getOne("npcCursor").nextFrame();

            // Cursor control.
            if(state.press.BTN_UP)   { 
                this.adjustCursor(this.currentSection, "UP", 1);
            }
            if(state.press.BTN_DOWN) { 
                this.adjustCursor(this.currentSection, "DOWN", 1);
            }
            if(state.press.BTN_B) { 
                this.changeSection("winStyle");
            }
            if(state.press.BTN_A) { 
                this.adjustDrawValue();
                
                // Save the game settings to the gs_PLAYING gamestate.
                let gameSettings = _APP.game.gamestates["gs_PLAYING"].gameSettings;
                gameSettings["P1"]   = this.gameSettings["P1"];
                gameSettings["P2"]   = this.gameSettings["P2"];
                gameSettings["P3"]   = this.gameSettings["P3"];
                gameSettings["P4"]   = this.gameSettings["P4"];
                gameSettings["WIN"]  = this.gameSettings["WIN"];
                gameSettings["DRAW"] = this.gameSettings["DRAW"];
                gameSettings["P1_SCORE"] = 0;
                gameSettings["P2_SCORE"] = 0;
                gameSettings["P3_SCORE"] = 0;
                gameSettings["P4_SCORE"] = 0;

                _APP.game.changeGs1("gs_PLAYING");
                _APP.game.changeGs2("init");
                return;
            }
        }

        if(_APP.debugActive && _DEBUG){ this.debug(); }
    },

    // Should be called by the game loop.
    // Calls debug functions specific to this gamestate.
    debug: function(){
        // console.log("DEBUG");
        if(_APP.debugActive && _DEBUG2){ _DEBUG2.debugGamestate.run(_APP.game.gs1, _APP.game.gs2)}
    },
};