import React from 'react';
import './App.css';

import BuyBox from './components/BuyBox/BuyBox';
import BuySellBox from './components/BuySellBox/BuySellBox';
import Header from './components/Header/Header';
import StockChart from './components/StockChart/StockChart';
import LiquidBalance from './components/LiquidBalance/LiquidBalance';
import WatchList from './components/WatchList/WatchList';
import SellBox from './components/SellBox/SellBox';
import Portfolio from './components/Portfolio/Portfolio';

import { GlobalContext } from './components/GlobalContext/GlobalContext';
import { WatchListDataContext, WatchListDataInterface } from './contexts/WatchListDataContext';

function App() {

  const [ watchListData, updateWatchListData ] = React.useState<WatchListDataInterface>({});
  const watchListDataContextProviderValue = { watchListData, updateWatchListData };

  

  return (
    <GlobalContext>
      <Header></Header>
      <BuyBox></BuyBox>
      <StockChart></StockChart>
      <LiquidBalance></LiquidBalance>
      <SellBox></SellBox>
      <WatchListDataContext.Provider value={watchListDataContextProviderValue}>
        <WatchList></WatchList>
      </WatchListDataContext.Provider>
      <Portfolio></Portfolio>
      <BuySellBox></BuySellBox>
    </GlobalContext>
  );
}

export default App;
