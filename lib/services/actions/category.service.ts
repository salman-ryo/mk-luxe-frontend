import { serverEnv } from "@/core/env.server";
import type { Category, ApiResponse } from "@/types/api";

/** Revalidate every 1 hour — categories rarely change */
const CATEGORIES_REVALIDATE_SECONDS = 3_600;

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${serverEnv.BACKEND_URI}/api/v1/categories`, {
    next: {
      revalidate: CATEGORIES_REVALIDATE_SECONDS,
      tags: ["categories"],
    },
  });

  if (!res.ok) {
    throw new Error(
      `[CategoryService] GET /api/v1/categories failed — HTTP ${res.status} ${res.statusText}`
    );
  }

  const responseData: ApiResponse<Category[]> = await res.json();
  const data = responseData.data || [];

  return data
    .filter((cat) => cat.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
}