const { rulesDB } = require("../rulesDB");
const { apiLimitRule } = require("../config");
const updateRules = require("../lib/updateRules");
const redisClient = require("../config/redisClient");

jest.mock("../config/redisClient");

const mockClient = () => {
  const client = {};
  client.get = jest.fn().mockResolvedValue(null);
  client.set = jest.fn().mockResolvedValue("OK");
  return client;
};

describe("updateRules", () => {
  test("should update the rules from the database if the cache is empty or different", async () => {
    const client = mockClient();
    redisClient.mockResolvedValue(client);

    await updateRules();

    expect(redisClient).toHaveBeenCalled();
    expect(client.get).toHaveBeenCalledWith(apiLimitRule);
    expect(client.set).toHaveBeenCalledWith(
      apiLimitRule,
      JSON.stringify(rulesDB)
    );
  });

  test("should not update the rules from the database if the cache is the same", async () => {
    const client = mockClient();
    redisClient.mockResolvedValue(client);
    client.get.mockResolvedValue(JSON.stringify(rulesDB));

    await updateRules();

    expect(redisClient).toHaveBeenCalled();
    expect(client.get).toHaveBeenCalledWith(apiLimitRule);
    expect(client.set).not.toHaveBeenCalled();
  });
});
