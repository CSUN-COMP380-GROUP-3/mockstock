import React from 'react';
import Trade from '../interfaces/Trade';
import currency from 'currency.js';
import { Moment } from 'moment';

export type TradesInterface = Trade[];

export interface TradesContextInterface {
    trades: TradesInterface;
    updateTrades: (trades: TradesInterface) => void;
    addToTrades: (trade: Trade) => boolean;
    filterBySymbol: (symbol?: string) => Trade[];
    getTotalSharesBySymbol: (symbol?: string) => number;
    getTotalAmountBySymbol: (symbol?: string) => currency;
    getEarliestDateBySymbol: (symbol?: string) => Moment;
    totalShares: number;
    totalAmount: currency;
    earliestDate: Moment;
}

/**
 * TradesProvider is meant to be a wrapper around the trades state. When the global
 * state is created its reference and update function are placed in the TradesProvider's
 * trades and updateTrades properties, respectively. Doing so allows all the logic related
 * to trades be handled within this exported instance on line 114.
 */
class TradesProvider implements TradesContextInterface {
    trades: TradesInterface;
    updateTrades: (trades: TradesInterface) => void;
    constructor() {
        this.trades = [];
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
     * Returns the total sum of all the trades filtered by symbol as a currency object
     * @param symbol The stock's unique identifier
     */
    getTotalAmountBySymbol(symbol?: string): currency {
        return this.filterBySymbol(symbol).reduce((acc, { total, type }) => {
            if (type === 'BUY') {
                acc = acc.add(total);
            } else {
                // SELL
                acc = acc.subtract(total);
            }
            return acc;
        }, currency(0));
    }

    /**
     * Returns the total number of shares filtered by symbol
     * @param symbol The stock's unique identifier
     * @returns
     */
    getTotalSharesBySymbol(symbol?: string): number {
        return this.filterBySymbol(symbol).reduce(
            (acc, { total, price, type }) => {
                const shares = total / price!;
                if (type === 'BUY') {
                    acc += shares;
                } else {
                    // SELL
                    acc -= shares;
                }
                return acc;
            },
            0,
        );
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

    get totalShares() {
        return this.getTotalSharesBySymbol();
    }

    get totalAmount() {
        return this.getTotalAmountBySymbol();
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
