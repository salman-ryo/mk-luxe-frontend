'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { ApiResponse, Product } from '@/types/api';
import {
  FileJson,
  Code2,
  Wand2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const DEFAULT_SAMPLE_JSON = {
  category_slug: 'rings',
  name: 'Silver Tone Heart Crystal Adjustable Ring',
  slug: 'silver-tone-heart-crystal-adjustable-ring',
  description:
    'Add a romantic touch to your style with this silver-tone adjustable ring. Showcasing a sparkling heart-shaped central crystal accented by delicate side stones on an open band. Finished with an anti-tarnish coating for long-lasting, everyday beauty.',
  status: 'published',
  is_featured: false,
  is_most_sold: false,
  variants: [
    {
      sku: 'RING-HRT-002',
      price: 699.0,
      stock: 30,
      is_default: true,
    },
  ],
  media: [
    {
      url: 'photo_2026-07-19_13-09-52.jpg',
      alt_text: 'Silver tone adjustable ring featuring a heart-shaped center crystal and small side stones',
      is_primary: true,
    },
  ],
  faqs: [
    {
      question: 'Is the ring size adjustable?',
      answer: 'Yes, the ring features an open back design that allows you to gently adjust it for a comfortable, custom fit.',
    },
    {
      question: 'Will the silver tone fade?',
      answer: 'No, this ring is treated with a premium anti-tarnish finish to maintain its bright silver tone and resist fading over time.',
    },
  ],
  meta_title: 'Silver Tone Heart Crystal Ring | Adjustable Anti-Tarnish',
  meta_description:
    'Discover the Silver Tone Heart Crystal Adjustable Ring. Featuring a sparkling heart stone, delicate side accents, and a lasting anti-tarnish finish.',
};

interface JsonProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JsonProductModal({ isOpen, onClose }: JsonProductModalProps) {
  const queryClient = useQueryClient();
  const [jsonInput, setJsonInput] = useState<string>(
    JSON.stringify(DEFAULT_SAMPLE_JSON, null, 2)
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  // Validate JSON syntax on change
  const handleInputChange = (value: string) => {
    setJsonInput(value);
    if (!value.trim()) {
      setValidationError('JSON payload cannot be empty');
      return;
    }
    try {
      JSON.parse(value);
      setValidationError(null);
    } catch (err: any) {
      setValidationError(err.message || 'Invalid JSON syntax');
    }
  };

  // Format / Pretty Print JSON
  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonInput(formatted);
      setValidationError(null);
      toast.success('JSON formatted successfully!');
    } catch (err: any) {
      toast.error('Cannot format invalid JSON');
    }
  };

  // Load Sample Template
  const handleLoadSample = () => {
    const formatted = JSON.stringify(DEFAULT_SAMPLE_JSON, null, 2);
    setJsonInput(formatted);
    setValidationError(null);
    toast.info('Sample product JSON loaded');
  };

  // Create Product Mutation
  const createProductMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await apiClient.post<ApiResponse<Product>>('/admin/products', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully from JSON!');
      onClose();
    },
    onError: (err: any) => {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to create product from JSON';
      toast.error(msg);
    },
  });

  const handleSubmit = () => {
    if (!jsonInput.trim()) {
      toast.error('Please provide a valid JSON payload');
      return;
    }

    try {
      const parsedPayload = JSON.parse(jsonInput);
      createProductMutation.mutate(parsedPayload);
    } catch (err: any) {
      toast.error('Invalid JSON: ' + (err.message || 'Check syntax'));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
          <DialogTitle className="text-xl font-bold flex items-center space-x-2 text-foreground">
            <FileJson className="w-5 h-5 text-champagne-gold" />
            <span>Direct JSON Product Input</span>
          </DialogTitle>
          <div className="flex items-center space-x-2">
            {!validationError ? (
              <Badge variant="success" className="flex items-center space-x-1 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Valid JSON</span>
              </Badge>
            ) : (
              <Badge variant="destructive" className="flex items-center space-x-1 text-[11px]">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Invalid Syntax</span>
              </Badge>
            )}
          </div>
        </div>
        <DialogDescription className="text-xs text-muted-foreground mt-1">
          Paste or format raw product JSON payload to submit directly to the creation API endpoint.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-3 py-3">
        {/* Editor Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-muted/40 p-2 rounded-lg border">
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleFormatJson}
              className="h-8 text-xs"
              title="Pretty Print JSON"
            >
              <Wand2 className="w-3.5 h-3.5 mr-1.5 text-champagne-gold" /> Format JSON
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleLoadSample}
              className="h-8 text-xs"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-sky-400" /> Load Sample
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setJsonInput('');
              setValidationError('JSON payload cannot be empty');
            }}
            className="h-8 text-xs text-muted-foreground hover:text-red-400"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Clear
          </Button>
        </div>

        {/* JSON Editor Textarea */}
        <div className="relative">
          <textarea
            value={jsonInput}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Paste your JSON product body here..."
            className="w-full h-80 p-4 font-mono text-xs bg-slate-950 text-emerald-400 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold/50 leading-relaxed overflow-y-auto selection:bg-champagne-gold/30 selection:text-white"
            spellCheck={false}
          />
        </div>

        {validationError && (
          <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-mono">{validationError}</span>
          </div>
        )}
      </div>

      <DialogFooter className="border-t pt-4">
        <Button variant="outline" onClick={onClose} disabled={createProductMutation.isPending}>
          Cancel
        </Button>
        <Button
          variant="champagneGold"
          onClick={handleSubmit}
          disabled={!!validationError || createProductMutation.isPending}
        >
          {createProductMutation.isPending ? (
            <span className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating Product...</span>
            </span>
          ) : (
            <span className="flex items-center space-x-2">
              <Code2 className="w-4 h-4" />
              <span>Create Product API</span>
            </span>
          )}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
