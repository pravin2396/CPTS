import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { DashboardProvider } from './context/DashboardContext'
import { NotificationProvider } from './context/NotificationContext'
import { ShipmentProvider } from './context/ShipmentContext'
import { CustomerProvider } from './context/CustomerContext'
import { cleanupPreviousProjectStorage } from './utils/storageCleanup'

cleanupPreviousProjectStorage()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <DashboardProvider>
        <NotificationProvider>
          <ShipmentProvider>
            <CustomerProvider>
              <App />
            </CustomerProvider>
          </ShipmentProvider>
        </NotificationProvider>
      </DashboardProvider>
    </AuthProvider>
  </StrictMode>,
)
