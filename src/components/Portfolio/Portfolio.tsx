import React from 'react';
import { PortfolioContext, portfolioProvider } from '../../contexts/PortfolioContext';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import PortfolioItem from '../PortfolioItem/PortfolioItem';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';

export default function Portfolio() {
    const portfolio = React.useContext(PortfolioContext);

    const useStyles = makeStyles({
        root: {
            height: '100%',
        }
    });

    const classes = useStyles();

    return <React.Fragment>
        <Card data-testid="portfoliolist" className={classes.root}>
            <CardHeader title="Portfolio"></CardHeader>
            <CardContent>
                <List>
                    { Object.entries(portfolio).map(([key, value]) => {
                        return <PortfolioItem
                            key={key}
                            data={value}
                        />
                    })}
                </List>
            </CardContent>
        </Card>
    </React.Fragment>;
};