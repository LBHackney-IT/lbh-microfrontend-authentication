import jwt from "jsonwebtoken";
import { Auth } from "./mtfh-util-auth";

const AUTH_TOKEN_NAME = "hackneyToken";
const AUTH_DOMAIN = `//auth.hackney.gov.uk/auth?redirect_uri=`;

const TEST_NAME = "Ash Taylor";
const TEST_EMAIL = "ash.taylor@hackney.gov.uk";
const TEST_GROUP = "saml-aws-console-mtfh-developer";
const TEST_URI = "http://localhost/";
const TEST_TOKEN = jwt.sign(
  {
    sub: "112895652611500752170",
    email: TEST_EMAIL,
    iss: "Hackney",
    name: TEST_NAME,
    groups: [TEST_GROUP],
  },
  "secret"
);

Object.defineProperty(window.document, "cookie", {
  writable: true,
  value: "",
});

describe("Test Auth class functions and lifecycle", () => {
  const AuthClass = Auth.getInstance();

  describe("Given token not defined in cookie", () => {
    beforeAll(() => {
      window.document.cookie = ``;
    });

    it("Should not be able to getToken()", () => {
      expect(AuthClass.getToken()).toBe(null);
    });
    it("Should not be able to parseToken()", () => {
      expect(AuthClass.parseToken()).toBe(null);
    });
    it("Should not be able to be isAuthenticated()", () => {
      expect(AuthClass.isAuthenticated()).toBe(false);
    });
    it("Should expect createRedirectURI() to return http://localhost", () => {
      expect(AuthClass.createRedirectURI()).toBe(TEST_URI);
    });
    it("Should expect createLoginURL() to return a link to Hackney Auth", () => {
      expect(AuthClass.createLoginURL()).toBe(`${AUTH_DOMAIN}${TEST_URI}`);
    });
    it("Should have an undefined name", () => {
      expect(AuthClass.getFullName()).toEqual(undefined);
    });
  });

  describe("With erroneous token defined", () => {
    beforeAll(() => {
      window.document.cookie = `${AUTH_TOKEN_NAME}=123456`;
    });

    it("Should not be able to parseToken()", () => {
      expect(AuthClass.parseToken()).toBe(null);
    });
  });

  describe("With valid token defined", () => {
    beforeAll(() => {
      window.document.cookie = `${AUTH_TOKEN_NAME}=${TEST_TOKEN}`;
    });

    it("should getToken", () => {
      const token = AuthClass.getToken();
      expect(token).toBe(TEST_TOKEN);
    });

    it("token should be parseable", () => {
      AuthClass.parseToken();
      expect(AuthClass.name).toEqual(TEST_NAME);
    });

    it("fullName()", () => {
      expect(AuthClass.getFullName()).toEqual(TEST_NAME);
    });

    it("getEmail()", () => {
      expect(AuthClass.getEmail()).toEqual(TEST_EMAIL);
    });

    it("getGroups()", () => {
      expect(AuthClass.getGroups()).toContain(TEST_GROUP);
    });

    it("hasGroup()", () => {
      expect(AuthClass.hasGroup(TEST_GROUP)).toBeTruthy();
    });

    it("isAuthenticated()", () => {
      expect(AuthClass.isAuthenticated()).toBeTruthy();
    });

    it("logout()", () => {
      AuthClass.logout();
      expect(AuthClass.getToken()).toBeFalsy();
      const { sub, email, iss, name, groups, iat } = AuthClass;
      expect(sub).toBe(undefined);
      expect(email).toBe(undefined);
      expect(iss).toBe(undefined);
      expect(name).toBe(undefined);
      expect(groups).toBe(undefined);
      expect(iat).toBe(undefined);
    });
  });
});
