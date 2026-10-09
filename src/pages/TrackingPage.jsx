import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShipments } from '../context/ShipmentContext';
import { generateTrackingDetails } from '../utils/trackingGenerator';
import { Sidebar } from '../components/Sidebar';
import { StatusBadge, EmptyState } from '../components/ui/FeedbackComponents';
import { NotificationBell } from '../components/notifications/NotificationBell';
import {
  Search,
  X,
  Truck,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  Boxes,
  Copy,
  Check,
  Radio,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Layers,
  ChevronRight,
  Menu,
  Activity,
  AlertCircle,
  Navigation,
  Plus
} from 'lucide-react';
import { toast } from 'react-toastify';

export const TrackingPage = () => {
  const { trackingNumber: paramTrackingNumber } = useParams();
  const navigate = useNavigate();
  const { shipments, updateShipment, DELIVERY_STATUSES } = useShipments();

  // Navigation drawer
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Mode: 'single' | 'multiple'
  const [activeTab, setActiveTab] = useState('single');

  // Search input for single tracking
  const [searchInput, setSearchInput] = useState(
    paramTrackingNumber || shipments[0]?.trackingNumber || 'TRK-982410'
  );
  const [activeTrackingNumber, setActiveTrackingNumber] = useState(
    paramTrackingNumber || shipments[0]?.trackingNumber || 'TRK-982410'
  );

  // Multi-tracking selection state (defaults to first 3 shipments)
  const [selectedMultiTracking, setSelectedMultiTracking] = useState(() => {
    return shipments.slice(0, 3).map((s) => s.trackingNumber);
  });
  const [multiSearchInput, setMultiSearchInput] = useState('');

  const [copied, setCopied] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Synchronize when URL param changes
  useEffect(() => {
    if (paramTrackingNumber) {
      setSearchInput(paramTrackingNumber);
      setActiveTrackingNumber(paramTrackingNumber);
      setActiveTab('single');
    }
  }, [paramTrackingNumber]);

  // Find currently selected single shipment
  const selectedShipment = useMemo(() => {
    return (
      shipments.find(
        (s) =>
          s.trackingNumber.toLowerCase() === activeTrackingNumber.toLowerCase() ||
          s.id.toLowerCase() === activeTrackingNumber.toLowerCase()
      ) || null
    );
  }, [shipments, activeTrackingNumber]);

  // Generate real-time telemetry and history
  const trackingDetails = useMemo(() => {
    if (!selectedShipment) return null;
    return generateTrackingDetails(selectedShipment);
  }, [selectedShipment]);

  // Multi-tracking shipments data
  const multiShipmentsDetails = useMemo(() => {
    return selectedMultiTracking
      .map((trk) => {
        const found = shipments.find(
          (s) =>
            s.trackingNumber.toLowerCase() === trk.toLowerCase() ||
            s.id.toLowerCase() === trk.toLowerCase()
        );
        return found ? generateTrackingDetails(found) : null;
      })
      .filter(Boolean);
  }, [shipments, selectedMultiTracking]);

  // Handle single search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setActiveTrackingNumber(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput('');
  };

  const handleCopyTracking = (number) => {
    navigator.clipboard.writeText(number);
    setCopied(true);
    toast.success(`Copied ${number} to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  // Parcel Status Update directly from tracking module
  const handleStatusChange = async (newStatus) => {
    if (!selectedShipment || newStatus === selectedShipment.deliveryStatus) return;
    setIsUpdatingStatus(true);
    try {
      await updateShipment(selectedShipment.id, { deliveryStatus: newStatus });
      toast.success(`Shipment status updated to "${newStatus}"!`);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Toggle multi-shipment checkbox selection
  const handleToggleMultiSelect = (trk) => {
    setSelectedMultiTracking((prev) => {
      if (prev.includes(trk)) {
        if (prev.length <= 1) {
          toast.warning('At least one shipment must be selected for tracking.');
          return prev;
        }
        return prev.filter((t) => t !== trk);
      } else {
        return [...prev, trk];
      }
    });
  };

  // List of shipments not currently in the multi-tracking monitor
  const unmonitoredShipments = useMemo(() => {
    return shipments.filter((s) => !selectedMultiTracking.includes(s.trackingNumber));
  }, [shipments, selectedMultiTracking]);

  // Add custom tracking number to multi-tracking list (fully interactive)
  const handleAddMultiSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    // If input is empty, pick the next available unmonitored shipment
    if (!multiSearchInput.trim()) {
      if (unmonitoredShipments.length > 0) {
        const nextParcel = unmonitoredShipments[0];
        setSelectedMultiTracking((prev) => [...prev, nextParcel.trackingNumber]);
        toast.success(`Added ${nextParcel.trackingNumber} to multi-tracking monitor.`);
      } else {
        toast.info(`All ${shipments.length} consignments are already active in the monitor.`);
      }
      return;
    }

    const query = multiSearchInput.trim().toUpperCase();
    const match = shipments.find(
      (s) =>
        s.trackingNumber.toUpperCase() === query ||
        s.trackingNumber.toUpperCase().includes(query) ||
        s.id.toUpperCase().includes(query)
    );

    if (!match) {
      toast.error(`Shipment matching "${multiSearchInput}" was not found.`);
      return;
    }

    if (selectedMultiTracking.includes(match.trackingNumber)) {
      toast.info(`Shipment ${match.trackingNumber} is already in the monitor list.`);
    } else {
      setSelectedMultiTracking((prev) => [...prev, match.trackingNumber]);
      toast.success(`Added ${match.trackingNumber} (${match.deliveryStatus}) to monitor!`);
      setMultiSearchInput('');
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
                <Truck className="h-5 w-5 text-amber-400" />
                <span>Parcel Tracking & Telemetry</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Notification Bell */}
            <NotificationBell />

            {/* Header Action: Track Multiple Shipments Toggle */}
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'single' ? 'multiple' : 'single')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 border ${
                activeTab === 'multiple'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-400 font-black shadow-lg shadow-amber-500/20'
                  : 'bg-[#10141d] text-slate-300 hover:text-amber-300 hover:border-amber-500/40 border-slate-800'
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>{activeTab === 'multiple' ? '← Back to Single Tracking' : `Track Multiple (${selectedMultiTracking.length})`}</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 w-full relative z-10">
          
          {/* ============================================================== */}
          {/* TAB 1: SINGLE SHIPMENT TRACKING VIEW                           */}
          {/* ============================================================== */}
          {activeTab === 'single' && (
            <>
              {/* Search Control & Quick Chips */}
              <div className="bg-[#141822]/90 backdrop-blur-xl p-5 sm:p-6 rounded-[28px] border border-amber-500/20 shadow-xl space-y-4">
                <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Enter 9-digit tracking number (e.g. TRK-982410)..."
                      className="w-full pl-11 pr-10 py-3 text-sm bg-[#141822] border border-slate-700/80 rounded-2xl focus:outline-none focus:ring-1 focus:ring-amber-400 text-white placeholder-slate-500 font-mono"
                    />
                    {searchInput && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title="Clear tracking number"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-sm font-black rounded-2xl shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
                  >
                    <Search className="h-4 w-4 stroke-[3]" />
                    <span>Track Parcel</span>
                  </button>
                </form>

                {/* Quick Sample Tracking Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="text-slate-400 font-semibold">Quick Sample Numbers:</span>
                  {shipments.slice(0, 5).map((s) => (
                    <button
                      key={s.trackingNumber}
                      type="button"
                      onClick={() => {
                        setSearchInput(s.trackingNumber);
                        setActiveTrackingNumber(s.trackingNumber);
                      }}
                      className={`font-mono px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                        activeTrackingNumber === s.trackingNumber
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-[#10141d] text-slate-300 border-slate-800 hover:border-amber-500/30'
                      }`}
                    >
                      {s.trackingNumber}
                    </button>
                  ))}
                </div>
              </div>

              {!trackingDetails ? (
                <EmptyState
                  icon={AlertCircle}
                  title="Tracking Number Not Found"
                  description={`No shipment manifest exists matching "${activeTrackingNumber}". Please check the number or choose from the quick samples above.`}
                  actionText="Reset to Default Consignment"
                  onAction={() => {
                    const fallback = shipments[0]?.trackingNumber || 'TRK-982410';
                    setSearchInput(fallback);
                    setActiveTrackingNumber(fallback);
                  }}
                />
              ) : (
                <>
                  {/* Top Live Status & Telemetry Header Banner */}
                  <div className="p-6 rounded-[28px] bg-[#141822]/90 backdrop-blur-xl border border-amber-500/25 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20 shrink-0">
                          <Truck className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-black text-white font-mono tracking-tight">
                              {trackingDetails.trackingNumber}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyTracking(trackingDetails.trackingNumber)}
                              className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                              title="Copy tracking number"
                            >
                              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                            </button>
                          </div>
                          <p className="text-xs text-slate-400">
                            Service: <span className="text-slate-200 font-semibold">{trackingDetails.carrierService}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ETA Countdown Badge & Status Update Selector */}
                    <div className="flex flex-wrap items-center gap-4">
                      {/* Estimated Delivery Date Badge */}
                      <div className="bg-[#10141d] p-3.5 rounded-2xl border border-amber-500/20 text-right">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          Estimated Delivery Date
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Calendar className="h-4 w-4 text-emerald-400" />
                          <span className="text-sm font-black text-emerald-400 font-mono">
                            {trackingDetails.expectedDeliveryDate}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            ({trackingDetails.estimatedDaysLeft === 0 ? 'Due Today / Completed' : `${trackingDetails.estimatedDaysLeft} days remaining`})
                          </span>
                        </div>
                      </div>

                      {/* Status Selector for Quick Updates */}
                      <div className="bg-[#10141d] p-3.5 rounded-2xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                          Parcel Status Updates
                        </span>
                        <select
                          value={trackingDetails.deliveryStatus}
                          disabled={isUpdatingStatus}
                          onChange={(e) => handleStatusChange(e.target.value)}
                          className="px-3 py-1.5 text-xs bg-[#141822] text-amber-400 font-bold border border-amber-500/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer disabled:opacity-50"
                        >
                          {DELIVERY_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Current Parcel Location & Telemetry Card */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Live Location Radar Card */}
                    <div className="md:col-span-2 p-6 rounded-[28px] bg-[#141822]/85 backdrop-blur-xl border border-amber-500/20 shadow-xl space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                          <Radio className="h-4 w-4 text-amber-400 animate-pulse" />
                          Current Parcel Location (Live Telemetry)
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                          Active Signal
                        </span>
                      </div>

                      <div>
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/25">
                            <MapPin className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-white">
                              {trackingDetails.currentLocation}
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                              <span>Carrier Fleet: <strong className="text-slate-200">{trackingDetails.carrierVehicle}</strong></span>
                              <span>•</span>
                              <span>Speed: <strong className="text-amber-400">{trackingDetails.gpsTelemetry.speed}</strong></span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1.5 pt-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400 font-semibold">Transit Route Progress</span>
                          <span className="text-amber-400 font-black font-mono">{trackingDetails.progressPercentage}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-[#10141d] rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 transition-all duration-700"
                            style={{ width: `${trackingDetails.progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sensor Telemetry Box */}
                    <div className="p-6 rounded-[28px] bg-[#141822]/85 backdrop-blur-xl border border-slate-800 shadow-xl space-y-3">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-wider block border-b border-slate-800 pb-3">
                        Telemetry Sensors
                      </span>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between py-1 border-b border-slate-800/60">
                          <span className="text-slate-500">GPS Coordinates:</span>
                          <span className="font-mono text-slate-300 font-bold">{trackingDetails.gpsTelemetry.latitude}, {trackingDetails.gpsTelemetry.longitude}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-800/60">
                          <span className="text-slate-500">Transit Elevation:</span>
                          <span className="font-mono text-slate-300">{trackingDetails.gpsTelemetry.altitude}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-800/60">
                          <span className="text-slate-500">Container Temp:</span>
                          <span className="font-mono text-emerald-400 font-bold">{trackingDetails.gpsTelemetry.temperature}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-500">Status Verification:</span>
                          <StatusBadge status={trackingDetails.deliveryStatus} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipment Summary (Sender, Receiver, Parcel Specs) */}
                  <div className="p-6 rounded-[28px] bg-[#141822]/85 backdrop-blur-xl border border-amber-500/20 shadow-xl space-y-4">
                    <span className="text-xs font-black text-white uppercase tracking-wider block border-b border-slate-800 pb-3">
                      Shipment Summary
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                      {/* Sender */}
                      <div className="bg-[#10141d] p-3.5 rounded-2xl border border-slate-800">
                        <span className="text-[10px] font-bold text-amber-400 uppercase block mb-1">Origin Consignor</span>
                        <p className="font-bold text-white text-sm">{trackingDetails.senderName}</p>
                        <p className="text-slate-400 text-[11px] mt-1 truncate">{trackingDetails.pickupAddress}</p>
                      </div>

                      {/* Receiver */}
                      <div className="bg-[#10141d] p-3.5 rounded-2xl border border-slate-800">
                        <span className="text-[10px] font-bold text-blue-400 uppercase block mb-1">Destination Consignee</span>
                        <p className="font-bold text-white text-sm">{trackingDetails.receiverName}</p>
                        <p className="text-slate-400 text-[11px] mt-1 truncate">{trackingDetails.deliveryAddress}</p>
                      </div>

                      {/* Specs */}
                      <div className="bg-[#10141d] p-3.5 rounded-2xl border border-slate-800">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Cargo Specifications</span>
                        <p className="font-bold text-white text-sm">{trackingDetails.parcelType}</p>
                        <p className="text-amber-400 font-bold font-mono text-[11px] mt-1">Weight: {trackingDetails.parcelWeight} kg</p>
                      </div>

                      {/* Dates */}
                      <div className="bg-[#10141d] p-3.5 rounded-2xl border border-slate-800">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Shipping Milestone Dates</span>
                        <p className="text-slate-300 text-xs">Shipped: <strong className="text-white">{trackingDetails.shippingDate}</strong></p>
                        <p className="text-emerald-400 text-xs mt-1">ETA: <strong>{trackingDetails.expectedDeliveryDate}</strong></p>
                      </div>
                    </div>
                  </div>

                  {/* Shipment Timeline & Tracking History */}
                  <div className="p-6 rounded-[28px] bg-[#141822]/85 backdrop-blur-xl border border-amber-500/20 shadow-xl space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <h2 className="text-base font-bold text-white tracking-tight">Shipment Timeline & Checkpoint History</h2>
                        <p className="text-xs text-slate-400">Step-by-step route progression verified through CPTS distribution terminals</p>
                      </div>
                      <StatusBadge status={trackingDetails.deliveryStatus} />
                    </div>

                    {/* Timeline Checkpoints */}
                    <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
                      {trackingDetails.history.map((step, idx) => (
                        <div key={step.key} className="relative group">
                          {/* Dot Indicator */}
                          <div
                            className={`absolute -left-6 sm:-left-8 top-1 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-[#141822] ${
                              step.isCurrent
                                ? 'bg-amber-500 text-slate-950 ring-amber-500/25 animate-pulse'
                                : step.isCompleted
                                ? 'bg-emerald-500 text-slate-950'
                                : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            {step.isCompleted && !step.isCurrent ? (
                              <Check className="h-3.5 w-3.5 stroke-[3]" />
                            ) : (
                              idx + 1
                            )}
                          </div>

                          {/* Content */}
                          <div
                            className={`p-4 rounded-2xl border transition-all ${
                              step.isCurrent
                                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                                : step.isCompleted
                                ? 'bg-[#10141d]/80 border-slate-800 text-slate-200'
                                : 'bg-[#10141d]/40 border-slate-850 text-slate-500'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                <span>{step.title}</span>
                                {step.isCurrent && (
                                  <span className="text-[10px] uppercase font-black px-2 py-0.5 bg-amber-500 text-slate-950 rounded-full">
                                    Current Stage
                                  </span>
                                )}
                              </h4>
                              <span className="text-xs font-mono text-slate-400">
                                {step.date} • {step.time}
                              </span>
                            </div>

                            <p className="text-xs text-slate-300 mt-1">{step.description}</p>
                            
                            <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90 font-medium mt-2">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>{step.location}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* ============================================================== */}
          {/* TAB 2: TRACK MULTIPLE SHIPMENTS VIEW                           */}
          {/* ============================================================== */}
          {activeTab === 'multiple' && (
            <div className="space-y-6">
              {/* Multi-tracking Header Bar */}
              <div className="bg-[#141822]/90 backdrop-blur-xl p-5 sm:p-6 rounded-[28px] border border-amber-500/20 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                      <Layers className="h-5 w-5 text-amber-400" />
                      <span>Multi-Shipment Fleet Monitor</span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      Track and compare route progress for multiple consignments simultaneously
                    </p>
                  </div>

                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20 self-start sm:self-auto">
                    Monitoring {selectedMultiTracking.length} parcels
                  </span>
                </div>

                {/* Add Custom Tracking Number & Interactive Controls */}
                <form onSubmit={handleAddMultiSearch} className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={multiSearchInput}
                      onChange={(e) => setMultiSearchInput(e.target.value)}
                      placeholder="Enter tracking ID (or click '+ Add to Monitor')..."
                      className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#141822] border border-slate-700/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 text-white placeholder-slate-500 font-mono"
                    />
                  </div>

                  {/* Quick-add unmonitored dropdown picker */}
                  {unmonitoredShipments.length > 0 && (
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          setSelectedMultiTracking((prev) => [...prev, e.target.value]);
                          toast.success(`Added ${e.target.value} to monitor!`);
                          e.target.value = '';
                        }
                      }}
                      defaultValue=""
                      className="px-3 py-2 text-xs bg-[#141822] text-amber-400 font-mono font-bold border border-slate-700/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer shrink-0"
                    >
                      <option value="" disabled>Select parcel to add...</option>
                      {unmonitoredShipments.map((s) => (
                        <option key={s.trackingNumber} value={s.trackingNumber} className="bg-[#141822] text-white">
                          + {s.trackingNumber} ({s.deliveryStatus})
                        </option>
                      ))}
                    </select>
                  )}

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <Plus className="h-4 w-4 stroke-[3]" />
                    <span>Add to Monitor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (selectedMultiTracking.length === shipments.length) {
                        toast.info('All consignments are already active in the monitor.');
                      } else {
                        setSelectedMultiTracking(shipments.map((s) => s.trackingNumber));
                        toast.success(`Monitoring all ${shipments.length} parcels!`);
                      }
                    }}
                    className="px-3.5 py-2.5 bg-[#181d2a] hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer shrink-0"
                  >
                    Add All ({shipments.length})
                  </button>
                </form>

                {/* Checklist of all shipments to monitor */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 block">Click any chip to toggle in monitor:</span>
                  <div className="flex flex-wrap gap-2">
                    {shipments.map((s) => {
                      const isSelected = selectedMultiTracking.includes(s.trackingNumber);
                      return (
                        <button
                          key={s.trackingNumber}
                          type="button"
                          onClick={() => handleToggleMultiSelect(s.trackingNumber)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                              : 'bg-[#10141d] text-slate-400 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              isSelected ? 'bg-amber-400' : 'bg-slate-600'
                            }`}
                          />
                          <span>{s.trackingNumber}</span>
                          <span className="text-[10px] text-slate-500 font-sans">({s.deliveryStatus})</span>
                          <span className="text-[10px] text-amber-400/80 font-mono font-bold">
                            {isSelected ? '✓' : '+'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Multi-Shipment Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {multiShipmentsDetails.map((item) => (
                  <div
                    key={item.trackingNumber}
                    className="bg-[#141822]/90 backdrop-blur-xl p-5 rounded-[28px] border border-amber-500/20 shadow-xl space-y-4 hover:border-amber-500/40 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Card Header */}
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div>
                          <span className="font-mono font-black text-amber-400 text-sm block">
                            {item.trackingNumber}
                          </span>
                          <span className="text-[10px] text-slate-400">{item.parcelType}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={item.deliveryStatus} />
                          <button
                            type="button"
                            onClick={() => handleToggleMultiSelect(item.trackingNumber)}
                            className="p-1 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Remove from monitor"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Origin -> Destination Route */}
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold shrink-0">From:</span>
                          <span className="text-slate-300 truncate">{item.senderName} ({item.pickupAddress.split(',')[1] || 'Origin'})</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-400 font-bold shrink-0">To:</span>
                          <span className="text-slate-300 truncate">{item.receiverName} ({item.deliveryAddress.split(',')[1] || 'Destination'})</span>
                        </div>
                      </div>

                      {/* Current Location */}
                      <div className="bg-[#10141d] p-3 rounded-xl border border-slate-800 text-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Current Checkpoint</span>
                        <p className="text-slate-200 font-semibold truncate flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">{item.currentLocation}</span>
                        </p>
                      </div>

                      {/* Progress Bar & ETA */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-medium">
                          <span className="text-slate-400">Route Progress</span>
                          <span className="text-emerald-400 font-mono font-bold">{item.progressPercentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-[#10141d] rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-emerald-400"
                            style={{ width: `${item.progressPercentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
                          <span>Shipped: {item.shippingDate}</span>
                          <span>ETA: {item.expectedDeliveryDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* View Detailed Timeline Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTrackingNumber(item.trackingNumber);
                        setSearchInput(item.trackingNumber);
                        setActiveTab('single');
                      }}
                      className="w-full py-2 bg-[#1a1f2c] hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-slate-800"
                    >
                      <span>View Full Timeline & GPS</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
