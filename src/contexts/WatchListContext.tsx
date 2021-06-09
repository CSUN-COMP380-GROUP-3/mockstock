import React from 'react';
import moment, { Moment } from 'moment';
import StockSymbolData from '../interfaces/StockSymbolData';
import { filteredSymbols } from './StockSymbolsContext';
import WebSocketData from '../interfaces/WebSocketData';

export interface WatchListInterface {
    stocks: {
        [key: string]: (StockSymbolData & Partial<WebSocketData>)
    },
    lastUpdated: Moment;
};

export interface WatchListContextInterface {
    watchList: WatchListInterface;
    updateWatchList: (watchList: WatchListInterface) => void;
};

export const initWatchListContext: WatchListContextInterface = {
    watchList: {
        stocks: {
            "GME": filteredSymbols.find(stock => stock.symbol === 'GME')!,
            "AMC": filteredSymbols.find(stock => stock.symbol === 'AMC')!
        },
        lastUpdated: moment(),
    },
    updateWatchList: () => {},
};

export const WatchListContext = React.createContext<WatchListContextInterface>(initWatchListContext);