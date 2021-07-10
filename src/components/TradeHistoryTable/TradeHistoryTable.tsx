import React from 'react';
import {
    withStyles,
    Theme,
    createStyles,
    makeStyles,
} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { tradesProvider } from '../../contexts/TradesContext';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import currency from 'currency.js';

const StyledTableCell = withStyles((theme: Theme) =>
    createStyles({
        head: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        },
    }),
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
    createStyles({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.action.hover,
            },
        },
    }),
)(TableRow);

const useStyles = makeStyles({
    container: {
        width: "800px",
        height: "400px",
        overflowY: "scroll"
    },
});

export default function TradeHistoryTable() {
    const classes = useStyles();

    const [ trades, updateTrades ] = React.useState(tradesProvider.trades);

    React.useEffect(() => {
        const tradesSubscription = tradesProvider.trades$.subscribe(updateTrades);
        return () => { tradesSubscription.unsubscribe(); };
    }, []);

    return (
        <TableContainer component={Paper} className={classes.container}>
            <Table aria-label="customized table" stickyHeader>
                <TableHead className="handle">
                    <TableRow>
                        <StyledTableCell>Stock Symbol </StyledTableCell>
                        <StyledTableCell align="right">
                            Date Traded
                        </StyledTableCell>
                        <StyledTableCell align="right">
                            Stock Price
                        </StyledTableCell>
                        <StyledTableCell align="right">
                            Trade Amount
                        </StyledTableCell>
                        <StyledTableCell align="right">
                            Type
                        </StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {trades.map((trade) => {
                        const timestamp = moment.unix(trade.date).format("MM/DD/YYYY HH:mm:ss A");
                        return (
                            <StyledTableRow key={'t'+uuid()}>
                                <StyledTableCell component="th" scope="trade">
                                    {trade.stock.symbol}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    {timestamp}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    {currency(trade.price!).format()}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    {currency(trade.total).format()}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    {trade.type}
                                </StyledTableCell>
                            </StyledTableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
