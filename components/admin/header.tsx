'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home, Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/context/auth-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const paths = pathname.split('/').filter(Boolean);

  return (
    <header className="h-16 border-b bg-card/40 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-3 min-w-0 flex-1 mr-2">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="md:hidden shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Dynamic Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-muted-foreground overflow-x-auto whitespace-nowrap scrollbar-none py-1 min-w-0">
          <Link
            href="/"
            className="hover:text-champagne-gold transition-colors flex items-center shrink-0"
          >
            <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
          {paths.map((path, index) => {
            const href = `/${paths.slice(0, index + 1).join('/')}`;
            const isLast = index === paths.length - 1;
            const formattedPath = path.charAt(0).toUpperCase() + path.slice(1);

            return (
              <React.Fragment key={href}>
                <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground/50 shrink-0" />
                {isLast ? (
                  <span className="font-semibold text-foreground capitalize truncate">{formattedPath}</span>
                ) : (
                  <Link href={href} className="hover:text-foreground transition-colors capitalize shrink-0">
                    {formattedPath}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Header Actions */}
      <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
        <ThemeToggle />
        <div className="h-4 w-px bg-border hidden sm:block" />
        <div className="flex items-center space-x-2">
          <Badge variant="gold" className="capitalize hidden sm:inline-flex">
            {user?.role || 'Admin'}
          </Badge>
          <div className="w-8 h-8 rounded-full bg-champagne-gold/20 text-champagne-gold flex items-center justify-center font-semibold text-xs border border-champagne-gold/30 shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
        </div>
      </div>
    </header>
  );
}
