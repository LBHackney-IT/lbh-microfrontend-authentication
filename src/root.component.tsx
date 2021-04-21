import React from 'react';

import { Authentication } from './services';
import { LoginButton, Unauthorised } from './components';

import './root.styles.scss';

export default function Root(): JSX.Element {
    const authentication = Authentication.getInstance();
    const isAuthorised = authentication.isAuthorisedForGroups([
        'saml-aws-console-mtfh-developer',
    ]);

    if (!authentication.isAuthenticated) {
        return <LoginButton loginUrl={authentication.loginUrl} />;
    }

    if (!isAuthorised) {
        return <Unauthorised />;
    }

    return (
        <>
            <pre>{JSON.stringify(authentication.token, null, 4)}</pre>
            <button
                onClick={() => {
                    authentication.logout();
                    window.location.reload();
                }}
            >
                logout
            </button>
        </>
    );
}
