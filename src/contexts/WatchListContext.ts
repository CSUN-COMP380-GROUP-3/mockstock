import { BehaviorSubject } from 'rxjs';
import storage from '../components/storage';

export interface WatchListInterface { [symbol: string]: number };

export interface WatchListContextInterface {
    watchList: WatchListInterface;
    updateWatchList: (watchList: WatchListInterface) => void;
};

export module WatchListTracker {
    const STORAGE_KEY = 'watchList';

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
        let loadWatchList = {
            'GME': 0,
            'AMC': 0,
            'BB': 0,
            'AMD': 0,
            'INTC': 0,
            'AAPL': 0,
            'TSLA': 0
        };

        const fromStorage = storage?.getItem(STORAGE_KEY);
        if (!!fromStorage) {
            try {
                const parsedWatchList = JSON.parse(fromStorage);
                if (!!parsedWatchList) { loadWatchList = parsedWatchList };
            } catch(e) {
                console.log('Failed to load watchlist from storage');
            };
        };
        const temp = Object.keys(loadWatchList);
        temp.forEach((symbol) => {
            WatchList[symbol] = 0;
        });
    }

    initWatchList();

    export const WatchList$ = new BehaviorSubject(WatchList);

    const exportToStorage = (watchList: WatchListInterface): void => {
        const watchListStr = JSON.stringify(watchList);
        storage?.setItem(STORAGE_KEY, watchListStr);
    };

    /**
     * Adds the given symbol to the WatchList.
     * @param symbol The symbol to add
     * @returns The newly updated WatchList to update the Watchlist state.
     */
    export const addToWatchList = (symbol: string) => {
        if (!has(symbol)) {
            WatchList[symbol] = 0;
        } else {
            console.warn("System tried to add a symbol to the Watchlist that is already on the watchlist!");
        }
        const newWatchList = Object.assign({}, WatchList);
        exportToStorage(newWatchList);
        WatchList$.next(newWatchList);
    }

    /**
     * Removes the given symbol from the Watchlist.
     * @param symbol The symbol to remove
     * @returns The newly updated WatchList to update the WatchList state.
     */
    export const removeFromWatchList = (symbol: string) => {
        if (has(symbol)) {
            delete WatchList[symbol];
        } else {
            console.warn("System tried to remove a symbol from the Watchlist that was not already in the watchlist!")
        }
        const newWatchList = Object.assign({}, WatchList);
        exportToStorage(newWatchList);
        WatchList$.next(newWatchList);
    }

    /**
     *  Checks if a given symbol is currently in the WatchList
     */
    export const has = (symbol: string): boolean => {
        return WatchList[symbol] !== undefined;
    };
}