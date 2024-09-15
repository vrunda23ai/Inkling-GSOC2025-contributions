const mongoose = require('mongoose');

mongoose.connection.on('error', err => {
    console.error(err);
});

async function connectToMongo(){
    await mongoose.connect(process.env.MONGO_URL,{})
    .catch(err => console.log("\x1b[31m%s\x1b[0m",err))
    .then(()=>console.log("\x1b[32m%s\x1b[0m","[server]: Connected to MongoDB"));
}

async function disconnectToMongo(){
    await mongoose.disconnect()
    .catch(err => console.log(err))
}

module.exports = {connectToMongo , disconnectToMongo}