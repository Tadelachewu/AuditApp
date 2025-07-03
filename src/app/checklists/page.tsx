
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createChecklist } from "./actions";
import type { Checklist } from "@/lib/definitions";

// This component now receives props from the server component wrapper
export default function ChecklistClientPage({ checklists }: { checklists: Checklist[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newChecklistName, setNewChecklistName] = useState("");
  const [newChecklistCategory, setNewChecklistCategory] = useState("");

  const { toast } = useToast();

  const handleAction = (action: string, checklistId: string) => {
    toast({
      title: "Action Triggered",
      description: `${action} on checklist ${checklistId}`,
    });
  };
  
  const handleCreateChecklist = async () => {
    if (newChecklistName.trim() && newChecklistCategory.trim()) {
      const formData = new FormData();
      formData.append('name', newChecklistName);
      formData.append('category', newChecklistCategory);
      
      const result = await createChecklist({}, formData);

      if (result.message.includes("Success")) {
        toast({
            title: "Success!",
            description: "New checklist created.",
        });
        setIsDialogOpen(false);
        setNewChecklistName("");
        setNewChecklistCategory("");
      } else {
        toast({
            variant: "destructive",
            title: "Error",
            description: result.message || "An unknown error occurred.",
        });
      }
    } else {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Please fill out all fields.",
        });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Checklist Management</h2>
        <div className="flex items-center space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Checklist
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Checklist</DialogTitle>
                <DialogDescription>
                  Enter the details for the new checklist template.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" value={newChecklistName} onChange={(e) => setNewChecklistName(e.target.value)} className="col-span-3" placeholder="e.g. Quarterly Server Maintenance" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Input id="category" value={newChecklistCategory} onChange={(e) => setNewChecklistCategory(e.target.value)} className="col-span-3" placeholder="e.g. IT Security" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateChecklist}>Create Checklist</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                  <TableCell>{checklist.last_updated}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleAction('Edit', checklist.id)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('Duplicate', checklist.id)}>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('Archive', checklist.id)}>Archive</DropdownMenuItem>
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
