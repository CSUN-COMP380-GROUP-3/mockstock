import React from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';

export interface StartAdornmentProps {
    adornment: string;
};

export default function StartAdornment(props: StartAdornmentProps) {
    const { adornment } = props;
    return (
        <InputAdornment data-testid="startadornment" position="start">{adornment}</InputAdornment>
    );
};