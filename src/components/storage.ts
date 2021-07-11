
/**
 * Check if localStorage is both supported and availble on the browser. See link below.
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
 * @returns truthy value of whether or not localStorage is available
 */
function isLocalStorageAvailable() {
    var storage;
    try {
        storage = window['localStorage'];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    };
};

const storage = !!(isLocalStorageAvailable()) ? window['localStorage'] : undefined;

export default storage;

/**
 * @todo Move this to some kind of storage module or something.
 * @param key Key to access from Storage
 * @returns The value found in Storage at that key
 * @throws Failed to import key from storage
 */
export const getFromStorage = function (key: string) {
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
export const setToStorage = function (key: string, value: any) {
    const valueJSON = JSON.stringify(value);
    // here is where we would sign the string
    if (!!valueJSON) {
        storage?.setItem(key, valueJSON);
    };
}