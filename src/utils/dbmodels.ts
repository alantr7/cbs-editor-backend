export interface DatabaseSession {
    id: string,
    server_id: string,
    plugin_version: string,
    access_token: string,
    created_at: number,
    expires_at: number,
    last_modified: number,
    files: DatabaseSessionFile[],
}

export interface DatabaseSessionFile {
    id: string,
    name: string,
    content: string,
    last_modified: number,
}