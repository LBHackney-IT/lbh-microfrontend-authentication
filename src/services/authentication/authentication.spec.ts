import { Authentication } from './authentication';

/*
 {
     "sub": "112895652611500752170",
     "email": "test@example.com",
     "iss": "Hackney",
     "name": "Tom Smith",
     "groups": "['TEST_GROUP']"
  }
 */
const mockToken =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMTI4OTU2NTI2MTE1MDA3NTIxNzAiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpc3MiOiJIYWNrbmV5IiwibmFtZSI6IlRvbSBTbWl0aCIsImdyb3VwcyI6WyJURVNUX0dST1VQIl0sImp0aSI6IjRlZmUyMDA4LTc4NmMtNDE1Ni05MGJhLTJjM2UxMzk4ZDhmNSIsImlhdCI6MTYxODgyOTA5NSwiZXhwIjoxNjE4ODMyNjk1fQ.uXfOvdv5JiUUfRNMHWpdYDfqdyf8bWmzD3G4ns3lJPQ';

let authentication: Authentication;

Object.defineProperty(window.document, 'cookie', {
    writable: true,
    value: '',
});

describe('Authentication class', () => {
    describe('token not defined in cookie', () => {
        beforeAll(() => {
            window.document.cookie = ``;
            authentication = Authentication.getInstance(true);
        });

        it('should not be able to get a token', () => {
            expect(authentication.token).toBe(null);
        });

        it('should not be authenticated', () => {
            expect(authentication.isAuthenticated).toBe(false);
        });

        it('should create a redirect URL of "http://localhost"', () => {
            expect(authentication.redirectUrl).toBe('http://localhost/');
        });

        it('should create a login URL to return a user to the Hackney authentication page', () => {
            expect(authentication.loginUrl).toBe(
                `//auth.hackney.gov.uk/auth?redirect_uri=http://localhost/`
            );
        });

        it('should have an undefined name', () => {
            expect(authentication.fullName).toEqual(undefined);
        });
    });

    describe('erroneous token defined', () => {
        beforeAll(() => {
            window.document.cookie = `hackneyToken=123456`;
            authentication = Authentication.getInstance(true);
        });

        it('should not be able to parse the token', () => {
            expect(authentication.token).toBe(null);
        });
    });

    describe('valid token defined', () => {
        beforeAll(() => {
            window.document.cookie = `hackneyToken=${mockToken}`;
            authentication = Authentication.getInstance(true);
        });

        it('should be able to get the token', () => {
            expect(authentication.token).toBeTruthy();
        });

        it('should contain the users name', () => {
            expect(authentication.name).toEqual('Tom Smith');
        });

        it('should contain the users full name', () => {
            expect(authentication.fullName).toEqual('Tom Smith');
        });

        it('should contain the users email', () => {
            expect(authentication.email).toEqual('test@example.com');
        });

        it('should contain the users groups', () => {
            expect(authentication.groups).toContain('TEST_GROUP');
        });

        it('should show the user is authenticated', () => {
            expect(authentication.isAuthenticated).toBeTruthy();
        });

        describe('isAuthorised function', () => {
            it('should return true when the user is in the specified group', () => {
                console.log(authentication);
                expect(
                    authentication.isAuthorisedForGroups(['TEST_GROUP'])
                ).toBeTruthy();
            });

            it('should return false when the user is NOT in the specified group', () => {
                expect(
                    authentication.isAuthorisedForGroups(['not-a-users-group'])
                ).toBeFalsy();
            });
        });

        describe('logout function', () => {
            it('should clear down correctly', () => {
                authentication.logout();

                const { email, name, groups, token } = authentication;

                expect(token).toBeUndefined();
                expect(email).toBeUndefined();
                expect(name).toBeUndefined();
                expect(groups).toEqual([]);
            });
        });
    });
});
