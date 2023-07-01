const { apiLimitRule } = require("../config");
const redisClient = require("../config/redisClient");

const slidingWindows = new Map();

module.exports = async (clientId) => {
  let requestsInWindow = 0;

  // Retrieve the sliding window for the client, or create a new one if it doesn't exist
  let slidingWindow = slidingWindows.get(clientId);
  if (!slidingWindow) {
    slidingWindow = [];
    slidingWindows.set(clientId, slidingWindow);
  }

  // Calculate the number of requests in the current window
  requestsInWindow = slidingWindow.length;

  const client = await redisClient();
  const setRules = await client.get(apiLimitRule);
  const parsedSetRules = JSON.parse(setRules);

  // If the number of requests is less than the maximum allowed, allow the request
  if (requestsInWindow < parsedSetRules.requestPerWindow) {
    slidingWindow.push(Date.now());
    return true;
  }

  // Otherwise, reject the request
  return false;
};
