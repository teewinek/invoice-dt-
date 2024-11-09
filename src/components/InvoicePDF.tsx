import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from '@react-pdf/renderer';
import { useInvoiceStore } from '../store/useInvoiceStore';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 12,
  },
  table: {
    marginTop: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  description: { width: '40%' },
  quantity: { width: '20%' },
  rate: { width: '20%' },
  amount: { width: '20%' },
  total: {
    marginTop: 30,
    alignItems: 'flex-end',
  },
});

export const InvoicePDF: React.FC = () => {
  const { currentInvoice } = useInvoiceStore();

  const calculateTotal = () => {
    const subtotal = currentInvoice.items.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0
    );
    const tax = currentInvoice.items.reduce(
      (sum, item) => sum + (item.quantity * item.rate * item.tax) / 100,
      0
    );
    const discount = (subtotal * currentInvoice.discount) / 100;
    return subtotal + tax - discount;
  };

  return (
    <PDFViewer className="w-full h-screen">
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>INVOICE</Text>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>From:</Text>
                <Text style={styles.value}>{currentInvoice.company.name}</Text>
                <Text style={styles.value}>{currentInvoice.company.address}</Text>
                <Text style={styles.value}>{currentInvoice.company.email}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>To:</Text>
                <Text style={styles.value}>{currentInvoice.client.name}</Text>
                <Text style={styles.value}>{currentInvoice.client.address}</Text>
                <Text style={styles.value}>{currentInvoice.client.email}</Text>
              </View>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.description}>Description</Text>
              <Text style={styles.quantity}>Quantity</Text>
              <Text style={styles.rate}>Rate</Text>
              <Text style={styles.amount}>Amount</Text>
            </View>
            {currentInvoice.items.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <Text style={styles.rate}>
                  {currentInvoice.currency} {item.rate}
                </Text>
                <Text style={styles.amount}>
                  {currentInvoice.currency} {(item.quantity * item.rate).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.total}>
            <Text>
              Total: {currentInvoice.currency} {calculateTotal().toFixed(2)}
            </Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};