import React from 'react';
import moment, { Moment } from 'moment';
import StockSymbolData from '../interfaces/StockSymbolData';
import { filteredSymbols } from './StockSymbolsContext';
import WebSocketData from '../interfaces/WebSocketData';

export interface WatchListInterface {
    stocks: {
        [key: string]: WatchListData,
    },
    lastUpdated: Moment;
};

export type WatchListData = (StockSymbolData & Partial<WebSocketData>);

export interface WatchListContextInterface {
    watchList: WatchListInterface;
    updateWatchList: (watchList: WatchListInterface) => void;
};

export const initWatchListContext: WatchListContextInterface = {
    watchList: {
        stocks: {
            "GME": filteredSymbols.find(stock => stock.symbol === 'GME')!,
            "AMC": filteredSymbols.find(stock => stock.symbol === 'AMC')!,
            "BB": filteredSymbols.find(stock => stock.symbol === 'BB')!,
            "AAPL": filteredSymbols.find(stock => stock.symbol === 'AAPL')!,
            "TSLA": filteredSymbols.find(stock => stock.symbol === 'TSLA')!,
            "AMD": filteredSymbols.find(stock => stock.symbol === 'AMD')!,
            "INTC": filteredSymbols.find(stock => stock.symbol === 'INTC')!,
            
        },
        lastUpdated: moment(),
    },
    updateWatchList: () => {},
};

export const WatchListContext = React.createContext<WatchListContextInterface>(initWatchListContext);