const requireEnv = (value: string | undefined, key: string): string => {
  if (!value) {
    throw new Error(`[env] Missing required public env var: "${key}"`)
  }
  return value
}

export const clientEnv = {
  BACKEND_URI: requireEnv(
    process.env.NEXT_PUBLIC_BACKEND_URI,
    "NEXT_PUBLIC_BACKEND_URI"
  ),
  FRONTEND_URI: requireEnv(
    process.env.NEXT_PUBLIC_FRONTEND_URI,
    "NEXT_PUBLIC_FRONTEND_URI"
  ),
} as const