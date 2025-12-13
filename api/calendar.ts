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
  const { data } = await instance.get("/calendar");
  return Array.isArray(data) ? data : data.bookings || [];
};

const getBookingById = async (id: string): Promise<CalendarEvent> => {
  const { data } = await instance.get(`/calendar/${id}`);
  return data;
};

const createBooking = async (
  booking: Partial<CalendarEvent>
): Promise<CalendarEvent> => {
  const { data } = await instance.post("/calendar", booking);
  return data.newBooking || data.booking || data;
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

