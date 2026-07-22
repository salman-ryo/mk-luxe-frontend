'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import {
  ApiResponse,
  PaginatedResponse,
  Product,
  Category,
  Inquiry,
} from '@/types/api';
import {
  Package,
  FolderTree,
  MessageSquare,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  // Fetch Products count
  const { data: productsData, isLoading: isProductsLoading } = useQuery({
    queryKey: ['products-overview'],
    queryFn: async () => {
      const res = await apiClient.get<PaginatedResponse<Product>>('/products?limit=1');
      return res.data;
    },
  });

  // Fetch Categories count
  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories-overview'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Category[]>>('/categories');
      return res.data;
    },
  });

  // Fetch Inquiries
  const { data: inquiriesData, isLoading: isInquiriesLoading } = useQuery({
    queryKey: ['inquiries-overview'],
    queryFn: async () => {
      try {
        const res = await apiClient.get<ApiResponse<Inquiry[]> | PaginatedResponse<Inquiry>>('/admin/inquiries');
        if (Array.isArray(res.data.data)) {
          return res.data.data;
        }
        return [];
      } catch {
        return [];
      }
    },
  });

  const totalProducts = productsData?.pagination?.total ?? (Array.isArray(productsData?.data) ? productsData.data.length : 0);
  const activeCategories = Array.isArray(categoriesData?.data)
    ? categoriesData.data.filter((c) => c.is_active).length
    : 0;
  const pendingInquiries = Array.isArray(inquiriesData)
    ? inquiriesData.filter((i) => i.status === 'pending').length
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950/40 p-6 md:p-8 border border-blue-500/20 shadow-xl overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-950 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MK LUXE Executive Dashboard</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            Welcome Back, Administrator
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Monitor luxury catalog metrics, update categories, and handle customer inquiries seamlessly.
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Products Metric */}
        <Card className="relative overflow-hidden border-border/80 hover:border-amber-500/40 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Total Products
            </CardTitle>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
              <Package className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            {isProductsLoading ? (
              <Skeleton className="h-9 w-24 mb-2" />
            ) : (
              <div className="text-3xl font-bold tracking-tight text-foreground">
                {totalProducts}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500 mr-1" />
              <span>Catalog items active in store</span>
            </p>
          </CardContent>
        </Card>

        {/* Categories Metric */}
        <Card className="relative overflow-hidden border-border/80 hover:border-amber-500/40 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Active Categories
            </CardTitle>
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center border border-sky-500/20">
              <FolderTree className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            {isCategoriesLoading ? (
              <Skeleton className="h-9 w-24 mb-2" />
            ) : (
              <div className="text-3xl font-bold tracking-tight text-foreground">
                {activeCategories}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-500 mr-1" />
              <span>Published luxury product lines</span>
            </p>
          </CardContent>
        </Card>

        {/* Pending Inquiries Metric */}
        <Card className="relative overflow-hidden border-border/80 hover:border-amber-500/40 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Pending Inquiries
            </CardTitle>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
              <MessageSquare className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            {isInquiriesLoading ? (
              <Skeleton className="h-9 w-24 mb-2" />
            ) : (
              <div className="text-3xl font-bold tracking-tight text-amber-500">
                {pendingInquiries}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2 flex items-center">
              <Clock className="w-3.5 h-3.5 text-amber-500 mr-1" />
              <span>Awaiting response or resolution</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Shortcut Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight text-foreground">Quick Management Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/products" className="group">
            <Card className="p-5 border border-border/80 hover:border-amber-500/40 hover:bg-muted/30 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm group-hover:text-amber-500 transition-colors">
                      Manage Products
                    </h3>
                    <p className="text-xs text-muted-foreground">Add or update catalog items</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-amber-500 transition-colors" />
              </div>
            </Card>
          </Link>

          <Link href="/admin/categories" className="group">
            <Card className="p-5 border border-border/80 hover:border-amber-500/40 hover:bg-muted/30 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FolderTree className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm group-hover:text-sky-500 transition-colors">
                      Manage Categories
                    </h3>
                    <p className="text-xs text-muted-foreground">Structure luxury categories</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-sky-500 transition-colors" />
              </div>
            </Card>
          </Link>

          <Link href="/admin/inquiries" className="group">
            <Card className="p-5 border border-border/80 hover:border-amber-500/40 hover:bg-muted/30 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm group-hover:text-emerald-500 transition-colors">
                      Customer Inquiries
                    </h3>
                    <p className="text-xs text-muted-foreground">Respond to client support</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
