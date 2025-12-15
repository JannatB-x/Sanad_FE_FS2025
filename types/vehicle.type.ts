// types/vehicle.types.ts

export enum VehicleAccessibilityType {
  STANDARD = "standard",
  WHEELCHAIR_ACCESSIBLE = "wheelchair_accessible",
  PATIENT_BED = "patient_bed",
  AMBULANCE = "ambulance",
  MEDICAL_TRANSPORT = "medical_transport",
}

export enum WheelchairType {
  MANUAL = "manual",
  ELECTRIC = "electric",
  MOBILITY_SCOOTER = "mobility_scooter",
  BARIATRIC = "bariatric",
}

export enum AccessibilityFeature {
  WHEELCHAIR_RAMP = "wheelchair_ramp",
  WHEELCHAIR_LIFT = "wheelchair_lift",
  WHEELCHAIR_SECUREMENT = "wheelchair_securement",
  PATIENT_BED = "patient_bed",
  STRETCHER = "stretcher",
  OXYGEN_SUPPORT = "oxygen_support",
  MEDICAL_MONITORING = "medical_monitoring",
  LOWERED_FLOOR = "lowered_floor",
  WIDE_DOORS = "wide_doors",
  HAND_CONTROLS = "hand_controls",
  ADJUSTABLE_SEATS = "adjustable_seats",
  EMERGENCY_EQUIPMENT = "emergency_equipment",
  FIRST_AID_KIT = "first_aid_kit",
  FIRE_EXTINGUISHER = "fire_extinguisher",
  HEARING_LOOP = "hearing_loop",
  VISUAL_ALERTS = "visual_alerts",
}

export interface IVehicle {
  _id: string;
  companyId: string;
  riderId?: string;
  model: string;
  year: number;
  plateNumber: string;
  color: string;
  capacity: number;
  vehicleType: VehicleAccessibilityType;
  accessibilityFeatures: AccessibilityFeature[];
  hasPatientBed: boolean;
  hasOxygenSupport: boolean;
  hasMedicalEquipment: boolean;
  medicalEquipmentList?: string[];
  isWheelchairAccessible: boolean;
  wheelchairType?: WheelchairType[];
  hasWheelchairRamp: boolean;
  hasWheelchairLift: boolean;
  licensePlateImage?: string;
  registrationDocument?: string;
  insuranceDocument?: string;
  insuranceExpiryDate?: string;
  accessibilityCertificate?: string;
  medicalTransportLicense?: string;
  isActive: boolean;
  isAvailable: boolean;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleFilterOptions {
  needsWheelchair?: boolean;
  needsPatientBed?: boolean;
  wheelchairType?: WheelchairType;
  needsMedicalEquipment?: boolean;
  minCapacity?: number;
  vehicleType?: VehicleAccessibilityType;
}

export interface CreateVehicleData {
  companyId: string;
  model: string;
  year: number;
  plateNumber: string;
  color: string;
  capacity: number;
  vehicleType: VehicleAccessibilityType;
  accessibilityFeatures: AccessibilityFeature[];
  hasPatientBed: boolean;
  hasOxygenSupport: boolean;
  hasMedicalEquipment: boolean;
  medicalEquipmentList?: string[];
  isWheelchairAccessible: boolean;
  wheelchairType?: WheelchairType[];
  hasWheelchairRamp: boolean;
  hasWheelchairLift: boolean;
}

export interface VehicleResponse {
  success: boolean;
  data: IVehicle;
}

export interface VehiclesResponse {
  success: boolean;
  data: IVehicle[];
}

// Display labels for UI
export const VEHICLE_TYPE_LABELS: Record<VehicleAccessibilityType, string> = {
  [VehicleAccessibilityType.STANDARD]: "Standard Vehicle",
  [VehicleAccessibilityType.WHEELCHAIR_ACCESSIBLE]: "Wheelchair Accessible",
  [VehicleAccessibilityType.PATIENT_BED]: "Patient Bed/Stretcher",
  [VehicleAccessibilityType.AMBULANCE]: "Ambulance",
  [VehicleAccessibilityType.MEDICAL_TRANSPORT]: "Medical Transport",
};

export const WHEELCHAIR_TYPE_LABELS: Record<WheelchairType, string> = {
  [WheelchairType.MANUAL]: "Manual Wheelchair",
  [WheelchairType.ELECTRIC]: "Electric Wheelchair",
  [WheelchairType.MOBILITY_SCOOTER]: "Mobility Scooter",
  [WheelchairType.BARIATRIC]: "Bariatric Wheelchair",
};

export const ACCESSIBILITY_FEATURE_LABELS: Record<
  AccessibilityFeature,
  string
> = {
  [AccessibilityFeature.WHEELCHAIR_RAMP]: "Wheelchair Ramp",
  [AccessibilityFeature.WHEELCHAIR_LIFT]: "Wheelchair Lift",
  [AccessibilityFeature.WHEELCHAIR_SECUREMENT]: "Wheelchair Securement",
  [AccessibilityFeature.PATIENT_BED]: "Patient Bed",
  [AccessibilityFeature.STRETCHER]: "Stretcher",
  [AccessibilityFeature.OXYGEN_SUPPORT]: "Oxygen Support",
  [AccessibilityFeature.MEDICAL_MONITORING]: "Medical Monitoring",
  [AccessibilityFeature.LOWERED_FLOOR]: "Lowered Floor",
  [AccessibilityFeature.WIDE_DOORS]: "Wide Doors",
  [AccessibilityFeature.HAND_CONTROLS]: "Hand Controls",
  [AccessibilityFeature.ADJUSTABLE_SEATS]: "Adjustable Seats",
  [AccessibilityFeature.EMERGENCY_EQUIPMENT]: "Emergency Equipment",
  [AccessibilityFeature.FIRST_AID_KIT]: "First Aid Kit",
  [AccessibilityFeature.FIRE_EXTINGUISHER]: "Fire Extinguisher",
  [AccessibilityFeature.HEARING_LOOP]: "Hearing Loop",
  [AccessibilityFeature.VISUAL_ALERTS]: "Visual Alerts",
};
