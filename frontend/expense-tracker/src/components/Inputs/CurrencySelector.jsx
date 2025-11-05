import React from 'react';
import { currencies } from '../../utils/currencies';

const CurrencySelector = ({ selectedCurrency, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Select Currency
      </label>
      <select
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
        value={selectedCurrency}
        onChange={(e) => {
          const currency = currencies.find(c => c.code === e.target.value);
          onChange(currency);
        }}
      >
        {currencies.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.symbol} - {currency.name} ({currency.code})
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySelector;