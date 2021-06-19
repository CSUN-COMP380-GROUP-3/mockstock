export interface WebSocketRawData {
    type: string;
    data: {
        s: string; // symbol
        p: number; // price
        t: number; // unix timestamp
        v: number; // volume
        c: string[]; // trade conditions found here https://docs.google.com/spreadsheets/d/1PUxiSWPHSODbaTaoL2Vef6DgU-yFtlRGZf19oBb9Hp0/edit#gid=0
    }[]
};