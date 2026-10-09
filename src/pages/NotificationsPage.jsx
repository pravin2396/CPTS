import React, { useState, useMemo } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Sidebar } from '../components/Sidebar';
import { NotificationBell } from '../components/notifications/NotificationBell';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Package,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Trash2,
  X,
  ExternalLink,
  RotateCcw,
  Menu,
  Inbox
} from 'lucide-react';
import { EmptyState } from '../components/ui/FeedbackComponents';

export const NotificationsPage = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    clearReadNotifications,
    clearAllNotifications,
    resetNotificationsToDefault
  } = useNotifications();

  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Counts by category
  const counts = useMemo(() => {
    return {
      all: notifications.length,
      unread: notifications.filter((n) => !n.isRead).length,
      created: notifications.filter((n) => n.type === 'SHIPMENT_CREATED').length,
      status: notifications.filter((n) => n.type === 'STATUS_UPDATED').length,
      delivered: notifications.filter((n) => n.type === 'DELIVERY_COMPLETED').length,
      failed: notifications.filter((n) => n.type === 'FAILED_DELIVERY').length
    };
  }, [notifications]);

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Category filter
      if (selectedFilter === 'UNREAD' && item.isRead) return false;
      if (selectedFilter === 'SHIPMENT_CREATED' && item.type !== 'SHIPMENT_CREATED') return false;
      if (selectedFilter === 'STATUS_UPDATED' && item.type !== 'STATUS_UPDATED') return false;
      if (selectedFilter === 'DELIVERY_COMPLETED' && item.type !== 'DELIVERY_COMPLETED') return false;
      if (selectedFilter === 'FAILED_DELIVERY' && item.type !== 'FAILED_DELIVERY') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesMsg = item.message?.toLowerCase().includes(q);
        const matchesTrk = item.trackingNumber?.toLowerCase().includes(q);
        const matchesRec = item.recipient?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesMsg && !matchesTrk && !matchesRec) {
          return false;
        }
      }

      return true;
    });
  }, [notifications, selectedFilter, searchQuery]);

  const getCategoryDetails = (type) => {
    switch (type) {
      case 'FAILED_DELIVERY':
        return {
          icon: AlertTriangle,
          badgeText: 'Failed Delivery Alert',
          badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
          iconBg: 'bg-rose-500/15 text-rose-400 border-rose-500/30'
        };
      case 'DELIVERY_COMPLETED':
        return {
          icon: CheckCircle2,
          badgeText: 'Delivery Completed Notification',
          badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
        };
      case 'STATUS_UPDATED':
        return {
          icon: RefreshCw,
          badgeText: 'Delivery Status Update Notification',
          badgeClass: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
          iconBg: 'bg-blue-500/15 text-blue-400 border-blue-500/30'
        };
      case 'SHIPMENT_CREATED':
      default:
        return {
          icon: Package,
          badgeText: 'Shipment Created Notification',
          badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          iconBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30'
        };
    }
  };

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
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer"
              aria-label="Open Sidebar Navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                <Bell className="h-5 w-5 text-amber-400" />
                <span>Notification Center</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1a1f2c] hover:bg-slate-800 text-amber-300 hover:text-amber-200 rounded-xl text-xs font-bold border border-amber-500/30 transition-all cursor-pointer"
              >
                <CheckCheck className="h-4 w-4" />
                <span>Mark All as Read ({unreadCount})</span>
              </button>
            )}

            <button
              type="button"
              onClick={resetNotificationsToDefault}
              title="Reset default notifications"
              className="px-3 py-1.5 bg-[#1a1f2c] hover:bg-slate-800 text-slate-300 hover:text-amber-400 rounded-xl text-xs font-semibold border border-slate-700/80 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset Seed</span>
            </button>

            {/* Header Bell Component */}
            <NotificationBell />
          </div>
        </header>

        {/* Content Area - Edge to Edge Layout */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 w-full relative z-10">
          
          {/* Top 4 KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* 1. Total Notifications */}
            <div className="bg-[#141822]/90 backdrop-blur-xl p-5 rounded-[24px] border border-amber-500/20 shadow-lg flex items-center justify-between hover:border-amber-500/40 transition-all">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Notifications
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white mt-1 block font-mono">
                  {counts.all}
                </span>
                <span className="text-[11px] text-amber-400/90 font-medium flex items-center gap-1 mt-1">
                  All Logged Events
                </span>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 shadow-inner shrink-0">
                <Bell className="h-6 w-6" />
              </div>
            </div>

            {/* 2. Unread Alerts */}
            <div className="bg-[#141822]/90 backdrop-blur-xl p-5 rounded-[24px] border border-blue-500/20 shadow-lg flex items-center justify-between hover:border-blue-500/40 transition-all">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Unread Alerts
                </span>
                <span className="text-2xl sm:text-3xl font-black text-blue-400 mt-1 block font-mono">
                  {counts.unread}
                </span>
                <span className="text-[11px] text-blue-300/80 font-medium flex items-center gap-1 mt-1">
                  Awaiting Review
                </span>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 shadow-inner shrink-0">
                <Clock className="h-6 w-6" />
              </div>
            </div>

            {/* 3. Delivery Completed */}
            <div className="bg-[#141822]/90 backdrop-blur-xl p-5 rounded-[24px] border border-emerald-500/20 shadow-lg flex items-center justify-between hover:border-emerald-500/40 transition-all">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Delivery Completed
                </span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 block font-mono">
                  {counts.delivered}
                </span>
                <span className="text-[11px] text-emerald-300/80 font-medium flex items-center gap-1 mt-1">
                  Signed Deliveries
                </span>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-inner shrink-0">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>

            {/* 4. Failed Delivery Alerts */}
            <div className="bg-[#141822]/90 backdrop-blur-xl p-5 rounded-[24px] border border-rose-500/20 shadow-lg flex items-center justify-between hover:border-rose-500/40 transition-all">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Failed Delivery Alerts
                </span>
                <span className="text-2xl sm:text-3xl font-black text-rose-400 mt-1 block font-mono">
                  {counts.failed}
                </span>
                <span className="text-[11px] text-rose-300/80 font-medium flex items-center gap-1 mt-1">
                  Exceptions & Holds
                </span>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20 shadow-inner shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Search, Filter Tabs & Batch Action Toolbar */}
          <div className="bg-[#141822]/90 backdrop-blur-xl p-4 sm:p-5 rounded-[28px] border border-amber-500/20 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notifications by consignment ID, recipient, or event details..."
                  className="w-full pl-11 pr-10 py-2.5 text-xs sm:text-sm bg-[#10141d] border border-slate-700/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 text-white placeholder-slate-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Batch Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="px-3 py-2 bg-[#1a1f2c] hover:bg-slate-800 text-slate-300 hover:text-amber-300 rounded-xl text-xs font-bold border border-slate-700/80 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCheck className="h-3.5 w-3.5 text-amber-400" />
                  <span>Mark All Read</span>
                </button>

                <button
                  type="button"
                  onClick={clearReadNotifications}
                  className="px-3 py-2 bg-[#1a1f2c] hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-bold border border-slate-700/80 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear Read</span>
                </button>

                <button
                  type="button"
                  onClick={clearAllNotifications}
                  className="px-3 py-2 bg-[#1a1f2c] hover:bg-rose-500/15 text-slate-400 hover:text-rose-400 rounded-xl text-xs font-bold border border-slate-700/80 hover:border-rose-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear All</span>
                </button>
              </div>
            </div>

            {/* Filter Category Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
              <span className="text-xs font-semibold text-slate-400 mr-1">Categories:</span>

              <button
                type="button"
                onClick={() => setSelectedFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  selectedFilter === 'ALL'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md shadow-amber-500/20'
                    : 'bg-[#10141d] text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                All ({counts.all})
              </button>

              <button
                type="button"
                onClick={() => setSelectedFilter('UNREAD')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  selectedFilter === 'UNREAD'
                    ? 'bg-blue-500/20 text-blue-300 border-blue-400 font-black shadow-md shadow-blue-500/20'
                    : 'bg-[#10141d] text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                Unread ({counts.unread})
              </button>

              <button
                type="button"
                onClick={() => setSelectedFilter('SHIPMENT_CREATED')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  selectedFilter === 'SHIPMENT_CREATED'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-black shadow-md shadow-amber-500/20'
                    : 'bg-[#10141d] text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                Shipment Created ({counts.created})
              </button>

              <button
                type="button"
                onClick={() => setSelectedFilter('STATUS_UPDATED')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  selectedFilter === 'STATUS_UPDATED'
                    ? 'bg-blue-500/20 text-blue-300 border-blue-400 font-black shadow-md shadow-blue-500/20'
                    : 'bg-[#10141d] text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                Status Updates ({counts.status})
              </button>

              <button
                type="button"
                onClick={() => setSelectedFilter('DELIVERY_COMPLETED')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  selectedFilter === 'DELIVERY_COMPLETED'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 font-black shadow-md shadow-emerald-500/20'
                    : 'bg-[#10141d] text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                Delivery Completed ({counts.delivered})
              </button>

              <button
                type="button"
                onClick={() => setSelectedFilter('FAILED_DELIVERY')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  selectedFilter === 'FAILED_DELIVERY'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-400 font-black shadow-md shadow-rose-500/20'
                    : 'bg-[#10141d] text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                Failed Alerts ({counts.failed})
              </button>
            </div>
          </div>

          {/* Notifications Feed & List */}
          {filteredNotifications.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No Notifications Found"
              description={`There are no alerts matching the selected category "${selectedFilter}". Try resetting your filters.`}
              actionText="Reset Filters"
              onAction={() => {
                setSelectedFilter('ALL');
                setSearchQuery('');
              }}
            />
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((item) => {
                const cat = getCategoryDetails(item.type);
                const IconComponent = cat.icon;

                return (
                  <div
                    key={item.id}
                    className={`p-4 sm:p-5 rounded-[24px] border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group ${
                      !item.isRead
                        ? 'bg-[#141822]/95 border-amber-500/35 shadow-lg shadow-black/40 ring-1 ring-amber-500/10'
                        : 'bg-[#10141d]/75 border-slate-800/80 hover:border-slate-700/80 opacity-90 hover:opacity-100'
                    }`}
                  >
                    {/* Left: Icon & Notification Info */}
                    <div className="flex items-start gap-3.5 min-w-0">
                      {/* Icon */}
                      <div
                        className={`h-11 w-11 rounded-2xl border flex items-center justify-center shrink-0 mt-0.5 ${cat.iconBg}`}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${cat.badgeClass}`}
                          >
                            {cat.badgeText}
                          </span>

                          {!item.isRead ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                              Unread
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-slate-500">
                              Read
                            </span>
                          )}

                          <span className="text-xs text-slate-500 font-mono">
                            • {item.formattedTime}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-white tracking-tight">
                          {item.title}
                        </h3>

                        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                          {item.message}
                        </p>
                      </div>
                    </div>

                    {/* Right: Tracking Link & Operational Actions */}
                    <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/60 shrink-0">
                      {item.trackingNumber && (
                        <button
                          type="button"
                          onClick={() => navigate(`/tracking/${item.trackingNumber}`)}
                          className="px-3 py-1.5 rounded-xl bg-[#10141d] hover:bg-slate-800 text-amber-400 hover:text-amber-300 text-xs font-mono font-bold border border-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                          title="Track this parcel"
                        >
                          <span>{item.trackingNumber}</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </button>
                      )}

                      {/* Toggle Read / Unread */}
                      <button
                        type="button"
                        onClick={() =>
                          item.isRead ? markAsUnread(item.id) : markAsRead(item.id)
                        }
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          item.isRead
                            ? 'bg-[#181d2a] hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700/80'
                            : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {item.isRead ? 'Mark as Unread' : 'Mark as Read'}
                      </button>

                      {/* Delete Notification */}
                      <button
                        type="button"
                        onClick={() => deleteNotification(item.id)}
                        className="p-1.5 bg-[#181d2a] hover:bg-rose-500/15 text-slate-400 hover:text-rose-400 rounded-xl border border-slate-700/80 hover:border-rose-500/30 transition-all cursor-pointer"
                        title="Delete notification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
