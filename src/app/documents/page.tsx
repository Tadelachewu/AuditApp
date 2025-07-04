import { fetchDocuments } from "@/lib/queries";
import DocumentsClientPage from "./documents-client-page";
import { DashboardLayout } from "@/components/dashboard-layout";
import { getSession } from "@/lib/session";

export default async function DocumentsPage() {
  const documents = await fetchDocuments();
  const session = await getSession();

  return (
    <DashboardLayout>
      <DocumentsClientPage documents={documents || []} userRole={session?.role} />
    </DashboardLayout>
  );
}
