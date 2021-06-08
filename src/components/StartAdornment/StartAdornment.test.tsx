import React from 'react';
import { render } from '@testing-library/react';
import StartAdornment from './StartAdornment';

describe('StartAdornment Component', () => {
    const adornment = '$';
    const { queryByTestId } = render(<StartAdornment adornment={adornment}/>);
    const component = queryByTestId('startadornment');
    it('renders correctly', () => {
        expect(component).toBeTruthy();
        expect(component!.textContent).toEqual(adornment);
    });
});