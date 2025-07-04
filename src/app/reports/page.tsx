import { fetchReports } from "@/lib/queries";
import ReportsClientPage from "./reports-client-page";
import { DashboardLayout } from "@/components/dashboard-layout";
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session-crypto';

export default async function ReportsPage() {
  const sessionCookie = cookies().get('session')?.value;
  const session = sessionCookie ? await decrypt(sessionCookie) : null;
  const reports = await fetchReports();
  return (
    <DashboardLayout user={session}>
      <ReportsClientPage reports={reports || []} />
    </DashboardLayout>
  );
}
