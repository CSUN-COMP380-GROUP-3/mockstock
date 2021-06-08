import React from 'react';
import { render } from '@testing-library/react';
import BuyBox from './BuyBox';

it('renders component', () => {
    const { queryByTestId } = render(<BuyBox />);
    expect(queryByTestId('buybox')).toBeTruthy();
});