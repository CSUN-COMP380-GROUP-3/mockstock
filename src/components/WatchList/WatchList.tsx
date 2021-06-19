import React from 'react';
import { WatchListContext } from '../../contexts/WatchListContext';
import socket, { subscribe } from './websocket';
import currency from 'currency.js';
import { WebSocketRawData } from '../../interfaces/WebSocketData';
import moment from 'moment';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import WatchListItem from '../WatchListItem/WatchListItem';

import "./WatchList.css";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

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
        socket.addEventListener('message', ({ data }) => {
          if (!!data && typeof data === 'string') {
            const dataObj: WebSocketRawData = JSON.parse(data);
            dataObj['data']?.forEach(({ s, p, t }) => {
              let newWatchList = { ...watchList };
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
    <Card data-testid="watchlist">
      <CardHeader title="Watchlist"></CardHeader>
      <CardContent className="watch-list">
        <List>
          {Object.keys(watchList.stocks).map((symbol, index) => {
            return (<ListItem key={index}>
              <WatchListItem data={watchList.stocks[symbol]}></WatchListItem>
            </ListItem>);
          })}
        </List>
      </CardContent>
    </Card>
  </React.Fragment>;
};