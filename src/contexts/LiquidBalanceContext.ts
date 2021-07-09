import currency from 'currency.js';
import storage from '../components/storage';
import { BehaviorSubject } from 'rxjs';

const STORAGE_KEY = 'balance';

export interface LiquidBalanceProviderInterface {
    balance: number;
    balance$: BehaviorSubject<number>;
    updateLiquidBalance: (balance: number) => void;
    add: (balance: number) => void;
    subtract: (balance: number) => void;
    balanceAsCurrency: currency;
};

/**
 * LiquidBalanceProvider wraps around the balance context and provides useful functions
 */
class LiquidBalanceProvider implements LiquidBalanceProviderInterface {
    balance: number;
    balance$: BehaviorSubject<number>;
    private previousBalance: number;
    updateLiquidBalance: (balance: number) => void;
    constructor() {
        // we need to verify the storage
        this.balance = currency(storage?.getItem(STORAGE_KEY) || process.env.REACT_APP_SEED_MONEY || 100000).value;
        this.balance$ = new BehaviorSubject(this.balance); 
        this.previousBalance = currency(process.env.REACT_APP_SEED_MONEY || 100000).value;
        this.updateLiquidBalance = (balance: number) => {
            this.balance = balance;
            this.balance$.next(this.balance);
        };
    };

    add(balance: number) {
        const newBalance = currency(this.balance).add(currency(balance));
        this.updateLiquidBalance(newBalance.value);
        // sign
        storage?.setItem(STORAGE_KEY, newBalance.toString());
    };

    subtract(balance: number) {
        const newBalance = currency(this.balance).subtract(currency(balance));
        this.updateLiquidBalance(newBalance.value);
        // sign
        storage?.setItem(STORAGE_KEY, newBalance.toString());
    };

    get balanceAsCurrency() {
        return currency(this.balance);
    };
};

export const liquidBalanceProvider = new LiquidBalanceProvider();