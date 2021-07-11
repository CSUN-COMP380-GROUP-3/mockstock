import storage from './storage';
import { activeStockProvider } from '../contexts/ActiveStockContext';
import CandleStickData from '../interfaces/CandleStickData';
import moment from 'moment';

interface SymbolBooks {
	candleStickData: CandleStickData,
	recordBook: Record[]
}

interface Record {
	candlestickTimestamp: number,
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

	const _symbolBook: { [symbol: string]: SymbolBooks } = {};
	let _cashRecordBook: CashRecord[] = [];

	/**
	 * Initializes RecordBooks.
	 * 
	 * 1. Get the list of symbols for which we have records.
	 * 2. For each symbol, get stored candlestick records and records
	 * 3. Get Cash records.
	 */
	const initAssetTracker = function () {
		// 1. Get the list of symbols for which we have records.
		try {
			const symbolList = getFromStorage(RECORDBOOK_SYMBOL_LIST_KEY);

			// 2. For each symbol, get stored candlestick records and records
			for (let i = 0; i < symbolList.length; i++) {
				const symbol = symbolList[i];
				try {
					const recordBook = getFromStorage(symbol + RECORDBOOK_SUFFIX_KEY);
					const candlestickData = getFromStorage(symbol + CANDLESTICK_SUFFIX_KEY);

					_symbolBook[symbol] = {
						candleStickData: candlestickData,
						recordBook: recordBook
					}
				} catch (e) {
					// either no candlestickData or records for a symbol...
					// TODO: what do?
				}
			}
		} catch (e) {
			// No Records for any Symbols. Probably first-time user, initializing to empty (awaiting records).
			setToStorage(RECORDBOOK_SYMBOL_LIST_KEY, {});
		}

		// 3. Get Cash records.
		try {
			_cashRecordBook = getFromStorage(CASH_RECORDBOOK_KEY);
		} catch (e) {
			// No Cash Record found. Probably first-time user, initializing to initial record.
			_cashRecordBook = [
				{
					candlestickTimestamp: 0,
					cashOwned: INITIAL_CASH
				}
			]
			setToStorage(CASH_RECORDBOOK_KEY, _cashRecordBook);
		}
	}

	initAssetTracker();

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
	 * @param candlestickTimestamp timestamp to search for
	 * @param symbol symbol to search for
	 * @returns the index to access the candlestick data for the given symbol, or -1 if no candlestick data exists for the given timestamp. 
	 */
	const getFirstCandlestickIndexAtFor = function (candlestickTimestamp: number, symbol: string): number {
		return _symbolBook[symbol].candleStickData.t.findIndex((value) => {
			return convertTimestampToMidnightUTC(value, 0) == candlestickTimestamp;
			// return value == candlestickTimestamp; UNCOMMENT IF WE CAN CONFIRM THAT CANDLESTICK TIMESTAMPS ARE ALWAYS midnight UTC.
		})
	}

	/**
	 * Searches the Recordbook for the earliest Record that is at or before the given timestamp for the given symbol.
	 * @param candlestickTimestamp Timestamp to search for
	 * @param symbol Symbol to search for
	 * @returns The index of the record, or -1 if no record is found at or before the given date.
	 */
	const getFirstRecordIndexAtFor = function (candlestickTimestamp: number, symbol: string): number {
		let recordIndex: number = -1;

		// If we don't have records for the symbol, just return -1.
		if (_symbolBook[symbol] == undefined || _symbolBook[symbol].recordBook.length <= 0) {
			return recordIndex;
		}

		// TODO: Alternatively we could search through this using binary search or something but linear is fine for now.
		for (let i = _symbolBook[symbol].recordBook.length - 1; i > 0; i++) { // Search backwards for first-past-record
			if (_symbolBook[symbol].recordBook[i].candlestickTimestamp <= candlestickTimestamp) {
				// found the record for the given timestamp!
				recordIndex = i;
				break;
			}
		}
		return recordIndex;
	}

