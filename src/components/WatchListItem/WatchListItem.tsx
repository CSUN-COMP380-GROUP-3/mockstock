import React from 'react';
import { CardProps } from '@material-ui/core/Card';
import Typography, { TypographyProps } from '@material-ui/core/Typography';
import currency from 'currency.js';
import { activeStockProvider } from '../../contexts/ActiveStockContext';
import { Listener } from '../../interfaces/WebSocketData';
import "./WatchListItem.css";
import FinnHubTrade from '../websocket';
import { BehaviorSubject } from 'rxjs';
import { fetchQuote, errorHandler } from '../utils';
import { TOKEN } from '../../contexts/TokenContext';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    positive: {
        color: 'var(--green)',
    },
    negative: {
        color: 'var(--red)'
    },
    neutral: {
        color: 'black'
    }
});

export interface WatchListItemPriceProps extends TypographyProps {
    displayedPrice$: BehaviorSubject<number>;
    previousClose: number;
};

export function WatchListItemPrice(props: WatchListItemPriceProps) {
    const cachedPrice = React.useRef(0);
    const [ displayedPrice, updateDisplayedPrice ] = React.useState(cachedPrice.current);
    const { displayedPrice$, previousClose } = props;

    React.useEffect(() => {
        const subscription = displayedPrice$.subscribe(price => {
            cachedPrice.current = price;
            updateDisplayedPrice(price);
        });
        return () => {
            subscription.unsubscribe();
        };
    }, [displayedPrice$]);

    const getPercentDiff = () => {
        return ((displayedPrice - previousClose) / previousClose) * 100;
    };

    const { neutral, positive, negative } = useStyles();

    const getPercentColor = () => {
        const percent = getPercentDiff();
        if (percent === 0) {
            return neutral;
        } else if(percent > 0) {
            return positive;
        } else {
            return negative;
        };
    };

    return (
        <React.Fragment>
            <Typography 
                variant="subtitle2" 
                className="percent" 
                data-testid="watchlistitem-percent"
                classes={{
                    root: getPercentColor()
                }}
            > 
                {!!previousClose ? '('+getPercentDiff().toFixed(2)+'%)': '(-%)'}
            </Typography>
            <Typography 
                variant="h6" 
                className="dollar"
                data-testid="watchlistitem-dollar"
            >
                {!!displayedPrice ? currency(displayedPrice).format() : '$-'}
            </Typography>
        </React.Fragment>
    );
    ;
};

export interface WatchListItemProps extends CardProps {
    symbol: string;
};

export default function WatchListItem(props: WatchListItemProps) {
    const { symbol, style } = props;
    const previousClose = React.useRef(0);

    // if previous price ref is 0 then we need to fetch quote data
    if (!previousClose.current) {
        fetchQuote({
            symbol,
            token: TOKEN,
        })
            .then(res => {
                previousClose.current = res.data.pc;
            })
            .catch(errorHandler);
    };

    const displayedPrice$ = new BehaviorSubject(previousClose.current);

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
                <WatchListItemPrice 
                    className="dollar" 
                    displayedPrice$={displayedPrice$}
                    previousClose={previousClose.current}
                />
            </div>
        </div>
    );
};