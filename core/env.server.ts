// env.server.ts
const requireEnv = (key: string): string => {
  const value = process.env[key]
  if (!value) {
    throw new Error(`[env] Missing required server env var: "${key}"`)
  }
  return value
}

export const serverEnv = {
  BACKEND_URI: requireEnv("NEXT_PUBLIC_API_URL"),
} as const