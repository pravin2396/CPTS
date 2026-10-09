// Detailed seed shipments matching all Module 3 & Module 6 schema fields
export const DELIVERY_STATUSES = [
  "Pending",
  "Picked Up",
  "In Transit",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
  "Failed Delivery"
];

export const PARCEL_TYPES = [
  "Electronics & Gadgets",
  "Documents & Contracts",
  "Apparel & Fashion",
  "Healthcare & Medical",
  "Perishable Freight"
];

// Helper to construct realistic initial status histories
export const buildInitialHistory = (status, options = {}) => {
  const {
    origin = "Chicago, IL",
    destination = "Los Angeles, CA",
    date = "2026-10-06",
    updatedBy = "Dispatch Operations"
  } = options;

  switch (status) {
    case 'Pending':
    case 'Booked':
      return [
        {
          id: `hist-p-${Date.now()}-1`,
          status: 'Pending',
          timestamp: `${date} 08:30 AM`,
          location: `${origin} Sorting Hub`,
          remarks: 'Consignment manifest generated and awaiting warehouse pickup.',
          updatedBy
        }
      ];

    case 'Picked Up':
      return [
        {
          id: `hist-pu-${Date.now()}-2`,
          status: 'Picked Up',
          timestamp: `${date} 11:45 AM`,
          location: `${origin} Central Depot`,
          remarks: 'Courier retrieved package from pickup facility.',
          updatedBy: 'Courier Unit #104'
        },
        {
          id: `hist-pu-${Date.now()}-1`,
          status: 'Pending',
          timestamp: `${date} 08:15 AM`,
          location: `${origin} Logistics Terminal`,
          remarks: 'Consignment documentation accepted.',
          updatedBy
        }
      ];

    case 'In Transit':
      return [
        {
          id: `hist-it-${Date.now()}-3`,
          status: 'In Transit',
          timestamp: `${date} 04:20 PM`,
          location: `Inter-State Route 80 Gateway`,
          remarks: 'Freight scanned into linehaul transit container en route to destination.',
          updatedBy: 'Freight Dispatcher'
        },
        {
          id: `hist-it-${Date.now()}-2`,
          status: 'Picked Up',
          timestamp: `${date} 11:30 AM`,
          location: `${origin} Central Depot`,
          remarks: 'Package collected and sorted.',
          updatedBy: 'Courier Unit #104'
        },
        {
          id: `hist-it-${Date.now()}-1`,
          status: 'Pending',
          timestamp: `${date} 08:00 AM`,
          location: `${origin} Logistics Terminal`,
          remarks: 'Shipping manifest lodged.',
          updatedBy
        }
      ];

    case 'Out for Delivery':
      return [
        {
          id: `hist-ofd-${Date.now()}-4`,
          status: 'Out for Delivery',
          timestamp: `${date} 09:15 AM`,
          location: `${destination} Last-Mile Terminal`,
          remarks: 'Dispatched with courier for doorstep handover.',
          updatedBy: 'Delivery Courier Unit #702'
        },
        {
          id: `hist-ofd-${Date.now()}-3`,
          status: 'In Transit',
          timestamp: `${date} 03:40 AM`,
          location: `${destination} Regional Hub`,
          remarks: 'Arrived at destination sorting center.',
          updatedBy: 'Linehaul Logistics'
        },
        {
          id: `hist-ofd-${Date.now()}-2`,
          status: 'Picked Up',
          timestamp: `${date} 02:00 PM`,
          location: `${origin} Central Depot`,
          remarks: 'Consignment retrieved from consignor.',
          updatedBy: 'Courier Unit #104'
        },
        {
          id: `hist-ofd-${Date.now()}-1`,
          status: 'Pending',
          timestamp: `${date} 09:00 AM`,
          location: `${origin} Logistics Terminal`,
          remarks: 'Consignment booked.',
          updatedBy
        }
      ];

    case 'Delivered':
      return [
        {
          id: `hist-del-${Date.now()}-5`,
          status: 'Delivered',
          timestamp: `${date} 02:30 PM`,
          location: `${destination} Delivery Address`,
          remarks: 'Package signed and received by consignee.',
          updatedBy: 'Courier Unit #702'
        },
        {
          id: `hist-del-${Date.now()}-4`,
          status: 'Out for Delivery',
          timestamp: `${date} 09:00 AM`,
          location: `${destination} Last-Mile Terminal`,
          remarks: 'Out for final delivery delivery run.',
          updatedBy: 'Delivery Courier Unit #702'
        },
        {
          id: `hist-del-${Date.now()}-3`,
          status: 'In Transit',
          timestamp: `${date} 02:15 AM`,
          location: `Inter-State Gateway Hub`,
          remarks: 'Departed distribution center.',
          updatedBy: 'Freight Dispatcher'
        },
        {
          id: `hist-del-${Date.now()}-2`,
          status: 'Picked Up',
          timestamp: `${date} 11:30 AM`,
          location: `${origin} Central Depot`,
          remarks: 'Retrieved by pickup agent.',
          updatedBy: 'Courier Unit #104'
        },
        {
          id: `hist-del-${Date.now()}-1`,
          status: 'Pending',
          timestamp: `${date} 08:30 AM`,
          location: `${origin} Logistics Terminal`,
          remarks: 'Consignment manifest generated.',
          updatedBy
        }
      ];

    case 'Cancelled':
      return [
        {
          id: `hist-can-${Date.now()}-2`,
          status: 'Cancelled',
          timestamp: `${date} 10:45 AM`,
          location: `${origin} Dispatch Office`,
          remarks: 'Consignment cancelled upon request. Reason: Sender voided dispatch order.',
          updatedBy: 'Customer Service Desk'
        },
        {
          id: `hist-can-${Date.now()}-1`,
          status: 'Pending',
          timestamp: `${date} 08:00 AM`,
          location: `${origin} Logistics Terminal`,
          remarks: 'Consignment booked.',
          updatedBy
        }
      ];

    case 'Failed Delivery':
      return [
        {
          id: `hist-fail-${Date.now()}-5`,
          status: 'Failed Delivery',
          timestamp: `${date} 04:50 PM`,
          location: `${destination} Delivery Address`,
          remarks: 'Delivery attempt unsuccessful: Premises closed and consignee unreachable. Returned to depot.',
          updatedBy: 'Courier Unit #702'
        },
        {
          id: `hist-fail-${Date.now()}-4`,
          status: 'Out for Delivery',
          timestamp: `${date} 09:30 AM`,
          location: `${destination} Last-Mile Terminal`,
          remarks: 'Out with courier for delivery.',
          updatedBy: 'Courier Unit #702'
        },
        {
          id: `hist-fail-${Date.now()}-3`,
          status: 'In Transit',
          timestamp: `${date} 03:00 AM`,
          location: `${destination} Regional Hub`,
          remarks: 'In transit to last-mile station.',
          updatedBy: 'Freight Linehaul'
        },
        {
          id: `hist-fail-${Date.now()}-2`,
          status: 'Picked Up',
          timestamp: `${date} 01:20 PM`,
          location: `${origin} Central Depot`,
          remarks: 'Picked up from pickup terminal.',
          updatedBy: 'Courier Unit #104'
        },
        {
          id: `hist-fail-${Date.now()}-1`,
          status: 'Pending',
          timestamp: `${date} 08:10 AM`,
          location: `${origin} Logistics Terminal`,
          remarks: 'Manifest registered in system.',
          updatedBy
        }
      ];

    default:
      return [
        {
          id: `hist-def-${Date.now()}-1`,
          status: 'Pending',
          timestamp: `${date} 09:00 AM`,
          location: `${origin} Logistics Hub`,
          remarks: 'Consignment manifest generated.',
          updatedBy
        }
      ];
  }
};

