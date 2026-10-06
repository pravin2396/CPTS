// Seed logistics data for CPTS Module 2 Dashboard
export const INITIAL_DASHBOARD_DATA = {
  shipments: [
    {
      id: "TRK-982410",
      trackingNumber: "TRK-982410",
      recipient: "Eleanor Vance",
      destination: "Los Angeles, CA",
      status: "In Transit", // 'Delivered', 'In Transit', 'Pending', 'Booked'
      date: "2026-10-06T08:30:00Z",
      type: "Express Air",
      weight: "2.4 kg"
    },
    {
      id: "TRK-771923",
      trackingNumber: "TRK-771923",
      recipient: "Liam O'Connor",
      destination: "Miami, FL",
      status: "Pending",
      date: "2026-10-06T09:15:00Z",
      type: "Priority Overnight",
      weight: "1.1 kg"
    },
    {
      id: "TRK-554210",
      trackingNumber: "TRK-554210",
      recipient: "Dr. Aris Thorne",
      destination: "Ann Arbor, MI",
      status: "Delivered",
      date: "2026-10-05T14:20:00Z",
      type: "Standard Ground",
      weight: "5.8 kg"
    },
    {
      id: "TRK-339108",
      trackingNumber: "TRK-339108",
      recipient: "Devon Clark",
      destination: "Dallas, TX",
      status: "Pending",
      date: "2026-10-06T07:45:00Z",
      type: "Express Air",
      weight: "0.8 kg"
    },
    {
      id: "TRK-442189",
      trackingNumber: "TRK-442189",
      recipient: "Sophia Chen",
      destination: "Seattle, WA",
      status: "Delivered",
      date: "2026-10-05T11:10:00Z",
      type: "Standard Ground",
      weight: "3.2 kg"
    },
    {
      id: "TRK-881204",
      trackingNumber: "TRK-881204",
      recipient: "James Wilson",
      destination: "Chicago, IL",
      status: "In Transit",
      date: "2026-10-06T06:50:00Z",
      type: "Express Air",
      weight: "4.5 kg"
    },
    {
      id: "TRK-229145",
      recipient: "Maya Patel",
      trackingNumber: "TRK-229145",
      destination: "Austin, TX",
      status: "Delivered",
      date: "2026-10-04T16:40:00Z",
      type: "Eco Surface",
      weight: "6.0 kg"
    },
    {
      id: "TRK-663812",
      trackingNumber: "TRK-663812",
      recipient: "Oliver Queen",
      destination: "Boston, MA",
      status: "Delivered",
      date: "2026-10-04T10:15:00Z",
      type: "Priority Overnight",
      weight: "1.4 kg"
    }
  ],
  customersCount: 148,
  recentActivities: [
    {
      id: "act-1",
      action: "Parcel Dispatched",
      description: "TRK-982410 departed from Denver Regional Sorting Facility.",
      time: "10 mins ago",
      type: "transit"
    },
    {
      id: "act-2",
      action: "Delivery Successful",
      description: "TRK-554210 delivered to Reception & signed by Dr. Thorne.",
      time: "45 mins ago",
      type: "success"
    },
    {
      id: "act-3",
      action: "New Booking Created",
      description: "TRK-771923 registered for Priority Overnight dispatch.",
      time: "2 hours ago",
      type: "booking"
    },
    {
      id: "act-4",
      action: "Checkpoint Scanned",
      description: "TRK-881204 scanned at Chicago Cross-Dock Terminal.",
      time: "3 hours ago",
      type: "transit"
    },
    {
      id: "act-5",
      action: "New Customer Onboarded",
      description: "Apex Global Logistics account activated with 15 scheduled parcels.",
      time: "5 hours ago",
      type: "user"
    }
  ]
};
