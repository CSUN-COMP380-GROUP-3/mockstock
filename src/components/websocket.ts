import { TOKEN } from '../contexts/TokenContext';
import { Listener, WebSocketRawData } from '../interfaces/WebSocketData';

const url = `wss://ws.finnhub.io?token=${TOKEN}`;

module FinnHubTrade {
    export const socket = new WebSocket(url);

    /**
     * Initializes the Websocket.
     * So far it just adds a message handler to all messages coming back from FinnHub.
     */
    const initFinnHubTrade = function () {
        console.log(`FinnHubTrade init called!`);
        console.log(`Adding watchlist's message handler for websocket`);
        socket.addEventListener('message', tradesHandler);
    }
    initFinnHubTrade();

    /**
     * Keeps track of all the listeners for all the symbols the user is subscribed to.
     */
    const listenerDispatch: {
        [stockSymbol: string]: {
            dispatched: boolean,
            listeners: [Listener]
        }
    } = {};

    /**
     * A Promise that resolves once the Websocket has opened up.
     */
    const websocketOpened = new Promise<void>((resolve, reject) => {
        socket.addEventListener('open', () => {
            resolve();
        })
    })

    /**
     * Handles messages that come from Finnhub due to our price subscriptions.
     * If the given message is a price update, it will pass the price data to all the listeners for update's symbol.
     * @param data The data given back to us from Finnhub via WebSocket
     */
    function tradesHandler({ data }: any) {
        if (!!data && typeof data === 'string') {
            const dataObj: WebSocketRawData = JSON.parse(data);
            // the response is reversed so that we hit the most recent trade first.
            dataObj.data?.reverse().forEach(({ s, p, t, v, c }) => {
                if (listenerDispatch[s] !== undefined && listenerDispatch[s].dispatched === false) {
                    // for each listener for this symbol, pass received data to each listener.
                    listenerDispatch[s].listeners.forEach((listener: Listener) => {
                        listener(s, p, t, v, c);
                    })
                    // mark the symbol as dispatched so other trades (with the same symbol) are not sent to the listeners.
                    listenerDispatch[s].dispatched = true;
                }
            })
            // resets all symbol.dispatched to false
            Object.keys(listenerDispatch).map((symbol) => {
                listenerDispatch[symbol].dispatched = false;
            })
        };
    };

    /**
     * Adds the given listener to a list of functions (listeners) that will be called every time Finnhub updates our price data.
     * @param symbol The symbol to listen to
     * @param newListener The listener that will be called when Finnhub responds with new price data.
     */
    export const listen = (symbol: string, newListener: Listener) => {
        // console.log(`listen called for ${symbol}`);
        if (listenerDispatch[symbol] === undefined) {
            listenerDispatch[symbol] = {
                dispatched: false,
                listeners: [newListener]
            }
            websocketOpened.then(() => {
                console.log(`WebSocket just subscribed to ${symbol}`);
                socket.send(JSON.stringify({ type: 'subscribe', symbol }));
            })
        } else {
            listenerDispatch[symbol].listeners.push(newListener);
        }
    }

    /**
     * Removes the given listener from the symbol's list of listeners.
     * @param symbol The symbol to stop listening to
     * @param oldListener The listener that is to be removed.
     */
    export const stopListen = (symbol: string, oldListener: Listener) => {
        // console.log(`stop listen called for ${symbol}`);
        if (listenerDispatch[symbol] !== undefined) {
            // TODO: Replace the below with listeners.find() or something.
            listenerDispatch[symbol].listeners.forEach(((listener: Listener, index: number, listeners: Listener[]) => {
                if (listener === oldListener) {
                    listeners.splice(index, 1);
                    if (listeners.length === 0) {
                        // we deleted the last listener!
                        // remove the symbol from the symbolTracker
                        delete listenerDispatch[symbol];
                        websocketOpened.then(() => {
                            console.log(`WebSocket just unsubscribed from ${symbol}`);
                            socket.send(JSON.stringify({ type: 'unsubscribe', symbol }));
                        })
                    }
                }
            }));
        } else {
            // No listeners for this symbol...
            console.error("System attempted to unsubscribe from a symbol that was not already subscribed to");
        }
    };
}

export default FinnHubTrade;