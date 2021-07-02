import React from 'react';
import Card, { CardProps } from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { activeStockProvider } from '../../contexts/ActiveStockContext';
import Trade from '../../interfaces/Trade';
import currency from 'currency.js';

export interface PortfolioListItemProps extends CardProps {
    data: Array<Object>[];
}

export default function PortfolioListItem(props: PortfolioListItemProps) {
    const { style, data } = props;
    const stock = Object(data[2]);
    const symbol = Object.values(data[2]);

    const useStyles = makeStyles({
        root: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            '& .symbol': {
                marginLeft: '1rem',
            },
            '& .details': {
                marginRight: '1rem',
                '& .dollar': {
                    textAlign: 'right',
                },
                '& .percent': {
                    textAlign: 'right',
                },
            },
        },
    });
    const { root } = useStyles();

    const onClick = () => {
        activeStockProvider.switchActiveStock(stock);
    };

    const comp = (
        <Card
            data-testid="watchlistitem"
            style={style}
            className={root}
            onClick={onClick}
        >
            <Typography variant="h6" className="symbol">
                {symbol[5]}
            </Typography>
            <div className="details">
                <Typography
                    variant="subtitle2"
                    className="cost"
                    data-testid="portfolioitem-cost"
                >
                    {data[0].toString()}
                </Typography>
                <Typography
                    variant="subtitle2"
                    className="shares"
                    data-testid="portfolioitem-shares"
                >
                    {data[1].toString()}
                </Typography>
            </div>
        </Card>
    );
    return comp;
}
