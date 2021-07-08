import storage from '../components/storage';

interface CandlestickRecord {
	close: number,
	high: number,
	low: number,
	open: number,
	volume: number,
	timestamp: number
}

interface Record {
	candlestickIndex: number,
	sharesOwned: number,
	costBasis: number,
	// trades: SOMETHING[]
}

interface RecordBook {
	candlestickData: CandlestickRecord[],
	records: Record[]
}

interface CashRecord {
	candlestickTimestamp: number,
	cashOwned: number,
	// trades: SOMETHING[]
}

module RecordBooks {

	const RECORDBOOK_SYMBOL_LIST_KEY = "RECORDBOOK_SYMBOL_LIST"
	const CASH_RECORDBOOK_KEY = "CASH_RECORDBOOK"

	const _recordbook: { [symbol: string]: RecordBook } = {};
	let _cashRecordBook: CashRecord[] = [];

	const initRecordBooks = function () {
		// get list of symbols
		try {
			const symbolList = getFromStorage(RECORDBOOK_SYMBOL_LIST_KEY);

			// for each symbol, get the recordBook for that and store into _recordBooks.
			for (let i = 0; i < symbolList.length; i++) {
				const symbol = symbolList[i];
				try {
					const recordBook = getFromStorage(symbol + "RecordBook");
					const candlestickData = getFromStorage(symbol + "CandlestickData");
					_recordbook[symbol] = {
						candlestickData: candlestickData,
						records: recordBook
					}
				} catch (e) {
					// no data found... 
					// TODO: what do?
				}
			}
		} catch (e) {
			// no records! ... that's fine right?
			// This is probably the first time the user has accessed this site.
			// We'll initialize it to an empty array, and update it as the user trades.
			setToStorage(RECORDBOOK_SYMBOL_LIST_KEY, []);
		}

		// get cash Recordbook
		try {
			_cashRecordBook = getFromStorage(CASH_RECORDBOOK_KEY);
		} catch (e) {
			// no records! ... that's fine right?
			// This is probably the first time the user has accessed this site.
			// We'll initialize it to an empty array, and update it as the user trades.
			setToStorage(CASH_RECORDBOOK_KEY, []);
		}
	}

	initRecordBooks();

	/**
	 * @todo Move this to some kind of storage module or something.
	 * @param key Key to access from Storage
	 * @returns The value found in Storage at that key
	 * @throws Failed to import key from storage
	 */
	const getFromStorage = function (key: string) {
		const listOfSymbolsRAW = storage?.getItem(key);

		if (!!listOfSymbolsRAW) {
			try {
				const keysValue = JSON.parse(listOfSymbolsRAW);
				// here is where we can verify
				if (!!keysValue) {
					return keysValue
				}
			} catch (e) {
				console.error(`Failed to import ${key} from storage`);
				throw (`Failed to import key from storage`);
			}
		}
	}

	/**
	 * @todo Move this to some kind of storage module or something.
	 * @param key Key to access from Storage
	 * @returns The value to store in Storage at that key
	 */
	const setToStorage = function (key: string, value: any) {
		const valueJSON = JSON.stringify(value);
		// here is where we would sign the string
		if (!!valueJSON) {
			storage?.setItem(key, valueJSON);
		};
	}
}

export default RecordBooks;