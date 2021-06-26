import React from 'react';
import Card, { CardProps } from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { activeStockProvider } from '../../contexts/ActiveStockContext';
import Trade from '../../interfaces/Trade';
import currency from 'currency.js';

export interface PortfolioListItemProps extends CardProps {
    data: Trade[];
}

export interface ProcessedData {
    total$Buys: currency;
    total$Sells: currency;
    totalBuyShares: currency;
    totalSellShares: currency;
}

export default function PortfolioListItem(props: PortfolioListItemProps) {
    const { style, data } = props;
    const stock = data[0].stock;
    const { symbol } = stock;

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

    const processTrades = () => {
        return data.reduce(
            (acc, curr) => {
                const {
                    total$Buys,
                    total$Sells,
                    totalBuyShares,
                    totalSellShares,
                } = acc;
                const { type, price, total } = curr;
                const newData: ProcessedData = {
                    total$Buys,
                    total$Sells,
                    totalBuyShares,
                    totalSellShares,
                };
                const shares = total.divide(price!);
                if (type === 'BUY') {
                    newData.total$Buys = total$Buys.add(total);
                    newData.totalBuyShares = totalBuyShares.add(shares);
                } else {
                    // SELL
                    newData.total$Sells = total$Sells.add(total);
                    newData.totalSellShares = totalSellShares.add(shares);
                }
                return newData;
            },
            {
                total$Buys: currency(0),
                total$Sells: currency(0),
                totalBuyShares: currency(0),
                totalSellShares: currency(0),
            } as ProcessedData,
        );
    };

    // (total$Buys - total$Sells) / (totalBuyShares - totalSellShares) // cost basis

    const { total$Buys, total$Sells, totalBuyShares, totalSellShares } =
        processTrades();
    const totalShares = totalBuyShares.subtract(totalSellShares);
    const costBasis = total$Buys.subtract(total$Sells).divide(totalShares);
    console.log(totalShares);
    console.log(`cost basis ${costBasis}`);
    const comp =
        totalShares.value === 0 ? (
            <div></div>
        ) : (
            <Card
                data-testid="watchlistitem"
                style={style}
                className={root}
                onClick={onClick}
            >
                <Typography variant="h6" className="symbol">
                    {symbol}
                </Typography>
                <div className="details">
                    {/* <Typography variant="subtitle2" className="dollar" data-testid="portfolioitem-dollar">{(total$Buys.subtract(total$Sells)).toString()}</Typography> */}
                    <Typography
                        variant="subtitle2"
                        className="cost"
                        data-testid="portfolioitem-cost"
                    >
                        {costBasis.toString()}
                    </Typography>
                    <Typography
                        variant="subtitle2"
                        className="shares"
                        data-testid="portfolioitem-shares"
                    >
                        {totalShares.format({ precision: 4, symbol: '' })}
                    </Typography>
                </div>
            </Card>
        );

    return comp;
}
