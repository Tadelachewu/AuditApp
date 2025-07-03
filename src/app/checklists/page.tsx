import { fetchChecklists } from "@/lib/queries";
import ChecklistClientPage from "./checklists-client-page";
import { DashboardLayout } from "@/components/dashboard-layout";
import { getSession } from "@/lib/session";

export default async function ChecklistsPage() {
  const user = await getSession();
  const checklists = await fetchChecklists();
  return (
    <DashboardLayout user={user}>
      <ChecklistClientPage checklists={checklists || []} />
    </DashboardLayout>
  );
}
