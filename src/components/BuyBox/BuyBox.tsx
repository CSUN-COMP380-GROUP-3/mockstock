<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
import React, {useEffect} from 'react';
import moment, { Moment } from 'moment';
import { ActiveInvestmentContext } from '../../contexts/ActiveInvestmentContext';
import { TradesContext } from '../../contexts/TradesContext';



import SymbolBox from '../SymbolBox/SymbolBox';
import DatePicker from '../DatePicker/DatePicker';
import Input from '../Input/Input';
import Button from '@material-ui/core/Button';
import { BaseKeyboardPickerProps } from '@material-ui/pickers/_shared/hooks/useKeyboardPickerState';
import axios from 'axios';
import querystring from 'querystring';
import { TokenContext } from '../../contexts/TokenContext';
import currency from 'currency.js';
import CandleStickData, { CandleStickQuery } from '../../interfaces/CandleStickData';
import Trade from '../../interfaces/Trade';

<<<<<<< Updated upstream
import { truncateDecimal } from '../StatBox/StatBox';
=======
const truncateDecimal = (percent: string, places?: number) => {
    const decimalIndex = percent.indexOf('.') + 1;
    return percent.slice(0, decimalIndex + (places || 2));
};
>>>>>>> Stashed changes

export default function BuyBox() {
    const token = React.useContext<string>(TokenContext);

    const { activeInvestment, updateActiveInvestment } = React.useContext(ActiveInvestmentContext);
    const { trades, updateTrades } = React.useContext(TradesContext);

    // useEffect here just to test if trades context working properly
    useEffect(() => {
        if(trades.items.length > 0) {
            console.log(trades.items)
        }
    })

    const { stock, to, from, amount, candles } = activeInvestment;

    const endpoint = 'https://finnhub.io/api/v1/stock/candle?';

    const [ oneDayCandle, updateOneDayCandle ] = React.useState<CandleStickData | undefined>(candles);
    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////
    // FUNCTIONS BELOW ARE DUPLICATE FROM StatBox, refactor to another file later

    const getAmountInvested = () => {
        return currency(amount);
    };

    const getBuyInPrice = () => { // we assume perfect market entry, meaning we buy at the lowest price at the start of our investment term
        return currency(candles?.l[0]!);
    };

    const getSellPrice = () => { // we assume perfect exit, meaning we sell at the highest price at the end of our investment term
        const length = candles?.h.length!;
        return currency(candles?.h[length-1]!);
    };

    const getShares = () => {
        const amountInvested = getAmountInvested().value;
        const buyIn = getBuyInPrice().value;
        return amountInvested / buyIn;
    };

    const getInvestmentTotal = () => { // number of shares sold at the final price
        const shares = getShares();
        const sellPrice = getSellPrice();
        return currency(shares * sellPrice.value);
    };
<<<<<<< Updated upstream

    // https://www.investopedia.com/ask/answers/how-do-you-calculate-percentage-gain-or-loss-investment/
    const getInvestmentPercentage = () => {
        const end = getSellPrice().value;
        const start = getBuyInPrice().value;
        return ((end - start) / start) * 100;
    };

    const getInvestmentProfit = () => {
        const end = getInvestmentTotal();
        const start = getAmountInvested();
        return end.subtract(start);
    };
    // FUNCTIONS ABOVE ^^ ARE DUPLICATE FROM StatBox, refactor to another file later
    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////
    

=======

    // https://www.investopedia.com/ask/answers/how-do-you-calculate-percentage-gain-or-loss-investment/
    const getInvestmentPercentage = () => {
        const end = getSellPrice().value;
        const start = getBuyInPrice().value;
        return ((end - start) / start) * 100;
    };

    const getInvestmentProfit = () => {
        const end = getInvestmentTotal();
        const start = getAmountInvested();
        return end.subtract(start);
    };
    // FUNCTIONS ABOVE ^^ ARE DUPLICATE FROM StatBox, refactor to another file later
    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////
    

>>>>>>> Stashed changes
    const updateStartDate: BaseKeyboardPickerProps['onChange'] = async (date) => {
        if (!!date) {
            updateActiveInvestment({
                ...activeInvestment,
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
    
            updateActiveInvestment({
                ...activeInvestment,
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
    
            updateActiveInvestment({
                ...activeInvestment,
                candles: res.data,
                to: date as Moment
            });

        };
    };

    const updateAmount = (event: any) => {
        updateActiveInvestment({
            ...activeInvestment,
            amount: event.target.value
        });
    };

    const updateSymbol = async (event: any, value: any) => {
        if (!!value) {
            updateActiveInvestment({
                ...activeInvestment,
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

            updateActiveInvestment({
                ...activeInvestment,
                stock: value,
                candles: res.data,
            });
        };

        
    };

    const onClickHandler = async () => {
        try {
            const stockProfile = stock
            const startDate = to
            const endDate = from
            const buyInPrice = getBuyInPrice()
            const sellPrice = getSellPrice()
            const getInvestmentAmount = getAmountInvested()
            const timestamp = moment() 

            let trade: Trade;

            trade = {
                stock: stockProfile,
                startDate: startDate,
                endDate: endDate,
                buyInPrice: buyInPrice,
                sellPrice: sellPrice,
                amount: getInvestmentAmount,
                timestamp: timestamp
            }

            updateTrades({
                ...trades,
                items: [trade, ...trades.items]
            })
 
        } catch(error) {
            errorHandler(error);
        };
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

    const getShareEstimate = () => {
        // after the inital data is loaded we take the first candle and use that for our calculation
        // we assume that we had perfect entry into the market that day and bought at the lowest price available
        if (!!oneDayCandle) {
            const price = currency(oneDayCandle['l'][0]).value;
            const shares = currency(amount).value / price;

            return `${truncateDecimal(shares.toString(), 4)} shares @ $${price.toString()}`;
        };
        return '';
    };

    return <React.Fragment>
        <h2>BuyBox</h2>
        <form>
            <SymbolBox value={stock} onChange={updateSymbol}/>
            <DatePicker id="startDate" label="Start Date" value={from} onChange={updateStartDate}/>
            <DatePicker id="endDate" label="End Date" value={to} onChange={updateEndDate}/>
            <Input 
                id="amount" 
                label="Amount" 
                variant="standard"
                inputProps={{
                    type: 'number',
                    min: '0'
                }}
                helperText={getShareEstimate()}
                adornment="$"
                value={amount}
                onChange={updateAmount}
            />
            <Button variant="contained" onClick={onClickHandler}>Buy</Button>
        </form>
    </React.Fragment>
};