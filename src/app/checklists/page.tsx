import { fetchChecklists } from "@/lib/queries";
import ChecklistClientPage from "./checklists-client-page";
import { DashboardLayout } from "@/components/dashboard-layout";
import { getSession } from "@/lib/session";

export default async function ChecklistsPage() {
  const checklists = await fetchChecklists();
  const session = await getSession();

  return (
    <DashboardLayout>
      <ChecklistClientPage checklists={checklists || []} userRole={session?.role} />
    </DashboardLayout>
  );
}
