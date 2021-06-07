import React from 'react';
import { render, screen } from '@testing-library/react';
import StartAdornment from './StartAdornment';

test('it renders component', () => {
    render(<StartAdornment />);
    const element = screen.getByText(/StartAdornment/i);
    expect(element).toBeInTheDocument();
});