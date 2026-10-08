import React, { useState } from 'react';
import { Modal, StatusBadge } from '../ui/FeedbackComponents';
import {
  Boxes,
  Clock,
  MapPin,
  User,
  Copy,
  Check,
  ArrowRight,
  ArrowDownUp,
  History,
  ShieldCheck,
  PlusCircle,
  FileText
} from 'lucide-react';
import { toast } from 'react-toastify';

export const StatusHistoryModal = ({
  isOpen,
  onClose,
  shipment,
  onOpenUpdateModal
}) => {
  const [copied, setCopied] = useState(false);
  const [isSortDesc, setIsSortDesc] = useState(true); // true = latest first, false = chronological

  if (!shipment) return null;

  const rawHistory = Array.isArray(shipment.statusHistory) && shipment.statusHistory.length > 0
    ? shipment.statusHistory
    : [
        {
          id: 'def-1',
          status: shipment.deliveryStatus || 'Pending',
          timestamp: shipment.shippingDate ? `${shipment.shippingDate} 09:00 AM` : 'Initial Registration',
          location: shipment.pickupAddress?.split(',')[1]?.trim() || 'Logistics Depot',
          remarks: 'Consignment manifest generated in system.',
          updatedBy: shipment.senderName || 'Dispatch Controller'
        }
      ];

  // Sort history based on toggle (latest first vs oldest first)
  const historyList = isSortDesc ? [...rawHistory] : [...rawHistory].reverse();

  const handleCopyHistory = () => {
    const textLines = [
      `=== CPTS CONSIGNMENT AUDIT HISTORY ===`,
      `Tracking Number: ${shipment.trackingNumber}`,
      `Current Status: ${shipment.deliveryStatus}`,
      `Consignor: ${shipment.senderName} (${shipment.pickupAddress})`,
      `Consignee: ${shipment.receiverName} (${shipment.deliveryAddress})`,
      `Total Transitions: ${rawHistory.length}`,
      `---------------------------------------`,
      ...rawHistory.map(
        (h, idx) =>
          `[${idx + 1}] ${h.timestamp} | Status: ${h.status} | Location: ${h.location} | By: ${h.updatedBy || 'Operations'}\n    Remarks: ${h.remarks}`
      )
    ];

    navigator.clipboard.writeText(textLines.join('\n'));
    setCopied(true);
    toast.success(`Copied status history for ${shipment.trackingNumber} to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Consignment Audit & Status History"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        
        {/* Top Summary Header Banner */}
        <div className="p-4 rounded-2xl bg-[#10141d] border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center font-bold">
              <Boxes className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white font-mono">
                  {shipment.trackingNumber}
                </span>
                <span className="text-xs text-slate-400">({shipment.parcelType})</span>
              </div>
              <p className="text-xs text-slate-400">
                From: <span className="text-slate-200">{shipment.senderName}</span> → To: <span className="text-slate-200">{shipment.receiverName}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <StatusBadge status={shipment.deliveryStatus} />
            <button
              type="button"
              onClick={handleCopyHistory}
              className="p-2 bg-[#1a1f2c] hover:bg-slate-800 text-slate-400 hover:text-amber-400 rounded-xl transition-colors cursor-pointer border border-slate-700/80"
              title="Copy complete audit log"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Audit Stats & Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <History className="h-4 w-4 text-amber-400" />
            <span className="font-semibold text-slate-300">
              {rawHistory.length} Checkpoint Transition{rawHistory.length !== 1 ? 's' : ''} Logged
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSortDesc(!isSortDesc)}
              className="px-2.5 py-1 text-[11px] font-bold bg-[#10141d] hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowDownUp className="h-3 w-3 text-amber-400" />
              <span>{isSortDesc ? 'Showing: Newest First' : 'Showing: Oldest First'}</span>
            </button>

            {onOpenUpdateModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenUpdateModal(shipment);
                }}
                className="px-3 py-1 text-[11px] font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 rounded-lg border border-amber-500/35 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="h-3 w-3" />
                <span>+ Add Transition</span>
              </button>
            )}
          </div>
        </div>

        {/* Chronological Audit Timeline */}
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {historyList.map((entry, index) => {
            const isFirst = index === 0;
            return (
              <div key={entry.id || index} className="relative group">
                {/* Timeline Dot Indicator */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-1 h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ring-4 ring-[#141822] ${
                    isFirst && isSortDesc
                      ? 'bg-amber-500 text-slate-950 ring-amber-500/25 font-black'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {isSortDesc ? historyList.length - index : index + 1}
                </div>

                {/* Audit Card */}
                <div
                  className={`p-4 rounded-2xl border transition-all ${
                    isFirst && isSortDesc
                      ? 'bg-[#141822] border-amber-500/35 shadow-md shadow-amber-500/5'
                      : 'bg-[#10141d]/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={entry.status} />
                      {isFirst && isSortDesc && (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          Current Stage
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      <span>{entry.timestamp}</span>
                    </div>
                  </div>

                  {/* Remarks */}
                  <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium leading-relaxed">
                    {entry.remarks}
                  </p>

                  {/* Location & Operator Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5 text-amber-400/90 font-medium">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span>{entry.location}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400">
                      <User className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span>Logged by: <strong className="text-slate-300">{entry.updatedBy || 'Operations Team'}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Close Action */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
          <p className="text-xs text-slate-500">
            Audit logs are permanently synced to local dispatch cache.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#1a1f2c] hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close Audit Trail
          </button>
        </div>
      </div>
    </Modal>
  );
};
