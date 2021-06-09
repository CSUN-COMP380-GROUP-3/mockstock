import React from 'react';
import './App.css';

import BuyBox from './components/BuyBox/BuyBox';
import Header from './components/Header/Header';
import StockChart from './components/StockChart/StockChart';

import { ActiveInvestmentInterface, initActiveInvestmentContext, ActiveInvestmentContext } from './contexts/ActiveInvestmentContext';
import { TokenContext, TOKEN } from './contexts/TokenContext';
import { StockSymbolsContext, filteredSymbols } from './contexts/StockSymbolsContext';

import { initLiquidBalanceContext, LiquidBalanceContext, LiquidBalanceInterface } from './contexts/LiquidBalanceContext';
import LiquidBalance from './components/LiquidBalance/LiquidBalance';

import { initWatchListContext, WatchListContext, WatchListInterface } from './contexts/WatchListContext';
import WatchList from './components/WatchList/WatchList';

function App() {

  // this lets us use the state as a global context, and now can update and read the context via useContext hook
  const [activeInvestment, updateActiveInvestment] = React.useState<ActiveInvestmentInterface>(initActiveInvestmentContext.activeInvestment);
  const activeInvestmentProviderValue = { activeInvestment, updateActiveInvestment };

  const [liquidBalance, updateLiquidBalance] = React.useState<LiquidBalanceInterface>(initLiquidBalanceContext.liquidBalance);
  const liquidBalanceProviderValue = { liquidBalance, updateLiquidBalance };

  const [ watchList, updateWatchList ] = React.useState<WatchListInterface>(initWatchListContext.watchList);
  const watchListProviderValue = { watchList, updateWatchList };

  return (
    <TokenContext.Provider value={TOKEN}>
      <LiquidBalanceContext.Provider value={liquidBalanceProviderValue}>

        <StockSymbolsContext.Provider value={filteredSymbols}>
          <WatchListContext.Provider value={watchListProviderValue}>
            <ActiveInvestmentContext.Provider value={activeInvestmentProviderValue}>

              <Header></Header>
              <BuyBox></BuyBox>
              <StockChart></StockChart>
              <LiquidBalance></LiquidBalance>
              <WatchList></WatchList>

            </ActiveInvestmentContext.Provider>
          </WatchListContext.Provider>
        </StockSymbolsContext.Provider>

      </LiquidBalanceContext.Provider>
      
    </TokenContext.Provider>

  );
}

export default App;
