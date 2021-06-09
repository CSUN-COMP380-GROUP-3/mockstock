import React from 'react';
import './App.css';

import BuyBox from './components/BuyBox/BuyBox';
import Header from './components/Header/Header';
import StatBox from './components/StatBox/StatBox';
import StockChart from './components/StockChart/StockChart';

import { ActiveInvestmentInterface, initActiveInvestmentContext, ActiveInvestmentContext } from './contexts/ActiveInvestmentContext';
import { TokenContext } from './contexts/TokenContext';
import { StockSymbolsContext, filteredSymbols } from './contexts/StockSymbolsContext';
import { initTradesContext, TradesContext, TradesContextInterface, TradesInterface } from './contexts/TradesContext';


function App() {

  // this lets us use the state as a global context, and now can update and read the context via useContext hook
  const [activeInvestment, updateActiveInvestment] = React.useState<ActiveInvestmentInterface>(initActiveInvestmentContext.activeInvestment);
  const activeInvestmentProviderValue = { activeInvestment, updateActiveInvestment };

  const [ trades, updateTrades ] = React.useState<TradesInterface>(initTradesContext.trades);
  const tradesProviderValue = { trades, updateTrades };

  return (
    <TokenContext.Provider value={
      process.env.NODE_ENV === 'production' ? 
        process.env.REACT_APP_API_KEY! :
        process.env.REACT_APP_SANDBOX_KEY!
    }>
      <TradesContext.Provider value={tradesProviderValue}>
          <StockSymbolsContext.Provider value={filteredSymbols}>
            <ActiveInvestmentContext.Provider value={activeInvestmentProviderValue}>
              <Header></Header>
              <BuyBox></BuyBox>
              <StatBox></StatBox>
              <StockChart></StockChart>
            </ActiveInvestmentContext.Provider>
          </StockSymbolsContext.Provider>
      </TradesContext.Provider>
    </TokenContext.Provider>

  );
}

export default App;
