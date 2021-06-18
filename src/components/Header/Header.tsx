import React from 'react';
import Grid from '@material-ui/core/Grid';
import './Header.css';

export default function Header() {

  return <React.Fragment>
    <Grid container>
      <Grid item className="mockstock-logo">
        <img src="MockStockLogo.png" alt="" />
        <h5 className="subtitle">Official Stock Market Simulator</h5>
      </Grid>
    </Grid>
  </React.Fragment>;
};