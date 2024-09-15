const { v4: uuidv4 } = require('uuid');
let generaterandomwords;
(async () => {
    const { generate } = await import('random-words');
    generaterandomwords = generate;
})();

const games = require('../models/game.model.js');
const users = require('../models/user.model.js');
const { getData, storeData } = require('../config/redis.js');

async function createRoom(socketId, username, profilePic) {
    try {
        if (!username || !profilePic || !socketId) {
            return { error: 'Insufficient data' };
        }
        const user = await users.findOne({ username: username })
        if (!user) {
            return { error: "No such user exist" };
        }

        const newGame = new games({
            creator: username,
            secretcode: uuidv4(),
            players: [{ socketId, username, profilePic }]
        })

        if (newGame) {
            await newGame.save();
            return {
                creator: newGame.creator,
                secretcode: newGame.secretcode,
                players: newGame.players,
            };
        }
        else {
            return { error: "Invalid user data" };
        }
    } catch (err) {
        console.log("Error in create game service", err.message);
        return { error: "Internal Server error" };
    }
}

async function joinRoom(socketId, username, profilePic, roomId) {
    try {
        if (!username || !profilePic || !roomId || !socketId) {
            return { error: 'Insufficient data' };
        }
        const user = await users.findOne({ username: username })
        if (!user) {
            return { error: "No such user exist" };
        }
        const game = await games.findOne({ secretcode: roomId })
        if (!game) {
            return { error: "No such game exist" };
        }
        const isGame = await games.findOneAndUpdate(
            { secretcode: roomId, 'players.username': { $ne: username } },
            { $push: { players: { username, profilePic, socketId } } },
            { upsert: false, new: true, }
        );

        if (isGame) {
            return {
                creator: isGame.creator,
                secretcode: isGame.secretcode,
                players: isGame.players,
            };
        }
        else {
            return { error: "Player already in game" };
        }
    } catch (err) {
        console.log("Error in join game service", err.message);
        return { error: "Internal Server error" };
    }
}

async function leaveRoom(socketId, roomId) {
    try {
        if (!socketId || !roomId) {
            return { error: 'Insufficient data' };
        }
        const game = await games.findOne({ secretcode: roomId })
        if (!game) {
            return { error: "No such game exist" };
        }
        const isGame = await games.findOneAndUpdate(
            { secretcode: roomId },
            { $pull: { players: { socketId: socketId } } },
            { upsert: false, new: true, }
        );

        if (isGame.players.length == 0) {
            await games.deleteOne(
                { secretcode: roomId }
            );
            return({})
        }

        if (isGame) {
            return {
                creator: isGame.creator,
                secretcode: isGame.secretcode,
                players: isGame.players,
            };
        }
        
        else {
            return { error: "Can't leave game" };
        }
    } catch (err) {
        console.log("Error in leave game service", err.message);
        return { error: "Internal Server error" };
    }
}

async function generateWord(secretcode) {
    try {
        if (!secretcode) {
            return { error: 'Insufficient data' };
        }
        const gameExists = await games.findOne({ secretcode: secretcode });
        if (!gameExists) {
            return { error: "No such game exist" };
        }

        const drawer = gameExists.players[(Math.floor(Math.random() * gameExists.players.length))];
        return { to: drawer.socketId, words: generaterandomwords(5) };

    } catch (err) {
        console.log("Error in generateWord service", err.message);
        return { error: "Internal Server error" };
    }
}

async function setCurrentWord(word, secretcode) {
    try {
        if (!word || !secretcode) {
            return { error: 'Insufficient data' };
        }
        const gameExists = await games.findOneAndUpdate(
            { secretcode: secretcode },
            { currentword: word },
            { upsert: false, new: true, }
        );
        if (!gameExists) {
            return { error: "No such game exist" };
        }
        const res = await storeData(secretcode, word);
        if (res != 'OK') {
            return { error: "Can't cache word" };
        }
        return ({});

    } catch (err) {
        console.log("Error in setCurrentWord service", err.message);
        return { error: "Internal Server error" };
    }
}

async function checkGuess(word, secretcode, username) {
    try {
        if (!word || !secretcode || !username) {
            return { error: 'Insufficient data' };
        }

        let gameDetails = null;
        const res = await getData(secretcode);
        if (res == null) {
            const gameExists = await games.findOne({ secretcode: secretcode });
            if (!gameExists) {
                return { error: "No such game exist" };
            }
            await storeData(secretcode, word);
            if(gameExists.currentword == word){
                gameDetails = await games.findOneAndUpdate(
                    { secretcode: secretcode, "players.username": username  },
                    { $inc: { "players.$.score": 10} },
                    { upsert: false, new: true, }
                );
            }
            return { ok: gameExists.currentword == word, gameDetails: gameDetails };
        }
        if(res==word){
            gameDetails = await games.findOneAndUpdate(
                { secretcode: secretcode, "players.username": username  },
                { $inc: { "players.$.score": 10} },
                { upsert: false, new: true, }
            );
        }
        return ({ ok: res==word, gameDetails:gameDetails }); 

    } catch (err) {
        console.log("Error in checkGuess service", err.message);
        return { error: "Internal Server error" };
    }
}


module.exports = {
    createRoom,
    joinRoom,
    leaveRoom,
    generateWord,
    setCurrentWord,
    checkGuess,
}