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

	/**
	 * Returns the number of sellable shares at the given candlestick timestamp, for the given symbol.
	 * 
	 * The number of sellable shares is defined as the lowest number of shares owned between the given date and present day.
	 * @param candlestickTimestamp Candlestick Timestamp (should be 0:00 UTC on that day)
	 * @returns Highest number of shares that can be sold on the given day.
	 */
	export const getSellableSharesAtFor = (candlestickTimestamp: number, symbol: string): number => {

		let recordIndex = -1;
		let shares = 0;

		// get index of record representing given date.
		// TODO: Alternatively we could search through this using binary search or somerhing but linear is fine for now.
		for (let i = 0; i < _recordbook[symbol].records.length; i++) {
			const record = _recordbook[symbol].records[i];
			const recordTimestamp = _recordbook[symbol].candlestickData[record.candlestickIndex].timestamp;

			if (recordTimestamp <= candlestickTimestamp) {
				// found the record for the given day!
				shares = record.sharesOwned;
				recordIndex = i;
				break;
			}
		}

		// if no record for the day, or no owned stocks for the day, return 0
		if (shares <= 0 || recordIndex == -1) {
			return 0;
		}

		// for all records after that record, store lowest.
		for (let i = recordIndex; i < _recordbook[symbol].records.length; i++) {
			const record = _recordbook[symbol].records[i];
			if (record.sharesOwned < shares) {
				shares = record.sharesOwned;

				// if the future records contain 0, just stop now and return 0. 
				if (shares <= 0) {
					break;
				}
			}
		}

		// return lowest number of shares between given date and current date.
		return shares;
	}
}

export default RecordBooks;