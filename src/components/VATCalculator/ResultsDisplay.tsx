import React from 'react';
import { formatCurrency } from './utils';

interface ResultsDisplayProps {
  results: {
    net: number;
    vat: number;
    gross: number;
  };
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  return (
    <div className="space-y-4 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Calculation Results
      </h2>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Net Amount:
          </span>
          <span className="text-base font-medium text-gray-900 dark:text-white">
            {formatCurrency(results.net)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            VAT Amount:
          </span>
          <span className="text-base font-medium text-blue-600 dark:text-blue-400">
            {formatCurrency(results.vat)}
          </span>
        </div>

        <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Gross Amount:
            </span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(results.gross)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};