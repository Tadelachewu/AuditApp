import { RiskAssessmentForm } from "@/components/risk-assessment-form";
import { DashboardLayout } from "@/components/dashboard-layout";
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session-crypto';

export default async function RiskAssessmentPage() {
  const sessionCookie = cookies().get('session')?.value;
  const session = sessionCookie ? await decrypt(sessionCookie) : null;
  return (
    <DashboardLayout user={session}>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">AI-Powered Risk Assessment</h2>
        </div>
        <RiskAssessmentForm />
      </div>
    </DashboardLayout>
  );
}
