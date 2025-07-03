import { fetchChecklists } from "@/lib/queries";
import ChecklistClientPage from "./checklists-client-page";
import { DashboardLayout } from "@/components/dashboard-layout";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function ChecklistsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const user = await getSession();
  if (!user) {
    redirect('/login');
  }
  const checklists = await fetchChecklists();
  return (
    <DashboardLayout user={user}>
      <ChecklistClientPage checklists={checklists || []} />
    </DashboardLayout>
  );
}
