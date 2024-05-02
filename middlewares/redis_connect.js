const { createClient } = require('redis');

let redisClient;
(async () => {
  redisClient = createClient({
    url: process.env.REDIS_URL
  });

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();

module.exports = redisClient;
