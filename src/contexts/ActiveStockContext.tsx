import React from 'react';
import { Moment } from 'moment';
import StockSymbolData from '../interfaces/StockSymbolData';
import CandleStickData from '../interfaces/CandleStickData';
import { filteredSymbols } from './StockSymbolsContext';
import { maxDate, minDate } from '../components/DatePicker/DatePicker';
import { QuoteData } from '../interfaces/QuoteData';
import { fetchQuote, fetchCandles } from '../components/utils';
import { TOKEN } from './TokenContext';

// ActiveStock provides data about the stock currently being displayed on the left-side of the screen.
// ActiveStock provides two essential pieces of information, Candlestick Information and Quote Information.
// The ActiveStock is only expected to change ONCE every time the user chooses a new symbol to view.

/**The type that ActiveStock's active stock should follow */
export interface ActiveStockInterface {
    stock: StockSymbolData;
    from: Moment; // from and to are the date range of the candle data
    to: Moment;
    quote: QuoteData;
    candles: CandleStickData;
};

/**The interface used in Global Context to set up a component's state */
export interface ActiveStockContextInterface {
    activeStock: ActiveStockInterface;
    updateActiveStock: (activeStock: ActiveStockInterface) => void;
}

/**The initial Symbol to load up when first visiting the site */
export const initSymbol = process.env.REACT_APP_INITIAL_STOCK || 'GME';

/**
 * Given the stock information and date ranges, sends requests to Finnhub's Candlestick and Quote Endpoints and returns their results.
 * @param stock stock object obtained from SymbolBox
 * @param from Moment object from "From" Date Picker
 * @param to Moment object from "To" Date Picker
 * @returns An up-to-date instance of the Active Stock.
 */
export const getStockInfoForFrom = async (stock: StockSymbolData, from: Moment, to: Moment) => {
    console.log(`Requesting Stock Info for ${stock.symbol}`);

    const candlePromise = fetchCandles({
        symbol: stock.symbol,
        from: from.unix(),
        to: to.unix(),
        resolution: 'D',
        token: TOKEN,
    });

    const quotePromise = fetchQuote({
        symbol: stock.symbol,
        token: TOKEN
    });
    return new Promise<ActiveStockInterface>((resolve, reject) => {
        Promise.all([candlePromise, quotePromise]).then(([candleResponse, quoteResponse]) => {
            const newActiveStockInfo = {
                stock: stock,
                from: from,
                to: to,
                quote: quoteResponse.data,
                candles: candleResponse.data,
            }
            console.log(`Retrieved Stock Info:`);
            console.log(newActiveStockInfo);
            resolve(newActiveStockInfo);
        })
    })
}

/**The initial value for the Active Stock State. Initially filled with dummy values and is expected to be filled during System initialization */
export const initActiveStockContext: ActiveStockContextInterface = {
    activeStock: {
        stock: filteredSymbols.find(s => s.symbol === initSymbol) || filteredSymbols[0],
        from: minDate,
        to: maxDate,
        quote: { o: 1, h: 1, l: 1, c: 1, pc: 1 },
        candles: { c: [], h: [], l: [], o: [], s: "", v: [], t: [] }
    },
    updateActiveStock: () => { }
};

export const ActiveStockContext = React.createContext<ActiveStockContextInterface>(initActiveStockContext);