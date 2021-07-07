import React from 'react';
import {
    PortfolioContext,
} from '../../contexts/PortfolioContext';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import PortfolioItem from '../PortfolioItem/PortfolioItem';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import TradeHistory from '../TradeHistory/TradeHistory';
import { v4 as uuid } from 'uuid';

export default function Portfolio() {
    const portfolio = React.useContext(PortfolioContext);

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
                <TradeHistory />
                <CardContent>
                    <List>
                        {Object.entries(portfolio).map(([symbol, data]) => {
                            return <PortfolioItem key={'p'+uuid()} data={data} />;
                        })}
                    </List>
                </CardContent>
            </Card>
        </React.Fragment>
    );
}
