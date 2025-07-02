import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, BarChart2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const reports = [
  { id: 'RPT-2024-001', auditId: 'AUD-003', title: 'Q2 Branch Operations Review', generatedBy: 'Charlie Brown', date: '2024-07-12', status: 'Finalized' },
  { id: 'RPT-2024-002', auditId: 'AUD-005', title: 'Q2 Customer Data Privacy Audit', generatedBy: 'Alice Johnson', date: '2024-06-15', status: 'Finalized' },
  { id: 'RPT-2024-003', auditId: 'AUD-001', title: 'Q3 Financial Statement Audit', generatedBy: 'Alice Johnson', date: '2024-08-16', status: 'Draft' },
];

const statusVariant = {
  'Finalized': 'default',
  'Draft': 'secondary',
} as const;

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Audit Reports</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>Access and download all audit reports.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.id}<br/><span className="text-xs text-muted-foreground">{report.title}</span></TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell><Badge variant={statusVariant[report.status as keyof typeof statusVariant]}>{report.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Report Preview: RPT-2024-001</CardTitle>
                <CardDescription>Q2 Branch Operations Review</CardDescription>
              </div>
              <Button size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Executive Summary</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  The audit of the Downtown branch operations, conducted from June 20, 2024, to July 10, 2024, found operations to be largely compliant with bank policies. Three minor findings were identified and corrective actions have been recommended.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold">Compliance Status</h3>
                <div className="mt-2 flex items-center gap-4">
                  <BarChart2 className="h-10 w-10 text-green-500" />
                  <div>
                    <p className="font-bold text-2xl">98% Compliant</p>
                    <p className="text-sm text-muted-foreground">3 findings out of 150 checklist items.</p>
                  </div>
                </div>
              </div>
              <Separator />
               <div>
                <h3 className="text-lg font-semibold">Key Findings & Recommendations</h3>
                <ul className="list-disc list-inside space-y-2 mt-2 text-sm">
                  <li><span className="font-semibold">Finding 1:</span> Cash handling logs were not consistently filled out at end of day.
                    <br/><span className="text-muted-foreground pl-4">→ Recommendation: Implement mandatory daily supervisor sign-off on cash logs.</span>
                  </li>
                  <li><span className="font-semibold">Finding 2:</span> Physical security checklist for the vault was missed on two occasions.
                    <br/><span className="text-muted-foreground pl-4">→ Recommendation: Add automated reminders for security checklist completion.</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
