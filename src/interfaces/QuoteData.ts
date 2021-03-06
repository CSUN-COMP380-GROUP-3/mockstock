/**The expected API response from a Quote API call from FinnHub */
export interface QuoteData {
  o: number; // Open price of the day
  h: number; // High price of the day
  l: number; // Low price of the day
  c: number; // Current price
  pc: number; // Previous close price
};

/**The expected arguments for a Quote Query to FinnHub */
export interface QuoteQuery {
  symbol: string;
  token: string;
};