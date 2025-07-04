import { redirect } from 'next/navigation';
import { DashboardLayoutClient } from './dashboard-layout-client';
import type { User } from '@/lib/definitions';

export function DashboardLayout({ children, user }: { children: React.ReactNode, user: User | null }) {
  if (!user) {
    // The middleware should handle this, but as a safeguard.
    redirect('/login');
  }

  return (
    <DashboardLayoutClient user={user}>
      {children}
    </DashboardLayoutClient>
  );
}
