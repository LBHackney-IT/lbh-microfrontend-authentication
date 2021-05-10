import React, { useEffect } from 'react';

import { $auth, isAuthorised } from './services';
import { Unauthorised, LoginButton } from './components';

import './root.styles.scss';

export default function Root(): JSX.Element | null {
    const auth = $auth.getValue();

    useEffect(() => {
        if (isAuthorised()) {
            if (window.history) {
                window.history.replaceState(null, '', '/search');
            } else {
                window.location.href = '/search';
            }
        }
    }, []);

    return auth.token && !isAuthorised() ? <Unauthorised /> : <LoginButton />;
}
