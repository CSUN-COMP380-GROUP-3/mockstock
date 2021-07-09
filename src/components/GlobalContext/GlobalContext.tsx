// we store and initialize all of the contexts necessary throughout the application
import React from 'react';
import { TokenContext, TOKEN } from '../../contexts/TokenContext';
import { StockSymbolsContext, filteredSymbols } from '../../contexts/StockSymbolsContext';
import { WatchListContext, WatchListTracker, WatchListInterface } from '../../contexts/WatchListContext';

export const GlobalContext: React.FC = ({ children }) => {

    const [watchList, updateWatchList] = React.useState<WatchListInterface>(WatchListTracker.WatchList);
    const watchListProviderValue = { watchList, updateWatchList };

    return <React.Fragment>
        <TokenContext.Provider value={TOKEN}>
            <StockSymbolsContext.Provider value={filteredSymbols}>
                <WatchListContext.Provider value={watchListProviderValue}>
                    {children}
                </WatchListContext.Provider>
            </StockSymbolsContext.Provider>
        </TokenContext.Provider>
    </React.Fragment>
};
