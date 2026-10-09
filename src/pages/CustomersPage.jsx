import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomers } from '../context/CustomerContext';
import { Sidebar } from '../components/Sidebar';
import { CustomerModal } from '../components/CustomerModal';
import { CustomerProfileModal } from '../components/CustomerProfileModal';
import { ConfirmModal, EmptyState, SkeletonRow } from '../components/ui/FeedbackComponents';
import {
  Users,
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
  Mail,
  Phone,
  MapPin,
  Building,
  Sparkles,
  Menu,
  RotateCcw,
  CheckCircle2,
  UserCheck,
  ExternalLink,
  Package
} from 'lucide-react';
import { toast } from 'react-toastify';

export const CustomersPage = () => {
  const navigate = useNavigate();
  const {
    customers,
    isLoading,
    deleteCustomer,
    resetCustomersToDefault
  } = useCustomers();

  // Navigation & Drawer
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('name-asc'); // 'name-asc', 'name-desc', 'shipments-desc', 'newest'

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);
  const [customerToView, setCustomerToView] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  // Computed KPI Metrics
  const totalCount = customers.length;
  const activeCount = customers.filter((c) => c.status === 'Active').length;
  const citiesCount = new Set(customers.map((c) => c.city).filter(Boolean)).size;
  const totalShipmentsHandled = customers.reduce((sum, c) => sum + (c.totalShipments || 0), 0);

  // Filter & Sort Logic
  const filteredAndSortedCustomers = useMemo(() => {
    return customers
      .filter((item) => {
        // Status filter
        if (selectedStatus !== 'ALL' && item.status !== selectedStatus) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.name?.toLowerCase().includes(q);
          const matchEmail = item.email?.toLowerCase().includes(q);
          const matchMobile = item.mobile?.toLowerCase().includes(q);
          const matchAddress = item.address?.toLowerCase().includes(q);
          const matchCity = item.city?.toLowerCase().includes(q);
          const matchPostal = item.postalCode?.toLowerCase().includes(q);
          return matchName || matchEmail || matchMobile || matchAddress || matchCity || matchPostal;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'name-desc') {
          return b.name.localeCompare(a.name);
        }
        if (sortBy === 'shipments-desc') {
          return (b.totalShipments || 0) - (a.totalShipments || 0);
        }
        if (sortBy === 'newest') {
          return new Date(b.joinedDate || '2026-01-01') - new Date(a.joinedDate || '2026-01-01');
        }
        return 0;
      });
  }, [customers, selectedStatus, searchQuery, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedCustomers.length / itemsPerPage) || 1;
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedCustomers, currentPage, itemsPerPage]);

  const handleFilterChange = (setter, value) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('ALL');
    setSortBy('name-asc');
    setCurrentPage(1);
    toast.info('Customer filters cleared.');
  };

  const handleConfirmDelete = async () => {
    if (customerToDelete) {
      await deleteCustomer(customerToDelete.id);
      setCustomerToDelete(null);
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
                <Users className="h-5 w-5 text-amber-400" />
                <span>Customer Management</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={resetCustomersToDefault}
              title="Reset to default seed data"
              className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer text-xs flex items-center gap-1.5"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Reset Seed</span>
            </button>

            <button
              onClick={() => {
                setCustomerToEdit(null);
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs sm:text-sm font-black transition-all shadow-lg shadow-amber-500/25 cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Add Customer</span>
            </button>
          </div>
        </header>

        {/* Content Area (Edge-to-Edge Stretched) */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 w-full relative z-10">
          
          {/* Top KPI Cards with Integrated Icons (Theme 4) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* 1. Total Customers */}
            <div className="bg-[#141822]/90 backdrop-blur-xl p-5 rounded-[24px] border border-amber-500/20 shadow-lg flex items-center justify-between hover:border-amber-500/40 transition-all">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Customers
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white mt-1 block font-mono">
                  {totalCount}
                </span>
                <span className="text-[11px] text-amber-400/90 font-medium flex items-center gap-1 mt-1">
                  Directory Accounts
                </span>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 shadow-inner shrink-0">
                <Users className="h-6 w-6" />
              </div>
            </div>

            {/* 2. Active Accounts */}
            <div className="bg-[#141822]/90 backdrop-blur-xl p-5 rounded-[24px] border border-emerald-500/20 shadow-lg flex items-center justify-between hover:border-emerald-500/40 transition-all">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Active Accounts
                </span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 block font-mono">
                  {activeCount}
                </span>
                <span className="text-[11px] text-emerald-300/80 font-medium flex items-center gap-1 mt-1">
                  Verified Clients
                </span>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-inner shrink-0">
                <UserCheck className="h-6 w-6" />
              </div>
            </div>

            {/* 3. Cities Served */}
            <div className="bg-[#141822]/90 backdrop-blur-xl p-5 rounded-[24px] border border-blue-500/20 shadow-lg flex items-center justify-between hover:border-blue-500/40 transition-all">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Hub Cities
                </span>
                <span className="text-2xl sm:text-3xl font-black text-blue-400 mt-1 block font-mono">
                  {citiesCount}
                </span>
                <span className="text-[11px] text-blue-300/80 font-medium flex items-center gap-1 mt-1">
                  Nationwide Coverage
                </span>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 shadow-inner shrink-0">
                <MapPin className="h-6 w-6" />
              </div>
            </div>

            {/* 4. Total Dispatches */}
            <div className="bg-[#141822]/90 backdrop-blur-xl p-5 rounded-[24px] border border-amber-500/20 shadow-lg flex items-center justify-between hover:border-amber-500/40 transition-all">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Dispatches
                </span>
                <span className="text-2xl sm:text-3xl font-black text-amber-400 mt-1 block font-mono">
                  {totalShipmentsHandled}
                </span>
                <span className="text-[11px] text-amber-300/80 font-medium flex items-center gap-1 mt-1">
                  Parcels Generated
                </span>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 shadow-inner shrink-0">
                <Package className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Search, Status & Sorting Toolbar */}
          <div className="bg-[#141822]/90 backdrop-blur-xl p-4 sm:p-5 rounded-[24px] border border-amber-500/20 shadow-xl space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Search Bar with Clear X Button */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
                  placeholder="Search by name, email, phone, city..."
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

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => handleFilterChange(setSelectedStatus, e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#141822] text-slate-200 border border-slate-700/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
                >
                  <option value="ALL">All Account Statuses</option>
                  <option value="Active">Active Accounts</option>
                  <option value="Inactive">Inactive Accounts</option>
                </select>
              </div>

              {/* Sort Order */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => handleFilterChange(setSortBy, e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#141822] text-slate-200 border border-slate-700/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
                >
                  <option value="name-asc">Customer Name (A to Z)</option>
                  <option value="name-desc">Customer Name (Z to A)</option>
                  <option value="shipments-desc">Highest Shipments Sent</option>
                  <option value="newest">Recently Registered</option>
                </select>
              </div>
            </div>

            {/* Filter Summary & Clear Action */}
            <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
              <span>
                Showing <strong className="text-white">{filteredAndSortedCustomers.length}</strong> matching customers
              </span>
              {(searchQuery || selectedStatus !== 'ALL') && (
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

          {/* Customer Directory Table */}
          <div className="bg-[#141822]/90 backdrop-blur-xl rounded-[28px] border border-amber-500/20 shadow-xl overflow-hidden">
            {isLoading ? (
              <div className="p-6">
                <table className="w-full text-left text-xs">
                  <tbody>
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                  </tbody>
                </table>
              </div>
            ) : paginatedCustomers.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  icon={Users}
                  title="No Customers Found"
                  description="We could not find any customers matching your search query or status filter."
                  actionText="Reset Filters"
                  onAction={handleClearFilters}
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-[#10141d]/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-4 px-4 sm:px-6">Customer Name</th>
                      <th className="py-4 px-4">Contact Info</th>
                      <th className="py-4 px-4">Address & City</th>
                      <th className="py-4 px-4">Postal Code</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {paginatedCustomers.map((c) => (
                      <tr key={c.id} className="hover:bg-[#181d2a]/70 transition-colors group">
                        
                        {/* Customer Name + Avatar Initials */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold flex items-center justify-center shrink-0">
                              {c.name
                                .split(' ')
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join('')
                                .toUpperCase()}
                            </div>
                            <div>
                              <button
                                type="button"
                                onClick={() => setCustomerToView(c)}
                                className="font-bold text-white hover:text-amber-400 hover:underline cursor-pointer block text-left"
                                title="Click to view profile"
                              >
                                {c.name}
                              </button>
                              <span className="text-[10px] text-slate-500 font-mono">ID #{c.id}</span>
                            </div>
                          </div>
                        </td>

                        {/* Email & Mobile */}
                        <td className="py-4 px-4 max-w-[200px]">
                          <span className="text-slate-200 block truncate flex items-center gap-1.5" title={c.email}>
                            <Mail className="h-3 w-3 text-amber-400/80 shrink-0" />
                            <span className="truncate">{c.email}</span>
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <Phone className="h-3 w-3 text-slate-500 shrink-0" />
                            <span>{c.mobile}</span>
                          </span>
                        </td>

                        {/* Address & City */}
                        <td className="py-4 px-4 max-w-[220px]">
                          <span className="text-slate-200 block truncate flex items-center gap-1.5" title={c.address}>
                            <MapPin className="h-3 w-3 text-blue-400/80 shrink-0" />
                            <span className="truncate">{c.address}</span>
                          </span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            {c.city}
                          </span>
                        </td>

                        {/* Postal Code */}
                        <td className="py-4 px-4">
                          <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 text-[11px]">
                            {c.postalCode}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                              c.status === 'Active'
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                : 'bg-slate-500/15 text-slate-400 border-slate-500/30'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                c.status === 'Active' ? 'bg-emerald-400' : 'bg-slate-500'
                              }`}
                            />
                            {c.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Quick Profile Modal */}
                            <button
                              type="button"
                              onClick={() => setCustomerToView(c)}
                              title="Quick View Profile"
                              className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            {/* Navigate to Dedicated Profile Page */}
                            <button
                              type="button"
                              onClick={() => navigate(`/customers/${c.id}`)}
                              title="Open Full Profile Page"
                              className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </button>

                            {/* Edit Customer */}
                            <button
                              type="button"
                              onClick={() => {
                                setCustomerToEdit(c);
                                setIsAddModalOpen(true);
                              }}
                              title="Edit Customer"
                              className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>

                            {/* Delete Customer */}
                            <button
                              type="button"
                              onClick={() => setCustomerToDelete(c)}
                              title="Delete Customer"
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
            {filteredAndSortedCustomers.length > 0 && (
              <div className="px-6 py-4 bg-[#10141d]/90 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <span className="text-slate-400">
                  Showing{' '}
                  <strong className="text-white">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </strong>{' '}
                  to{' '}
                  <strong className="text-white">
                    {Math.min(currentPage * itemsPerPage, filteredAndSortedCustomers.length)}
                  </strong>{' '}
                  of <strong className="text-white">{filteredAndSortedCustomers.length}</strong> customers
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

      {/* Add / Edit Customer Modal */}
      <CustomerModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setCustomerToEdit(null);
        }}
        customerToEdit={customerToEdit}
      />

      {/* Customer Quick Profile Modal */}
      <CustomerProfileModal
        isOpen={Boolean(customerToView)}
        onClose={() => setCustomerToView(null)}
        customer={customerToView}
        onEdit={(customer) => {
          setCustomerToEdit(customer);
          setIsAddModalOpen(true);
        }}
        onDelete={(customer) => {
          setCustomerToDelete(customer);
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(customerToDelete)}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Confirm Customer Deletion"
        message={`Are you sure you want to permanently delete customer "${customerToDelete?.name}"? All associated account directory records will be removed.`}
        confirmText="Yes, Delete Customer"
      />
    </div>
  );
};
