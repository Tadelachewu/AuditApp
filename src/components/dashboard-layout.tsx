"use client";

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardCheck,
  AlertTriangle,
  FileText,
  Folder,
  type LucideIcon,
} from 'lucide-react';

type MenuItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/audits', label: 'Audits', icon: CalendarDays },
    { href: '/checklists', label: 'Checklists', icon: ClipboardCheck },
    { href: '/risk-assessment', label: 'Risk Assessment', icon: AlertTriangle },
    { href: '/reports', label: 'Reports', icon: FileText },
    { href: '/documents', label: 'Documents', icon: Folder },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <span>
                      <item.icon />
                      <span>{item.label}</span>
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
            <SidebarTrigger className="md:hidden"/>
            <div className="w-full flex-1">
                {/* Can add a search bar here if needed */}
            </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
