import React from 'react';
import { render, screen } from '@testing-library/react';
import StockChart from './StockChart';

test('it renders component', () => {
    render(<StockChart />);
    const element = screen.getByText(/StockChart/i);
    expect(element).toBeInTheDocument();
});