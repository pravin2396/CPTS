import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShipments } from '../context/ShipmentContext';
import { Sidebar } from '../components/Sidebar';
import { NotificationBell } from '../components/notifications/NotificationBell';
import {
  MONTHLY_SHIPMENT_REPORTS,
  DELIVERY_PERFORMANCE_METRICS,
  TOP_CUSTOMERS_REPORT,
  SHIPMENT_TRENDS_DATA
} from '../data/reportsData';
import {
  BarChart3,
  TrendingUp,
  Package,
  CheckCircle2,
  Clock,
  Users,
  Download,
  Calendar,
  ArrowUpRight,
  Search,
  Printer,
  ChevronRight,
  ShieldCheck,
  Zap,
  Truck,
  Plane,
  Layers,
  Activity,
  Menu,
  FileSpreadsheet
} from 'lucide-react';
import { toast } from 'react-toastify';

export const ReportsPage = () => {
  const navigate = useNavigate();
  const { shipments } = useShipments();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('YTD'); // '7D', '30D', 'Q3', 'YTD'
  const [activeChartTab, setActiveChartTab] = useState('monthly'); // 'monthly' | 'trends' | 'performance'
  const [hoveredMonth, setHoveredMonth] = useState(null);
  const [hoveredTrendPoint, setHoveredTrendPoint] = useState(null);
  const [monthSearchQuery, setMonthSearchQuery] = useState('');
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');

  // Live context calculations
  const liveTotalShipments = shipments.length;
  const liveDeliveredParcels = shipments.filter(
    (s) => s.deliveryStatus === 'Delivered'
  ).length;
  const livePendingDeliveries = shipments.filter(
    (s) => ['Pending', 'Picked Up', 'In Transit', 'Out for Delivery'].includes(s.deliveryStatus)
  ).length;

  // Aggregate stats across historical + live records
  const historicalTotal = MONTHLY_SHIPMENT_REPORTS.reduce(
    (acc, m) => acc + m.totalShipments,
    0
  );
  const historicalDelivered = MONTHLY_SHIPMENT_REPORTS.reduce(
    (acc, m) => acc + m.deliveredParcels,
    0
  );
  const historicalPending = MONTHLY_SHIPMENT_REPORTS.reduce(
    (acc, m) => acc + m.pendingDeliveries,
    0
  );

  const aggregateTotalShipments = historicalTotal + liveTotalShipments;
  const aggregateDeliveredParcels = historicalDelivered + liveDeliveredParcels;
  const aggregatePendingDeliveries = historicalPending + livePendingDeliveries;

  // Filtered monthly report list
  const filteredMonthlyReports = useMemo(() => {
    return MONTHLY_SHIPMENT_REPORTS.filter((item) =>
      item.month.toLowerCase().includes(monthSearchQuery.toLowerCase())
    );
  }, [monthSearchQuery]);

  // Filtered top customers list
  const filteredTopCustomers = useMemo(() => {
    return TOP_CUSTOMERS_REPORT.filter(
      (cust) =>
        cust.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
        cust.company.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
        cust.tier.toLowerCase().includes(customerSearchQuery.toLowerCase())
    );
  }, [customerSearchQuery]);

  // Dynamic multiplier based on selected time range
  const rangeMultiplier = useMemo(() => {
    switch (timeRange) {
      case '7D':
        return 0.12;
      case '30D':
        return 0.28;
      case 'Q3':
        return 0.55;
      case 'YTD':
      default:
        return 1.0;
    }
  }, [timeRange]);

  // Export CSV handler
  const handleExportCSV = () => {
    try {
      const headers = [
        'Month',
        'Total Shipments',
        'Delivered Parcels',
        'Pending Deliveries',
        'Failed Deliveries',
        'On-Time Rate (%)',
        'SLA Compliance (%)',
        'Revenue ($)',
        'Avg Transit (Hours)'
      ];

      const rows = MONTHLY_SHIPMENT_REPORTS.map((m) => [
        `"${m.month}"`,
        m.totalShipments,
        m.deliveredParcels,
        m.pendingDeliveries,
        m.failedDeliveries,
        `${m.onTimeRate}%`,
        `${m.slaCompliance}%`,
        `$${m.revenue}`,
        `${m.avgTransitHours}h`
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute(
        'download',
        `DropPoint_Monthly_Report_${timeRange}_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Logistics Monthly Report CSV exported successfully!');
    } catch (err) {
      toast.error('Failed to export CSV report: ' + err.message);
    }
  };

  // Export Customers CSV
  const handleExportCustomersCSV = () => {
    try {
      const headers = [
        'Rank',
        'Customer Name',
        'Company',
        'Tier',
        'Total Shipments',
        'Delivered Parcels',
        'Total Spend ($)',
        'Reliability Score (%)',
        'City'
      ];

      const rows = TOP_CUSTOMERS_REPORT.map((c) => [
        c.rank,
        `"${c.name}"`,
        `"${c.company}"`,
        `"${c.tier}"`,
        c.totalShipments,
        c.deliveredParcels,
        `$${c.totalSpend}`,
        `${c.reliabilityScore}%`,
        `"${c.city}"`
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute(
        'download',
        `DropPoint_Top_Customers_Report_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Top Consignors Intelligence Report exported!');
    } catch (err) {
      toast.error('Failed to export Customers CSV: ' + err.message);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Max value for scaling monthly bars
  const maxMonthlyVolume = Math.max(
    ...MONTHLY_SHIPMENT_REPORTS.map((m) => m.totalShipments),
    4000
  );

  // Max value for scaling trend area
  const maxTrendVolume = Math.max(
    ...SHIPMENT_TRENDS_DATA.dailyTrends.map((t) => t.volume),
    220
  );

  return (
    <div className="min-h-screen w-full bg-[#0a0c10] text-slate-100 font-sans antialiased relative selection:bg-amber-500 selection:text-slate-950 flex">
      {/* Background Logistics Image with Dark Overlay (Theme 4) */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-15 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0c10]/95 via-[#0e121a]/95 to-[#0a0c10]/98 pointer-events-none" />

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all">
        {/* TOP HEADER */}
        <header className="sticky top-0 z-30 h-16 w-full bg-[#141822]/85 backdrop-blur-xl border-b border-amber-500/20 px-4 sm:px-8 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors focus:outline-none"
              aria-label="Open Sidebar Navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">
                  Logistics Reports & Analytics
                </h1>
                <p className="text-xs text-slate-400 hidden md:block">
                  Comprehensive performance audit, volume trends, and enterprise consignor rankings
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Time Range Selector */}
            <div className="hidden md:flex items-center bg-[#10141d] rounded-xl p-1 border border-slate-800">
              {[
                { key: '7D', label: '7 Days' },
                { key: '30D', label: '30 Days' },
                { key: 'Q3', label: 'Q3 2026' },
                { key: 'YTD', label: 'Year to Date' }
              ].map((btn) => (
                <button
                  key={btn.key}
                  onClick={() => setTimeRange(btn.key)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    timeRange === btn.key
                      ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Print action */}
            <button
              onClick={handlePrint}
              title="Print / Save PDF"
              className="p-2 rounded-xl bg-[#141822] text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <Printer className="h-4 w-4" />
            </button>

            {/* Export CSV action */}
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export Report</span>
            </button>

            {/* Notification Bell */}
            <NotificationBell />
          </div>
        </header>

        {/* MAIN BODY (Edge-to-Edge Stretched w-full) */}
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
          {/* ============================================================ */}
          {/* TOP KPI CARDS: Total Shipments, Delivered, Pending, Perf     */}
          {/* ============================================================ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {/* 1. Total Shipments */}
            <div className="bg-[#141822]/90 backdrop-blur-md rounded-2xl p-5 border border-amber-500/20 shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Total Shipments
                </span>
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Package className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {Math.round(aggregateTotalShipments * rangeMultiplier).toLocaleString()}
                </span>
                <span className="inline-flex items-center text-xs font-bold text-emerald-400">
                  <ArrowUpRight className="h-3.5 w-3.5" /> +14.8%
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-400 flex items-center justify-between">
                <span>Live Active: <strong className="text-white">{liveTotalShipments}</strong></span>
                <span className="text-slate-500">vs. Prior Term</span>
              </p>
            </div>

            {/* 2. Delivered Parcels */}
            <div className="bg-[#141822]/90 backdrop-blur-md rounded-2xl p-5 border border-emerald-500/20 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Delivered Parcels
                </span>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {Math.round(aggregateDeliveredParcels * rangeMultiplier).toLocaleString()}
                </span>
                <span className="inline-flex items-center text-xs font-bold text-emerald-400">
                  <ArrowUpRight className="h-3.5 w-3.5" /> 96.2%
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-400 flex items-center justify-between">
                <span>Live Confirmed: <strong className="text-white">{liveDeliveredParcels}</strong></span>
                <span className="text-emerald-400/90 font-medium">On-Time SLA Met</span>
              </p>
            </div>

            {/* 3. Pending Deliveries */}
            <div className="bg-[#141822]/90 backdrop-blur-md rounded-2xl p-5 border border-amber-500/20 shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Pending Deliveries
                </span>
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {Math.round(aggregatePendingDeliveries * rangeMultiplier).toLocaleString()}
                </span>
                <span className="inline-flex items-center text-xs font-bold text-amber-400">
                  <Activity className="h-3.5 w-3.5" /> Active Route
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-400 flex items-center justify-between">
                <span>Live In-Flight: <strong className="text-white">{livePendingDeliveries}</strong></span>
                <span className="text-slate-500">Pick-up / In-Transit</span>
              </p>
            </div>

            {/* 4. Delivery Performance */}
            <div className="bg-[#141822]/90 backdrop-blur-md rounded-2xl p-5 border border-sky-500/20 shadow-xl relative overflow-hidden group hover:border-sky-500/40 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Delivery Performance
                </span>
                <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {DELIVERY_PERFORMANCE_METRICS.slaComplianceRate}%
                </span>
                <span className="inline-flex items-center text-xs font-bold text-sky-400">
                  <Zap className="h-3.5 w-3.5" /> High SLA
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-400 flex items-center justify-between">
                <span>Avg Transit: <strong className="text-white">{DELIVERY_PERFORMANCE_METRICS.averageTransitHours} hrs</strong></span>
                <span className="text-sky-400/90 font-medium">92.4% 1st Try</span>
              </p>
            </div>
          </div>

          {/* ============================================================ */}
          {/* DASHBOARD CHARTS SECTION (Feature 8: Dummy Data Charts)       */}
          {/* ============================================================ */}
          <div className="bg-[#141822]/90 backdrop-blur-md rounded-2xl border border-amber-500/20 shadow-2xl p-6 w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    Interactive Dashboard Analytics & Trends
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Visual telemetry of monthly dispatch curves, daily momentum, and transport SLAs
                </p>
              </div>

              {/* Chart Tabs */}
              <div className="flex items-center bg-[#0a0c10] p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveChartTab('monthly')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeChartTab === 'monthly'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BarChart3 className="h-3.5 w-3.5" />
                  Monthly Breakdown
                </button>
                <button
                  onClick={() => setActiveChartTab('trends')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeChartTab === 'trends'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  Daily Trajectory
                </button>
                <button
                  onClick={() => setActiveChartTab('performance')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeChartTab === 'performance'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  SLA & Modals
                </button>
              </div>
            </div>

            {/* TAB 1: MONTHLY SHIPMENT VOLUME & DELIVERY STATUS BREAKDOWN */}
            {activeChartTab === 'monthly' && (
              <div className="pt-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-6">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-xs bg-amber-500 inline-block" />
                      Total Dispatched
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block" />
                      Delivered
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-xs bg-sky-500 inline-block" />
                      Pending / In-Transit
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-xs bg-rose-500 inline-block" />
                      Failed / Exceptions
                    </span>
                  </div>
                  <div className="text-amber-400/90 font-mono text-[11px] bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                    Hover over bars for detailed metrics
                  </div>
                </div>

                {/* SVG/CSS Custom Responsive Bar Chart */}
                <div className="h-72 w-full pt-4 relative flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-4 border-b border-slate-800">
                  {/* Background grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                    <div className="border-b border-dashed border-slate-600 w-full flex justify-end text-[10px] text-slate-400 pr-2">
                      4,000
                    </div>
                    <div className="border-b border-dashed border-slate-600 w-full flex justify-end text-[10px] text-slate-400 pr-2">
                      3,000
                    </div>
                    <div className="border-b border-dashed border-slate-600 w-full flex justify-end text-[10px] text-slate-400 pr-2">
                      2,000
                    </div>
                    <div className="border-b border-dashed border-slate-600 w-full flex justify-end text-[10px] text-slate-400 pr-2">
                      1,000
                    </div>
                    <div className="border-b border-slate-700 w-full" />
                  </div>

                  {MONTHLY_SHIPMENT_REPORTS.map((item) => {
                    const totalHeight = (item.totalShipments / maxMonthlyVolume) * 100;
                    const deliveredHeight = (item.deliveredParcels / maxMonthlyVolume) * 100;
                    const isHovered = hoveredMonth?.shortMonth === item.shortMonth;

                    return (
                      <div
                        key={item.shortMonth}
                        onMouseEnter={() => setHoveredMonth(item)}
                        onMouseLeave={() => setHoveredMonth(null)}
                        className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer z-10"
                      >
                        {/* Tooltip Popup */}
                        {isHovered && (
                          <div className="absolute -top-24 bg-[#0a0c10] border border-amber-500/50 rounded-xl p-3 shadow-2xl text-[11px] text-slate-200 min-w-[160px] pointer-events-none z-30 transition-all transform scale-100">
                            <div className="font-bold text-amber-400 border-b border-slate-800 pb-1 mb-1.5 flex justify-between">
                              <span>{item.month}</span>
                              <span className="text-emerald-400">{item.onTimeRate}% SLA</span>
                            </div>
                            <div className="space-y-0.5 font-mono text-[10px]">
                              <div className="flex justify-between">
                                <span className="text-slate-400">Total:</span>
                                <span className="font-bold text-white">{item.totalShipments.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-emerald-400">Delivered:</span>
                                <span className="font-bold text-emerald-400">{item.deliveredParcels.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sky-400">Pending:</span>
                                <span className="font-bold text-sky-400">{item.pendingDeliveries}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-rose-400">Failed:</span>
                                <span className="font-bold text-rose-400">{item.failedDeliveries}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Bar Group */}
                        <div className="w-full max-w-[42px] flex items-end justify-center gap-1 h-full">
                          {/* Total Volume Bar */}
                          <div
                            style={{ height: `${totalHeight}%` }}
                            className={`w-1/2 rounded-t-md transition-all duration-300 ${
                              isHovered
                                ? 'bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.6)]'
                                : 'bg-amber-500/80 group-hover:bg-amber-400'
                            }`}
                          />
                          {/* Delivered Parcels Bar */}
                          <div
                            style={{ height: `${deliveredHeight}%` }}
                            className={`w-1/2 rounded-t-md transition-all duration-300 ${
                              isHovered
                                ? 'bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.6)]'
                                : 'bg-emerald-500/80 group-hover:bg-emerald-400'
                            }`}
                          />
                        </div>

                        {/* X-axis Label */}
                        <span
                          className={`text-[11px] font-semibold mt-2 transition-colors ${
                            isHovered ? 'text-amber-400 font-bold' : 'text-slate-400'
                          }`}
                        >
                          {item.shortMonth}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Monthly Footnote Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="bg-[#10141d] p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400 block">Peak Month</span>
                    <strong className="text-sm font-bold text-amber-400">October (3,820)</strong>
                  </div>
                  <div className="bg-[#10141d] p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400 block">Avg Monthly Growth</span>
                    <strong className="text-sm font-bold text-emerald-400">+11.6% MoM</strong>
                  </div>
                  <div className="bg-[#10141d] p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400 block">Lowest Disruption Rate</span>
                    <strong className="text-sm font-bold text-sky-400">May & Jun (1.3%)</strong>
                  </div>
                  <div className="bg-[#10141d] p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400 block">Total 2026 Volume</span>
                    <strong className="text-sm font-bold text-white">25,240 Parcels</strong>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SHIPMENT TRENDS & DAILY TRAJECTORY (AREA & LINE CURVE) */}
            {activeChartTab === 'trends' && (
              <div className="pt-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-0.5 bg-amber-400 inline-block" />
                      Daily Dispatches
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                      Peak Spikes
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    Last 14 Operational Days Performance
                  </span>
                </div>

                {/* SVG Area & Trend Chart */}
                <div className="h-72 w-full relative">
                  <svg
                    className="w-full h-full overflow-visible"
                    viewBox="0 0 700 240"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal grid lines */}
                    {[40, 90, 140, 190].map((y) => (
                      <line
                        key={y}
                        x1="0"
                        y1={y}
                        x2="700"
                        y2={y}
                        stroke="#334155"
                        strokeDasharray="4 4"
                        strokeWidth="0.8"
                        opacity="0.4"
                      />
                    ))}

                    {/* Smooth Area Path */}
                    {(() => {
                      const points = SHIPMENT_TRENDS_DATA.dailyTrends.map((t, idx) => {
                        const x = (idx / (SHIPMENT_TRENDS_DATA.dailyTrends.length - 1)) * 700;
                        const y = 220 - (t.volume / maxTrendVolume) * 200;
                        return { x, y, ...t };
                      });

                      const pathD = points.reduce((acc, curr, idx) => {
                        return idx === 0
                          ? `M ${curr.x} ${curr.y}`
                          : `${acc} L ${curr.x} ${curr.y}`;
                      }, '');

                      const areaD = `${pathD} L 700 230 L 0 230 Z`;

                      return (
                        <>
                          <path d={areaD} fill="url(#trendGradient)" />
                          <path
                            d={pathD}
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          {/* Data point dots */}
                          {points.map((pt, idx) => (
                            <g key={idx}>
                              <circle
                                cx={pt.x}
                                cy={pt.y}
                                r={pt.peak ? '6' : '4'}
                                fill={pt.peak ? '#10b981' : '#f59e0b'}
                                stroke="#0a0c10"
                                strokeWidth="2"
                                className="cursor-pointer hover:scale-150 transition-transform"
                                onMouseEnter={() => setHoveredTrendPoint(pt)}
                                onMouseLeave={() => setHoveredTrendPoint(null)}
                              />
                            </g>
                          ))}
                        </>
                      );
                    })()}
                  </svg>

                  {/* Hovered point tooltip */}
                  {hoveredTrendPoint && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-[#0a0c10] border border-amber-500/50 rounded-xl px-4 py-2 shadow-2xl text-xs text-slate-200 pointer-events-none z-20 flex items-center gap-4">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Date</span>
                        <strong className="text-amber-400">{hoveredTrendPoint.day}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Dispatched</span>
                        <strong className="text-white">{hoveredTrendPoint.volume} Parcels</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Delivered</span>
                        <strong className="text-emerald-400">{hoveredTrendPoint.delivered}</strong>
                      </div>
                      {hoveredTrendPoint.peak && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                          Peak Load
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Day-of-week breakdown insight */}
                <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 pt-2">
                  {SHIPMENT_TRENDS_DATA.dayOfWeekDistribution.map((d) => (
                    <div
                      key={d.day}
                      className="bg-[#10141d] p-3 rounded-xl border border-slate-800 text-center"
                    >
                      <span className="text-xs font-bold text-slate-300 block">{d.day}</span>
                      <strong className="text-sm font-extrabold text-amber-400 block mt-1">
                        {d.share}%
                      </strong>
                      <span className="text-[10px] text-slate-500">~{d.avgVolume}/day</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: DELIVERY PERFORMANCE & SLA GAUGES */}
            {activeChartTab === 'performance' && (
              <div className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Gauge 1: On-Time Rate */}
                  <div className="bg-[#10141d] p-5 rounded-2xl border border-slate-800 text-center flex flex-col items-center">
                    <div className="relative w-28 h-28 flex items-center justify-center my-2">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-800"
                          strokeWidth="3.8"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-amber-500"
                          strokeDasharray="96.2, 100"
                          strokeWidth="3.8"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-xl font-black text-white">96.2%</span>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">On-Time</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-white mt-2">On-Time Delivery Rate</span>
                    <span className="text-[11px] text-emerald-400">+1.4% above industry target</span>
                  </div>

                  {/* Gauge 2: SLA Met */}
                  <div className="bg-[#10141d] p-5 rounded-2xl border border-slate-800 text-center flex flex-col items-center">
                    <div className="relative w-28 h-28 flex items-center justify-center my-2">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-800"
                          strokeWidth="3.8"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-emerald-500"
                          strokeDasharray="98.1, 100"
                          strokeWidth="3.8"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-xl font-black text-white">98.1%</span>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">SLA Met</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-white mt-2">SLA Compliance Rate</span>
                    <span className="text-[11px] text-emerald-400">Gold Tier Verified</span>
                  </div>

                  {/* Gauge 3: First Attempt Success */}
                  <div className="bg-[#10141d] p-5 rounded-2xl border border-slate-800 text-center flex flex-col items-center">
                    <div className="relative w-28 h-28 flex items-center justify-center my-2">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-800"
                          strokeWidth="3.8"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-sky-500"
                          strokeDasharray="92.4, 100"
                          strokeWidth="3.8"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-xl font-black text-white">92.4%</span>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">1st Attempt</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-white mt-2">First Attempt Success</span>
                    <span className="text-[11px] text-sky-400">Minimized re-routes</span>
                  </div>

                  {/* Gauge 4: Low Exceptions */}
                  <div className="bg-[#10141d] p-5 rounded-2xl border border-slate-800 text-center flex flex-col items-center">
                    <div className="relative w-28 h-28 flex items-center justify-center my-2">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-800"
                          strokeWidth="3.8"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-rose-500"
                          strokeDasharray="1.8, 100"
                          strokeWidth="3.8"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-xl font-black text-white">1.8%</span>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Exceptions</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-white mt-2">Exception / Incident Rate</span>
                    <span className="text-[11px] text-rose-400">Well below 3% ceiling</span>
                  </div>
                </div>

                {/* Carrier Mode & Regional Hub Breakdowns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                  {/* Carrier Modes */}
                  <div className="bg-[#10141d] p-5 rounded-2xl border border-slate-800">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                      <Truck className="h-4 w-4 text-amber-400" />
                      Carrier & Fleet Mode Breakdown
                    </h3>
                    <div className="space-y-4">
                      {DELIVERY_PERFORMANCE_METRICS.carrierPerformance.map((mode) => (
                        <div key={mode.mode} className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-slate-300">{mode.mode}</span>
                            <span className="text-amber-400 font-mono">
                              {mode.onTimeRate}% on-time ({mode.avgSpeed})
                            </span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all"
                              style={{ width: `${mode.onTimeRate}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Regional Logistics Hubs */}
                  <div className="bg-[#10141d] p-5 rounded-2xl border border-slate-800">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                      <Plane className="h-4 w-4 text-sky-400" />
                      Regional Sorting Hub Performance
                    </h3>
                    <div className="space-y-4">
                      {DELIVERY_PERFORMANCE_METRICS.regionalPerformance.map((hub) => (
                        <div key={hub.region} className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-slate-300">
                              {hub.region} <span className="text-slate-500 text-[11px]">({hub.hub})</span>
                            </span>
                            <span className="text-emerald-400 font-mono">
                              {hub.successRate}% ({hub.volume.toLocaleString()} parcels)
                            </span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full rounded-full transition-all"
                              style={{ width: `${hub.successRate}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* FEATURE 4: MONTHLY SHIPMENT REPORT (DATA TABLE)              */}
          {/* ============================================================ */}
          <div className="bg-[#141822]/90 backdrop-blur-md rounded-2xl border border-amber-500/20 shadow-2xl p-6 w-full space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <FileSpreadsheet className="h-4 w-4" />
                  </div>
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    Monthly Shipment Report
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Full consignment audit ledger with delivered parcels, pending deliveries, and SLAs
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Search in monthly report */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={monthSearchQuery}
                    onChange={(e) => setMonthSearchQuery(e.target.value)}
                    placeholder="Search by month..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#10141d] border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <button
                  onClick={handleExportCSV}
                  title="Download CSV"
                  className="px-3 py-1.5 rounded-xl bg-[#10141d] border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  CSV
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#10141d] text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px] font-semibold">
                    <th className="py-3 px-4">Billing Month</th>
                    <th className="py-3 px-4">Total Shipments</th>
                    <th className="py-3 px-4">Delivered</th>
                    <th className="py-3 px-4">Pending</th>
                    <th className="py-3 px-4">Failed / Exceptions</th>
                    <th className="py-3 px-4">On-Time Rate</th>
                    <th className="py-3 px-4">SLA Compliance</th>
                    <th className="py-3 px-4">Revenue</th>
                    <th className="py-3 px-4 text-right">Avg Transit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filteredMonthlyReports.length > 0 ? (
                    filteredMonthlyReports.map((item) => (
                      <tr
                        key={item.month}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-sans font-bold text-white flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-amber-400" />
                          {item.month}
                        </td>
                        <td className="py-3.5 px-4 text-slate-200 font-bold">
                          {item.totalShipments.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-emerald-400 font-semibold">
                          {item.deliveredParcels.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-amber-400 font-semibold">
                          {item.pendingDeliveries}
                        </td>
                        <td className="py-3.5 px-4 text-rose-400">
                          {item.failedDeliveries}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {item.onTimeRate}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                            {item.slaCompliance}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-white font-bold">
                          ${item.revenue.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-right text-slate-400">
                          {item.avgTransitHours}h
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="py-8 text-center text-slate-500 font-sans">
                        No monthly records match your query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ============================================================ */}
          {/* FEATURE 6: TOP CUSTOMERS REPORT & SPEND LEADERBOARD          */}
          {/* ============================================================ */}
          <div className="bg-[#141822]/90 backdrop-blur-md rounded-2xl border border-amber-500/20 shadow-2xl p-6 w-full space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Users className="h-4 w-4" />
                  </div>
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    Top Customers & Corporate Consignors
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Highest volume shippers ranked by total dispatches, delivered parcels, and account spend
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Search top customers */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={customerSearchQuery}
                    onChange={(e) => setCustomerSearchQuery(e.target.value)}
                    placeholder="Search client or company..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#10141d] border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <button
                  onClick={handleExportCustomersCSV}
                  className="px-3 py-1.5 rounded-xl bg-[#10141d] border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export
                </button>
              </div>
            </div>

            {/* Top Customers Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#10141d] text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px] font-semibold">
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Consignor / Customer</th>
                    <th className="py-3 px-4">Account Tier</th>
                    <th className="py-3 px-4">Total Shipments</th>
                    <th className="py-3 px-4">Delivered</th>
                    <th className="py-3 px-4">Pending</th>
                    <th className="py-3 px-4">Reliability</th>
                    <th className="py-3 px-4">Total Spend</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredTopCustomers.length > 0 ? (
                    filteredTopCustomers.map((c) => (
                      <tr
                        key={c.id}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center justify-center h-6 w-6 rounded-full font-bold text-xs ${
                              c.rank === 1
                                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-500/30'
                                : c.rank === 2
                                ? 'bg-slate-300 text-slate-950'
                                : c.rank === 3
                                ? 'bg-amber-700 text-white'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            #{c.rank}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div>
                            <span className="font-bold text-white block">{c.name}</span>
                            <span className="text-[11px] text-slate-400">{c.company}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              c.tier.includes('Platinum')
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : c.tier.includes('Gold')
                                ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                                : 'bg-slate-700/50 text-slate-300 border border-slate-700'
                            }`}
                          >
                            {c.tier}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          {c.totalShipments.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-emerald-400">
                          {c.deliveredParcels.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-amber-400">
                          {c.pendingDeliveries}
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          <span className="text-emerald-400 font-bold">{c.reliabilityScore}%</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          ${c.totalSpend.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => navigate(`/customers/${c.id}`)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 hover:underline transition-colors"
                          >
                            Profile <ChevronRight className="h-3 w-3" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="py-8 text-center text-slate-500">
                        No top customers match your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ============================================================ */}
          {/* FEATURE 7: SHIPMENT TRENDS & CATEGORY BREAKDOWN              */}
          {/* ============================================================ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Category Parcel Breakdown */}
            <div className="bg-[#141822]/90 backdrop-blur-md rounded-2xl border border-amber-500/20 shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Layers className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Shipment Distribution by Category
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">5 Major Segments</span>
              </div>

              <div className="space-y-4 pt-2">
                {SHIPMENT_TRENDS_DATA.categoryBreakdown.map((cat) => (
                  <div key={cat.category} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-300">{cat.category}</span>
                      <span className="font-mono font-bold text-white">{cat.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${cat.percentage}%`,
                          backgroundColor: cat.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Logistics Insights */}
            <div className="bg-[#141822]/90 backdrop-blur-md rounded-2xl border border-amber-500/20 shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Strategic Shipment Trend Insights
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                  Q4 Optimized
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <div className="bg-[#10141d] p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Peak Dispatch Velocity on Wednesdays</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Mid-week dispatch volume accounts for 22.8% of weekly throughput, recommending staggered driver shifts during 08:00 - 11:30 AM.
                    </p>
                  </div>
                </div>

                <div className="bg-[#10141d] p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Fastest Corridor: JFK Northeast Express</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      The Northeast sorting hub holds a 97.8% on-time record with an average terminal dwell time of only 4.2 hours.
                    </p>
                  </div>
                </div>

                <div className="bg-[#10141d] p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 shrink-0">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Enterprise Retention at 99.4%</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Top tier consignors like Sterling Logistics and Vance Technologies generate over 52% of repeat commercial freight revenue.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
