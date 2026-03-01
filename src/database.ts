import { v7 as uuid } from 'uuid';
import { createToken } from './utils/jwt';
import { JwtEditorSessionClaims } from './types/jwt-claims-types';
import Database from 'better-sqlite3';
import fs from 'fs';
import { DatabaseSession, DatabaseSessionFile } from './utils/dbmodels';

!fs.existsSync(`./storage`) && fs.mkdirSync(`./storage`);
const dataDirectory = fs.realpathSync('./storage');

const database = Database(dataDirectory + "/sessions.db", {
    fileMustExist: false,
    readonly: false
});
database.pragma("journal_mode = WAL");

// Setup the database
database.exec(`CREATE TABLE IF NOT EXISTS sessions (id PRIMARY KEY, server_id TEXT, plugin_version TEXT, access_token TEXT, created_at BIGINT, expires_at BIGINT, last_modified BIGINT)`);
database.exec(`CREATE TABLE IF NOT EXISTS sessions_contents (id PRIMARY KEY, name VARCHAR(24), session_id TEXT, content TEXT(2048), last_modified BIGINT)`);

export const get_session = async (id: string): Promise<any> => {
    return new Promise((resolve, rej) => {
        const result = database.prepare("SELECT * FROM sessions WHERE id = ? LIMIT 1").get(id);
        const files = database.prepare("SELECT * FROM sessions_contents WHERE session_id = ?").all(id) || [];
        if (result) {
            resolve({
                ...result,
                files
            });
        }
    });
}

export const create_session = async (server_id: string, plugin_version: string, files: DatabaseSessionFile[]): Promise<any> => {
    const id = uuid();
    const duration = 3600 * 2;
    const expires_at = Date.now() + duration * 1000;

    const session: DatabaseSession = {
        id,
        files,
        server_id,
        plugin_version,
        access_token: createToken<JwtEditorSessionClaims>({
            id,
            server_id,
            expires_at
        }, duration),
        created_at: Date.now(),
        expires_at,
        last_modified: 0
    };

    console.log(session);

    return new Promise((resolve, rej) => {
        const stmt = database.prepare(`INSERT INTO sessions (id, server_id, plugin_version, access_token, created_at, expires_at, last_modified) VALUES (?, ?, ?, ?, ?, ?, ?)`);
        const results = stmt.run(session.id, server_id, session.plugin_version, session.access_token, session.created_at, session.expires_at, 0);

        const stmtFiles = database.prepare(`INSERT INTO sessions_contents (id, name, session_id, content, last_modified) VALUES (?, ?, ?, ?, ?)`);
        files.forEach(file => {
            stmtFiles.run(file.id, file.name, session.id, file.content, file.last_modified);
        });

        if (results.changes !== 0) {
            resolve(session);
        } else {
            rej();
        }
    });
}

export const update_session_file = async (file: DatabaseSessionFile): Promise<DatabaseSessionFile> => {
    return new Promise((resolve, rej) => {
        const query = database.prepare(`update sessions_contents set content = ?, last_modified = ? where id = ?`).run(file.content, file.last_modified, file.id);
        if (query.changes !== 0) {
            resolve(file);
        } else {
            rej();
        }
    });
}

export const update_session = async (session: DatabaseSession): Promise<DatabaseSession> => {
    return new Promise((resolve, rej) => {
        const query = database.prepare(`update sessions set last_modified = ? where id = ?`).run(session.last_modified, session.id);
        if (query.changes !== 0) {
            resolve(session);
        } else {
            rej();
        }
    });
}

export const delete_expired_sessions = async (): Promise<void> => {
    return new Promise((resolve, rej) => {
        const time = Date.now();
        database.prepare(`DELETE FROM sessions_contents WHERE expires_at < ?`).run(time);
        database.prepare(`DELETE FROM sessions WHERE expires_at < ?`).run(time);

        resolve();
    });
}