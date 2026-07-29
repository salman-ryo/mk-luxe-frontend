'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { apiClient } from '@/lib/api-client';
import {
  Product,
  Category,
  ApiResponse,
  PaginatedResponse,
  CreateProductPayload,
  UpdateProductPayload,
} from '@/types/api';
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  Search,
  Filter,
  Star,
  Flame,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertTriangle,
  ImageIcon,
  X,
  Check,
  FileJson,
} from 'lucide-react';
import { JsonProductModal } from '@/components/admin/json-product-modal';
import { ImageUploader } from '@/components/admin/image-uploader';
import { BulkImageUploader } from '@/components/admin/bulk-image-uploader';
import { uploadToR2 } from '@/lib/upload';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

// Zod Schema for Product Form
const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().optional(),
  category_slug: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['draft', 'published', 'archived']),
  is_featured: z.boolean().default(false),
  is_most_sold: z.boolean().default(false),
  variants: z
    .array(
      z.object({
        sku: z.string().min(1, 'SKU required'),
        name: z.string().min(1, 'Variant name required'),
        price: z.coerce.number().min(0, 'Price must be >= 0'),
        stock: z.coerce.number().min(0, 'Stock must be >= 0'),
      })
    )
    .min(1, 'At least one variant is required'),
  media: z
    .array(
      z.object({
        url: z.string().min(1, 'Media URL required'),
        alt: z.string().default(''),
        is_primary: z.boolean().default(false),
      })
    )
    .default([]),
  faqs: z
    .array(
      z.object({
        question: z.string().min(1, 'Question required'),
        answer: z.string().min(1, 'Answer required'),
      })
    )
    .default([]),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductsPage() {
  const queryClient = useQueryClient();

  // Query state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // UI state
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [productFiles, setProductFiles] = useState<Record<string, File>>({});

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch Categories for dropdown
  const { data: categoriesData } = useQuery({
    queryKey: ['categories-list'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Category[]>>('/categories');
      return res.data?.data || [];
    },
  });

  const categories = categoriesData || [];

  // Fetch Products with pagination and filters
  const { data: productsData, isLoading, isError, isFetching } = useQuery({
    queryKey: ['products', page, limit, debouncedSearch, categoryFilter, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', String(limit));
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (categoryFilter) params.append('category', categoryFilter);
      if (statusFilter) params.append('status', statusFilter);

      const res = await apiClient.get<PaginatedResponse<Product>>(`/products?${params.toString()}`);
      return res.data;
    },
  });

  const products = productsData?.data || [];
  const pagination = productsData?.pagination || { total: 0, page: 1, limit: 10 };
  const totalPages = Math.ceil(pagination.total / pagination.limit) || 1;

  // React Hook Form
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: '',
      slug: '',
      category_slug: '',
      description: '',
      status: 'published',
      is_featured: false,
      is_most_sold: false,
      variants: [{ sku: 'SKU-001', name: 'Standard', price: 0, stock: 10 }],
      media: [],
      faqs: [],
      meta_title: '',
      meta_description: '',
    },
  });

  const variantsField = useFieldArray({ control: form.control, name: 'variants' });
  const mediaField = useFieldArray({ control: form.control, name: 'media' });
  const faqsField = useFieldArray({ control: form.control, name: 'faqs' });

  // Open Create Form Drawer
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setProductFiles({});
    form.reset({
      name: '',
      slug: '',
      category_slug: categories[0]?.slug || '',
      description: '',
      status: 'published',
      is_featured: false,
      is_most_sold: false,
      variants: [{ sku: 'SKU-001', name: 'Standard', price: 0, stock: 10 }],
      media: [],
      faqs: [],
      meta_title: '',
      meta_description: '',
    });
    setIsSheetOpen(true);
  };

  // Open Edit Form Drawer
  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setProductFiles({});
    form.reset({
      name: product.name,
      slug: product.slug,
      category_slug: product.category_slug,
      description: product.description,
      status: product.status || 'published',
      is_featured: product.is_featured ?? false,
      is_most_sold: product.is_most_sold ?? false,
      variants: product.variants?.length
        ? product.variants
        : [{ sku: 'SKU-001', name: 'Standard', price: 0, stock: 0 }],
      media: product.media?.map((m: any) => ({
        url: m.url || '',
        alt: m.alt || m.alt_text || '',
        is_primary: !!m.is_primary,
      })) || [],
      faqs: product.faqs || [],
      meta_title: product.meta_title || '',
      meta_description: product.meta_description || '',
    });
    setIsSheetOpen(true);
  };

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: async (payload: CreateProductPayload) => {
      const res = await apiClient.post<ApiResponse<Product>>('/admin/products', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully!');
      setIsSheetOpen(false);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to create product';
      toast.error(msg);
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateProductPayload }) => {
      const res = await apiClient.put<ApiResponse<Product>>(`/admin/products/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully!');
      setIsSheetOpen(false);
      setEditingProduct(null);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to update product';
      toast.error(msg);
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete<ApiResponse<null>>(`/admin/products/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully!');
      setDeletingProduct(null);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to delete product';
      toast.error(msg);
    },
  });

  const onSubmitForm = async (data: ProductFormData) => {
    // Media items array copy
    const mediaItems = data.media ? [...data.media] : [];
    const filesToUpload: Array<{ index: number; file: File }> = [];

    mediaItems.forEach((item, index) => {
      if (item.url.startsWith('blob:') && productFiles[item.url]) {
        filesToUpload.push({
          index,
          file: productFiles[item.url],
        });
      }
    });

    if (filesToUpload.length > 0) {
      try {
        setUploadingCount(filesToUpload.length);

        // Upload all files in parallel
        const uploadPromises = filesToUpload.map(async ({ index, file }) => {
          const publicUrl = await uploadToR2(file);
          mediaItems[index] = {
            ...mediaItems[index],
            url: publicUrl,
          };
        });

        await Promise.all(uploadPromises);
        setProductFiles({});
      } catch (err) {
        // uploadToR2 handles toast errors
        setUploadingCount(0);
        return;
      } finally {
        setUploadingCount(0);
      }
    }

    const payload = {
      ...data,
      media: mediaItems,
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center space-x-2">
            <Package className="w-6 h-6 text-champagne-gold" />
            <span>Product Management</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create, filter, and manage luxury products and variant inventories.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            onClick={() => setIsJsonModalOpen(true)}
            variant="outline"
            className="border-champagne-gold/30 hover:bg-champagne-gold/10 hover:border-champagne-gold/50"
          >
            <FileJson className="w-4 h-4 mr-2 text-champagne-gold" /> Import via JSON
          </Button>
          <Button onClick={handleOpenCreate} variant="champagneGold">
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-card/40 p-4 border rounded-xl backdrop-blur-sm">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background/60"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-48 bg-[#0a0a0c] border border-border px-3 py-2 text-xs uppercase tracking-widest focus:outline-none focus:border-primary rounded-md text-foreground cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-36 bg-[#0a0a0c] border border-border px-3 py-2 text-xs uppercase tracking-widest focus:outline-none focus:border-primary rounded-md text-foreground cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Products Data Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 text-center border border-red-500/20 rounded-xl bg-red-500/5 text-red-400">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-80" />
          <p className="font-semibold text-base">Failed to load products</p>
          <p className="text-xs text-muted-foreground mt-1">Check API client configuration.</p>
        </div>
      ) : products.length === 0 ? (
        <div className="p-12 text-center border rounded-xl bg-card/30">
          <Package className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
          <h3 className="font-semibold text-foreground">No Products Found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {debouncedSearch || categoryFilter || statusFilter
              ? 'No products match your current search filters.'
              : 'Add your first luxury item to start building your catalog.'}
          </p>
          <Button onClick={handleOpenCreate} variant="outline" className="mt-4">
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </div>
      ) : (
        <div className={`space-y-4 transition-all duration-200 ${isFetching && !isLoading ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
          {/* Mobile Card List View (< md) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {products.map((product) => {
              const primaryMedia = product.media?.find((m) => m.is_primary) || product.media?.[0];
              const minPrice = product.variants?.length
                ? Math.min(...product.variants.map((v) => v.price))
                : 0;
              const totalStock = product.variants?.length
                ? product.variants.reduce((acc, v) => acc + (v.stock || 0), 0)
                : 0;

              return (
                <div key={product.id} className="p-4 border border-border/80 rounded-xl bg-card/30 backdrop-blur-sm space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-14 h-14 rounded-lg border bg-muted/40 overflow-hidden flex items-center justify-center relative shrink-0">
                      {primaryMedia?.url ? (
                        <img
                          src={primaryMedia.url}
                          alt={primaryMedia.alt || product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-muted-foreground/40" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-sm text-foreground truncate">{product.name}</h3>
                        {product.status === 'published' && <Badge variant="success" className="text-[10px] shrink-0">Published</Badge>}
                        {product.status === 'draft' && <Badge variant="warning" className="text-[10px] shrink-0">Draft</Badge>}
                        {product.status === 'archived' && <Badge variant="destructive" className="text-[10px] shrink-0">Archived</Badge>}
                      </div>
                      <p className="text-xs font-mono text-muted-foreground truncate">{product.slug}</p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {product.category_slug}
                        </Badge>
                        {product.is_featured && (
                          <Badge variant="gold" className="text-[10px]">
                            <Star className="w-2.5 h-2.5 mr-1 fill-champagne-gold" /> Featured
                          </Badge>
                        )}
                        {product.is_most_sold && (
                          <Badge variant="info" className="text-[10px]">
                            <Flame className="w-2.5 h-2.5 mr-1 text-sky-400" /> Top Seller
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs">
                    <div>
                      <span className="font-bold text-champagne-gold font-mono text-sm">
                        ₹{minPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-muted-foreground ml-1.5 text-[11px]">
                        ({totalStock} in stock)
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(product)}
                        className="h-8 px-2.5 text-xs hover:text-champagne-gold"
                      >
                        <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingProduct(product)}
                        className="h-8 px-2.5 text-xs text-muted-foreground hover:text-red-500 hover:border-red-500/40"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Data Table (>= md) */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-border/80">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Media</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price / Stock</TableHead>
                  <TableHead>Badges</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  const primaryMedia = product.media?.find((m) => m.is_primary) || product.media?.[0];
                  const minPrice = product.variants?.length
                    ? Math.min(...product.variants.map((v) => v.price))
                    : 0;
                  const totalStock = product.variants?.length
                    ? product.variants.reduce((acc, v) => acc + (v.stock || 0), 0)
                    : 0;

                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="w-10 h-10 rounded-lg border bg-muted/40 overflow-hidden flex items-center justify-center relative shrink-0">
                          {primaryMedia?.url ? (
                            <img
                              src={primaryMedia.url}
                              alt={primaryMedia.alt || product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-muted-foreground/40" />
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="font-semibold text-foreground">{product.name}</p>
                          <p className="text-xs font-mono text-muted-foreground">{product.slug}</p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {product.category_slug}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {product.status === 'published' && <Badge variant="success">Published</Badge>}
                        {product.status === 'draft' && <Badge variant="warning">Draft</Badge>}
                        {product.status === 'archived' && <Badge variant="destructive">Archived</Badge>}
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="font-semibold text-sm text-champagne-gold font-mono">
                            ₹{minPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {totalStock} in stock ({product.variants?.length || 0} variants)
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {product.is_featured && (
                            <Badge variant="gold" className="text-[10px]">
                              <Star className="w-3 h-3 mr-1 fill-champagne-gold" /> Featured
                            </Badge>
                          )}
                          {product.is_most_sold && (
                            <Badge variant="info" className="text-[10px]">
                              <Flame className="w-3 h-3 mr-1 text-sky-400" /> Top Seller
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(product)}
                            className="h-8 w-8 hover:text-champagne-gold"
                            title="Edit Product"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeletingProduct(product)}
                            className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border rounded-xl bg-card/40">
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              Showing page <strong className="text-foreground">{pagination.page}</strong> of{' '}
              <strong className="text-foreground">{totalPages}</strong> ({pagination.total} total items)
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Product Drawer Sheet (Create / Edit Form) */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen} className="max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-4xl">
        <SheetHeader>
          <SheetTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</SheetTitle>
          <SheetDescription>
            {editingProduct
              ? 'Update specifications, media, variants, and SEO meta details.'
              : 'Fill out luxury catalog item properties and multi-variant attributes.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6 pt-2 pb-12">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 border-b pb-1">
              1. Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="prod-name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Product Name *
                </label>
                <Input id="prod-name" {...form.register('name')} placeholder="e.g. Royal Chronograph 44" />
                {form.formState.errors.name && (
                  <p className="text-xs text-red-400">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="prod-slug" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Custom Slug (Optional)
                </label>
                <Input id="prod-slug" {...form.register('slug')} placeholder="auto-generated-if-empty" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="prod-category" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Category *
                </label>
                <select
                  id="prod-category"
                  {...form.register('category_slug')}
                  className="w-full bg-[#0a0a0c] border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary rounded-md text-foreground cursor-pointer"
                >
                  <option value="">Select Category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {form.formState.errors.category_slug && (
                  <p className="text-xs text-red-400">{form.formState.errors.category_slug.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="prod-status" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Status *
                </label>
                <select
                  id="prod-status"
                  {...form.register('status')}
                  className="w-full bg-[#0a0a0c] border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary rounded-md text-foreground cursor-pointer"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="prod-desc" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Description *
              </label>
              <Textarea
                id="prod-desc"
                {...form.register('description')}
                placeholder="Full description of craftsmanship, materials, and luxury features..."
                rows={4}
              />
              {form.formState.errors.description && (
                <p className="text-xs text-red-400">{form.formState.errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Discovery Flags */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 border-b pb-1">
              2. Storefront Toggles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                <label htmlFor="prod-featured" className="cursor-pointer flex-1">
                  <span className="text-sm font-semibold text-foreground block">Is Featured</span>
                  <span className="text-xs text-muted-foreground block">Showcase on main feature slider</span>
                </label>
                <Switch
                  id="prod-featured"
                  checked={form.watch('is_featured')}
                  onCheckedChange={(checked) => form.setValue('is_featured', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                <label htmlFor="prod-most-sold" className="cursor-pointer flex-1">
                  <span className="text-sm font-semibold text-foreground block">Is Most Sold</span>
                  <span className="text-xs text-muted-foreground block">Badge as best seller</span>
                </label>
                <Switch
                  id="prod-most-sold"
                  checked={form.watch('is_most_sold')}
                  onCheckedChange={(checked) => form.setValue('is_most_sold', checked)}
                />
              </div>
            </div>
          </div>

          {/* Dynamic Field Array: Variants */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500">
                3. Product Variants ({variantsField.fields.length})
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  variantsField.append({
                    sku: `SKU-00${variantsField.fields.length + 1}`,
                    name: 'New Variant',
                    price: 0,
                    stock: 0,
                  })
                }
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Variant
              </Button>
            </div>

            {variantsField.fields.map((field, index) => (
              <div key={field.id} className="p-3 border rounded-lg bg-muted/20 space-y-3 relative">
                <button
                  type="button"
                  onClick={() => variantsField.remove(index)}
                  className="absolute right-2 top-2 text-muted-foreground hover:text-red-500"
                  title="Remove variant"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pr-6">
                  <div>
                    <label htmlFor={`var-sku-${index}`} className="text-[10px] font-semibold uppercase text-muted-foreground block mb-1">
                      SKU
                    </label>
                    <Input id={`var-sku-${index}`} {...form.register(`variants.${index}.sku`)} placeholder="SKU-001" />
                  </div>
                  <div>
                    <label htmlFor={`var-name-${index}`} className="text-[10px] font-semibold uppercase text-muted-foreground block mb-1">
                      Variant Name
                    </label>
                    <Input id={`var-name-${index}`} {...form.register(`variants.${index}.name`)} placeholder="Rose Gold / 42mm" />
                  </div>
                  <div>
                    <label htmlFor={`var-price-${index}`} className="text-[10px] font-semibold uppercase text-muted-foreground block mb-1">
                      Price (₹)
                    </label>
                    <Input
                      id={`var-price-${index}`}
                      type="number"
                      step="0.01"
                      {...form.register(`variants.${index}.price`)}
                      placeholder="4999.00"
                    />
                  </div>
                  <div>
                    <label htmlFor={`var-stock-${index}`} className="text-[10px] font-semibold uppercase text-muted-foreground block mb-1">
                      Stock
                    </label>
                    <Input
                      id={`var-stock-${index}`}
                      type="number"
                      {...form.register(`variants.${index}.stock`)}
                      placeholder="10"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dynamic Field Array: Media */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500">
                4. Media Gallery ({mediaField.fields.length})
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  mediaField.append({
                    url: '',
                    alt: '',
                    is_primary: mediaField.fields.length === 0,
                  })
                }
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add URL Field
              </Button>
            </div>

            <BulkImageUploader
              onFilesSelected={(selected) => {
                selected.forEach(({ url, file }) => {
                  setProductFiles((prev) => ({ ...prev, [url]: file }));
                  mediaField.append({
                    url,
                    alt: '',
                    is_primary: mediaField.fields.length === 0,
                  });
                });
              }}
            />

            {mediaField.fields.map((field, index) => {
              const currentUrl = form.watch(`media.${index}.url`);

              return (
                <div key={field.id} className="p-3 border rounded-lg bg-muted/20 space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => mediaField.remove(index)}
                    className="absolute right-2 top-2 text-muted-foreground hover:text-red-500 transition-colors z-10"
                    title="Remove media item"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex flex-col sm:flex-row gap-3 items-start pr-6">
                    {/* Live Image Preview Thumbnail */}
                    <div className="w-20 h-20 rounded-lg border bg-slate-950/80 shrink-0 overflow-hidden relative flex items-center justify-center border-slate-800 shadow-sm">
                      {currentUrl ? (
                        <img
                          src={currentUrl}
                          alt={form.watch(`media.${index}.alt`) || `Media preview ${index + 1}`}
                          className="w-full h-full object-cover transition-opacity duration-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            const parent = (e.target as HTMLImageElement).parentElement;
                            if (parent) {
                              const fallback = parent.querySelector('.preview-fallback');
                              if (fallback) fallback.classList.remove('hidden');
                            }
                          }}
                        />
                      ) : null}
                      <div className={`preview-fallback flex flex-col items-center justify-center text-center p-1 ${currentUrl ? 'hidden' : ''}`}>
                        <ImageIcon className="w-5 h-5 text-slate-500 mb-1" />
                        <span className="text-[9px] text-slate-500 font-medium">No Image</span>
                      </div>
                    </div>

                    {/* Input Fields */}
                    <div className="flex-1 space-y-3 w-full">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                        <div className="md:col-span-2">
                          <ImageUploader
                            value={form.watch(`media.${index}.url`)}
                            onChange={(url, file) => {
                              form.setValue(`media.${index}.url`, url, { shouldValidate: true });
                              if (file) {
                                setProductFiles((prev) => ({ ...prev, [url]: file }));
                              }
                            }}
                            placeholder="Upload file or enter URL..."
                          />
                        </div>
                        <div>
                          <label htmlFor={`media-alt-${index}`} className="text-[10px] font-semibold uppercase text-muted-foreground block mb-1">
                            Alt Text
                          </label>
                          <Input id={`media-alt-${index}`} {...form.register(`media.${index}.alt`)} placeholder="Front angle view" />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 pt-0.5">
                        <Switch
                          id={`media-primary-${index}`}
                          checked={form.watch(`media.${index}.is_primary`)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              mediaField.fields.forEach((_, i) => {
                                form.setValue(`media.${i}.is_primary`, i === index);
                              });
                            } else {
                              form.setValue(`media.${index}.is_primary`, false);
                            }
                          }}
                        />
                        <label htmlFor={`media-primary-${index}`} className="text-xs text-muted-foreground font-medium cursor-pointer">
                          Set as Primary Image
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dynamic Field Array: FAQs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500">
                5. Product FAQs ({faqsField.fields.length})
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => faqsField.append({ question: '', answer: '' })}
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add FAQ
              </Button>
            </div>

            {faqsField.fields.map((field, index) => (
              <div key={field.id} className="p-3 border rounded-lg bg-muted/20 space-y-2 relative animate-in fade-in duration-200">
                <button
                  type="button"
                  onClick={() => faqsField.remove(index)}
                  className="absolute right-2 top-2 text-muted-foreground hover:text-red-500"
                  aria-label="Remove FAQ"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="pr-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={`faq-q-${index}`} className="text-[10px] font-semibold uppercase text-muted-foreground block mb-1">
                      Question *
                    </label>
                    <Input
                      id={`faq-q-${index}`}
                      {...form.register(`faqs.${index}.question`)}
                      placeholder="e.g. Is warranty included?"
                    />
                  </div>
                  <div>
                    <label htmlFor={`faq-a-${index}`} className="text-[10px] font-semibold uppercase text-muted-foreground block mb-1">
                      Answer *
                    </label>
                    <Input
                      id={`faq-a-${index}`}
                      {...form.register(`faqs.${index}.answer`)}
                      placeholder="e.g. 2-Year International Warranty"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SEO Metadata */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 border-b pb-1">
              6. SEO Meta Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="seo-title" className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                  Meta Title
                </label>
                <Input id="seo-title" {...form.register('meta_title')} placeholder="SEO Meta Title" />
              </div>
              <div>
                <label htmlFor="seo-desc" className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                  Meta Description
                </label>
                <Textarea
                  id="seo-desc"
                  {...form.register('meta_description')}
                  placeholder="SEO Meta Description"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Save Footer */}
          <div className="pt-4 flex items-center justify-end space-x-3 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSheetOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" variant="champagneGold" disabled={isSaving || uploadingCount > 0}>
              {isSaving ? (
                <span className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Product...</span>
                </span>
              ) : uploadingCount > 0 ? (
                <span className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading images ({uploadingCount})...</span>
                </span>
              ) : editingProduct ? (
                'Update Product'
              ) : (
                'Save Product'
              )}
            </Button>
          </div>
        </form>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingProduct} onOpenChange={() => setDeletingProduct(null)}>
        <DialogHeader>
          <DialogTitle className="text-red-500 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Confirm Product Deletion</span>
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong className="text-foreground">{deletingProduct?.name}</strong>?
            This will remove all associated variants, media URLs, and FAQs from database permanently.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDeletingProduct(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => deletingProduct && deleteMutation.mutate(deletingProduct.id)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <span className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </span>
            ) : (
              'Delete Product'
            )}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* JSON Product Import Modal */}
      <JsonProductModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
      />
    </div>
  );
}
