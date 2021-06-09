import React from 'react';

export const TOKEN = process.env.NODE_ENV === 'production' ? 
    process.env.REACT_APP_API_KEY! :
    process.env.REACT_APP_SANDBOX_KEY!

export const TokenContext = React.createContext<string>('');