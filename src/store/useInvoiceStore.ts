import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Invoice, LineItem, ClientDetails } from '../types/invoice';

interface InvoiceStore {
  currentInvoice: Invoice | null;
  invoices: Invoice[];
  clients: ClientDetails[];
  nextInvoiceNumber: string;
  createInvoice: () => void;
  updateInvoice: (invoice: Partial<Invoice>) => void;
  addLineItem: (item: Omit<LineItem, 'id' | 'total' | 'vatAmount'>) => void;
  removeLineItem: (id: string) => void;
  updateLineItem: (id: string, item: Partial<LineItem>) => void;
  saveInvoice: () => void;
  loadInvoice: (id: string) => void;
  addClient: (client: Omit<ClientDetails, 'id'>) => void;
  updateClient: (id: string, client: Partial<ClientDetails>) => void;
  removeClient: (id: string) => void;
  calculateTotals: () => void;
  generatePDF: () => void;
  exportData: () => string;
  importData: (data: string) => void;
}

const calculateVAT = (amount: number, type: 'standard' | 'reduced' | 'timbre') => {
  switch (type) {
    case 'standard':
      return amount * 0.19;
    case 'reduced':
      return amount * 0.07;
    case 'timbre':
      return 1.0; // 1 TND timbre fiscal
    default:
      return 0;
  }
};

const generateInvoiceNumber = (prefix: string = 'INV') => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${year}${month}-${random}`;
};

const defaultCompany = {
  name: 'Your Company Name',
  matriculeFiscal: '',
  rne: '',
  email: 'contact@company.tn',
  address: 'Company Address, Tunisia',
  phone: '+216 00 000 000',
  website: 'www.company.tn',
};

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set, get) => ({
      currentInvoice: null,
      invoices: [],
      clients: [],
      nextInvoiceNumber: generateInvoiceNumber(),

      createInvoice: () => {
        const invoice: Invoice = {
          id: uuidv4(),
          number: get().nextInvoiceNumber,
          date: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          client: {
            id: '',
            name: '',
            email: '',
            address: '',
            phone: '',
            language: 'fr',
          },
          company: defaultCompany,
          items: [],
          notes: '',
          terms: 'Payment due within 30 days',
          language: 'fr',
          status: 'draft',
          vatBreakdown: {
            standard: 0,
            reduced: 0,
            timbre: 0,
          },
          totals: {
            subtotal: 0,
            vat: 0,
            timbre: 0,
            total: 0,
          },
          paymentMethod: 'bank_transfer',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set({ currentInvoice: invoice });
        return invoice;
      },

      updateInvoice: (updates) => {
        set((state) => ({
          currentInvoice: state.currentInvoice
            ? { ...state.currentInvoice, ...updates }
            : null,
        }));
      },

      addLineItem: (item) => {
        set((state) => {
          if (!state.currentInvoice) return state;

          const newItem: LineItem = {
            id: uuidv4(),
            ...item,
            total: item.quantity * item.unitPrice,
            vatAmount: calculateVAT(
              item.quantity * item.unitPrice,
              item.vatType
            ),
          };

          return {
            currentInvoice: {
              ...state.currentInvoice,
              items: [...state.currentInvoice.items, newItem],
            },
          };
        });

        get().calculateTotals();
      },

      removeLineItem: (id) => {
        set((state) => ({
          currentInvoice: state.currentInvoice
            ? {
                ...state.currentInvoice,
                items: state.currentInvoice.items.filter(
                  (item) => item.id !== id
                ),
              }
            : null,
        }));

        get().calculateTotals();
      },

      updateLineItem: (id, updates) => {
        set((state) => {
          if (!state.currentInvoice) return state;

          const items = state.currentInvoice.items.map((item) => {
            if (item.id !== id) return item;

            const updatedItem = { ...item, ...updates };
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
            updatedItem.vatAmount = calculateVAT(
              updatedItem.total,
              updatedItem.vatType
            );

            return updatedItem;
          });

          return {
            currentInvoice: {
              ...state.currentInvoice,
              items,
            },
          };
        });

        get().calculateTotals();
      },

      calculateTotals: () => {
        set((state) => {
          if (!state.currentInvoice) return state;

          const items = state.currentInvoice.items;
          const subtotal = items.reduce((sum, item) => sum + item.total, 0);

          const vatBreakdown = {
            standard: items
              .filter((item) => item.vatType === 'standard')
              .reduce((sum, item) => sum + item.vatAmount, 0),
            reduced: items
              .filter((item) => item.vatType === 'reduced')
              .reduce((sum, item) => sum + item.vatAmount, 0),
            timbre: items
              .filter((item) => item.vatType === 'timbre')
              .reduce((sum, item) => sum + item.vatAmount, 0),
          };

          const totalVat = vatBreakdown.standard + vatBreakdown.reduced;
          const timbre = vatBreakdown.timbre;
          const total = subtotal + totalVat + timbre;

          return {
            currentInvoice: {
              ...state.currentInvoice,
              vatBreakdown,
              totals: {
                subtotal,
                vat: totalVat,
                timbre,
                total,
              },
            },
          };
        });
      },

      saveInvoice: () => {
        set((state) => {
          if (!state.currentInvoice) return state;

          const updatedInvoice = {
            ...state.currentInvoice,
            updatedAt: new Date().toISOString(),
          };

          const invoices = state.invoices.filter(
            (inv) => inv.id !== updatedInvoice.id
          );

          return {
            invoices: [...invoices, updatedInvoice],
            nextInvoiceNumber: generateInvoiceNumber(),
          };
        });
      },

      loadInvoice: (id) => {
        set((state) => ({
          currentInvoice:
            state.invoices.find((invoice) => invoice.id === id) || null,
        }));
      },

      addClient: (client) => {
        set((state) => ({
          clients: [...state.clients, { ...client, id: uuidv4() }],
        }));
      },

      updateClient: (id, updates) => {
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === id ? { ...client, ...updates } : client
          ),
        }));
      },

      removeClient: (id) => {
        set((state) => ({
          clients: state.clients.filter((client) => client.id !== id),
        }));
      },

      generatePDF: () => {
        // PDF generation logic will be implemented in a separate component
      },

      exportData: () => {
        const state = get();
        return JSON.stringify({
          invoices: state.invoices,
          clients: state.clients,
        });
      },

      importData: (data) => {
        try {
          const parsed = JSON.parse(data);
          set({
            invoices: parsed.invoices || [],
            clients: parsed.clients || [],
          });
        } catch (error) {
          console.error('Failed to import data:', error);
        }
      },
    }),
    {
      name: 'invoice-storage',
    }
  )
);