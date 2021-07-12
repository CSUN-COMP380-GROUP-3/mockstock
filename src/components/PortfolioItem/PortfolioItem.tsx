import { CardProps } from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { activeStockProvider } from '../../contexts/ActiveStockContext';
import { PortfolioDataInterface } from '../../contexts/PortfolioContext';
import Grid from '@material-ui/core/Grid';
import currency from 'currency.js';
import { errorHandler, fetchQuote } from '../utils';
import { TOKEN } from '../../contexts/TokenContext';
import { BehaviorSubject } from 'rxjs';
import React from 'react';
import FinnHubTrade from '../websocket';
import { Listener } from '../../interfaces/WebSocketData';

export interface PortfolioListItemProps extends CardProps {
    data: PortfolioDataInterface;
}

export default function PortfolioListItem(props: PortfolioListItemProps) {
    const { style, data } = props;
    const { symbol } = data.stock;

    // const displayedPrice$ = new BehaviorSubject(0);
    const [displayedPrice, updateDisplayedPrice] = React.useState(0);

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
        updateDisplayedPrice(price);
    };

    /**
     * Is responsible for listening and unlistening to the websocket.
     */
    React.useEffect(() => {
        fetchQuote({
            symbol,
            token: TOKEN,
        })
            .then(res => {
                updateDisplayedPrice(res.data.c);
            })
            .catch(errorHandler);

        if (FinnHubTrade.socket.OPEN) {
            FinnHubTrade.listen(symbol, updatePrice);
            return () => {
                FinnHubTrade.stopListen(symbol, updatePrice);
            }
        };
    }, []);

    const useStyles = makeStyles({
        root: {
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            '& .symbol': {
                // marginLeft: '1rem',
            },
            '& .price-data': {
                textAlign: "right",
                paddingRight: "20px"
            },
            '& .positive': {
                color: "var(--green)"
            },
            '& .neutral': {
                color: "black"
            },
            '& .negative': {
                color: "var(--red)"
            }
        }
    });
    const { root } = useStyles();

    const onClick = () => {
        activeStockProvider.switchActiveStock(data.stock);
    };

    const getPercentChange = () => {
        return ((displayedPrice / data.costBasis) - 1) * 100
    }

    const getPercentColor = () => {
        const percentChange = getPercentChange();
        if (percentChange > 0) {
            return "positive";
        } else if (percentChange === 0) {
            return "neutral";
        } else {
            return "negative";
        }
    }

    const comp = (
        // <div
        //     data-testid="watchlistitem"
        //     style={style}
        //     className={root}
        //     onClick={onClick}
        // >
        <Grid
            container
            spacing={0}
            alignItems="center"
            direction="row"
            data-testid="watchlistitem"
            style={style}
            className={root}
            onClick={onClick}
        >
            <Grid item xs={2}>
                <Typography variant="h6" className="symbol">
                    ${symbol}
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography variant="subtitle1">{data.totalShares.toFixed(4)} Shares</Typography>
            </Grid>
            <Grid container xs={6} direction="row" justify="flex-end" alignItems="center">
                <Grid item>
                    <Typography variant="subtitle1" className={"price-data " + getPercentColor()}>{((getPercentChange() > 0) ? "+" : "") + getPercentChange().toFixed(2)}%</Typography>
                </Grid>
                <Grid item>
                    <Typography variant="h6" className="price-data">{currency(data.totalShares * displayedPrice).format()}</Typography>
                </Grid>
            </Grid>
        </Grid>
        // </div>
    );

    return comp;
}
