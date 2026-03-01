import * as express from "express";
import { setupRoutes } from "./routes";

const app = express.default();

setupRoutes(app);

app.listen(9050);