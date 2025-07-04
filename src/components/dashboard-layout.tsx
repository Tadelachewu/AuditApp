import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { DashboardLayoutClient } from './dashboard-layout-client';

export async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
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
