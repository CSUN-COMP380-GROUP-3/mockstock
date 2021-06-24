import React from 'react';
import Grid from '@material-ui/core/Grid';
import './Header.css';
import SymbolBox from '../SymbolBox/SymbolBox';
import TradeHistory from '../TradeHistory/TradeHistory'

export default function Header() {

  return <React.Fragment>
    <Grid container direction="row" alignItems="center">
      <Grid item className="mockstock-logo">
        <img src="MockStockLogo.png" alt="" />
        <h5 className="subtitle">Official Stock Market Simulator</h5>
      </Grid>
      <Grid item className="symbol-box-container">
        <SymbolBox />
      </Grid>
      <Grid item>
        <TradeHistory />
      </Grid>
    </Grid>  
  </React.Fragment>;
};