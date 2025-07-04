import { fetchDocuments } from "@/lib/queries";
import DocumentsClientPage from "./documents-client-page";
import { DashboardLayout } from "@/components/dashboard-layout";
import { getSession } from "@/lib/session";

export default async function DocumentsPage() {
  const session = await getSession();
  const documents = await fetchDocuments();

  return (
    <DashboardLayout user={session}>
      <DocumentsClientPage documents={documents || []} userRole={session?.role} />
    </DashboardLayout>
  );
}
