import React from 'react';
import { formatCurrency } from './utils';

interface CalculationResultsProps {
  results: {
    basePrice: number;
    standardVAT: {
      rate: number;
      amount: number;
      total: number;
    };
    reducedVAT: {
      rate: number;
      amount: number;
      total: number;
    };
  };
}

export const CalculationResults: React.FC<CalculationResultsProps> = ({
  results,
}) => {
  return (
    <div className="space-y-6">
      {/* Standard VAT Calculation */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          Standard Rate ({results.standardVAT.rate}%)
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Base Price:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(results.basePrice)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">VAT Amount:</span>
            <span className="font-medium text-blue-600 dark:text-blue-400">
              {formatCurrency(results.standardVAT.amount)}
            </span>
          </div>
          <div className="pt-2 border-t border-gray-200 dark:border-gray-600 flex justify-between">
            <span className="font-medium text-gray-900 dark:text-white">
              Total Price:
            </span>
            <span className="font-bold text-gray-900 dark:text-white">
              {formatCurrency(results.standardVAT.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Reduced VAT Calculation */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          Reduced Rate ({results.reducedVAT.rate}%)
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Base Price:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(results.basePrice)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">VAT Amount:</span>
            <span className="font-medium text-blue-600 dark:text-blue-400">
              {formatCurrency(results.reducedVAT.amount)}
            </span>
          </div>
          <div className="pt-2 border-t border-gray-200 dark:border-gray-600 flex justify-between">
            <span className="font-medium text-gray-900 dark:text-white">
              Total Price:
            </span>
            <span className="font-bold text-gray-900 dark:text-white">
              {formatCurrency(results.reducedVAT.total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};