import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: 'Poppins, sans-serif',
            background: '#FFF9F0',
            color: '#6B4E3D',
            border: '1px solid #F9E4E0',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(107,78,61,0.12)',
          },
          success: { iconTheme: { primary: '#D4AF37', secondary: '#FFF9F0' } },
          error: { iconTheme: { primary: '#E27567', secondary: '#FFF9F0' } },
        }}
      />
    </HelmetProvider>
  </React.StrictMode>,
)
