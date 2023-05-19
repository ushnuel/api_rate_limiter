const { apiLimitRule } = require("../config");
const redisClient = require("../config/redisClient");
const checkMonthlyLimit = require("../lib/checkMonthlyLimit");

jest.mock("../config/redisClient");

const mockClient = () => {
  const client = {};
  client.get = jest.fn().mockResolvedValue(null);
  client.set = jest.fn().mockResolvedValue("OK");
  client.incr = jest.fn().mockResolvedValue(1);
  return client;
};

const clientId = "127.0.0.1";

describe("checkMonthlyLimit", () => {
  test("should return false if the request is within the monthly limit", async () => {
    const client = mockClient();
    redisClient.mockResolvedValue(client);

    const result = await checkMonthlyLimit(clientId);

    expect(redisClient).toHaveBeenCalled();
    expect(result).toBe(false);
  });

  test("should return true if the request exceeds the monthly limit", async () => {
    const client = mockClient();
    redisClient.mockResolvedValue(client);

    // Mock the client.get method to return different values depending on the key
    client.get.mockImplementation((key) => {
      if (key === apiLimitRule) {
        return JSON.stringify({ monthlyLimit: 10 });
      } else {
        return 11;
      }
    });

    const result = await checkMonthlyLimit(clientId);

    expect(redisClient).toHaveBeenCalled();
    expect(client.get).toHaveBeenCalledWith(apiLimitRule);
    expect(result).toBe(true);
  });
});
