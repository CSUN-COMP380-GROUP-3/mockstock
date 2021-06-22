// import WebSocket from 'ws';
import { TOKEN } from '../contexts/TokenContext';
// import { Listener, WebSocketRawData } from '../interfaces/WebSocketData';

const url = `wss://ws.finnhub.io?token=${TOKEN}`;

let socket = new WebSocket(url);
export default socket;