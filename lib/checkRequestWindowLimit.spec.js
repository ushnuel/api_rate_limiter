const { apiLimitRule } = require("../config");
const redisClient = require("../config/redisClient");
const checkRequestWindowLimit = require("../lib/checkRequestWindowLimit");

jest.mock("../config/redisClient");

const mockClient = () => {
  const client = {};
  client.get = jest
    .fn()
    .mockResolvedValue(JSON.stringify({ requestPerWindow: 10 }));
  return client;
};

const clientId = "127.0.0.1";

describe("checkRequestWindowLimit", () => {
  test("should return true if the request is within the request window limit", async () => {
    const client = mockClient();
    redisClient.mockResolvedValue(client);

    const result = await checkRequestWindowLimit(clientId);

    expect(redisClient).toHaveBeenCalled();
    expect(client.get).toHaveBeenCalledWith(apiLimitRule);
    expect(result).toBe(true);
  });

  test("should return false if the request exceeds the request window limit", async () => {
    const client = mockClient();
    redisClient.mockResolvedValue(client);

    // Make 10 requests within the same window
    for (let i = 0; i < 10; i++) {
      await checkRequestWindowLimit(clientId);
    }
    // Make one more request that should be rejected
    const result = await checkRequestWindowLimit(clientId);

    expect(redisClient).toHaveBeenCalled();
    expect(client.get).toHaveBeenCalledWith(apiLimitRule);
    expect(result).toBe(false);
  });
});
