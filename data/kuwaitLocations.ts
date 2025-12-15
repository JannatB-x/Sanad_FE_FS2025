// constants/Kuwait.ts
import { KuwaitCity, PopularLocation } from "../types/location.type";

export const KUWAIT_CITIES: KuwaitCity[] = [
  {
    id: "1",
    name: "Kuwait City",
    arabicName: "مدينة الكويت",
    location: { lat: 29.3759, lng: 47.9774 },
  },
  {
    id: "2",
    name: "Hawalli",
    arabicName: "حولي",
    location: { lat: 29.3333, lng: 48.0289 },
  },
  {
    id: "3",
    name: "Salmiya",
    arabicName: "السالمية",
    location: { lat: 29.3344, lng: 48.0761 },
  },
  {
    id: "4",
    name: "Farwaniya",
    arabicName: "الفروانية",
    location: { lat: 29.2772, lng: 47.9586 },
  },
  {
    id: "5",
    name: "Jahra",
    arabicName: "الجهراء",
    location: { lat: 29.3375, lng: 47.6581 },
  },
  {
    id: "6",
    name: "Ahmadi",
    arabicName: "الأحمدي",
    location: { lat: 29.0769, lng: 48.0839 },
  },
  {
    id: "7",
    name: "Mangaf",
    arabicName: "المنقف",
    location: { lat: 29.1006, lng: 48.1297 },
  },
  {
    id: "8",
    name: "Fahaheel",
    arabicName: "الفحيحيل",
    location: { lat: 29.0828, lng: 48.13 },
  },
  {
    id: "9",
    name: "Sabah Al Salem",
    arabicName: "صباح السالم",
    location: { lat: 29.2478, lng: 48.0683 },
  },
  {
    id: "10",
    name: "Jleeb Al-Shuyoukh",
    arabicName: "جليب الشيوخ",
    location: { lat: 29.2894, lng: 47.9319 },
  },
];

export const POPULAR_LOCATIONS: PopularLocation[] = [
  {
    id: "1",
    name: "Kuwait International Airport",
    nameAr: "مطار الكويت الدولي",
    address: "Airport Road, Farwaniya",
    lat: 29.2266,
    lng: 47.9689,
    type: "airport",
    icon: "airplane",
  },
  {
    id: "2",
    name: "The Avenues Mall",
    nameAr: "الأفنيوز مول",
    address: "5th Ring Road, Rai",
    lat: 29.3069,
    lng: 47.9339,
    type: "mall",
    icon: "shopping-bag",
  },
  {
    id: "3",
    name: "Kuwait Towers",
    nameAr: "أبراج الكويت",
    address: "Arabian Gulf Street",
    lat: 29.3797,
    lng: 47.9906,
    type: "landmark",
    icon: "map-pin",
  },
  {
    id: "4",
    name: "Grand Mosque",
    nameAr: "المسجد الكبير",
    address: "Abdullah Al-Mubarak St",
    lat: 29.3697,
    lng: 47.9783,
    type: "landmark",
    icon: "map-pin",
  },
  {
    id: "5",
    name: "Al-Amiri Hospital",
    nameAr: "مستشفى الأميري",
    address: "Arabian Gulf Street",
    lat: 29.3792,
    lng: 47.9906,
    type: "hospital",
    icon: "activity",
  },
  {
    id: "6",
    name: "Mubarak Al-Kabeer Hospital",
    nameAr: "مستشفى مبارك الكبير",
    address: "Jabriya",
    lat: 29.3094,
    lng: 48.0189,
    type: "hospital",
    icon: "activity",
  },
  {
    id: "7",
    name: "360 Mall",
    nameAr: "مول 360",
    address: "Al Zahra",
    lat: 29.3011,
    lng: 48.087,
    type: "mall",
    icon: "shopping-bag",
  },
  {
    id: "8",
    name: "Marina Mall",
    nameAr: "مارينا مول",
    address: "Arabian Gulf Street, Salmiya",
    lat: 29.3377,
    lng: 48.0918,
    type: "mall",
    icon: "shopping-bag",
  },
  {
    id: "9",
    name: "Scientific Center",
    nameAr: "المركز العلمي",
    address: "Arabian Gulf Street, Salmiya",
    lat: 29.3544,
    lng: 48.0994,
    type: "landmark",
    icon: "map-pin",
  },
  {
    id: "10",
    name: "Souk Al-Mubarakiya",
    nameAr: "سوق المباركية",
    address: "Abdullah Al-Salem Street",
    lat: 29.3753,
    lng: 47.9847,
    type: "other",
    icon: "shopping-cart",
  },
  {
    id: "11",
    name: "Dasman Diabetes Institute",
    nameAr: "معهد دسمان للسكري",
    address: "Al-Soor Street",
    lat: 29.3736,
    lng: 47.9964,
    type: "hospital",
    icon: "activity",
  },
  {
    id: "12",
    name: "Farwaniya Hospital",
    nameAr: "مستشفى الفروانية",
    address: "Farwaniya",
    lat: 29.27,
    lng: 47.94,
    type: "hospital",
    icon: "activity",
  },
];

export const KUWAIT_LOCATION = {
  latitude: 29.3759,
  longitude: 47.9774,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

export const KUWAIT_AREAS = [
  "Abdullah Al-Salem",
  "Adailiya",
  "Adan",
  "Ahmadi",
  "Andalous",
  "Ardiya",
  "Bayan",
  "Bneid Al-Gar",
  "Daiya",
  "Dasma",
  "Doha",
  "Egaila",
  "Fahaheel",
  "Farwaniya",
  "Fintas",
  "Hawally",
  "Jabriya",
  "Jahra",
  "Jleeb Al-Shuyoukh",
  "Kaifan",
  "Khaitan",
  "Kuwait City",
  "Mahboula",
  "Mangaf",
  "Mansouriya",
  "Mirqab",
  "Mishref",
  "Nuzha",
  "Qadsiya",
  "Qortuba",
  "Rawda",
  "Rumaithiya",
  "Sabah Al-Salem",
  "Sabahiya",
  "Salwa",
  "Salmiya",
  "Shamiya",
  "Sharq",
  "Shuwaikh",
  "Sulaibikhat",
  "Surra",
  "Yarmouk",
];

// Phone validation for Kuwait
export const KUWAIT_PHONE_REGEX = /^[2456][0-9]{7}$/;

// Validate Kuwait phone number
export const isValidKuwaitPhone = (phone: string): boolean => {
  // Remove any non-digit characters
  const cleanPhone = phone.replace(/\D/g, "");

  // Check if it starts with country code
  if (cleanPhone.startsWith("965")) {
    return KUWAIT_PHONE_REGEX.test(cleanPhone.substring(3));
  }

  return KUWAIT_PHONE_REGEX.test(cleanPhone);
};

// Format Kuwait phone number
export const formatKuwaitPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, "");

  if (cleanPhone.length === 8) {
    return `+965 ${cleanPhone.substring(0, 4)} ${cleanPhone.substring(4)}`;
  }

  if (cleanPhone.startsWith("965") && cleanPhone.length === 11) {
    return `+965 ${cleanPhone.substring(3, 7)} ${cleanPhone.substring(7)}`;
  }

  return phone;
};
