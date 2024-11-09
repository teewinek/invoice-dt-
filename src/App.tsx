import React from 'react';
import { InvoiceGenerator } from './components/InvoiceGenerator';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>
      <InvoiceGenerator />
    </div>
  );
}

export default App;