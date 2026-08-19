import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://infra-voice-hub.onrender.com/api";

export const API_ERROR_MESSAGE =
  "Unable to connect to the CivilIntel API.";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Get citizen requests
export async function getRequests({ country } = {}) {
  try {
    const response = await api.get("/requests", {
      params: country ? { country } : {},
    });

    return response.data.data || [];
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        API_ERROR_MESSAGE
    );
  }
}

// Create citizen request
export async function createRequest(payload) {
  try {
    const response = await api.post("/requests", payload);

    return response.data.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        API_ERROR_MESSAGE
    );
  }
}

// Get demand hotspots
export async function getHotspots({ country } = {}) {
  try {
    const response = await api.get("/hotspots", {
      params: country ? { country } : {},
    });

    return response.data.data || [];
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        API_ERROR_MESSAGE
    );
  }
}

// Get project recommendations
export async function getRecommendations() {
  try {
    const response = await api.get("/recommendations");

    return response.data.data || response.data || [];
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        API_ERROR_MESSAGE
    );
  }
}

// Get dashboard
export async function getDashboard() {
  try {
    const response = await api.get("/dashboard");

    return response.data.data || response.data || {};
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        API_ERROR_MESSAGE
    );
  }
}