import React from 'react';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import StartAdornment from '../StartAdornment/StartAdornment';

export type InputProps = { adornment?: string } & TextFieldProps;

export default function Input(props: InputProps) {
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
        />
    );
};