import React from 'react';

export interface WatchListInterface { [symbol: string]: number };

export interface WatchListContextInterface {
    watchList: WatchListInterface;
    updateWatchList: (watchList: WatchListInterface) => void;
};

export module WatchListTracker {

    /**
     * Keeps track of what symbols are on the watchlist. 
     * Is supposed to be a copy of what's in local storage
     * @todo not sure what the number is supposed to represent? We can maybe use it as a timestamp for when it was added?
     */
    export const WatchList: WatchListInterface = {};

    /**
     * Gets the Watchlist from localstorage
     * @todo Obtain Watchlist from localstorage
     */
    const initWatchList = function () {
        // TODO: obtain watchlist from localstorage.
        let temp = Object.keys({
            'GME': 0,
            'AMC': 0,
            'BB': 0,
            'AMD': 0,
            'INTC': 0,
            'AAPL': 0,
            'TSLA': 0
        });
        temp.forEach((symbol) => {
            WatchList[symbol] = 0;
        })
    }

    initWatchList();

    /**
     * Contains the initial symbols found in the user's Watchlist and the state's update function.
     */
    export const initWatchListContext: WatchListContextInterface = {
        watchList: WatchList,
        updateWatchList: function () { },
    };

    /**
     * Adds the given symbol to the WatchList.
     * @param symbol The symbol to add
     * @returns The newly updated WatchList to update the Watchlist state.
     */
    export const addToWatchList = (symbol: string) => {
        if (WatchList[symbol] === undefined) {
            WatchList[symbol] = 0;
        } else {
            console.warn("System tried to add a symbol to the Watchlist that is already on the watchlist!");
        }
        let shittyWatchList: WatchListInterface = {};
        Object.assign(shittyWatchList, WatchList);
        return shittyWatchList;
    }

    /**
     * Removes the given symbol from the Watchlist.
     * @param symbol The symbol to remove
     * @returns The newly updated WatchList to update the WatchList state.
     */
    export const removeFromWatchList = (symbol: string) => {
        if (WatchList[symbol] !== undefined) {
            delete WatchList[symbol];
        } else {
            console.warn("System tried to remove a symbol from the Watchlist that was not already in the watchlist!")
        }
        let shittyWatchList: WatchListInterface = {};
        Object.assign(shittyWatchList, WatchList);
        return shittyWatchList;
    }
}

export const WatchListContext = React.createContext(WatchListTracker.initWatchListContext);