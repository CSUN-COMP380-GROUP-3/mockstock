import React, { useEffect } from 'react';
import Card, { CardProps } from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { WatchListData } from '../../contexts/WatchListContext';
import { ActiveInvestmentContext } from '../../contexts/ActiveInvestmentContext';
import CandleStickData, { CandleStickQuery } from '../../interfaces/CandleStickData';
import { TokenContext } from '../../contexts/TokenContext';
import axios from 'axios';
import moment, { Moment } from 'moment';
import querystring from 'querystring';


const endpoint = 'https://finnhub.io/api/v1/stock/candle?';



export interface PortfolioListItemProps extends CardProps {
    data: any;
};

export default function PortfolioListItem(props: PortfolioListItemProps) {
    const token = React.useContext<string>(TokenContext);

    

    const { activeInvestment, updateActiveInvestment } = React.useContext(ActiveInvestmentContext);

    const { stock, to, from, candles } = activeInvestment;

    const [ oneDayCandle, updateOneDayCandle ] = React.useState<CandleStickData | undefined>(candles);


     // there is an issue with this, if the start date is not a trading day then we must get the next available trading day
     const fetchAndUpdateOneDayCandles = async (query: CandleStickQuery) => {
        try {
            const res = await fetchCandles(query);
            

            // we need to consider that the start date may be a weekend or non stock market holiday in which the markets are closed
            // because we are limited to 30 api calls / second we will delay our calls by 100ms to ensure we do not get rate limited
            if (res.data.s !== 'ok') {
                console.log('no data available for current trading day, checking next weekday...');
                // we need to call this function again but this time we need to get the next available weekday
                const prevFrom = moment.unix(query.from);
                const prevDay = prevFrom.day();
                // if the day is a saturday we add 2 extra days, otherwise we increment the previous day by 1
                const from = prevDay === 6 ?
                    prevFrom.add(2, 'day') : 
                    prevFrom.add(1, 'day');
                
                setTimeout(fetchAndUpdateOneDayCandles, 100, {
                    ...query,
                    from: from.unix(),
                    to: from.unix(),
                });
                return;
            };
            console.log(res.data);
            updateOneDayCandle(res.data);
        } catch(error) {
            errorHandler(error);
        };
    };

    const fetchCandles = (query: CandleStickQuery) => {
        const urlParams = querystring.stringify(query as any);
        console.log('fetching', urlParams);
        return axios.get(endpoint + urlParams);
    };

    const errorHandler = (error: any) => { // generic error handler
        if (error.response?.status === 401) {
            console.log("Invalid token, please make sure it is set as react app environment variable");
        };
        console.error(error);
    };
    


    const { style, data } = props;
    const useStyles = makeStyles({
        root: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            '& .symbol': {
                marginLeft: '1rem'
            },
            '& .details': {
                marginRight: '1rem',
                '& .dollar': {
                    textAlign: 'right',
                },
                '& .percent': {
                    textAlign: 'right',
                }
            }

        }
    });
    const { root } = useStyles();

    const onClick = async () => {
        console.log('clicked')
        console.log(data.shares)

        const res = await fetchCandles({
            symbol: data.stock.symbol,
            to: to.unix(),
            from: from.unix(),
            resolution: 'D',
            token,
        });

        updateActiveInvestment({
            ...activeInvestment,
            candles: res.data,
            stock: data.stock
        });
    };

    return (
        <Card data-testid="watchlistitem" style={style} className={root} onClick={onClick}>
            <Typography variant="h6" className="symbol">{data.stock.symbol}</Typography>
            <div className="details" >
                {/* <Typography variant="h6" className="dollar" data-testid="watchlistitem-dollar">{!!data.price ? data.price.format() : '$-'}</Typography>
                <Typography variant="subtitle2" className="percent" data-testid="watchlistitem-percent">(-%)</Typography> */}
                <Typography variant="subtitle2" className="percent" data-testid="watchlistitem-percent">{!!data.price.value ? data.price.value : null}</Typography>
                <Typography variant="subtitle2" className="percent" data-testid="watchlistitem-percent">{!!data.shares ? data.shares : null}</Typography>

            </div>
        </Card>
    );
};