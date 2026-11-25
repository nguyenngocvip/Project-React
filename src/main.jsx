import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuctionProvider } from './context/AuctionContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuctionProvider>
        <App />
      </AuctionProvider>
    </BrowserRouter>
  </React.StrictMode>
);