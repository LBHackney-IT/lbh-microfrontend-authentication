import React from 'react';

import './unathorised.scss';
import { Button, ErrorSummary } from '@mtfh/common';
import { locale } from '../../services';
import { REQUEST_ACCESS_LINK } from '../../constants';

export const Unauthorised = (): JSX.Element => {
    return (
        <div
            className="govuk-error-summary lbh-error-summary"
            aria-labelledby="error-summary-title"
            role="alert"
            tabIndex={-1}
            data-module="govuk-error-summary"
        >
            <ErrorSummary
                id="error-summary-title"
                title={locale.unauthorisedToViewService}
            />
            <div className="govuk-error-summary__body">
                <p>
                    {locale.contactToRequestPermission}
                    <Button as="a" href={REQUEST_ACCESS_LINK}>
                        {locale.requestAccess}
                    </Button>
                </p>
            </div>
        </div>
    );
};
