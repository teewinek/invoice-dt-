import React from 'react';
import { useInvoiceStore } from '../store/useInvoiceStore';
import { Building2, Calendar, CreditCard, Hash } from 'lucide-react';

export const InvoiceForm: React.FC = () => {
  const { currentInvoice, updateInvoice } = useInvoiceStore();

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Hash className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={currentInvoice.number}
              onChange={(e) => updateInvoice({ number: e.target.value })}
              className="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Invoice Number"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={currentInvoice.date}
              onChange={(e) => updateInvoice({ date: e.target.value })}
              className="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={currentInvoice.dueDate}
              onChange={(e) => updateInvoice({ dueDate: e.target.value })}
              className="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-gray-400" />
            <select
              value={currentInvoice.currency}
              onChange={(e) => updateInvoice({ currency: e.target.value })}
              className="form-select block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Client Information
            </h3>
            <div className="mt-3 space-y-3">
              <input
                type="text"
                value={currentInvoice.client.name}
                onChange={(e) =>
                  updateInvoice({
                    client: { ...currentInvoice.client, name: e.target.value },
                  })
                }
                className="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Client Name"
              />
              <input
                type="email"
                value={currentInvoice.client.email}
                onChange={(e) =>
                  updateInvoice({
                    client: { ...currentInvoice.client, email: e.target.value },
                  })
                }
                className="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Client Email"
              />
              <textarea
                value={currentInvoice.client.address}
                onChange={(e) =>
                  updateInvoice({
                    client: { ...currentInvoice.client, address: e.target.value },
                  })
                }
                className="form-textarea block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Client Address"
                rows={3}
              />
              <input
                type="tel"
                value={currentInvoice.client.phone}
                onChange={(e) =>
                  updateInvoice({
                    client: { ...currentInvoice.client, phone: e.target.value },
                  })
                }
                className="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Client Phone"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};