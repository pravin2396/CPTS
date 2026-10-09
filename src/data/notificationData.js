// Initial seed notifications demonstrating Module 7 requirements
export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-001",
    type: "FAILED_DELIVERY",
    title: "Failed Delivery Alert",
    message: "Delivery attempt failed for TRK-663812 at Phoenix, AZ. Reason: Security gate locked and consignee unreachable. Parcel held at local depot.",
    trackingNumber: "TRK-663812",
    recipient: "Oliver Queen",
    timestamp: "2026-10-08T08:50:00.000Z",
    formattedTime: "Oct 08, 2026 • 04:50 PM",
    isRead: false,
    priority: "high",
    category: "Failed Delivery Alert"
  },
  {
    id: "notif-002",
    type: "DELIVERY_COMPLETED",
    title: "Delivery Completed Successfully",
    message: "Consignment TRK-554210 delivered & signed by Dr. Aris Thorne at Medical Center Dr, Ann Arbor, MI.",
    trackingNumber: "TRK-554210",
    recipient: "Dr. Aris Thorne",
    timestamp: "2026-10-08T07:30:00.000Z",
    formattedTime: "Oct 08, 2026 • 02:30 PM",
    isRead: false,
    priority: "success",
    category: "Delivery Completed Notification"
  },
  {
    id: "notif-003",
    type: "STATUS_UPDATED",
    title: "Delivery Status Update: Out for Delivery",
    message: "Consignment TRK-881204 has been loaded on courier van for final-mile delivery in Miami Beach, FL.",
    trackingNumber: "TRK-881204",
    recipient: "Robert Vance",
    timestamp: "2026-10-08T06:15:00.000Z",
    formattedTime: "Oct 08, 2026 • 09:15 AM",
    isRead: false,
    priority: "normal",
    category: "Delivery Status Update Notification"
  },
  {
    id: "notif-004",
    type: "SHIPMENT_CREATED",
    title: "New Shipment Manifest Created",
    message: "New shipment manifest TRK-982410 registered: Marcus Sterling (Springfield, IL) → Eleanor Vance (Los Angeles, CA).",
    trackingNumber: "TRK-982410",
    recipient: "Eleanor Vance",
    timestamp: "2026-10-08T05:00:00.000Z",
    formattedTime: "Oct 08, 2026 • 08:30 AM",
    isRead: false,
    priority: "normal",
    category: "Shipment Created Notification"
  },
  {
    id: "notif-005",
    type: "STATUS_UPDATED",
    title: "Delivery Status Update: Picked Up",
    message: "Consignment TRK-339108 retrieved by courier from consignor facility in Atlanta, GA.",
    trackingNumber: "TRK-339108",
    recipient: "Devon Clark",
    timestamp: "2026-10-07T11:45:00.000Z",
    formattedTime: "Oct 07, 2026 • 11:45 AM",
    isRead: true,
    priority: "normal",
    category: "Delivery Status Update Notification"
  },
  {
    id: "notif-006",
    type: "DELIVERY_COMPLETED",
    title: "Delivery Completed & Acknowledged",
    message: "Consignment TRK-442189 handed over and acknowledged by Sophia Chen in Chicago, IL.",
    trackingNumber: "TRK-442189",
    recipient: "Sophia Chen",
    timestamp: "2026-10-06T14:20:00.000Z",
    formattedTime: "Oct 06, 2026 • 02:20 PM",
    isRead: true,
    priority: "success",
    category: "Delivery Completed Notification"
  }
];

export const NOTIFICATION_CATEGORIES = [
  "ALL",
  "UNREAD",
  "SHIPMENT_CREATED",
  "STATUS_UPDATED",
  "DELIVERY_COMPLETED",
  "FAILED_DELIVERY"
];
