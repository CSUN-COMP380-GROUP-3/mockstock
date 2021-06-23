import React from 'react';
import moment, { Moment } from 'moment';
import StockSymbolData from '../interfaces/StockSymbolData';
import CandleStickData from '../interfaces/CandleStickData';
import initCandles from '../initCandles.json';
import { filteredSymbols } from './StockSymbolsContext';
import { maxDate, minDate } from '../components/DatePicker/DatePicker';
import { QuoteData } from '../interfaces/QuoteData';
import { errorHandler, fetchQuote, fetchCandles } from '../components/utils';
import { TOKEN } from './TokenContext';
import { resolve } from 'url';

// ActiveStock is mainly consumed by the GraphBox
// When the ActiveStock context changes then the GraphBox would need to be updated with new information
// When a user selects a symbol from the WatchList or Portfolio then this context must be updated as well
// When the ActiveSTock context changes then the TradeBox must also be updated

export interface ActiveStockInterface {
    stock: StockSymbolData;
    from: Moment; // from and to are the date range of the candle data
    to: Moment;
    quote: QuoteData;
    candles: CandleStickData;
};

export interface ActiveStockContextInterface {
    activeStock: ActiveStockInterface;
    updateActiveStock: (activeStock: ActiveStockInterface) => void;
}

export const initSymbol = process.env.REACT_APP_INITIAL_STOCK || 'GME';

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