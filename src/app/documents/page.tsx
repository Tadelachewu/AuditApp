import { fetchDocuments } from "@/lib/queries";
import DocumentsClientPage from "./documents-client-page";
import { DashboardLayout } from "@/components/dashboard-layout";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DocumentsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const user = await getSession();
  if (!user) {
    redirect('/login');
  }
  const documents = await fetchDocuments();
  return (
    <DashboardLayout user={user}>
      <DocumentsClientPage documents={documents || []} />
    </DashboardLayout>
  );
}
