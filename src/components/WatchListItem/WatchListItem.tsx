import React from 'react';
import { CardProps } from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import currency from 'currency.js';
import { ActiveStockContext, getStockInfoForFrom } from '../../contexts/ActiveStockContext';
import { Listener } from '../../interfaces/WebSocketData';
import "./WatchListItem.css";
import FinnHubTrade from '../websocket';
import { filteredSymbols } from '../../contexts/StockSymbolsContext';

export interface WatchListItemProps extends CardProps {
    symbol: string;
};

export default function WatchListItem(props: WatchListItemProps) {
    const { symbol, style } = props;

    const { activeStock, updateActiveStock } = React.useContext(ActiveStockContext);

    const { to, from, stock } = activeStock;

    const [displayPrice, setDisplayPrice] = React.useState<number>();

    /**
     * Is called when user clicks on this component.
     * Switches Active Context to the the Symbol that this item represents.
     */
    const onClick = async () => {
        console.log(`${symbol} clicked from watchlist`);
        getStockInfoForFrom(filteredSymbols.find(s => s.symbol === symbol) || filteredSymbols[0], from, to).then((activeStockInfo) => {
            updateActiveStock(activeStockInfo);
        });
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