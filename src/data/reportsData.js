// Comprehensive reports and analytics seed data for Module 8: Reports
// Matches DropPoint Theme 4 (Deep Charcoal & Amber)

export const MONTHLY_SHIPMENT_REPORTS = [
  {
    month: "January 2026",
    shortMonth: "Jan",
    totalShipments: 1420,
    deliveredParcels: 1335,
    pendingDeliveries: 45,
    failedDeliveries: 40,
    onTimeRate: 94.0,
    slaCompliance: 96.2,
    revenue: 42600,
    avgTransitHours: 29.4
  },
  {
    month: "February 2026",
    shortMonth: "Feb",
    totalShipments: 1580,
    deliveredParcels: 1490,
    pendingDeliveries: 52,
    failedDeliveries: 38,
    onTimeRate: 94.3,
    slaCompliance: 96.8,
    revenue: 47400,
    avgTransitHours: 28.8
  },
  {
    month: "March 2026",
    shortMonth: "Mar",
    totalShipments: 1850,
    deliveredParcels: 1762,
    pendingDeliveries: 58,
    failedDeliveries: 30,
    onTimeRate: 95.2,
    slaCompliance: 97.4,
    revenue: 55500,
    avgTransitHours: 27.6
  },
  {
    month: "April 2026",
    shortMonth: "Apr",
    totalShipments: 2100,
    deliveredParcels: 1995,
    pendingDeliveries: 68,
    failedDeliveries: 37,
    onTimeRate: 95.0,
    slaCompliance: 97.0,
    revenue: 63000,
    avgTransitHours: 28.1
  },
  {
    month: "May 2026",
    shortMonth: "May",
    totalShipments: 2340,
    deliveredParcels: 2246,
    pendingDeliveries: 60,
    failedDeliveries: 34,
    onTimeRate: 96.0,
    slaCompliance: 98.1,
    revenue: 70200,
    avgTransitHours: 26.5
  },
  {
    month: "June 2026",
    shortMonth: "Jun",
    totalShipments: 2620,
    deliveredParcels: 2515,
    pendingDeliveries: 71,
    failedDeliveries: 34,
    onTimeRate: 96.0,
    slaCompliance: 97.9,
    revenue: 78600,
    avgTransitHours: 26.2
  },
  {
    month: "July 2026",
    shortMonth: "Jul",
    totalShipments: 2890,
    deliveredParcels: 2780,
    pendingDeliveries: 76,
    failedDeliveries: 34,
    onTimeRate: 96.2,
    slaCompliance: 98.0,
    revenue: 86700,
    avgTransitHours: 25.9
  },
  {
    month: "August 2026",
    shortMonth: "Aug",
    totalShipments: 3120,
    deliveredParcels: 2995,
    pendingDeliveries: 85,
    failedDeliveries: 40,
    onTimeRate: 96.0,
    slaCompliance: 97.8,
    revenue: 93600,
    avgTransitHours: 26.1
  },
  {
    month: "September 2026",
    shortMonth: "Sep",
    totalShipments: 3450,
    deliveredParcels: 3320,
    pendingDeliveries: 88,
    failedDeliveries: 42,
    onTimeRate: 96.2,
    slaCompliance: 98.2,
    revenue: 103500,
    avgTransitHours: 25.4
  },
  {
    month: "October 2026",
    shortMonth: "Oct",
    totalShipments: 3820,
    deliveredParcels: 3675,
    pendingDeliveries: 98,
    failedDeliveries: 47,
    onTimeRate: 96.2,
    slaCompliance: 98.4,
    revenue: 114600,
    avgTransitHours: 24.8
  }
];

export const DELIVERY_PERFORMANCE_METRICS = {
  overallOnTimeRate: 96.2,
  averageTransitHours: 25.8,
  firstAttemptSuccessRate: 92.4,
  slaComplianceRate: 98.1,
  customerSatisfactionScore: 4.88,
  exceptionIncidentRate: 1.8,
  carrierPerformance: [
    { mode: "Air Express Priority", shipments: 6840, onTimeRate: 98.6, avgSpeed: "14.2h", status: "Optimal" },
    { mode: "Ground Interstate Courier", shipments: 12480, onTimeRate: 95.8, avgSpeed: "32.0h", status: "Strong" },
    { mode: "Freight Heavy Cargo", shipments: 3120, onTimeRate: 94.1, avgSpeed: "56.4h", status: "Normal" },
    { mode: "Same-Day Metro Dispatch", shipments: 1850, onTimeRate: 99.1, avgSpeed: "4.8h", status: "Optimal" }
  ],
  regionalPerformance: [
    { region: "Northeast Corridor", volume: 7850, successRate: 97.8, hub: "JFK Terminal Hub" },
    { region: "Midwest Logistics Hub", volume: 6920, successRate: 96.9, hub: "Chicago O'Hare Depot" },
    { region: "West Coast Pacific", volume: 5410, successRate: 96.1, hub: "LAX Central Facility" },
    { region: "Southern Distribution", volume: 4110, successRate: 95.4, hub: "Miami Biscayne Hub" }
  ]
};

