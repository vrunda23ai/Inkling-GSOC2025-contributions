const { createClient } = require('redis');

let client;

async function connectToRedis() {
    client = createClient({
        password: process.env.REDIS_PASSWORD,
        socket: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT
        }
    });

    client.on('connect', () => console.log("\x1b[32m%s\x1b[0m",'[server]: Connected to Redis') )
    client.on('error', err => console.log("\x1b[31m%s\x1b[0m",'[server]: Redis Client Error', err))
    await client.connect();
}

// if a function return undefined == connectToRedis() not called.
// storeData() returns 'OK' if it was able to set value.
// getData() return null if no key found or return value of key.

async function storeData(key, value) {
    if(!client){
        return
    }
    return await client.setEx(key, 86400, value);
}

async function getData(key) {
    if(!client){
        return
    }
    return await client.get(key);
}

async function disconnectToRedis() {
    if(!client){
        return
    }
    return await client.disconnect();
}

module.exports = {
    connectToRedis,
    disconnectToRedis,
    getData,
    storeData,
}