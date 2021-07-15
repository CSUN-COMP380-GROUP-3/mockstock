import React from 'react';
import './App.css';
import Grid from '@material-ui/core/Grid';

import BuyBox from './components/BuyBox/BuyBox';
import Header from './components/Header/Header';
import StockChart from './components/StockChart/StockChart';
import LiquidBalance from './components/LiquidBalance/LiquidBalance';
import WatchList from './components/WatchList/WatchList';
import SellBox from './components/SellBox/SellBox';
import StockInfo from './components/StockInfo/StockInfo';
import Portfolio from './components/Portfolio/Portfolio';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles({
    appContent: {
        height: "100vh",
        '& .MuiCardContent-root:last-child': {
            paddingBottom: "1rem",
        }
    }
});

function App() {
    const classes = useStyles();

    return (
        <Grid
            container
            alignItems="stretch"
            spacing={0}
            className={classes.appContent}
            data-testid="app"
        >
            <Grid item xs={8}>
                <Grid
                    container
                    className="main-content"
                    direction="column"
                    alignContent="stretch"
                    spacing={2}
                >
                    <Grid item>
                        <Header />
                    </Grid>
                    <Grid item>
                        <StockInfo />
                    </Grid>
                    <Grid item>
                        <StockChart />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={4} className="side-bar">
                <Grid container spacing={1} direction="column">
                    <Grid item>
                        <LiquidBalance />
                    </Grid>
                    <Grid item>
                      <Portfolio />
                    </Grid>
                    <Grid item>
                        <WatchList />
                    </Grid>
                    <Grid item >
                        <Card>
                            <CardContent>
                                <BuyBox />
                                <Divider />
                                <SellBox />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default App;
