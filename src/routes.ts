import { Application } from "express"
import { v7 as uuid } from "uuid";
import { createToken } from "./utils/jwt";
import { JwtServerClaims } from "./types/jwt-claims-types";
import { handleServerCreate } from "./controllers/server-controller";
import { handleSessionCreate, handleSessionGet, handleSessionUpdate } from "./controllers/session-controller";

export function setupRoutes(express: Application) {

    express.post("/api/servers", handleServerCreate);

    express.post("/api/sessions", handleSessionCreate);
    express.get("/api/sessions/:sessionId", handleSessionGet);
    express.put("/api/sessions/:sessionId", handleSessionUpdate);

}