import { setToStorage, getFromStorage } from './storage';

interface Record {
	candlestickTimestamp: number,
	sharesOwned: number,
	costBasis: number,
	trades: {
		bought: number,
		costBasis: number
	}
}

interface CashRecord {
	candlestickTimestamp: number,
	cashOwned: number
}

module AssetTracker {

	const RECORDBOOK_SYMBOL_LIST_KEY = "RECORDBOOK_SYMBOL_LIST"
	const CASH_RECORDBOOK_KEY = "CASH_RECORDBOOK"
	const RECORDBOOK_SUFFIX_KEY = "RecordBook";
	const INITIAL_CASH = 100000;

	const _symbolBook: { [symbol: string]: Record[] } = {};
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
			let symbolList = getFromStorage(RECORDBOOK_SYMBOL_LIST_KEY);
			if (symbolList == undefined || symbolList.length <= 0) {
				symbolList = [];
			}

			// 2. For each symbol, get stored candlestick records and records
			for (let i = 0; i < symbolList.length; i++) {
				const symbol = symbolList[i];
				try {
					const recordBook = getFromStorage(symbol + RECORDBOOK_SUFFIX_KEY);
					_symbolBook[symbol] = recordBook;
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
		}
		if (_cashRecordBook == undefined || _cashRecordBook.length <= 0) {
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
	 * Searches the Recordbook for the earliest Record that is at or before the given timestamp for the given symbol.
	 * @param candlestickTimestamp Timestamp to search for
	 * @param symbol Symbol to search for
	 * @returns The index of the record, or -1 if no record is found at or before the given date.
	 */
	const getFirstRecordIndexAtFor = function (candlestickTimestamp: number, symbol: string): number {
		let recordIndex: number = -1;

		// If we don't have records for the symbol, just return -1.
		if (_symbolBook[symbol] == undefined || _symbolBook[symbol].length <= 0) {
			return recordIndex;
		}

		// TODO: Alternatively we could search through this using binary search or something but linear is fine for now.
		for (let i = _symbolBook[symbol].length - 1; i > 0; i++) { // Search backwards for first-past-record
			if (_symbolBook[symbol][i].candlestickTimestamp <= candlestickTimestamp) {
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

		let shares = _symbolBook[symbol][recordIndex].sharesOwned;

		// if no shares for the day, return 0.
		if (shares <= 0) {
			return 0;
		}

		// for all records after that record, store lowest.
		for (let i = recordIndex; i < _symbolBook[symbol].length; i++) {
			const record = _symbolBook[symbol][i];
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
	 * Finds existing or creates new cash record and alters the cashOwned appropriately for it and all future cash records.
	 * @param candlestickTimestamp midnight UTC timestamp
	 * @param amount dollar amount being exchanged (purchases should come as negative)
	 */
	const updateCash = function (candlestickTimestamp: number, firstCashIndex: number, amount: number) {
		const expendableCash = getSpendableCashAt(candlestickTimestamp);
		if (expendableCash + amount < 0) {
			// they don't have enough cash.
			throw ("Insufficient cash");
		} else {
			// the buy is good to go. Update Cash Record!
			if (_cashRecordBook[firstCashIndex].candlestickTimestamp == candlestickTimestamp) {
				// There is already a record for this timestamp. Just update it.
				_cashRecordBook[firstCashIndex].cashOwned += amount;
			} else {
				// Need to insert a new cash record.
				const newCashRecord: CashRecord = {
					candlestickTimestamp: candlestickTimestamp,
					cashOwned: _cashRecordBook[firstCashIndex].cashOwned // this puts the old value in because we will update it in the update loop.
				}
				_cashRecordBook.splice(firstCashIndex + 1, 0, newCashRecord);
				// TODO: Ensure that if inserting a new cash record at the end of the cashbook, if splice actually does what we want.
			}
		}
	}

	/**
	 * Propogates a transaction into the future.
	 * @param firstCorrectIndex The first index that has the correct balance in it.
	 * @param amount Dollar amount transacted.
	 */
	const updateFutureCashRecords = function (firstCorrectIndex: number, amount: number) {
		// Update cash for all future cash records
		for (let i = firstCorrectIndex + 1; i < _cashRecordBook.length; i++) {
			_cashRecordBook[i].cashOwned += amount;
		}
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
		const candlestickTimestamp = convertTimestampToMidnightUTC(timestamp, utcOffset);
		// Update Cash Record
		// Makes sure they have enough cash at this timestamp.
		const firstCashIndex = getFirstCashRecordAt(candlestickTimestamp);
		updateCash(candlestickTimestamp, firstCashIndex, -amount);

		// Update cash for all future cash records
		updateFutureCashRecords(firstCashIndex, -amount);

		// store to cache
		setToStorage(CASH_RECORDBOOK_KEY, _cashRecordBook);

		// Update Records
		const quantity = amount / sharePrice;
		const firstRecordIndex = getFirstRecordIndexAtFor(candlestickTimestamp, symbol);
		const firstRecord = _symbolBook[symbol][firstRecordIndex];

		// update record
		if (firstRecord.candlestickTimestamp == candlestickTimestamp) {
			// There is already a record for this timestamp. Just update it.
			const newSharesOwned = firstRecord.sharesOwned + quantity;
			const newCostBasis = ((firstRecord.sharesOwned * firstRecord.costBasis) + amount) / newSharesOwned; // (old total cost + cost of purchase) / (old shares + newly bought shares)

			_symbolBook[symbol][firstRecordIndex].sharesOwned = newSharesOwned;
			_symbolBook[symbol][firstRecordIndex].costBasis = newCostBasis;

			// update record's trades
			const oldTrades = _symbolBook[symbol][firstRecordIndex].trades;
			const newTrades = {
				bought: oldTrades.bought + quantity,
				costBasis: ((oldTrades.bought * oldTrades.costBasis) + amount) / quantity
			}
			_symbolBook[symbol][firstRecordIndex].trades = newTrades;
		} else {
			// Need to insert a new record.
			const newRecord: Record = {
				candlestickTimestamp: candlestickTimestamp,
				sharesOwned: firstRecord.sharesOwned, // this puts the old value in because we will update it in the update loop.
				costBasis: firstRecord.costBasis, // this puts the old value in because we will update it in the update loop.
				trades: {
					bought: quantity,
					costBasis: sharePrice
				}
			}
			_symbolBook[symbol].splice(firstRecordIndex + 1, 0, newRecord);
			// TODO: ensure the above does what we think it's doing.
		}

		// Update sharesOwned and costBasis for all future records
		for (let i = firstRecordIndex + 1; i < _symbolBook[symbol].length; i++) {
			// assume firstRecordIndex's Record is correct.
			// update sharesOwned
			const previousRecord = _symbolBook[symbol][i - 1];
			const record = _symbolBook[symbol][i];
			_symbolBook[symbol][i].sharesOwned = record.sharesOwned + quantity;
			// update costBasis
			const oldTotal = previousRecord.sharesOwned * previousRecord.costBasis;
			const tradeTotal = record.trades.bought * record.trades.costBasis;
			const newSharesOwned = previousRecord.sharesOwned + record.trades.bought;
			_symbolBook[symbol][i].costBasis = (oldTotal + tradeTotal) / newSharesOwned;
		}

		// store to cache
		setToStorage(symbol + RECORDBOOK_SUFFIX_KEY, _symbolBook[symbol]);
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
			if (_symbolBook[symbol][firstRecordIndex].candlestickTimestamp == candlestickTimestamp) {
				// There is already a record for this timestamp. Just update it.
				_symbolBook[symbol][firstRecordIndex].sharesOwned -= quantity;
			} else {
				// Need to insert a new record.
				const previousRecord = _symbolBook[symbol][firstRecordIndex];
				const newRecord: Record = {
					candlestickTimestamp: candlestickTimestamp,
					sharesOwned: previousRecord.sharesOwned, // this puts the old value in because we will update it in the update loop
					costBasis: previousRecord.costBasis,
					trades: {
						bought: 0,
						costBasis: previousRecord.costBasis
					}
				}
				_symbolBook[symbol].splice(firstRecordIndex + 1, 0, newRecord);
				// TODO: Ensure that if inserting a new cash record at the end of the cashbook, if splice actually does what we want.
			}

			// Update sharesOwned for all future records
			for (let i = firstRecordIndex + 1; i < _symbolBook[symbol].length; i++) {
				_symbolBook[symbol][i].sharesOwned -= quantity;
			}

			// store to cache
			setToStorage(symbol + RECORDBOOK_SUFFIX_KEY, _symbolBook[symbol]);
		}

		// Update Cash
		const firstCashIndex = getFirstCashRecordAt(candlestickTimestamp);
		updateCash(candlestickTimestamp, firstCashIndex, quantity * sharePrice);

		// Update all future Cash Records
		updateFutureCashRecords(firstCashIndex, quantity * sharePrice);

		// store to cache
		setToStorage(CASH_RECORDBOOK_KEY, _cashRecordBook);
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
	export const convertTimestampToMidnightUTC = function (timestamp: number, UTCOffset: number): number {
		timestamp += UTCOffset;
		return timestamp - (timestamp % 86400); // divides the number by the seconds in a day and substracts what's left. Truncates to midnight of that day.
	}

}

export default AssetTracker;