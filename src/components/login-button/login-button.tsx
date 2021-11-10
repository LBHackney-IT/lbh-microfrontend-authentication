import React from "react";

import { locale } from "../../services";

import { login } from "@mtfh/common/lib/auth";
import { Button } from "@mtfh/common/lib/components";
import "./login-button.scss";

export const LoginButton = (): JSX.Element => (
  <Button onClick={() => login()}>{locale.signInUsingHackney}</Button>
);
