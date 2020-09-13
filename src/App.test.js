import React from 'react';
import { render } from '@testing-library/react';
import App from './views/Router';

describe('App', () => {
  const app = render(<App />);
  const displayScreen = app.getByText(/0\./i);
  test('renders calculator screen', () => {
      expect(displayScreen).toBeInTheDocument();
    });
});
// TODO - build out tests