import React from 'react';
import Trade from '../interfaces/Trade';
import currency from 'currency.js';
import { Moment } from 'moment';

export type TradesInterface = Trade[];

export interface TradesContextInterface {
    trades: TradesInterface;
    updateTrades: (trades: TradesInterface) => void;
    filterBySymbol: (symbol?: string) => Trade[];
    getTotalSharesBySymbol: (symbol?: string) => number;
    getTotalAmountBySymbol: (symbol?: string) => currency;
    getEarliestDateBySymbol: (symbol?: string) => Moment;
    totalShares: number;
    totalAmount: currency;
    earliestDate: Moment;
};

export class TradesProviderValue implements TradesContextInterface {
    trades: TradesInterface;
    updateTrades: (trades: TradesInterface) => void;
    constructor() { 
        this.trades = [];
        this.updateTrades = () => {};
    };

    filterBySymbol(symbol?: string) {
        if (!!symbol) {
            return this.trades.filter(({stock}) => stock.symbol === symbol);
        };
        return this.trades;
    };
    getTotalAmountBySymbol(symbol?: string): currency {
        return this.filterBySymbol(symbol)
            .reduce((acc, { total, type }) => {
                if (type === 'BUY') {
                    acc = acc.add(total);
                } else {
                    // SELL
                    acc = acc.subtract(total);
                };
                return acc;
            }, currency(0));
    };

    getTotalSharesBySymbol(symbol?: string): number {
        return this.filterBySymbol(symbol)
            .reduce((acc, { total, price, type }) => {
                const shares = total.value / price!.value;
                if (type === 'BUY') {
                    acc += shares
                } else {
                    // SELL
                    acc -= shares
                };
                return acc;
            }, 0);
    };

    getEarliestDateBySymbol(symbol?: string): Moment {
        return this.filterBySymbol(symbol)
            .reduce((acc, { date, type }) => {
                if (type === 'BUY') {
                    if (!!acc) {
                        acc = date.isBefore(acc) ? date : acc;
                    } else {
                        // SELL
                        acc = date;
                    };
                };
                return acc;
            }, null as any);
    };

    get totalShares() {
        return this.getTotalSharesBySymbol();
    };

    get totalAmount() {
        return this.getTotalAmountBySymbol();
    };

    get earliestDate() {
        return this.getEarliestDateBySymbol();
    };
};

export const tradesProviderValue = new TradesProviderValue();

// TODO: initialize the trades from localStorage

export const TradesContext = React.createContext<TradesContextInterface>(tradesProviderValue);

