import React from 'react';
import { portfolioProvider } from '../../contexts/PortfolioContext';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import PortfolioItem from '../PortfolioItem/PortfolioItem';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import TradeHistory from '../TradeHistory/TradeHistory';
import { v4 as uuid } from 'uuid';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export default function Portfolio() {

    const [ portfolio, updatePortfolio ] = React.useState(portfolioProvider.portfolio);

    React.useEffect(() => {
        const portfolioSubscription = portfolioProvider.portfolio$.subscribe(updatePortfolio);
        return () => { portfolioSubscription.unsubscribe(); };
    }, []);

    const useStyles = makeStyles({
        root: {
            height: '100%',
        },
        header: {
            justifyContent: "flex-start",
            alignItems: "center",
            borderBottom: "2px solid #323232",
        },
        title: {
            width: "100%",
            padding: "1rem 0 14px 1rem",
        }
    });

    const classes = useStyles();

    return (
        <React.Fragment>
            <Card data-testid="portfoliolist" className={classes.root}>
                <Grid container spacing={1} className={classes.header}>
                    <Grid item>
                        <div className={classes.title}>
                            <Typography variant="h5">Portfolio</Typography>
                        </div>
                    </Grid>
                    <Grid item>
                        <TradeHistory />
                    </Grid>
                </Grid>
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
