import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle } from "lucide-react";

const audits = [
  { id: 'AUD-001', name: 'Q3 Financial Statement Audit', auditor: 'Alice Johnson', startDate: '2024-07-15', endDate: '2024-08-15', status: 'In Progress' },
  { id: 'AUD-002', name: 'IT Security Compliance Check', auditor: 'Bob Williams', startDate: '2024-08-01', endDate: '2024-08-31', status: 'Scheduled' },
  { id: 'AUD-003', name: 'Branch Operations Review (Downtown)', auditor: 'Charlie Brown', startDate: '2024-06-20', endDate: '2024-07-10', status: 'Completed' },
  { id: 'AUD-004', name: 'AML Policy Adherence Audit', auditor: 'Diana Prince', startDate: '2024-07-25', endDate: '2024-08-25', status: 'Scheduled' },
  { id: 'AUD-005', name: 'Q2 Customer Data Privacy Audit', auditor: 'Alice Johnson', startDate: '2024-05-10', endDate: '2024-06-10', status: 'Completed' },
];

const statusVariant = {
  'In Progress': 'secondary',
  'Scheduled': 'default',
  'Completed': 'outline',
} as const;

export default function AuditsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Audit Scheduling</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Schedule New Audit
          </Button>
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
                <TableHead>Audit ID</TableHead>
                <TableHead>Audit Name</TableHead>
                <TableHead>Assigned Auditor</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {audits.map((audit) => (
                <TableRow key={audit.id}>
                  <TableCell className="font-medium">{audit.id}</TableCell>
                  <TableCell>{audit.name}</TableCell>
                  <TableCell>{audit.auditor}</TableCell>
                  <TableCell>{audit.startDate}</TableCell>
                  <TableCell>{audit.endDate}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[audit.status as keyof typeof statusVariant] || 'default'}>
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
  );
}
