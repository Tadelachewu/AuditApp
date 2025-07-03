"use client";

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { User } from '@prisma/client';
import { logout } from '@/lib/actions';

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
  Settings,
  LogOut,
  type LucideIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card } from './ui/card';

type MenuItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: Array<User['role']>;
};

export function DashboardLayout({ user, children }: { user: User, children: React.ReactNode }) {
  const pathname = usePathname();

  const allMenuItems: MenuItem[] = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'AUDITOR'] },
    { href: '/audits', label: 'Audits', icon: CalendarDays, roles: ['ADMIN', 'AUDITOR'] },
    { href: '/checklists', label: 'Checklists', icon: ClipboardCheck, roles: ['ADMIN', 'AUDITOR'] },
    { href: '/risk-assessment', label: 'Risk Assessment', icon: AlertTriangle, roles: ['ADMIN'] },
    { href: '/reports', label: 'Reports', icon: FileText, roles: ['ADMIN', 'AUDITOR'] },
    { href: '/documents', label: 'Documents', icon: Folder, roles: ['ADMIN', 'AUDITOR'] },
    { href: '/settings', label: 'Settings', icon: Settings, roles: ['ADMIN', 'AUDITOR'] },
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(user.role));

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
        <Card className="m-2 bg-sidebar-border/60 border-sidebar-border">
          <SidebarHeader>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={`https://placehold.co/40x40.png?text=${user.name.charAt(0)}`} alt={user.name} data-ai-hint="user avatar" />
                <AvatarFallback>{user.name.split(' ').map(n => n[0]).slice(0,2).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-sm">
                <span className="font-semibold text-sidebar-foreground">{user.name}</span>
                <span className="text-sidebar-foreground/70">{user.email}</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarMenu>
              <SidebarMenuItem>
                <form action={logout}>
                  <SidebarMenuButton className='w-full'>
                    <LogOut />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </form>
              </SidebarMenuItem>
          </SidebarMenu>
        </Card>
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
