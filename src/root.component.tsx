import { useHistory } from 'react-router-dom';
import React, { useEffect } from 'react';

import { $auth, isAuthorised } from '@mtfh/common';
import { Unauthorised, LoginButton } from './components';

import './root.styles.scss';

export default function Root(): JSX.Element | null {
    const history = useHistory();

    const auth = $auth.getValue();

    useEffect(() => {
        if (isAuthorised() && history) {
            history.push('/search');
        }
    }, []);

    return auth.token && !isAuthorised() ? <Unauthorised /> : <LoginButton />;
}
