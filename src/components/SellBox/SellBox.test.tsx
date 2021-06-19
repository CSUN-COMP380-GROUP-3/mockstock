import React from 'react';
import { render } from '@testing-library/react';
import SellBox from './SellBox';

it('renders component', () => {
    const { queryByTestId } = render(<SellBox />);
    expect(queryByTestId('sellbox')).toBeTruthy();
});