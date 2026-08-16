// Clearly-labelled demo data. Used ONLY when the backend returns no data,
// so the intelligence surfaces remain demonstrable. Never mixed with live data.

export const DEMO_KPIS = {
  totalRequests: 12486,
  hotspots: 24,
  criticalIssues: 183,
  highPriorityProjects: 8,
};

export const DEMAND_BY_CATEGORY = [
  { category: "Water", requests: 3820 },
  { category: "Road", requests: 2745 },
  { category: "Healthcare", requests: 1980 },
  { category: "Agriculture", requests: 1560 },
  { category: "Education", requests: 1120 },
  { category: "Electricity", requests: 780 },
  { category: "Sanitation", requests: 481 },
];

export const DEMAND_TREND = [
  { month: "Jan", requests: 620 },
  { month: "Feb", requests: 742 },
  { month: "Mar", requests: 810 },
  { month: "Apr", requests: 968 },
  { month: "May", requests: 1124 },
  { month: "Jun", requests: 1290 },
  { month: "Jul", requests: 1408 },
  { month: "Aug", requests: 1602 },
  { month: "Sep", requests: 1745 },
];

export const TOP_REGIONS = [
  { district: "Chikkamagaluru", state: "Karnataka", category: "Water", requestCount: 247, score: 87 },
  { district: "Hassan", state: "Karnataka", category: "Road", requestCount: 186, score: 76 },
  { district: "Mandya", state: "Karnataka", category: "Agriculture", requestCount: 143, score: 68 },
  { district: "Raichur", state: "Karnataka", category: "Healthcare", requestCount: 121, score: 64 },
  { district: "Kalaburagi", state: "Karnataka", category: "Education", requestCount: 98, score: 52 },
  { district: "Belagavi", state: "Karnataka", category: "Sanitation", requestCount: 61, score: 31 },
];

export const DEMO_REQUESTS = [
  {
    _id: "demo-1",
    citizenName: "Anonymous Citizen",
    message: "ನಮ್ಮ ಊರಿನಲ್ಲಿ ಕುಡಿಯುವ ನೀರಿನ ಸಮಸ್ಯೆ ಇದೆ",
    language: "kn",
    category: "Water",
    priority: "Critical",
    source: "Voice",
    status: "Analyzed",
    location: { country: "India", state: "Karnataka", district: "Chikkamagaluru" },
    createdAt: "2026-08-14T08:12:00.000Z",
  },
  {
    _id: "demo-2",
    citizenName: "Ramesh K",
    message: "The main road connecting our village to the taluk hospital is badly damaged.",
    language: "en",
    category: "Road",
    priority: "High",
    source: "Text",
    status: "Analyzed",
    location: { country: "India", state: "Karnataka", district: "Hassan" },
    createdAt: "2026-08-13T14:40:00.000Z",
  },
  {
    _id: "demo-3",
    citizenName: "Anonymous Citizen",
    message: "हमारे गाँव के प्राथमिक स्वास्थ्य केंद्र में डॉक्टर नहीं आते हैं।",
    language: "hi",
    category: "Healthcare",
    priority: "Critical",
    source: "Messaging",
    status: "Under Review",
    location: { country: "India", state: "Karnataka", district: "Raichur" },
    createdAt: "2026-08-12T09:05:00.000Z",
  },
  {
    _id: "demo-4",
    citizenName: "Lakshmi",
    message: "Irrigation canal water has not reached our fields for two seasons.",
    language: "en",
    category: "Agriculture",
    priority: "High",
    source: "Text",
    status: "Analyzed",
    location: { country: "India", state: "Karnataka", district: "Mandya" },
    createdAt: "2026-08-11T17:22:00.000Z",
  },
  {
    _id: "demo-5",
    citizenName: "Anonymous Citizen",
    message: "Frequent power cuts affect the school computer lab every afternoon.",
    language: "en",
    category: "Electricity",
    priority: "Medium",
    source: "Text",
    status: "Analyzed",
    location: { country: "India", state: "Karnataka", district: "Kalaburagi" },
    createdAt: "2026-08-10T11:00:00.000Z",
  },
  {
    _id: "demo-6",
    citizenName: "Anonymous Citizen",
    message: "Precisamos de saneamento básico no bairro.",
    language: "pt",
    category: "Sanitation",
    priority: "Medium",
    source: "Messaging",
    status: "Analyzed",
    location: { country: "Brazil", state: "Bahia", district: "Feira de Santana" },
    createdAt: "2026-08-09T07:35:00.000Z",
  },
  {
    _id: "demo-7",
    citizenName: "Suma",
    message: "Government school has no functioning toilet for girls.",
    language: "en",
    category: "Education",
    priority: "High",
    source: "Text",
    status: "Under Review",
    location: { country: "India", state: "Karnataka", district: "Belagavi" },
    createdAt: "2026-08-08T13:15:00.000Z",
  },
  {
    _id: "demo-8",
    citizenName: "Anonymous Citizen",
    message: "Borewell dried up; tankers arrive only once a week.",
    language: "en",
    category: "Water",
    priority: "Critical",
    source: "Voice",
    status: "Analyzed",
    location: { country: "India", state: "Karnataka", district: "Chikkamagaluru" },
    createdAt: "2026-08-07T06:48:00.000Z",
  },
];

