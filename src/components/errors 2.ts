export enum ERROR {
    NO_DATA = 'NoDataError',
    API_LIMIT = 'APILimitError',
    API_KEY_INVALID = 'APIKeyInvalidError',
};

export class NoDataError extends Error {
    constructor() {
        super();
        this.name = ERROR.NO_DATA;
        this.message = 'No data available';
    };
};

export class APILimitError extends Error {
    constructor() {
        super();
        this.name = ERROR.API_LIMIT;
        this.message = 'Rate limited by API, please wait before trying again';
    };
};

export class APIKeyInvalid extends Error {
    constructor() {
        super();
        this.name = ERROR.API_KEY_INVALID;
        this.message = 'Invalid token, please make sure REACT_APP_API_KEY and REACT_APP_SANDBOX_KEY are set';
    };
};