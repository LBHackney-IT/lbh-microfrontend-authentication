import React from "react";

import { REQUEST_ACCESS_LINK } from "../../constants";
import { locale } from "../../services";

import { Button, ErrorSummary } from "@mtfh/common/lib/components";
import "./unathorised.scss";

export const Unauthorised = (): JSX.Element => {
  return (
    <ErrorSummary id="error-summary-title" title={locale.unauthorisedToViewService}>
      <p>
        {locale.contactToRequestPermission}
        <Button as="a" href={REQUEST_ACCESS_LINK}>
          {locale.requestAccess}
        </Button>
      </p>
    </ErrorSummary>
  );
};
