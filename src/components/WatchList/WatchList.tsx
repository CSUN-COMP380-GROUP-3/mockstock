import React from 'react';
import { WatchListContext } from '../../contexts/WatchListContext';
import socket, { subscribe } from '../websocket';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import WatchListItem from '../WatchListItem/WatchListItem';
import "./WatchList.css";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

export default function WatchList() {

    const { watchList, updateWatchList } = React.useContext(WatchListContext);

    // const cleanUp = () => { // TODO: need to think of a way to close this socket

    // };

    /**
     * Once we detect that the websocket is open and working, we subscribe to each symbol in the WatchListContext
     */
    React.useEffect(() => {
        if (socket.OPEN) {
            socket.addEventListener('open', () => {
                console.log('socket is open');
                watchList.stockSymbols.forEach(subscribe);
            });
        };
    }, [socket.OPEN]);

    return <React.Fragment>
        <Card data-testid="watchlist">
            <CardHeader title="Watchlist"></CardHeader>
            <CardContent className="watch-list">
                <List>
                    {Object.keys(watchList.stockSymbols).map((symbol, index) => {
                        return (<ListItem key={index}>
                            <WatchListItem symbol={watchList.stockSymbols[index]}></WatchListItem>
                        </ListItem>);
                    })}
                </List>
            </CardContent>
        </Card>
    </React.Fragment>;

};