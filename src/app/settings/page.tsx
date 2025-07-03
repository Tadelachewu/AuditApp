import { getSession } from "@/lib/session";
import { DashboardLayout } from "@/components/dashboard-layout";
import SettingsForm from "./settings-form";

export default async function SettingsPage() {
  const user = await getSession();

  return (
    <DashboardLayout user={user}>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        </div>
        <SettingsForm user={user} />
      </div>
    </DashboardLayout>
  );
}
