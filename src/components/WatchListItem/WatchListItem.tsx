import React from 'react';
import Card, { CardProps } from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import currency from 'currency.js';

export interface WatchListItemProps extends CardProps {
    symbol: string;
    price: number;
};

export default function WatchListItem(props: WatchListItemProps) {
    const { style, symbol, price } = props;
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

    return (
        <Card data-testid="watchlistitem" style={style} className={root}>
            <Typography variant="h6" className="symbol">{symbol}</Typography>
            <div className="details">
                <Typography variant="h6" className="dollar" data-testid="watchlistitem-dollar">{!!price ? currency(price).format() : '$-'}</Typography>
                <Typography variant="subtitle2" className="percent" data-testid="watchlistitem-percent">(-%)</Typography>
            </div>
        </Card>
    );
};