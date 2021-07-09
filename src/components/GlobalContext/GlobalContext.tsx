// we store and initialize all of the contexts necessary throughout the application
import React from 'react';
import { TokenContext, TOKEN } from '../../contexts/TokenContext';
import { StockSymbolsContext, filteredSymbols } from '../../contexts/StockSymbolsContext';
import { WatchListContext, WatchListTracker, WatchListInterface } from '../../contexts/WatchListContext';
import { activeStockProvider, ActiveStockContext, ActiveStockInterface } from '../../contexts/ActiveStockContext';

export const GlobalContext: React.FC = ({ children }) => {
    const [activeStock, updateActiveStock] = React.useState<ActiveStockInterface>(activeStockProvider.activeStock);
    activeStockProvider.activeStock = activeStock;
    activeStockProvider.updateActiveStock = updateActiveStock;

    const [watchList, updateWatchList] = React.useState<WatchListInterface>(WatchListTracker.WatchList);
    const watchListProviderValue = { watchList, updateWatchList };

    return <React.Fragment>
        <TokenContext.Provider value={TOKEN}>
                <StockSymbolsContext.Provider value={filteredSymbols}>
                    <ActiveStockContext.Provider value={activeStock}>
                        <WatchListContext.Provider value={watchListProviderValue}>
                            {children}
                        </WatchListContext.Provider>
                    </ActiveStockContext.Provider>
                </StockSymbolsContext.Provider>
        </TokenContext.Provider>
    </React.Fragment>
};
