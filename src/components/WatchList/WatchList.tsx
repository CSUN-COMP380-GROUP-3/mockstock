import React from 'react';
import { WatchListContext } from '../../contexts/WatchListContext';
import socket, { subscribe } from './websocket';
import currency from 'currency.js';
import { WebSocketRawData } from '../../interfaces/WebSocketData';
import moment from 'moment';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import WatchListItem from '../WatchListItem/WatchListItem';
import { makeStyles } from '@material-ui/core/styles';

export default function WatchList() {
    const isInit = React.useRef(false);
    const { watchList, updateWatchList } = React.useContext(WatchListContext);
    
    // const cleanUp = () => { // need to think of a way to close this socket
    //     socket.close();
    //     console.log('closing socket');
    // };


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

    // function renderRow(props: ListChildComponentProps) {
    //     const { index, style } = props;
        
    //     return (
    //         <WatchListItem key={index} style={style} value={watchList[index]}/>
    //     );
    // };

    const Row = (props: ListChildComponentProps) => {
        const { index, style } = props;
        const data = Object.values(watchList.stocks)[index];
        return (
            <WatchListItem key={index} style={style} data={data}></WatchListItem>
        );
    };

    const useStyles = makeStyles({
        root: {
            height: '100%',
        }
    });

    const classes = useStyles();

    return <React.Fragment>
        <Card data-testid="watchlist" className={classes.root}>
            <CardHeader title="Watchlist"></CardHeader>
            <CardContent>
                <FixedSizeList height={400} width={400} itemSize={80} itemCount={Object.keys(watchList.stocks).length}>
                    {Row}
                </FixedSizeList>
            </CardContent>
        </Card>
    </React.Fragment>;
};