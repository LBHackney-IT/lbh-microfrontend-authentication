import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { config } from '@services';
import { LoginButton } from './login-button.component';

const location = window.location;

beforeEach(() => {
    Object.defineProperty(window, 'location', {
        value: {
            href: 'http://localhost/',
            origin: 'http://localhost',
        },
        writable: true,
    });
});

afterAll(() => {
    window.location = location;
});

it('renders correctly', async () => {
    const { getByText } = render(<LoginButton />);
    const button = getByText('Sign in using Hackney.gov.uk');
    fireEvent.click(button);
    await waitFor(() =>
        expect(window.location.href).toContain(config.authDomain)
    );
});
