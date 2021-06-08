import React from 'react';
import { render } from '@testing-library/react';
import LiquidBalance from './LiquidBalance';

it('renders component', () => {
    const { queryByTestId } = render(<LiquidBalance />);
    expect(queryByTestId('liquidbalance')).toBeTruthy();
});