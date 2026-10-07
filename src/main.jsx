import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { DashboardProvider } from './context/DashboardContext'
import { ShipmentProvider } from './context/ShipmentContext'
import { cleanupPreviousProjectStorage } from './utils/storageCleanup'

cleanupPreviousProjectStorage()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <DashboardProvider>
        <ShipmentProvider>
          <App />
        </ShipmentProvider>
      </DashboardProvider>
    </AuthProvider>
  </StrictMode>,
)
