import React from 'react';
import MomentUtils from '@date-io/moment';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import {
    MuiPickersUtilsProvider,
    DatePicker as MuiDatePicker,
    DatePickerProps as MuiDatePickerProps
} from '@material-ui/pickers';
import moment from 'moment';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import Popover from '@material-ui/core/Popover';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { Moment } from 'moment';

export interface DatePickerProps extends MuiDatePickerProps {
    validUnixTimestamps?: number[];
};

export const minDate = moment().subtract(1, 'year');
export const maxDate = moment().subtract(1, 'day');

export default function DatePicker(props: DatePickerProps) {
    const { value, validUnixTimestamps } = props;
    const [anchorEl, setAnchorEl] = React.useState<SVGSVGElement | null>(null);

    const onClick = (event: React.MouseEvent<SVGSVGElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const onClose = () => {
        setAnchorEl(null);
    };

    const shouldDisableDateHandler = (date?: MaterialUiPickersDate) => {
        if (date) {
            if (validUnixTimestamps) {
                for (const t of validUnixTimestamps) {
                    const finnhub = moment.unix(t).utc();
                    if (finnhub.isSame(date, 'day')) { return false; };
                };
                return true;
            };
        };
        return false;
    };

    return <React.Fragment>
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <Grid container spacing={1} alignItems="center">
                <Grid item>
                    <Typography variant="subtitle2">{(value as Moment)?.utc().format('l')}</Typography>
                </Grid>
                <Grid item>
                    <CalendarTodayIcon onClick={onClick} />
                </Grid>
            </Grid>
            <Popover
                open={!!anchorEl}
                onClose={onClose}
                anchorEl={anchorEl}
            >
                <MuiDatePicker
                    {...props}
                    variant="static"
                    format="MM/DD/YYYY"
                    margin="normal"
                    disableFuture={true}
                    disableToolbar={true}
                    data-testid="datepicker"
                    shouldDisableDate={shouldDisableDateHandler}
                />
            </Popover>
        </MuiPickersUtilsProvider>
    </React.Fragment>;
};