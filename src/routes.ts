import { Application } from "express";
import { handleServerCreate } from "./controllers/server-controller";
import { handleDemoSessionGet, handleSessionCreate, handleSessionGet, handleSessionUpdate } from "./controllers/session-controller";

export function setupRoutes(express: Application) {

    express.post("/api/servers", handleServerCreate);

    express.post("/api/sessions", handleSessionCreate);
    express.get("/api/sessions/demo", handleDemoSessionGet);
    express.get("/api/sessions/:sessionId", handleSessionGet);
    express.put("/api/sessions/:sessionId", handleSessionUpdate);

}