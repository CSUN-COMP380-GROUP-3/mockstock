import storage from './storage';
import { activeStockProvider } from '../contexts/ActiveStockContext';
import CandleStickData from '../interfaces/CandleStickData';

interface SymbolBooks {
	candlestickBook: CandlestickBook,
	recordBook: Record[]
}

interface CandlestickBook {
	lastUpdated: number,
	data: CandleStickData
}

interface Record {
	candleStickTimestamp: number,
	sharesOwned: number,
	costBasis: number,
	// trades: SOMETHING[]
}

interface CashRecord {
	candlestickTimestamp: number,
	cashOwned: number,
	// trades: SOMETHING[]
}

module AssetTracker {

	const RECORDBOOK_SYMBOL_LIST_KEY = "RECORDBOOK_SYMBOL_LIST"
	const CASH_RECORDBOOK_KEY = "CASH_RECORDBOOK"
	const RECORDBOOK_SUFFIX_KEY = "RecordBook";
	const CANDLESTICK_SUFFIX_KEY = "CandlestickBook";
	const INITIAL_CASH = 100000;

	const _recordbook: { [symbol: string]: SymbolBooks } = {};
	let _cashRecordBook: CashRecord[] = [];

	/**
	 * Initializes RecordBooks.
	 * 
	 * First gets the list of symbols for which we have records, and then grabs those records and their stored candlestick data. 
	 */
	const initRecordBooks = function () {
		// get list of symbols
		try {
			const symbolList = getFromStorage(RECORDBOOK_SYMBOL_LIST_KEY);

			// for each symbol, retrieve and store its records and candlesticks into _recordBooks.
			for (let i = 0; i < symbolList.length; i++) {
				const symbol = symbolList[i];
				try {
					const recordBook = getFromStorage(symbol + RECORDBOOK_SUFFIX_KEY);
					const candlestickData = getFromStorage(symbol + CANDLESTICK_SUFFIX_KEY);
					_recordbook[symbol] = {
						candlestickBook: candlestickData,
						recordBook: recordBook
					}
				} catch (e) {
					// no data found for one of our symbols...
					// TODO: what do?
				}
			}
		} catch (e) {
			// no records! ... that's fine right?
			// This is probably the first time the user has accessed this site.
			// We'll initialize it to an empty array, and update it as the user trades.
			setToStorage(RECORDBOOK_SYMBOL_LIST_KEY, {});
		}

		// get cash Recordbook
		try {
			_cashRecordBook = getFromStorage(CASH_RECORDBOOK_KEY);
		} catch (e) {
			// no records! ... that's fine right?
			// This is probably the first time the user has accessed this site.
			// We'll initialize it to an empty array, and update it as the user trades.
			const newCashRecordBook: CashRecord[] = [
				{
					candlestickTimestamp: 0,
					cashOwned: INITIAL_CASH
				}
			]
			setToStorage(CASH_RECORDBOOK_KEY, newCashRecordBook);
			_cashRecordBook = newCashRecordBook;
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
	 * @param timestamp timestamp to search for
	 * @param symbol symbol to search for
	 * @returns the index to access the candlestick data for the given symbol, or -1 if no candlestick data exists for the given timestamp. 
	 */
	const getFirstCandlestickIndexAtFor = function (timestamp: number, symbol: string): number {
		return _recordbook[symbol].candlestickBook.data.t.findIndex((value) => {
			return value <= timestamp;
		})
	}

	/**
	 * Searches the Recordbook for the earliest Record that is at or before the given timestamp for the given symbol.
	 * @param timestamp Timestamp to search for
	 * @param symbol Symbol to search for
	 * @returns The index of the record, or -1 if no record is found at or before the given date.
	 */
	const getFirstRecordIndexAtFor = function (timestamp: number, symbol: string): number {
		let recordIndex: number = -1;

		// If we don't have records for the symbol, just return -1.
		if (_recordbook[symbol] == undefined || _recordbook[symbol].recordBook.length <= 0) {
			return recordIndex;
		}

		// TODO: Alternatively we could search through this using binary search or something but linear is fine for now.
		for (let i = _recordbook[symbol].recordBook.length - 1; i > 0; i++) {
			const record = _recordbook[symbol].recordBook[i];
			const recordTimestamp = _recordbook[symbol].candlestickBook.data.t[record.candleStickTimestamp];

			if (recordTimestamp <= timestamp) {
				// found the record for the given day!
				recordIndex = i;
				break;
			}
		}
		return recordIndex;
	}

	/**
	 * Searches the CashRecordBook for the earliest Record that is at or before the given timestamp for the given symbol.
	 * @param timestamp Timestamp to search for
	 * @returns The index of the record, or -1 if no record is found at or before the given date.
	 */
	const getFirstCashRecordAt = function (timestamp: number): number {
		let recordIndex = -1;

		// TODO: Alternatively we could search through this using binary search or somerhing but linear is fine for now.
		for (let i = _cashRecordBook.length - 1; i > 0; i++) {
			const record = _cashRecordBook[i];

			if (record.candlestickTimestamp <= timestamp) {
				// found the record for the given day!
				recordIndex = i;
				break;
			}
		}

		return recordIndex;
	}

	/**
	 * Converts a given timestamp into 0:00 UTC on the SAME DAY. 
	 * 
	 * If for example is given Thursday 5:00PM PDT (-7:00 UTC), this will return Thursday 0:00AM UTC (+0:00 UTC).
	 * A typical truncation is NOT enough to convert, because Thursday 5:00PM PDT would convert to Friday 0:00AM UTC. 
	 * @param timestamp non-candlestick Timestamp
	 * @param UTCOffset The UTC Offset in SECONDS
	 * @returns Candlestick Timestamp (0:00 UTC on the same day)
	 * @todo this.
	 */
	const convertTimestampToMidnightUTC = function (timestamp: number, UTCOffset: number): number {
		timestamp += UTCOffset;
		return timestamp - (timestamp % 86400); // divides the number by the seconds in a day and substracts what's left. Truncates to midnight of that day.
	}

	/**
	 * Obtains ActiveStock's CandleStickData and updates the stored CandleStick Data with whatever is found in ActiveStock that it does not already contain.
	 * @todo Can potentially have a gap in data if we don't store candlestick data after a year the old data is stored...
	 * @todo This should probably be moved to some other module/class. Perhaps in ActiveContext
	 */
	const storeCandlesticksFromActiveAt = (currentDateTimestamp: number) => {
		const activeStock = activeStockProvider.activeStock;
		const candleStickData = activeStock.candles;
		const symbol = activeStock.stock.symbol;
		try {
			const existingCandleStickRecordBook: CandlestickBook = getFromStorage(symbol + CANDLESTICK_SUFFIX_KEY);
			const lastUpdated = existingCandleStickRecordBook.lastUpdated;
			const existingCandleSticks = existingCandleStickRecordBook.data;

			// if lastUpdated is within a day of the previous record's "lastUpdated" value, just don't update 'cause it's already in there.
			if (lastUpdated + (24 * 60 * 60) > currentDateTimestamp) {
				return;
			}

			const lastTimestamp = existingCandleSticks.t[existingCandleSticks.t.length - 1];
			const firstGreaterIndex = candleStickData.t.findIndex((value) => {
				return (value > lastTimestamp);
			});
			if (firstGreaterIndex != -1) {
				// Concatenate CandlestickData
				const cConcat = candleStickData.c.slice(firstGreaterIndex);
				existingCandleSticks.c.concat(cConcat);

				const hConcat = candleStickData.h.slice(firstGreaterIndex);
				existingCandleSticks.h.concat(hConcat);

				const lConcat = candleStickData.l.slice(firstGreaterIndex);
				existingCandleSticks.l.concat(lConcat);

				const oConcat = candleStickData.o.slice(firstGreaterIndex);
				existingCandleSticks.o.concat(oConcat);

				const vConcat = candleStickData.v.slice(firstGreaterIndex);
				existingCandleSticks.v.concat(vConcat);

				const tConcat = candleStickData.t.slice(firstGreaterIndex);
				existingCandleSticks.t.concat(tConcat);

				// Store to Storage
				const newRecordBook: CandlestickBook = {
					lastUpdated: currentDateTimestamp,
					data: existingCandleSticks
				}
				setToStorage(symbol + CANDLESTICK_SUFFIX_KEY, newRecordBook);
			} else {
				// activeStock's candlestick data does not contain any new data
				return;
			}
		} catch (e) {
			// no stored candlestick data, store what's in activecontext.
			setToStorage(symbol + CANDLESTICK_SUFFIX_KEY, activeStock.candles);
		}

	}

	/**
	 * Returns the number of sellable shares at the given timestamp, for the given symbol.
	 * 
	 * The number of sellable shares is defined as the lowest number of shares owned between the given date and present day.
	 * @param timestamp Timestamp to start search
	 * @param symbol Symbol to search for
	 * @returns Highest number of shares that can be sold on the given day.
	 */
	export const getSellableSharesAtFor = (timestamp: number, symbol: string): number => {

		let recordIndex = getFirstRecordIndexAtFor(timestamp, symbol);
		let shares = _recordbook[symbol].recordBook[recordIndex].sharesOwned;

		// if no record for the day, or no owned stocks for the day, return 0
		if (shares <= 0 || recordIndex == -1) {
			return 0;
		}

		// for all records after that record, store lowest.
		for (let i = recordIndex; i < _recordbook[symbol].recordBook.length; i++) {
			const record = _recordbook[symbol].recordBook[i];
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

	/**
	 * Returns the amount of cash that can be spent at the given timestamp.
	 * 
	 * The amount of cash is defined as the lowest amount of cash available between the given date and present day.
	 * @param timestamp Timestamp to start search
	 * @returns Highest amount of cash that can be spent on the given day
	 */
	export const getSpendableCashAt = (timestamp: number): number => {

		let recordIndex = getFirstCashRecordAt(timestamp);

		// if no record for the day, return initial Cash.
		if (recordIndex == -1) {
			return INITIAL_CASH;
		}

		let cash = _cashRecordBook[recordIndex].cashOwned;

		// if the record contains 0 cash, return 0
		if (cash <= 0) {
			return 0;
		}

		// for all records after that record, store lowest.
		for (let i = recordIndex; i < _cashRecordBook.length; i++) {
			const record = _cashRecordBook[i];
			if (record.cashOwned < cash) {
				cash = record.cashOwned;

				// if the future records contain 0 cash, just stop now and return 0. 
				if (cash <= 0) {
					break;
				}
			}
		}

		// return lowest number of shares between given date and current date.
		return cash;
	}

	/**
	 * Ensures the user can actually spend the given amount, conducts the transaction, and records it.
	 * @param timestamp Timestamp of transaction
	 * @param utcOffset Timestamp's UTC Offset in SECONDS
	 * @param symbol The symbol to transact in
	 * @param amount The amount of money to invest
	 * @param sharePrice The Price of a single share of the given symbol
	 * @returns True if successful, False if unsucessful.
	 */
	export const buyAtForAmountAt = function (timestamp: number, utcOffset: number, symbol: string, amount: number, sharePrice: number) {
		// there is a corresponding candlestick for this transaction, so this is a historical trade.
		// Make sure they have enough cash at this timestamp.
		const candlestickTimestamp = convertTimestampToMidnightUTC(timestamp, utcOffset)
		const historicalCash = getSpendableCashAt(candlestickTimestamp);
		if (historicalCash < amount) {
			// they don't have enough cash.
			throw ("Insufficient cash");
		} else {
			// the buy is good to go. Update Cash Record!
			const firstCashIndex = getFirstCashRecordAt(candlestickTimestamp);
			if (_cashRecordBook[firstCashIndex].candlestickTimestamp == candlestickTimestamp) {
				// There is already a record for this timestamp. Just update it.
				_cashRecordBook[firstCashIndex].cashOwned -= amount;
			} else {
				// Need to insert a new cash record.
				const newCashRecord: CashRecord = {
					candlestickTimestamp: candlestickTimestamp,
					cashOwned: _cashRecordBook[firstCashIndex].cashOwned - amount
				}
				_cashRecordBook.splice(firstCashIndex + 1, 0, newCashRecord);
				// TODO: Ensure that if inserting a new cash record at the end of the cashbook, if splice actually does what we want.
			}
			setToStorage(CASH_RECORDBOOK_KEY, _cashRecordBook);
		}

		// Find the user's portfolio at this timestamp
		const correspondingCandleStickIndex = getFirstCandlestickIndexAtFor(timestamp, symbol);
		if (correspondingCandleStickIndex != -1) {
			// historical trade

			const firstRecordIndex = getFirstRecordIndexAtFor(timestamp, symbol);
			const firstRecord = _recordbook[symbol].recordBook[firstRecordIndex];

			const newSharesOwned = firstRecord.sharesOwned + (amount / sharePrice);
			const newCostBasis = ((firstRecord.sharesOwned * firstRecord.costBasis) + amount) / newSharesOwned;

			if (firstRecord.candleStickTimestamp == correspondingCandleStickIndex) {
				// firstRecordIndex corresponds to the timestamp.
				_recordbook[symbol].recordBook[firstRecordIndex].sharesOwned = newSharesOwned;
				_recordbook[symbol].recordBook[firstRecordIndex].costBasis = newCostBasis;
				setToStorage(symbol + "RecordBook", _recordbook[symbol].recordBook);
			} else {
				// firstRecordIndex does NOT correspond to the given timestamp, must splice in a new record.
				const newRecord: Record = {
					candleStickTimestamp: correspondingCandleStickIndex,
					sharesOwned: newSharesOwned,
					costBasis: newCostBasis,
				}
				_recordbook[symbol].recordBook.splice(firstRecordIndex + 1, 0, newRecord);
				setToStorage(symbol + "RecordBook", _recordbook[symbol].recordBook);
				// TODO: ensure the above does what we think it's doing.
			}
		} else {
			// day trading
			// TODO: figure out how to associate the day trading record without a corresponding candlestick index.
		}
	}
}

export default AssetTracker;