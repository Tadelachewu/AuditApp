
import { fetchChecklists } from "@/lib/queries";
import ChecklistClientPage from "./checklists-client-page";

export default async function ChecklistsPage() {
  const checklists = await fetchChecklists();
  return <ChecklistClientPage checklists={checklists || []} />;
}
