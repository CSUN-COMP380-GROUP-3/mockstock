import React, { ChangeEventHandler } from 'react';
import TextField from '@material-ui/core/TextField';
import StartAdornment from '../StartAdornment/StartAdornment';

export interface InputProps {
    id: string;
    label: string;
    required?: boolean;
    defaultValue?: string;
    helperText?: string;
    variant?: 'filled' | 'outlined' | 'standard';
    inputProps?: {[key: string]: string} // must be valid HTML5 input attributes!
    adornment?: string;
    value?: string;
    onChange?: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> | undefined;
};

export default function Input(props: InputProps) {
    const { required, id, label, helperText, variant, inputProps, adornment, value, onChange } = props;
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
            helperText={helperText}
            variant={variant}
            inputProps={inputProps}
            InputProps={getInputProps()}
            value={value}
            onChange={onChange}
            data-testid={"input-"+id}
        />
    );
};