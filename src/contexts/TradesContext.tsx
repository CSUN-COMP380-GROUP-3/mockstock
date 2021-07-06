import React from 'react';
import Trade from '../interfaces/Trade';
import moment, { Moment } from 'moment';
import storage from '../components/storage';

export type TradesInterface = Trade[];

export interface TradesProviderInterface {
    trades: TradesInterface;
    updateTrades: (trades: TradesInterface) => void;
    addToTrades: (trade: Trade) => boolean;
    filterBySymbol: (symbol?: string) => Trade[];
    getEarliestDateBySymbol: (symbol?: string) => Moment;
    earliestDate: Moment;
}
const STORAGE_KEY = 'tradeHistory';
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
        this.trades = [];
        this.updateTrades = () => {};
        this.importFromStorage();
    }

    /**
     * Trade history data is a stringified array so we parse and set as trades
     * 
     * TODO: need some way to verify that the stringified array is what we expect
     * it to be. maybe we need to use public/private key and sign and verify similar
     * to how jwt works
     */
    private importFromStorage() {
        let fromLocal = storage?.getItem(STORAGE_KEY);
        if (!!fromLocal) {
            try {
                let localObject = JSON.parse(fromLocal);
                // here is where we can verify
                if (!!localObject) {
                    this.trades = [...localObject];
                }
            } catch(e) {
                console.log('Failed to import trade history from storage');
            }
        }
    };

    /**
     * Stringify the trades array and store in local storage
     * 
     * @param trades - array of Trade objects
     * 
     * TODO: sign before storing in local storage so that we can verify the data
     * is untampered
     */
    private exportToStorage(trades: Trade[]) {
        const tradeHistoryStr = JSON.stringify(trades);
        // here is where we would sign the string
        if (!!tradeHistoryStr) {
            storage?.setItem(STORAGE_KEY, tradeHistoryStr);
        };
    };

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
        this.exportToStorage(newTrades);
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
            const _date = moment.unix(date);
            if (type === 'BUY') {
                if (!!acc) {
                    acc = _date.isBefore(acc) ? _date : acc;
                } else {
                    // SELL
                    acc = _date;
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
