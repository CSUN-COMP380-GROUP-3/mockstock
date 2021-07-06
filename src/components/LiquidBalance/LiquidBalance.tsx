import React from 'react';
import Typography from '@material-ui/core/Typography';
import currency from 'currency.js';

import { LiquidBalanceContext } from '../../contexts/LiquidBalanceContext';

import "./LiquidBalance.css";
import Grid from '@material-ui/core/Grid';

export default function LiquidBalance() {

  const balance = React.useContext(LiquidBalanceContext);

  return (
    <React.Fragment>
      <Grid data-testid="liquidbalance" className="liquid-balance" container direction="row" justify="space-between">
        <Grid item>
          <Typography variant="h5" className="label">Funds Available</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h5" data-testid="liquidbalance-cash" className="dollar">{currency(balance).format()}</Typography>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};