	/**
	 * Searches the CashRecordBook for the earliest Record that is at or before the given timestamp for the given symbol.
	 * @param candlestickTimestamp midnight UTC timestamp to search for
	 * @returns The index of the record, or -1 if no record is found at or before the given date.
	 */
	const getFirstCashRecordAt = function (candlestickTimestamp: number): number {
		let recordIndex = -1;

		// TODO: Alternatively we could search through this using binary search or somerhing but linear is fine for now.
		for (let i = _cashRecordBook.length - 1; i > 0; i++) { // it's important we search backwards for first-past-record
			if (_cashRecordBook[i].candlestickTimestamp <= candlestickTimestamp) {
				// found the record for the given timestamp!
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
	 * A typical truncation is NOT enough to convert, because Thursday 5:00PM PDT would directly convert to Friday 0:00AM UTC. 
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
	const storeCandlesticksFromActiveAt = () => {
		const currentData = activeStockProvider.activeStock.candles;
		const symbol = activeStockProvider.activeStock.stock.symbol;
		try {
			const existingData: CandleStickData = getFromStorage(symbol + CANDLESTICK_SUFFIX_KEY);

			// if the existing candlestick Data already covers current data, don't bother.
			const latestExistingTimestamp = existingData.t[existingData.t.length - 1];
			const latestCurrentTimestamp = currentData.t[currentData.t.length - 1];
			if (latestExistingTimestamp >= latestCurrentTimestamp) {
				return;
			}

			const firstNewIndex = currentData.t.findIndex((timestamp) => {
				return (timestamp > latestExistingTimestamp);
			});
			if (firstNewIndex != -1) {
				// Concatenate CandlestickData
				const cConcat = currentData.c.slice(firstNewIndex);
				existingData.c.concat(cConcat);

				const hConcat = currentData.h.slice(firstNewIndex);
				existingData.h.concat(hConcat);

				const lConcat = currentData.l.slice(firstNewIndex);
				existingData.l.concat(lConcat);

				const oConcat = currentData.o.slice(firstNewIndex);
				existingData.o.concat(oConcat);

				const vConcat = currentData.v.slice(firstNewIndex);
				existingData.v.concat(vConcat);

				const tConcat = currentData.t.slice(firstNewIndex);
				existingData.t.concat(tConcat);

				// Store to Storage
				setToStorage(symbol + CANDLESTICK_SUFFIX_KEY, existingData);
			} else {
				// activeStock's candlestick data does not contain any new data. which is weird.
				return;
			}
		} catch (e) {
			// no stored candlestick data, store what's in activecontext.
			setToStorage(symbol + CANDLESTICK_SUFFIX_KEY, currentData);
		}

	}

	/**
	 * Returns the number of sellable shares at the given timestamp, for the given symbol.
	 * 
	 * The number of sellable shares is defined as the lowest number of shares owned between the given date and present day.
	 * @param candlestickTimestamp midnight UTC timestamp to start search
	 * @param symbol Symbol to search for
	 * @returns Highest number of shares that can be sold on the given day.
	 */
	export const getSellableSharesAtFor = (candlestickTimestamp: number, symbol: string): number => {

		let recordIndex = getFirstRecordIndexAtFor(candlestickTimestamp, symbol);

		// if no record for the day, return 0.
		if (recordIndex == -1) {
			return 0;
		}

		let shares = _symbolBook[symbol].recordBook[recordIndex].sharesOwned;

		// if no shares for the day, return 0.
		if (shares <= 0) {
			return 0;
		}

		// for all records after that record, store lowest.
		for (let i = recordIndex; i < _symbolBook[symbol].recordBook.length; i++) {
			const record = _symbolBook[symbol].recordBook[i];
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
	 * @param candlestickTimestamp midnight UTC timestamp to start search
	 * @returns Highest amount of cash that can be spent on the given day
	 */
	export const getSpendableCashAt = (candlestickTimestamp: number): number => {

		let recordIndex = getFirstCashRecordAt(candlestickTimestamp);

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
	 * Ensures the user can actually spend the given amount, conducts the purchase, and records it.
	 * @param timestamp Timestamp of transaction
	 * @param utcOffset Timestamp's UTC Offset in SECONDS
	 * @param symbol The symbol to transact in
	 * @param amount The amount of money to invest
	 * @param sharePrice The Price of a single share of the given symbol
	 * @throws "Insufficient cash" if user does not have enough cash at the given date (or in the future).
	 */
	export const buyAtForAmountAt = function (timestamp: number, utcOffset: number, symbol: string, amount: number, sharePrice: number) {
		// Make sure they have enough cash at this timestamp.
		const candlestickTimestamp = convertTimestampToMidnightUTC(timestamp, utcOffset)
		const expendableCash = getSpendableCashAt(candlestickTimestamp);
		if (expendableCash < amount) {
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

		// Update Record
		const firstRecordIndex = getFirstRecordIndexAtFor(candlestickTimestamp, symbol);
		const firstRecord = _symbolBook[symbol].recordBook[firstRecordIndex];

		const newSharesOwned = firstRecord.sharesOwned + (amount / sharePrice);
		const newCostBasis = ((firstRecord.sharesOwned * firstRecord.costBasis) + amount) / newSharesOwned; // (old total cost + cost of purchase) / (old shares + newly bought shares)

		if (firstRecord.candlestickTimestamp == candlestickTimestamp) {
			// There is already a record for this timestamp. Just update it.
			_symbolBook[symbol].recordBook[firstRecordIndex].sharesOwned = newSharesOwned;
			_symbolBook[symbol].recordBook[firstRecordIndex].costBasis = newCostBasis;
		} else {
			// Need to insert a new record.
			const newRecord: Record = {
				candlestickTimestamp: candlestickTimestamp,
				sharesOwned: newSharesOwned,
				costBasis: newCostBasis,
			}
			_symbolBook[symbol].recordBook.splice(firstRecordIndex + 1, 0, newRecord);
			// TODO: ensure the above does what we think it's doing.
		}
		setToStorage(symbol + RECORDBOOK_SUFFIX_KEY, _symbolBook[symbol].recordBook);
	}

	/**
	 * Ensures the user can actually sell the given quantity of shares, conducts the sale, and records it.
	 * @param timestamp Timestamp of transaction
	 * @param utcOffset Timestamp's UTC Offset in SECONDS
	 * @param symbol The symbol to transact in
	 * @param quantity The amount of money to invest
	 * @param sharePrice The Price of a single share of the given symbol
	 * @throws "Insufficient shares" if user does not have enough shares at the given date (or in the future).
	 */
	export const sellAtForAmountAt = function (timestamp: number, utcOffset: number, symbol: string, quantity: number, sharePrice: number) {
		// Make sure they have enough shares at this timestamp.
		const candlestickTimestamp = convertTimestampToMidnightUTC(timestamp, utcOffset)
		const sellableShares = getSellableSharesAtFor(candlestickTimestamp, symbol);
		if (sellableShares < quantity) {
			// they don't have enough shares.
			throw ("Insufficient shares");
		} else {
			// the sell is good to go. Update Share Record!
			const firstRecordIndex = getFirstRecordIndexAtFor(candlestickTimestamp, symbol);
			if (_symbolBook[symbol].recordBook[firstRecordIndex].candlestickTimestamp == candlestickTimestamp) {
				// There is already a record for this timestamp. Just update it.
				_symbolBook[symbol].recordBook[firstRecordIndex].sharesOwned -= quantity;
			} else {
				// Need to insert a new record.
				const newRecord: Record = {
					candlestickTimestamp: candlestickTimestamp,
					sharesOwned: _symbolBook[symbol].recordBook[firstRecordIndex].sharesOwned - quantity,
					costBasis: _symbolBook[symbol].recordBook[firstRecordIndex].costBasis
				}
				_symbolBook[symbol].recordBook.splice(firstRecordIndex + 1, 0, newRecord);
				// TODO: Ensure that if inserting a new cash record at the end of the cashbook, if splice actually does what we want.
			}
			setToStorage(symbol + RECORDBOOK_SUFFIX_KEY, _symbolBook[symbol].recordBook);
		}

		// Update Cash
		const firstCashIndex = getFirstCashRecordAt(candlestickTimestamp);
		const oldCashRecord = _cashRecordBook[firstCashIndex];

		const newCash = oldCashRecord.cashOwned + (quantity * sharePrice);

		if (oldCashRecord.candlestickTimestamp == candlestickTimestamp) {
			// There is already a record for this timestamp. Just update it.
			_cashRecordBook[firstCashIndex].cashOwned = newCash;
		} else {
			// Need to insert a new record.
			const newRecord: CashRecord = {
				candlestickTimestamp: candlestickTimestamp,
				cashOwned: newCash,
			}
			_cashRecordBook.splice(firstCashIndex + 1, 0, newRecord);
			// TODO: ensure the above does what we think it's doing.
		}
		setToStorage(CASH_RECORDBOOK_KEY, _cashRecordBook);
	}

}

export default AssetTracker;