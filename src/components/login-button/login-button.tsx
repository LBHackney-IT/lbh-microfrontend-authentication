import React from 'react';

import { login, Button } from '@mtfh/common';
import { locale } from '../../services';
import './login-button.scss';

export const LoginButton = (): JSX.Element => (
    <Button onClick={() => login()}>{locale.signInUsingHackney}</Button>
);
