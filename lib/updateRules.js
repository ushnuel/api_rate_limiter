const { rulesDB } = require("../rulesDB");
const { apiLimitRule } = require("../config");
const redisClient = require("../config/redisClient");

const updateRules = async () => {
  try {
    const client = await redisClient();

    const rulesCache = await client.get(apiLimitRule);

    if (!rulesCache) {
      await client.set(apiLimitRule, JSON.stringify(rulesDB));
      return;
    }

    const stringifiedDBRules = JSON.stringify(rulesDB);
    if (stringifiedDBRules === rulesCache) {
      console.log("Rules did not change.");
      return;
    }

    console.log("Updated rate limiter rules from Redis.");
    await client.set(apiLimitRule, JSON.stringify(rulesDB));
  } catch (error) {
    console.error(`Error updating rate limiter rules from Redis: ${error}`);
  }
};

module.exports = updateRules;
