export interface JWTPayload {
    sub: string;
    email: string;
    iss: string;
    name: string;
    groups: string[];
    iat: number;
}

export interface AuthUser extends JWTPayload {
    token: string;
}
