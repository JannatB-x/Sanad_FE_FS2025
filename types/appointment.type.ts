// types/appointment.types.ts

export enum AppointmentStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
}

export interface IAppointment {
  _id: string;
  userId: string;
  rideId?: string;
  title: string;
  date: string;
  time: string;
  description?: string;
  status: AppointmentStatus;
  createdAt?: string;
  updatedAt?: string;
  ride?: {
    _id: string;
    pickupLocation: {
      address: string;
      lat: number;
      lng: number;
    };
    dropoffLocation: {
      address: string;
      lat: number;
      lng: number;
    };
    status: string;
    price?: number;
  };
}

export interface CreateAppointmentData {
  title: string;
  date: string;
  time: string;
  description?: string;
  rideId?: string;
}

export interface UpdateAppointmentData {
  title?: string;
  date?: string;
  time?: string;
  description?: string;
  status?: AppointmentStatus;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: "appointment" | "ride";
  status: AppointmentStatus | string;
  data: IAppointment | any;
}

export interface AppointmentResponse {
  success: boolean;
  data: IAppointment;
}

export interface AppointmentsResponse {
  success: boolean;
  data: IAppointment[];
}

export interface MonthlyAppointments {
  [date: string]: IAppointment[];
}
