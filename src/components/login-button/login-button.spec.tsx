import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { login } from '@mtfh/common';
import { LoginButton } from './login-button';
import { locale } from '../../services';

jest.mock('@mtfh/common', () => ({
    ...jest.requireActual('@mtfh/common'),
    login: jest.fn(),
}));

it('renders correctly', () => {
    const { container } = render(<LoginButton />);
    expect(container).toMatchSnapshot();
});

it('should call login', async () => {
    const { getByText } = render(<LoginButton />);
    const button = getByText(locale.signInUsingHackney);
    fireEvent.click(button);
    expect(login).toHaveBeenCalled();
});
