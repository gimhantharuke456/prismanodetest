import { NextFunction, Request, Response } from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { prismaMock } from "../../mocks/prisma";
import { login, signup } from "../../../src/controllers/auth";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Auth Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let next: Partial<NextFunction>;
  let responseObject = {};

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
      }),
    };
  });

  describe("login", () => {
    it("should login a user successfully", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password: "hashedPassword",
        name: "Test User",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.body = {
        email: "test@example.com",
        password: "password123",
      };

      prismaMock.user.findFirst.mockResolvedValue(mockUser);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("mockedToken");

      await login(mockRequest as Request, mockResponse as Response);

      expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
      expect(bcrypt.compareSync).toHaveBeenCalledWith(
        "password123",
        "hashedPassword"
      );
      expect(jwt.sign).toHaveBeenCalledWith({ userId: 1 }, expect.any(String));
      expect(mockResponse.json).toHaveBeenCalledWith({
        user: mockUser,
        token: "mockedToken",
      });
    });
  });

  describe("signup", () => {
    it("should create a new user successfully", async () => {
      const mockUser = {
        id: 1,
        email: "new@example.com",
        name: "New User",
        password: "hashedPassword",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.body = {
        email: "new@example.com",
        name: "New User",
        password: "password123",
      };

      prismaMock.user.findFirst.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(mockUser);
      (bcrypt.hashSync as jest.Mock).mockReturnValue("hashedPassword");

      await signup(
        mockRequest as Request,
        mockResponse as Response,
        next as NextFunction
      );

      expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
        where: { email: "new@example.com" },
      });
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          email: "new@example.com",
          name: "New User",
          password: "hashedPassword",
        },
      });
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });
  });
});
