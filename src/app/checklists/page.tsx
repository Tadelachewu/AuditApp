import { fetchChecklists } from "@/lib/queries";
import ChecklistClientPage from "./checklists-client-page";
import { DashboardLayout } from "@/components/dashboard-layout";
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session-crypto';

export default async function ChecklistsPage() {
  const sessionCookie = cookies().get('session')?.value;
  const session = sessionCookie ? await decrypt(sessionCookie) : null;
  const checklists = await fetchChecklists();

  return (
    <DashboardLayout user={session}>
      <ChecklistClientPage checklists={checklists || []} userRole={session?.role} />
    </DashboardLayout>
  );
}
