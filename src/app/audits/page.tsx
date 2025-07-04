import { fetchAudits } from "@/lib/queries";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreateAuditButton } from "./create-audit-button";
import { DashboardLayout } from "@/components/dashboard-layout";
import type { RiskLevel } from "@prisma/client";
import { getSession } from "@/lib/session";

const riskLevelVariant: Record<RiskLevel, 'destructive' | 'secondary' | 'outline'> = {
  HIGH: 'destructive',
  MEDIUM: 'secondary',
  LOW: 'outline',
}

export default async function AuditsPage() {
  const session = await getSession();
  const audits = await fetchAudits();
  const userRole = session?.role;

  return (
    <DashboardLayout user={session}>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Audit Scheduling</h2>
          <div className="flex items-center space-x-2">
            {userRole === 'ADMIN' && <CreateAuditButton />}
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Audits</CardTitle>
            <CardDescription>View and manage all upcoming and ongoing audits.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Audit Name</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Assigned Auditor</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {audits.map((audit) => (
                  <TableRow key={audit.id}>
                    <TableCell className="font-medium">{audit.name}</TableCell>
                    <TableCell>{audit.scope}</TableCell>
                    <TableCell>
                      <Badge variant={riskLevelVariant[audit.riskLevel]}>{audit.riskLevel}</Badge>
                    </TableCell>
                    <TableCell>{audit.auditor.name}</TableCell>
                    <TableCell>{audit.start_date}</TableCell>
                    <TableCell>{audit.end_date}</TableCell>
                    <TableCell>
                      <Badge variant={audit.status === 'In Progress' ? 'secondary' : audit.status === 'Scheduled' ? 'default' : 'outline'}>
                        {audit.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
