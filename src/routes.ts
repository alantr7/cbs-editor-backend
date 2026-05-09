import { Application } from "express";
import { handleServerCreate } from "./controllers/server-controller";
import { handleDemoSessionGet, handleDemoSessionStatusGet, handleSessionCreate, handleSessionDelete, handleSessionGet, handleSessionStatusGet, handleSessionUpdate } from "./controllers/session-controller";

export function setupRoutes(express: Application) {

    express.post("/api/servers", handleServerCreate);

    express.post("/api/sessions", handleSessionCreate);
    express.get("/api/sessions/demo", handleDemoSessionGet);
    express.get("/api/sessions/:sessionId", handleSessionGet);
    express.get("/api/sessions/demo/status", handleDemoSessionStatusGet)
    express.get("/api/sessions/:sessionId/status", handleSessionStatusGet);
    express.put("/api/sessions/:sessionId", handleSessionUpdate);
    express.delete("/api/sessions/:sessionId", handleSessionDelete);

}