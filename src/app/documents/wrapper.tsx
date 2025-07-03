import { fetchDocuments } from "@/lib/queries";
import DocumentsClientPage from "./page";

export default async function DocumentsPageWrapper() {
  const documents = await fetchDocuments();
  return <DocumentsClientPage documents={documents} />;
}
