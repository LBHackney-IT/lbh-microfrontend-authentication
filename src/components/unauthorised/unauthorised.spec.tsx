import React from "react";

import { render } from "@hackney/mtfh-test-utils";

import { Unauthorised } from "./unauthorised";

it("renders correctly", async () => {
  const { container } = render(<Unauthorised />);
  expect(container).toMatchSnapshot();
});
