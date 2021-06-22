import React from 'react';
import { CardProps } from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import currency from 'currency.js';
import { fetchCandles, errorHandler } from '../utils';
import { ActiveStockContext } from '../../contexts/ActiveStockContext';
import { TokenContext } from '../../contexts/TokenContext';
import "./WatchListItem.css";
import { Listener } from '../../interfaces/WebSocketData';
import { listen, stopListen } from '../websocket';
import socket from '../websocket';

export interface WatchListItemProps extends CardProps {
    symbol: string;
};

export default function WatchListItem(props: WatchListItemProps) {
    // const { style, symbol, price } = props;
    const { symbol, style } = props;
    const token = React.useContext(TokenContext);

    const { activeStock, updateActiveStock } = React.useContext(ActiveStockContext);

    const { to, from, stock } = activeStock;

    const [displayPrice, setDisplayPrice] = React.useState<number>();

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

    const updatePrice: Listener = (
        symbolName: string,
        price: number,
        timestamp: number,
        volume: number,
        tradeConditions: string[]
    ) => {
        setDisplayPrice(price);
    };

    React.useEffect(() => {
        console.log("USE EFFECT FOR ITEM HAS BEEN CALLED");
        if (socket.OPEN) {
            listen(symbol, updatePrice);
            return () => {
                console.log("ITEM HAS BEEN UNDRAWN");
                stopListen(symbol, updatePrice);
            }
        };
    }, [socket.OPEN]);

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