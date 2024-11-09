import React from 'react';
import { useInvoiceStore } from '../store/useInvoiceStore';

export const InvoiceSummary: React.FC = () => {
  const { currentInvoice } = useInvoiceStore();

  const calculateSubtotal = () => {
    return currentInvoice.items.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0
    );
  };

  const calculateTax = () => {
    return currentInvoice.items.reduce(
      (sum, item) =>
        sum + (item.quantity * item.rate * item.tax) / 100,
      0
    );
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    const discount = (subtotal * currentInvoice.discount) / 100;
    return subtotal + tax - discount;
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">
            {currentInvoice.currency} {calculateSubtotal().toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax:</span>
          <span className="font-medium">
            {currentInvoice.currency} {calculateTax().toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Discount:</span>
          <span className="font-medium">
            {currentInvoice.discount}%
          </span>
        </div>
        <div className="pt-4 border-t">
          <div className="flex justify-between">
            <span className="text-lg font-medium">Total:</span>
            <span className="text-lg font-bold">
              {currentInvoice.currency} {calculateTotal().toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};