import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";

export const prismaMock = mockDeep<PrismaClient>();

jest.mock("../../src", () => ({
  prismaClient: prismaMock,
}));

beforeEach(() => {
  mockReset(prismaMock);
});
