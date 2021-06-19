import React from 'react';

export interface WatchListDataInterface {
    [key: string]: number;
};

export interface WatchListDataContextInterface {
    watchListData: WatchListDataInterface;
    updateWatchListData: (watchListData: WatchListDataInterface) => void;
};

export const initWatchListDataContext: WatchListDataContextInterface = {
    watchListData: {},
    updateWatchListData: () => {}
};

export const WatchListDataContext = React.createContext<WatchListDataContextInterface>(initWatchListDataContext);