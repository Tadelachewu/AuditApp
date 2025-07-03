import { fetchChecklists } from "@/lib/queries";
import ChecklistClientPage from "./checklists-client-page";
import { DashboardLayout } from "@/components/dashboard-layout";

export default async function ChecklistsPage() {
  const checklists = await fetchChecklists();
  return (
    <DashboardLayout>
      <ChecklistClientPage checklists={checklists || []} />
    </DashboardLayout>
  );
}
