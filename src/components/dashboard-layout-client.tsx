"use client";

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { User } from '@prisma/client';
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
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { logout } from '@/lib/actions';

type MenuItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: User['role'][];
};

function UserNav({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{user.name?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={logout}>
          <DropdownMenuItem asChild>
            <button className="w-full text-left flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export function DashboardLayoutClient({ children, user }: { children: React.ReactNode; user: User }) {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'AUDITOR', 'MANAGER'] },
    { href: '/audits', label: 'Audits', icon: CalendarDays, roles: ['ADMIN', 'AUDITOR', 'MANAGER'] },
    { href: '/checklists', label: 'Checklists', icon: ClipboardCheck, roles: ['ADMIN', 'AUDITOR', 'MANAGER'] },
    { href: '/risk-assessment', label: 'Risk Assessment', icon: AlertTriangle, roles: ['ADMIN'] },
    { href: '/reports', label: 'Reports', icon: FileText, roles: ['ADMIN', 'AUDITOR', 'MANAGER'] },
    { href: '/documents', label: 'Documents', icon: Folder, roles: ['ADMIN', 'AUDITOR', 'MANAGER'] },
  ];

  const accessibleMenuItems = menuItems.filter(item => item.roles.includes(user.role));

  return (
     <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {accessibleMenuItems.map((item) => (
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
        <header className="flex h-14 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
            <SidebarTrigger className="md:hidden"/>
            <div className="w-full flex-1">
                {/* Can add a search bar here if needed */}
            </div>
            <UserNav user={user} />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
