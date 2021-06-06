import React from 'react';

import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { BaseKeyboardPickerProps } from '@material-ui/pickers/_shared/hooks/useKeyboardPickerState';
import moment, { Moment } from 'moment';

export interface DatePickerProps {
    id: string;
    label: string;
    value: Moment;
    onChange: BaseKeyboardPickerProps['onChange'];
};

export const minDate = moment().subtract(1, 'year');

export default function DatePicker(props: DatePickerProps) {
    let { id, label, value, onChange } = props;

    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/DD/YYYY"
                margin="normal"
                id={id}
                label={label}
                value={value}
                onChange={onChange}
                KeyboardButtonProps={{
                    'aria-label': 'change-date'
                }}
                disableFuture
                minDate={minDate}
            />
        </MuiPickersUtilsProvider>
    );
};