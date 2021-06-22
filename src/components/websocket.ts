// import WebSocket from 'ws';
import { TOKEN } from '../contexts/TokenContext';
import { Listener, WebSocketRawData } from '../interfaces/WebSocketData';

const url = `wss://ws.finnhub.io?token=${TOKEN}`;

let socket = new WebSocket(url);
export default socket;

let symbolTracker: {
    [stockSymbol: string]: {
        currentPrice: number,
        listeners: [Listener]
    }
} = {};

socket.addEventListener('open', () => {
    console.log('socket is open');
    socket.addEventListener('message', messageHandler);
})

function messageHandler({ data }: any) {
    if (!!data && typeof data === 'string') {
        const dataObj: WebSocketRawData = JSON.parse(data);
        dataObj.data?.forEach(({ s, p, t, v, c }) => {
            if (symbolTracker[s] !== undefined) {
                // quickly keep track of the latest price (so a new listener does not have to wait)
                symbolTracker[s].currentPrice = p;
                // for each listener for this symbol, pass received data to each listener.
                symbolTracker[s].listeners.forEach((listener: Listener) => {
                    listener(s, p, t, v, c);
                })
            }
        })
    };
};

export const subscribe = (symbol: string) => {
    console.log(`WebSocket just subscribed to ${symbol}`);
    socket.send(JSON.stringify({ type: 'subscribe', symbol }));
};

export const unsubscribe = (symbol: string) => {
    console.log(`WebSocket just unsubscribed to ${symbol}`);
    socket.send(JSON.stringify({ type: 'unsubscribe', symbol }));
};

export const listen = (symbol: string, newListener: Listener) => {
    if (symbolTracker[symbol] === undefined) {
        symbolTracker[symbol] = {
            currentPrice: 0,
            listeners: [newListener]
        }
    } else {
        symbolTracker[symbol].listeners.push(newListener);
    }
}

export const stopListen = (symbol: string, oldListener: Listener) => {
    if (symbolTracker[symbol] === undefined) {
        console.error("System attempted to unsubscribe from a symbol that was not already subscribed to");
    } else {
        // then there MUST be a listener.
        // TODO: Replace the below with listeners.find() or something.
        symbolTracker[symbol].listeners.forEach(((listener: Listener, index: number, listeners: Listener[]) => {
            if (listener === oldListener) {
                listeners.splice(index, 1);
                if (listeners.length === 0) {
                    // we deleted the last listener!
                    // remove the symbol from the symbolTracker
                    delete symbolTracker[symbol];
                }
            }
        }));
    }
};