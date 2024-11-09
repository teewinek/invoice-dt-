import React from 'react';
import { DollarSign } from 'lucide-react';

interface PriceInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const PriceInput: React.FC<PriceInputProps> = ({
  value,
  onChange,
  error,
}) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor="price"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Base Price
      </label>
      <div className="relative rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <DollarSign className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          name="price"
          id="price"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`block w-full rounded-md pl-10 pr-3 py-3
            ${error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
            }
            dark:bg-gray-700 dark:text-white
            placeholder:text-gray-400
            focus:outline-none focus:ring-2 sm:text-sm`}
          placeholder="0.00"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'price-error' : undefined}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" id="price-error">
          {error}
        </p>
      )}
    </div>
  );
};