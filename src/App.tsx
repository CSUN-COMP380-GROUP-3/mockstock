import React from 'react';
import './App.css';

import BuyBox from './components/BuyBox/BuyBox';
import Header from './components/Header/Header';
import StockChart from './components/StockChart/StockChart';
import LiquidBalance from './components/LiquidBalance/LiquidBalance';
import WatchList from './components/WatchList/WatchList';

import { GlobalContext } from './components/GlobalContext/GlobalContext';

function App() {
  return (
    <GlobalContext>
      <Header></Header>
      <BuyBox></BuyBox>
      <StockChart></StockChart>
      <LiquidBalance></LiquidBalance>
      <WatchList></WatchList>
    </GlobalContext>
  );
}

export default App;
