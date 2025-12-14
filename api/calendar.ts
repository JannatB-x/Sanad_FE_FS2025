import instance from "./index";
import type { CalendarInfo, CalendarEvent } from "../types/calendarInfo";

// Backend calendar endpoints
// GET /api/calendar
// GET /api/calendar/:id
// POST /api/calendar
// PUT /api/calendar/:id
// DELETE /api/calendar/:id
// POST /api/calendar/register
// POST /api/calendar/login

const getBookings = async (): Promise<CalendarEvent[]> => {
  try {
    console.log("[Calendar API] Fetching bookings from: GET /calendar");
    console.log("[Calendar API] Base URL:", instance.defaults.baseURL);
    console.log(
      "[Calendar API] Full URL:",
      `${instance.defaults.baseURL}/calendar`
    );

    const { data } = await instance.get("/calendar");

    console.log("[Calendar API] Bookings fetched successfully:", {
      isArray: Array.isArray(data),
      hasBookings: !!data.bookings,
      dataKeys: data ? Object.keys(data) : [],
    });

    // Backend returns: { message: "Bookings retrieved successfully", bookings: [...] }
    if (Array.isArray(data)) {
      return data;
    }
    if (data?.bookings && Array.isArray(data.bookings)) {
      return data.bookings;
    }
    return [];
  } catch (error: any) {
    console.error("[Calendar API] Error fetching bookings:", {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      message: error?.response?.data?.message || error?.message,
      data: error?.response?.data,
      url: error?.config?.url,
      baseURL: error?.config?.baseURL,
      fullURL:
        error?.config?.baseURL && error?.config?.url
          ? `${error.config.baseURL}${error.config.url}`
          : undefined,
      method: error?.config?.method,
    });

    // Handle 404 - Route not found
    if (error?.response?.status === 404) {
      throw new Error(
        `Calendar route not found. Please ensure:\n1. The backend server is running\n2. The /api/calendar route is registered\n3. The server has been restarted with the latest code`
      );
    }

    // Handle 401 - Unauthorized
    if (error?.response?.status === 401) {
      throw new Error("Not authorized to view bookings. Please login again.");
    }

    throw error;
  }
};

const getBookingById = async (id: string): Promise<CalendarEvent> => {
  const { data } = await instance.get(`/calendar/${id}`);
  return data;
};

const createBooking = async (
  booking: Partial<CalendarEvent>
): Promise<CalendarEvent> => {
  try {
    console.log("[Calendar API] Creating booking:", booking);
    console.log("[Calendar API] Endpoint: POST /calendar");
    console.log("[Calendar API] Base URL:", instance.defaults.baseURL);
    console.log(
      "[Calendar API] Full URL:",
      `${instance.defaults.baseURL}/calendar`
    );

    const { data } = await instance.post("/calendar", booking);

    console.log("[Calendar API] Booking created successfully:", data);
    // Backend returns: { message: "Booking created successfully", booking: {...} }
    return data.booking || data;
  } catch (error: any) {
    console.error("[Calendar API] Error creating booking:", {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      message: error?.response?.data?.message || error?.message,
      data: error?.response?.data,
      url: error?.config?.url,
      baseURL: error?.config?.baseURL,
      fullURL:
        error?.config?.baseURL && error?.config?.url
          ? `${error.config.baseURL}${error.config.url}`
          : undefined,
      method: error?.config?.method,
    });

    // Handle 404 - Route not found
    if (error?.response?.status === 404) {
      const errorMessage = error?.response?.data?.message || "Route not found";
      throw new Error(
        `${errorMessage}. Please ensure:\n1. The backend server is running\n2. The /api/calendar route is registered\n3. The server has been restarted with the latest code`
      );
    }

    // Handle 401 - Unauthorized
    if (error?.response?.status === 401) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Not authorized";
      throw new Error(errorMessage);
    }

    // Re-throw with original error message
    throw error;
  }
};

const updateBooking = async (
  id: string,
  booking: Partial<CalendarEvent>
): Promise<CalendarEvent> => {
  const { data } = await instance.put(`/calendar/${id}`, booking);
  return data.booking || data;
};

const deleteBooking = async (id: string): Promise<void> => {
  await instance.delete(`/calendar/${id}`);
};

const registerBooking = async (payload: { name: string; password: string }) => {
  const { data } = await instance.post("/calendar/register", payload);
  return data;
};

const loginBooking = async (payload: { name: string; password: string }) => {
  const { data } = await instance.post("/calendar/login", payload);
  return data;
};

export {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  registerBooking,
  loginBooking,
};
