const redisClient = require("../config/redisClient");
const { apiLimitRule, systemCounter } = require("../config");

module.exports = async () => {
  const client = await redisClient();
  const systemRequestCount = await client.get(systemCounter);

  if (!systemRequestCount) {
    await client.set(systemCounter, 0);
    return false;
  }

  await client.incr(systemCounter);

  const updatedCount = await client.get(systemCounter);
  const setRules = await client.get(apiLimitRule);
  const parsedSetRules = JSON.parse(setRules);

  return updatedCount > parsedSetRules.systemLimit;
};
