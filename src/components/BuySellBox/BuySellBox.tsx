import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import moment, { Moment } from 'moment';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import currency from 'currency.js';
import CandleStickData, { CandleStickQuery } from '../../interfaces/CandleStickData';
import querystring from 'querystring';
import axios from 'axios';
import { TokenContext } from '../../contexts/TokenContext';
import Trade from '../../interfaces/Trade';
import { TradesContext } from '../../contexts/TradesContext';




import DatePicker from '../DatePicker/DatePicker';
import { BaseKeyboardPickerProps } from '@material-ui/pickers/_shared/hooks/useKeyboardPickerState';
import { minDate } from '../../components/DatePicker/DatePicker';


import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import { LiquidBalanceContext } from '../../contexts/LiquidBalanceContext';
import { ActiveInvestmentContext } from '../../contexts/ActiveInvestmentContext';
import { act } from 'react-dom/test-utils';



const useStyles = makeStyles({
  root: {
    width: 250,
  },
  input: {
    width: 95,
  },
});

const endpoint = 'https://finnhub.io/api/v1/stock/candle?';


export default function InputSlider() {
    const token = React.useContext<string>(TokenContext);

    const classes = useStyles();
    const [value, setValue] = React.useState<number | string | Array<number | string>>(0);

    const { liquidBalance, updateLiquidBalance } = React.useContext(LiquidBalanceContext);
    const { trades, updateTrades } = React.useContext(TradesContext);


    const { activeInvestment, updateActiveInvestment } = React.useContext(ActiveInvestmentContext);

    const [ oneDayCandle, updateOneDayCandle ] = React.useState<CandleStickData | undefined>(activeInvestment.candles);



    const { curr } = liquidBalance;

    const [ buyInfo, setBuyInfo ] = useState({
        buyAmount: currency(0),
        buyDate: minDate,
        stock: activeInvestment.stock
    })

    const { buyAmount, buyDate, stock } = buyInfo

    useEffect(() => {
        setBuyInfo({
            ...buyInfo,
            stock: activeInvestment.stock
        })
        fetchAndUpdateOneDayCandles({
            symbol: activeInvestment.stock.symbol,
            from: buyDate.unix(),
            to: buyDate.unix(),
            resolution: 'D',
            token,
        }); 
        console.log(trades)
    }, [activeInvestment.stock, liquidBalance.curr])


    const onClick = async () => {
        // console.log('hi')
        // console.log(buyDate)
        // console.log(buyAmount)
        // console.log(stock)
        // console.log(buyDate.toDate())
        // GET FULL YEAR CANDLES, THEN SEARCH BY DATE
        
        // const res = await fetchCandles({
        //     symbol: stock.symbol,
        //     to: moment().unix(),
        //     from: minDate.unix(),
        //     resolution: 'D',
        //     token,
        // });
        // fetchAndUpdateOneDayCandles({
        //     symbol: stock.symbol,
        //     from: buyDate.unix(),
        //     to: buyDate.unix(),
        //     resolution: 'D',
        //     token,
        // });  
        let hold = ''
        if(!!oneDayCandle) {
            // console.log(oneDayCandle["c"][0])
            hold = oneDayCandle["c"][0].toString()
        }
        try {
            let trade: Trade = {
                stock,
                date: buyDate,
                price: currency(hold),
                amount: buyAmount,
                isBuy: true,
                timestamp: moment(),
            };

            updateTrades({
                ...trades,
                items: [trade, ...trades.items]
            })

            let hold2 = currency(liquidBalance.curr.value - buyAmount.value)

            updateLiquidBalance({
                ...liquidBalance,
                prev: liquidBalance.curr,
                curr: currency(liquidBalance.curr.value - buyAmount.value)
            })

            setValue(Number(0))

            setBuyInfo({
                buyAmount: currency(0),
                buyDate: minDate,
                stock: activeInvestment.stock
            })
 
        } catch(error) {
            errorHandler(error);
        };
    }





    const handleSliderChange = (event: any, newValue: number | number[]) => {
        setValue(newValue);
        
        var g = newValue.toString()

        setBuyInfo({
            ...buyInfo,
            buyAmount: currency(g)
        })
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value === '' ? '' : Number(event.target.value).toFixed(2));
        // console.log(event.target)
        // setValue(event.target.value === '' ? '' : Number(event.target.value));

        var g = Number(event.target.value).toFixed(2).toString()

        setBuyInfo({
            ...buyInfo,
            buyAmount: currency(g)
        })
    };

    const handleBlur = () => {
    if (value < 0) {
        setValue(0);
    } else if (value > curr.value) {
        setValue(curr.value);
    }
    };

    const updateBuyDate: BaseKeyboardPickerProps['onChange'] = async (date) => {
        if (!!date) {
           console.log(date.unix())
           console.log(date as Moment)
           setBuyInfo({
               ...buyInfo,
               buyDate: date
           })
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

    return (
        <div className={classes.root}>
            <form>
                <Typography id="input-slider" gutterBottom>
                    BUY {!!activeInvestment.stock ? activeInvestment.stock.symbol : null}
                </Typography>
                <DatePicker id="buyDate" label="Buy Date" value={buyDate} onChange={updateBuyDate}/>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <MonetizationOnIcon /> 
                    </Grid>
                    <Grid item xs>
                        <Slider
                            value={typeof value === 'number' ? value : 0}
                            onChange={handleSliderChange}
                            aria-labelledby="input-slider"
                            max={curr.value}
                            step={0.01}
                        />
                    </Grid>
                    <Grid item>
                        <Input
                        className={classes.input}
                        value={value}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        inputProps={{
                            step: 0.01,
                            min: 0,
                            max: curr.value,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
                        />
                    </Grid>
                </Grid>
                <Button disabled={liquidBalance.curr.intValue < 1} variant="contained" onClick={onClick}>BUY</Button>
                
            </form>
        </div>
    );
}
