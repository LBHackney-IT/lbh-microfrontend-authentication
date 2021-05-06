import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';

import { config } from '../config';

export class Authentication {
    private static instance: Authentication;
    private static AUTH_TOKEN_NAME = config.authToken;

    private sub?: string;
    private iss?: string;
    private iat?: string;

    token?: string | null;
    name?: string;
    email?: string;
    groups: string[] = [];

    constructor() {}

    static getInstance(forceNew = false): Authentication {
        if (!Authentication.instance || forceNew) {
            Authentication.instance = new Authentication();
            Authentication.instance.token = Authentication.instance.parseToken();
        }

        return Authentication.instance;
    }

    private parseToken() {
        const token = Cookies.get(Authentication.AUTH_TOKEN_NAME) || null;

        if (token === null) {
            return null;
        }

        try {
            const decodedToken = jwt_decode<string>(token);
            Object.assign(this, decodedToken);

            return decodedToken;
        } catch {
            return null;
        }
    }

    get isAuthenticated(): boolean {
        return !!this.token;
    }

    get fullName(): string | undefined {
        return this.name;
    }

    get redirectUrl(): string {
        return window.location.href;
    }

    get loginUrl(): string {
        return `${config.authDomain}?redirect_uri=${this.redirectUrl}`;
    }

    get isAuthorised(): boolean {
        return (
            this.isAuthenticated &&
            this.isAuthorisedForGroups(config.authAllowedGroups)
        );
    }

    public isAuthorisedForGroups(groups: string[]): boolean {
        return groups.every(group => this.groups.includes(group));
    }

    public logout(): void {
        this.token = undefined;
        this.sub = undefined;
        this.email = undefined;
        this.iss = undefined;
        this.name = undefined;
        this.groups = [];
        this.iat = undefined;
        Cookies.remove(Authentication.AUTH_TOKEN_NAME, {
            domain: config.cookieDomain,
        });
    }
}