export const TOP_CUSTOMERS_REPORT = [
  {
    rank: 1,
    id: "CUST-1002",
    name: "Marcus Sterling",
    company: "Sterling Logistics Global",
    tier: "Enterprise Platinum",
    totalShipments: 1420,
    deliveredParcels: 1385,
    pendingDeliveries: 28,
    totalSpend: 78240,
    reliabilityScore: 99.4,
    city: "Springfield, IL"
  },
  {
    rank: 2,
    id: "CUST-1001",
    name: "Eleanor Vance",
    company: "Vance Technologies Inc.",
    tier: "Enterprise Platinum",
    totalShipments: 1180,
    deliveredParcels: 1145,
    pendingDeliveries: 26,
    totalSpend: 64900,
    reliabilityScore: 98.8,
    city: "Los Angeles, CA"
  },
  {
    rank: 3,
    id: "CUST-1004",
    name: "Liam O'Connor",
    company: "Biscayne Commercial Corp",
    tier: "Priority Gold",
    totalShipments: 940,
    deliveredParcels: 912,
    pendingDeliveries: 19,
    totalSpend: 51700,
    reliabilityScore: 98.1,
    city: "Miami, FL"
  },
  {
    rank: 4,
    id: "CUST-1003",
    name: "Sophia Rodriguez",
    company: "FashionHub Retail Brands",
    tier: "Priority Gold",
    totalShipments: 820,
    deliveredParcels: 795,
    pendingDeliveries: 16,
    totalSpend: 45100,
    reliabilityScore: 97.9,
    city: "New York, NY"
  },
  {
    rank: 5,
    id: "CUST-1005",
    name: "Dr. Aris Thorne",
    company: "Ann Arbor Medical BioTech",
    tier: "Corporate Silver",
    totalShipments: 680,
    deliveredParcels: 668,
    pendingDeliveries: 8,
    totalSpend: 39400,
    reliabilityScore: 99.8,
    city: "Ann Arbor, MI"
  },
  {
    rank: 6,
    id: "CUST-1007",
    name: "Dmitri Volkov",
    company: "Cascadia Aerospace Dynamics",
    tier: "Corporate Silver",
    totalShipments: 540,
    deliveredParcels: 524,
    pendingDeliveries: 12,
    totalSpend: 32600,
    reliabilityScore: 98.4,
    city: "Seattle, WA"
  },
  {
    rank: 7,
    id: "CUST-1006",
    name: "Clara Bennett",
    company: "Apex Precision Tools",
    tier: "Standard Commercial",
    totalShipments: 410,
    deliveredParcels: 398,
    pendingDeliveries: 9,
    totalSpend: 23800,
    reliabilityScore: 97.6,
    city: "Dallas, TX"
  }
];

export const SHIPMENT_TRENDS_DATA = {
  dailyTrends: [
    { day: "Oct 01", volume: 118, delivered: 110, pending: 8, peak: false },
    { day: "Oct 02", volume: 134, delivered: 126, pending: 8, peak: false },
    { day: "Oct 03", volume: 152, delivered: 144, pending: 8, peak: true },
    { day: "Oct 04", volume: 98, delivered: 94, pending: 4, peak: false },
    { day: "Oct 05", volume: 112, delivered: 106, pending: 6, peak: false },
    { day: "Oct 06", volume: 145, delivered: 138, pending: 7, peak: false },
    { day: "Oct 07", volume: 168, delivered: 158, pending: 10, peak: true },
    { day: "Oct 08", volume: 182, delivered: 172, pending: 10, peak: true },
    { day: "Oct 09", volume: 165, delivered: 152, pending: 13, peak: false },
    { day: "Oct 10", volume: 174, delivered: 162, pending: 12, peak: false },
    { day: "Oct 11", volume: 120, delivered: 114, pending: 6, peak: false },
    { day: "Oct 12", volume: 138, delivered: 130, pending: 8, peak: false },
    { day: "Oct 13", volume: 195, delivered: 180, pending: 15, peak: true },
    { day: "Oct 14", volume: 188, delivered: 176, pending: 12, peak: false }
  ],
  dayOfWeekDistribution: [
    { day: "Mon", share: 19.4, avgVolume: 185 },
    { day: "Tue", share: 21.2, avgVolume: 202 },
    { day: "Wed", share: 22.8, avgVolume: 218 },
    { day: "Thu", share: 18.6, avgVolume: 178 },
    { day: "Fri", share: 13.5, avgVolume: 129 },
    { day: "Sat", share: 3.2, avgVolume: 31 },
    { day: "Sun", share: 1.3, avgVolume: 12 }
  ],
  categoryBreakdown: [
    { category: "Electronics & Gadgets", percentage: 34.2, color: "#f59e0b" },
    { category: "Documents & Contracts", percentage: 22.5, color: "#38bdf8" },
    { category: "Apparel & Fashion", percentage: 18.9, color: "#a855f7" },
    { category: "Healthcare & Medical", percentage: 14.1, color: "#10b981" },
    { category: "Perishable Freight", percentage: 10.3, color: "#f97316" }
  ]
};
