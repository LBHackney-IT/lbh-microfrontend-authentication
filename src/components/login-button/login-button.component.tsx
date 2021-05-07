import React from 'react';

import { login } from '../../services/authentication';
import './login-button.scss';

export const LoginButton = (): JSX.Element => (
    <button onClick={() => login()} className="govuk-button lbh-button">
        Sign in using Hackney.gov.uk
    </button>
);
