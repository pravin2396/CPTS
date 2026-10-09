import React from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-6 text-center">
        <div
          className={`relative transform overflow-hidden rounded-[28px] bg-[#141822] text-left shadow-2xl transition-all w-full ${maxWidth} border border-amber-500/25 my-8`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 px-6 py-4 bg-[#10141d]">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-5 max-h-[82vh] overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};

export const EmptyState = ({
  icon: Icon,
  title = 'No Shipments Found',
  description = 'There are no records matching your selected query or filters.',
  actionText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-[#141822]/60 rounded-[28px] border border-dashed border-amber-500/20">
      <div className="h-16 w-16 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mb-4 border border-amber-500/20 shadow-inner">
        {Icon ? <Icon className="h-8 w-8" /> : null}
      </div>
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-400 max-w-sm mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export const SkeletonRow = () => {
  return (
    <tr className="animate-pulse border-b border-slate-800/80">
      <td className="py-4 px-4"><div className="h-4 bg-slate-800 rounded-md w-24"></div></td>
      <td className="py-4 px-4"><div className="h-4 bg-slate-800 rounded-md w-36"></div></td>
      <td className="py-4 px-4"><div className="h-4 bg-slate-800 rounded-md w-36"></div></td>
      <td className="py-4 px-4"><div className="h-4 bg-slate-800 rounded-md w-28"></div></td>
      <td className="py-4 px-4"><div className="h-4 bg-slate-800 rounded-md w-24"></div></td>
      <td className="py-4 px-4"><div className="h-6 bg-slate-800 rounded-full w-20"></div></td>
      <td className="py-4 px-4 text-right"><div className="h-8 bg-slate-800 rounded-xl w-24 ml-auto"></div></td>
    </tr>
  );
};

export const StatusBadge = ({ status, size = 'md', className = '' }) => {
  const normalized = status === 'Booked' ? 'Pending' : status;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-[11px] px-2.5 py-1',
    lg: 'text-xs px-3 py-1.5'
  }[size] || 'text-[11px] px-2.5 py-1';

  switch (normalized) {
    case 'Pending':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-amber-500/15 text-amber-300 border border-amber-500/35 shadow-sm shadow-amber-500/10 ${sizeClasses} ${className}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          Pending
        </span>
      );

    case 'Picked Up':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-purple-500/15 text-purple-300 border border-purple-500/35 shadow-sm shadow-purple-500/10 ${sizeClasses} ${className}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
          Picked Up
        </span>
      );

    case 'In Transit':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-blue-500/15 text-blue-400 border border-blue-500/35 shadow-sm shadow-blue-500/10 ${sizeClasses} ${className}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
          In Transit
        </span>
      );

    case 'Out for Delivery':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-orange-500/15 text-orange-400 border border-orange-500/35 shadow-sm shadow-orange-500/10 ${sizeClasses} ${className}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-ping" />
          Out for Delivery
        </span>
      );

    case 'Delivered':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/35 shadow-sm shadow-emerald-500/10 ${sizeClasses} ${className}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Delivered
        </span>
      );

    case 'Cancelled':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-slate-500/20 text-slate-300 border border-slate-600/40 shadow-sm ${sizeClasses} ${className}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
          Cancelled
        </span>
      );

    case 'Failed Delivery':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-rose-500/15 text-rose-400 border border-rose-500/35 shadow-sm shadow-rose-500/10 ${sizeClasses} ${className}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
          Failed Delivery
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-slate-500/15 text-slate-300 border border-slate-500/30 ${sizeClasses} ${className}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
          {status || 'Unknown'}
        </span>
      );
  }
};

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', confirmColor = 'rose' }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
          <AlertTriangle className="h-6 w-6 shrink-0" />
          <p className="text-xs sm:text-sm text-slate-200">{message}</p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#1a1f2c] hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-rose-600/30 cursor-pointer"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
