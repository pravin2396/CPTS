import React, { useState, useMemo } from 'react';
import { useShipments } from '../context/ShipmentContext';
import { Sidebar } from '../components/Sidebar';
import { StatusBadge, EmptyState } from '../components/ui/FeedbackComponents';
import { UpdateStatusModal } from '../components/delivery/UpdateStatusModal';
import { StatusHistoryModal } from '../components/delivery/StatusHistoryModal';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Search,
  X,
  Menu,
  MapPin,
  History,
  Edit3,
  ExternalLink,
  RotateCcw,
  AlertCircle
} from 'lucide-react';

export const DeliveryStatusPage = () => {
  const { shipments, updateDeliveryStatus, resetShipmentsToDefault, DELIVERY_STATUSES } = useShipments();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [statusModalShipment, setStatusModalShipment] = useState(null);
  const [historyModalShipment, setHistoryModalShipment] = useState(null);

  // Compute status counts for the 7 statuses
  const statusCounts = useMemo(() => {
    const counts = {
      Pending: 0,
      'Picked Up': 0,
      'In Transit': 0,
      'Out for Delivery': 0,
      Delivered: 0,
      Cancelled: 0,
      'Failed Delivery': 0
    };

    shipments.forEach((s) => {
      const normalized = s.deliveryStatus === 'Booked' ? 'Pending' : (s.deliveryStatus || 'Pending');
      if (counts[normalized] !== undefined) {
        counts[normalized] += 1;
      }
    });

    return counts;
  }, [shipments]);

  // Filtered shipments
  const filteredShipments = useMemo(() => {
    return shipments.filter((item) => {
      const normalizedStatus = item.deliveryStatus === 'Booked' ? 'Pending' : (item.deliveryStatus || 'Pending');

      // Filter by status tab
      if (selectedStatusFilter !== 'ALL' && normalizedStatus !== selectedStatusFilter) {
        return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesTracking = item.trackingNumber?.toLowerCase().includes(query);
        const matchesSender = item.senderName?.toLowerCase().includes(query);
        const matchesReceiver = item.receiverName?.toLowerCase().includes(query);
        const matchesOrigin = item.pickupAddress?.toLowerCase().includes(query);
        const matchesDest = item.deliveryAddress?.toLowerCase().includes(query);
        const matchesType = item.parcelType?.toLowerCase().includes(query);

        if (!matchesTracking && !matchesSender && !matchesReceiver && !matchesOrigin && !matchesDest && !matchesType) {
          return false;
        }
      }

      return true;
    });
  }, [shipments, selectedStatusFilter, searchQuery]);

  const handleOpenUpdate = (shipment) => {
    setStatusModalShipment(shipment);
  };

  const handleOpenHistory = (shipment) => {
    setHistoryModalShipment(shipment);
  };

  const handlePerformUpdateStatus = async (shipmentId, newStatus, details) => {
    await updateDeliveryStatus(shipmentId, newStatus, details);
    // Refresh modal active shipment if currently open
    setStatusModalShipment(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0c10] text-slate-100 font-sans antialiased relative selection:bg-amber-500 selection:text-slate-950 flex">
      {/* Background Logistics Backdrop with Dark Overlay (Theme 4) */}
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
                <Activity className="h-5 w-5 text-amber-400" />
                <span>Delivery Status & Lifecycle Audit</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={resetShipmentsToDefault}
              title="Reset seed data with all 7 statuses"
              className="px-3 py-1.5 bg-[#1a1f2c] hover:bg-slate-800 text-slate-300 hover:text-amber-400 rounded-xl text-xs font-semibold border border-slate-700/80 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset Seed</span>
            </button>
          </div>
        </header>

        {/* Content Area - Edge-to-Edge Stretched Layout */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 w-full relative z-10">
          
          {/* Top 7 Status KPI Metrics Overview Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
            
            {/* 1. Pending */}
            <button
              type="button"
              onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'Pending' ? 'ALL' : 'Pending')}
              className={`p-3.5 sm:p-4 rounded-[22px] border transition-all text-left cursor-pointer flex flex-col justify-between ${
                selectedStatusFilter === 'Pending'
                  ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/10'
                  : 'bg-[#141822]/85 border-amber-500/20 hover:border-amber-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Pending</span>
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              </div>
              <div className="mt-2">
                <span className="text-2xl font-black text-white font-mono">{statusCounts.Pending}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Staged at Hub</span>
              </div>
            </button>

            {/* 2. Picked Up */}
            <button
              type="button"
              onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'Picked Up' ? 'ALL' : 'Picked Up')}
              className={`p-3.5 sm:p-4 rounded-[22px] border transition-all text-left cursor-pointer flex flex-col justify-between ${
                selectedStatusFilter === 'Picked Up'
                  ? 'bg-purple-500/20 border-purple-400 shadow-lg shadow-purple-500/10'
                  : 'bg-[#141822]/85 border-purple-500/20 hover:border-purple-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">Picked Up</span>
                <span className="h-2 w-2 rounded-full bg-purple-400" />
              </div>
              <div className="mt-2">
                <span className="text-2xl font-black text-white font-mono">{statusCounts['Picked Up']}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">From Consignor</span>
              </div>
            </button>

            {/* 3. In Transit */}
            <button
              type="button"
              onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'In Transit' ? 'ALL' : 'In Transit')}
              className={`p-3.5 sm:p-4 rounded-[22px] border transition-all text-left cursor-pointer flex flex-col justify-between ${
                selectedStatusFilter === 'In Transit'
                  ? 'bg-blue-500/20 border-blue-400 shadow-lg shadow-blue-500/10'
                  : 'bg-[#141822]/85 border-blue-500/20 hover:border-blue-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">In Transit</span>
                <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              </div>
              <div className="mt-2">
                <span className="text-2xl font-black text-white font-mono">{statusCounts['In Transit']}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Linehaul En Route</span>
              </div>
            </button>

            {/* 4. Out for Delivery */}
            <button
              type="button"
              onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'Out for Delivery' ? 'ALL' : 'Out for Delivery')}
              className={`p-3.5 sm:p-4 rounded-[22px] border transition-all text-left cursor-pointer flex flex-col justify-between ${
                selectedStatusFilter === 'Out for Delivery'
                  ? 'bg-orange-500/20 border-orange-400 shadow-lg shadow-orange-500/10'
                  : 'bg-[#141822]/85 border-orange-500/20 hover:border-orange-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Out for Delivery</span>
                <span className="h-2 w-2 rounded-full bg-orange-400 animate-ping" />
              </div>
              <div className="mt-2">
                <span className="text-2xl font-black text-white font-mono">{statusCounts['Out for Delivery']}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Courier Van</span>
              </div>
            </button>

            {/* 5. Delivered */}
            <button
              type="button"
              onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'Delivered' ? 'ALL' : 'Delivered')}
              className={`p-3.5 sm:p-4 rounded-[22px] border transition-all text-left cursor-pointer flex flex-col justify-between ${
                selectedStatusFilter === 'Delivered'
                  ? 'bg-emerald-500/20 border-emerald-400 shadow-lg shadow-emerald-500/10'
                  : 'bg-[#141822]/85 border-emerald-500/20 hover:border-emerald-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Delivered</span>
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>
              <div className="mt-2">
                <span className="text-2xl font-black text-white font-mono">{statusCounts.Delivered}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Signed by Consignee</span>
              </div>
            </button>

            {/* 6. Cancelled */}
            <button
              type="button"
              onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'Cancelled' ? 'ALL' : 'Cancelled')}
              className={`p-3.5 sm:p-4 rounded-[22px] border transition-all text-left cursor-pointer flex flex-col justify-between ${
                selectedStatusFilter === 'Cancelled'
                  ? 'bg-slate-500/30 border-slate-400 shadow-lg'
                  : 'bg-[#141822]/85 border-slate-700/60 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Cancelled</span>
                <span className="h-2 w-2 rounded-full bg-slate-400" />
              </div>
              <div className="mt-2">
                <span className="text-2xl font-black text-white font-mono">{statusCounts.Cancelled}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Voided Manifest</span>
              </div>
            </button>

            {/* 7. Failed Delivery */}
            <button
              type="button"
              onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'Failed Delivery' ? 'ALL' : 'Failed Delivery')}
              className={`p-3.5 sm:p-4 rounded-[22px] border transition-all text-left cursor-pointer flex flex-col justify-between col-span-2 sm:col-span-1 ${
                selectedStatusFilter === 'Failed Delivery'
                  ? 'bg-rose-500/20 border-rose-400 shadow-lg shadow-rose-500/10'
                  : 'bg-[#141822]/85 border-rose-500/20 hover:border-rose-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Failed Delivery</span>
                <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
              </div>
              <div className="mt-2">
                <span className="text-2xl font-black text-white font-mono">{statusCounts['Failed Delivery']}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Exception / Hold</span>
              </div>
            </button>

          </div>

          {/* Search, Filter Tabs & Toolbar */}
          <div className="bg-[#141822]/90 backdrop-blur-xl p-4 sm:p-5 rounded-[28px] border border-amber-500/20 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by tracking number, consignor, consignee, or city..."
                  className="w-full pl-11 pr-10 py-2.5 text-xs sm:text-sm bg-[#10141d] border border-slate-700/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 text-white placeholder-slate-500 font-sans"
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

              {/* Reset active filters pill */}
              {(selectedStatusFilter !== 'ALL' || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStatusFilter('ALL');
                    setSearchQuery('');
                  }}
                  className="px-3 py-2 text-xs font-bold text-slate-300 hover:text-white bg-[#10141d] hover:bg-slate-800 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
                >
                  <X className="h-3.5 w-3.5 text-rose-400" />
                  <span>Clear Filters</span>
                </button>
              )}
            </div>

            {/* Quick Filter Pills for All 7 Statuses */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/80">
              <span className="text-xs font-semibold text-slate-400 mr-1">Status Filter:</span>

              <button
                type="button"
                onClick={() => setSelectedStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  selectedStatusFilter === 'ALL'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md shadow-amber-500/20'
                    : 'bg-[#10141d] text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                All ({shipments.length})
              </button>

              {DELIVERY_STATUSES.map((status) => {
                const isSelected = selectedStatusFilter === status;
                const count = statusCounts[status] || 0;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setSelectedStatusFilter(isSelected ? 'ALL' : status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                        : 'bg-[#10141d] text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <StatusBadge status={status} size="sm" />
                    <span className="text-[11px] font-mono text-slate-400 font-bold">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Consignments Delivery Status Data Table & List */}
          {filteredShipments.length === 0 ? (
            <EmptyState
              icon={AlertCircle}
              title="No Matching Shipments Found"
              description={`There are no consignments matching "${selectedStatusFilter !== 'ALL' ? selectedStatusFilter : searchQuery}". Try clearing filters or updating a shipment status.`}
              actionText="Reset Filter to All"
              onAction={() => {
                setSelectedStatusFilter('ALL');
                setSearchQuery('');
              }}
            />
          ) : (
            <div className="bg-[#141822]/90 backdrop-blur-xl rounded-[28px] border border-amber-500/20 shadow-xl overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    Active Consignment Manifests
                  </h2>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                    {filteredShipments.length} Record{filteredShipments.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span>Displaying live color-coded status badges and transition logs</span>
                </div>
              </div>

              {/* Responsive Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-800/80 bg-[#10141d]/80 text-[11px] font-black uppercase tracking-wider text-slate-400">
                      <th className="py-3.5 px-4 sm:px-6">Consignment / Tracking #</th>
                      <th className="py-3.5 px-4">Route & Parties</th>
                      <th className="py-3.5 px-4">Delivery Status</th>
                      <th className="py-3.5 px-4 hidden md:table-cell">Latest Checkpoint</th>
                      <th className="py-3.5 px-4 hidden lg:table-cell">Audit History</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">Operational Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredShipments.map((shipment) => {
                      const latestCheckpoint = shipment.statusHistory?.[0] || {
                        location: shipment.pickupAddress?.split(',')[1]?.trim() || 'Origin Depot',
                        timestamp: shipment.shippingDate || 'Recent',
                        remarks: 'Initial booking registered'
                      };
                      const historyCount = shipment.statusHistory?.length || 1;

                      return (
                        <tr
                          key={shipment.id}
                          className="hover:bg-slate-800/30 transition-colors group"
                        >
                          {/* Tracking Number */}
                          <td className="py-4 px-4 sm:px-6">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-amber-400 text-xs sm:text-sm">
                                {shipment.trackingNumber}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 block mt-0.5 font-medium">
                              {shipment.parcelType} • {shipment.parcelWeight} kg
                            </span>
                          </td>

                          {/* Route & Parties */}
                          <td className="py-4 px-4">
                            <div className="space-y-0.5 text-xs">
                              <p className="text-slate-200 font-semibold truncate max-w-[200px]">
                                <span className="text-amber-400/90 font-bold">From:</span> {shipment.senderName}
                              </p>
                              <p className="text-slate-300 truncate max-w-[200px]">
                                <span className="text-blue-400/90 font-bold">To:</span> {shipment.receiverName}
                              </p>
                              <p className="text-[10px] text-slate-500 truncate max-w-[200px]">
                                {shipment.pickupAddress?.split(',')[1]?.trim()} → {shipment.deliveryAddress?.split(',')[1]?.trim()}
                              </p>
                            </div>
                          </td>

                          {/* Delivery Status Badge */}
                          <td className="py-4 px-4">
                            <div className="flex flex-col items-start gap-1">
                              <StatusBadge status={shipment.deliveryStatus} />
                              <span className="text-[10px] text-slate-500 font-mono">
                                ETA: {shipment.expectedDeliveryDate}
                              </span>
                            </div>
                          </td>

                          {/* Latest Checkpoint */}
                          <td className="py-4 px-4 hidden md:table-cell">
                            <div className="space-y-0.5 text-xs max-w-[220px]">
                              <p className="text-white font-medium flex items-center gap-1.5 truncate">
                                <MapPin className="h-3 w-3 text-amber-400 shrink-0" />
                                <span className="truncate">{latestCheckpoint.location}</span>
                              </p>
                              <p className="text-[10px] text-slate-400 truncate">
                                {latestCheckpoint.timestamp}
                              </p>
                              <p className="text-[10px] text-slate-500 truncate italic">
                                "{latestCheckpoint.remarks}"
                              </p>
                            </div>
                          </td>

                          {/* Audit History Counter */}
                          <td className="py-4 px-4 hidden lg:table-cell">
                            <button
                              type="button"
                              onClick={() => handleOpenHistory(shipment)}
                              className="px-2.5 py-1 rounded-xl bg-[#10141d] hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-800 transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
                              title="Click to view history timeline"
                            >
                              <History className="h-3.5 w-3.5 text-amber-400" />
                              <span>{historyCount} Checkpoint{historyCount !== 1 ? 's' : ''}</span>
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-4 sm:px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Update Status Button */}
                              <button
                                type="button"
                                onClick={() => handleOpenUpdate(shipment)}
                                className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
                                title="Update delivery status"
                              >
                                <Edit3 className="h-3.5 w-3.5 stroke-[2.5]" />
                                <span>Update Status</span>
                              </button>

                              {/* View History Button */}
                              <button
                                type="button"
                                onClick={() => handleOpenHistory(shipment)}
                                className="p-1.5 bg-[#181d2a] hover:bg-slate-800 text-slate-300 hover:text-amber-400 rounded-xl border border-slate-700/80 transition-colors cursor-pointer"
                                title="View status history timeline"
                              >
                                <History className="h-4 w-4" />
                              </button>

                              {/* Direct Tracking Link */}
                              <button
                                type="button"
                                onClick={() => navigate(`/tracking/${shipment.trackingNumber}`)}
                                className="p-1.5 bg-[#181d2a] hover:bg-slate-800 text-slate-300 hover:text-amber-400 rounded-xl border border-slate-700/80 transition-colors cursor-pointer"
                                title="Track live parcel telemetry"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Update Delivery Status Modal */}
      {statusModalShipment && (
        <UpdateStatusModal
          isOpen={!!statusModalShipment}
          onClose={() => setStatusModalShipment(null)}
          shipment={statusModalShipment}
          onUpdateStatus={handlePerformUpdateStatus}
        />
      )}

      {/* Status History Modal */}
      {historyModalShipment && (
        <StatusHistoryModal
          isOpen={!!historyModalShipment}
          onClose={() => setHistoryModalShipment(null)}
          shipment={historyModalShipment}
          onOpenUpdateModal={(s) => {
            setHistoryModalShipment(null);
            setStatusModalShipment(s);
          }}
        />
      )}
    </div>
  );
};
