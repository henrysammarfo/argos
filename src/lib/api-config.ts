/** Resolve API base — use same-origin `/api` on Vercel (proxied to Azure backend). */
export function getApiBaseUrl(): string {
  const env = import.meta.env.VITE_API_BASE_URL;
  if (env && env.trim()) {
    const base = env.replace(/\/$/, "");
    // Never call plain HTTP from an HTTPS page, or from SSR when env points at HTTP.
    if (base.startsWith("http://")) {
      const onHttpsPage =
        typeof window !== "undefined" && window.location.protocol === "https:";
      const isProd = import.meta.env.PROD;
      if (onHttpsPage || isProd) return "/api";
    }
    return base;
  }
  return "/api";
}
