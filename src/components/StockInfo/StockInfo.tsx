import React from 'react';
import Grid from '@material-ui/core/Grid';
import { ActiveStockContext } from '../../contexts/ActiveStockContext';
import "./StockInfo.css";
import { WatchListContext, WatchListContextInterface, WatchListTracker } from '../../contexts/WatchListContext';
import Typography from '@material-ui/core/Typography';

export default function StockInfo() {

  const { watchList, updateWatchList } = React.useContext<WatchListContextInterface>(WatchListContext);
  const { activeStock, updateActiveStock } = React.useContext(ActiveStockContext);

  const { stock, to, from } = activeStock;

  const manipWatchList = () => {
    if (watchList[stock.symbol] === undefined) {
      // item is not already in watchlist, time to add to WatchList
      updateWatchList(WatchListTracker.addToWatchList(stock.symbol));
    } else {
      // item is already in watchlist, time to remove from WatchList
      updateWatchList(WatchListTracker.removeFromWatchList(stock.symbol));
    }
  }

  return (
    <Grid container direction="row">
      <Grid item>
        <Typography variant="h4" data-testid="StockInfo" className="stock-info">{stock.description} ({stock.symbol})</Typography>
      </Grid>
      <Grid item>
        <Typography variant="h4" className="watchlist-button" onClick={manipWatchList}>{watchList[stock.symbol] === undefined ? '-' : '+'}</Typography>
      </Grid>
    </Grid>
  );
};