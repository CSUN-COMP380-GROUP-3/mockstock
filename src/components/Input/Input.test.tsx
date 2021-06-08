import React from 'react';
import { render } from '@testing-library/react';
import Input from './Input';

it('renders component', () => {
    const { queryByTestId } = render(<Input />);
    expect(queryByTestId('input')).toBeTruthy();
});