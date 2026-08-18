import axios from "axios";

// Backend is not connected yet.
// Keep this empty until we create/deploy a backend specifically for Project 2.
export const API_BASE_URL = "";

export const API_ERROR_MESSAGE =
  "Unable to connect to the CivilIntel API.";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000,
  headers: {
    "Content-Type": "application/json",
  },
});

// API helpers
export async function getRequests() {
  throw new Error("Backend not connected yet");
}

export async function createRequest() {
  throw new Error("Backend not connected yet");
}

export async function getHotspots() {
  throw new Error("Backend not connected yet");
}

export async function getRecommendations() {
  throw new Error("Backend not connected yet");
}

export async function getDashboard() {
  throw new Error("Backend not connected yet");
}

export async function getDpiImpact() {
  throw new Error("Backend not connected yet");
}