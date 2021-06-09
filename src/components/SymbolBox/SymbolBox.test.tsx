import React from 'react';
import TextField from '@material-ui/core/TextField';
import { render } from '@testing-library/react';
import SymbolBox, { getOptionLabel, groupBy } from './SymbolBox';

fdescribe('SymbolBox component', () => {
    const options = [
        {
            "currency":"USD",
            "description":"GAMESTOP CORP-CLASS A",
            "displaySymbol":"GME",
            "figi":"BBG000BB5BF6",
            "mic":"XNYS",
            "symbol":"GME",
            "type":"Common Stock"
        }
    ];
    const label = 'Stock Symbol';
    const variant = 'outlined';

    it('renders correctly', () => {
        const { queryByTestId, queryByLabelText } = render(
            <SymbolBox
                options={options}
                renderInput={(params) => <TextField {...params} variant={variant} label={label}/>}
                getOptionLabel={getOptionLabel}
                groupBy={groupBy}
            />
        );
        expect(queryByTestId('symbolbox')).toBeTruthy();
        expect(queryByLabelText(label)).toBeTruthy();
    });
});