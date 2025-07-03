import { RiskAssessmentForm } from "@/components/risk-assessment-form";
import { DashboardLayout } from "@/components/dashboard-layout";

export default async function RiskAssessmentPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">AI-Powered Risk Assessment</h2>
        </div>
        <RiskAssessmentForm />
      </div>
    </DashboardLayout>
  );
}
