import React from 'react';
import { render } from '@testing-library/react';
import DatePicker from './DatePicker';

it('renders component', () => {
    const { queryByTestId } = render(<DatePicker />);
    expect(queryByTestId('datepicker')).toBeTruthy();
});