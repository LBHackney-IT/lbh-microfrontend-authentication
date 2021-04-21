import React from 'react';

import './unathorised.scss';

export const Unauthorised = (): JSX.Element => {
    return (
        <div
            className="govuk-error-summary lbh-error-summary"
            aria-labelledby="error-summary-title"
            role="alert"
            tabIndex={-1}
            data-module="govuk-error-summary"
        >
            <h2 className="govuk-error-summary__title" id="error-summary-title">
                You do not have permission to access this service.
            </h2>
            <div className="govuk-error-summary__body">
                <p>To request permission please contact [xxxxxxxxxxx]</p>
            </div>
        </div>
    );
};
