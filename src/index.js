// index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contextos/ContextoAutenticacion';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
