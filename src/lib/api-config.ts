/** Resolve API base — use same-origin `/api` on Vercel (proxied to Azure backend). */
export function getApiBaseUrl(): string {
  const env = import.meta.env.VITE_API_BASE_URL;
  if (env && env.trim()) {
    const base = env.replace(/\/$/, "");
    // Mixed-content guard: never call plain HTTP from an HTTPS page in the browser.
    if (
      typeof window !== "undefined" &&
      window.location.protocol === "https:" &&
      base.startsWith("http://")
    ) {
      return "/api";
    }
    return base;
  }
  return "/api";
}
