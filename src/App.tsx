import React from 'react';
import './App.css';
import Grid from '@material-ui/core/Grid';

import BuyBox from './components/BuyBox/BuyBox';
import Header from './components/Header/Header';
import StockChart from './components/StockChart/StockChart';
import LiquidBalance from './components/LiquidBalance/LiquidBalance';
import WatchList from './components/WatchList/WatchList';

import { GlobalContext } from './components/GlobalContext/GlobalContext';

function App() {
  return (
    <GlobalContext>
      <Grid container spacing={0}>
        <Grid item xs={8} className="main-content">
          <Header></Header>
          <StockChart></StockChart>
        </Grid>
        <Grid item xs={4} className="side-bar">
          <LiquidBalance></LiquidBalance>
          <WatchList></WatchList>
          <BuyBox></BuyBox>
        </Grid>
      </Grid>
    </GlobalContext>
  );
}

export default App;
