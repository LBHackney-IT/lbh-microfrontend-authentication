import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import { Authentication } from './services';
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

let location = window.location;

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
        it('should redirect to google auth', async () => {
            const auth = Authentication.getInstance();
            const loginUrl = auth.loginUrl;
            render(<Root />);
            await waitFor(() => expect(window.location.href).toBe(loginUrl));
        });
    });

    describe('with a token saved with authorised groups', () => {
        it(`should replaceState to /search if history is available`, () => {
            const replaceState = jest.fn();
            window.history.replaceState = replaceState;
            window.document.cookie = `hackneyToken=${mockTokenAuthorised}`;
            Authentication.getInstance(true);

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

            window.document.cookie = `hackneyToken=${mockTokenAuthorised}`;
            Authentication.getInstance(true);

            render(<Root />);

            await waitFor(() => expect(window.location.href).toBe('/search'));

            Object.defineProperty(window, 'history', {
                value: history,
                writable: true,
            });
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
});
