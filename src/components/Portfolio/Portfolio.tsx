import React from 'react';
import {
    PortfolioContext,
    portfolioProvider,
} from '../../contexts/PortfolioContext';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import PortfolioItem from '../PortfolioItem/PortfolioItem';
import { makeStyles } from '@material-ui/core/styles';
import currency from 'currency.js';

export interface ProcessedData {
    total$Buys: currency;
    total$Sells: currency;
    totalBuyShares: currency;
    totalSellShares: currency;
}

export default function Portfolio() {
    const portfolio = React.useContext(PortfolioContext);
    var newdata: object[] = [];
    for (let i = 0; i < portfolioProvider.length; i++) {
        const data = Object.values(portfolio)[i];
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

        if (totalShares.value === 0) {
        } else {
            var dataaa = {
                costBasis: costBasis,
                totalShares: totalShares,
                stock: Object.values(portfolio)[i][0].stock,
            };
            newdata.push(dataaa);
        }
    }

    const Row = (props: ListChildComponentProps) => {
        const { index, style } = props;

        const data = Object.values(newdata[index]);

        return <PortfolioItem key={index} style={style} data={data} />;
    };

    const useStyles = makeStyles({
        root: {
            height: '100%',
        },
    });

    const classes = useStyles();

    return (
        <React.Fragment>
            <Card data-testid="portfoliolist" className={classes.root}>
                <CardHeader title="Portfolio"></CardHeader>
                <CardContent>
                    <FixedSizeList
                        height={400}
                        width={400}
                        itemSize={80}
                        itemCount={newdata.length}
                    >
                        {Row}
                    </FixedSizeList>
                </CardContent>
            </Card>
        </React.Fragment>
    );
}
