import React from 'react';
import Typography from '@material-ui/core/Typography';
import { activeStockProvider } from '../../contexts/ActiveStockContext';
import { liquidBalanceProvider } from '../../contexts/LiquidBalanceContext';
import DatePicker, { minDate, maxDate } from '../DatePicker/DatePicker';
import moment from 'moment';
import { BaseKeyboardPickerProps } from '@material-ui/pickers/_shared/hooks/useKeyboardPickerState';
import { Button } from '@material-ui/core';
import Trade from '../../interfaces/Trade';
import Slider from '../Slider/Slider';
import Input from '../Input/Input';
import { tradesProvider } from '../../contexts/TradesContext';
import "./SellBox.css";
import { portfolioProvider } from '../../contexts/PortfolioContext';
import AssetTracker from '../assetTracker';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import currency from 'currency.js';

const useStyles = makeStyles({
    root: {
        paddingTop: "1rem",
    },
    sellButton: {
        backgroundColor: "var(--red)",
        color: "white",
        width: "100%",
        border: "2px solid var(--less-dark)",
        "&:hover": {
            backgroundColor: "var(--red)",
        },
        "&:disabled": {
            backgroundColor: "var(--less-red)"
        }
    },
    inputLabel: {
        paddingBottom: ".1rem"
    },
    sliderContainer: {
        paddingLeft: '1rem',
        paddingBottom: '.5rem',
    },
    slider: {
        color: "var(--less-dark)"
    }
});

export interface SellBoxForm extends Trade {
    type: 'SELL';
}

export interface SellBoxProps { }

