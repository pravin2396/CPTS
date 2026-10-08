import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { StatusBadge } from '../components/ui/FeedbackComponents';
import { NotificationBell } from '../components/notifications/NotificationBell';
import {
  Boxes,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Users,
  Calendar,
  Percent,
  PlusCircle,
  Search,
  RefreshCw,
  LogOut,
  ChevronRight,
  TrendingUp,
  MapPin,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Filter,
  Menu,
  X
} from 'lucide-react';

export const DashboardPage = () => {
  const { currentUser, logoutUser } = useAuth();
  const {
    totalShipments,
    inTransitParcels,
    deliveredParcels,
    pendingDeliveries,
    totalCustomers,
    todaysShipments,
    deliverySuccessRate,
    recentActivities,
    shipments,
    addQuickShipment,
    resetDashboardData
  } = useDashboard();

  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  // Filter shipments table
  const filteredShipments = shipments.filter((s) => {
    const matchesFilter = filterStatus === 'ALL' || s.status === filterStatus;
    const matchesSearch =
      s.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.destination.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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

      {/* ============================================================== */}
      {/* SIDEBAR NAVIGATION (Theme 4 Charcoal & Amber)                  */}
      {/* ============================================================== */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* ============================================================== */}
      {/* MAIN VIEWPORT (With lg:pl-72 to accommodate sidebar)          */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all">
        
        {/* TOP HEADER */}
        <header className="sticky top-0 z-30 h-16 w-full bg-[#141822]/85 backdrop-blur-xl border-b border-amber-500/20 px-4 sm:px-8 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors focus:outline-none"
              aria-label="Open Sidebar Navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2.5">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-300">
                Hub Active • {totalShipments} Shipments Monitored
              </span>
            </div>
          </div>

          {/* Right Nav Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={resetDashboardData}
              title="Reset to default seed metrics"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1f2c] hover:bg-[#232a3b] text-slate-300 hover:text-amber-300 rounded-xl text-xs font-semibold border border-slate-700/80 transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5 text-amber-400" />
              <span>Reset Demo</span>
            </button>

            {/* Notification Bell */}
            <NotificationBell />

            {/* User Profile Pill */}
            <div className="flex items-center gap-2.5 px-3 py-1 bg-[#1a1f2c] rounded-xl border border-slate-700/80">
              <div className="h-7 w-7 rounded-lg bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center uppercase border border-amber-500/30">
                {currentUser?.name ? currentUser.name.slice(0, 2) : 'US'}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-white leading-none">
                  {currentUser?.name || 'Administrator'}
                </div>
                <div className="text-[10px] text-amber-400/90 font-medium capitalize mt-0.5">
                  {currentUser?.role || 'Admin'}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* MAIN DASHBOARD CONTENT */}
        <main className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Welcome & Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Logistics Dispatch Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Real-time shipment statuses, carrier efficiency, and automated warehouse updates.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Gateway Online • 24/7 Monitoring
              </span>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 1. KEY METRIC KPI CARDS                                        */}
          {/* ============================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            
            {/* 1. Total Shipments */}
            <div className="bg-[#141822]/85 backdrop-blur-xl rounded-[24px] p-5 sm:p-6 border border-amber-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-between hover:border-amber-500/40 transition-all">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Shipments
                </span>
                <span className="text-3xl font-black text-white mt-1.5 block">
                  {totalShipments}
                </span>
                <span className="text-[11px] text-amber-400/90 font-medium flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" /> All Registered
                </span>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 shadow-inner">
                <Package className="h-6 w-6" />
              </div>
            </div>

            {/* 2. In Transit Parcels */}
            <div className="bg-[#141822]/85 backdrop-blur-xl rounded-[24px] p-5 sm:p-6 border border-blue-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-between hover:border-blue-500/40 transition-all">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  In Transit Parcels
                </span>
                <span className="text-3xl font-black text-blue-400 mt-1.5 block">
                  {inTransitParcels}
                </span>
                <span className="text-[11px] text-blue-300/80 font-medium flex items-center gap-1 mt-1">
                  <Truck className="h-3 w-3" /> Live Carrier Routes
                </span>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 shadow-inner">
                <Truck className="h-6 w-6" />
              </div>
            </div>

            {/* 3. Delivered Parcels */}
            <div className="bg-[#141822]/85 backdrop-blur-xl rounded-[24px] p-5 sm:p-6 border border-emerald-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-between hover:border-emerald-500/40 transition-all">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Delivered Parcels
                </span>
                <span className="text-3xl font-black text-emerald-400 mt-1.5 block">
                  {deliveredParcels}
                </span>
                <span className="text-[11px] text-emerald-300/80 font-medium flex items-center gap-1 mt-1">
                  <CheckCircle2 className="h-3 w-3" /> Handed Over
                </span>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-inner">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>

            {/* 4. Pending Deliveries */}
            <div className="bg-[#141822]/85 backdrop-blur-xl rounded-[24px] p-5 sm:p-6 border border-rose-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-between hover:border-rose-500/40 transition-all">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Pending Deliveries
                </span>
                <span className="text-3xl font-black text-rose-400 mt-1.5 block">
                  {pendingDeliveries}
                </span>
                <span className="text-[11px] text-rose-300/80 font-medium flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" /> Awaiting Courier
                </span>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20 shadow-inner">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Secondary KPI Row: Total Customers, Today's Shipments, Success Rate */}
          <div id="metrics-section" className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 scroll-mt-24">
            
            {/* 5. Total Customers */}
            <div className="bg-[#141822]/85 backdrop-blur-xl rounded-[24px] p-5 sm:p-6 border border-amber-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Customers
                </span>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-3xl font-black text-white">{totalCustomers}</span>
                  <span className="text-xs text-amber-400 font-semibold">+12% this month</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Verified enterprise accounts</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Users className="h-6 w-6" />
              </div>
            </div>

            {/* 6. Today's Shipments */}
            <div className="bg-[#141822]/85 backdrop-blur-xl rounded-[24px] p-5 sm:p-6 border border-amber-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Today's Shipments
                </span>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-3xl font-black text-amber-400">{todaysShipments}</span>
                  <span className="text-xs text-slate-400 font-semibold">Dispatched today</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Oct 06, 2026 Batch Manifest</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Calendar className="h-6 w-6" />
              </div>
            </div>

            {/* 7. Delivery Success Rate */}
            <div className="bg-[#141822]/85 backdrop-blur-xl rounded-[24px] p-5 sm:p-6 border border-emerald-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Delivery Success Rate
                </span>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-3xl font-black text-emerald-400">{deliverySuccessRate}%</span>
                  <span className="text-xs text-emerald-300 font-semibold">Optimal</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">On-time SLA achievement</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Percent className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 2. QUICK ACTION CARDS                                          */}
          {/* ============================================================== */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-400" />
                Quick Action Cards
              </h2>
              <span className="text-xs text-slate-400 font-semibold">One-click operational shortcuts</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Action 1: Create Quick Shipment */}
              <div
                onClick={() => addQuickShipment({ recipient: 'Express Client', destination: 'Denver, CO', status: 'In Transit' })}
                className="bg-[#141822]/90 backdrop-blur-xl p-5 rounded-[22px] border border-amber-500/20 hover:border-amber-400/50 hover:bg-[#181d2a] transition-all cursor-pointer group shadow-lg"
              >
                <div className="h-10 w-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <PlusCircle className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  Quick Dispatch Parcel
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Instantly generate a test tracking manifest
                </p>
              </div>

              {/* Action 2: Check Transit Statuses */}
              <div
                onClick={() => setFilterStatus('In Transit')}
                className="bg-[#141822]/90 backdrop-blur-xl p-5 rounded-[22px] border border-blue-500/20 hover:border-blue-400/50 hover:bg-[#181d2a] transition-all cursor-pointer group shadow-lg"
              >
                <div className="h-10 w-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Truck className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                  View Active Transit
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Filter packages currently on the route
                </p>
              </div>

              {/* Action 3: Review Completed Deliveries */}
              <div
                onClick={() => setFilterStatus('Delivered')}
                className="bg-[#141822]/90 backdrop-blur-xl p-5 rounded-[22px] border border-emerald-500/20 hover:border-emerald-400/50 hover:bg-[#181d2a] transition-all cursor-pointer group shadow-lg"
              >
                <div className="h-10 w-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Delivered Archive
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Inspect signed & received consignments
                </p>
              </div>

              {/* Action 4: Reset Filter / All Parcels */}
              <div
                onClick={() => { setFilterStatus('ALL'); setSearchQuery(''); }}
                className="bg-[#141822]/90 backdrop-blur-xl p-5 rounded-[22px] border border-slate-700/80 hover:border-slate-500 hover:bg-[#181d2a] transition-all cursor-pointer group shadow-lg"
              >
                <div className="h-10 w-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Filter className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-slate-200 transition-colors">
                  Reset All Filters
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Display complete shipment manifest
                </p>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 3. RECENT ACTIVITIES & LIVE SHIPMENTS SPLIT VIEW               */}
          {/* ============================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Live Shipments Manifest Table (2 Columns) */}
            <div id="shipments-section" className="lg:col-span-2 bg-[#141822]/85 backdrop-blur-xl rounded-[28px] border border-amber-500/20 p-6 shadow-xl space-y-4 scroll-mt-24">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                    <Package className="h-5 w-5 text-amber-400" />
                    Shipment Manifest
                  </h2>
                  <span className="text-xs text-slate-400">
                    Showing {filteredShipments.length} parcels ({filterStatus})
                  </span>
                </div>

                {/* Search in table with Clear X button */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter by ID, recipient, city..."
                    className="w-full pl-9 pr-8 py-1.5 text-xs bg-[#1a1f2c] border border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 text-white placeholder-slate-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                      title="Clear search"
                      aria-label="Clear search query"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-3">Tracking ID</th>
                      <th className="py-3 px-3">Recipient & City</th>
                      <th className="py-3 px-3">Tier</th>
                      <th className="py-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {filteredShipments.map((s) => (
                      <tr key={s.id} className="hover:bg-[#1a1f2c]/60 transition-colors">
                        <td className="py-3.5 px-3">
                          <span className="font-mono font-bold text-amber-400 block">{s.trackingNumber}</span>
                          <span className="text-[10px] text-slate-500">{new Date(s.date).toLocaleDateString()}</span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="text-white font-bold block">{s.recipient}</span>
                          <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                            <MapPin className="h-3 w-3 text-slate-500" /> {s.destination}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-300">
                          {s.type}
                          <span className="text-[10px] text-slate-500 block">{s.weight}</span>
                        </td>
                        <td className="py-3.5 px-3">
                          <StatusBadge status={s.status} size="sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activities Feed (1 Column) */}
            <div id="activities-section" className="bg-[#141822]/85 backdrop-blur-xl rounded-[28px] border border-amber-500/20 p-6 shadow-xl space-y-4 flex flex-col justify-between scroll-mt-24">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                    <Activity className="h-5 w-5 text-amber-400" />
                    Recent Activities
                  </h2>
                  <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    Live Feed
                  </span>
                </div>

                {/* Activity Timeline List */}
                <div className="space-y-4 pt-4">
                  {recentActivities.map((act) => (
                    <div key={act.id} className="flex items-start gap-3 relative group">
                      <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20 mt-0.5">
                        {act.type === 'transit' ? (
                          <Truck className="h-4 w-4 text-blue-400" />
                        ) : act.type === 'success' ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : act.type === 'user' ? (
                          <Users className="h-4 w-4 text-amber-400" />
                        ) : (
                          <Package className="h-4 w-4 text-amber-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                            {act.action}
                          </h4>
                          <span className="text-[10px] text-slate-500 shrink-0 font-medium">{act.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                          {act.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Terminal Security Tag */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 text-slate-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-400" /> SSL Node Encrypted
                </span>
                <span>Updated continuous</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
