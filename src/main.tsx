import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

console.log('[BBUI] Main.tsx loading...');

const rootElement = document.getElementById('root');
console.log('[BBUI] Root element:', rootElement);

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  console.log('[BBUI] App rendered');
} else {
  console.error('[BBUI] Root element not found!');
}