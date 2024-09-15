const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    socketId: {
        type: String,
        required: true,
    },
    username: { 
        type: String, 
        required: true,
    },
    profilePic: { 
        type: String,
        default: ""
    },
    score: {
        type: Number,
        default: 0
    }
});


const gameSchema = new mongoose.Schema({
    creator: { 
        type: String, 
        required: true,
    },
    secretcode: {
        type: String, 
        required: true,
    },
    currentword: {
        type: String,
        default: ""
    },
    players: { 
        type: [playerSchema], 
        required: true,
        default: []
    }
});

module.exports = mongoose.model('Game', gameSchema) ;
// so here instead of Game name as collection games
// will be added to mongodb