import React, { useEffect } from 'react';
import Card, { CardProps } from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import currency from 'currency.js';
import { fetchCandles, errorHandler } from '../SellBox/utils';
import { ActiveStockContext } from '../../contexts/ActiveStockContext';
import { TokenContext } from '../../contexts/TokenContext';



export interface WatchListItemProps extends CardProps {
    symbol: string;
    price: number;
};

export default function WatchListItem(props: WatchListItemProps) {
    const { style, symbol, price } = props;
    const token = React.useContext(TokenContext);
    
    const { activeStock, updateActiveStock } = React.useContext(ActiveStockContext);

    const { to, from, stock } = activeStock;

    const useStyles = makeStyles({
        root: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            '& .symbol': {
                marginLeft: '1rem'
            },
            '& .details': {
                marginRight: '1rem',
                '& .dollar': {
                    textAlign: 'right',
                },
                '& .percent': {
                    textAlign: 'right',
                }
            }

        }
    });
    const { root } = useStyles();

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
            

        } catch(error) {
            errorHandler(error);
        };

        console.log(`${symbol} clicked from watchlist`);
    };

    return (
        <Card data-testid="watchlistitem" style={style} className={root} onClick={onClick}>
            <Typography variant="h6" className="symbol">{symbol}</Typography>
            <div className="details">
                <Typography variant="h6" className="dollar" data-testid="watchlistitem-dollar">{!!price ? currency(price).format() : '$-'}</Typography>
                <Typography variant="subtitle2" className="percent" data-testid="watchlistitem-percent">(-%)</Typography>
            </div>
        </Card>
    );
};