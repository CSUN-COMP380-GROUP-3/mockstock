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
import { TradesContext } from '../../contexts/TradesContext';

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
    table: {
        minWidth: 700,
    },
});

export default function TradeHistoryTable() {
    const classes = useStyles();

    const tradesContext = React.useContext(TradesContext);

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Stock Symbol </StyledTableCell>
                        <StyledTableCell align="right">
                            Date and Time of Trade
                        </StyledTableCell>
                        <StyledTableCell align="right">
                            Price of Stock&nbsp;
                        </StyledTableCell>
                        <StyledTableCell align="right">
                            Total Amount Purchased&nbsp;
                        </StyledTableCell>
                        <StyledTableCell align="right">
                            TYPE&nbsp;
                        </StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tradesContext.map((trade) => (
                        <StyledTableRow key={trade.stock.symbol}>
                            <StyledTableCell component="th" scope="trade">
                                {trade.stock.symbol}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                {trade.date.format()}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                {trade.price?.value}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                {trade.total.value}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                {trade.type}
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
