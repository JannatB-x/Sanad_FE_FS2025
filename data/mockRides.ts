// data/MockRides.ts
import { IRide, RideStatus } from "../types/ride.type";
import { POPULAR_LOCATIONS } from "../constants/KuwaitLocations";

// Helper function to get date strings
const getDateString = (daysAgo: number = 0, hoursAgo: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(date.getHours() - hoursAgo);
  return date.toISOString();
};

const getFutureDateString = (hoursFromNow: number): string => {
  const date = new Date();
  date.setHours(date.getHours() + hoursFromNow);
  return date.toISOString();
};

export const MOCK_RIDES: IRide[] = [
  // Active/In Progress Rides
  {
    _id: "ride_001",
    userId: "user_001",
    riderId: "rider_001",
    pickupLocation: {
      lat: 29.3759,
      lng: 47.9774,
      address: "Kuwait City, Block 1, Street 5",
      city: "Kuwait City",
    },
    dropoffLocation: {
      lat: 29.3797,
      lng: 47.9906,
      address: "Kuwait Towers, Arabian Gulf Street",
      city: "Kuwait City",
    },
    status: RideStatus.IN_PROGRESS,
    price: 8.5,
    distance: 2.3,
    duration: 12,
    startTime: getDateString(0, 1),
    needsWheelchair: false,
    passengers: 1,
    createdAt: getDateString(0, 2),
    rider: {
      _id: "rider_001",
      name: "Ahmed Al-Mansouri",
      profileImage: "https://i.pravatar.cc/150?img=12",
      vehicleInfo: {
        type: "Sedan",
        model: "Toyota Camry 2023",
        plateNumber: "12345",
        color: "White",
      },
      rating: 4.8,
    },
    user: {
      _id: "user_001",
      name: "Fatima Al-Sabah",
      profileImage: "https://i.pravatar.cc/150?img=47",
      emergencyContact: "Mohammed Al-Sabah",
      emergencyContactPhone: "+965 12345678",
    },
  },

  // Accepted Ride (Waiting for pickup)
  {
    _id: "ride_002",
    userId: "user_002",
    riderId: "rider_002",
    pickupLocation: {
      lat: 29.3344,
      lng: 48.0761,
      address: "Salmiya, Block 3, Street 10",
      city: "Salmiya",
    },
    dropoffLocation: {
      lat: 29.3377,
      lng: 48.0918,
      address: "Marina Mall, Arabian Gulf Street",
      city: "Salmiya",
    },
    status: RideStatus.ACCEPTED,
    price: 6.0,
    distance: 1.5,
    duration: 8,
    scheduledTime: getFutureDateString(1),
    needsWheelchair: true,
    wheelchairType: "Manual",
    passengers: 1,
    specialRequirements: "Please assist with wheelchair loading",
    createdAt: getDateString(0, 1),
    rider: {
      _id: "rider_002",
      name: "Khalid Al-Rashid",
      profileImage: "https://i.pravatar.cc/150?img=33",
      vehicleInfo: {
        type: "Wheelchair Accessible Van",
        model: "Mercedes Sprinter 2022",
        plateNumber: "67890",
        color: "Blue",
      },
      rating: 4.9,
    },
    user: {
      _id: "user_002",
      name: "Noura Al-Khaled",
      profileImage: "https://i.pravatar.cc/150?img=24",
      emergencyContact: "Sara Al-Khaled",
      emergencyContactPhone: "+965 23456789",
    },
  },

  // Requested Ride (No rider assigned yet)
  {
    _id: "ride_003",
    userId: "user_003",
    pickupLocation: {
      lat: 29.3069,
      lng: 47.9339,
      address: "The Avenues Mall, 5th Ring Road",
      city: "Rai",
    },
    dropoffLocation: {
      lat: 29.3333,
      lng: 48.0289,
      address: "Hawalli, Block 5, Street 20",
      city: "Hawalli",
    },
    status: RideStatus.REQUESTED,
    price: 12.5,
    distance: 8.2,
    duration: 25,
    scheduledTime: getFutureDateString(2),
    needsWheelchair: false,
    passengers: 2,
    createdAt: getDateString(0, 0.5),
    user: {
      _id: "user_003",
      name: "Omar Al-Fahad",
      profileImage: "https://i.pravatar.cc/150?img=15",
      emergencyContact: "Layla Al-Fahad",
      emergencyContactPhone: "+965 34567890",
    },
  },

  // Completed Ride (with rating)
  {
    _id: "ride_004",
    userId: "user_004",
    riderId: "rider_003",
    pickupLocation: {
      lat: 29.3094,
      lng: 48.0189,
      address: "Mubarak Al-Kabeer Hospital, Jabriya",
      city: "Jabriya",
    },
    dropoffLocation: {
      lat: 29.3011,
      lng: 48.087,
      address: "360 Mall, Al Zahra",
      city: "Al Zahra",
    },
    status: RideStatus.COMPLETED,
    price: 15.0,
    distance: 6.8,
    duration: 20,
    startTime: getDateString(1, 2),
    endTime: getDateString(1, 1),
    rating: 5,
    review: "Excellent service! Very professional and helpful driver.",
    needsWheelchair: false,
    passengers: 1,
    createdAt: getDateString(1, 3),
    updatedAt: getDateString(1, 1),
    rider: {
      _id: "rider_003",
      name: "Yusuf Al-Mutairi",
      profileImage: "https://i.pravatar.cc/150?img=51",
      vehicleInfo: {
        type: "SUV",
        model: "Nissan Pathfinder 2023",
        plateNumber: "11111",
        color: "Black",
      },
      rating: 4.7,
    },
    user: {
      _id: "user_004",
      name: "Mariam Al-Otaibi",
      profileImage: "https://i.pravatar.cc/150?img=32",
      emergencyContact: "Hassan Al-Otaibi",
      emergencyContactPhone: "+965 45678901",
    },
  },

  // Completed Ride (with patient bed)
  {
    _id: "ride_005",
    userId: "user_005",
    riderId: "rider_004",
    pickupLocation: {
      lat: 29.3792,
      lng: 47.9906,
      address: "Al-Amiri Hospital, Arabian Gulf Street",
      city: "Kuwait City",
    },
    dropoffLocation: {
      lat: 29.3736,
      lng: 47.9964,
      address: "Dasman Diabetes Institute, Al-Soor Street",
      city: "Kuwait City",
    },
    status: RideStatus.COMPLETED,
    price: 7.5,
    distance: 1.2,
    duration: 10,
    startTime: getDateString(2, 3),
    endTime: getDateString(2, 2),
    rating: 4,
    review: "Good service, but could be more careful with patient transfers.",
    needsPatientBed: true,
    passengers: 1,
    specialRequirements: "Patient requires stretcher and medical assistance",
    createdAt: getDateString(2, 4),
    updatedAt: getDateString(2, 2),
    rider: {
      _id: "rider_004",
      name: "Faisal Al-Shammari",
      profileImage: "https://i.pravatar.cc/150?img=28",
      vehicleInfo: {
        type: "Ambulance",
        model: "Mercedes Ambulance 2022",
        plateNumber: "22222",
        color: "White",
      },
      rating: 4.6,
    },
    user: {
      _id: "user_005",
      name: "Khalid Al-Mazrouei",
      profileImage: "https://i.pravatar.cc/150?img=19",
      emergencyContact: "Noor Al-Mazrouei",
      emergencyContactPhone: "+965 56789012",
    },
  },

  // Cancelled Ride
  {
    _id: "ride_006",
    userId: "user_006",
    pickupLocation: {
      lat: 29.2266,
      lng: 47.9689,
      address: "Kuwait International Airport",
      city: "Farwaniya",
    },
    dropoffLocation: {
      lat: 29.3753,
      lng: 47.9847,
      address: "Souk Al-Mubarakiya, Abdullah Al-Salem Street",
      city: "Kuwait City",
    },
    status: RideStatus.CANCELLED,
    price: 18.0,
    distance: 15.5,
    duration: 35,
    scheduledTime: getDateString(3, 2),
    needsWheelchair: false,
    passengers: 3,
    createdAt: getDateString(3, 3),
    updatedAt: getDateString(3, 2),
    user: {
      _id: "user_006",
      name: "Layla Al-Hashimi",
      profileImage: "https://i.pravatar.cc/150?img=45",
      emergencyContact: "Ali Al-Hashimi",
      emergencyContactPhone: "+965 67890123",
    },
  },

  // Completed Ride (Airport pickup)
  {
    _id: "ride_007",
    userId: "user_007",
    riderId: "rider_005",
    pickupLocation: {
      lat: 29.2266,
      lng: 47.9689,
      address: "Kuwait International Airport",
      city: "Farwaniya",
    },
    dropoffLocation: {
      lat: 29.3759,
      lng: 47.9774,
      address: "Kuwait City, Block 2, Street 8",
      city: "Kuwait City",
    },
    status: RideStatus.COMPLETED,
    price: 20.0,
    distance: 18.2,
    duration: 40,
    startTime: getDateString(4, 4),
    endTime: getDateString(4, 3),
    rating: 5,
    review: "Perfect! Driver was on time and very professional.",
    needsWheelchair: false,
    passengers: 2,
    specialRequirements: "Airport pickup with luggage assistance",
    createdAt: getDateString(4, 5),
    updatedAt: getDateString(4, 3),
    rider: {
      _id: "rider_005",
      name: "Majed Al-Ajmi",
      profileImage: "https://i.pravatar.cc/150?img=36",
      vehicleInfo: {
        type: "SUV",
        model: "Toyota Land Cruiser 2023",
        plateNumber: "33333",
        color: "Silver",
      },
      rating: 4.9,
    },
    user: {
      _id: "user_007",
      name: "Sara Al-Mutawa",
      profileImage: "https://i.pravatar.cc/150?img=22",
      emergencyContact: "Ahmed Al-Mutawa",
      emergencyContactPhone: "+965 78901234",
    },
  },

  // Scheduled Ride (Future)
  {
    _id: "ride_008",
    userId: "user_008",
    riderId: "rider_001",
    pickupLocation: {
      lat: 29.3544,
      lng: 48.0994,
      address: "Scientific Center, Arabian Gulf Street",
      city: "Salmiya",
    },
    dropoffLocation: {
      lat: 29.3377,
      lng: 48.0918,
      address: "Marina Mall, Arabian Gulf Street",
      city: "Salmiya",
    },
    status: RideStatus.ACCEPTED,
    price: 5.5,
    distance: 1.8,
    duration: 10,
    scheduledTime: getFutureDateString(24),
    needsWheelchair: true,
    wheelchairType: "Electric",
    passengers: 1,
    createdAt: getDateString(0, 12),
    rider: {
      _id: "rider_001",
      name: "Ahmed Al-Mansouri",
      profileImage: "https://i.pravatar.cc/150?img=12",
      vehicleInfo: {
        type: "Wheelchair Accessible Van",
        model: "Toyota Hiace 2022",
        plateNumber: "44444",
        color: "White",
      },
      rating: 4.8,
    },
    user: {
      _id: "user_008",
      name: "Hanan Al-Salem",
      profileImage: "https://i.pravatar.cc/150?img=38",
      emergencyContact: "Mohammed Al-Salem",
      emergencyContactPhone: "+965 89012345",
    },
  },

  // Completed Ride (Multiple passengers)
  {
    _id: "ride_009",
    userId: "user_009",
    riderId: "rider_006",
    pickupLocation: {
      lat: 29.2772,
      lng: 47.9586,
      address: "Farwaniya, Block 1, Street 15",
      city: "Farwaniya",
    },
    dropoffLocation: {
      lat: 29.3069,
      lng: 47.9339,
      address: "The Avenues Mall, 5th Ring Road",
      city: "Rai",
    },
    status: RideStatus.COMPLETED,
    price: 10.0,
    distance: 4.5,
    duration: 18,
    startTime: getDateString(5, 5),
    endTime: getDateString(5, 4),
    rating: 4,
    needsWheelchair: false,
    passengers: 4,
    createdAt: getDateString(5, 6),
    updatedAt: getDateString(5, 4),
    rider: {
      _id: "rider_006",
      name: "Nasser Al-Dosari",
      profileImage: "https://i.pravatar.cc/150?img=42",
      vehicleInfo: {
        type: "Van",
        model: "Ford Transit 2023",
        plateNumber: "55555",
        color: "Gray",
      },
      rating: 4.5,
    },
    user: {
      _id: "user_009",
      name: "Rana Al-Ghanim",
      profileImage: "https://i.pravatar.cc/150?img=29",
      emergencyContact: "Tariq Al-Ghanim",
      emergencyContactPhone: "+965 90123456",
    },
  },

  // Requested Ride (Urgent - no scheduled time)
  {
    _id: "ride_010",
    userId: "user_010",
    pickupLocation: {
      lat: 29.27,
      lng: 47.94,
      address: "Farwaniya Hospital",
      city: "Farwaniya",
    },
    dropoffLocation: {
      lat: 29.3333,
      lng: 48.0289,
      address: "Hawalli, Block 8, Street 25",
      city: "Hawalli",
    },
    status: RideStatus.REQUESTED,
    price: 14.0,
    distance: 9.8,
    duration: 28,
    needsWheelchair: true,
    wheelchairType: "Manual",
    passengers: 1,
    specialRequirements: "Urgent medical appointment - please arrive quickly",
    createdAt: getDateString(0, 0.25),
    user: {
      _id: "user_010",
      name: "Amira Al-Rashid",
      profileImage: "https://i.pravatar.cc/150?img=41",
      emergencyContact: "Khalid Al-Rashid",
      emergencyContactPhone: "+965 01234567",
    },
  },
];

// Helper functions to filter mock rides
export const getMockRidesByStatus = (status: RideStatus): IRide[] => {
  return MOCK_RIDES.filter((ride) => ride.status === status);
};

export const getMockRideById = (id: string): IRide | undefined => {
  return MOCK_RIDES.find((ride) => ride._id === id);
};

export const getMockRidesByUserId = (userId: string): IRide[] => {
  return MOCK_RIDES.filter((ride) => ride.userId === userId);
};

export const getMockRidesByRiderId = (riderId: string): IRide[] => {
  return MOCK_RIDES.filter((ride) => ride.riderId === riderId);
};

export const getUpcomingMockRides = (): IRide[] => {
  const now = new Date();
  return MOCK_RIDES.filter((ride) => {
    if (!ride.scheduledTime) return false;
    return new Date(ride.scheduledTime) > now;
  });
};

export const getCompletedMockRides = (): IRide[] => {
  return MOCK_RIDES.filter((ride) => ride.status === RideStatus.COMPLETED);
};
