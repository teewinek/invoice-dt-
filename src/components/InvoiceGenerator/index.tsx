import React from 'react';
import { useInvoiceStore } from '../../store/useInvoiceStore';
import { InvoiceForm } from './InvoiceForm';
import { LineItems } from './LineItems';
import { InvoiceSummary } from './InvoiceSummary';
import { InvoiceActions } from './InvoiceActions';
import { FileText, Plus } from 'lucide-react';

export const InvoiceGenerator: React.FC = () => {
  const { currentInvoice, createInvoice } = useInvoiceStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {!currentInvoice ? (
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
              No Invoice Selected
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Create a new invoice to get started
            </p>
            <div className="mt-6">
              <button
                onClick={createInvoice}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                New Invoice
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentInvoice.status === 'draft'
                  ? 'Draft Invoice'
                  : 'Invoice'}{' '}
                #{currentInvoice.number}
              </h1>
              <InvoiceActions />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <InvoiceForm />
              <LineItems />
              <InvoiceSummary />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
