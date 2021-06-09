import React from 'react';
import { WatchListContext } from '../../contexts/WatchListContext';
import socket, { subscribe } from './websocket';
import currency from 'currency.js';
import { WebSocketRawData } from '../../interfaces/WebSocketData';
import moment from 'moment';

export default function WatchList() {
    const isInit = React.useRef(false);
    const { watchList, updateWatchList } = React.useContext(WatchListContext);
    
    const cleanUp = () => { // need to think of a way to close this socket
        socket.close();
        console.log('closing socket');
    };


    React.useEffect(() => {
        if (!isInit.current) {
            console.log('adding listeners to socket');
            socket.addEventListener('open', () => {
                socket.addEventListener('message', ({data}) => {
                    if (!!data && typeof data === 'string') {
                        const dataObj: WebSocketRawData = JSON.parse(data);
                        dataObj['data']?.forEach(({s, p, t}) => {
                            let newWatchList = {...watchList};
                            newWatchList.stocks[s]['price'] = currency(p);
                            newWatchList.lastUpdated = moment(t);
                            updateWatchList(newWatchList);
                        });
                    };
                });
    
                Object.keys(watchList.stocks).forEach(subscribe);
            });
        };
        isInit.current = true;
    });

    return <React.Fragment>
        <div data-testid="watchlist">
            <h1>WatchList</h1>
            {Object.values(watchList.stocks).map(({symbol, price}, idx) => <li key={idx}>{`${symbol} - ${price?.format()}`}</li>)}
        </div>
    </React.Fragment>;
};