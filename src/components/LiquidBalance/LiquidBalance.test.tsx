import React from 'react';
import { render, screen } from '@testing-library/react';
import LiquidBalance from './LiquidBalance';

test('it renders component', () => {
    render(<LiquidBalance />);
    const element = screen.getByText(/LiquidBalance/i);
    expect(element).toBeInTheDocument();
});