import instance from "./index";
import type { Ride, RideRequest } from "../types/rideTypes";

// Backend ride endpoints: GET /, GET /:id, POST /, PUT /:id, DELETE /:id
// Additional functions in controller: requestRide, getRideHistory, estimateFare (not in router yet)

const getRides = async (): Promise<Ride[]> => {
  const { data } = await instance.get("/rides");
  return data.rides || data;
};

const getRide = async (id: string): Promise<Ride> => {
  const { data } = await instance.get(`/rides/${id}`);
  return data.ride || data;
};

const createRide = async (ride: Ride): Promise<Ride> => {
  const { data } = await instance.post("/rides", ride);
  return data.newRide || data.ride || data;
};

const updateRide = async (id: string, ride: Partial<Ride>): Promise<Ride> => {
  const { data } = await instance.put(`/rides/${id}`, ride);
  return data.ride || data;
};

const deleteRide = async (id: string): Promise<void> => {
  await instance.delete(`/rides/${id}`);
};

// Request a ride (backend has this in controller but not in router)
const requestRide = async (rideRequest: {
  pickup: { address: string; latitude: number; longitude: number };
  dropoff: { address: string; latitude: number; longitude: number };
  paymentMethod: string;
}): Promise<Ride> => {
  // TODO: Backend needs to add POST /api/rides/request route
  const { data } = await instance.post("/rides/request", rideRequest);
  return data.ride || data;
};

// Get ride history (backend has this in controller but not in router)
const getRideHistory = async (): Promise<Ride[]> => {
  // TODO: Backend needs to add GET /api/rides/history route
  const { data } = await instance.get("/rides/history");
  return data.rides || data;
};

// Estimate fare (backend has this in controller but not in router)
const estimateFare = async (
  pickup: {
    latitude: number;
    longitude: number;
  },
  dropoff: {
    latitude: number;
    longitude: number;
  }
) => {
  // TODO: Backend needs to add POST /api/rides/estimate route
  const { data } = await instance.post("/rides/estimate", { pickup, dropoff });
  return data.estimate || data;
};

// Legacy ride request endpoints (may not be in backend)
const getRideRequests = async (): Promise<RideRequest[]> => {
  // Use getRides and filter by status
  const rides = await getRides();
  return rides
    .filter((ride) => ride.status === "requested")
    .map((ride) => ({
      pickup: ride.pickup,
      dropoff: ride.dropoff,
      paymentMethod: ride.paymentMethod,
    }));
};

const getRideRequest = async (id: string): Promise<RideRequest> => {
  const ride = await getRide(id);
  return {
    pickup: ride.pickup,
    dropoff: ride.dropoff,
    paymentMethod: ride.paymentMethod,
  };
};

const createRideRequest = async (
  rideRequest: RideRequest
): Promise<RideRequest> => {
  return requestRide(rideRequest) as Promise<RideRequest>;
};

const updateRideRequest = async (
  id: string,
  rideRequest: Partial<RideRequest>
): Promise<RideRequest> => {
  return updateRide(id, rideRequest as Partial<Ride>) as Promise<RideRequest>;
};

const deleteRideRequest = async (id: string): Promise<void> => {
  await deleteRide(id);
};

export {
  getRides,
  getRide,
  createRide,
  updateRide,
  deleteRide,
  requestRide,
  getRideHistory,
  estimateFare,
  getRideRequests,
  getRideRequest,
  createRideRequest,
  updateRideRequest,
  deleteRideRequest,
};
