const checkSystemLimit = require("./checkSystemLimit");
const redisClient = require("../config/redisClient");
const { apiLimitRule, systemCounter } = require("../config");

jest.mock("../config/redisClient");

const mockClient = () => {
  const client = {};
  client.get = jest.fn().mockResolvedValue(null);
  client.set = jest.fn().mockResolvedValue("OK");
  client.incr = jest.fn().mockResolvedValue(1);
  return client;
};

describe("checkSystemLimit", () => {
  test("should return false if the request is within the system limit", async () => {
    const client = mockClient();
    redisClient.mockResolvedValue(client);

    const result = await checkSystemLimit();

    expect(redisClient).toHaveBeenCalled();
    expect(client.get).toHaveBeenCalledWith(systemCounter);
    expect(client.set).toHaveBeenCalledWith(systemCounter, 0);
    expect(result).toBe(false);
  });

  test("should return true if the request exceeds the system limit", async () => {
    const client = mockClient();
    redisClient.mockResolvedValue(client);
    client.get.mockImplementation((key) => {
      if (key === apiLimitRule) {
        return JSON.stringify({ systemLimit: 10 });
      } else {
        return 11;
      }
    });

    const result = await checkSystemLimit();

    expect(redisClient).toHaveBeenCalled();
    expect(client.get).toHaveBeenCalledWith(systemCounter);
    expect(client.incr).toHaveBeenCalledWith(systemCounter);
    expect(result).toBe(true);
  });
});
