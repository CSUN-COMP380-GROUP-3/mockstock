import React from 'react';
import { render, screen } from '@testing-library/react';
import SymbolBox from './SymbolBox';

test('it renders component', () => {
    render(<SymbolBox />);
    const element = screen.getByText(/SymbolBox/i);
    expect(element).toBeInTheDocument();
});