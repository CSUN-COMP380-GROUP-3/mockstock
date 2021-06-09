import React from 'react';
import { queryAllByText, queryByText, render } from '@testing-library/react';
import DatePicker from './DatePicker';
import moment from 'moment';

describe('DatePicker component', () => {
    it('renders correctly', () => {
        const now = moment();
        const nowFormatted = now.format('MM/DD/YYYY');
        const { queryByTestId, queryAllByText, queryByDisplayValue } = render(
            <DatePicker 
                onChange={() => {}} 
                value={now}
                label="Test Date"
            />
        );
        expect(queryByTestId('datepicker')).toBeTruthy();
        expect(queryAllByText('Test Date')[0]).toBeTruthy();
        expect(queryByDisplayValue(nowFormatted)).toBeTruthy();
    });
});