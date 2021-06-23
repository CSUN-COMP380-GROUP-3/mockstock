import React from 'react';
import './App.css';
import Grid from '@material-ui/core/Grid';

import BuyBox from './components/BuyBox/BuyBox';
import BuySellBox from './components/BuySellBox/BuySellBox';
import Header from './components/Header/Header';
import StockChart from './components/StockChart/StockChart';
import LiquidBalance from './components/LiquidBalance/LiquidBalance';
import WatchList from './components/WatchList/WatchList';
import SellBox from './components/SellBox/SellBox';
import Portfolio from './components/Portfolio/Portfolio';
import SymbolBox from './components/SymbolBox/SymbolBox';


import { GlobalContext } from './components/GlobalContext/GlobalContext';
import StockInfo from './components/StockInfo/StockInfo';

function App() {

  return (
    <GlobalContext>
      <Grid container alignItems="stretch" spacing={0} className="all-content">
        <Grid item xs={8}>
          <Grid container className="main-content" direction="column" alignContent="stretch" spacing={2}>
            <Grid item>
              <Header />
            </Grid>
            <Grid item>
              <StockInfo />
            </Grid>
            <Grid item>
              <StockChart />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4} className="side-bar">
          <Grid container spacing={2} direction="column">
            <Grid item>
              <LiquidBalance />
            </Grid>
            <Grid item>
              <WatchList />
            </Grid>
            <Grid item>
              <BuyBox />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </GlobalContext>
  );
}

export default App;
