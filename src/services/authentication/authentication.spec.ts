import { AuthUser } from './authentication.types';
import {
    $auth,
    logout,
    isAuthorisedForGroups,
    isAuthorised,
    processToken,
} from './authentication';
/*
 {
     "sub": "112895652611500752170",
     "email": "test@example.com",
     "iss": "Hackney",
     "name": "Tom Smith",
     "groups": ['TEST_GROUP']
  }
 */
const mockToken =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMTI4OTU2NTI2MTE1MDA3NTIxNzAiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpc3MiOiJIYWNrbmV5IiwibmFtZSI6IlRvbSBTbWl0aCIsImdyb3VwcyI6WyJURVNUX0dST1VQIl0sImp0aSI6IjRlZmUyMDA4LTc4NmMtNDE1Ni05MGJhLTJjM2UxMzk4ZDhmNSIsImlhdCI6MTYxODgyOTA5NSwiZXhwIjoxNjE4ODMyNjk1fQ.uXfOvdv5JiUUfRNMHWpdYDfqdyf8bWmzD3G4ns3lJPQ';

Object.defineProperty(window.document, 'cookie', {
    writable: true,
    value: '',
});

let auth: AuthUser;

describe('auth', () => {
    describe('token not defined in cookie', () => {
        beforeAll(() => {
            logout();
            auth = $auth.getValue();
        });

        it('should not be able to get a token', () => {
            expect(auth.token).toBeFalsy();
        });

        it('should not be authenticated', () => {
            expect(isAuthorised()).toBe(false);
        });
    });

    describe('erroneous token defined', () => {
        beforeAll(() => {
            logout();
            window.document.cookie = `hackneyToken=123456`;
            processToken();
            auth = $auth.getValue();
        });

        it('should not be able to parse the token', () => {
            expect(auth.token).toBe('');
        });

        it('should not allow the user to be authorised', () => {
            expect(isAuthorised()).toBe(false);
        });
    });

    describe('valid token defined', () => {
        beforeAll(() => {
            logout();
            window.document.cookie = `hackneyToken=${mockToken}`;
            processToken();
            auth = $auth.getValue();
        });

        it('should be able to get the token', () => {
            expect(auth.token).toBeTruthy();
        });

        it('should contain the users name', () => {
            expect(auth.name).toEqual('Tom Smith');
        });

        it('should contain the users email', () => {
            expect(auth.email).toEqual('test@example.com');
        });

        it('should contain the users groups', () => {
            expect(auth.groups).toContain('TEST_GROUP');
        });

        it('should show the user is authenticated', () => {
            expect(isAuthorised()).toBeTruthy();
        });

        describe('isAuthorisedForGroups function', () => {
            it('should return true when the user is in the specified group', () => {
                expect(isAuthorisedForGroups(['TEST_GROUP'])).toBeTruthy();
            });

            it('should return false when the user is NOT in the specified group', () => {
                expect(
                    isAuthorisedForGroups(['not-a-users-group'])
                ).toBeFalsy();
            });
        });

        describe('logout function', () => {
            beforeAll(() => {
                logout();
                window.document.cookie = `hackneyToken=${mockToken}`;
                processToken();
            });

            it('should clear down correctly', () => {
                logout();

                const { email, name, groups, token } = $auth.getValue();

                expect(token).toBeFalsy();
                expect(email).toBeFalsy();
                expect(name).toBeFalsy();
                expect(groups).toEqual([]);
            });
        });
    });
});
