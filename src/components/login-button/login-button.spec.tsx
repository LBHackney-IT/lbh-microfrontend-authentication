import React from 'react';
import { render } from '@testing-library/react';

import { LoginButton } from './login-button.component';

it('renders correctly', () => {
    const { getByText } = render(<LoginButton loginUrl="/login" />);
    expect(getByText('Sign in using Hackney.gov.uk').getAttribute('href')).toBe(
        '/login'
    );
});
