const rateLimiter = require("./rateLimiter");
const checkSystemLimit = require("../lib/checkSystemLimit");
const checkMonthlyLimit = require("../lib/checkMonthlyLimit");
const checkRequestWindowLimit = require("../lib/checkRequestWindowLimit");

jest.mock("../lib/checkSystemLimit");
jest.mock("../lib/checkMonthlyLimit");
jest.mock("../lib/checkRequestWindowLimit");

const mockRequest = (ip) => ({ ip });

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();
const ipAddress = "127.0.0.1";

describe("rateLimiter", () => {
  test("should call next if the request is within the request window limit", async () => {
    const req = mockRequest(ipAddress);
    const res = mockResponse();
    checkRequestWindowLimit.mockResolvedValue(true);

    await rateLimiter(req, res, mockNext);

    expect(checkRequestWindowLimit).toHaveBeenCalledWith(ipAddress);
    expect(mockNext).toHaveBeenCalled();
  });

  test("should send 429 status and message if the request exceeds the request window limit", async () => {
    const req = mockRequest(ipAddress);
    const res = mockResponse();
    checkRequestWindowLimit.mockResolvedValue(false);

    await rateLimiter(req, res, mockNext);

    expect(checkRequestWindowLimit).toHaveBeenCalledWith(ipAddress);
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.send).toHaveBeenCalledWith(
      "Too Many Requests - Max request per window"
    );
  });

  test("should send 429 status and message if the request exceeds the monthly limit", async () => {
    const req = mockRequest(ipAddress);
    const res = mockResponse();
    checkRequestWindowLimit.mockResolvedValue(true);
    checkMonthlyLimit.mockReturnValue(true);

    await rateLimiter(req, res, mockNext);

    expect(checkMonthlyLimit).toHaveBeenCalledWith(ipAddress);
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.send).toHaveBeenCalledWith(
      "Too Many Requests - Monthly limit exceeded"
    );
  });

  test("should send 429 status and message if the request exceeds the system limit", async () => {
    const req = mockRequest(ipAddress);
    const res = mockResponse();
    checkRequestWindowLimit.mockResolvedValue(true);
    checkMonthlyLimit.mockReturnValue(false);
    checkSystemLimit.mockResolvedValue(true);

    await rateLimiter(req, res, mockNext);

    expect(checkSystemLimit).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.send).toHaveBeenCalledWith(
      "Too Many Requests - System limit exceeded"
    );
  });
});
