import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { checklists } from "@/lib/data";

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
