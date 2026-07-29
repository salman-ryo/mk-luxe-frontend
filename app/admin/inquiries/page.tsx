'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Inquiry, ApiResponse, PaginatedResponse, UpdateInquiryStatusPayload } from '@/types/api';
import {
  MessageSquare,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mail,
  Phone,
  User,
} from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function InquiriesPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Fetch Inquiries
  const { data: inquiriesResponse, isLoading, isError, isFetching } = useQuery({
    queryKey: ['inquiries'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Inquiry[]> | PaginatedResponse<Inquiry>>('/admin/inquiries');
      if (Array.isArray(res.data.data)) {
        return res.data.data;
      }
      return [];
    },
  });

  const inquiries = inquiriesResponse || [];

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || inquiry.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Mutation to update inquiry status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'pending' | 'in_progress' | 'resolved' }) => {
      const payload: UpdateInquiryStatusPayload = { status };
      const res = await apiClient.patch<ApiResponse<Inquiry>>(`/admin/inquiries/${id}/status`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
      toast.success('Inquiry status updated!');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to update inquiry status';
      toast.error(msg);
    },
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center space-x-2">
            <MessageSquare className="w-6 h-6 text-champagne-gold" />
            <span>Customer Inquiries</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review client questions, support requests, and status resolutions.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-card/40 p-4 border rounded-xl backdrop-blur-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by client name, email, or message subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48 bg-[#0a0a0c] border border-border px-3 py-2 text-xs uppercase tracking-widest focus:outline-none focus:border-primary rounded-md text-foreground"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Inquiries Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 text-center border border-red-500/20 rounded-xl bg-red-500/5 text-red-400">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-80" />
          <p className="font-semibold text-base">Failed to load inquiries</p>
          <p className="text-xs text-muted-foreground mt-1">Verify admin permissions or API status.</p>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="p-12 text-center border rounded-xl bg-card/30">
          <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
          <h3 className="font-semibold text-foreground">No Inquiries Found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {searchTerm || statusFilter
              ? 'No inquiries match your current search parameters.'
              : 'No client inquiries recorded yet.'}
          </p>
        </div>
      ) : (
        <div className={`transition-all duration-200 ${isFetching && !isLoading ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
          {/* Mobile Inquiries Cards (< md) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredInquiries.map((inquiry) => (
              <div key={inquiry.id} className="p-4 border border-border/80 rounded-xl bg-card/30 backdrop-blur-sm space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center space-x-1.5 font-semibold text-foreground text-sm">
                      <User className="w-3.5 h-3.5 text-champagne-gold shrink-0" />
                      <span className="truncate">{inquiry.name}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{inquiry.email}</span>
                    </div>
                    {inquiry.phone && (
                      <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        <span>{inquiry.phone}</span>
                      </div>
                    )}
                  </div>

                  {inquiry.status === 'pending' && (
                    <Badge variant="warning" className="flex items-center space-x-1 text-[10px] shrink-0">
                      <Clock className="w-2.5 h-2.5" />
                      <span>Pending</span>
                    </Badge>
                  )}
                  {inquiry.status === 'in_progress' && (
                    <Badge variant="info" className="flex items-center space-x-1 text-[10px] shrink-0">
                      <AlertCircle className="w-2.5 h-2.5" />
                      <span>In Progress</span>
                    </Badge>
                  )}
                  {inquiry.status === 'resolved' && (
                    <Badge variant="success" className="flex items-center space-x-1 text-[10px] shrink-0">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>Resolved</span>
                    </Badge>
                  )}
                </div>

                <div className="pt-2 border-t border-border/50">
                  <p className="text-xs font-semibold text-foreground">{inquiry.subject}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">{inquiry.message}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                  <span className="text-[11px] text-muted-foreground">Update status:</span>
                  <select
                    value={inquiry.status}
                    onChange={(e) =>
                      updateStatusMutation.mutate({
                        id: inquiry.id,
                        status: e.target.value as 'pending' | 'in_progress' | 'resolved',
                      })
                    }
                    disabled={updateStatusMutation.isPending}
                    className="w-36 text-xs h-8 bg-[#0a0a0c] border border-border px-2 py-1 focus:outline-none focus:border-primary rounded-md text-foreground cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Inquiries Table (>= md) */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-border/80">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Details</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="max-w-md">Message Content</TableHead>
                  <TableHead>Current Status</TableHead>
                  <TableHead className="text-right">Update Status Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInquiries.map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1.5 font-semibold text-foreground text-sm">
                          <User className="w-3.5 h-3.5 text-champagne-gold shrink-0" />
                          <span>{inquiry.name}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
                          <Mail className="w-3.5 h-3.5 shrink-0" />
                          <span>{inquiry.email}</span>
                        </div>
                        {inquiry.phone && (
                          <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
                            <Phone className="w-3.5 h-3.5 shrink-0" />
                            <span>{inquiry.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="font-medium">{inquiry.subject}</TableCell>

                    <TableCell className="max-w-md">
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {inquiry.message}
                      </p>
                    </TableCell>

                    <TableCell>
                      {inquiry.status === 'pending' && (
                        <Badge variant="warning" className="flex items-center w-fit space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>Pending</span>
                        </Badge>
                      )}
                      {inquiry.status === 'in_progress' && (
                        <Badge variant="info" className="flex items-center w-fit space-x-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>In Progress</span>
                        </Badge>
                      )}
                      {inquiry.status === 'resolved' && (
                        <Badge variant="success" className="flex items-center w-fit space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Resolved</span>
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <select
                        value={inquiry.status}
                        onChange={(e) =>
                          updateStatusMutation.mutate({
                            id: inquiry.id,
                            status: e.target.value as 'pending' | 'in_progress' | 'resolved',
                          })
                        }
                        disabled={updateStatusMutation.isPending}
                        className="w-36 text-xs h-9 inline-block bg-[#0a0a0c] border border-border px-2 py-1 focus:outline-none focus:border-primary rounded-md text-foreground cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
