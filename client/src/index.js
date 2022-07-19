import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './css/app.css'
import { BrowserRouter as Router } from 'react-router-dom';
import { UserContextProvider } from './context/userContext';
import { QueryClient, QueryClientProvider } from 'react-query'
import { CartProvider } from 'use-shopping-cart'
const stripeKey = process.env.YOUR_STRIPE_PUBLIC_KEY
const client = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserContextProvider>
      <QueryClientProvider client={client}>
        <Router>

          {/* use cartProvider functionality with stripe */}
          <CartProvider     
          mode="payment"
          cartMode="checkout-session"
          stripe={stripeKey}
          currency="USD">
            <App />
          </CartProvider>
        </Router>
      </QueryClientProvider>
    </UserContextProvider>
  </React.StrictMode>
);
