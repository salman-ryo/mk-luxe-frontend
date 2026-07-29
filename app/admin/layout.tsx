'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AuthGuard } from '@/components/auth-guard';
import { Sidebar, SidebarContent } from '@/components/admin/sidebar';
import { Header } from '@/components/admin/header';
import { Sheet } from '@/components/ui/sheet';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-background text-foreground">
        {/* Desktop Fixed Sidebar */}
        <Sidebar />

        {/* Mobile Slide-out Drawer Sheet */}
        <Sheet
          open={isMobileOpen}
          onOpenChange={setIsMobileOpen}
          className="p-0 w-72 max-w-[80vw] bg-card border-r border-border md:hidden"
        >
          <SidebarContent onNavigate={() => setIsMobileOpen(false)} />
        </Sheet>

        <div className="flex-1 flex flex-col min-w-0">
          <Header onMenuClick={() => setIsMobileOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto min-w-0">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
