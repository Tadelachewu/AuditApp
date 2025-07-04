import { fetchDocuments } from "@/lib/queries";
import DocumentsClientPage from "./documents-client-page";
import { DashboardLayout } from "@/components/dashboard-layout";
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session-crypto';

export default async function DocumentsPage() {
  const sessionCookie = cookies().get('session')?.value;
  const session = sessionCookie ? await decrypt(sessionCookie) : null;
  const documents = await fetchDocuments();

  return (
    <DashboardLayout user={session}>
      <DocumentsClientPage documents={documents || []} userRole={session?.role} />
    </DashboardLayout>
  );
}
