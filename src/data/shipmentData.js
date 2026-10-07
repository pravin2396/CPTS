// Detailed seed shipments matching all Module 3 schema fields
export const INITIAL_DETAILED_SHIPMENTS = [
  {
    id: "TRK-982410",
    trackingNumber: "TRK-982410",
    senderName: "Marcus Sterling",
    receiverName: "Eleanor Vance",
    pickupAddress: "742 Evergreen Terrace, Springfield, IL 62704",
    deliveryAddress: "10880 Wilshire Blvd, Los Angeles, CA 90024",
    parcelWeight: 2.4, // kg
    parcelType: "Electronics & Gadgets", // 'Electronics & Gadgets', 'Documents & Contracts', 'Apparel & Fashion', 'Healthcare & Medical', 'Perishable Freight'
    shippingDate: "2026-10-06",
    expectedDeliveryDate: "2026-10-08",
    deliveryStatus: "In Transit", // 'Booked', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'
    notes: "Fragile electronic server components."
  },
  {
    id: "TRK-771923",
    trackingNumber: "TRK-771923",
    senderName: "Sophia Rodriguez",
    receiverName: "Liam O'Connor",
    pickupAddress: "450 Lexington Ave, New York, NY 10017",
    deliveryAddress: "300 S Biscayne Blvd, Miami, FL 33131",
    parcelWeight: 1.1,
    parcelType: "Apparel & Fashion",
    shippingDate: "2026-10-06",
    expectedDeliveryDate: "2026-10-07",
    deliveryStatus: "Booked",
    notes: "Signature required on delivery."
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
    notes: "Temperature controlled medical samples."
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
    notes: "Urgent signed lease documents."
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
    notes: "Insulated perishable container."
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
    notes: "High priority commercial freight."
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
    deliveryStatus: "Delivered",
    notes: "Heavy garment consignment."
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
    deliveryStatus: "In Transit",
    notes: "Direct lab equipment express."
  }
];

export const PARCEL_TYPES = [
  "Electronics & Gadgets",
  "Documents & Contracts",
  "Apparel & Fashion",
  "Healthcare & Medical",
  "Perishable Freight"
];

export const DELIVERY_STATUSES = [
  "Booked",
  "Picked Up",
  "In Transit",
  "Out for Delivery",
  "Delivered"
];
