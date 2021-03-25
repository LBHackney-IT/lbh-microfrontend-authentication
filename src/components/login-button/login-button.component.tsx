import React from "react";
import style from "./login-button.module.scss";
import { Auth } from "../../util/mtfh-util-auth";

const LoginButton = ({ loginUrl }) => (
  <a href={loginUrl} className={style.button}>
    Sign in using Hackney.gov.uk
  </a>
);

export default LoginButton;
