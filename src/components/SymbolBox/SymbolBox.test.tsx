import React from 'react';
import { render } from '@testing-library/react';
import SymbolBox from './SymbolBox';

it('renders component', () => {
    const { queryByTestId } = render(<SymbolBox />);
    expect(queryByTestId('symbolbox')).toBeTruthy();
});