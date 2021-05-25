import { BehaviorSubject } from 'rxjs';
import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';

import { AuthUser, JWTPayload } from './authentication.types';
import { config } from '../config';

const voidUser = {
    token: '',
    sub: '',
    email: '',
    iss: '',
    name: '',
    groups: [],
    iat: Number.NaN,
};

const parseToken = (): AuthUser => {
    const token = Cookies.get(config.authToken) || null;

    if (!token) {
        return voidUser;
    }

    try {
        const decodedToken = jwt_decode<JWTPayload>(token);
        return {
            ...decodedToken,
            token,
        };
    } catch {
        return voidUser;
    }
};

export const $auth = new BehaviorSubject(parseToken());

export const processToken = (): void => {
    $auth.next(parseToken());
};

export const isAuthorisedForGroups = (groups: string[]): boolean => {
    const auth = $auth.getValue();
    return groups.some(group => auth.groups.includes(group));
};

export const isAuthorised = (): boolean => {
    return isAuthorisedForGroups(config.authAllowedGroups);
};

export const login = (
    redirectUrl = `${window.location.origin}/search`
): void => {
    logout();
    window.location.href = `${
        config.authDomain
    }?redirect_uri=${encodeURIComponent(redirectUrl)}`;
};

export const logout = (): void => {
    $auth.next(voidUser);
    Cookies.remove(config.authToken, {
        domain: config.cookieDomain,
    });
};
