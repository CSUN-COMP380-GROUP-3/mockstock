import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('should render correctly', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('app')).toBeTruthy();
  });
});