// Unified Response Envelopes
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  message: string;
  data: T[];
  pagination: Pagination;
  error?: string;
}

// Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  last_login?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseData {
  user: User;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  is_featured: boolean;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCategoryPayload {
  name: string;
  description: string;
  sort_order: number;
  is_featured: boolean;
  is_active?: boolean;
  image_url?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  sort_order?: number;
  is_active?: boolean;
  is_featured?: boolean;
  image_url?: string;
}

// Product Types
export interface ProductVariant {
  sku: string;
  name: string;
  price: number;
  stock: number;
}

export interface ProductMedia {
  url: string;
  alt: string;
  is_primary: boolean;
}

export interface ProductFAQ {
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category_slug: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  is_most_sold: boolean;
  variants: ProductVariant[];
  media: ProductMedia[];
  faqs: ProductFAQ[];
  meta_title?: string;
  meta_description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductPayload {
  name: string;
  slug?: string;
  category_slug: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  is_most_sold: boolean;
  variants: ProductVariant[];
  media: ProductMedia[];
  faqs: ProductFAQ[];
  meta_title?: string;
  meta_description?: string;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  is_featured?: boolean;
  is_most_sold?: boolean;
}

// Inquiry Types
export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'pending' | 'in_progress' | 'resolved';
  created_at?: string;
  updated_at?: string;
}

export interface UpdateInquiryStatusPayload {
  status: 'pending' | 'in_progress' | 'resolved';
}
