const { connectToMongo , disconnectToMongo } = require('./mongo.js');
const { socketConnection } = require('./socket.js');
const { connectToRedis, disconnectToRedis, getData, storeData } = require('./redis.js');

module.exports = {
    connectToMongo,
    disconnectToMongo,
    socketConnection,
    connectToRedis,
    disconnectToRedis,
    getData,
    storeData,
}