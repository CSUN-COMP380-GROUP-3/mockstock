import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import LiquidBalance from './LiquidBalance';
import { LiquidBalanceContext, LiquidBalanceContextInterface, LiquidBalanceInterface } from '../../contexts/LiquidBalanceContext';
import currency from 'currency.js';

function updateLiquidBalance(balance: LiquidBalanceInterface) {
    // @ts-ignore
    this.liquidBalance = balance;
};

describe('LiquidBalance component', () => {
    
    it('renders correctly', () => {
        const { queryByTestId } = render(<LiquidBalance />);
        expect(queryByTestId('liquidbalance')).toBeTruthy();
    });

    describe('it consumes context', () => {
        let renderResult: RenderResult;
        let value: LiquidBalanceContextInterface = {
            liquidBalance: {
                curr: currency(100),
                prev: currency(100),
            },
            updateLiquidBalance: updateLiquidBalance.bind(this),
        };

        beforeEach(() => {
            renderResult = render(
                <LiquidBalanceContext.Provider value={value}>
                    <LiquidBalance></LiquidBalance>
                </LiquidBalanceContext.Provider>
            );
        });

        it('shows cash value', () => {
            const { queryByTestId } = renderResult;
            const content = queryByTestId('liquidbalance-cash')?.textContent;
            expect(content).toEqual('$100.00');
            expect(content?.startsWith('$')).toBeTruthy();
        });

        it('shows percent value', () => {
            const { queryByTestId } = renderResult;
            const content = queryByTestId('liquidbalance-percent')?.textContent;
            expect(content).toEqual('0.00%');
            expect(content?.endsWith('%')).toBeTruthy();
        });

        it('shows profit value', () => {
            const { queryByTestId } = renderResult;
            const content = queryByTestId('liquidbalance-profit')?.textContent;
            expect(content).toEqual('$0.00');
            expect(content?.startsWith('$')).toBeTruthy();
        });
    });


});