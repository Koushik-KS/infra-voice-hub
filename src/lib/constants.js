export const COUNTRIES = ["India", "Brazil", "Russia", "China", "South Africa"];

export const STATES_BY_COUNTRY = {
  India: ["Karnataka", "Maharashtra", "Tamil Nadu", "Uttar Pradesh", "Kerala"],
  Brazil: ["São Paulo", "Bahia", "Minas Gerais"],
  Russia: ["Moscow Oblast", "Tatarstan", "Siberian District"],
  China: ["Yunnan", "Sichuan", "Guangdong"],
  "South Africa": ["Gauteng", "Limpopo", "KwaZulu-Natal"],
};

export const DISTRICTS_BY_STATE = {
  Karnataka: ["Chikkamagaluru", "Hassan", "Mandya", "Kalaburagi", "Belagavi", "Raichur"],
  Maharashtra: ["Nashik", "Latur", "Nagpur"],
  "Tamil Nadu": ["Salem", "Madurai", "Erode"],
  "Uttar Pradesh": ["Jhansi", "Varanasi", "Bareilly"],
  Kerala: ["Wayanad", "Palakkad", "Idukki"],
  "São Paulo": ["Campinas", "Santos"],
  Bahia: ["Feira de Santana", "Ilhéus"],
  "Minas Gerais": ["Uberlândia", "Contagem"],
  "Moscow Oblast": ["Podolsk", "Khimki"],
  Tatarstan: ["Kazan", "Naberezhnye Chelny"],
  "Siberian District": ["Omsk", "Tomsk"],
  Yunnan: ["Kunming", "Dali"],
  Sichuan: ["Chengdu", "Mianyang"],
  Guangdong: ["Foshan", "Zhuhai"],
  Gauteng: ["Ekurhuleni", "Tshwane"],
  Limpopo: ["Polokwane", "Mopani"],
  "KwaZulu-Natal": ["Durban", "Newcastle"],
};

export const CATEGORIES = [
  "Water",
  "Road",
  "Healthcare",
  "Agriculture",
  "Education",
  "Electricity",
  "Sanitation",
  "Other",
];

export const PRIORITIES = ["Critical", "High", "Medium", "Low"];

export const SOURCES = ["Text", "Voice", "Messaging"];

export const LANGUAGES = [
  { label: "English", code: "en" },
  { label: "ಕನ್ನಡ", code: "kn" },
  { label: "हिन्दी", code: "hi" },
  { label: "Português", code: "pt" },
  { label: "Русский", code: "ru" },
  { label: "中文", code: "zh" },
];

export const LANGUAGE_NAMES = {
  en: "English",
  kn: "Kannada",
  hi: "Hindi",
  pt: "Portuguese",
  ru: "Russian",
  zh: "Chinese",
};

export const PRIORITY_LEVELS = [
  { level: "Critical", range: "80 – 100" },
  { level: "High", range: "60 – 79" },
  { level: "Medium", range: "35 – 59" },
  { level: "Low", range: "Below 35" },
];

export const SCORE_FACTORS = [
  { key: "citizenDemand", label: "Citizen Demand", max: 40 },
  { key: "urgency", label: "Urgency", max: 15 },
  { key: "infrastructureGap", label: "Infrastructure Gap", max: 20 },
  { key: "populationImpact", label: "Population Impact", max: 15 },
  { key: "investmentGap", label: "Investment Gap", max: 10 },
];

export function priorityFromScore(score) {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 35) return "Medium";
  return "Low";
}
