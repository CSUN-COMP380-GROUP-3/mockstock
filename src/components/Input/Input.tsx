import React from 'react';
import TextField from '@material-ui/core/TextField';
import StartAdornment from '../StartAdornment/StartAdornment';

export interface InputProps {
    required?: boolean;
    defaultValue?: string;
    id: string;
    label: string;
    helperText?: string;
    variant: 'filled' | 'outlined' | 'standard' | undefined
    inputProps?: {[key: string]: string} // must be valid HTML5 input attributes!
    adornment?: string;
    value: string;
    onChange: any; // bad
};

export default function Input(props: InputProps) {
    const { required, id, label, helperText, defaultValue, variant, inputProps, adornment, value, onChange } = props;
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
            required={!!required}
            id={id}
            label={label}
            defaultValue={defaultValue}
            helperText={helperText}
            variant={variant}
            inputProps={inputProps}
            InputProps={getInputProps()}
            value={value}
            onChange={onChange}
        />
    );
};