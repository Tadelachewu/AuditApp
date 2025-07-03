
import { fetchDocuments } from "@/lib/queries";
import DocumentsClientPage from "./documents-client-page";

export default async function DocumentsPage() {
  const documents = await fetchDocuments();
  return <DocumentsClientPage documents={documents || []} />;
}
