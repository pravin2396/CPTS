import React, { useState } from 'react';
import { Modal } from './ui/FeedbackComponents';
import { useShipments } from '../context/ShipmentContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Hash,
  Calendar,
  Package,
  Edit2,
  Trash2,
  Copy,
  Check,
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const CustomerProfileModal = ({
  isOpen,
  onClose,
  customer,
  onEdit,
  onDelete
}) => {
  const navigate = useNavigate();
  const { shipments } = useShipments();
  const [copiedField, setCopiedField] = useState(null);

  if (!customer) return null;

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`Copied ${fieldName} to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Find linked parcels in shipment system
  const linkedShipments = (shipments || []).filter(
    (s) =>
      s.senderName?.toLowerCase().includes(customer.name.toLowerCase()) ||
      s.receiverName?.toLowerCase().includes(customer.name.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Customer Profile View"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        
        {/* Profile Header Banner */}
        <div className="p-5 rounded-2xl bg-[#10141d] border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
              {customer.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg font-black text-white tracking-tight">{customer.name}</h3>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    customer.status === 'Active'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-500/15 text-slate-400 border-slate-500/30'
                  }`}
                >
                  {customer.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Customer ID: <span className="font-mono text-amber-400 font-bold">{customer.id}</span> • Member since {customer.joinedDate || '2026'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate(`/customers/${customer.id}`);
              }}
              className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              title="Open Full Page View"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Full Page</span>
            </button>
          </div>
        </div>

        {/* Contact Information & Address (2 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Contact Details Card */}
          <div className="p-4 rounded-2xl bg-[#10141d]/80 border border-slate-800 space-y-3.5">
            <span className="text-xs font-black text-amber-400 uppercase tracking-wider block border-b border-slate-800 pb-2">
              Contact Information
            </span>

            {/* Email */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="h-4 w-4 text-amber-400/80 shrink-0" />
                <span className="truncate">{customer.email}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(customer.email, 'Email')}
                className="p-1 text-slate-500 hover:text-amber-400 transition-colors cursor-pointer"
                title="Copy email"
              >
                {copiedField === 'Email' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>

            {/* Mobile */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="h-4 w-4 text-amber-400/80 shrink-0" />
                <span>{customer.mobile}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(customer.mobile, 'Mobile')}
                className="p-1 text-slate-500 hover:text-amber-400 transition-colors cursor-pointer"
                title="Copy phone number"
              >
                {copiedField === 'Mobile' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* Location & Postal Address Card */}
          <div className="p-4 rounded-2xl bg-[#10141d]/80 border border-slate-800 space-y-3.5">
            <span className="text-xs font-black text-blue-400 uppercase tracking-wider block border-b border-slate-800 pb-2">
              Registered Address
            </span>

            <div className="text-xs text-slate-300 space-y-1">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-blue-400/80 shrink-0 mt-0.5" />
                <span>{customer.address}</span>
              </div>
              <div className="flex items-center gap-2 pl-6 text-slate-400">
                <Building className="h-3.5 w-3.5 text-slate-500" />
                <span>{customer.city}, {customer.postalCode}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Linked Shipments in System */}
        <div className="p-4 rounded-2xl bg-[#10141d]/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Package className="h-4 w-4 text-amber-400" />
              Associated Consignments ({linkedShipments.length})
            </span>
          </div>

          {linkedShipments.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-2">
              No live consignments currently linked to this customer account name.
            </p>
          ) : (
            <div className="space-y-2">
              {linkedShipments.slice(0, 3).map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#141822] border border-slate-800/80 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400">{s.trackingNumber}</span>
                    <span className="text-slate-400">• {s.parcelType}</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-300">{s.deliveryStatus}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onEdit) onEdit(customer);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1a1f2c] hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-xl border border-amber-500/20 transition-colors cursor-pointer"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Edit Customer</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                if (onDelete) onDelete(customer);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold rounded-xl border border-rose-500/20 transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close Profile
          </button>
        </div>

      </div>
    </Modal>
  );
};
