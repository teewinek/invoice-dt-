import React, { useState, useCallback } from 'react';
import { Calculator, AlertCircle } from 'lucide-react';
import { formatCurrency } from './utils';
import { PriceInput } from './PriceInput';
import { CalculationResults } from './CalculationResults';

export const PriceCalculator: React.FC = () => {
  const [basePrice, setBasePrice] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handlePriceChange = (value: string) => {
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setBasePrice(value);
      setError('');
    } else {
      setError('Please enter a valid price');
    }
  };

  const calculatePrices = useCallback(() => {
    const price = parseFloat(basePrice);
    
    if (isNaN(price)) {
      return {
        basePrice: 0,
        standardVAT: { rate: 19, amount: 0, total: 0 },
        reducedVAT: { rate: 7, amount: 0, total: 0 },
      };
    }

    const standardVAT = {
      rate: 19,
      amount: price * 0.19,
      total: price * 1.19,
    };

    const reducedVAT = {
      rate: 7,
      amount: price * 0.07,
      total: price * 1.07,
    };

    return {
      basePrice: price,
      standardVAT,
      reducedVAT,
    };
  }, [basePrice]);

  const results = calculatePrices();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-8">
          {/* Header */}
          <div className="flex items-center space-x-3">
            <Calculator className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Price Calculator
            </h1>
          </div>

          {/* Input Section */}
          <PriceInput
            value={basePrice}
            onChange={handlePriceChange}
            error={error}
          />

          {/* Results */}
          <CalculationResults results={results} />
        </div>

        {/* Info Footer */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>
            Prices are calculated with standard (19%) and reduced (7%) VAT rates
          </span>
        </div>
      </div>
    </div>
  );
};