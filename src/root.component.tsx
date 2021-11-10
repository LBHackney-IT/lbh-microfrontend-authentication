import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { LoginButton, Unauthorised } from "./components";

import { $auth, isAuthorised } from "@mtfh/common/lib/auth";

export default function Root(): JSX.Element | null {
  const history = useHistory();

  const auth = $auth.getValue();

  useEffect(() => {
    if (isAuthorised()) {
      history.push("/search");
    }
  }, [history]);

  return auth.token && !isAuthorised() ? <Unauthorised /> : <LoginButton />;
}
