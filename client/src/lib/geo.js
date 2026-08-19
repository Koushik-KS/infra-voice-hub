/** Approximate district centroids used to place live hotspots on the map. */
export const DISTRICT_COORDS = {
  chikkamagaluru: [13.3161, 75.772],
  hassan: [13.0072, 76.0962],
  mandya: [12.5223, 76.8954],
  raichur: [16.2076, 77.3463],
  kalaburagi: [17.3297, 76.8343],
  kalaburgi: [17.3297, 76.8343],
  belagavi: [15.8497, 74.4977],
  bidar: [17.9104, 77.5199],
  chitradurga: [14.2251, 76.3985],
  shivamogga: [13.9299, 75.5681],
  bengaluru: [12.9716, 77.5946],
  mysuru: [12.2958, 76.6394],
  nashik: [19.9975, 73.7898],
  latur: [18.4088, 76.5604],
  nagpur: [21.1458, 79.0882],
  salem: [11.6643, 78.146],
  madurai: [9.9252, 78.1198],
  erode: [11.341, 77.7172],
  jhansi: [25.4484, 78.5685],
  varanasi: [25.3176, 82.9739],
  bareilly: [28.367, 79.4304],
  wayanad: [11.6854, 76.132],
  palakkad: [10.7867, 76.6548],
  idukki: [9.85, 76.9667],
};

export function coordsForDistrict(district) {
  if (!district) return null;
  return DISTRICT_COORDS[String(district).trim().toLowerCase()] ?? null;
}
