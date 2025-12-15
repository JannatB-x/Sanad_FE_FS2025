// constants/Disability.ts

export enum DisabilityLevel {
  NONE = "none",
  MILD = "mild",
  MODERATE = "moderate",
  SEVERE = "severe",
}

export const DISABILITY_LEVELS = [
  { label: "None", value: DisabilityLevel.NONE },
  { label: "Mild", value: DisabilityLevel.MILD },
  { label: "Moderate", value: DisabilityLevel.MODERATE },
  { label: "Severe", value: DisabilityLevel.SEVERE },
];

export const DISABILITY_TYPES = [
  "Mobility Impairment",
  "Visual Impairment",
  "Hearing Impairment",
  "Cognitive Impairment",
  "Speech Impairment",
  "Mental Health Condition",
  "Chronic Pain",
  "Neurological Disorder",
  "Developmental Disability",
  "Other",
];

export const MOBILITY_AIDS = [
  "Manual Wheelchair",
  "Electric Wheelchair",
  "Walker",
  "Cane",
  "Crutches",
  "Mobility Scooter",
  "Prosthetic",
  "None",
];

export const ACCESSIBILITY_NEEDS = [
  {
    id: "wheelchair_accessible",
    label: "Wheelchair Accessible Vehicle",
    icon: "accessibility",
  },
  {
    id: "patient_bed",
    label: "Patient Bed/Stretcher",
    icon: "bed",
  },
  {
    id: "oxygen_support",
    label: "Oxygen Support",
    icon: "medkit",
  },
  {
    id: "medical_equipment",
    label: "Medical Equipment Space",
    icon: "fitness",
  },
  {
    id: "service_animal",
    label: "Service Animal Friendly",
    icon: "paw",
  },
  {
    id: "extra_assistance",
    label: "Extra Assistance Required",
    icon: "hand-left",
  },
];

export const WHEELCHAIR_TYPES = [
  { label: "Manual Wheelchair", value: "manual" },
  { label: "Electric Wheelchair", value: "electric" },
  { label: "Mobility Scooter", value: "mobility_scooter" },
  { label: "Bariatric Wheelchair", value: "bariatric" },
];

export const COMMON_MEDICAL_CONDITIONS = [
  "Diabetes",
  "Hypertension",
  "Asthma",
  "Heart Disease",
  "Arthritis",
  "Epilepsy",
  "Parkinson's Disease",
  "Multiple Sclerosis",
  "Cerebral Palsy",
  "Spinal Cord Injury",
  "Stroke Recovery",
  "Cancer",
  "Kidney Disease",
  "Liver Disease",
  "Chronic Pain Syndrome",
  "Fibromyalgia",
  "Autism Spectrum Disorder",
  "Down Syndrome",
  "Alzheimer's Disease",
  "Dementia",
  "Depression",
  "Anxiety Disorder",
  "PTSD",
  "Bipolar Disorder",
  "Schizophrenia",
  "Allergies (Severe)",
  "Respiratory Disease",
  "Other",
];

export const EMERGENCY_PROTOCOLS = [
  {
    condition: "Epilepsy",
    protocol:
      "Do not restrain. Protect head. Time the seizure. Call emergency if over 5 minutes.",
  },
  {
    condition: "Diabetes",
    protocol:
      "If unconscious or confused, check blood sugar. Provide sugar if low. Call emergency if no improvement.",
  },
  {
    condition: "Asthma",
    protocol:
      "Help use inhaler. Keep calm. Call emergency if no improvement or severe difficulty breathing.",
  },
  {
    condition: "Heart Disease",
    protocol:
      "Stop activity. Help sit down. Call emergency immediately if chest pain or shortness of breath.",
  },
  {
    condition: "Severe Allergic Reaction",
    protocol:
      "Use EpiPen if available. Call emergency immediately. Monitor breathing.",
  },
];

// Helper function to get disability level description
export const getDisabilityLevelDescription = (
  level: DisabilityLevel
): string => {
  const descriptions = {
    [DisabilityLevel.NONE]: "No disability or special needs",
    [DisabilityLevel.MILD]:
      "Minor limitations that may require occasional assistance",
    [DisabilityLevel.MODERATE]:
      "Significant limitations requiring regular assistance or accommodations",
    [DisabilityLevel.SEVERE]:
      "Major limitations requiring extensive assistance and specialized care",
  };
  return descriptions[level];
};

// Helper function to get recommended vehicle type based on needs
export const getRecommendedVehicleType = (
  needsWheelchair: boolean,
  needsPatientBed: boolean,
  hasMedicalEquipment: boolean
): string => {
  if (needsPatientBed) {
    return "ambulance";
  }
  if (needsWheelchair && hasMedicalEquipment) {
    return "medical_transport";
  }
  if (needsWheelchair) {
    return "wheelchair_accessible";
  }
  return "standard";
};
