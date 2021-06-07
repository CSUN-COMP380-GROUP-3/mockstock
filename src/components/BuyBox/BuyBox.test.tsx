import React from 'react';
import { render, screen } from '@testing-library/react';
import BuyBox from './BuyBox';

test('it renders component', () => {
    render(<BuyBox />);
    const element = screen.getByText(/BuyBox/i);
    expect(element).toBeInTheDocument();
});