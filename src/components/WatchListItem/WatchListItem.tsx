import React from 'react';
import { CardProps } from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import currency from 'currency.js';
import { fetchCandles, errorHandler } from '../utils';
import { ActiveStockContext } from '../../contexts/ActiveStockContext';
import { TokenContext } from '../../contexts/TokenContext';
import { Listener } from '../../interfaces/WebSocketData';
import "./WatchListItem.css";
import FinnHubTrade from '../websocket';

export interface WatchListItemProps extends CardProps {
    symbol: string;
};

export default function WatchListItem(props: WatchListItemProps) {
    const { symbol, style } = props;
    const token = React.useContext(TokenContext);

    const { activeStock, updateActiveStock } = React.useContext(ActiveStockContext);

    const { to, from, stock } = activeStock;

    const [displayPrice, setDisplayPrice] = React.useState<number>();

    /**
     * Is called when user clicks on this component.
     * Switches Active Context to the the Symbol that this item represents.
     */
    const onClick = async () => {
        try {
            const res = await fetchCandles({
                symbol,
                from: from.unix(),
                to: to.unix(),
                resolution: 'D',
                token
            });
            if (!!res.data) {
                console.log(res.data);
                // updateActiveStock({
                //     stock,
                //     to,
                //     from,
                //     candles: res.data,
                // });
            };


        } catch (error) {
            errorHandler(error);
        };

        console.log(`${symbol} clicked from watchlist`);
    };

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
        tradeConditions: string[]
    ) => {
        setDisplayPrice(price);
    };

    /**
     * Is responsible for listening and unlistening to the websocket.
     */
    React.useEffect(() => {
        if (FinnHubTrade.socket.OPEN) {
            FinnHubTrade.listen(symbol, updatePrice);
            return () => {
                FinnHubTrade.stopListen(symbol, updatePrice);
            }
        };
    }, [FinnHubTrade.socket.OPEN]);

    return (
        <div data-testid="watchlistitem" style={style} className="list-item" onClick={onClick}>
            <Typography variant="h6" className="symbol">{symbol}</Typography>
            <div className="details">
                <Typography variant="subtitle2" className="percent" data-testid="watchlistitem-percent">(-%)</Typography>
                <Typography variant="h6" className="dollar" data-testid="watchlistitem-dollar">{!!displayPrice ? currency(displayPrice).format() : '$-'}</Typography>
            </div>
        </div>
    );
};