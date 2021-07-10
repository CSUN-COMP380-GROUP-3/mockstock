import React from 'react';
import Typography from '@material-ui/core/Typography';
import currency from 'currency.js';
import { liquidBalanceProvider } from '../../contexts/LiquidBalanceContext';
import "./LiquidBalance.css";
import Grid from '@material-ui/core/Grid';

export default function LiquidBalance() {

  /** internal state only handled by this component */
  const [ balance, updateBalance ] = React.useState(liquidBalanceProvider.balance);

  /** on componentDidMount we subscribe to the observable and update internal state. 
   * on componentWillUnmount we unsubscribe to make sure we dont have any memory leaks
   */
  React.useEffect(() => {
    const subscription = liquidBalanceProvider.balance$.subscribe(updateBalance);
    return () => { subscription.unsubscribe(); };
  }, []);

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