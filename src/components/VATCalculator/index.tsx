import React, { useState, useCallback } from 'react';
import { Calculator, HelpCircle, ArrowDownUp, RefreshCw } from 'lucide-react';
import { VATRates } from './VATRates';
import { ResultsDisplay } from './ResultsDisplay';
import { formatCurrency } from './utils';

export const VATCalculator: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [selectedRate, setSelectedRate] = useState<number>(19);
  const [isGrossToNet, setIsGrossToNet] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,3}$/.test(value)) {
      setAmount(value);
      setError('');
    }
  };

  const toggleCalculationMode = () => {
    setIsGrossToNet(!isGrossToNet);
    setAmount('');
    setError('');
  };

  const resetCalculator = () => {
    setAmount('');
    setSelectedRate(19);
    setIsGrossToNet(false);
    setError('');
  };

  const calculateVAT = useCallback(() => {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount)) {
      return { net: 0, vat: 0, gross: 0 };
    }

    if (isGrossToNet) {
      const net = numAmount / (1 + selectedRate / 100);
      const vat = numAmount - net;
      return { net, vat, gross: numAmount };
    } else {
      const vat = numAmount * (selectedRate / 100);
      const gross = numAmount + vat;
      return { net: numAmount, vat, gross };
    }
  }, [amount, selectedRate, isGrossToNet]);

  const results = calculateVAT();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calculator className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Tunisia VAT Calculator
              </h1>
            </div>
            <button
              onClick={resetCalculator}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Reset calculator"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="flex justify-center">
            <button
              onClick={toggleCalculationMode}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            >
              <ArrowDownUp className="w-4 h-4" />
              <span>{isGrossToNet ? 'Gross to Net' : 'Net to Gross'}</span>
            </button>
          </div>

          {/* Input Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {isGrossToNet ? 'Gross Amount' : 'Net Amount'} (TND)
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="amount"
                  value={amount}
                  onChange={handleAmountChange}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter amount"
                />
              </div>
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              )}
            </div>

            <VATRates
              selectedRate={selectedRate}
              onRateChange={setSelectedRate}
            />
          </div>

          {/* Results */}
          <ResultsDisplay results={results} />
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center space-x-1">
          <HelpCircle className="w-4 h-4" />
          <span>
            VAT rates according to Tunisian tax regulations
          </span>
        </div>
      </div>
    </div>
  );
};