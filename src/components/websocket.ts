// import WebSocket from 'ws';
import { TOKEN } from '../contexts/TokenContext';

const url = `wss://ws.finnhub.io?token=${TOKEN}`;

let socket = new WebSocket(url);
export default socket;

export const subscribe = (symbol: string) => {
    socket.send(JSON.stringify({type: 'subscribe', symbol}));
};

export const unsubscribe = (symbol: string) => {
    socket.send(JSON.stringify({type: 'unsubscribe', symbol}));
};