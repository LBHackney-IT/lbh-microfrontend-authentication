import React from 'react';

import { LoginButtonProperties } from './login-button.types';

import './login-button.scss';

export const LoginButton = ({
    loginUrl,
}: LoginButtonProperties): JSX.Element => (
    <a href={loginUrl} className="govuk-button lbh-button">
        Sign in using Hackney.gov.uk
    </a>
);
