import React from 'react';
import currency from 'currency.js';
import Typography from '@material-ui/core/Typography';
// import { makeStyles } from '@material-ui/core/styles';

import { LiquidBalanceContext } from '../../contexts/LiquidBalanceContext';

import "./LiquidBalance.css";
import Grid from '@material-ui/core/Grid';

export default function LiquidBalance() {

  const { liquidBalance, updateLiquidBalance } = React.useContext(LiquidBalanceContext);
  const { prev, curr } = liquidBalance;

  const [testValue, updateTestValue] = React.useState(100);
  const changeHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    updateTestValue(e.target.valueAsNumber);
  };

  const clickHandler = () => {
    let { prev, curr } = liquidBalance;

    prev = currency(curr.value);
    curr = curr.add(currency(testValue));

    updateLiquidBalance({ prev, curr });
  };

  const getPercent = () => ((getProfit().value / prev.value) * 100.00).toFixed(2);

  const getProfit = () => curr.subtract(prev);

  const getSign = () => getProfit().value > 0 ? '+' : '';

  // input and button are only used to test the increase and decrease in balance value
  return (
    <React.Fragment>

      {/* <div data-testid="liquidbalance" className="root"> */}
      <Grid data-testid="liquidbalance" className="liquid-balance" container direction="row" justify="space-between">
        <Grid item>
          <Typography variant="h5" className="label">Funds Available</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h5" data-testid="liquidbalance-cash" className="dollar">{curr.format()}</Typography>
        </Grid>
      </Grid>
      {/* <div className="amount">
          <Typography variant="h4" data-testid="liquidbalance-cash" className="dollar">{curr.format()}</Typography>
          <div className="details" style={{ color: getProfit().value === 0 ? undefined : getProfit().value > 0 ? 'green' : 'red' }}>
            <Typography variant="subtitle2" data-testid="liquidbalance-profit" className="profit">{getSign()}{getProfit().format()}</Typography>
            <Typography variant="subtitle2" data-testid="liquidbalance-percent" className="percent">({getPercent().toString()}%)</Typography>
          </div>
        </div> */}
      {/* </div> */}

      {/* <input
        type="number"
        id="test-lb"
        value={testValue}
        onChange={changeHandler}
      />
      <button
        id="test-button"
        onClick={clickHandler}
      >Add
      </button> */}
    </React.Fragment>
  );
};