import { RiskAssessmentForm } from "@/components/risk-assessment-form";
import { DashboardLayout } from "@/components/dashboard-layout";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function RiskAssessmentPage() {
  const user = await getSession();
  if (!user) {
    redirect('/login');
  }

  // This is an additional layer of protection on the page itself
  if (user.role !== 'ADMIN') {
      return (
        <DashboardLayout user={user}>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <h2 className="text-3xl font-bold tracking-tight text-destructive">Access Denied</h2>
                <p>You do not have permission to view this page.</p>
            </div>
        </DashboardLayout>
      )
  }

  return (
    <DashboardLayout user={user}>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">AI-Powered Risk Assessment</h2>
        </div>
        <RiskAssessmentForm />
      </div>
    </DashboardLayout>
  );
}
