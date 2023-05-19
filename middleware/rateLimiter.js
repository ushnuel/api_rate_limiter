const checkSystemLimit = require("../lib/checkSystemLimit");
const checkMonthlyLimit = require("../lib/checkMonthlyLimit");
const checkRequestWindowLimit = require("../lib/checkRequestWindowLimit");

// Rate limit the request
async function rateLimiter(req, res, next) {
  const clientId = req.ip;

  const allowRequest = await checkRequestWindowLimit(clientId);

  if (!allowRequest) {
    return res.status(429).send("Too Many Requests - Max request per window");
  }

  // Check if the client has exceeded the per-month limit
  const monthlyLimitExceeded = checkMonthlyLimit(clientId);

  if (monthlyLimitExceeded) {
    return res.status(429).send("Too Many Requests - Monthly limit exceeded");
  }

  const systemLimitExceeded = await checkSystemLimit();

  if (systemLimitExceeded) {
    return res.status(429).send("Too Many Requests - System limit exceeded");
  }

  return next();
}

module.exports = rateLimiter;
