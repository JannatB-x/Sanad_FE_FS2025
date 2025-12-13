import instance from "./index";
import type { DriverInfo } from "../types/driverInfo";

// Backend driver endpoints
// POST /api/drivers/register
// POST /api/drivers/available
// POST /api/drivers/location
// GET /api/drivers/nearby-rides
// PUT /api/drivers/ride/:rideId/accept
// PUT /api/drivers/ride/:rideId/start
// PUT /api/drivers/ride/:rideId/complete
// GET /api/drivers/earnings

interface RegisterDriverPayload {
  userId: string;
  licenseNumber: string;
  vehicleInfo: string;
  isAvailable?: boolean;
  earnings?: number;
  rating?: number;
}

interface UpdateLocationPayload {
  latitude: number;
  longitude: number;
}

const registerDriver = async (payload: RegisterDriverPayload) => {
  const { data } = await instance.post("/drivers/register", payload);
  return data;
};

const toggleAvailability = async () => {
  const { data } = await instance.post("/drivers/available");
  return data;
};

const updateLocation = async (payload: UpdateLocationPayload) => {
  const { data } = await instance.post("/drivers/location", payload);
  return data;
};

const getNearbyRides = async () => {
  const { data } = await instance.get("/drivers/nearby-rides");
  return data.rides || data;
};

const acceptRide = async (rideId: string) => {
  const { data } = await instance.put(`/drivers/ride/${rideId}/accept`);
  return data.ride || data;
};

const startRide = async (rideId: string) => {
  const { data } = await instance.put(`/drivers/ride/${rideId}/start`);
  return data.ride || data;
};

const completeRide = async (rideId: string) => {
  const { data } = await instance.put(`/drivers/ride/${rideId}/complete`);
  return data.ride || data;
};

const getEarnings = async () => {
  const { data } = await instance.get("/drivers/earnings");
  return data;
};

export {
  registerDriver,
  toggleAvailability,
  updateLocation,
  getNearbyRides,
  acceptRide,
  startRide,
  completeRide,
  getEarnings,
};

