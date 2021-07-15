import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import LiquidBalance from './LiquidBalance';
import { liquidBalanceProvider } from '../../contexts/LiquidBalanceContext';
import currency from 'currency.js';
import { act } from 'react-dom/test-utils';

describe('LiquidBalance Component', () => {
    let container: RenderResult;
    beforeEach(() => {
        container = render(<LiquidBalance />);
    })
    it('should render correctly', () => {
        const { queryByTestId } = container;
        expect(queryByTestId('liquidbalance')).toBeTruthy();
    });

    it('should display dollar values', () => {
        const { queryByTestId } = container;
        expect(queryByTestId('liquidbalance-cash')?.textContent?.startsWith('$')).toBeTruthy();
    });

    it('should label as "Funds Available"', () => {
        const { queryByTestId } = container;
        expect(queryByTestId('liquidbalance-label')?.textContent?.startsWith('Funds Available')).toBeTruthy();
    });

    it('should update on new balance', () => {
        const { queryByTestId } = container;
        const prevBalance = liquidBalanceProvider.balance;
        let displayedBalance = queryByTestId('liquidbalance-cash')?.textContent;
        expect(currency(prevBalance).value).toEqual(currency(displayedBalance!).value);
        const newBalance = 50000;
        act(() => {
            liquidBalanceProvider.updateLiquidBalance(newBalance);
        });
        displayedBalance = queryByTestId('liquidbalance-cash')?.textContent;
        expect(currency(newBalance).value).toEqual(currency(displayedBalance!).value);
    });

});