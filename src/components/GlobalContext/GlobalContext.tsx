// we store and initialize all of the contexts necessary throughout the application
import React from 'react';
import { TokenContext, TOKEN } from '../../contexts/TokenContext';
import { StockSymbolsContext, filteredSymbols } from '../../contexts/StockSymbolsContext';
import { initLiquidBalanceContext, LiquidBalanceContext, LiquidBalanceInterface } from '../../contexts/LiquidBalanceContext';
import { initWatchListContext, WatchListContext, WatchListInterface } from '../../contexts/WatchListContext';
import { initTradesContext, TradesContext, TradesInterface } from '../../contexts/TradesContext';
import { ActiveStockContext, ActiveStockInterface, initActiveStockContext } from '../../contexts/ActiveStockContext';


export const GlobalContext: React.FC = ({children}) => {
    const [liquidBalance, updateLiquidBalance] = React.useState<LiquidBalanceInterface>(initLiquidBalanceContext.liquidBalance);
    const liquidBalanceProviderValue = { liquidBalance, updateLiquidBalance };

    const [activeStock, updateActiveStock] = React.useState<ActiveStockInterface>(initActiveStockContext.activeStock);
    const activeStockProviderValue = { activeStock, updateActiveStock };

    const [ watchList, updateWatchList ] = React.useState<WatchListInterface>(initWatchListContext.watchList);
    const watchListProviderValue = { watchList, updateWatchList };

    const [ trades, updateTrades ] = React.useState<TradesInterface>(initTradesContext.trades);
    const tradesProviderValue = { trades, updateTrades };

    return <React.Fragment>
        <TokenContext.Provider value={TOKEN}>
            <TradesContext.Provider value={tradesProviderValue}>
                <StockSymbolsContext.Provider value={filteredSymbols}>
                    <LiquidBalanceContext.Provider value={liquidBalanceProviderValue}>
                        <ActiveStockContext.Provider value={activeStockProviderValue}>
                            <WatchListContext.Provider value={watchListProviderValue}>
                                {children}
                            </WatchListContext.Provider>
                        </ActiveStockContext.Provider>
                    </LiquidBalanceContext.Provider>
                </StockSymbolsContext.Provider>
            </TradesContext.Provider>
        </TokenContext.Provider>
    </React.Fragment>
};
