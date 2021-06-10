import React from 'react';
import Card, { CardProps } from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { WatchListData } from '../../contexts/WatchListContext';

export interface WatchListItemProps extends CardProps {
    data: WatchListData;
};

export default function WatchListItem(props: WatchListItemProps) {
    const { style, data } = props;
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
            <Typography variant="h6" className="symbol">{data.symbol}</Typography>
            <div className="details">
                <Typography variant="h6" className="dollar">$100.00</Typography>
                <Typography variant="subtitle2" className="percent">(10.01%)</Typography>
            </div>
        </Card>
    );
};