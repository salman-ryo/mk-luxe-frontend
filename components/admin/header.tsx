'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/context/auth-context';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const pathname = usePathname();
  const { user } = useAuth();

  const paths = pathname.split('/').filter(Boolean);

  return (
    <header className="h-16 border-b bg-card/40 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Dynamic Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Link
          href="/admin/dashboard"
          className="hover:text-amber-500 transition-colors flex items-center"
        >
          <Home className="w-4 h-4" />
        </Link>
        {paths.map((path, index) => {
          const href = `/${paths.slice(0, index + 1).join('/')}`;
          const isLast = index === paths.length - 1;
          const formattedPath = path.charAt(0).toUpperCase() + path.slice(1);

          return (
            <React.Fragment key={href}>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
              {isLast ? (
                <span className="font-semibold text-foreground capitalize">{formattedPath}</span>
              ) : (
                <Link href={href} className="hover:text-foreground transition-colors capitalize">
                  {formattedPath}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Header Actions */}
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center space-x-2">
          <Badge variant="gold" className="capitalize">
            {user?.role || 'Admin'}
          </Badge>
          <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-semibold text-xs border border-amber-500/30">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
        </div>
      </div>
    </header>
  );
}
