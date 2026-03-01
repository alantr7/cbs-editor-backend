import { create_session, get_session, update_session, update_session_file } from "../database";
import { Controller } from "../types/controller"
import { JwtEditorSessionClaims, JwtServerClaims } from "../types/jwt-claims-types";
import { DatabaseSession, DatabaseSessionFile } from "../utils/dbmodels";
import { verifyToken } from "../utils/jwt";
import { Version } from "../utils/versions";
import { v7 as uuid } from "uuid";

export const handleSessionCreate: Controller = async (req, res) => {
    const authorization = req.headers["authorization"];
    if (authorization === undefined || !authorization?.startsWith("Bearer ")) {
        res.status(401).end();
        return;
    }

    const token = authorization.substring("Bearer ".length);
    const claims = verifyToken<JwtServerClaims>(token);

    if (claims === null) {
        res.status(401).end();
        return;
    }

    const { id, version: rawVersion } = claims;
    const version = Version.from(rawVersion);

    const sessionFiles: DatabaseSessionFile[] = [];
    if (version.isOlderThan(Version.V_0_5_1_MULTIPLE_FILES_EDITING)) {
        const content = req.body.file;
        if (typeof content !== 'string') {
            res.status(400).end();
            return;
        }

        sessionFiles.push({
            id: uuid(),
            name: "program.cbf",
            content,
            // @ts-ignore
            last_change_id: "",
            last_change_timestamp: 0
        });
    } else {
        const files = req.body.files as DatabaseSessionFile[];
        if (!Array.isArray(files)) {
            res.status(400).end();
            return;
        }

        for (const file of files) {
            sessionFiles.push({
                id: uuid(),
                name: file.name,
                content: file.content,
                last_modified: 0
            });
        }
    }

    res.json({
        ...(await create_session(id as string, rawVersion, sessionFiles))
    })
};

export const handleSessionGet: Controller = async (req, res) => {
    const id = req.query.sessionId as string;
    const cookieToken = req.cookies["access_token"];

    // Check if access token is present in cookies
    if (typeof cookieToken !== 'string') {
        res.status(401).end();
        return;
    }

    // Check if the access token is valid
    const claims = verifyToken<JwtEditorSessionClaims>(cookieToken);
    if (claims == null) {
        res.status(401).end();
        return;
    }

    // Check if the claims are valid
    const time = Date.now();
    if (time >= claims.expires_at || claims.id !== id) {
        res.status(403).end();
        return;
    }

    const session = (await get_session(id)) as DatabaseSession | null | undefined;
    if (session === undefined || session === null) {
        res.status(404).end();
        return;
    }

    // Check if the tokens match
    if (session.access_token !== cookieToken) {
        res.status(403).end();
        return;
    }
    
    const plugin_version = Version.from(session.plugin_version);

    // Check if there are changes if "last_change_id" is present
    if (req.query.last_modified && session.last_modified === parseInt(req.query.last_modified as string)) {
        res.status(304).end();
        return;
    }

    const result: any = {};
    if (plugin_version.isOlderThan(Version.V_0_5_1_MULTIPLE_FILES_EDITING)) {
        result["content"] = session.files[0].content;
        result["last_change_id"] = session.files[0].last_modified.toString();
        result["last_change_timestamp"] = session.files[0].last_modified;
    } else {
        result.files = session.files;
        result.last_modified = session.last_modified;
    }
    res.json(result);

};

export const handleSessionUpdate: Controller = async (req, res) => {
    const id = req.query.sessionId as string;
    const cookieToken = req.cookies["access_token"];

    // Check if access token is present in cookies
    if (typeof cookieToken !== 'string') {
        res.status(401).end();
        return;
    }

    // Check if the access token is valid
    const claims = verifyToken<JwtEditorSessionClaims>(cookieToken);
    if (claims == null) {
        res.status(401).end();
        return;
    }

    // Check if the claims are valid
    const time = Date.now();
    if (time >= claims.expires_at || claims.id !== id) {
        res.status(403).end();
        return;
    }

    const session = (await get_session(id)) as DatabaseSession | null | undefined;
    if (session === undefined || session === null) {
        res.status(404).end();
        return;
    }

    // Check if the tokens match
    if (session.access_token !== cookieToken) {
        res.status(403).end();
        return;
    }
    
    const plugin_version = Version.from(session.plugin_version);

    const { files } = req.body;
    if (!Array.isArray(files)) {
        res.status(400).end();
        return;
    }

    const lastModified = Date.now();
    session.last_modified = lastModified;

    // Check if files are valid
    for (const file of files) {
        if (typeof file.content !== 'string' || file.content.length > 2048) {
            res.status(400).end();
            return;
        }

        const sessionFile = session.files.find(f => f.id === file.id);
        if (sessionFile === undefined) {
            res.status(400).end();
            return;
        }

        sessionFile.content = file.content;
        sessionFile.last_modified = lastModified;
        await update_session_file(sessionFile);
    }

    await update_session(session);
    res.status(200).end();
};