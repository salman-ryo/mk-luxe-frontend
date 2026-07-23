'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
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
  AlertTriangle,
  Layers,
  Inbox,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  Activity
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryStat {
  name: string;
  slug: string;
  product_count: number;
}

interface InquiryStat {
  id: string;
  name: string;
  email: string;
  subject: string;
  status: 'pending' | 'in_progress' | 'resolved';
  created_at?: string;
}

interface DashboardStats {
  total_products: number;
  total_categories: number;
  total_inquiries: number;
  product_status_counts: Record<string, number>;
  inquiry_status_counts: Record<string, number>;
  category_stats: CategoryStat[];
  total_stock: number;
  out_of_stock_count: number;
  featured_products_count: number;
  most_sold_products_count: number;
  recent_inquiries: InquiryStat[];
}

export default function DashboardPage() {
  // Fetch unified dashboard statistics
  const { data: statsResponse, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<DashboardStats>>('/admin/stats');
      return res.data;
    },
  });

  const stats = statsResponse?.data;

  // Find max product count in categories to compute relative percentages for progress bars
  const maxProductCount = React.useMemo(() => {
    if (!stats?.category_stats?.length) return 0;
    return Math.max(...stats.category_stats.map((c) => c.product_count));
  }, [stats?.category_stats]);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Welcome Banner Skeleton */}
        <Skeleton className="h-40 w-full rounded-2xl" />

        {/* Metric Cards Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>

        {/* Detailed Layout Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[400px] lg:col-span-2 rounded-xl" />
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="p-8 text-center border border-red-500/20 rounded-2xl bg-red-500/5 text-red-400 max-w-xl mx-auto mt-12 space-y-4">
        <AlertTriangle className="w-12 h-12 mx-auto opacity-85 text-red-500" />
        <div>
          <h2 className="font-extrabold text-lg text-foreground">Failed to Load Dashboard Stats</h2>
          <p className="text-sm text-muted-foreground mt-1">
            We encountered an error contacting the admin statistics service. Check backend connection.
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" className="border-red-500/30 hover:bg-red-500/10 text-foreground">
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950/40 p-6 md:p-8 border border-blue-500/20 shadow-xl overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-950 border border-champagne-gold/20 text-champagne-gold text-xs font-semibold">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Products Metric */}
        <Card className="relative overflow-hidden border-border/80 hover:border-champagne-gold/40 transition-all bg-card/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Products
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-champagne-gold/10 text-champagne-gold flex items-center justify-center border border-champagne-gold/20">
              <Package className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-foreground">
              {stats.total_products}
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500 mr-1" />
              <span>{stats.product_status_counts?.published || 0} published items</span>
            </p>
          </CardContent>
        </Card>

        {/* Categories Metric */}
        <Card className="relative overflow-hidden border-border/80 hover:border-champagne-gold/40 transition-all bg-card/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Product Categories
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center border border-sky-500/20">
              <FolderTree className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-foreground">
              {stats.total_categories}
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-500 mr-1" />
              <span>Luxury collection lines</span>
            </p>
          </CardContent>
        </Card>

        {/* Total Stock Metric */}
        <Card className="relative overflow-hidden border-border/80 hover:border-champagne-gold/40 transition-all bg-card/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Stock
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
              <Layers className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-foreground">
              {stats.total_stock.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-2 flex items-center">
              {stats.out_of_stock_count > 0 ? (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-champagne-gold mr-1" />
                  <span className="text-champagne-gold font-medium">{stats.out_of_stock_count} items out of stock</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1" />
                  <span className="text-emerald-500 font-medium">All items in stock</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Featured Showcase Metric */}
        <Card className="relative overflow-hidden border-border/80 hover:border-champagne-gold/40 transition-all bg-card/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Storefront Badges
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20">
              <Activity className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-foreground">
              {stats.featured_products_count + stats.most_sold_products_count}
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 mr-1" />
              <span>{stats.featured_products_count} featured, {stats.most_sold_products_count} top sellers</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Section details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Category Inventory distribution list (spans 2) */}
        <Card className="lg:col-span-2 border-border/80 bg-card/20 backdrop-blur-sm">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-champagne-gold" />
              <div>
                <CardTitle className="text-base font-bold">Category Catalog Distribution</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Number of active luxury products grouped by database collection.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {stats.category_stats?.length > 0 ? (
                stats.category_stats.map((c) => {
                  const percentage = maxProductCount > 0 ? Math.round((c.product_count / maxProductCount) * 100) : 0;
                  return (
                    <div key={c.slug} className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-foreground">{c.name}</span>
                        <span className="text-muted-foreground font-mono bg-muted/40 px-2 py-0.5 rounded border border-border/40">
                          {c.product_count} product{c.product_count !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="w-full bg-[#1b1b1f] border border-border/50 h-2 rounded-full overflow-hidden shadow-inner">
                        <div
                          className="bg-gradient-to-r from-champagne-gold to-muted-bronze h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  No catalog category statistics found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right: Recent Inquiries (spans 1) */}
        <Card className="border-border/80 bg-card/20 backdrop-blur-sm flex flex-col">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-champagne-gold" />
              <div>
                <CardTitle className="text-base font-bold">Recent Inquiries</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Latest customer query form responses.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 flex-1 flex flex-col justify-start">
            <div className="space-y-4 flex-1">
              {stats.recent_inquiries?.length > 0 ? (
                stats.recent_inquiries.slice(0, 4).map((inq) => (
                  <div key={inq.id} className="p-3 rounded-lg border bg-muted/20 border-border/50 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground truncate max-w-[140px]">{inq.name}</span>
                      {inq.status === 'pending' && <Badge variant="warning">Pending</Badge>}
                      {inq.status === 'in_progress' && <Badge variant="info">Ongoing</Badge>}
                      {inq.status === 'resolved' && <Badge variant="success">Resolved</Badge>}
                    </div>
                    <p className="text-muted-foreground truncate font-mono text-[10px]">{inq.email}</p>
                    <p className="text-foreground font-medium mt-1 truncate">{inq.subject}</p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-12 px-4 space-y-3 h-full border border-dashed border-border/50 rounded-xl bg-muted/10">
                  <Inbox className="w-8 h-8 text-muted-foreground/60" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">Inbox is Clear</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      No customer custom orders or support inquiries submitted yet.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Shortcut Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight text-foreground">Quick Management Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/products" className="group">
            <Card className="p-5 border border-border/80 hover:border-champagne-gold/40 hover:bg-muted/30 transition-all cursor-pointer bg-card/30 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-champagne-gold/10 text-champagne-gold flex items-center justify-center group-hover:scale-110 transition-transform border border-champagne-gold/20">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm group-hover:text-champagne-gold transition-colors">
                      Manage Products
                    </h3>
                    <p className="text-xs text-muted-foreground">Add or update catalog items</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-champagne-gold transition-colors" />
              </div>
            </Card>
          </Link>

          <Link href="/admin/categories" className="group">
            <Card className="p-5 border border-border/80 hover:border-champagne-gold/40 hover:bg-muted/30 transition-all cursor-pointer bg-card/30 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center group-hover:scale-110 transition-transform border border-sky-500/20">
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
            <Card className="p-5 border border-border/80 hover:border-champagne-gold/40 hover:bg-muted/30 transition-all cursor-pointer bg-card/30 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform border border-emerald-500/20">
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
