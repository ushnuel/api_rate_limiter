const { apiLimitRule } = require("../config");
const redisClient = require("../config/redisClient");

module.exports = async (clientId) => {
  const client = await redisClient();

  const date = new Date();
  const month = `${date.getFullYear()}-${date.getMonth() + 1}`;
  const clientMonthKey = `client:${clientId}:month:${month}:requests`;

  const clientMonthCount = await client.get(clientMonthKey);

  if (!clientMonthCount) {
    await client.set(clientMonthKey, 0);
    return false;
  }

  await client.incr(clientMonthKey);

  const updatedCount = await client.get(clientMonthKey);
  const setRules = await client.get(apiLimitRule);
  const parsedSetRules = JSON.parse(setRules);

  return updatedCount > parsedSetRules.monthlyLimit;
};
