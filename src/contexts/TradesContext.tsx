import React from 'react';
import Trade from '../interfaces/Trade';
import moment, { Moment } from 'moment';

export type TradesInterface = Trade[];

export interface TradesProviderInterface {
    trades: TradesInterface;
    updateTrades: (trades: TradesInterface) => void;
    addToTrades: (trade: Trade) => boolean;
    filterBySymbol: (symbol?: string) => Trade[];
    getEarliestDateBySymbol: (symbol?: string) => Moment;
    earliestDate: Moment;
}

/**
 * TradesProvider is meant to be a wrapper around the trades state. When the global
 * state is created its reference and update function are placed in the TradesProvider's
 * trades and updateTrades properties, respectively. Doing so allows all the logic related
 * to trades be handled within this exported instance on line 114.
 */
class TradesProvider implements TradesProviderInterface {
    trades: TradesInterface;
    updateTrades: (trades: TradesInterface) => void;
    constructor() {
        let fromLocal = localStorage.getItem('tradeHistory');
        let localObject;
        if (!!fromLocal) {
            localObject = JSON.parse(fromLocal!);
        }
        this.trades = [];
        let here = [];
        if (!!localObject) {
            for (var i in localObject) {
                let hold: Trade = {
                    date: moment(localObject[i]['date']),
                    stock: localObject[i]['stock'],
                    total: Number(localObject[i]['total']),
                    timestamp: moment(localObject[i]['timestamp']),
                    type: localObject[i]['type'],
                    price: Number(localObject[i]['price']),
                };
                here.push(hold);
            }
            this.trades = here;
        }
        this.updateTrades = () => {};
    }

    /**
     * Makes a copy of the current trades, unshifts the trade unto copy
     * and updates with the copy
     * @param trade Trade to be added to trades object
     * @returns
     */
    addToTrades(trade: Trade): boolean {
        const newTrades = [...this.trades];
        newTrades.unshift(trade);
        this.updateTrades(newTrades);
        return true;
    }

    /**
     * Takes a unique stock by symbol and returns an array of Trades, filtered
     * by the symbol
     * @param symbol The stock's unique identifier
     */
    filterBySymbol(symbol?: string) {
        if (!!symbol) {
            return this.trades.filter(({ stock }) => stock.symbol === symbol);
        }
        return this.trades;
    }

    /**
     * Returns the earliest trade, filtered by symbol as a Moment object
     * @param symbol The stock's unique identifier
     */
    getEarliestDateBySymbol(symbol?: string): Moment {
        return this.filterBySymbol(symbol).reduce((acc, { date, type }) => {
            if (type === 'BUY') {
                if (!!acc) {
                    acc = date.isBefore(acc) ? date : acc;
                } else {
                    // SELL
                    acc = date;
                }
            }
            return acc;
        }, null as any);
    }

    get earliestDate() {
        return this.getEarliestDateBySymbol();
    }
}

export const tradesProvider = new TradesProvider();

// TODO: initialize the trades from localStorage

export const TradesContext = React.createContext<TradesInterface>(
    tradesProvider.trades,
);
