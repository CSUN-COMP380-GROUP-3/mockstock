import React from 'react';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import StartAdornment from '../StartAdornment/StartAdornment';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
        width: '100%',
        '& input': {
            paddingTop: ".5rem",
            paddingBottom: ".5rem"
        }
    },
});

export type InputProps = { adornment?: string } & TextFieldProps;

export default function Input(props: InputProps) {
    const classes = useStyles();
    const { id, adornment } = props;
    const getInputProps = () => {
        if (!!adornment) {
            return {
                startAdornment: <StartAdornment adornment={adornment}></StartAdornment>
            };
        };
        return undefined;
    };
    return (
        <TextField
            {...props}
            InputProps={getInputProps()}
            data-testid={"input-"+id}
            variant="outlined"
            className={classes.root}
        />
    );
};