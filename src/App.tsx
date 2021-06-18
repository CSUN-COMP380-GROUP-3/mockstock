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

import { GlobalContext } from './components/GlobalContext/GlobalContext';
import { WatchListDataContext, WatchListDataInterface } from './contexts/WatchListDataContext';

function App() {

  const [ watchListData, updateWatchListData ] = React.useState<WatchListDataInterface>({});
  const watchListDataContextProviderValue = { watchListData, updateWatchListData };

  

  return (
    <GlobalContext>
      <Grid container spacing={0}>
        <Grid item xs={8} className="main-content">
          <Header></Header>
          <StockChart></StockChart>
        </Grid>
        <Grid item xs={4} className="side-bar">
          <LiquidBalance></LiquidBalance>
          <WatchListDataContext.Provider value={watchListDataContextProviderValue}>
            <WatchList></WatchList>
          </WatchListDataContext.Provider>
          <BuyBox></BuyBox>
        </Grid>
      </Grid>
    </GlobalContext>
  );
}

export default App;
