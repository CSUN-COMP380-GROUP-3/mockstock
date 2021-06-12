import React from 'react';
import { render } from '@testing-library/react';
import Portfolio from './Portfolio';

it('renders component', () => {
    const { queryByTestId } = render(<Portfolio />);
    expect(queryByTestId('portfolio')).toBeTruthy();
});