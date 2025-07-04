import { fetchChecklists } from "@/lib/queries";
import ChecklistClientPage from "./checklists-client-page";
import { DashboardLayout } from "@/components/dashboard-layout";
import { getSession } from "@/lib/session";

export default async function ChecklistsPage() {
  const session = await getSession();
  const checklists = await fetchChecklists();

  return (
    <DashboardLayout user={session}>
      <ChecklistClientPage checklists={checklists || []} userRole={session?.role} />
    </DashboardLayout>
  );
}
