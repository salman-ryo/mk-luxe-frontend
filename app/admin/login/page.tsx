'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Gem, Lock, Mail, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, isAuthLoading, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const isLoadingState = isSubmitting || isLoggingIn;

  const onSubmit = async (data: LoginFormData) => {
    setErrorMsg(null);
    setIsLoggingIn(true);
    try {
      await login(data.email, data.password);
      toast.success('Successfully authenticated!');
    } catch (err: any) {
      console.error(err);
      const msg = err.message || 'Invalid email or password';
      setErrorMsg(msg);
      toast.error(msg);
      setIsLoggingIn(false);
    }
  };

  if (isAuthLoading && !isLoggingIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
        <div className="flex flex-col items-center space-y-4 text-center z-10 animate-in fade-in duration-300">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/25 animate-pulse">
            <Gem className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-amber-200/80 flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
            <span>Verifying session...</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden animate-in fade-in duration-300">
      {/* Background Decorative Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />

      <Card className="w-full max-w-md border-amber-500/20 bg-slate-900/80 backdrop-blur-2xl shadow-2xl shadow-amber-500/5 relative z-10">
        <CardHeader className="space-y-3 text-center pb-6 border-b border-slate-800">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/25 mb-2">
            <Gem className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
            MK LUXE ADMIN
          </CardTitle>
          <CardDescription className="text-slate-400 text-sm">
            Enter your credentials to access the management portal
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center space-x-2 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <Input
                  {...register('email')}
                  type="email"
                  disabled={isLoadingState}
                  placeholder="admin@example.com"
                  className="pl-9 bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-amber-500/50 disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  disabled={isLoadingState}
                  placeholder="••••••••"
                  className="pl-9 pr-10 bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-amber-500/50 disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  disabled={isLoadingState}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 font-medium">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoadingState}
              variant="champagneGold"
              className="w-full mt-6 h-11 text-slate-950 font-bold tracking-wide transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoadingState ? (
                <span className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </span>
              ) : (
                'Sign In to Dashboard'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center border-t border-slate-800/80 py-4 text-center">
          <p className="text-xs text-slate-500">
            Protected by HttpOnly JWT Cookie Authentication
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
