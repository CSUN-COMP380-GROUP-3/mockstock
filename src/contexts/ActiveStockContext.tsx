import React from 'react';
import moment, { Moment } from 'moment';
import StockSymbolData from '../interfaces/StockSymbolData';
import CandleStickData from '../interfaces/CandleStickData';
import { filteredSymbols } from './StockSymbolsContext';
import { maxDate, minDate } from '../components/DatePicker/DatePicker';
import { QuoteData } from '../interfaces/QuoteData';
import { fetchQuote, fetchCandles, errorHandler } from '../components/utils';
import { TOKEN } from './TokenContext';
import { AxiosResponse } from 'axios';
import { NoDataError } from '../components/errors';
import currency from 'currency.js';
// ActiveStock provides data about the stock currently being displayed on the left-side of the screen.
// ActiveStock provides two essential pieces of information, Candlestick Information and Quote Information.
// The ActiveStock is only expected to change ONCE every time the user chooses a new symbol to view.

/**The initial Symbol to load up when first visiting the site */
export const initSymbol = process.env.REACT_APP_INITIAL_STOCK || 'GME';

/**The type that ActiveStock's active stock should follow */
export interface ActiveStockInterface {
    stock: StockSymbolData;
    quote: QuoteData;
    candles: CandleStickData;
}

/** Interface for the ActiveStockProvider */
export interface ActiveStockProviderInterface {
    activeStock: ActiveStockInterface;
    updateActiveStock: (activeStock: ActiveStockInterface) => void;
    fetchCandlesAndQuoteByStockSymbol: ({
        symbol,
    }: StockSymbolData) => Promise<
        [AxiosResponse<CandleStickData>, AxiosResponse<QuoteData>]
    >;
    fetchCandlesAndQuote: () => Promise<
        [AxiosResponse<CandleStickData>, AxiosResponse<QuoteData>]
    >;
    switchActiveStock: (newStockSymbol: StockSymbolData) => void;
    minDate: Moment | undefined;
    maxDate: Moment | undefined;
    getIndexByTimestamp: (timestamp: number) => number;
    getBuyPriceByTimestamp: (timestamp: number) => number | undefined;
    getBuyPriceByIndex: (index: number) => number | undefined;
    getSellPriceByTimestamp: (timestamp: number) => number | undefined;
    getSellPriceByIndex: (index: number) => number | undefined;
}

/**
 * ActiveStockProvider is meant to be a wrapper around the activeStock state. When the global
 * state is created its reference and update function are placed in the ActiveStockProvider's
 * activeStock and updateActiveStock properties, respectively. The provider allows all logic
 * pertaining to the activeStock be handled within this exported instance on line 224.
 */
class ActiveStockProvider implements ActiveStockProviderInterface {
    activeStock: ActiveStockInterface;
    updateActiveStock: (activeStock: ActiveStockInterface) => void;
    constructor() {
        this.activeStock = {
            stock:
                filteredSymbols.find((s) => s.symbol === initSymbol) ||
                filteredSymbols[0],
            quote: { o: 1, h: 1, l: 1, c: 1, pc: 1 },
            candles: { c: [], h: [], l: [], o: [], s: '', v: [], t: [] },
        };
        this.updateActiveStock = () => { };
        this.initializeData();
    }

    /**
     * Only to be called by the constructor. Will throw an error if anything goes wrong and stops
     * execution. Fetches candlestick and quote data for the initialized symbol.
     *
     * TODO: catch the error and handle it appropriately rather than letting it just block execution
     */
    private initializeData() {
        console.log('initializing data');
        this.fetchCandlesAndQuote().then(([candlesResponse, quoteResponse]) => {
            this.updateActiveStock({
                stock: this.activeStock.stock,
                candles: candlesResponse.data,
                quote: quoteResponse.data,
            });
        });
    }

    /**
     * Fetch the max amount of candles and quote data together of current activeStock.
     * @returns An array of axios responses
     */
    fetchCandlesAndQuote(): Promise<
        [AxiosResponse<CandleStickData>, AxiosResponse<QuoteData>]
    > {
        return this.fetchCandlesAndQuoteByStockSymbol(this.activeStock.stock);
    }

