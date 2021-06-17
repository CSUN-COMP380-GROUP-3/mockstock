import React from 'react';
import './App.css';

import BuyBox from './components/BuyBox/BuyBox';
import BuySellBox from './components/BuySellBox/BuySellBox';
import Header from './components/Header/Header';
import StockChart from './components/StockChart/StockChart';
import LiquidBalance from './components/LiquidBalance/LiquidBalance';
import WatchList from './components/WatchList/WatchList';
import Portfolio from './components/Portfolio/Portfolio';

// sandbox_c2sn1e2ad3ic1qis5pug

import { GlobalContext } from './components/GlobalContext/GlobalContext';

function App() {
  return (
    <GlobalContext>
      <Header></Header>
      <BuyBox></BuyBox>
      <StockChart></StockChart>
      <LiquidBalance></LiquidBalance>
      <Portfolio></Portfolio>
      <WatchList></WatchList>
      <BuySellBox></BuySellBox>
    </GlobalContext>
  );
}

export default App;
