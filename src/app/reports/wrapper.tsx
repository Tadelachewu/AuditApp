import { fetchReports } from "@/lib/queries";
import ReportsClientPage from "./page";

export default async function ReportsPageWrapper() {
  const reports = await fetchReports();
  return <ReportsClientPage reports={reports} />;
}
