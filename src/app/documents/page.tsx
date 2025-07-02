import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Download, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


const documents = [
  { id: 'DOC-POL-001', title: 'Information Security Policy', type: 'Policy', version: 'v3.2', uploadDate: '2024-01-15' },
  { id: 'DOC-PRC-004', title: 'Incident Response Procedure', type: 'Procedure', version: 'v2.1', uploadDate: '2024-03-22' },
  { id: 'DOC-EVD-102', title: 'Q2 Firewall Configuration Logs', type: 'Evidence', version: 'N/A', uploadDate: '2024-07-01' },
  { id: 'DOC-RPT-034', title: 'Penetration Test Report - May 2024', type: 'Report', version: 'v1.0', uploadDate: '2024-06-05' },
  { id: 'DOC-POL-002', title: 'Data Privacy Policy', type: 'Policy', version: 'v1.5', uploadDate: '2023-11-20' },
];

export default function DocumentsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Document Management</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Document Repository</CardTitle>
          <CardDescription>Store and manage all audit-related documents, policies, and procedures.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.id}</TableCell>
                  <TableCell>{doc.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{doc.type}</Badge>
                  </TableCell>
                  <TableCell>{doc.version}</TableCell>
                  <TableCell>{doc.uploadDate}</TableCell>
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
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Update Version</DropdownMenuItem>
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
