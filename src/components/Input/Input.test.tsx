import React from 'react';
import { render } from '@testing-library/react';
import Input, { InputProps } from './Input';

describe('Input component', () => {
    const props: InputProps = { id: 'test', label: 'test', value: 'test' };

    it('renders correctly', () => {
        const { queryByTestId, queryByLabelText, queryByDisplayValue } = render(<Input {...props}/>);

        const component = queryByTestId('input-test');
        expect(component).toBeTruthy();
        expect(queryByLabelText('test')).toBeTruthy();
        expect(queryByDisplayValue('test')).toBeTruthy();
    });

    it('renders adornments', () => {
        const props: InputProps = { id: 'test', label: 'test' };
        const adornment = '$';
        const { rerender, queryAllByText } = render(<Input {...props}/>);
        expect(queryAllByText(adornment)[0]).toBeFalsy();

        rerender(<Input {...props} adornment={adornment}/>);
        expect(queryAllByText(adornment)[0]).toBeTruthy();
    });
});