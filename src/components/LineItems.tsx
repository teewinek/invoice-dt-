import React from 'react';
import { useInvoiceStore } from '../store/useInvoiceStore';
import { Plus, Trash2 } from 'lucide-react';

export const LineItems: React.FC = () => {
  const { currentInvoice, addLineItem, removeLineItem, updateLineItem } = useInvoiceStore();

  const handleAddItem = () => {
    addLineItem({
      description: '',
      quantity: 1,
      rate: 0,
      tax: currentInvoice.taxRates[0],
    });
  };

  return (
    <div className="mt-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
              <div className="col-span-6">Description</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-2">Rate</div>
              <div className="col-span-1">Tax</div>
              <div className="col-span-1"></div>
            </div>

            {currentInvoice.items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      updateLineItem(item.id, { description: e.target.value })
                    }
                    className="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Item description"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateLineItem(item.id, { quantity: Number(e.target.value) })
                    }
                    className="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="1"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) =>
                      updateLineItem(item.id, { rate: Number(e.target.value) })
                    }
                    className="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="col-span-1">
                  <input
                    type="number"
                    value={item.tax}
                    onChange={(e) =>
                      updateLineItem(item.id, { tax: Number(e.target.value) })
                    }
                    className="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                    max="100"
                  />
                </div>
                <div className="col-span-1">
                  <button
                    onClick={() => removeLineItem(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={handleAddItem}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <Plus className="w-5 h-5" />
              Add Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};