import React from 'react';
import { render } from '@testing-library/react';

import { Unauthorised } from './unauthorised.component';

window.HTMLElement.prototype.scrollIntoView = jest.fn();

it('renders correctly', async () => {
    const { container } = render(<Unauthorised />);
    expect(container).toMatchSnapshot();
});
