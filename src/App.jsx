import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ProtectedRoute } from './components/ProtectedRoute';

import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { ShipmentsPage } from './pages/ShipmentsPage';
import { ShipmentDetailsPage } from './pages/ShipmentDetailsPage';
import { CustomersPage } from './pages/CustomersPage';
import { CustomerProfilePage } from './pages/CustomerProfilePage';
import { TrackingPage } from './pages/TrackingPage';
import { DeliveryStatusPage } from './pages/DeliveryStatusPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ReportsPage } from './pages/ReportsPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Routes (Module 1 - Intact) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Routes (Module 2: Dashboard - Intact) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes (Module 3: Shipment Management & Details - Intact) */}
          <Route
            path="/shipments"
            element={
              <ProtectedRoute>
                <ShipmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shipments/:id"
            element={
              <ProtectedRoute>
                <ShipmentDetailsPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes (Module 4: Customer Management & Profile - Intact) */}
          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <CustomersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers/:id"
            element={
              <ProtectedRoute>
                <CustomerProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes (Module 5: Parcel Tracking & Telemetry) */}
          <Route
            path="/tracking"
            element={
              <ProtectedRoute>
                <TrackingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tracking/:trackingNumber"
            element={
              <ProtectedRoute>
                <TrackingPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes (Module 6: Delivery Status & Lifecycle) */}
          <Route
            path="/delivery-status"
            element={
              <ProtectedRoute>
                <DeliveryStatusPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes (Module 7: Notifications Center) */}
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes (Module 8: Reports & Analytics) */}
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <ReportsPage />
              </ProtectedRoute>
            }
          />

          {/* Default Route redirects to /login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
