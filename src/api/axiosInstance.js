import axios from "axios";
import i18n from "../i18n";

// Base axios instance for when a live backend is available.
// All api/*.js modules currently resolve with mock data (see MOCK_MODE),
// so no live network calls are made until a backend is wired up.
export const MOCK_MODE = false;

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 30000, // Gemini retries + Hindi generation can exceed 15s
});

axiosInstance.interceptors.request.use((config) => {
  try {
    const saved = JSON.parse(localStorage.getItem("bis-auth"));
    if (saved?.token) {
      config.headers.Authorization = `Bearer ${saved.token}`;
    }
  } catch {
    // no-op: no stored auth yet
  }
  // Tells the backend which language the person is using right now, so any
  // Gemini-generated explanation can be produced in that language. The backend
  // needs to read this header and pass it into its LLM prompts — see chat notes.
  config.headers["Accept-Language"] = i18n.resolvedLanguage || i18n.language || "en";
  return config;
});

// Small helper so mock APIs feel like real network calls (latency + shape).
export function mockResolve(data, delay = 500) {
  return new Promise((resolve) => setTimeout(() => resolve({ data }), delay));
}

export default axiosInstance;
