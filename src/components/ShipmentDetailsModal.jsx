import React, { useState, useEffect } from 'react';
import { Modal, StatusBadge } from './ui/FeedbackComponents';
import { apiGetShipmentById } from '../services/shipmentApiService';
import {
  Boxes,
  Truck,
  MapPin,
  Calendar,
  Weight,
  User,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Edit2,
  Trash2
} from 'lucide-react';
import { toast } from 'react-toastify';

export const ShipmentDetailsModal = ({
  isOpen,
  onClose,
  shipment,
  onEdit,
  onDelete
}) => {
  const [copied, setCopied] = useState(false);

  // Replicate READ [GET /posts/:id] in Network tab when modal opens
  useEffect(() => {
    if (isOpen && shipment?.id) {
      apiGetShipmentById(shipment.id);
    }
  }, [isOpen, shipment?.id]);

  if (!shipment) return null;

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(shipment.trackingNumber);
    setCopied(true);
    toast.success(`Copied ${shipment.trackingNumber} to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const STAGES = ['Pending', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'];
  const normalizedStatus = shipment.deliveryStatus === 'Booked' ? 'Pending' : shipment.deliveryStatus;
  const currentStageIndex = STAGES.indexOf(normalizedStatus);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Consignment Manifest Details"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        
        {/* Top Header Card */}
        <div className="p-4 rounded-2xl bg-[#10141d] border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <Boxes className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white font-mono tracking-tight">
                  {shipment.trackingNumber}
                </span>
                <button
                  type="button"
                  onClick={handleCopyTracking}
                  className="p-1 text-slate-400 hover:text-amber-400 rounded-md transition-colors cursor-pointer"
                  title="Copy tracking number"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Logistics Dispatch • ID #{shipment.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={shipment.deliveryStatus} />
          </div>
        </div>

        {/* Visual Logistics Progress Timeline */}
        <div className="p-4 rounded-2xl bg-[#10141d]/70 border border-slate-800">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Consignment Lifecycle Progression
          </p>
          <div className="relative">
            {/* Connecting Track */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-slate-800 -z-0 hidden md:block" />
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 relative z-10">
              {STAGES.map((stage, idx) => {
                const isPassed = currentStageIndex >= idx;
                const isCurrent = currentStageIndex === idx;

                return (
                  <div
                    key={stage}
                    className={`flex flex-col items-center text-center p-2 rounded-xl transition-all ${
                      isCurrent
                        ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300'
                        : isPassed
                        ? 'text-slate-200'
                        : 'text-slate-600'
                    }`}
                  >
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 ${
                        isCurrent
                          ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20'
                          : isPassed
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isPassed && !isCurrent ? (
                        <Check className="h-4 w-4 stroke-[3]" />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <span className="text-[11px] font-bold leading-tight">{stage}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sender & Receiver Dual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Origin / Sender */}
          <div className="p-4 rounded-2xl bg-[#10141d]/80 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                Origin / Consignor
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Terminal Alpha</span>
            </div>

            <div>
              <p className="text-sm font-bold text-white">{shipment.senderName}</p>
              <div className="flex items-start gap-2 text-xs text-slate-400 mt-1.5">
                <MapPin className="h-4 w-4 text-amber-400/80 shrink-0 mt-0.5" />
                <span>{shipment.pickupAddress}</span>
              </div>
            </div>
          </div>

          {/* Destination / Receiver */}
          <div className="p-4 rounded-2xl bg-[#10141d]/80 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5" />
                Destination / Consignee
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Hub Bravo</span>
            </div>

            <div>
              <p className="text-sm font-bold text-white">{shipment.receiverName}</p>
              <div className="flex items-start gap-2 text-xs text-slate-400 mt-1.5">
                <MapPin className="h-4 w-4 text-blue-400/80 shrink-0 mt-0.5" />
                <span>{shipment.deliveryAddress}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Shipment Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-[#10141d]/60 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Parcel Type</span>
            <span className="text-xs sm:text-sm font-bold text-slate-200 mt-0.5 block truncate">
              {shipment.parcelType}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#10141d]/60 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Weight</span>
            <span className="text-xs sm:text-sm font-bold text-amber-400 mt-0.5 block">
              {shipment.parcelWeight} kg
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#10141d]/60 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Shipping Date</span>
            <span className="text-xs sm:text-sm font-bold text-slate-200 mt-0.5 block">
              {shipment.shippingDate}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#10141d]/60 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Expected Delivery</span>
            <span className="text-xs sm:text-sm font-bold text-emerald-400 mt-0.5 block">
              {shipment.expectedDeliveryDate}
            </span>
          </div>
        </div>

        {/* Special Handling Notes */}
        {shipment.notes && (
          <div className="p-3.5 rounded-xl bg-[#10141d]/40 border border-slate-800 text-xs">
            <span className="font-bold text-amber-400 block mb-0.5">Special Handling Instructions / Notes:</span>
            <span className="text-slate-300">{shipment.notes}</span>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onEdit) onEdit(shipment);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1a1f2c] hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-xl border border-amber-500/20 transition-colors cursor-pointer"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Edit Shipment</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                if (onDelete) onDelete(shipment);
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
            Close Details
          </button>
        </div>

      </div>
    </Modal>
  );
};
