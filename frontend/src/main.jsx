import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import LeadContextProvider from './Context/LeadContext'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <LeadContextProvider>
    <App />
    <ToastContainer/>
    </LeadContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
