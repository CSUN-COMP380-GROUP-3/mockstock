import React from 'react';

import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardDatePicker, KeyboardDatePickerProps } from '@material-ui/pickers';
import { BaseKeyboardPickerProps } from '@material-ui/pickers/_shared/hooks/useKeyboardPickerState';
import moment, { Moment } from 'moment';

export type DatePickerProps = KeyboardDatePickerProps;

export const minDate = moment().subtract(1, 'year');

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
                minDate={minDate}
                data-testid="datepicker"
            />
        </MuiPickersUtilsProvider>
    );
};