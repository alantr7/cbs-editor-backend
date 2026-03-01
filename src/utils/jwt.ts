import jwt from 'jsonwebtoken';

export function createToken<T extends object>(payload: T, timeValid: number) {
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: Date.now() + timeValid
    });
}

export function verifyToken<T extends object>(token: string): T | null {
    try {
        return jwt.verify(token, process.env.JWT_SECRET as string) as T;
    } catch {
        return null;
    }
}