export default function SellBox() {
    const [activeStock, updateActiveStock] = React.useState(activeStockProvider.activeStock);

    const [portfolio, updatePortfolio] = React.useState(portfolioProvider.portfolio);

    React.useEffect(() => {
        const activeStockSubscription = activeStockProvider.activeStock$.subscribe(updateActiveStock);
        const portfolioSubscription = portfolioProvider.portfolio$.subscribe(updatePortfolio);
        return () => {
            activeStockSubscription.unsubscribe();
            portfolioSubscription.unsubscribe();
        };
    }, []);

    const { stock, candles } = activeStock;

    const totalShares = portfolio[stock.symbol]?.totalShares || 0;

    // should we also keep track of the earliest date on the portfolio?
    const earliestDate = tradesProvider.getEarliestDateBySymbol(stock.symbol);

    const [form, updateForm] = React.useState<SellBoxForm>({
        date: earliestDate?.unix() || maxDate.unix(),
        total: 0,
        type: 'SELL',
        stock,
        timestamp: moment().unix(),
    });
    const { date } = form;

    // this state controls the number of shares to sell
    const [shareAmount, updateShareAmount] = React.useState(0);

    // this state controls the candlestick index
    const [candlestickIndex, updateCandlestickIndex] = React.useState(0);

    const onChangeSellDate: BaseKeyboardPickerProps['onChange'] = (date) => {
        if (!!date) {
            const index = activeStockProvider.getIndexByTimestamp(date.unix());
            if (index === -1) {
                // invalid date
                return alert(
                    'No trading data available for selected date. Please pick another date.',
                );
            }
            updateForm({
                ...form,
                date: date.unix(),
            });
            updateCandlestickIndex(index);
        }
    };

    const onClick = () => {
        const price = getPrice();
        if (price === undefined) return;
        const total = getTotal();
        if (total === undefined) return;

        AssetTracker.sellAtForAmountAt(date, moment().utcOffset(), stock.symbol, shareAmount, price);

        const trade: SellBoxForm = {
            ...form,
            stock,
            timestamp: moment().unix(),
            total,
            price,
        };

        liquidBalanceProvider.add(total);
        tradesProvider.addToTrades(trade);
        portfolioProvider.addToPortfolio(trade);

        updateShareAmount(0);
    };

    const getPrice = () => {
        return activeStockProvider.getSellPriceByIndex(candlestickIndex);
    };

    const getTotal = () => {
        const price = getPrice();
        if (price) { return price * shareAmount; };
        return 0;
    };

    const onChangeInput = (event: any) => {
        if (isNaN(event.target.value)) {
            return;
        }
        updateShareAmount(event.target.value);
    };

    const handleBlur = () => {
        if (shareAmount < 0) {
            updateShareAmount(0);
        } else if (shareAmount > totalShares) {
            updateShareAmount(totalShares);
        } else {
            // var num = Number(shareAmount).toFixed(4);
            // updateShareAmount(Number(num));
        }
    };

    const onChangeSlider: any = (
        event: React.ChangeEvent<{}>,
        value: number,
    ) => {
        updateShareAmount(value);
    };

    const getMarks = (maxShares: number) =>
        maxShares === 0
            ? []
            : [
                {
                    value: 0,
                    label: '0%',
                },
                {
                    value: maxShares * 0.25,
                    label: '25%',
                },
                {
                    value: maxShares * 0.5,
                    label: '50%',
                },
                {
                    value: maxShares * 0.75,
                    label: '75%',
                },
                {
                    value: maxShares,
                    label: '100%',
                },
            ];

    const getMaxShares = () => {
        const convertedDate = AssetTracker.convertTimestampToMidnightUTC(date, moment().utcOffset());
        const maxShares = AssetTracker.getSellableSharesAtFor(convertedDate, stock.symbol);
        return maxShares;
    }

    const isDisabled = () => {
        // here we need to check and see if the stock is in the portfolio
        // we cannot sell an asset we do not own
        // should not be able to click if there is no oneDayCandle

        // also cannot sell if the resulting trade would be less than 0;
        const resultingTrade = totalShares - shareAmount;
        return (
            candlestickIndex === -1 || totalShares <= 0 || resultingTrade < 0
        );
    };

    const classes = useStyles();

    return (
        <Grid 
            container
            spacing={1}
            className={"main-container " + classes.root}
        >
            <Grid item xs={9}>
                <Grid 
                    container
                    direction="column"
                >
                    <Grid item>
                        <Typography gutterBottom variant="h6">
                            Sell {stock.symbol}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Grid 
                            container
                            alignItems="flex-end"
                            spacing={1}
                        >
                            <Grid item xs={3}>
                                <Typography 
                                    gutterBottom 
                                    variant="body2"
                                    align="right"
                                    className={classes.inputLabel}
                                >
                                    Shares:
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Grid container direction="column">
                                    <Grid item>
                                        <Typography gutterBottom variant="caption">
                                            Est. Return: {currency(getTotal()).format()}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Input
                                            value={shareAmount}
                                            onChange={onChangeInput}
                                            onBlur={handleBlur}
                                            inputProps={{
                                                type: 'number || string',
                                                min: 0,
                                                step: 1,
                                                max: getMaxShares(),
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item className={classes.sliderContainer}>
                        <Slider
                            value={shareAmount}
                            onChange={onChangeSlider}
                            marks={getMarks(totalShares)}
                            max={getMaxShares()}
                            classes={{
                                root: classes.slider,
                            }}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={3}>
                <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                    spacing={1}
                    className="date-sellbutton-container"
                >
                    <Grid item>
                        <DatePicker
                            id="sellDate"
                            value={moment.unix(date)}
                            onChange={onChangeSellDate}
                            minDate={earliestDate || activeStockProvider.minDate || minDate}
                            maxDate={activeStockProvider.maxDate || maxDate}
                            validUnixTimestamps={candles.t}
                        />
                    </Grid>
                    <Grid item className="sellbutton-container">
                        <Button 
                            disabled={isDisabled()} 
                            onClick={onClick}
                            classes={{
                                root: classes.sellButton,
                            }}
                            variant="contained"
                        >
                            Sell
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
