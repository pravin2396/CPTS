import React, { useState, useEffect } from 'react';
import { Modal, StatusBadge } from '../ui/FeedbackComponents';
import { useAuth } from '../../context/AuthContext';
import {
  Activity,
  MapPin,
  Clock,
  User,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Boxes,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-toastify';

const STATUS_DETAILS = [
  {
    status: 'Pending',
    label: 'Pending',
    description: 'Manifest lodged, waiting for warehouse collection',
    badgeColor: 'amber',
    suggestedRemarks: [
      'Manifest generated and awaiting warehouse staging.',
      'Pickup schedule assigned to local collection fleet.',
      'Documentation verified; ready for retrieval.'
    ]
  },
  {
    status: 'Picked Up',
    label: 'Picked Up',
    description: 'Retrieved by courier from consignor facility',
    badgeColor: 'purple',
    suggestedRemarks: [
      'Courier collected parcel from pickup address.',
      'Cargo scanned into initial logistics depot.',
      'Security scan passed at origin freight bay.'
    ]
  },
  {
    status: 'In Transit',
    label: 'In Transit',
    description: 'En route between regional distribution hubs',
    badgeColor: 'blue',
    suggestedRemarks: [
      'Freight container loaded on inter-state linehaul.',
      'Arrived at regional sorting gateway; sorting underway.',
      'Departed transit hub en route to destination facility.'
    ]
  },
  {
    status: 'Out for Delivery',
    label: 'Out for Delivery',
    description: 'Dispatched on local courier van for final doorstep delivery',
    badgeColor: 'orange',
    suggestedRemarks: [
      'Loaded on final delivery vehicle with courier.',
      'Estimated delivery window: between 1:00 PM and 5:00 PM.',
      'Courier is approaching consignee neighborhood.'
    ]
  },
  {
    status: 'Delivered',
    label: 'Delivered',
    description: 'Successfully handed over and acknowledged by consignee',
    badgeColor: 'emerald',
    suggestedRemarks: [
      'Delivered and signed by consignee.',
      'Package securely handed over at reception / front desk.',
      'Delivered to safe place / mailroom as authorized.'
    ]
  },
  {
    status: 'Cancelled',
    label: 'Cancelled',
    description: 'Consignment voided or cancelled prior to handover',
    badgeColor: 'slate',
    suggestedRemarks: [
      'Cancelled by consignor before transit dispatch.',
      'Order voided due to customer return request.',
      'Incorrect destination address; order terminated by sender.'
    ]
  },
  {
    status: 'Failed Delivery',
    label: 'Failed Delivery',
    description: 'Delivery attempt unsuccessful; package held at local depot',
    badgeColor: 'rose',
    suggestedRemarks: [
      'Premises closed; consignee not present at delivery address.',
      'Security gate locked; contact phone number unanswered.',
      'Incorrect address provided; returned to local hub for re-dispatch.'
    ]
  }
];

export const UpdateStatusModal = ({
  isOpen,
  onClose,
  shipment,
  onUpdateStatus
}) => {
  const { currentUser } = useAuth();

  const [selectedStatus, setSelectedStatus] = useState('Pending');
  const [location, setLocation] = useState('');
  const [remarks, setRemarks] = useState('');
  const [updatedBy, setUpdatedBy] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (shipment) {
      const current = shipment.deliveryStatus === 'Booked' ? 'Pending' : (shipment.deliveryStatus || 'Pending');
      setSelectedStatus(current);

      // Default location from address or last history checkpoint
      const defaultLoc = shipment.statusHistory?.[0]?.location ||
        (shipment.deliveryAddress ? `${shipment.deliveryAddress.split(',')[1]?.trim() || 'Regional'} Delivery Hub` : 'Central Dispatch Terminal');
      setLocation(defaultLoc);

      // Default updatedBy
      setUpdatedBy(currentUser?.name || 'Operations Lead');

      // Default remarks
      const currentConfig = STATUS_DETAILS.find((s) => s.status === current);
      setRemarks(currentConfig?.suggestedRemarks[0] || `Status maintained as ${current}.`);
    }
  }, [shipment, isOpen, currentUser]);

  if (!shipment) return null;

  const currentConfig = STATUS_DETAILS.find((s) => s.status === selectedStatus);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location.trim()) {
      toast.warning('Please specify the checkpoint location.');
      return;
    }

    if (!remarks.trim()) {
      toast.warning('Please provide remarks or notes for this status transition.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdateStatus(shipment.id, selectedStatus, {
        location: location.trim(),
        remarks: remarks.trim(),
        updatedBy: updatedBy.trim() || currentUser?.name || 'Dispatch Lead'
      });
      onClose();
    } catch (err) {
      console.error('Error updating delivery status:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectStatus = (statusObj) => {
    setSelectedStatus(statusObj.status);
    // Auto-suggest a helpful default remark for this status if remarks are unchanged
    if (statusObj.suggestedRemarks?.length > 0) {
      setRemarks(statusObj.suggestedRemarks[0]);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Consignment Delivery Status"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Shipment Overview Header Card */}
        <div className="p-4 rounded-2xl bg-[#10141d] border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center font-bold">
              <Boxes className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white font-mono">
                  {shipment.trackingNumber}
                </span>
                <span className="text-xs text-slate-400">({shipment.parcelType})</span>
              </div>
              <p className="text-xs text-slate-400">
                To: <strong className="text-slate-200">{shipment.receiverName}</strong> • {shipment.deliveryAddress?.split(',')[1]?.trim() || 'Destination'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Current Status:</span>
            <StatusBadge status={shipment.deliveryStatus} />
          </div>
        </div>

        {/* 7 Color-Coded Status Selection Grid */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Select New Delivery Status:</span>
            <span className="text-[11px] text-amber-400 font-normal">7 Supported Life-Cycle States</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {STATUS_DETAILS.map((item) => {
              const isSelected = selectedStatus === item.status;
              return (
                <button
                  key={item.status}
                  type="button"
                  onClick={() => handleSelectStatus(item)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                      : 'bg-[#10141d]/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-[#10141d]'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    <div
                      className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-amber-400 bg-amber-400 text-slate-950'
                          : 'border-slate-600'
                      }`}
                    >
                      {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-slate-950" />}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-xs font-bold text-white">{item.label}</span>
                      <StatusBadge status={item.status} size="sm" />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug truncate">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Checkpoint Location & Operator Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-amber-400" />
              <span>Checkpoint Location:</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Chicago Regional Hub #4, IL"
              className="w-full px-4 py-2.5 bg-[#10141d] border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-amber-400" />
              <span>Updated By (Operator / Agent):</span>
            </label>
            <input
              type="text"
              value={updatedBy}
              onChange={(e) => setUpdatedBy(e.target.value)}
              placeholder="e.g. Dispatch Controller or Courier Unit"
              className="w-full px-4 py-2.5 bg-[#10141d] border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
              required
            />
          </div>
        </div>

        {/* Status Transition Remarks & Quick Chips */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-amber-400" />
              <span>Checkpoint Audit Notes / Remarks:</span>
            </span>
            <span className="text-[11px] text-slate-400">Recorded into Status History</span>
          </label>

          <textarea
            rows="2"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter reason or operational details..."
            className="w-full px-4 py-2.5 bg-[#10141d] border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 resize-none"
            required
          />

          {/* Suggested Quick Remarks Chips */}
          {currentConfig?.suggestedRemarks?.length > 0 && (
            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Quick-Fill Operational Remarks:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentConfig.suggestedRemarks.map((remarkText, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRemarks(remarkText)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[#10141d] hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-800 transition-colors cursor-pointer text-left"
                  >
                    "{remarkText}"
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-[#1a1f2c] hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs sm:text-sm font-black transition-all shadow-lg shadow-amber-500/25 cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <span>Updating...</span>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 stroke-[3]" />
                <span>Save & Record Status Transition</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
