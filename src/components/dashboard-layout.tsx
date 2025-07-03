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
  Settings,
  LogOut,
  type LucideIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card } from './ui/card';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/user-context';

// Define a type for menu items with roles
type MenuItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: Array<'admin' | 'auditor'>;
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { toast } = useToast();
  const user = useUser();

  const allMenuItems: MenuItem[] = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'auditor'] },
    { href: '/audits', label: 'Audits', icon: CalendarDays, roles: ['admin', 'auditor'] },
    { href: '/checklists', label: 'Checklists', icon: ClipboardCheck, roles: ['admin', 'auditor'] },
    // Risk Assessment is only visible to admins
    { href: '/risk-assessment', label: 'Risk Assessment', icon: AlertTriangle, roles: ['admin'] },
    { href: '/reports', label: 'Reports', icon: FileText, roles: ['admin', 'auditor'] },
    { href: '/documents', label: 'Documents', icon: Folder, roles: ['admin', 'auditor'] },
  ];

  // Filter menu items based on the current user's role
  const menuItems = allMenuItems.filter(item => item.roles.includes(user.role));

  const handleSettingsClick = () => {
    toast({
      title: "Settings",
      description: "This would open a settings page or modal for the user.",
    });
  };

  const handleLogoutClick = () => {
    // In a real app, this would trigger a sign-out flow with an authentication provider
    // and redirect the user to a login page.
    toast({
      title: "Logout",
      description: "You have been logged out.",
    });
  };

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
                <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="user avatar" />
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
                <SidebarMenuButton onClick={handleSettingsClick}>
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogoutClick}>
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
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
