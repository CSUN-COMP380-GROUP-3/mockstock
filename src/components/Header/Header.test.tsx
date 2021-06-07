import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header';

test('it renders component', () => {
    render(<Header />);
    const element = screen.getByText(/Header/i);
    expect(element).toBeInTheDocument();
});