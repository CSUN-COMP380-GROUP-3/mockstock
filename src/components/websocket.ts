// import WebSocket from 'ws';
import { TOKEN } from '../contexts/TokenContext';
import { Listener, WebSocketRawData } from '../interfaces/WebSocketData';

const url = `wss://ws.finnhub.io?token=${TOKEN}`;

let socket = new WebSocket(url);
export default socket;

/**
 * Keeps track of all the listeners for all the symbols the user is subscribed to.
 */
const symbolTracker: {
    [stockSymbol: string]: {
        // TODO: Remove current price and who whole deleting records thing. Just have it be an array of listners
        currentPrice: number,
        listeners: [Listener]
    }
} = {};

socket.addEventListener('open', () => {
    console.log('socket is open');
    socket.addEventListener('message', messageHandler);
})

/**
 * Handles messages that come from Finnhub due to our price subscriptions.
 * If the given message is a price update, it will pass the price data to all the listeners for update's symbol.
 * @param data The data given back to us from Finnhub via WebSocket
 */
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

/**
 * Subscribes to price updates using our Finnhub WebSocket Connection.
 * Does not perform any checks
 * @param symbol symbol to subscribe to
 */
export const subscribe = (symbol: string) => {
    console.log(`WebSocket just subscribed to ${symbol}`);
    socket.send(JSON.stringify({ type: 'subscribe', symbol }));
};

/**
 * Unsubscribes from price updates using our Finnhub WebSocket Connectino.
 * Checks to see if there are currently listeners for the given symbol. If so, does not unsubscribe.
 * We do so in case the user switches off an active index that also happens to be on the watchlist.
 * @param symbol symbol to unsubscribe from
 */
export const unsubscribe = (symbol: string) => {
    if (symbolTracker[symbol].listeners.length <= 0) {
        console.log(`WebSocket just unsubscribed from ${symbol}`);
        socket.send(JSON.stringify({ type: 'unsubscribe', symbol }));
    } else {
        console.log(`WebSocket just tried to unsubscribe from ${symbol}, but couldn't because it still has listeners`);
    }
};

/**
 * Adds the given listener to a list of functions (listeners) that will be called every time Finnhub updates our price data.
 * @param symbol The symbol to listen to
 * @param newListener The listener that will be called when Finnhub responds with new price data.
 */
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

/**
 * Removes the given listener from the symbol's list of listeners.
 * @param symbol The symbol to stop listening to
 * @param oldListener The listener that is to be removed.
 */
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