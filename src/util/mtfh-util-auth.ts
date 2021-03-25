// Anything exported from this file is importable by other in-browser modules.

import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

const AUTH_DOMAIN = `//auth.hackney.gov.uk/auth?redirect_uri=`;
const COOKIE_DOMAIN = "hackney.gov.uk";
const AUTH_TOKEN_NAME = "hackneyToken";

type AuthDefaultStringValue = string | undefined;
type AuthDefaultNumberValue = string | undefined;

export class Auth {
  private static instance;

  private sub: AuthDefaultStringValue;
  private email: AuthDefaultStringValue;
  private iss: AuthDefaultStringValue;
  private name: AuthDefaultStringValue;
  private groups: [AuthDefaultStringValue];
  private iat: AuthDefaultNumberValue;

  constructor() {}

  static getInstance() {
    if (!Auth.instance) {
      Auth.instance = new Auth();
      if (Auth.instance.getToken()) Auth.instance.parseToken();
    }
    return Auth.instance;
  }

  public createRedirectURI(): string {
    // This could be extended later using the constructor
    return window.location.href;
  }

  public getToken(): string | null {
    const token = Cookies.get(AUTH_TOKEN_NAME);
    return token || null;
  }

  public parseToken() {
    if (!this.getToken()) return null;
    const parsed = jwt.decode(this.getToken());
    Object.assign(this, parsed);
    return parsed;
  }

  public createLoginURL(): string {
    return AUTH_DOMAIN + this.createRedirectURI();
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  public logout(): void {
    this.sub = undefined;
    this.email = undefined;
    this.iss = undefined;
    this.name = undefined;
    this.groups = undefined;
    this.iat = undefined;
    Cookies.remove(AUTH_TOKEN_NAME, { domain: COOKIE_DOMAIN });
  }

  getFullName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getGroups(): string[] {
    return this.groups;
  }

  hasGroup(groupName: string): boolean {
    return (Auth.getInstance().groups || []).indexOf(groupName) >= 0;
  }
}
