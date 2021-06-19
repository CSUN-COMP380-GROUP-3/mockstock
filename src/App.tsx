import React from 'react';
import './App.css';
import Grid from '@material-ui/core/Grid';

import BuyBox from './components/BuyBox/BuyBox';
import Header from './components/Header/Header';
import StockChart from './components/StockChart/StockChart';
import LiquidBalance from './components/LiquidBalance/LiquidBalance';
import WatchList from './components/WatchList/WatchList';
import SellBox from './components/SellBox/SellBox';
<<<<<<< HEAD
import Portfolio from './components/Portfolio/Portfolio';
import SymbolBox from './components/SymbolBox/SymbolBox';
=======
>>>>>>> 6670eda (Update App.tsx)

import { GlobalContext } from './components/GlobalContext/GlobalContext';
import { WatchListDataContext, WatchListDataInterface } from './contexts/WatchListDataContext';

function App() {

  const [ watchListData, updateWatchListData ] = React.useState<WatchListDataInterface>({});
  const watchListDataContextProviderValue = { watchListData, updateWatchListData };

  

  return (
    <GlobalContext>
<<<<<<< HEAD
      <Grid container alignItems="stretch" spacing={0} className="all-content">
        <Grid item xs={8}>
          <Grid container className="main-content" direction="column" spacing={2}>
            <Grid item>
              <Header/>
            </Grid>
            <Grid item>
              <StockChart/>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4} className="side-bar">
          <Grid container spacing={2} direction="column">
            <Grid item>
              <LiquidBalance/>
            </Grid>
            <Grid item>
              <WatchListDataContext.Provider value={watchListDataContextProviderValue}>
                <WatchList/>
              </WatchListDataContext.Provider>
            </Grid>
            <Grid item>
              <BuyBox/>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
=======
      <Header></Header>
      <StockChart></StockChart>
      <LiquidBalance></LiquidBalance>
      <SellBox></SellBox>
      <WatchListDataContext.Provider value={watchListDataContextProviderValue}>
        <WatchList></WatchList>
      </WatchListDataContext.Provider>
      <BuyBox></BuyBox>
>>>>>>> 6670eda (Update App.tsx)
    </GlobalContext>
  );
}

export default App;
