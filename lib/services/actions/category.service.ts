import { getApiUrl } from "@/lib/config";
import type { Category, ApiResponse } from "@/types/api";

/** Revalidate every 1 hour — categories rarely change */
const CATEGORIES_REVALIDATE_SECONDS = 3_600;

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(getApiUrl("categories?is_featured=true"), {
      next: {
        revalidate: CATEGORIES_REVALIDATE_SECONDS,
        tags: ["categories"],
      },
    });

    if (!res.ok) {
      return [];
    }

    const responseData: ApiResponse<Category[]> = await res.json();
    const data = responseData.data || [];

    return data
      .filter((cat) => cat.is_active)
      .sort((a, b) => a.sort_order - b.sort_order);
  } catch {
    return [];
  }
}