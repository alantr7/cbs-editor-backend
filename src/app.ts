import * as express from "express";
import { setupRoutes } from "./routes";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";

configDotenv();

const app = express.default();
app.use(cookieParser());
app.use(express.json());

setupRoutes(app);

app.listen(9050);