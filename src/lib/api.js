import axios from "axios";

export const API_BASE_URL = "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
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
