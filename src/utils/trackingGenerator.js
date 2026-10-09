/**
 * Generates realistic dummy tracking telemetry, timeline history, and live location
 * based on the shipment's origin, destination, shipping dates, and current status.
 */

export const generateTrackingDetails = (shipment) => {
  if (!shipment) return null;

  const {
    id,
    trackingNumber,
    senderName,
    receiverName,
    pickupAddress,
    deliveryAddress,
    parcelType,
    parcelWeight,
    shippingDate,
    expectedDeliveryDate,
    deliveryStatus,
    notes
  } = shipment;

  // Extract cities from addresses or provide fallbacks
  const originCity = pickupAddress ? pickupAddress.split(',')[1]?.trim() || pickupAddress.split(',')[0]?.trim() || 'Chicago, IL' : 'Origin Hub';
  const destCity = deliveryAddress ? deliveryAddress.split(',')[1]?.trim() || deliveryAddress.split(',')[0]?.trim() || 'Los Angeles, CA' : 'Destination Hub';

  // Determine transit percentage and current dummy location based on status
  let progressPercentage = 20;
  let currentLocation = `${originCity} Sorting Dock Alpha`;
  let carrierVehicle = 'Van #DP-104';
  let estimatedDaysLeft = 2;

  const normalizedStatus = deliveryStatus === 'Booked' ? 'Pending' : deliveryStatus;

  switch (normalizedStatus) {
    case 'Delivered':
      progressPercentage = 100;
      currentLocation = `${deliveryAddress} (Signed & Delivered)`;
      carrierVehicle = 'Courier Final Handover';
      estimatedDaysLeft = 0;
      break;
    case 'Out for Delivery':
      progressPercentage = 85;
      currentLocation = `${destCity} Local Dispatch Area (Out with Courier)`;
      carrierVehicle = 'Courier Express Van #DP-702';
      estimatedDaysLeft = 0;
      break;
    case 'In Transit':
      progressPercentage = 60;
      currentLocation = `Regional Inter-State Hub En Route to ${destCity}`;
      carrierVehicle = 'Freight Line-Haul Truck #DP-514';
      estimatedDaysLeft = 1;
      break;
    case 'Picked Up':
      progressPercentage = 40;
      currentLocation = `${originCity} Central Freight Gateway`;
      carrierVehicle = 'Pickup Fleet Truck #DP-211';
      estimatedDaysLeft = 2;
      break;
    case 'Cancelled':
      progressPercentage = 0;
      currentLocation = `${originCity} Terminal (Consignment Cancelled)`;
      carrierVehicle = 'Dispatch Voided';
      estimatedDaysLeft = 'Cancelled';
      break;
    case 'Failed Delivery':
      progressPercentage = 85;
      currentLocation = `${destCity} Local Terminal (Delivery Attempt Failed - Returned to Depot)`;
      carrierVehicle = 'Exception Hold Bay 2';
      estimatedDaysLeft = 1;
      break;
    case 'Pending':
    default:
      progressPercentage = 15;
      currentLocation = `${originCity} Dispatch Facility (Awaiting Collection)`;
      carrierVehicle = 'Assigned Facility Bay 4';
      estimatedDaysLeft = 3;
      break;
  }

  // Construct realistic chronological tracking checkpoint history
  const STAGES = [
    {
      key: 'Booked',
      title: 'Consignment Registered',
      description: `Shipment documentation validated & electronic manifest lodged by ${senderName}.`,
      location: `${originCity} Logistics Terminal`,
      date: shippingDate || '2026-10-06',
      time: '08:15 AM'
    },
    {
      key: 'Picked Up',
      title: 'Package Collected from Consignor',
      description: `Courier retrieved parcel from pickup dock at ${pickupAddress}.`,
      location: `${originCity} Local Depot`,
      date: shippingDate || '2026-10-06',
      time: '11:40 AM'
    },
    {
      key: 'In Transit',
      title: 'Departed Regional Distribution Center',
      description: `Package sorted and scanned into inter-hub linehaul container.`,
      location: `Regional Sorting Gateway (${originCity})`,
      date: shippingDate || '2026-10-06',
      time: '04:30 PM'
    },
    {
      key: 'Out for Delivery',
      title: 'Dispatched for Final Delivery',
      description: `Consignment transferred to local delivery courier for handover to ${receiverName}.`,
      location: `${destCity} Final-Mile Delivery Hub`,
      date: expectedDeliveryDate || '2026-10-08',
      time: '08:45 AM'
    },
    {
      key: 'Delivered',
      title: 'Delivered & Consignee Signed',
      description: `Package received in good condition and acknowledged by consignee.`,
      location: `${deliveryAddress}`,
      date: expectedDeliveryDate || '2026-10-08',
      time: '02:15 PM'
    }
  ];

  const statusOrder = ['Pending', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'];
  let effectiveStatus = deliveryStatus === 'Booked' ? 'Pending' : deliveryStatus;
  if (effectiveStatus === 'Failed Delivery') effectiveStatus = 'Out for Delivery';
  if (effectiveStatus === 'Cancelled') effectiveStatus = 'Pending';
  
  const currentIndex = statusOrder.indexOf(effectiveStatus);

  // If shipment has custom audit statusHistory recorded, format it into timeline stages
  const history = (Array.isArray(shipment.statusHistory) && shipment.statusHistory.length > 0)
    ? [...shipment.statusHistory].reverse().map((entry, idx, arr) => ({
        key: entry.status,
        title: `${entry.status} Checkpoint`,
        description: entry.remarks,
        location: entry.location,
        date: entry.timestamp.split(' ')[0] || shippingDate || '2026-10-06',
        time: entry.timestamp.split(' ').slice(1).join(' ') || '12:00 PM',
        isCompleted: true,
        isCurrent: idx === arr.length - 1,
        status: idx === arr.length - 1 ? 'in-progress' : 'completed'
      }))
    : STAGES.map((step, idx) => {
        const isCompleted = currentIndex >= idx;
        const isCurrent = currentIndex === idx;
        return {
          ...step,
          isCompleted,
          isCurrent,
          status: isCompleted ? (isCurrent ? 'in-progress' : 'completed') : 'upcoming'
        };
      });

  return {
    ...shipment,
    progressPercentage,
    currentLocation,
    carrierVehicle,
    estimatedDaysLeft,
    carrierService: 'DropPoint Express Freight (Priority Air & Ground)',
    gpsTelemetry: {
      latitude: '39.7392° N',
      longitude: '104.9903° W',
      speed: deliveryStatus === 'In Transit' ? '68 mph' : '0 mph',
      altitude: '5,280 ft',
      temperature: '18°C (Monitored)'
    },
    history
  };
};
