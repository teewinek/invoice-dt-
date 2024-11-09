import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Shield, CreditCard, AlertCircle } from 'lucide-react';

// Replace with your Stripe publishable key
const stripePromise = loadStripe('pk_test_your_publishable_key');

const PaymentForm: React.FC = () => {
  const [clientSecret, setClientSecret] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check system theme preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }

    // Listen for theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Fetch client secret from your server
    // This is just a placeholder - implement your actual server integration
    const fetchClientSecret = async () => {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: 1000, currency: 'usd' }),
        });
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error fetching client secret:', error);
      }
    };

    fetchClientSecret();
  }, []);

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: theme,
          variables: {
            colorPrimary: '#2563eb',
            colorBackground: theme === 'dark' ? '#1f2937' : '#ffffff',
            colorText: theme === 'dark' ? '#ffffff' : '#000000',
          },
        },
      }}
    >
      <CheckoutForm />
    </Elements>
  );
};

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState(0);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Rate limiting
    const now = Date.now();
    if (now - lastAttemptTime < 1000) {
      setError('Please wait before trying again');
      return;
    }
    if (attempts >= 5) {
      setError('Too many attempts. Please try again later');
      return;
    }

    setLoading(true);
    setError(null);
    setAttempts((prev) => prev + 1);
    setLastAttemptTime(now);

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-complete`,
        },
      });

      if (submitError) {
        setError(submitError.message ?? 'An error occurred');
        setSuccess(false);
      } else {
        setSuccess(true);
        setError(null);
      }
    } catch (e) {
      setError('An unexpected error occurred');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 space-y-6"
      aria-label="Payment form"
    >
      <div className="flex items-center gap-2 text-blue-600 mb-6">
        <Shield className="w-6 h-6" />
        <span className="font-medium">Secure Payment</span>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <PaymentElement
            options={{
              paymentMethodOrder: ['card', 'apple_pay', 'google_pay', 'paypal'],
              defaultValues: {
                billingDetails: {
                  name: '',
                  email: '',
                  phone: '',
                },
              },
            }}
          />
        </div>

        {error && (
          <div
            className="p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700"
            role="alert"
          >
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div
            className="p-4 bg-green-50 border border-green-200 rounded-md text-green-700"
            role="alert"
          >
            Payment successful!
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || loading}
          className={`
            w-full py-3 px-4 rounded-md flex items-center justify-center gap-2
            text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2
            ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            }
          `}
          aria-label="Complete payment"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Pay Now
            </>
          )}
        </button>
      </div>

      <div className="text-sm text-gray-500 flex items-center gap-2">
        <Shield className="w-4 h-4" />
        <span>Your payment information is encrypted and secure</span>
      </div>
    </form>
  );
};

export default PaymentForm;