'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { apiClient } from '@/lib/api-client';
import { Category, ApiResponse, CreateCategoryPayload, UpdateCategoryPayload } from '@/types/api';
import {
  FolderTree,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  Star,
  Loader2,
  AlertTriangle,
  Search,
} from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().min(1, 'Description is required'),
  sort_order: z.preprocess((val) => Number(val), z.number().min(0, 'Sort order must be non-negative')),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // Fetch Categories
  const { data: categoriesResponse, isLoading, isError, isFetching } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Category[]>>('/categories');
      return res.data;
    },
  });

  const categories = categoriesResponse?.data || [];
  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Form setup
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema) as any,
    defaultValues: {
      name: '',
      description: '',
      sort_order: 1,
      is_featured: false,
      is_active: true,
    },
  });

  // Reset form when modal opens/closes
  const handleOpenCreate = () => {
    setEditingCategory(null);
    form.reset({
      name: '',
      description: '',
      sort_order: categories.length + 1,
      is_featured: false,
      is_active: true,
    });
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    form.reset({
      name: category.name,
      description: category.description,
      sort_order: category.sort_order,
      is_featured: category.is_featured,
      is_active: category.is_active ?? true,
    });
    setIsCreateOpen(true);
  };

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: async (payload: CreateCategoryPayload) => {
      const res = await apiClient.post<ApiResponse<Category>>('/admin/categories', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully!');
      setIsCreateOpen(false);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to create category';
      toast.error(msg);
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateCategoryPayload }) => {
      const res = await apiClient.put<ApiResponse<Category>>(`/admin/categories/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully!');
      setIsCreateOpen(false);
      setEditingCategory(null);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to update category';
      toast.error(msg);
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete<ApiResponse<null>>(`/admin/categories/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully!');
      setDeletingCategory(null);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to delete category';
      toast.error(msg);
    },
  });

  const onSubmitForm = (data: CategoryFormData) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, payload: data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center space-x-2">
            <FolderTree className="w-6 h-6 text-amber-500" />
            <span>Category Management</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Organize luxury product hierarchy and featured collections.
          </p>
        </div>
        <Button onClick={handleOpenCreate} variant="champagneGold" className="shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          Create Category
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Categories Data Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 text-center border border-red-500/20 rounded-xl bg-red-500/5 text-red-400">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-80" />
          <p className="font-semibold text-base">Failed to load categories</p>
          <p className="text-xs text-muted-foreground mt-1">Check backend connection or try refreshing.</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="p-12 text-center border rounded-xl bg-card/30">
          <FolderTree className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
          <h3 className="font-semibold text-foreground">No Categories Found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {searchTerm ? 'No categories match your search terms.' : 'Get started by creating your first luxury category.'}
          </p>
          {!searchTerm && (
            <Button onClick={handleOpenCreate} variant="outline" className="mt-4">
              <Plus className="w-4 h-4 mr-2" /> Add Category
            </Button>
          )}
        </div>
      ) : (
        <div className={`transition-all duration-200 ${isFetching && !isLoading ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Order</TableHead>
              <TableHead>Category Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="max-w-md">Description</TableHead>
              <TableHead>Badges</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-mono text-xs font-semibold text-muted-foreground">
                  #{category.sort_order}
                </TableCell>
                <TableCell className="font-semibold text-foreground">
                  {category.name}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {category.slug}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-md truncate">
                  {category.description}
                </TableCell>
                <TableCell>
                  {category.is_featured && (
                    <Badge variant="gold" className="flex items-center w-fit space-x-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>Featured</span>
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {category.is_active ? (
                    <Badge variant="success" className="flex items-center w-fit space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Active</span>
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="flex items-center w-fit space-x-1">
                      <XCircle className="w-3 h-3" />
                      <span>Inactive</span>
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEdit(category)}
                      className="h-8 w-8 hover:text-amber-500"
                      title="Edit Category"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingCategory(category)}
                      className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      )}

      {/* Create / Edit Modal Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogHeader>
          <DialogTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</DialogTitle>
          <DialogDescription>
            {editingCategory
              ? 'Update the parameters for this category line.'
              : 'Add a new product category to classify luxury items.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Category Name
            </label>
            <Input
              {...form.register('name')}
              placeholder="e.g. Luxury Timepieces"
            />
            {form.formState.errors.name && (
              <p className="text-xs text-red-400 font-medium">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Description
            </label>
            <Textarea
              {...form.register('description')}
              placeholder="Provide a detailed overview of this luxury collection..."
              rows={3}
            />
            {form.formState.errors.description && (
              <p className="text-xs text-red-400 font-medium">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Sort Order Index
            </label>
            <Input
              type="number"
              {...form.register('sort_order')}
              placeholder="1"
            />
            {form.formState.errors.sort_order && (
              <p className="text-xs text-red-400 font-medium">{form.formState.errors.sort_order.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
            <div>
              <p className="text-sm font-semibold text-foreground">Featured Collection</p>
              <p className="text-xs text-muted-foreground">Highlight on homepage showcase</p>
            </div>
            <Switch
              checked={form.watch('is_featured')}
              onCheckedChange={(checked) => form.setValue('is_featured', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
            <div>
              <p className="text-sm font-semibold text-foreground">Active Status</p>
              <p className="text-xs text-muted-foreground">Visible to customers in shop</p>
            </div>
            <Switch
              checked={form.watch('is_active')}
              onCheckedChange={(checked) => form.setValue('is_active', checked)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" variant="champagneGold" disabled={isSaving}>
              {isSaving ? (
                <span className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </span>
              ) : editingCategory ? (
                'Update Category'
              ) : (
                'Create Category'
              )}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingCategory} onOpenChange={() => setDeletingCategory(null)}>
        <DialogHeader>
          <DialogTitle className="text-red-500 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Confirm Category Deletion</span>
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong className="text-foreground">{deletingCategory?.name}</strong>?
            This action cannot be undone and may affect associated product categorization.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDeletingCategory(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => deletingCategory && deleteMutation.mutate(deletingCategory.id)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <span className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </span>
            ) : (
              'Delete Category'
            )}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