export const INITIAL_DETAILED_SHIPMENTS = [
  {
    id: "TRK-982410",
    trackingNumber: "TRK-982410",
    senderName: "Marcus Sterling",
    receiverName: "Eleanor Vance",
    pickupAddress: "742 Evergreen Terrace, Springfield, IL 62704",
    deliveryAddress: "10880 Wilshire Blvd, Los Angeles, CA 90024",
    parcelWeight: 2.4,
    parcelType: "Electronics & Gadgets",
    shippingDate: "2026-10-06",
    expectedDeliveryDate: "2026-10-08",
    deliveryStatus: "In Transit",
    notes: "Fragile electronic server components.",
    statusHistory: buildInitialHistory("In Transit", {
      origin: "Springfield, IL",
      destination: "Los Angeles, CA",
      date: "2026-10-06",
      updatedBy: "Marcus Sterling"
    })
  },
  {
    id: "TRK-771923",
    trackingNumber: "TRK-771923",
    senderName: "Sophia Rodriguez",
    receiverName: "Liam O'Connor",
    pickupAddress: "450 Lexington Ave, New York, NY 10017",
    deliveryAddress: "300 S Biscayne Blvd, Miami, FL 33139",
    parcelWeight: 1.1,
    parcelType: "Apparel & Fashion",
    shippingDate: "2026-10-06",
    expectedDeliveryDate: "2026-10-07",
    deliveryStatus: "Pending",
    notes: "Signature required on delivery.",
    statusHistory: buildInitialHistory("Pending", {
      origin: "New York, NY",
      destination: "Miami, FL",
      date: "2026-10-06",
      updatedBy: "Sophia Rodriguez"
    })
  },
  {
    id: "TRK-554210",
    trackingNumber: "TRK-554210",
    senderName: "Global Tech Supplies",
    receiverName: "Dr. Aris Thorne",
    pickupAddress: "100 Technology Dr, San Jose, CA 95110",
    deliveryAddress: "500 Medical Center Dr, Ann Arbor, MI 48109",
    parcelWeight: 5.8,
    parcelType: "Healthcare & Medical",
    shippingDate: "2026-10-05",
    expectedDeliveryDate: "2026-10-07",
    deliveryStatus: "Delivered",
    notes: "Temperature controlled medical samples.",
    statusHistory: buildInitialHistory("Delivered", {
      origin: "San Jose, CA",
      destination: "Ann Arbor, MI",
      date: "2026-10-05",
      updatedBy: "Global Tech Supplies"
    })
  },
  {
    id: "TRK-339108",
    trackingNumber: "TRK-339108",
    senderName: "Chloe Bennett",
    receiverName: "Devon Clark",
    pickupAddress: "123 Peachtree St, Atlanta, GA 30303",
    deliveryAddress: "2100 Ross Ave, Dallas, TX 75201",
    parcelWeight: 0.8,
    parcelType: "Documents & Contracts",
    shippingDate: "2026-10-06",
    expectedDeliveryDate: "2026-10-09",
    deliveryStatus: "Picked Up",
    notes: "Urgent signed lease documents.",
    statusHistory: buildInitialHistory("Picked Up", {
      origin: "Atlanta, GA",
      destination: "Dallas, TX",
      date: "2026-10-06",
      updatedBy: "Chloe Bennett"
    })
  },
  {
    id: "TRK-442189",
    trackingNumber: "TRK-442189",
    senderName: "Pacific Imports Co.",
    receiverName: "Sophia Chen",
    pickupAddress: "1400 4th Ave, Seattle, WA 98101",
    deliveryAddress: "800 N Michigan Ave, Chicago, IL 60611",
    parcelWeight: 3.2,
    parcelType: "Perishable Freight",
    shippingDate: "2026-10-04",
    expectedDeliveryDate: "2026-10-06",
    deliveryStatus: "Delivered",
    notes: "Insulated perishable container.",
    statusHistory: buildInitialHistory("Delivered", {
      origin: "Seattle, WA",
      destination: "Chicago, IL",
      date: "2026-10-04",
      updatedBy: "Pacific Imports Co."
    })
  },
  {
    id: "TRK-881204",
    trackingNumber: "TRK-881204",
    senderName: "James Wilson Logistics",
    receiverName: "Robert Vance",
    pickupAddress: "200 S Wacker Dr, Chicago, IL 60606",
    deliveryAddress: "1111 Lincoln Rd, Miami Beach, FL 33139",
    parcelWeight: 4.5,
    parcelType: "Electronics & Gadgets",
    shippingDate: "2026-10-06",
    expectedDeliveryDate: "2026-10-08",
    deliveryStatus: "Out for Delivery",
    notes: "High priority commercial freight.",
    statusHistory: buildInitialHistory("Out for Delivery", {
      origin: "Chicago, IL",
      destination: "Miami Beach, FL",
      date: "2026-10-06",
      updatedBy: "James Wilson Logistics"
    })
  },
  {
    id: "TRK-229145",
    trackingNumber: "TRK-229145",
    senderName: "Austin Textile Mills",
    receiverName: "Maya Patel",
    pickupAddress: "500 Congress Ave, Austin, TX 78701",
    deliveryAddress: "900 3rd Ave, New York, NY 10022",
    parcelWeight: 6.0,
    parcelType: "Apparel & Fashion",
    shippingDate: "2026-10-03",
    expectedDeliveryDate: "2026-10-06",
    deliveryStatus: "Cancelled",
    notes: "Cancelled by consignor prior to route transit.",
    statusHistory: buildInitialHistory("Cancelled", {
      origin: "Austin, TX",
      destination: "New York, NY",
      date: "2026-10-03",
      updatedBy: "Austin Textile Mills"
    })
  },
  {
    id: "TRK-663812",
    trackingNumber: "TRK-663812",
    senderName: "Boston BioTech Labs",
    receiverName: "Oliver Queen",
    pickupAddress: "75 Kneeland St, Boston, MA 02111",
    deliveryAddress: "1200 Grand Ave, Phoenix, AZ 85007",
    parcelWeight: 1.4,
    parcelType: "Healthcare & Medical",
    shippingDate: "2026-10-05",
    expectedDeliveryDate: "2026-10-07",
    deliveryStatus: "Failed Delivery",
    notes: "Delivery attempt failed: Consignee unavailable / Gate locked.",
    statusHistory: buildInitialHistory("Failed Delivery", {
      origin: "Boston, MA",
      destination: "Phoenix, AZ",
      date: "2026-10-05",
      updatedBy: "Boston BioTech Labs"
    })
  }
];
