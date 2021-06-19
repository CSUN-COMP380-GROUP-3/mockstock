import React, {useEffect} from 'react';
import moment, { Moment } from 'moment';
import { ActiveStockContext } from '../../contexts/ActiveStockContext';
import SymbolBox from '../SymbolBox/SymbolBox';
import DatePicker from '../DatePicker/DatePicker';
import Button from '@material-ui/core/Button';
import { BaseKeyboardPickerProps } from '@material-ui/pickers/_shared/hooks/useKeyboardPickerState';
import axios from 'axios';
import querystring from 'querystring';
import { TokenContext } from '../../contexts/TokenContext';
import currency from 'currency.js';
import CandleStickData, { CandleStickQuery } from '../../interfaces/CandleStickData';

export default function BuyBox() {
    const token = React.useContext<string>(TokenContext);

    const { activeStock, updateActiveStock } = React.useContext(ActiveStockContext);

    const { stock, to, from, candles } = activeStock;

    const endpoint = 'https://finnhub.io/api/v1/stock/candle?';

    const [ oneDayCandle, updateOneDayCandle ] = React.useState<CandleStickData | undefined>(candles);

    const getBuyInPrice = () => { // we assume perfect market entry, meaning we buy at the lowest price at the start of our investment term
        return currency(candles?.l[0]!);
    };

    const getSellPrice = () => { // we assume perfect exit, meaning we sell at the highest price at the end of our investment term
        const length = candles?.h.length!;
        return currency(candles?.h[length-1]!);
    };
    
    const updateStartDate: BaseKeyboardPickerProps['onChange'] = async (date) => {
        if (!!date) {
            updateActiveStock({
                ...activeStock,
                from: date as Moment,
            });
    
            // we fetch new candle data so estimated shares can be calculated
            fetchAndUpdateOneDayCandles({
                symbol: stock.symbol,
                from: date.unix(),
                to: date.unix(),
                resolution: 'D',
                token,
            });  

            const from = date as Moment
            
            const res = await fetchCandles({
                symbol: stock.symbol,
                to: to.unix(),
                from: from.unix(),
                resolution: 'D',
                token,
            });
    
            updateActiveStock({
                ...activeStock,
                candles: res.data,
                from: date as Moment
            });
        };      
    };

    const updateEndDate: BaseKeyboardPickerProps['onChange'] = async (date) => {
        if (!!date) {
            const res = await fetchCandles({
                symbol: stock.symbol,
                to: date.unix(),
                from: from.unix(),
                resolution: 'D',
                token,
            });
    
            updateActiveStock({
                ...activeStock,
                candles: res.data,
                to: date as Moment
            });

        };
    };

    const updateSymbol = async (event: any, value: any) => {
        if (!!value) {
            updateActiveStock({
                ...activeStock,
                stock: value,
            });

            // we fetch new candle data so estimated shares can be calculated
            fetchAndUpdateOneDayCandles({
                symbol: value.symbol,
                from: from.unix(),
                to: to.unix(),
                resolution: 'D',
                token,
            });

            const res = await fetchCandles({
                symbol: value.symbol,
                to: to.unix(),
                from: from.unix(),
                resolution: 'D',
                token,
            });

            updateActiveStock({
                ...activeStock,
                stock: value,
                candles: res.data,
            });
        };

        
    };

    const onClickHandler = async () => {
        // try {
        //     let trade: Trade = {
        //         stock,
        //         startDate: from,
        //         endDate: to,
        //         buyInPrice: getBuyInPrice(),
        //         sellPrice: getSellPrice(),
        //         amount: currency(0),
        //         timestamp: moment(),
        //     };

        //     updateTrades({
        //         ...trades,
        //         items: [trade, ...trades.items]
        //     })
 
        // } catch(error) {
        //     errorHandler(error);
        // };
    };

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
    
    return <React.Fragment>
        <h2>{stock.symbol}</h2>
        <form>
            <SymbolBox value={stock} onChange={updateSymbol}/>
            <DatePicker id="startDate" label="Start Date" value={from} onChange={updateStartDate}/>
            <DatePicker id="endDate" label="End Date" value={to} onChange={updateEndDate}/>
            <Button variant="contained" onClick={onClickHandler}>Buy</Button>
        </form>
    </React.Fragment>
};