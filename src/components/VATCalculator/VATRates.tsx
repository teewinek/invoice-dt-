import React from 'react';
import { HelpCircle } from 'lucide-react';

interface VATRatesProps {
  selectedRate: number;
  onRateChange: (rate: number) => void;
}

const vatRates = [
  {
    rate: 19,
    label: 'Standard',
    description: 'Standard rate for most goods and services',
  },
  {
    rate: 13,
    label: 'Reduced',
    description: 'Reduced rate for specific products and services',
  },
  {
    rate: 7,
    label: 'Reduced',
    description: 'Lower reduced rate for essential items',
  },
];

export const VATRates: React.FC<VATRatesProps> = ({
  selectedRate,
  onRateChange,
}) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        VAT Rate
      </label>
      <div className="grid grid-cols-3 gap-3">
        {vatRates.map(({ rate, label, description }) => (
          <div key={rate} className="relative">
            <input
              type="radio"
              name="vat-rate"
              id={`vat-${rate}`}
              className="peer sr-only"
              checked={selectedRate === rate}
              onChange={() => onRateChange(rate)}
            />
            <label
              htmlFor={`vat-${rate}`}
              className="flex flex-col items-center p-4 bg-white dark:bg-gray-700 border rounded-lg cursor-pointer
                peer-checked:border-blue-500 peer-checked:ring-2 peer-checked:ring-blue-500
                hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {rate}%
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {label}
              </span>
              <div className="group relative">
                <HelpCircle className="w-4 h-4 text-gray-400 mt-1" />
                <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg">
                  {description}
                </div>
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};