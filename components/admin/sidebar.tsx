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

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col h-full bg-card/60 backdrop-blur-xl">
      {/* Brand Header */}
      <div className="h-16 px-6 border-b flex items-center justify-between shrink-0">
        <Link href="/admin/dashboard" onClick={onNavigate} className="flex items-center space-x-3 group">
          <div>
            <p className="text-xl font-medium text-muted-foreground uppercase tracking-widest">
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
              onClick={onNavigate}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-champagne-gold/10 text-champagne-gold font-semibold border border-champagne-gold/20 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={cn(
                    'w-4 h-4 transition-transform duration-200 group-hover:scale-110',
                    isActive ? 'text-champagne-gold' : 'text-muted-foreground group-hover:text-foreground'
                  )}
                />
                <span>{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-champagne-gold" />}
            </Link>
          );
        })}
      </div>

      {/* User Footer */}
      <div className="p-4 border-t bg-muted/20 space-y-3 shrink-0">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-9 h-9 rounded-full bg-champagne-gold/20 text-champagne-gold flex items-center justify-center font-bold text-sm border border-champagne-gold/30 shrink-0">
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
          onClick={() => {
            if (onNavigate) onNavigate();
            logout();
          }}
          className="w-full text-muted-foreground hover:text-red-500 hover:border-red-500/40 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 border-r bg-card/60 backdrop-blur-xl flex-col h-screen sticky top-0 z-40 transition-all duration-300">
      <SidebarContent />
    </aside>
  );
}
