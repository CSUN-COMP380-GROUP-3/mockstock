# MockStock

## Getting Started
If you are just getting started please first `npm install` to make sure all of the dependencies are installed correctly.

It is recommended that you install the [MockStock CLI Tool](https://github.com/CSUN-COMP380-GROUP-3/cli-tool) to help preserve the naming convention.

## Creating `.env`

Please make sure to have a `.env` file created. This file acts as a config file which certain parameters are set and used throughout the application such as API keys and initial values. Must have the following variables: 
- `REACT_APP_API_KEY=<value>`: Finnhub.io api key, used in production environments
- `REACT_APP_SANDBOX_KEY=<value>`: Finnhub.io sandbox api key, used in development environments
- `REACT_APP_INITIAL_STOCK=<value>`: Stock to be fetched and preloaded, ex: GME.
- `REACT_APP_INITIAL_AMOUNT=<value>`: Initial investment amount.
- `REACT_APP_SEED_MONEY=<value>`: User seed money, how much each user starts off with.

## Available Scripts

In the project directory, you can run:

### `npm run prefetch`

Fetches all availabe US stock symbols compatible with the api and saves to `symbols.json` located in the `src` folder.

Also fetches historical candles for a particular stock, specified by the environment variable `REACT_APP_INITIAL_STOCK`.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Rules / Guidelines

**DO NOT** commit directly to the `main` branch, any changes from this point forward must be done on a separate branch, and a pull request must be open and approved before it can be merged into the `main` branch.

### Components
When naming components use [PascalCase](https://wiki.c2.com/?PascalCase). Should be descriptive and should be able to determine what its for at a glance. For example:
`WatchListComponent`
`LiquidCashComponent`

### Contexts

When naming contexts use [PascalCase](https://wiki.c2.com/?PascalCase). Should be descriptive and should be able to determine what its for at a glance. For example:
`WatchListContext`
`LiquidCashContext`

### Git Naming Schemes

#### Branches

Branches should always be prefixed with one of the following tags:
`feat/` - adding or implementing a new feature
`ref/` - refactoring existing code
`fix/` - fixing any bugs or issues

Following the tags should be the main file or component that the branch is targetting and a unique identifier since branches cannot have the same name. For example:
`feat/Header-1`
`ref/BuyBox-123`
`fix/README-1`

#### Commit Messages

Commit messages should be descriptive yet short. They should summarize the work that was done and what was changed. Reference the direct components my name if necessary. For example:
`fix/ issue with Header not displaying correct information`
`feat/ implemented websocket to WatchList`
`update/ README file with new information`
