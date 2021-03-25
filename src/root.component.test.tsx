import React from "react";
import jwt from "jsonwebtoken";
import { render } from "@testing-library/react";
import Root from "./root.component";
import { Auth } from "./util/mtfh-util-auth";

const AUTH_TOKEN_NAME = "hackneyToken";
const AUTH_DOMAIN = `//auth.hackney.gov.uk/auth?redirect_uri=`;

const TEST_NAME = "Ash Taylor";
const TEST_EMAIL = "ash.taylor@hackney.gov.uk";
const TEST_GROUP = "saml-aws-console-mtfh-developer";
const TEST_URI = "http://localhost/";
const TEST_TOKEN_AUTHORISED = jwt.sign(
  {
    sub: "112895652611500752170",
    email: TEST_EMAIL,
    iss: "Hackney",
    name: TEST_NAME,
    groups: [TEST_GROUP],
  },
  "secret"
);

const TEST_TOKEN_UNAUTHORISED = jwt.sign(
  {
    sub: "112895652611500752170",
    email: TEST_EMAIL,
    iss: "Hackney",
    name: TEST_NAME,
    groups: [],
  },
  "secret"
);

Object.defineProperty(window.document, "cookie", {
  writable: true,
  value: "",
});

const AuthInstance = Auth.getInstance();

describe("Test Auth UI components", () => {
  describe("Test no token saved", () => {
    beforeAll(() => {
      window.document.cookie = ``;
    });

    it("No token should render Login Button", () => {
      const { getByText } = render(<Root />);
      expect(getByText(/Sign in using Hackney.gov.uk/i)).toBeInTheDocument();
    });
  });

  describe("Test token saved with authorised groups", () => {
    beforeAll(() => {
      window.document.cookie = `${AUTH_TOKEN_NAME}=${TEST_TOKEN_AUTHORISED}`;
      AuthInstance.parseToken();
    });
    it(`Should render a PRE block containing ${TEST_EMAIL}`, () => {
      const { getByText } = render(<Root />);
      expect(getByText(/ash.taylor@hackney.gov.uk/i)).toBeInTheDocument();
    });
  });

  describe("Test token saved with authorised groups", () => {
    beforeAll(() => {
      window.document.cookie = `${AUTH_TOKEN_NAME}=${TEST_TOKEN_UNAUTHORISED}`;
      AuthInstance.parseToken();
    });
    it(`Should render a PRE block containing ${TEST_EMAIL}`, () => {
      const { getByText } = render(<Root />);
      expect(
        getByText(/You do not have permission to access this service/i)
      ).toBeInTheDocument();
    });
  });
});
