import React from 'react';

export interface WatchListInterface {
    stockSymbols: string[];
};

export interface WatchListContextInterface {
    watchList: WatchListInterface;
    updateWatchList: (watchList: WatchListInterface) => void;
};

export const initWatchListContext: WatchListContextInterface = {
    watchList: {
        stockSymbols: [
            'GME',
            'AMC',
            'BB',
            'AMD',
            'INTC',
            'AAPL',
            'TSLA',
        ]
    },
    updateWatchList: (newWatchList: WatchListInterface) => {
        initWatchListContext.watchList = newWatchList;
    }
};

export const WatchListContext = React.createContext<WatchListContextInterface>(initWatchListContext);