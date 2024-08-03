import { Router } from "express";
import { login, signup } from "../controllers/auth";
import { prismaClient } from "..";

const authRoutes: Router = Router();

authRoutes.post("/login", (req, res) => login(req, res, prismaClient));
authRoutes.post("/signup", (req, res) => signup(req, res, prismaClient));

export default authRoutes;
