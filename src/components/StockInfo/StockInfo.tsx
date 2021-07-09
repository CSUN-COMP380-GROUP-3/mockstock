import React from 'react';
import Grid from '@material-ui/core/Grid';
import { activeStockProvider } from '../../contexts/ActiveStockContext';
import './StockInfo.css';
import {
    WatchListContext,
    WatchListContextInterface,
    WatchListTracker,
} from '../../contexts/WatchListContext';
import Typography from '@material-ui/core/Typography';
import currency from 'currency.js';
import { Listener } from '../../interfaces/WebSocketData';
import WS from '../websocket';
import WatchIcon from '@material-ui/icons/Watch';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

export default function StockInfo() {
    const { watchList, updateWatchList } =
        React.useContext<WatchListContextInterface>(WatchListContext);

    const [ activeStock, updateActiveStock ] = React.useState(activeStockProvider.activeStock);

    React.useEffect(() => {
        const activeStockSubscription = activeStockProvider.activeStock$.subscribe(updateActiveStock);
        return () => { activeStockSubscription.unsubscribe(); };
    }, []);

    const { stock, quote } = activeStock;

    const [displayPrice, setDisplayPrice] = React.useState<number>(quote.c);

    /**Depending on whether the active symbol is already within the watchlist, adds or removes the active symbol to the watchlist */
    const manipWatchList = () => {
        if (watchList[stock.symbol] === undefined) {
            // item is not already in watchlist, time to add to WatchList
            updateWatchList(WatchListTracker.addToWatchList(stock.symbol));
        } else {
            // item is already in watchlist, time to remove from WatchList
            updateWatchList(WatchListTracker.removeFromWatchList(stock.symbol));
        }
    };

    /**
     * Sets up a listener for the active symbol to retrieve live price data every time the active stock changes.
     */
    React.useEffect(() => {
        if (WS.socket.OPEN) {
            WS.listen(stock.symbol, updatePrice);
            return () => {
                WS.stopListen(stock.symbol, updatePrice);
            };
        }
    });

    /**
     * Updates the price state whenever the websocket calls it because of a message.
     * @param symbolName
     * @param price
     * @param timestamp
     * @param volume
     * @param tradeConditions
     */
    const updatePrice: Listener = (
        symbolName: string,
        price: number,
        timestamp: number,
        volume: number,
        tradeConditions: string[],
    ) => {
        setDisplayPrice(price);
    };

    /**Computes price change from last day's closing price */
    const changeFromYesterday = () => {
        return activeStock.quote.pc - displayPrice;
    };

    /**Computes the percent change from last day's closing price */
    const percentChangeFromYesterday = () => {
        return (changeFromYesterday() * 100) / activeStock.quote.pc;
    };

    return (
        <Grid container direction="column" className="active-stock-info">
            <Grid item>
                <Grid container direction="row">
                    <Grid item>
                        <Typography
                            variant="h4"
                            data-testid="StockInfo"
                            className="active-stock-name"
                        >
                            {stock.description} ({stock.symbol})
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography
                            variant="h4"
                            className="active-watchlist-button"
                            onClick={manipWatchList}
                        >
                            {watchList[stock.symbol] === undefined ? (
                                <WatchIcon />
                            ) : (
                                <RemoveCircleIcon />
                            )}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <Typography variant="h4" className="active-stock-price">
                    {currency(displayPrice).format()}
                </Typography>
            </Grid>
            <Grid item>
                <Typography
                    variant="subtitle1"
                    className="active-stock-percent-change"
                >
                    {currency(changeFromYesterday()).format()} (
                    {percentChangeFromYesterday().toFixed(2)}%) Today
                </Typography>
            </Grid>
        </Grid>
    );
}
