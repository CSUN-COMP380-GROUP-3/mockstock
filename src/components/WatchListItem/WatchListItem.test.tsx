import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import WatchListItem from './WatchListItem';
import { WatchListData } from '../../contexts/WatchListContext';
import currency from 'currency.js';

describe('WatchListItem Component', () => {
    const data: Partial<WatchListData> = {
        symbol: 'GME',
        price: currency(100),
    };
    let result: RenderResult;
    beforeEach(() => {
        result = render(
            <WatchListItem data={data as WatchListData}></WatchListItem>
        );
    });

    describe('renders', () => {
        it('symbol', () => {
            const { queryByText } = result;
            expect(queryByText(data.symbol!)).toBeTruthy();
        });
        it('dollar', () => {
            const { queryByTestId } = result;
            const element = queryByTestId('watchlistitem-dollar');
            expect(element).toBeTruthy();
            expect(element?.textContent?.includes("$")).toBeTruthy();
        });
        it('percent', () => {
            const { queryByTestId } = result;
            const element = queryByTestId('watchlistitem-percent');
            expect(element).toBeTruthy();
            expect(element?.textContent?.includes("%")).toBeTruthy();
        });
    });
});