import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Package,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ExternalLink,
  Trash2,
  Check,
  X
} from 'lucide-react';

export const NotificationBell = () => {
  const {
    notifications,
    unreadCount,
    recentNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'FAILED_DELIVERY':
        return <AlertTriangle className="h-4 w-4 text-rose-400" />;
      case 'DELIVERY_COMPLETED':
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case 'STATUS_UPDATED':
        return <RefreshCw className="h-4 w-4 text-blue-400" />;
      case 'SHIPMENT_CREATED':
      default:
        return <Package className="h-4 w-4 text-amber-400" />;
    }
  };

  const getNotificationColorBg = (type) => {
    switch (type) {
      case 'FAILED_DELIVERY':
        return 'bg-rose-500/15 border-rose-500/30';
      case 'DELIVERY_COMPLETED':
        return 'bg-emerald-500/15 border-emerald-500/30';
      case 'STATUS_UPDATED':
        return 'bg-blue-500/15 border-blue-500/30';
      case 'SHIPMENT_CREATED':
      default:
        return 'bg-amber-500/15 border-amber-500/30';
    }
  };

  const handleNotificationClick = (item) => {
    markAsRead(item.id);
    if (item.trackingNumber) {
      setIsOpen(false);
      navigate(`/tracking/${item.trackingNumber}`);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button with Live Badge */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-[#1a1f2c] hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-700/80 transition-colors cursor-pointer flex items-center justify-center focus:outline-none"
        title="View Notifications"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />

        {/* Unread Badge Count */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black text-[10px] shadow-lg shadow-amber-500/30 border border-[#141822] animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#141822] border border-amber-500/25 shadow-2xl z-50 overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3.5 bg-[#10141d] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                <Bell className="h-4 w-4 text-amber-400" />
                <span>Notifications</span>
              </span>
              {unreadCount > 0 ? (
                <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                  {unreadCount} unread
                </span>
              ) : (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  All caught up
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] font-semibold text-amber-400/90 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Recent Notification List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
            {recentNotifications.length === 0 ? (
              <div className="p-6 text-center text-slate-400">
                <Bell className="h-8 w-8 text-slate-600 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold text-slate-300">No notifications yet</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Real-time events will be logged here.
                </p>
              </div>
            ) : (
              recentNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 relative group ${
                    !item.isRead
                      ? 'bg-[#181d2a]/80 hover:bg-[#1a2030]'
                      : 'hover:bg-slate-850/50 opacity-80 hover:opacity-100'
                  }`}
                >
                  {/* Category Icon */}
                  <div
                    className={`h-8 w-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${getNotificationColorBg(
                      item.type
                    )}`}
                  >
                    {getNotificationIcon(item.type)}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4
                        className={`text-xs font-bold truncate ${
                          !item.isRead ? 'text-white' : 'text-slate-300'
                        }`}
                      >
                        {item.title}
                      </h4>
                      {!item.isRead && (
                        <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0 animate-pulse" />
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>

                    <div className="flex items-center justify-between gap-2 mt-1.5 text-[10px] text-slate-500">
                      <span className="font-mono text-slate-400">
                        {item.formattedTime}
                      </span>
                      {item.trackingNumber && (
                        <span className="font-mono font-bold text-amber-400/90 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                          {item.trackingNumber}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions (Mark as Read / Delete) */}
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-all absolute right-2 top-2">
                    {!item.isRead && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(item.id);
                        }}
                        className="p-1 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded transition-all cursor-pointer"
                        title="Mark as read"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(item.id);
                      }}
                      className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition-all cursor-pointer"
                      title="Remove notification"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Link to Dedicated Notification Center */}
          <div className="p-2.5 bg-[#10141d] border-t border-slate-800 flex items-center justify-between">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="w-full py-1.5 px-3 rounded-xl bg-[#141822] hover:bg-slate-800 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center justify-center gap-1.5 border border-amber-500/20"
            >
              <span>Open Notification Center ({notifications.length})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
