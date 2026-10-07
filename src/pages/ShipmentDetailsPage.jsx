import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useShipments } from '../context/ShipmentContext';
import { apiGetShipmentById } from '../services/shipmentApiService';
import { Sidebar } from '../components/Sidebar';
import { StatusBadge, ConfirmModal, EmptyState } from '../components/ui/FeedbackComponents';
import { ShipmentModal } from '../components/ShipmentModal';
import {
  Boxes,
  Truck,
  MapPin,
  Calendar,
  Weight,
  User,
  Copy,
  Check,
  ArrowLeft,
  Edit2,
  Trash2,
  Menu,
  FileText,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'react-toastify';

export const ShipmentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getShipmentById, deleteShipment } = useShipments();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const shipment = getShipmentById(id);

  // Replicate READ [GET /posts/:id] in browser DevTools Network tab when viewing details
  useEffect(() => {
    if (id) {
      apiGetShipmentById(id);
    }
  }, [id]);

  const handleCopyTracking = () => {
    if (shipment) {
      navigator.clipboard.writeText(shipment.trackingNumber);
      setCopied(true);
      toast.success(`Copied ${shipment.trackingNumber} to clipboard!`);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConfirmDelete = async () => {
    if (shipment) {
      await deleteShipment(shipment.id);
      setIsDeleteModalOpen(false);
      navigate('/shipments');
    }
  };

  const STAGES = ['Booked', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'];
  const currentStageIndex = shipment ? STAGES.indexOf(shipment.deliveryStatus) : -1;

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

            <Link
              to="/shipments"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors py-1.5 px-3 rounded-xl hover:bg-slate-800/60"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Shipments</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Module 3 • Details View
            </span>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-5xl w-full mx-auto relative z-10">
          {!shipment ? (
            <EmptyState
              icon={Boxes}
              title="Shipment Not Found"
              description={`No shipment manifest found matching identifier "${id}". It may have been removed or never created.`}
              actionText="Return to Shipments List"
              onAction={() => navigate('/shipments')}
            />
          ) : (
            <>
              {/* Header Banner */}
              <div className="p-6 rounded-[28px] bg-[#141822]/90 backdrop-blur-xl border border-amber-500/25 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/25">
                    <Boxes className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                        {shipment.trackingNumber}
                      </h1>
                      <button
                        type="button"
                        onClick={handleCopyTracking}
                        className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title="Copy tracking number"
                      >
                        {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Dispatch Manifest ID: {shipment.id} • Registered via CPTS Dispatch Engine
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={shipment.deliveryStatus} />
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(true)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#1a1f2c] hover:bg-[#222838] text-amber-300 text-xs font-bold rounded-xl border border-amber-500/30 transition-all cursor-pointer"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold rounded-xl border border-rose-500/20 transition-all cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {/* Progress Flow */}
              <div className="p-6 rounded-[28px] bg-[#141822]/80 backdrop-blur-xl border border-amber-500/20 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
                    Logistics Routing Lifecycle
                  </h2>
                  <span className="text-xs font-semibold text-amber-400">
                    Status: {shipment.deliveryStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                  {STAGES.map((stage, idx) => {
                    const isPassed = currentStageIndex >= idx;
                    const isCurrent = currentStageIndex === idx;

                    return (
                      <div
                        key={stage}
                        className={`p-3.5 rounded-2xl flex flex-col items-center text-center transition-all ${
                          isCurrent
                            ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300 shadow-lg shadow-amber-500/10'
                            : isPassed
                            ? 'bg-[#10141d]/90 border border-emerald-500/30 text-slate-200'
                            : 'bg-[#10141d]/50 border border-slate-800 text-slate-500'
                        }`}
                      >
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-black mb-2 ${
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
                        <span className="text-xs font-bold">{stage}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Origin & Destination Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Consignor (Origin) */}
                <div className="p-6 rounded-[28px] bg-[#141822]/85 backdrop-blur-xl border border-amber-500/20 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Origin / Shipper
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md">
                      Pick-up Location
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{shipment.senderName}</h3>
                    <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-300 mt-2 bg-[#10141d] p-3 rounded-xl border border-slate-800">
                      <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{shipment.pickupAddress}</span>
                    </div>
                  </div>
                </div>

                {/* Consignee (Destination) */}
                <div className="p-6 rounded-[28px] bg-[#141822]/85 backdrop-blur-xl border border-blue-500/20 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-black text-blue-400 uppercase tracking-wider flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Destination / Consignee
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md">
                      Delivery Address
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{shipment.receiverName}</h3>
                    <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-300 mt-2 bg-[#10141d] p-3 rounded-xl border border-slate-800">
                      <MapPin className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                      <span>{shipment.deliveryAddress}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Specifications & Third Party Sync Details */}
              <div className="p-6 rounded-[28px] bg-[#141822]/85 backdrop-blur-xl border border-amber-500/20 shadow-xl space-y-6">
                <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  Consignment Cargo Specifications
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-[#10141d] border border-slate-800">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Parcel Category
                    </span>
                    <span className="text-sm font-black text-slate-200 mt-1 block">
                      {shipment.parcelType}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#10141d] border border-slate-800">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Total Weight
                    </span>
                    <span className="text-sm font-black text-amber-400 mt-1 block">
                      {shipment.parcelWeight} kg
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#10141d] border border-slate-800">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Shipping Date
                    </span>
                    <span className="text-sm font-black text-slate-200 mt-1 block">
                      {shipment.shippingDate}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#10141d] border border-slate-800">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Expected Delivery
                    </span>
                    <span className="text-sm font-black text-emerald-400 mt-1 block">
                      {shipment.expectedDeliveryDate}
                    </span>
                  </div>
                </div>

                {shipment.notes && (
                  <div className="p-4 rounded-2xl bg-[#10141d] border border-slate-800 flex items-start gap-3">
                    <FileText className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-amber-400 block mb-0.5">
                        Special Instructions & Dispatch Memo
                      </span>
                      <p className="text-xs sm:text-sm text-slate-300">{shipment.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Edit Shipment Modal */}
      {shipment && (
        <ShipmentModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          shipmentToEdit={shipment}
        />
      )}

      {/* Delete Confirmation Modal */}
      {shipment && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Confirm Consignment Deletion"
          message={`Are you sure you want to permanently remove shipment "${shipment.trackingNumber}"? This action cannot be undone.`}
          confirmText="Yes, Delete Shipment"
        />
      )}
    </div>
  );
};
