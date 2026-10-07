import React, { useState, useEffect } from 'react';
import { Modal } from './ui/FeedbackComponents';
import { useShipments } from '../context/ShipmentContext';
import {
  Sparkles,
  RefreshCw,
  Boxes,
  Truck,
  MapPin,
  Calendar,
  Weight,
  FileText,
  User,
  Loader2
} from 'lucide-react';

export const ShipmentModal = ({ isOpen, onClose, shipmentToEdit = null }) => {
  const {
    createShipment,
    updateShipment,
    generateTrackingNumber,
    fetchSampleFromThirdPartyApi,
    isApiSyncing,
    PARCEL_TYPES,
    DELIVERY_STATUSES
  } = useShipments();

  const isEditMode = Boolean(shipmentToEdit);

  const initialFormState = {
    trackingNumber: '',
    senderName: '',
    receiverName: '',
    pickupAddress: '',
    deliveryAddress: '',
    parcelWeight: 1.5,
    parcelType: PARCEL_TYPES[0] || 'Electronics & Gadgets',
    shippingDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    deliveryStatus: 'Booked',
    notes: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isFetchingSample, setIsFetchingSample] = useState(false);

  // Synchronize modal state with target shipment or initialize with fresh tracking ID
  useEffect(() => {
    if (isOpen) {
      if (shipmentToEdit) {
        setFormData({
          trackingNumber: shipmentToEdit.trackingNumber,
          senderName: shipmentToEdit.senderName || '',
          receiverName: shipmentToEdit.receiverName || '',
          pickupAddress: shipmentToEdit.pickupAddress || '',
          deliveryAddress: shipmentToEdit.deliveryAddress || '',
          parcelWeight: shipmentToEdit.parcelWeight || 1.5,
          parcelType: shipmentToEdit.parcelType || PARCEL_TYPES[0],
          shippingDate: shipmentToEdit.shippingDate || new Date().toISOString().split('T')[0],
          expectedDeliveryDate: shipmentToEdit.expectedDeliveryDate || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          deliveryStatus: shipmentToEdit.deliveryStatus || 'Booked',
          notes: shipmentToEdit.notes || ''
        });
      } else {
        setFormData({
          ...initialFormState,
          trackingNumber: generateTrackingNumber()
        });
      }
      setErrors({});
    }
  }, [isOpen, shipmentToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Generate a new tracking ID
  const handleRegenerateTracking = () => {
    const newTracking = generateTrackingNumber();
    setFormData((prev) => ({ ...prev, trackingNumber: newTracking }));
  };

  // Autofill sample data using Third-Party API integration
  const handleAutofillFromApi = async () => {
    setIsFetchingSample(true);
    try {
      const sample = await fetchSampleFromThirdPartyApi();
      if (sample) {
        setFormData((prev) => ({
          ...prev,
          ...sample,
          // Preserve existing tracking number if editing
          trackingNumber: isEditMode ? prev.trackingNumber : sample.trackingNumber
        }));
        setErrors({});
      }
    } finally {
      setIsFetchingSample(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.trackingNumber?.trim()) errs.trackingNumber = 'Tracking number is required.';
    if (!formData.senderName?.trim()) errs.senderName = 'Sender name is required.';
    if (!formData.receiverName?.trim()) errs.receiverName = 'Receiver name is required.';
    if (!formData.pickupAddress?.trim()) errs.pickupAddress = 'Pickup address is required.';
    if (!formData.deliveryAddress?.trim()) errs.deliveryAddress = 'Delivery address is required.';
    if (!formData.parcelWeight || Number(formData.parcelWeight) <= 0) {
      errs.parcelWeight = 'Weight must be greater than 0 kg.';
    }
    if (!formData.shippingDate) errs.shippingDate = 'Shipping date is required.';
    if (!formData.expectedDeliveryDate) errs.expectedDeliveryDate = 'Expected delivery date is required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditMode) {
      const res = await updateShipment(shipmentToEdit.id, formData);
      if (res.success) onClose();
    } else {
      const res = await createShipment(formData);
      if (res.success) onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? `Edit Shipment: ${formData.trackingNumber}` : 'Create New Shipment Consignment'}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Third-Party API Integration Auto-fill Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent rounded-2xl border border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Third-Party Logistics API Integration</p>
              <p className="text-[11px] text-slate-400">
                Populate verified sender, receiver & cargo addresses via JSONPlaceholder & DummyJSON API
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAutofillFromApi}
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
                <span>Autofill via 3rd-Party API</span>
              </>
            )}
          </button>
        </div>

        {/* Section 1: Tracking Number & Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Tracking Number */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Tracking Number *
            </label>
            <div className="relative flex">
              <input
                type="text"
                name="trackingNumber"
                value={formData.trackingNumber}
                onChange={handleChange}
                disabled={isEditMode}
                placeholder="TRK-982410"
                className={`w-full px-3.5 py-2.5 bg-[#141822] text-amber-400 font-mono font-bold text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 disabled:opacity-75 ${
                  errors.trackingNumber ? 'border-rose-500' : 'border-amber-500/30'
                }`}
              />
              {!isEditMode && (
                <button
                  type="button"
                  onClick={handleRegenerateTracking}
                  title="Generate New Tracking Number"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              )}
            </div>
            {errors.trackingNumber && (
              <p className="text-[11px] text-rose-400 mt-1">{errors.trackingNumber}</p>
            )}
          </div>

          {/* Parcel Type */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Parcel Type *
            </label>
            <select
              name="parcelType"
              value={formData.parcelType}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-[#141822] text-slate-100 text-xs sm:text-sm border border-slate-700/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
            >
              {PARCEL_TYPES.map((type) => (
                <option key={type} value={type} className="bg-[#141822]">
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Section 2: Sender & Receiver */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Sender Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-amber-400" />
              Sender Name *
            </label>
            <input
              type="text"
              name="senderName"
              value={formData.senderName}
              onChange={handleChange}
              placeholder="e.g. Apex Cargo Systems"
              className={`w-full px-3.5 py-2.5 bg-[#141822] text-slate-100 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                errors.senderName ? 'border-rose-500' : 'border-slate-700/80'
              }`}
            />
            {errors.senderName && (
              <p className="text-[11px] text-rose-400 mt-1">{errors.senderName}</p>
            )}
          </div>

          {/* Receiver Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-amber-400" />
              Receiver Name *
            </label>
            <input
              type="text"
              name="receiverName"
              value={formData.receiverName}
              onChange={handleChange}
              placeholder="e.g. Eleanor Vance"
              className={`w-full px-3.5 py-2.5 bg-[#141822] text-slate-100 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                errors.receiverName ? 'border-rose-500' : 'border-slate-700/80'
              }`}
            />
            {errors.receiverName && (
              <p className="text-[11px] text-rose-400 mt-1">{errors.receiverName}</p>
            )}
          </div>
        </div>

        {/* Section 3: Addresses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Pickup Address */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-amber-400" />
              Pickup Address *
            </label>
            <textarea
              name="pickupAddress"
              rows={2}
              value={formData.pickupAddress}
              onChange={handleChange}
              placeholder="Full pickup street, city, state & zip"
              className={`w-full px-3.5 py-2 bg-[#141822] text-slate-100 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 resize-none ${
                errors.pickupAddress ? 'border-rose-500' : 'border-slate-700/80'
              }`}
            />
            {errors.pickupAddress && (
              <p className="text-[11px] text-rose-400 mt-1">{errors.pickupAddress}</p>
            )}
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-amber-400" />
              Delivery Address *
            </label>
            <textarea
              name="deliveryAddress"
              rows={2}
              value={formData.deliveryAddress}
              onChange={handleChange}
              placeholder="Full destination street, city, state & zip"
              className={`w-full px-3.5 py-2 bg-[#141822] text-slate-100 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 resize-none ${
                errors.deliveryAddress ? 'border-rose-500' : 'border-slate-700/80'
              }`}
            />
            {errors.deliveryAddress && (
              <p className="text-[11px] text-rose-400 mt-1">{errors.deliveryAddress}</p>
            )}
          </div>
        </div>

        {/* Section 4: Weight, Status & Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Parcel Weight */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Weight className="h-3.5 w-3.5 text-amber-400" />
              Weight (kg) *
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              name="parcelWeight"
              value={formData.parcelWeight}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 bg-[#141822] text-slate-100 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                errors.parcelWeight ? 'border-rose-500' : 'border-slate-700/80'
              }`}
            />
            {errors.parcelWeight && (
              <p className="text-[11px] text-rose-400 mt-1">{errors.parcelWeight}</p>
            )}
          </div>

          {/* Shipping Date */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-amber-400" />
              Shipping Date *
            </label>
            <input
              type="date"
              name="shippingDate"
              value={formData.shippingDate}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 bg-[#141822] text-slate-100 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                errors.shippingDate ? 'border-rose-500' : 'border-slate-700/80'
              }`}
            />
            {errors.shippingDate && (
              <p className="text-[11px] text-rose-400 mt-1">{errors.shippingDate}</p>
            )}
          </div>

          {/* Expected Delivery Date */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-amber-400" />
              Expected Delivery *
            </label>
            <input
              type="date"
              name="expectedDeliveryDate"
              value={formData.expectedDeliveryDate}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 bg-[#141822] text-slate-100 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                errors.expectedDeliveryDate ? 'border-rose-500' : 'border-slate-700/80'
              }`}
            />
            {errors.expectedDeliveryDate && (
              <p className="text-[11px] text-rose-400 mt-1">{errors.expectedDeliveryDate}</p>
            )}
          </div>
        </div>

        {/* Section 5: Delivery Status & Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Delivery Status */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Delivery Status *
            </label>
            <select
              name="deliveryStatus"
              value={formData.deliveryStatus}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-[#141822] text-slate-100 text-xs sm:text-sm border border-slate-700/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
            >
              {DELIVERY_STATUSES.map((status) => (
                <option key={status} value={status} className="bg-[#141822]">
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-amber-400" />
              Handling Instructions / Notes
            </label>
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g. Fragile, temperature sensitive, signature required"
              className="w-full px-3.5 py-2.5 bg-[#141822] text-slate-100 text-xs sm:text-sm border border-slate-700/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>
        </div>

        {/* Modal Action Buttons */}
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
                <span>Syncing with API...</span>
              </>
            ) : isEditMode ? (
              <span>Save Changes</span>
            ) : (
              <span>Create Shipment</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
