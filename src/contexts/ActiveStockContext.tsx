import React from 'react';
import moment, { Moment } from 'moment';
import StockSymbolData from '../interfaces/StockSymbolData';
import CandleStickData from '../interfaces/CandleStickData';
import initCandles from '../initCandles.json';
import { filteredSymbols } from './StockSymbolsContext';
import { maxDate, minDate } from '../components/DatePicker/DatePicker';

// ActiveStock is mainly consumed by the GraphBox
// When the ActiveStock context changes then the GraphBox would need to be updated with new information
// When a user selects a symbol from the WatchList or Portfolio then this context must be updated as well
// When the ActiveSTock context changes then the TradeBox must also be updated

export interface ActiveStockInterface {
    stock: StockSymbolData;
    from: Moment; // from and to are the date range of the candle data
    to: Moment;
    candles?: CandleStickData;
};

export interface ActiveStockContextInterface {
    activeStock: ActiveStockInterface;
    updateActiveStock: (activeStock: ActiveStockInterface) => void;
}

const initSymbol = process.env.REACT_APP_INITIAL_STOCK || 'GME';

export const initActiveStockContext: ActiveStockContextInterface = {
    activeStock: {
        stock: filteredSymbols.find(s => s.symbol === initSymbol) || filteredSymbols[0],
        from: minDate,
        to: maxDate,
        candles: initCandles || []
    },
    updateActiveStock: () => {}
};

export const ActiveStockContext = React.createContext<ActiveStockContextInterface>(initActiveStockContext);