import React from 'react';
import { render, screen } from '@testing-library/react';
import StatBox from './StatBox';

test('it renders component', () => {
    render(<StatBox />);
    const element = screen.getByText(/StatBox/i);
    expect(element).toBeInTheDocument();
});