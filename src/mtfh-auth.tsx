import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import React from 'react';

import Root from './root.component';

export const { bootstrap, mount, unmount } = singleSpaReact({
    React,
    ReactDOM,
    rootComponent: Root,
    errorBoundary(error, info, properties) {
        // TODO: Log this error.
        console.error(error);
        console.error(info);
        console.error(properties);

        return <div>Something has gone wrong.</div>;
    },
});
