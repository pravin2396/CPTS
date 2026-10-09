import React, { useState, useEffect } from 'react';
import { Modal } from './ui/FeedbackComponents';
import { useCustomers } from '../context/CustomerContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Hash,
  Sparkles,
  Loader2,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export const CustomerModal = ({ isOpen, onClose, customerToEdit = null }) => {
  const {
    createCustomer,
    updateCustomer,
    fetchSampleFromApi,
    isApiSyncing
  } = useCustomers();

  const isEditMode = Boolean(customerToEdit);

  const initialFormState = {
    name: '',
    email: '',
    mobile: '',
    address: '',
    city: '',
    postalCode: '',
    status: 'Active',
    notes: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isFetchingSample, setIsFetchingSample] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (customerToEdit) {
        setFormData({
          name: customerToEdit.name || '',
          email: customerToEdit.email || '',
          mobile: customerToEdit.mobile || '',
          address: customerToEdit.address || '',
          city: customerToEdit.city || '',
          postalCode: customerToEdit.postalCode || '',
          status: customerToEdit.status || 'Active',
          notes: customerToEdit.notes || ''
        });
      } else {
        setFormData(initialFormState);
      }
      setErrors({});
    }
  }, [isOpen, customerToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleAutofill = async () => {
    setIsFetchingSample(true);
    try {
      const sample = await fetchSampleFromApi();
      if (sample) {
        setFormData((prev) => ({
          ...prev,
          ...sample
        }));
        setErrors({});
      }
    } finally {
      setIsFetchingSample(false);
    }
  };

  // Form Validation
  const validate = () => {
    const errs = {};

    // Customer Name
    if (!formData.name?.trim()) {
      errs.name = 'Customer name is required.';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Customer name must be at least 2 characters.';
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email?.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address (e.g. name@domain.com).';
    }

    // Mobile Number
    const mobileDigits = formData.mobile?.replace(/\D/g, '') || '';
    if (!formData.mobile?.trim()) {
      errs.mobile = 'Mobile number is required.';
    } else if (mobileDigits.length < 7) {
      errs.mobile = 'Please provide a valid contact number (at least 7 digits).';
    }

    // Address
    if (!formData.address?.trim()) {
      errs.address = 'Street address is required.';
    }

    // City
    if (!formData.city?.trim()) {
      errs.city = 'City is required.';
    }

    // Postal Code
    if (!formData.postalCode?.trim()) {
      errs.postalCode = 'Postal code / ZIP is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditMode) {
      const res = await updateCustomer(customerToEdit.id, formData);
      if (res.success) onClose();
    } else {
      const res = await createCustomer(formData);
      if (res.success) onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? `Edit Customer: ${formData.name || customerToEdit.id}` : 'Register New Customer Account'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        
        {/* Third-Party API Auto-fill helper */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent rounded-2xl border border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Third-Party Customer Directory API</p>
              <p className="text-[11px] text-slate-400">
                Instantly populate verified test profile from JSONPlaceholder user dataset
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAutofill}
            disabled={isFetchingSample || isApiSyncing}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 bg-[#181d2a] hover:bg-amber-500 hover:text-slate-950 text-amber-400 text-xs font-bold rounded-xl border border-amber-500/30 transition-all cursor-pointer shadow-sm shrink-0 disabled:opacity-50"
          >
            {isFetchingSample ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Fetching API...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Autofill Sample</span>
              </>
            )}
          </button>
        </div>

        {/* Field 1: Customer Name */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-amber-400" />
            Customer Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Eleanor Vance"
            className={`w-full px-3.5 py-2.5 bg-[#141822] text-slate-100 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 ${
              errors.name ? 'border-rose-500' : 'border-slate-700/80'
            }`}
          />
          {errors.name && <p className="text-[11px] text-rose-400 mt-1">{errors.name}</p>}
        </div>

        {/* Fields 2 & 3: Email & Mobile Number (2 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-amber-400" />
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. eleanor.vance@vancetech.io"
              className={`w-full px-3.5 py-2.5 bg-[#141822] text-slate-100 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                errors.email ? 'border-rose-500' : 'border-slate-700/80'
              }`}
            />
            {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-amber-400" />
              Mobile Number *
            </label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="e.g. +1 (555) 234-8901"
              className={`w-full px-3.5 py-2.5 bg-[#141822] text-slate-100 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                errors.mobile ? 'border-rose-500' : 'border-slate-700/80'
              }`}
            />
            {errors.mobile && <p className="text-[11px] text-rose-400 mt-1">{errors.mobile}</p>}
          </div>
        </div>

        {/* Field 4: Address */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-amber-400" />
            Street Address *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="e.g. 10880 Wilshire Blvd, Suite 1400"
            className={`w-full px-3.5 py-2.5 bg-[#141822] text-slate-100 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 ${
              errors.address ? 'border-rose-500' : 'border-slate-700/80'
            }`}
          />
          {errors.address && <p className="text-[11px] text-rose-400 mt-1">{errors.address}</p>}
        </div>

        {/* Fields 5, 6 & Status: City & Postal Code & Status (3 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* City */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5 text-amber-400" />
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Los Angeles"
              className={`w-full px-3.5 py-2.5 bg-[#141822] text-slate-100 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                errors.city ? 'border-rose-500' : 'border-slate-700/80'
              }`}
            />
            {errors.city && <p className="text-[11px] text-rose-400 mt-1">{errors.city}</p>}
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5 text-amber-400" />
              Postal Code *
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="e.g. 90024"
              className={`w-full px-3.5 py-2.5 bg-[#141822] text-slate-100 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                errors.postalCode ? 'border-rose-500' : 'border-slate-700/80'
              }`}
            />
            {errors.postalCode && <p className="text-[11px] text-rose-400 mt-1">{errors.postalCode}</p>}
          </div>

          {/* Account Status */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Account Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-[#141822] text-slate-100 text-xs sm:text-sm border border-slate-700/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#1a1f2c] hover:bg-slate-800 text-slate-300 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isApiSyncing}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs sm:text-sm font-black transition-all shadow-lg shadow-amber-500/25 cursor-pointer disabled:opacity-60"
          >
            {isApiSyncing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Syncing API...</span>
              </>
            ) : isEditMode ? (
              <span>Save Changes</span>
            ) : (
              <span>Add Customer</span>
            )}
          </button>
        </div>

      </form>
    </Modal>
  );
};
