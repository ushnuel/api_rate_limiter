const redis = require("redis");

const redisClient = () => {
  return new Promise((resolve, reject) => {
    const client = redis.createClient({
      host: "my-redis-container",
      port: 6379,
    });

    client.on("error", (err) => {
      console.error(`Redis error: ${err}`);
      reject(err);
    });

    client.on("ready", () => {
      console.log("Connected to Redis");
      resolve(client);
    });

    client.connect();
  });
};

module.exports = redisClient;
