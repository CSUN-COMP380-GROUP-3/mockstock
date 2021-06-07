import React from 'react';
import { render, screen } from '@testing-library/react';
import DatePicker from './DatePicker';

test('it renders component', () => {
    render(<DatePicker />);
    const element = screen.getByText(/DatePicker/i);
    expect(element).toBeInTheDocument();
});