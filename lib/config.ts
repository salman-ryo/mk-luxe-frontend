/**
 * Resolves the backend API URL dynamically based on client and server env vars.
 * Normalizes trailing slashes and ensures '/api/v1' prefix is included correctly.
 */
export function getApiUrl(path: string = ""): string {
  // Try client-accessible public API URL first, fallback to server-only BACKEND_URI
  const baseUrl = 
    process.env.NEXT_PUBLIC_API_URL || 
    process.env.BACKEND_URI || 
    "http://localhost:8080/api/v1";

  // Clean trailing slashes
  let normalizedBase = baseUrl.replace(/\/$/, "");

  // If the base URL doesn't already contain /api/v1, append it
  if (!normalizedBase.includes("/api/v1")) {
    normalizedBase = `${normalizedBase}/api/v1`;
  }

  // Clean leading slash from the path
  const normalizedPath = path.replace(/^\//, "");

  return normalizedPath ? `${normalizedBase}/${normalizedPath}` : normalizedBase;
}
