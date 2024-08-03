import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { compareSync, hashSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";

export const login = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  const { email, password } = req.body;
  const user = await prisma.user.findFirst({ where: { email: email } });
  if (!user) {
    throw new Error("User not found");
  }
  if (!compareSync(password, user.password)) {
    throw new Error("Password incorrect");
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET ?? "fallback_secret");
  res.json({ user, token });
};

export const signup = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  const { email, password, name } = req.body;

  let user = await prisma.user.findFirst({ where: { email: email } });
  if (user) {
    return Error("User already exists");
  }
  user = await prisma.user.create({
    data: {
      email: email,
      password: hashSync(password, 10),
      name: name,
    },
  });
  res.json(user);
};
