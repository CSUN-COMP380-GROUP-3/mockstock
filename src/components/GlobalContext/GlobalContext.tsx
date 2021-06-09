// we store and initialize all of the contexts necessary throughout the application
import React from 'react';
import { TokenContext, TOKEN } from '../../contexts/TokenContext';
import { StockSymbolsContext, filteredSymbols } from '../../contexts/StockSymbolsContext';
import { initLiquidBalanceContext, LiquidBalanceContext, LiquidBalanceInterface } from '../../contexts/LiquidBalanceContext';
import { initActiveInvestmentContext, ActiveInvestmentContext, ActiveInvestmentInterface } from '../../contexts/ActiveInvestmentContext';
import { initWatchListContext, WatchListContext, WatchListInterface } from '../../contexts/WatchListContext';
import { initTradesContext, TradesContext, TradesContextInterface, TradesInterface } from '../../contexts/TradesContext';


export const GlobalContext: React.FC = ({children}) => {
    const [liquidBalance, updateLiquidBalance] = React.useState<LiquidBalanceInterface>(initLiquidBalanceContext.liquidBalance);
    const liquidBalanceProviderValue = { liquidBalance, updateLiquidBalance };

    const [activeInvestment, updateActiveInvestment] = React.useState<ActiveInvestmentInterface>(initActiveInvestmentContext.activeInvestment);
    const activeInvestmentProviderValue = { activeInvestment, updateActiveInvestment };
  
    const [ watchList, updateWatchList ] = React.useState<WatchListInterface>(initWatchListContext.watchList);
    const watchListProviderValue = { watchList, updateWatchList };

    const [ trades, updateTrades ] = React.useState<TradesInterface>(initTradesContext.trades);
    const tradesProviderValue = { trades, updateTrades };

    return <React.Fragment>
        <TokenContext.Provider value={TOKEN}>
        <TradesContext.Provider value={tradesProviderValue}>
                <StockSymbolsContext.Provider value={filteredSymbols}>
                    <LiquidBalanceContext.Provider value={liquidBalanceProviderValue}>
                        <ActiveInvestmentContext.Provider value={activeInvestmentProviderValue}>
                            <WatchListContext.Provider value={watchListProviderValue}>
                                {children}
                            </WatchListContext.Provider>
                        </ActiveInvestmentContext.Provider>
                    </LiquidBalanceContext.Provider>
                </StockSymbolsContext.Provider>
            </TradesContext.Provider>
        </TokenContext.Provider>
    </React.Fragment>
};