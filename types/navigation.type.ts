// types/navigation.types.ts
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  // Auth Stack
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;

  // Main Tabs (User/Passenger)
  "(tabs)": undefined;
  Home: undefined;
  Calendar: undefined;
  Rides: undefined;
  Profile: undefined;

  // Ride Stack
  RideBooking: undefined;
  RideTracking: { rideId: string };
  RideDetails: { rideId: string };
  RideHistory: undefined;
  RateRide: { rideId: string };
  SelectLocation: {
    locationType: "pickup" | "dropoff";
  };

  // Rider Stack
  "(rider)/dashboard": undefined;
  RiderDashboard: undefined;
  ActiveRide: { rideId: string };
  RiderEarnings: undefined;
  RiderProfile: undefined;
  RiderSettings: undefined;

  // Company Stack
  "(company)/dashboard": undefined;
  CompanyDashboard: undefined;
  CompanyVehicles: undefined;
  CompanyRiders: undefined;
  AddVehicle: undefined;
  EditVehicle: { vehicleId: string };
  VehicleDetails: { vehicleId: string };

  // Admin Stack
  "(admin)/dashboard": undefined;
  AdminDashboard: undefined;
  AdminUsers: undefined;
  AdminRiders: undefined;
  AdminCompanies: undefined;
  AdminRides: undefined;

  // Appointment Stack
  CreateAppointment: undefined;
  AppointmentDetails: { appointmentId: string };
  EditAppointment: { appointmentId: string };

  // Profile Stack
  EditProfile: undefined;
  Settings: undefined;
  Help: undefined;
  EmergencyContacts: undefined;
  MedicalInfo: undefined;
  PaymentMethods: undefined;

  // Payment Stack
  Payment: { rideId: string; amount: number };
  PaymentSuccess: { paymentId: string };
  PaymentFailed: { error: string };
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Route props for specific screens
export type RideTrackingRouteProp = RouteProp<
  RootStackParamList,
  "RideTracking"
>;
export type RideDetailsRouteProp = RouteProp<RootStackParamList, "RideDetails">;
export type AppointmentDetailsRouteProp = RouteProp<
  RootStackParamList,
  "AppointmentDetails"
>;
export type ActiveRideRouteProp = RouteProp<RootStackParamList, "ActiveRide">;
export type EditVehicleRouteProp = RouteProp<RootStackParamList, "EditVehicle">;
export type VehicleDetailsRouteProp = RouteProp<
  RootStackParamList,
  "VehicleDetails"
>;
export type SelectLocationRouteProp = RouteProp<
  RootStackParamList,
  "SelectLocation"
>;
export type PaymentRouteProp = RouteProp<RootStackParamList, "Payment">;
