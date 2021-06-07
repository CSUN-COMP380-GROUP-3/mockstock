import React from 'react';
import { render, screen } from '@testing-library/react';
import Input from './Input';

test('it renders component', () => {
    render(<Input />);
    const element = screen.getByText(/Input/i);
    expect(element).toBeInTheDocument();
});