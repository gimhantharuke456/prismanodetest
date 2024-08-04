import express, { Express, Request, Response, urlencoded } from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";
import swaggerUi from "swagger-ui-express";
import { specs } from "./swagger";
import { errorMiddleware } from "./middlwares/errors";

const app = express();

//middlwares
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.disable("x-powered-by");

//routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api", rootRouter);

export const prismaClient = new PrismaClient({
  log: ["query"],
});
//error middleware
app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
