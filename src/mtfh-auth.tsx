import React from "react";
import ReactDOM from "react-dom";

import singleSpaReact from "single-spa-react";

import Root from "./root.component";

import { ErrorSummary } from "@mtfh/common/lib/components";

export const { bootstrap, mount, unmount } = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Root,
  errorBoundary() {
    return (
      <ErrorSummary
        id="mtfh-auth"
        title="Error"
        description="Unable to load authentication"
      />
    );
  },
});
