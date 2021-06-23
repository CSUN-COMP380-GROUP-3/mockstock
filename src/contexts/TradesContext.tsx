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
};

export const initTradesContext: TradesContextInterface = {
    trades: [],
    updateTrades: () => {},
    filterBySymbol: function(symbol?: string) {
        if (!!symbol) {
            return this.trades.filter(({stock}) => stock.symbol === symbol);
        };
        return this.trades;
    },
    getTotalSharesBySymbol: function(symbol?: string): number {
        return this.filterBySymbol(symbol)
            .reduce((acc, { total, price, type }) => {
                const shares = total.value / price!.value;
                return acc += shares;
            }, 0);
    },
    getTotalAmountBySymbol: function(symbol?: string): currency {
        return this.filterBySymbol(symbol)
            .reduce((acc, { total, type }) => {
                return acc.add(total);
            }, currency(0));
    },
    getEarliestDateBySymbol: function(symbol?: string): Moment {
        return this.filterBySymbol(symbol)
            .reduce((acc, { date, type }) => {
                if (type === 'BUY') {
                    if (!!acc) {
                        acc = date.isBefore(acc) ? date : acc;
                    } else {
                        acc = date;
                    };
                };
                return acc;
            }, null as any);
    }
};

export const TradesContext = React.createContext<TradesContextInterface>(initTradesContext);

