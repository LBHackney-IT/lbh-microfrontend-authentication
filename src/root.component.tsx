import React from "react";

import Unauthorised from "./components/unauthorised/unauthorised.component";
import { Auth } from "./util/mtfh-util-auth";
import LoginButton from "./components/login-button/login-button.component";

const ALLOWED_GROUPS = ["saml-aws-console-mtfh-developer"];

export default function Root(props) {
  const AuthInstance = Auth.getInstance();

  const token = AuthInstance.getToken();
  const isAuthorised = ALLOWED_GROUPS.find(AuthInstance.hasGroup);

  return !token ? (
    <LoginButton loginUrl={AuthInstance.createLoginURL()} />
  ) : token && !isAuthorised ? (
    <Unauthorised />
  ) : (
    <>
      <pre>{JSON.stringify(AuthInstance.parseToken(), null, 4)}</pre>
      <button
        onClick={() => {
          AuthInstance.logout();
          window.location.reload();
        }}
      >
        logout
      </button>
    </>
  );
}
