import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import moment, { Moment } from 'moment';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import VolumeUp from '@material-ui/icons/VolumeUp';
import DatePicker from '../DatePicker/DatePicker';
import { BaseKeyboardPickerProps } from '@material-ui/pickers/_shared/hooks/useKeyboardPickerState';
import { minDate } from '../../components/DatePicker/DatePicker';


import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import { LiquidBalanceContext } from '../../contexts/LiquidBalanceContext';



const useStyles = makeStyles({
  root: {
    width: 250,
  },
  input: {
    width: 80,
  },
});

export default function InputSlider() {
    const classes = useStyles();
    const [value, setValue] = React.useState<number | string | Array<number | string>>(0);

    const { liquidBalance, updateLiquidBalance } = React.useContext(LiquidBalanceContext);

    const { curr } = liquidBalance;

    const [ buyInfo, setBuyInfo ] = useState({
        buyAmount: '',
        buyDate: minDate,
    })

    const { buyAmount, buyDate } = buyInfo

    // const firstSchool = school_list[0]

    // const onChange = e => {
    //     console.log('hi')
    //     console.log(employee)
    //     console.log(e.target.value)
    //     setEmployee({ ...employee, [e.target.name]: e.target.value })
    // }


     // useEffect here just to test if trades context working properly
    //  useEffect(() => {
    //     console.log(curr.value)
    //     console.log(typeof curr.value)
    //         // eslint-disable-next-line

    // })



    const handleSliderChange = (event: any, newValue: number | number[]) => {
        setValue(newValue);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value === '' ? '' : Number(event.target.value));
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
        };      
    };


    return (
        <div className={classes.root}>
            <form>
                <Typography id="input-slider" gutterBottom>
                    BUY
                </Typography>
                <DatePicker id="buyDate" label="Buy Date" value={buyDate} onChange={updateBuyDate}/>

                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <MonetizationOnIcon /> 
                        
                        {/* <VolumeUp /> */}
                    </Grid>
                    <Grid item xs>
                        <Slider
                        value={typeof value === 'number' ? value : 0}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                        max={curr.value}
                        />
                    </Grid>
                    <Grid item>
                        <Input
                        className={classes.input}
                        value={value}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: curr.value,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
                        />
                    </Grid>
                </Grid>
            </form>
        </div>
    );
}









// import React, {useEffect} from 'react';
// import moment, { Moment } from 'moment';
// import { ActiveInvestmentContext } from '../../contexts/ActiveInvestmentContext';
// import { TradesContext } from '../../contexts/TradesContext';
// import SymbolBox from '../SymbolBox/SymbolBox';
// import DatePicker from '../DatePicker/DatePicker';
// import Input from '../Input/Input';
// import Button from '@material-ui/core/Button';
// import { BaseKeyboardPickerProps } from '@material-ui/pickers/_shared/hooks/useKeyboardPickerState';
// import axios from 'axios';
// import querystring from 'querystring';
// import { TokenContext } from '../../contexts/TokenContext';
// import currency from 'currency.js';
// import CandleStickData, { CandleStickQuery } from '../../interfaces/CandleStickData';
// import Trade from '../../interfaces/Trade';

// export default function BuyBox() {
//     const token = React.useContext<string>(TokenContext);

    // const { activeInvestment, updateActiveInvestment } = React.useContext(ActiveInvestmentContext);
//     const { trades, updateTrades } = React.useContext(TradesContext);

//     // useEffect here just to test if trades context working properly
//     useEffect(() => {
//         if(trades.items.length > 0) {
//             console.log(trades.items)
//         }
//     })

//     const { stock, from, to } = activeInvestment;


    
//     const getAmountInvested = () => {
//         return currency(amount);
//     };

//     // const getBuyInPrice = () => { // we assume perfect market entry, meaning we buy at the lowest price at the start of our investment term
//     //     return currency(candles?.l[0]!);
//     // };

//     // const getSellPrice = () => { // we assume perfect exit, meaning we sell at the highest price at the end of our investment term
//     //     const length = candles?.h.length!;
//     //     return currency(candles?.h[length-1]!);
//     // };

    
    // const updateStartDate: BaseKeyboardPickerProps['onChange'] = async (date) => {
    //     if (!!date) {
           
    //     };      
    // };

//     const updateEndDate: BaseKeyboardPickerProps['onChange'] = async (date) => {
//         if (!!date) {
            
//             console.log(date)

//         };
//     };

//     const updateAmount = (event: any) => {
//         updateActiveInvestment({
//             ...activeInvestment,
//             amount: event.target.value
//         });
//     };


//     const onClickHandlerBuy = async () => {
//         try {
//             let trade: Trade = {
//                 stock,
//                 date: from,
//                 price: getBuyInPrice(),
//                 amount: getAmountInvested(),
//                 isBuy: true,
//                 timestamp: moment(),
//             };

//             updateTrades({
//                 ...trades,
//                 items: [trade, ...trades.items]
//             })
 
//         } catch(error) {
//             errorHandler(error);
//         };
//     };

//     const onClickHandlerSell = async () => {
//         try {
//             let trade: Trade = {
//                 stock,
//                 date: from,
//                 price: getBuyInPrice(),
//                 amount: getAmountInvested(),
//                 isBuy: true,
//                 timestamp: moment(),
//             };

//             updateTrades({
//                 ...trades,
//                 items: [trade, ...trades.items]
//             })
 
//         } catch(error) {
//             errorHandler(error);
//         };
//     };

   
   

//     const errorHandler = (error: any) => { // generic error handler
//         if (error.response?.status === 401) {
//             console.log("Invalid token, please make sure it is set as react app environment variable");
//         };
//         console.error(error);
//     };

//     // const getShareEstimate = () => {
//     //     // after the inital data is loaded we take the first candle and use that for our calculation
//     //     // we assume that we had perfect entry into the market that day and bought at the lowest price available
//     //     if (!!oneDayCandle) {
//     //         const price = currency(oneDayCandle['l'][0]).value;
//     //         const shares = currency(amount).value / price;

//     //         return `${shares.toFixed(4).toString()} shares @ $${price.toString()}`;
//     //     };
//     //     return '';
//     // };

//     return <React.Fragment>
//         <h2>BuySellBox</h2>
//         <form>
//             {/* <Input 
//                 id="amount" 
//                 label="Amount" 
//                 variant="standard"
//                 inputProps={{
//                     type: 'number',
//                     min: '0'
//                 }}
//                 helperText={getShareEstimate()}
//                 adornment="$"
//                 value={amount}
//                 onChange={updateAmount}
//             /> */}
//             <DatePicker id="startDate" label="Start Date" value={from} onChange={updateStartDate}/>
//             <Button variant="contained" onClick={onClickHandlerBuy}>Buy</Button>
//             <DatePicker id="endDate" label="End Date" value={to} onChange={updateEndDate}/>
//             <Button variant="contained" onClick={onClickHandlerSell}>Sell</Button>
//         </form>
//     </React.Fragment>
// };