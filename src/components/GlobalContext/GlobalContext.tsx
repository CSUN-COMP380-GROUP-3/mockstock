// we store and initialize all of the contexts necessary throughout the application
import React from 'react';
import { TokenContext, TOKEN } from '../../contexts/TokenContext';
import { StockSymbolsContext, filteredSymbols } from '../../contexts/StockSymbolsContext';
import { initLiquidBalanceContext, LiquidBalanceContext, LiquidBalanceInterface } from '../../contexts/LiquidBalanceContext';
import { WatchListContext, WatchListTracker, WatchListInterface } from '../../contexts/WatchListContext';
import { tradesProviderValue, TradesContext, TradesInterface } from '../../contexts/TradesContext';
import { ActiveStockContext, ActiveStockInterface, initActiveStockContext } from '../../contexts/ActiveStockContext';
import { initPortfolioContext, PortfolioContext, PortfolioInterface } from '../../contexts/PortfolioContext';



export const GlobalContext: React.FC = ({ children }) => {
    const [liquidBalance, updateLiquidBalance] = React.useState<LiquidBalanceInterface>(initLiquidBalanceContext.liquidBalance);
    const liquidBalanceProviderValue = { liquidBalance, updateLiquidBalance };

    const [activeStock, updateActiveStock] = React.useState<ActiveStockInterface>(initActiveStockContext.activeStock);
    const activeStockProviderValue = { activeStock, updateActiveStock };

    const [watchList, updateWatchList] = React.useState<WatchListInterface>(WatchListTracker.WatchList);
    const watchListProviderValue = { watchList, updateWatchList };
    
    const [trades, updateTrades] = React.useState<TradesInterface>(tradesProviderValue.trades);
    tradesProviderValue.trades = trades;
    tradesProviderValue.updateTrades = updateTrades;

    const [ portfolio, updatePortfolio ] = React.useState<PortfolioInterface>(initPortfolioContext.portfolio);
    const stocksProviderValue = { portfolio, updatePortfolio };

    return <React.Fragment>
        <TokenContext.Provider value={TOKEN}>
            <TradesContext.Provider value={tradesProviderValue}>
                <StockSymbolsContext.Provider value={filteredSymbols}>
                    <LiquidBalanceContext.Provider value={liquidBalanceProviderValue}>
                        <ActiveStockContext.Provider value={activeStockProviderValue}>
                            <WatchListContext.Provider value={watchListProviderValue}>
                                <PortfolioContext.Provider value={stocksProviderValue} >
                                    {children}
                                </PortfolioContext.Provider>
                            </WatchListContext.Provider>
                        </ActiveStockContext.Provider>
                    </LiquidBalanceContext.Provider>
                </StockSymbolsContext.Provider>
            </TradesContext.Provider>
        </TokenContext.Provider>
    </React.Fragment>
};
