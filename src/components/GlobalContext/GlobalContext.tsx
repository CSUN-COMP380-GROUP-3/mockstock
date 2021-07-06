// we store and initialize all of the contexts necessary throughout the application
import React from 'react';
import { TokenContext, TOKEN } from '../../contexts/TokenContext';
import { StockSymbolsContext, filteredSymbols } from '../../contexts/StockSymbolsContext';
import { liquidBalanceProvider, LiquidBalanceContext } from '../../contexts/LiquidBalanceContext';
import { WatchListContext, WatchListTracker, WatchListInterface } from '../../contexts/WatchListContext';
import { tradesProvider, TradesContext, TradesInterface } from '../../contexts/TradesContext';
import { activeStockProvider, ActiveStockContext, ActiveStockInterface } from '../../contexts/ActiveStockContext';
import { portfolioProvider, PortfolioContext, PortfolioInterface } from '../../contexts/PortfolioContext';

export const GlobalContext: React.FC = ({ children }) => {
    const [liquidBalance, updateLiquidBalance] = React.useState(liquidBalanceProvider.balance);
    liquidBalanceProvider.balance = liquidBalance;
    liquidBalanceProvider.updateLiquidBalance = updateLiquidBalance;

    const [activeStock, updateActiveStock] = React.useState<ActiveStockInterface>(activeStockProvider.activeStock);
    activeStockProvider.activeStock = activeStock;
    activeStockProvider.updateActiveStock = updateActiveStock;

    const [watchList, updateWatchList] = React.useState<WatchListInterface>(WatchListTracker.WatchList);
    const watchListProviderValue = { watchList, updateWatchList };
    
    const [trades, updateTrades] = React.useState<TradesInterface>(tradesProvider.trades);
    tradesProvider.trades = trades;
    tradesProvider.updateTrades = updateTrades;

    const [portfolio, updatePortfolio] = React.useState<PortfolioInterface>(portfolioProvider.portfolio);
    portfolioProvider.portfolio = portfolio;
    portfolioProvider.updatePortfolio = updatePortfolio;

    return <React.Fragment>
        <TokenContext.Provider value={TOKEN}>
            <TradesContext.Provider value={trades}>
                <StockSymbolsContext.Provider value={filteredSymbols}>
                    <LiquidBalanceContext.Provider value={liquidBalance}>
                        <ActiveStockContext.Provider value={activeStock}>
                            <WatchListContext.Provider value={watchListProviderValue}>
                                <PortfolioContext.Provider value={portfolio}>
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
