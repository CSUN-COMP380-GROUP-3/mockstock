import React from 'react';
import { CardProps } from '@material-ui/core/Card';
import Typography, { TypographyProps } from '@material-ui/core/Typography';
import currency from 'currency.js';
import { activeStockProvider } from '../../contexts/ActiveStockContext';
import { Listener } from '../../interfaces/WebSocketData';
import "./WatchListItem.css";
import FinnHubTrade from '../websocket';
import { BehaviorSubject } from 'rxjs';

export interface WatchListItemPriceProps extends TypographyProps {
    displayedPrice$: BehaviorSubject<number>;
};

export function WatchListItemPrice(props: WatchListItemPriceProps) {
    const [ displayedPrice, updateDisplayedPrice ] = React.useState(0);
    const { displayedPrice$, variant, className } = props;

    React.useEffect(() => {
        const subscription = displayedPrice$.subscribe(price => {
            updateDisplayedPrice(price);
        });
        return () => {
            subscription.unsubscribe();
        };
    });

    return <Typography 
        variant={variant} 
        className={className} 
        data-testid={'watchlistitem-'+className}
        >
            {!!displayedPrice ? currency(displayedPrice).format() : '$-'}
        </Typography>;
};

export interface WatchListItemProps extends CardProps {
    symbol: string;
};

export default function WatchListItem(props: WatchListItemProps) {
    const { symbol, style } = props;

    const displayedPrice$ = new BehaviorSubject(0);

    /**
     * Is called when user clicks on this component.
     * Switches Active Context to the the Symbol that this item represents.
     */
    const onClick = async () => {
        console.log(`${symbol} clicked from watchlist`);
        activeStockProvider.switchActiveStockByName(symbol);
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
        displayedPrice$.next(price);
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
    });

    return (
        <div data-testid="watchlistitem" style={style} className="list-item" onClick={onClick}>
            <Typography variant="h6" className="symbol">{symbol}</Typography>
            <div className="details">
                <Typography variant="subtitle2" className="percent" data-testid="watchlistitem-percent">(-%)</Typography>
                <WatchListItemPrice variant="h6" className="dollar" displayedPrice$={displayedPrice$}/>
            </div>
        </div>
    );
};