import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import { Authentication } from './services';
import Root from './root.component';

/*
    {
        "sub": "112895652611500752170",
        "email": "test@example.com",
        "iss": "Hackney",
        "name": "Tom Smith",
        "groups": ["saml-aws-console-mtfh-developer"]
    }
 */
const mockTokenAuthorised =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTI4OTU2NTI2MTE1MDA3NTIxNzAiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpc3MiOiJIYWNrbmV5IiwibmFtZSI6IlRvbSBTbWl0aCIsImdyb3VwcyI6WyJzYW1sLWF3cy1jb25zb2xlLW10ZmgtZGV2ZWxvcGVyIl19.68fT4lMHv1SqQCz_I6m-BymGYrieBy7GGyV9H_MCM2U';

/*
    {
        "sub": "112895652611500752170",
        "email": "test@example.com",
        "iss": "Hackney",
        "name": "Tom Smith",
        "groups": "[]"
    }
 */
const mockTokenUnauthorised =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTI4OTU2NTI2MTE1MDA3NTIxNzAiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpc3MiOiJIYWNrbmV5IiwibmFtZSI6IlRvbSBTbWl0aCIsImdyb3VwcyI6IltdIn0.gCUnv7_vu1GGqzOW7kubK3mGt99CPsAQyNaNvd6khUc';

Object.defineProperty(window.document, 'cookie', {
    writable: true,
    value: '',
});

describe('Root component', () => {
    describe('with no token saved', () => {
        it('should render the login button', () => {
            window.document.cookie = ``;
            Authentication.getInstance();

            render(<Root />);

            expect(
                screen.getByText(/sign in using hackney.gov.uk/i)
            ).toBeInTheDocument();
        });
    });

    describe('with a token saved with authorised groups', () => {
        it(`should render a "pre" block containing the test email`, () => {
            window.document.cookie = `hackneyToken=${mockTokenAuthorised}`;
            Authentication.getInstance(true);

            render(<Root />);

            expect(screen.getByText(/test@example.com/)).toBeInTheDocument();
        });
    });

    describe('with a token saved with unauthorised groups', () => {
        it(`should show a "you don't have permission" message`, () => {
            window.document.cookie = `hackneyToken=${mockTokenUnauthorised}`;
            Authentication.getInstance(true);

            render(<Root />);

            expect(
                screen.getByText(
                    /you do not have permission to access this service/i
                )
            ).toBeInTheDocument();
        });
    });

    describe('the "log out" button', () => {
        it('should call the authentication logout method and reload the page when clicked', () => {
            window.document.cookie = `hackneyToken=${mockTokenAuthorised}`;
            const authentication = Authentication.getInstance(true);
            const logoutSpy = jest.spyOn(authentication, 'logout');

            const mockReload = jest.fn();
            // @ts-ignore
            delete window.location;
            // @ts-ignore
            window.location = { reload: mockReload };

            render(<Root />);

            userEvent.click(screen.getByRole('button', { name: 'logout' }));

            expect(logoutSpy).toHaveBeenCalled();
            expect(mockReload).toHaveBeenCalled();
        });
    });
});
