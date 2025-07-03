import { fetchDocuments } from "@/lib/queries";
import DocumentsClientPage from "./documents-client-page";
import { DashboardLayout } from "@/components/dashboard-layout";
import { getSession } from "@/lib/session";

export default async function DocumentsPage() {
  const user = await getSession();
  const documents = await fetchDocuments();
  return (
    <DashboardLayout user={user}>
      <DocumentsClientPage documents={documents || []} />
    </DashboardLayout>
  );
}