    /**
     * Fetches the max amoutn of candles and quote data together of stockSymbol
     * @param stockSymbol StockSymbolData of the desired stock
     * @returns
     */
    fetchCandlesAndQuoteByStockSymbol({
        symbol,
    }: StockSymbolData): Promise<
        [AxiosResponse<CandleStickData>, AxiosResponse<QuoteData>]
    > {
        const candlePromise = fetchCandles({
            symbol,
            from: minDate.unix(),
            to: maxDate.unix(),
            resolution: 'D',
            token: TOKEN,
        });

        const quotePromise = fetchQuote({
            symbol,
            token: TOKEN,
        });

        return Promise.all([candlePromise, quotePromise]);
    }

    /**
     * Fetches candlestick and quote data first, then update activeStock via updateActiveStock
     *
     * TODO: handle errors appropriately
     * @param newSymbol New desired symbol
     */
    async switchActiveStock(newStockSymbol: StockSymbolData) {
        try {
            const [candlesResponse, quoteResponse] =
                await this.fetchCandlesAndQuoteByStockSymbol(newStockSymbol);
            if (candlesResponse.data.s === 'no_data') {
                throw new NoDataError();
            }
            this.updateActiveStock({
                stock: newStockSymbol,
                quote: quoteResponse.data,
                candles: candlesResponse.data,
            });
        } catch (error) {
            errorHandler(error);

            // should we just retry?
            // await wait(500);
            // await this.switchActiveStock(newSymbol);
        }
    }

    /**
     * Switch the activeStock by stock ticker
     * @param name Desired stock by symbol name
     * @returns
     */
    async switchActiveStockByName(name: string) {
        const newStockSymbol = filteredSymbols.find((s) => s.symbol === name);
        if (newStockSymbol === undefined) return;
        this.switchActiveStock(newStockSymbol);
    }

    /**
     * Finds the matching unix timestamp amongs the candlestick timestamp array and returns it's index
     * @param timestamp Unix timestamp
     * @returns Index of timestamp for candlestick data or -1
     */
    getIndexByTimestamp(timestamp: number): number {
        const targetTimestamp = moment.unix(timestamp);
        targetTimestamp.add(targetTimestamp.utcOffset(), 'minute');
        return this.activeStock.candles.t.findIndex((curr) => {
            const currentTimestamp = moment.unix(curr).utc();
            return currentTimestamp.isSame(targetTimestamp, 'day');
        });
    }

    /**
     * Assumes perfect entry into the market and returns the lowest price at the given timestamp
     * @param timestamp Unix timestamp
     * @returns Buy price
     */
    getBuyPriceByTimestamp(timestamp: number): number | undefined {
        const index = this.getIndexByTimestamp(timestamp);
        return Number(this.getBuyPriceByIndex(index));
    }

    /**
     * Assumes prefect entry into the market and returns the lowest price at the given index
     * @param index Index of the corresponding candlestick
     * @returns Buy price
     */
    getBuyPriceByIndex(index: number): number | undefined {
        if (index === -1) return undefined;
        return Number(this.activeStock.candles.c[index]);
    }

    /**
     * Assumes perfect exit from the market and returns the highest price at the given timestamp
     * @param timestamp Unix timestamp
     * @returns Sell price
     */
    getSellPriceByTimestamp(timestamp: number): number | undefined {
        const index = this.getIndexByTimestamp(timestamp);
        return Number(this.getSellPriceByIndex(index));
    }

    /**
     * Assumes prefect exit from the market and returns the highest price at the given index
     * @param index Index of the corresponding candlestick
     * @returns Sell price
     */
    getSellPriceByIndex(index: number): number | undefined {
        if (index === -1) return undefined;
        return Number(this.activeStock.candles.c[index]);
    }

    /**
     * Gets the earliest possible date to start trading the underlying stock
     */
    get minDate(): Moment | undefined {
        if (this.activeStock.candles.t.length > 0) {
            const firstTimestamp = this.activeStock.candles.t[0];
            return moment.unix(firstTimestamp);
        }
        return undefined;
    }

    /**
     * Gets the latest possible date to stop trading the underlying stock
     */
    get maxDate(): Moment | undefined {
        const candleTimestamps = this.activeStock.candles.t;
        if (candleTimestamps.length > 0) {
            const lastTimestamp = candleTimestamps[candleTimestamps.length - 1];
            return moment.unix(lastTimestamp);
        }
        return undefined;
    }
}

export const activeStockProvider = new ActiveStockProvider();

export const ActiveStockContext = React.createContext<ActiveStockInterface>(
    activeStockProvider.activeStock,
);
