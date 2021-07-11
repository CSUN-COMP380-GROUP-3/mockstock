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
import { ListItem } from '@material-ui/core';



export default function Portfolio() {

    const [ portfolio, updatePortfolio ] = React.useState(portfolioProvider.portfolio);

    React.useEffect(() => {
        const portfolioSubscription = portfolioProvider.portfolio$.subscribe(updatePortfolio);
        return () => { portfolioSubscription.unsubscribe(); };
    }, []);

    const useStyles = makeStyles({
        portfolioHeader: {
            justifyContent: "flex-start",
            alignItems: "center",
            borderBottom: "2px solid var(--dark)",
        },
        portfolioTitle: {
            width: "100%",
            padding: "1rem 0 14px 1rem",
        },
        portfolioList: {
            maxHeight: '20vh',
            overflow: 'auto'
        },
        portfolioListItem: {
            width: "100%"
        }
    });

    const classes = useStyles();

    return (
        <React.Fragment>
            <Card data-testid="portfoliolist">
                <Grid container spacing={1} className={classes.portfolioHeader}>
                    <Grid item>
                        <div className={classes.portfolioTitle}>
                            <Typography variant="h5">Portfolio</Typography>
                        </div>
                    </Grid>
                    <Grid item>
                        <TradeHistory />
                    </Grid>
                </Grid>
                <CardContent>
                    {
                        portfolioProvider.length === 0 ? 
                        <Typography variant="body1" align="center">Your portfolio is empty. Purchase some stocks to get started.</Typography> : 
                        <List className={classes.portfolioList}>
                            {Object.entries(portfolio).map(([symbol, data]) => (
                                <ListItem>
                                    <PortfolioItem key={'p'+uuid()} data={data} />
                                </ListItem>
                            ))}
                        </List>
                    }
                    
                </CardContent>
            </Card>
        </React.Fragment>
    );
}
