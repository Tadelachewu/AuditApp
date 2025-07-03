import { fetchDocuments } from "@/lib/queries";
import DocumentsClientPage from "./documents-client-page";
import { DashboardLayout } from "@/components/dashboard-layout";

export default async function DocumentsPage() {
  const documents = await fetchDocuments();
  return (
    <DashboardLayout>
      <DocumentsClientPage documents={documents || []} />
    </DashboardLayout>
  );
}
