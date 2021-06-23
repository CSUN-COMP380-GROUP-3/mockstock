import React from 'react';

import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardDatePicker, KeyboardDatePickerProps } from '@material-ui/pickers';
import moment from 'moment';

export type DatePickerProps = KeyboardDatePickerProps;

export const minDate = moment().subtract(1, 'year');
export const maxDate = moment().subtract(1, 'day');

export default function DatePicker(props: DatePickerProps) {
    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDatePicker
                {...props}
                variant="inline"
                format="MM/DD/YYYY"
                margin="normal"
                KeyboardButtonProps={{
                    'aria-label': 'change-date'
                }}
                disableFuture={true}
                disableToolbar={true}
                data-testid="datepicker"
            />
        </MuiPickersUtilsProvider>
    );
};