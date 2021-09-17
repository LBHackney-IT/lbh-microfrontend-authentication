import React from 'react';
import { render, screen } from '@testing-library/react';

import { $auth, isAuthorised } from '@mtfh/common';
import { locale } from './services';
import Root from './root.component';

window.HTMLElement.prototype.scrollIntoView = jest.fn();
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

const location = window.location;

jest.mock('@mtfh/common', () => ({
    ...jest.requireActual('@mtfh/common'),
    $auth: { getValue: jest.fn() },
    isAuthorised: jest.fn().mockReturnValueOnce(true),
}));

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
    const $authGetValueMock = $auth.getValue as jest.Mock;
    const isAuthorisedMock = isAuthorised as jest.Mock;

    describe('with no token saved', () => {
        it('should show the LoginButton', () => {
            $authGetValueMock.mockReturnValueOnce({
                token: undefined,
            });

            const { getByText } = render(<Root />);
            expect(getByText(locale.signInUsingHackney)).toBeInTheDocument();
        });
    });

    describe('with a token saved with authorised groups', () => {
        it(`should call mockHistoryPush to /search if history is available`, async () => {
            $authGetValueMock.mockReturnValueOnce({ token: 'token' });
            isAuthorisedMock.mockReturnValueOnce(true);

            render(<Root />);
            expect(mockHistoryPush).toBeCalledTimes(1);
            expect(mockHistoryPush).toBeCalledWith('/search');
        });
    });

    describe('with a token saved with unauthorised groups', () => {
        it(`should show a "you don't have permission" message`, () => {
            $authGetValueMock.mockReturnValueOnce({ token: 'token' });
            isAuthorisedMock.mockReturnValueOnce(false);

            render(<Root />);

            expect(
                screen.getByText(locale.unauthorisedToViewService)
            ).toBeInTheDocument();
        });
    });
});
