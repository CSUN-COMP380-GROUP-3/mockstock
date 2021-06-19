import React from 'react';
import { PortfolioContext } from '../../contexts/PortfolioContext';
import currency from 'currency.js';
import moment from 'moment';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import PortfolioItem from '../PortfolioItem/PortfolioItem';
import { makeStyles } from '@material-ui/core/styles';

export default function PortfolioList() {
    const isInit = React.useRef(false);
    const { stocks, updateStocks } = React.useContext(PortfolioContext);
    
    // function renderRow(props: ListChildComponentProps) {
    //     const { index, style } = props;
        
    //     return (
    //         <WatchListItem key={index} style={style} value={watchList[index]}/>
    //     );
    // };
    React.useEffect(() => {
    },[PortfolioContext]);

    const Row = (props: ListChildComponentProps) => {
        const { index, style } = props;
        const data = Object.values(stocks.items)[index];
        return (
            <PortfolioItem key={index} style={style} 
            data={data}>

            </PortfolioItem>
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
                <FixedSizeList height={400} width={400} itemSize={80} itemCount={Object.keys(stocks.items).length}>
                    {Row}
                </FixedSizeList>
            </CardContent>
        </Card>
    </React.Fragment>;
};