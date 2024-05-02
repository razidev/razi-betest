const { createClient } = require('redis');

let redisClient;
(async () => {
  redisClient = createClient({
    url: 'redis://default:6OlKFflyPrWhGl0MNMDbowCzfpPRibEn@redis-10120.c252.ap-southeast-1-1.ec2.redns.redis-cloud.com:10120'
  });

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();

module.exports = redisClient;
