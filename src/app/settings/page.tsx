import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { DashboardLayout } from "@/components/dashboard-layout";
import SettingsForm from "./settings-form";
import { fetchAllUsers } from "@/lib/queries";
import UserManagement from "./user-management";

export default async function SettingsPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  const allUsers = session.role === 'ADMIN' ? await fetchAllUsers() : [];

  return (
    <DashboardLayout user={session}>
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">
              Manage your personal profile and application settings.
            </p>
        </div>
        
        <SettingsForm user={session} />

        {session.role === 'ADMIN' && (
          <UserManagement initialUsers={allUsers} />
        )}
      </div>
    </DashboardLayout>
  );
}
