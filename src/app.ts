import * as express from "express";
import { setupRoutes } from "./routes";
import { configDotenv } from "dotenv";

configDotenv();

const app = express.default();
app.use(express.json());

setupRoutes(app);

app.listen(9050);