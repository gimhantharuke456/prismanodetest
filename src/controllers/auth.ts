import { NextFunction, Request, Response } from "express";
import { compareSync, hashSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestException } from "../exceptions/bad-requests";
import { ErrorCodes } from "../exceptions/root";
import { prismaClient } from "..";
import { UnProcessableEntity } from "../exceptions/validation";
import { SignupSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/not-found";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prismaClient.user.findFirst({ where: { email: email } });
  if (!user) {
    throw new NotFoundException(
      "User not found",
      ErrorCodes.USER_NOT_FOUND,
      null
    );
  }
  if (!compareSync(password, user.password)) {
    throw new BadRequestException(
      "Password incorrect",
      ErrorCodes.INCORRECT_PASSWORD,
      null
    );
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET ?? "fallback_secret");
  res.json({ user, token });
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  SignupSchema.parse(req.body);
  const { email, password, name } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email: email } });
  if (user) {
    new BadRequestException(
      "User already exists",
      ErrorCodes.USER_ALREADY_EXISTS,
      null
    );
  }

  user = await prismaClient.user.create({
    data: {
      email: email,
      password: hashSync(password, 10),
      name: name,
    },
  });
  res.json(user);
};
