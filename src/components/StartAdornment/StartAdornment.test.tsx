import React from 'react';
import { render } from '@testing-library/react';
import StartAdornment from './StartAdornment';

it('renders component', () => {
    const { queryByTestId } = render(<StartAdornment />);
    expect(queryByTestId('startadornment')).toBeTruthy();
});