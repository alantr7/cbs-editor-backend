export interface JwtServerClaims {
    id: string,
    version: string,
}

export interface JwtEditorSessionClaims {
    id: string,
    server_id: string,
    expires_at: number,
}