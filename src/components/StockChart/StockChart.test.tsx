import React from 'react';
import { render } from '@testing-library/react';
import StockChart from './StockChart';

xit('renders component', () => {
    const { queryByTestId } = render(<StockChart />);
    expect(queryByTestId('stockchart')).toBeTruthy();
});