export const DEMO_HOTSPOTS = [
  { district: "Chikkamagaluru", state: "Karnataka", category: "Water", requestCount: 247, criticalCount: 61, highCount: 98, lat: 13.3161, lng: 75.7720 },
  { district: "Hassan", state: "Karnataka", category: "Road", requestCount: 186, criticalCount: 32, highCount: 84, lat: 13.0072, lng: 76.0962 },
  { district: "Mandya", state: "Karnataka", category: "Agriculture", requestCount: 143, criticalCount: 21, highCount: 66, lat: 12.5223, lng: 76.8954 },
  { district: "Raichur", state: "Karnataka", category: "Healthcare", requestCount: 121, criticalCount: 28, highCount: 49, lat: 16.2076, lng: 77.3463 },
  { district: "Kalaburagi", state: "Karnataka", category: "Education", requestCount: 98, criticalCount: 12, highCount: 37, lat: 17.3297, lng: 76.8343 },
  { district: "Belagavi", state: "Karnataka", category: "Sanitation", requestCount: 61, criticalCount: 4, highCount: 18, lat: 15.8497, lng: 74.4977 },
  { district: "Nashik", state: "Maharashtra", category: "Water", requestCount: 132, criticalCount: 24, highCount: 51, lat: 19.9975, lng: 73.7898 },
  { district: "Jhansi", state: "Uttar Pradesh", category: "Electricity", requestCount: 74, criticalCount: 9, highCount: 22, lat: 25.4484, lng: 78.5685 },
];

export const DISTRICT_COORDS = DEMO_HOTSPOTS.reduce((acc, h) => {
  acc[h.district] = [h.lat, h.lng];
  return acc;
}, {});

function rec(district, state, category, project, breakdown, context, explanation) {
  const totalScore = Math.min(
    100,
    Object.values(breakdown).reduce((a, b) => a + b, 0),
  );
  return {
    country: "India",
    state,
    district,
    category,
    citizenDemand: context.totalRequests,
    regionalContext: context,
    priority: { totalScore, breakdown },
    recommendedProject: project,
    explanation,
  };
}

export const DEMO_RECOMMENDATIONS = [
  rec(
    "Chikkamagaluru",
    "Karnataka",
    "Water",
    "Prioritize Drinking Water Infrastructure Project",
    { citizenDemand: 40, urgency: 8, infrastructureGap: 17, populationImpact: 12, investmentGap: 10 },
    { population: 1137961, infrastructureIndex: 42, publicInvestment: 128, totalRequests: 247, criticalRequests: 61 },
    "High citizen demand combined with a significant infrastructure gap and limited public investment makes drinking water infrastructure the highest priority for this region.",
  ),
  rec(
    "Hassan",
    "Karnataka",
    "Road",
    "Prioritize Rural Road Connectivity Upgrade",
    { citizenDemand: 33, urgency: 7, infrastructureGap: 14, populationImpact: 11, investmentGap: 7 },
    { population: 1776421, infrastructureIndex: 51, publicInvestment: 210, totalRequests: 186, criticalRequests: 32 },
    "Sustained road connectivity complaints and moderate infrastructure performance indicate that upgrading rural roads will unlock access to health and market services.",
  ),
  rec(
    "Mandya",
    "Karnataka",
    "Agriculture",
    "Prioritize Irrigation Canal Modernisation",
    { citizenDemand: 29, urgency: 6, infrastructureGap: 13, populationImpact: 12, investmentGap: 8 },
    { population: 1805769, infrastructureIndex: 55, publicInvestment: 174, totalRequests: 143, criticalRequests: 21 },
    "Agricultural water delivery failures dominate citizen demand while investment per capita trails comparable districts, making irrigation modernisation high value.",
  ),
  rec(
    "Raichur",
    "Karnataka",
    "Healthcare",
    "Prioritize Primary Health Centre Staffing & Expansion",
    { citizenDemand: 26, urgency: 9, infrastructureGap: 15, populationImpact: 10, investmentGap: 6 },
    { population: 1928812, infrastructureIndex: 39, publicInvestment: 143, totalRequests: 121, criticalRequests: 28 },
    "A weak infrastructure index paired with urgent health access complaints signals an underserved population requiring immediate primary care capacity.",
  ),
  rec(
    "Kalaburagi",
    "Karnataka",
    "Education",
    "Prioritize School Facility Improvement Programme",
    { citizenDemand: 21, urgency: 5, infrastructureGap: 12, populationImpact: 9, investmentGap: 5 },
    { population: 2566326, infrastructureIndex: 47, publicInvestment: 198, totalRequests: 98, criticalRequests: 12 },
    "Education facility gaps affect a large student population; targeted facility upgrades deliver broad population impact at moderate cost.",
  ),
  rec(
    "Jhansi",
    "Uttar Pradesh",
    "Electricity",
    "Prioritize Distribution Network Reinforcement",
    { citizenDemand: 17, urgency: 4, infrastructureGap: 11, populationImpact: 8, investmentGap: 4 },
    { population: 1998603, infrastructureIndex: 58, publicInvestment: 221, totalRequests: 74, criticalRequests: 9 },
    "Recurring supply interruptions cluster around industrial and school load centres, where feeder reinforcement resolves most reported failures.",
  ),
  rec(
    "Belagavi",
    "Karnataka",
    "Sanitation",
    "Prioritize Community Sanitation Coverage",
    { citizenDemand: 12, urgency: 3, infrastructureGap: 9, populationImpact: 7, investmentGap: 3 },
    { population: 4779661, infrastructureIndex: 62, publicInvestment: 265, totalRequests: 61, criticalRequests: 4 },
    "Sanitation demand is concentrated in peri-urban wards; incremental coverage investment closes the remaining service gap.",
  ),
];
