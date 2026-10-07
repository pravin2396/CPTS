import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCustomers } from '../context/CustomerContext';
import { useShipments } from '../context/ShipmentContext';
import { apiGetCustomerById } from '../services/customerApiService';
import { Sidebar } from '../components/Sidebar';
import { CustomerModal } from '../components/CustomerModal';
import { ConfirmModal, EmptyState, StatusBadge } from '../components/ui/FeedbackComponents';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Hash,
  Calendar,
  Package,
  ArrowLeft,
  Edit2,
  Trash2,
  Copy,
  Check,
  Menu,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Truck
} from 'lucide-react';
import { toast } from 'react-toastify';

export const CustomerProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCustomerById, deleteCustomer } = useCustomers();
  const { shipments } = useShipments();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const customer = getCustomerById(id);

  // Replicate READ [GET /users/:id] in browser DevTools Network tab on mount
  useEffect(() => {
    if (id) {
      apiGetCustomerById(id);
    }
  }, [id]);

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`Copied ${fieldName} to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleConfirmDelete = async () => {
    if (customer) {
      await deleteCustomer(customer.id);
      setIsDeleteModalOpen(false);
      navigate('/customers');
    }
  };

  // Find linked parcels in shipments system
  const linkedShipments = customer
    ? (shipments || []).filter(
        (s) =>
          s.senderName?.toLowerCase().includes(customer.name.toLowerCase()) ||
          s.receiverName?.toLowerCase().includes(customer.name.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen w-full bg-[#0a0c10] text-slate-100 font-sans antialiased relative selection:bg-amber-500 selection:text-slate-950 flex">
      {/* Background Logistics Image with Dark Overlay (Theme 4) */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0c10]/95 via-[#0e121a]/95 to-[#0a0c10]/98 pointer-events-none" />

      {/* Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 w-full bg-[#141822]/85 backdrop-blur-xl border-b border-amber-500/20 px-4 sm:px-8 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors focus:outline-none"
              aria-label="Open Sidebar Navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link
              to="/customers"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors py-1.5 px-3 rounded-xl hover:bg-slate-800/60"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Customers</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Module 4 • Customer Profile
            </span>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-5xl w-full mx-auto relative z-10">
          {!customer ? (
            <EmptyState
              icon={User}
              title="Customer Profile Not Found"
              description={`No customer record exists matching identifier "${id}". It may have been deleted.`}
              actionText="Return to Customer Directory"
              onAction={() => navigate('/customers')}
            />
          ) : (
            <>
              {/* Profile Header Card */}
              <div className="p-6 rounded-[28px] bg-[#141822]/90 backdrop-blur-xl border border-amber-500/25 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-amber-500/25 shrink-0">
                    {customer.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        {customer.name}
                      </h1>
                      <span
                        className={`text-xs font-bold px-3 py-0.5 rounded-full border ${
                          customer.status === 'Active'
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-500/15 text-slate-400 border-slate-500/30'
                        }`}
                      >
                        {customer.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Account ID: <span className="font-mono text-amber-400 font-bold">{customer.id}</span> • Member Since {customer.joinedDate || '2026-01-01'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1f2c] hover:bg-[#222838] text-amber-300 text-xs font-bold rounded-xl border border-amber-500/30 transition-all cursor-pointer"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold rounded-xl border border-rose-500/20 transition-all cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {/* Contact & Location Dual Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Contact Card */}
                <div className="p-6 rounded-[28px] bg-[#141822]/85 backdrop-blur-xl border border-amber-500/20 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Direct Contact Details
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md">
                      Verified
                    </span>
                  </div>

                  <div className="space-y-3">
                    {/* Email */}
                    <div className="bg-[#10141d] p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase font-bold">Email Address</span>
                          <span className="text-xs sm:text-sm text-slate-200 font-medium">{customer.email}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(customer.email, 'Email')}
                        className="p-1.5 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Copy Email"
                      >
                        {copiedField === 'Email' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>

                    {/* Mobile */}
                    <div className="bg-[#10141d] p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Phone className="h-4 w-4 text-amber-400 shrink-0" />
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase font-bold">Mobile Phone</span>
                          <span className="text-xs sm:text-sm text-slate-200 font-medium">{customer.mobile}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(customer.mobile, 'Mobile')}
                        className="p-1.5 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Copy Phone Number"
                      >
                        {copiedField === 'Mobile' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Address Card */}
                <div className="p-6 rounded-[28px] bg-[#141822]/85 backdrop-blur-xl border border-blue-500/20 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-black text-blue-400 uppercase tracking-wider flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Physical Dispatch Address
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md">
                      Billing & Hub
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-[#10141d] p-3.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Street Address</span>
                      <p className="text-xs sm:text-sm text-slate-200 font-medium mt-0.5">{customer.address}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#10141d] p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">City</span>
                        <p className="text-xs sm:text-sm text-slate-200 font-bold mt-0.5">{customer.city}</p>
                      </div>
                      <div className="bg-[#10141d] p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Postal Code</span>
                        <p className="text-xs sm:text-sm text-amber-400 font-mono font-bold mt-0.5">{customer.postalCode}</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Linked Shipments History */}
              <div className="p-6 rounded-[28px] bg-[#141822]/85 backdrop-blur-xl border border-amber-500/20 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                    <Package className="h-4 w-4 text-amber-400" />
                    Linked Dispatch Manifests ({linkedShipments.length})
                  </h2>
                  <Link
                    to="/shipments"
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
                  >
                    <span>View All Shipments</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {linkedShipments.length === 0 ? (
                  <div className="p-8 text-center bg-[#10141d]/50 rounded-2xl border border-dashed border-slate-800 text-xs text-slate-400">
                    No parcels currently on manifest under "{customer.name}".
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          <th className="py-3 px-3">Tracking ID</th>
                          <th className="py-3 px-3">Role</th>
                          <th className="py-3 px-3">Type & Weight</th>
                          <th className="py-3 px-3">Expected Date</th>
                          <th className="py-3 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-medium">
                        {linkedShipments.map((s) => {
                          const isSender = s.senderName?.toLowerCase().includes(customer.name.toLowerCase());
                          return (
                            <tr key={s.id} className="hover:bg-[#181d2a]/60 transition-colors">
                              <td className="py-3 px-3 font-mono font-bold text-amber-400">
                                {s.trackingNumber}
                              </td>
                              <td className="py-3 px-3 text-slate-300">
                                {isSender ? (
                                  <span className="text-amber-400 font-semibold">Origin Shipper</span>
                                ) : (
                                  <span className="text-blue-400 font-semibold">Destination Consignee</span>
                                )}
                              </td>
                              <td className="py-3 px-3 text-slate-300">
                                {s.parcelType} • {s.parcelWeight} kg
                              </td>
                              <td className="py-3 px-3 text-slate-400">
                                {s.expectedDeliveryDate}
                              </td>
                              <td className="py-3 px-3">
                                <StatusBadge status={s.deliveryStatus} />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Edit Customer Modal */}
      {customer && (
        <CustomerModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          customerToEdit={customer}
        />
      )}

      {/* Delete Confirmation Modal */}
      {customer && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Confirm Customer Deletion"
          message={`Are you sure you want to permanently delete customer "${customer.name}"? This record will be removed.`}
          confirmText="Yes, Delete Customer"
        />
      )}
    </div>
  );
};
