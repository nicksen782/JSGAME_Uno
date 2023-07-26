const fs = require('fs');
// const fs = require('fs').promises;
const path = require('path'); 
const { Midi } = require('@tonejs/midi')

process.chdir(__dirname);
console.log(process.cwd());

(
    async ()=>{
        // const midi = await Midi.fromUrl("../../audio/Movie_Themes_-_1492_Conquest_of_Paradise.mid");
        // const midi = await Midi.fromUrl("/home/nick/Desktop/MECODE/WEB/NODE/JSGAME/public/games/JSGAME_Uno/audio/Movie_Themes_-_1492_Conquest_of_Paradise.mid");

        // const midiData = fs.readFileSync("../../audio/Movie_Themes_-_1492_Conquest_of_Paradise.mid");
        // const midiData = fs.readFileSync("/home/nick/Desktop/MECODE/WEB/NODE/JSGAME/public/games/JSGAME_Uno/audio/Movie_Themes_-_1492_Conquest_of_Paradise.mid");
        const midi = new Midi(midiData);
        const name = midi.name;

        console.log("midi.name:", midi.name);
        // console.log("midiData:", midiData);
        // console.log("midi:", midi);
    }
)();