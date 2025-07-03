import { fetchChecklists } from "@/lib/queries";
import ChecklistClientPage from "./page";

export default async function ChecklistsPageWrapper() {
  const checklists = await fetchChecklists();
  return <ChecklistClientPage checklists={checklists} />;
}
