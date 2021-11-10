import React from "react";

import { render } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { locale } from "../../services";
import { LoginButton } from "./login-button";

import { login } from "@mtfh/common/lib/auth";

jest.mock("@mtfh/common/lib/auth", () => ({
  login: jest.fn(),
}));

it("renders correctly", () => {
  const { container } = render(<LoginButton />);
  expect(container).toMatchSnapshot();
});

it("should call login", async () => {
  render(<LoginButton />);
  const button = screen.getByText(locale.signInUsingHackney);
  userEvent.click(button);
  expect(login).toHaveBeenCalled();
});
