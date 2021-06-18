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
      <Grid container alignItems="stretch" spacing={0}>
        <Grid item xs={8}>
          <Grid container className="main-content" direction="column" spacing={2}>
            <Grid item>
              <Header></Header>
            </Grid>
            <Grid item>
              <StockChart></StockChart>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4} className="side-bar">
          <Grid container spacing={2} direction="column">
            <Grid item>
              <LiquidBalance></LiquidBalance>
            </Grid>
            <Grid item>
              <WatchList></WatchList>
            </Grid>
            <Grid item>
              <BuyBox></BuyBox>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </GlobalContext>
  );
}

export default App;
