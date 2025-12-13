// Calendar event interface - matches backend calendar model
export interface CalendarEvent {
  _id?: string; // MongoDB _id
  Title: string;
  Location: string;
  Date: string; // ISO date string
  Time: string;
  ItemsRequired?: string[]; // Array of ObjectId references
  Bookings?: string[]; // Array of ObjectId references
}

// CalendarInfo interface
export interface CalendarInfo {
  events: CalendarEvent[];
}
