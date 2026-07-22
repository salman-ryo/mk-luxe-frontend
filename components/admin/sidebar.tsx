'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderTree,
  Package,
  MessageSquare,
  LogOut,
  Gem,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Categories',
    href: '/admin/categories',
    icon: FolderTree,
  },
  {
    name: 'Products',
    href: '/admin/products',
    icon: Package,
  },
  {
    name: 'Inquiries',
    href: '/admin/inquiries',
    icon: MessageSquare,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 border-r bg-card/60 backdrop-blur-xl flex flex-col h-screen sticky top-0 z-40 transition-all duration-300">
      {/* Brand Header */}
      <div className="h-16 px-6 border-b flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Gem className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-wide bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
              MK LUXE
            </h1>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
              Admin Portal
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2">
          <p className="text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider">
            Menu
          </p>
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-amber-500/10 text-amber-500 font-semibold border border-amber-500/20 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={cn(
                    'w-4 h-4 transition-transform duration-200 group-hover:scale-110',
                    isActive ? 'text-amber-500' : 'text-muted-foreground group-hover:text-foreground'
                  )}
                />
                <span>{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-500" />}
            </Link>
          );
        })}
      </div>

      {/* User Footer */}
      <div className="p-4 border-t bg-muted/20 space-y-3">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-sm border border-amber-500/30 shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user?.name || 'Admin User'}</p>
            <div className="flex items-center space-x-1 text-[11px] text-muted-foreground">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span className="capitalize">{user?.role || 'administrator'}</span>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="w-full text-muted-foreground hover:text-red-500 hover:border-red-500/40 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5 mr-2" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
