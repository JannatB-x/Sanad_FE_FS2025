// data/mockRiders.ts
import { IRider, IVehicleInfo } from "../types/rider.type";
import { ILocation } from "../types/location.type";

// Helper function to get date strings
const getDateString = (daysAgo: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export const MOCK_RIDERS: IRider[] = [
  // Standard Sedan Rider
  {
    _id: "rider_001",
    userId: "user_rider_001",
    licenseNumber: "DL-2023-12345",
    vehicleInfo: {
      type: "Sedan",
      model: "Toyota Camry 2023",
      plateNumber: "12345",
      color: "White",
      year: 2023,
      image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6",
    },
    currentLocation: {
      lat: 29.3759,
      lng: 47.9774,
      address: "Kuwait City, Block 1, Street 5",
    },
    isAvailable: true,
    rating: 4.8,
    totalRides: 245,
    earnings: 12500.0,
    createdAt: getDateString(365),
    updatedAt: getDateString(0),
  },

  // Wheelchair Accessible Van Rider
  {
    _id: "rider_002",
    userId: "user_rider_002",
    licenseNumber: "DL-2022-67890",
    vehicleInfo: {
      type: "Wheelchair Accessible Van",
      model: "Mercedes Sprinter 2022",
      plateNumber: "67890",
      color: "Blue",
      year: 2022,
      image: "https://images.unsplash.com/photo-1617531653332-bd46c24cf206",
    },
    currentLocation: {
      lat: 29.3344,
      lng: 48.0761,
      address: "Salmiya, Block 3, Street 10",
    },
    isAvailable: true,
    rating: 4.9,
    totalRides: 189,
    earnings: 15200.0,
    createdAt: getDateString(400),
    updatedAt: getDateString(0),
  },

  // SUV Rider
  {
    _id: "rider_003",
    userId: "user_rider_003",
    licenseNumber: "DL-2023-11111",
    vehicleInfo: {
      type: "SUV",
      model: "Nissan Pathfinder 2023",
      plateNumber: "11111",
      color: "Black",
      year: 2023,
      image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6",
    },
    currentLocation: {
      lat: 29.3069,
      lng: 47.9339,
      address: "The Avenues Mall, 5th Ring Road",
    },
    isAvailable: false,
    rating: 4.7,
    totalRides: 312,
    earnings: 18900.0,
    createdAt: getDateString(500),
    updatedAt: getDateString(0),
  },

  // Ambulance/Medical Transport Rider
  {
    _id: "rider_004",
    userId: "user_rider_004",
    licenseNumber: "DL-2022-22222",
    vehicleInfo: {
      type: "Ambulance",
      model: "Mercedes Ambulance 2022",
      plateNumber: "22222",
      color: "White",
      year: 2022,
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54",
    },
    currentLocation: {
      lat: 29.3792,
      lng: 47.9906,
      address: "Al-Amiri Hospital, Arabian Gulf Street",
    },
    isAvailable: true,
    rating: 4.6,
    totalRides: 156,
    earnings: 21000.0,
    companyId: "company_001",
    createdAt: getDateString(300),
    updatedAt: getDateString(0),
  },

  // Luxury SUV Rider
  {
    _id: "rider_005",
    userId: "user_rider_005",
    licenseNumber: "DL-2023-33333",
    vehicleInfo: {
      type: "SUV",
      model: "Toyota Land Cruiser 2023",
      plateNumber: "33333",
      color: "Silver",
      year: 2023,
      image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6",
    },
    currentLocation: {
      lat: 29.2266,
      lng: 47.9689,
      address: "Kuwait International Airport",
    },
    isAvailable: true,
    rating: 4.9,
    totalRides: 278,
    earnings: 22500.0,
    createdAt: getDateString(450),
    updatedAt: getDateString(0),
  },

  // Wheelchair Accessible Van (Electric Wheelchair)
  {
    _id: "rider_006",
    userId: "user_rider_006",
    licenseNumber: "DL-2021-44444",
    vehicleInfo: {
      type: "Wheelchair Accessible Van",
      model: "Toyota Hiace 2021",
      plateNumber: "44444",
      color: "White",
      year: 2021,
      image: "https://images.unsplash.com/photo-1617531653332-bd46c24cf206",
    },
    currentLocation: {
      lat: 29.3544,
      lng: 48.0994,
      address: "Scientific Center, Arabian Gulf Street",
    },
    isAvailable: true,
    rating: 4.8,
    totalRides: 201,
    earnings: 16800.0,
    createdAt: getDateString(600),
    updatedAt: getDateString(0),
  },

  // Van Rider (Multiple Passengers)
  {
    _id: "rider_007",
    userId: "user_rider_007",
    licenseNumber: "DL-2022-55555",
    vehicleInfo: {
      type: "Van",
      model: "Ford Transit 2022",
      plateNumber: "55555",
      color: "Gray",
      year: 2022,
      image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6",
    },
    currentLocation: {
      lat: 29.2772,
      lng: 47.9586,
      address: "Farwaniya, Block 1, Street 15",
    },
    isAvailable: true,
    rating: 4.5,
    totalRides: 167,
    earnings: 11200.0,
    createdAt: getDateString(350),
    updatedAt: getDateString(0),
  },

  // Standard Sedan Rider (Unavailable)
  {
    _id: "rider_008",
    userId: "user_rider_008",
    licenseNumber: "DL-2023-66666",
    vehicleInfo: {
      type: "Sedan",
      model: "Honda Accord 2023",
      plateNumber: "66666",
      color: "Red",
      year: 2023,
      image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6",
    },
    currentLocation: {
      lat: 29.3333,
      lng: 48.0289,
      address: "Hawalli, Block 5, Street 20",
    },
    isAvailable: false,
    rating: 4.4,
    totalRides: 98,
    earnings: 5600.0,
    createdAt: getDateString(200),
    updatedAt: getDateString(0),
  },

  // Medical Transport Specialist
  {
    _id: "rider_009",
    userId: "user_rider_009",
    licenseNumber: "DL-2021-77777",
    vehicleInfo: {
      type: "Medical Transport",
      model: "Ford E-Series Ambulance 2021",
      plateNumber: "77777",
      color: "White",
      year: 2021,
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54",
    },
    currentLocation: {
      lat: 29.3094,
      lng: 48.0189,
      address: "Mubarak Al-Kabeer Hospital, Jabriya",
    },
    isAvailable: true,
    rating: 4.7,
    totalRides: 134,
    earnings: 19800.0,
    companyId: "company_001",
    createdAt: getDateString(550),
    updatedAt: getDateString(0),
  },

  // Premium Sedan Rider
  {
    _id: "rider_010",
    userId: "user_rider_010",
    licenseNumber: "DL-2023-88888",
    vehicleInfo: {
      type: "Sedan",
      model: "BMW 5 Series 2023",
      plateNumber: "88888",
      color: "Black",
      year: 2023,
      image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6",
    },
    currentLocation: {
      lat: 29.3377,
      lng: 48.0918,
      address: "Marina Mall, Arabian Gulf Street",
    },
    isAvailable: true,
    rating: 4.9,
    totalRides: 189,
    earnings: 24500.0,
    createdAt: getDateString(180),
    updatedAt: getDateString(0),
  },

  // Wheelchair Accessible Van (Manual Wheelchair)
  {
    _id: "rider_011",
    userId: "user_rider_011",
    licenseNumber: "DL-2022-99999",
    vehicleInfo: {
      type: "Wheelchair Accessible Van",
      model: "Ram ProMaster 2022",
      plateNumber: "99999",
      color: "Blue",
      year: 2022,
      image: "https://images.unsplash.com/photo-1617531653332-bd46c24cf206",
    },
    currentLocation: {
      lat: 29.27,
      lng: 47.94,
      address: "Farwaniya Hospital",
    },
    isAvailable: true,
    rating: 4.6,
    totalRides: 145,
    earnings: 14200.0,
    createdAt: getDateString(250),
    updatedAt: getDateString(0),
  },

  // Compact Car Rider
  {
    _id: "rider_012",
    userId: "user_rider_012",
    licenseNumber: "DL-2023-00000",
    vehicleInfo: {
      type: "Compact",
      model: "Toyota Corolla 2023",
      plateNumber: "00000",
      color: "Silver",
      year: 2023,
      image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6",
    },
    currentLocation: {
      lat: 29.3011,
      lng: 48.087,
      address: "360 Mall, Al Zahra",
    },
    isAvailable: true,
    rating: 4.3,
    totalRides: 76,
    earnings: 4200.0,
    createdAt: getDateString(120),
    updatedAt: getDateString(0),
  },
];

// Helper functions to filter mock riders
export const getMockRiderById = (id: string): IRider | undefined => {
  return MOCK_RIDERS.find((rider) => rider._id === id);
};

export const getMockRidersByAvailability = (available: boolean): IRider[] => {
  return MOCK_RIDERS.filter((rider) => rider.isAvailable === available);
};

export const getAvailableMockRiders = (): IRider[] => {
  return MOCK_RIDERS.filter((rider) => rider.isAvailable === true);
};

export const getMockRidersByCompany = (companyId: string): IRider[] => {
  return MOCK_RIDERS.filter((rider) => rider.companyId === companyId);
};

export const getMockRidersByVehicleType = (type: string): IRider[] => {
  return MOCK_RIDERS.filter(
    (rider) => rider.vehicleInfo.type.toLowerCase() === type.toLowerCase()
  );
};

export const getNearbyMockRiders = (
  location: ILocation,
  radiusKm: number = 5
): IRider[] => {
  // Simple distance calculation (Haversine formula would be more accurate)
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in km

  return MOCK_RIDERS.filter((rider) => {
    if (!rider.currentLocation) return false;

    const dLat = toRad(rider.currentLocation.lat - location.lat);
    const dLon = toRad(rider.currentLocation.lng - location.lng);
    const lat1 = toRad(location.lat);
    const lat2 = toRad(rider.currentLocation.lat);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance <= radiusKm && rider.isAvailable;
  });
};

export const getTopRatedMockRiders = (limit: number = 5): IRider[] => {
  return MOCK_RIDERS.filter((rider) => rider.rating !== undefined)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, limit);
};

export const getMockRidersByMinRating = (minRating: number): IRider[] => {
  return MOCK_RIDERS.filter(
    (rider) => rider.rating !== undefined && (rider.rating || 0) >= minRating
  );
};
