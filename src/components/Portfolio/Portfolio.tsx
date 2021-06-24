import React from 'react';
import { PortfolioContext, portfolioProvider } from '../../contexts/PortfolioContext';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import PortfolioItem from '../PortfolioItem/PortfolioItem';
import { makeStyles } from '@material-ui/core/styles';

export default function Portfolio() {
    const portfolio = React.useContext(PortfolioContext);

    const Row = (props: ListChildComponentProps) => {
        const { index, style } = props;

        const data = Object.values(portfolio)[index];

        return (
            <PortfolioItem 
                key={index} 
                style={style} 
                data={data}
            />
        );
    };

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
                <FixedSizeList height={400} width={400} itemSize={80} itemCount={portfolioProvider.length}>
                    {Row}
                </FixedSizeList>
            </CardContent>
        </Card>
    </React.Fragment>;
};