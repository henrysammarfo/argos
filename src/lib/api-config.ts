/** Resolve API base — production always uses same-origin `/api` (Vercel → Azure proxy). */
export function getApiBaseUrl(): string {
  if (import.meta.env.PROD) return "/api";

  const env = import.meta.env.VITE_API_BASE_URL;
  if (env?.trim()) return env.replace(/\/$/, "");
  return "http://localhost:8000/api";
}
