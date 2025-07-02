import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const checklists = [
  { id: 'CHK-FIN-01', name: 'Quarterly Financial Closing', category: 'Finance', lastUpdated: '2024-06-28' },
  { id: 'CHK-IT-03', name: 'Server Security Hardening', category: 'IT Security', lastUpdated: '2024-07-05' },
  { id: 'CHK-OPS-02', name: 'New Employee Onboarding', category: 'Operations', lastUpdated: '2024-05-15' },
  { id: 'CHK-CMP-05', name: 'AML Transaction Monitoring', category: 'Compliance', lastUpdated: '2024-07-11' },
  { id: 'CHK-HR-01', name: 'Annual Performance Review', category: 'Human Resources', lastUpdated: '2024-04-30' },
];

export default function ChecklistsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Checklist Management</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Checklist
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Audit Checklists & Templates</CardTitle>
          <CardDescription>Manage reusable checklists for various audit types.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Checklist ID</TableHead>
                <TableHead>Checklist Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checklists.map((checklist) => (
                <TableRow key={checklist.id}>
                  <TableCell className="font-medium">{checklist.id}</TableCell>
                  <TableCell>{checklist.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{checklist.category}</Badge>
                  </TableCell>
                  <TableCell>{checklist.lastUpdated}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem>Archive</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
