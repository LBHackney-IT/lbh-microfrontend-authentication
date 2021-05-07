import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import { processToken, logout } from './services';
import Root from './root.component';

/*
    {
        "sub": "112895652611500752170",
        "email": "test@example.com",
        "iss": "Hackney",
        "name": "Tom Smith",
        "groups": ["TEST_GROUP"]
    }
 */
const mockTokenAuthorised =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMTI4OTU2NTI2MTE1MDA3NTIxNzAiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpc3MiOiJIYWNrbmV5IiwibmFtZSI6IlRvbSBTbWl0aCIsImdyb3VwcyI6WyJURVNUX0dST1VQIl0sImp0aSI6IjRlZmUyMDA4LTc4NmMtNDE1Ni05MGJhLTJjM2UxMzk4ZDhmNSIsImlhdCI6MTYxODgyOTA5NSwiZXhwIjoxNjE4ODMyNjk1fQ.uXfOvdv5JiUUfRNMHWpdYDfqdyf8bWmzD3G4ns3lJPQ';

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

const location = window.location;

beforeEach(() => {
    Object.defineProperty(window, 'location', {
        value: {
            href: 'http://localhost/',
        },
        writable: true,
    });
});

afterAll(() => {
    window.location = location;
});

describe('Root component', () => {
    describe('with no token saved', () => {
        it('should show the LoginButton', () => {
            const { getByText } = render(<Root />);
            expect(
                getByText('Sign in using Hackney.gov.uk')
            ).toBeInTheDocument();
        });
    });

    describe('with a token saved with authorised groups', () => {
        beforeAll(() => {
            logout();
            window.document.cookie = `hackneyToken=${mockTokenAuthorised}`;
            processToken();
        });
        it(`should replaceState to /search if history is available`, async () => {
            const replaceState = jest.fn();
            window.history.replaceState = replaceState;

            render(<Root />);

            expect(replaceState).toBeCalledTimes(1);
            expect(replaceState).toBeCalledWith(null, '', '/search');
        });

        it(`should redirect to /search if history is unavailable`, async () => {
            const history = window.history;

            Object.defineProperty(window, 'history', {
                value: false,
                writable: true,
            });

            render(<Root />);

            await waitFor(() => expect(window.location.href).toBe('/search'));

            Object.defineProperty(window, 'history', {
                value: history,
                writable: true,
            });
        });
    });

    describe('with a token saved with unauthorised groups', () => {
        beforeAll(() => {
            logout();
            window.document.cookie = `hackneyToken=${mockTokenUnauthorised}`;
            processToken();
        });

        it(`should show a "you don't have permission" message`, () => {
            render(<Root />);

            expect(
                screen.getByText(
                    /you do not have permission to access this service/i
                )
            ).toBeInTheDocument();
        });
    });
});
