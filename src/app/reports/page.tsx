import { fetchReports } from "@/lib/queries";
import ReportsClientPage from "./reports-client-page";
import { DashboardLayout } from "@/components/dashboard-layout";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function ReportsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const user = await getSession();
  if (!user) {
    redirect('/login');
  }
  const reports = await fetchReports();
  return (
    <DashboardLayout user={user}>
      <ReportsClientPage reports={reports || []} />
    </DashboardLayout>
  );
}
