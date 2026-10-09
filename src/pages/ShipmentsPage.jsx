import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShipments } from '../context/ShipmentContext';
import { Sidebar } from '../components/Sidebar';
import { ShipmentModal } from '../components/ShipmentModal';
import { ShipmentDetailsModal } from '../components/ShipmentDetailsModal';
import {
  StatusBadge,
  ConfirmModal,
  EmptyState,
  SkeletonRow
} from '../components/ui/FeedbackComponents';
import {
  Boxes,
  Plus,
  Search,
  X,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit2,
  Trash2,
  MapPin,
  Sparkles,
  Menu,
  RotateCcw,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { toast } from 'react-toastify';

export const ShipmentsPage = () => {
  const navigate = useNavigate();
  const {
    shipments,
    isLoading,
    deleteShipment,
    resetShipmentsToDefault,
    PARCEL_TYPES,
    DELIVERY_STATUSES
  } = useShipments();

  // Navigation & Drawer
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc', 'date-asc', 'delivery-asc'

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [shipmentToEdit, setShipmentToEdit] = useState(null);
  const [shipmentToView, setShipmentToView] = useState(null);
  const [shipmentToDelete, setShipmentToDelete] = useState(null);

  // Compute stats for header pills
  const totalCount = shipments.length;
  const inTransitCount = shipments.filter((s) => s.deliveryStatus === 'In Transit').length;
  const deliveredCount = shipments.filter((s) => s.deliveryStatus === 'Delivered').length;
  const bookedCount = shipments.filter((s) => s.deliveryStatus === 'Pending' || s.deliveryStatus === 'Booked').length;

  // Filter & Sort Logic
  const filteredAndSortedShipments = useMemo(() => {
    return shipments
      .filter((item) => {
        // Status filter
        if (selectedStatus !== 'ALL' && item.deliveryStatus !== selectedStatus) {
          return false;
        }
        // Type filter
        if (selectedType !== 'ALL' && item.parcelType !== selectedType) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTracking = item.trackingNumber?.toLowerCase().includes(q);
          const matchSender = item.senderName?.toLowerCase().includes(q);
          const matchReceiver = item.receiverName?.toLowerCase().includes(q);
          const matchPickup = item.pickupAddress?.toLowerCase().includes(q);
          const matchDelivery = item.deliveryAddress?.toLowerCase().includes(q);
          return matchTracking || matchSender || matchReceiver || matchPickup || matchDelivery;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.shippingDate) - new Date(a.shippingDate);
        }
        if (sortBy === 'date-asc') {
          return new Date(a.shippingDate) - new Date(b.shippingDate);
        }
        if (sortBy === 'delivery-asc') {
          return new Date(a.expectedDeliveryDate) - new Date(b.expectedDeliveryDate);
        }
        return 0;
      });
  }, [shipments, selectedStatus, selectedType, searchQuery, sortBy]);

  // Pagination Calculations
  const totalPages = Math.ceil(filteredAndSortedShipments.length / itemsPerPage) || 1;
  const paginatedShipments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedShipments.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedShipments, currentPage, itemsPerPage]);

  // Reset to page 1 whenever filters change
  const handleFilterChange = (setter, value) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedType('ALL');
    setSelectedStatus('ALL');
    setSortBy('date-desc');
    setCurrentPage(1);
    toast.info('Shipment filters cleared.');
  };

  const handleConfirmDelete = async () => {
    if (shipmentToDelete) {
      await deleteShipment(shipmentToDelete.id);
      setShipmentToDelete(null);
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
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors focus:outline-none"
              aria-label="Open Sidebar Navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                <Boxes className="h-5 w-5 text-amber-400" />
                <span>Shipment Management</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={resetShipmentsToDefault}
              title="Reset to default seed data"
              className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer text-xs flex items-center gap-1.5"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Reset Seed</span>
            </button>

            <button
              onClick={() => {
                setShipmentToEdit(null);
                setIsCreateModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs sm:text-sm font-black transition-all shadow-lg shadow-amber-500/25 cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Create Shipment</span>
            </button>
          </div>
        </header>

        {/* Content Area (Edge-to-Edge Stretched) */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 w-full relative z-10">
          
          {/* Top Quick Status Overview KPI Cards with Integrated Icons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* 1. Total Shipments */}
            <div className="bg-[#141822]/90 backdrop-blur-xl p-5 rounded-[24px] border border-amber-500/20 shadow-lg flex items-center justify-between hover:border-amber-500/40 transition-all">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Shipments
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white mt-1 block font-mono">
                  {totalCount}
                </span>
                <span className="text-[11px] text-amber-400/90 font-medium flex items-center gap-1 mt-1">
                  All Consignments
                </span>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 shadow-inner shrink-0">
                <Package className="h-6 w-6" />
              </div>
            </div>

            {/* 2. In Transit */}
            <div className="bg-[#141822]/90 backdrop-blur-xl p-5 rounded-[24px] border border-blue-500/20 shadow-lg flex items-center justify-between hover:border-blue-500/40 transition-all">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  In Transit
                </span>
                <span className="text-2xl sm:text-3xl font-black text-blue-400 mt-1 block font-mono">
                  {inTransitCount}
                </span>
                <span className="text-[11px] text-blue-300/80 font-medium flex items-center gap-1 mt-1">
                  Carrier En Route
                </span>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 shadow-inner shrink-0">
                <Truck className="h-6 w-6" />
              </div>
            </div>

            {/* 3. Delivered */}
            <div className="bg-[#141822]/90 backdrop-blur-xl p-5 rounded-[24px] border border-emerald-500/20 shadow-lg flex items-center justify-between hover:border-emerald-500/40 transition-all">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Delivered
                </span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 block font-mono">
                  {deliveredCount}
                </span>
                <span className="text-[11px] text-emerald-300/80 font-medium flex items-center gap-1 mt-1">
                  Handed Over
                </span>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-inner shrink-0">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>

            {/* 4. Booked / Pending */}
            <div className="bg-[#141822]/90 backdrop-blur-xl p-5 rounded-[24px] border border-amber-500/20 shadow-lg flex items-center justify-between hover:border-amber-500/40 transition-all">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Booked / Pending
                </span>
                <span className="text-2xl sm:text-3xl font-black text-amber-400 mt-1 block font-mono">
                  {bookedCount}
                </span>
                <span className="text-[11px] text-amber-300/80 font-medium flex items-center gap-1 mt-1">
                  Awaiting Dispatch
                </span>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 shadow-inner shrink-0">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Search, Filters & Sorting Toolbar */}
          <div className="bg-[#141822]/90 backdrop-blur-xl p-4 sm:p-5 rounded-[24px] border border-amber-500/20 shadow-xl space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Search Bar with Clear X Button */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
                  placeholder="Search tracking, sender, address..."
                  className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-[#141822] border border-slate-700/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 text-white placeholder-slate-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => handleFilterChange(setSearchQuery, '')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                    title="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Filter by Shipment Type */}
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => handleFilterChange(setSelectedType, e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#141822] text-slate-200 border border-slate-700/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
                >
                  <option value="ALL">All Parcel Types</option>
                  {PARCEL_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter by Delivery Status */}
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => handleFilterChange(setSelectedStatus, e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#141822] text-slate-200 border border-slate-700/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
                >
                  <option value="ALL">All Delivery Statuses</option>
                  {DELIVERY_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort by Shipment Date */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => handleFilterChange(setSortBy, e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#141822] text-slate-200 border border-slate-700/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
                >
                  <option value="date-desc">Shipping Date: Newest First</option>
                  <option value="date-asc">Shipping Date: Oldest First</option>
                  <option value="delivery-asc">Expected Delivery: Soonest</option>
                </select>
              </div>
            </div>

            {/* Active filter counter & Reset button */}
            <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
              <span>
                Showing <strong className="text-white">{filteredAndSortedShipments.length}</strong> matching shipments
              </span>
              {(searchQuery || selectedType !== 'ALL' || selectedStatus !== 'ALL') && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  <span>Reset All Filters</span>
                </button>
              )}
            </div>
          </div>

          {/* Shipments Table Container */}
          <div className="bg-[#141822]/90 backdrop-blur-xl rounded-[28px] border border-amber-500/20 shadow-xl overflow-hidden">
            {isLoading ? (
              <div className="p-6">
                <table className="w-full text-left text-xs">
                  <tbody>
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                  </tbody>
                </table>
              </div>
            ) : paginatedShipments.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  icon={Package}
                  title="No Shipments Matching Filters"
                  description="We could not find any consignments matching your search keywords or filter options."
                  actionText="Reset Filters"
                  onAction={handleClearFilters}
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-[#10141d]/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-4 px-4 sm:px-6">Tracking Number</th>
                      <th className="py-4 px-4">Origin / Sender</th>
                      <th className="py-4 px-4">Destination / Receiver</th>
                      <th className="py-4 px-4">Type & Weight</th>
                      <th className="py-4 px-4">Shipping / Expected</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {paginatedShipments.map((s) => (
                      <tr key={s.id} className="hover:bg-[#181d2a]/70 transition-colors group">
                        
                        {/* Tracking Number */}
                        <td className="py-4 px-4 sm:px-6">
                          <button
                            type="button"
                            onClick={() => setShipmentToView(s)}
                            className="font-mono font-bold text-amber-400 hover:text-amber-300 hover:underline cursor-pointer block text-left"
                            title="Click to view details"
                          >
                            {s.trackingNumber}
                          </button>
                          <span className="text-[10px] text-slate-500">ID #{s.id}</span>
                        </td>

                        {/* Sender & Pickup */}
                        <td className="py-4 px-4 max-w-[180px]">
                          <span className="text-white font-bold block truncate">{s.senderName}</span>
                          <span className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5" title={s.pickupAddress}>
                            <MapPin className="h-3 w-3 text-amber-400/80 shrink-0" />
                            <span className="truncate">{s.pickupAddress}</span>
                          </span>
                        </td>

                        {/* Receiver & Delivery */}
                        <td className="py-4 px-4 max-w-[180px]">
                          <span className="text-white font-bold block truncate">{s.receiverName}</span>
                          <span className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5" title={s.deliveryAddress}>
                            <MapPin className="h-3 w-3 text-blue-400/80 shrink-0" />
                            <span className="truncate">{s.deliveryAddress}</span>
                          </span>
                        </td>

                        {/* Parcel Type & Weight */}
                        <td className="py-4 px-4">
                          <span className="text-slate-200 block truncate">{s.parcelType}</span>
                          <span className="text-[11px] text-amber-400/90 font-bold block">{s.parcelWeight} kg</span>
                        </td>

                        {/* Shipping & Expected Dates */}
                        <td className="py-4 px-4">
                          <span className="text-slate-300 block">{s.shippingDate}</span>
                          <span className="text-[10px] text-emerald-400 block">Exp: {s.expectedDeliveryDate}</span>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <StatusBadge status={s.deliveryStatus} />
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Modal */}
                            <button
                              type="button"
                              onClick={() => setShipmentToView(s)}
                              title="Quick View Details"
                              className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            {/* Navigate to Dedicated Details Page */}
                            <button
                              type="button"
                              onClick={() => navigate(`/shipments/${s.id}`)}
                              title="Open Full Details Page"
                              className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </button>

                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => {
                                setShipmentToEdit(s);
                                setIsCreateModalOpen(true);
                              }}
                              title="Edit Shipment"
                              className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => setShipmentToDelete(s)}
                              title="Delete Shipment"
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {filteredAndSortedShipments.length > 0 && (
              <div className="px-6 py-4 bg-[#10141d]/90 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <span className="text-slate-400">
                  Showing{' '}
                  <strong className="text-white">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </strong>{' '}
                  to{' '}
                  <strong className="text-white">
                    {Math.min(currentPage * itemsPerPage, filteredAndSortedShipments.length)}
                  </strong>{' '}
                  of <strong className="text-white">{filteredAndSortedShipments.length}</strong> consignments
                </span>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 bg-[#141822] hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pg) => (
                    <button
                      key={pg}
                      type="button"
                      onClick={() => setCurrentPage(pg)}
                      className={`h-8 w-8 rounded-xl font-bold transition-all cursor-pointer ${
                        currentPage === pg
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                          : 'bg-[#141822] text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                      }`}
                    >
                      {pg}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-[#141822] hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

        </main>
      </div>

      {/* Create / Edit Shipment Modal */}
      <ShipmentModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setShipmentToEdit(null);
        }}
        shipmentToEdit={shipmentToEdit}
      />

      {/* Shipment Details View Modal */}
      <ShipmentDetailsModal
        isOpen={Boolean(shipmentToView)}
        onClose={() => setShipmentToView(null)}
        shipment={shipmentToView}
        onEdit={(shipment) => {
          setShipmentToEdit(shipment);
          setIsCreateModalOpen(true);
        }}
        onDelete={(shipment) => {
          setShipmentToDelete(shipment);
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(shipmentToDelete)}
        onClose={() => setShipmentToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Confirm Shipment Deletion"
        message={`Are you sure you want to permanently delete consignment "${shipmentToDelete?.trackingNumber}"? This cannot be undone.`}
        confirmText="Yes, Delete Consignment"
      />
    </div>
  );
};
