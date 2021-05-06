import React, { useEffect } from 'react';

import { Authentication } from './services';
import { Unauthorised } from './components';

import './root.styles.scss';

export default function Root(): JSX.Element | null {
    const auth = Authentication.getInstance();

    useEffect(() => {
        if (!auth.isAuthenticated) {
            window.location.href = auth.loginUrl;
        } else if (auth.isAuthorised) {
            if (window.history) {
                window.history.replaceState(null, '', '/search');
            } else {
                window.location.href = '/search';
            }
        }
    }, []);

    return auth.isAuthenticated && !auth.isAuthorised ? <Unauthorised /> : null;
}
