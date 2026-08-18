import axios from "axios";

export const API_BASE_URL = "https://civilintel.onrender.com/api";

export const API_ERROR_MESSAGE = "Unable to connect to CivilIntel live intelligence API.";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000,
  headers: { "Content-Type": "application/json" },
});

/** Backends differ slightly: unwrap {data:[...]} / {requests:[...]} shapes. */
function unwrap(payload, key) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  if (Array.isArray(payload[key])) return payload[key];
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.results)) return payload.results;
  return [];
}

function unwrapObject(payload) {
  if (!payload || typeof payload !== "object") return null;
  if (payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)) return payload.data;
  return payload;
}

export async function getRequests(params) {
  const res = await api.get("/requests", { params });
  return unwrap(res.data, "requests");
}

export async function createRequest(body) {
  const res = await api.post("/requests", body);
  return res.data?.data ?? res.data;
}

export async function getHotspots(params) {
  const res = await api.get("/intelligence/hotspots", { params });
  return unwrap(res.data, "hotspots");
}

export async function getRecommendations(params) {
  const res = await api.get("/intelligence/recommendations", { params });
  return unwrap(res.data, "recommendations");
}

/**
 * Dashboard summary metrics. Some deployments expose this as
 * /intelligence/dashboard, others as /intelligence/stats.
 */
export async function getDashboard(params) {
  try {
    const res = await api.get("/intelligence/dashboard", { params });
    const data = unwrapObject(res.data);
    if (data) return data;
  } catch {
    // fall through to the stats endpoint
  }
  const res = await api.get("/intelligence/stats", { params });
  return unwrapObject(res.data) ?? {};
}

export async function getDpiImpact(params) {
  const res = await api.get("/dpi-impact", { params });
  return unwrap(res.data, "projects");
}
