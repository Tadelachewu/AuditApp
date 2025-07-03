
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal, Loader2, Pencil, Copy, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createChecklist, updateChecklist, duplicateChecklist, deleteChecklist } from "./actions";
import type { Checklist } from "@/lib/definitions";

const checklistFormSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(3, { message: "Name must be at least 3 characters." }),
    category: z.string().min(3, { message: "Category must be at least 3 characters." }),
});

export default function ChecklistClientPage({ checklists }: { checklists: Checklist[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [activeChecklist, setActiveChecklist] = useState<Checklist | null>(null);
  
  const { toast } = useToast();

  const form = useForm<z.infer<typeof checklistFormSchema>>({
    resolver: zodResolver(checklistFormSchema),
    defaultValues: {
      name: "",
      category: "",
    }
  });

  useEffect(() => {
    if (activeChecklist) {
      form.reset({
        id: activeChecklist.id,
        name: activeChecklist.name,
        category: activeChecklist.category,
      });
    } else {
      form.reset({ name: "", category: "" });
    }
  }, [activeChecklist, form, isDialogOpen]);


  const { isSubmitting } = form.formState;

  const onSubmit = async (data: z.infer<typeof checklistFormSchema>) => {
    const formData = new FormData();
    if(data.id) formData.append('id', data.id);
    formData.append('name', data.name);
    formData.append('category', data.category);
    
    const action = data.id ? updateChecklist : createChecklist;
    const result = await action({} , formData);

    if (result.success) {
      toast({
          title: "Success!",
          description: result.message,
      });
      setIsDialogOpen(false);
      setActiveChecklist(null);
    } else {
      toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "An unknown error occurred.",
      });
    }
  };
  
  const handleCreate = () => {
    setActiveChecklist(null);
    setIsDialogOpen(true);
  };
  
  const handleEdit = (checklist: Checklist) => {
    setActiveChecklist(checklist);
    setIsDialogOpen(true);
  };

  const handleDuplicate = async (id: string) => {
    const result = await duplicateChecklist(id);
    toast({
        title: result.success ? "Success!" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
    });
  };

  const handleDelete = (checklist: Checklist) => {
    setActiveChecklist(checklist);
    setIsDeleteConfirmOpen(true);
  };

  const performDelete = async () => {
    if (!activeChecklist) return;
    const result = await deleteChecklist(activeChecklist.id);
    toast({
        title: result.success ? "Success!" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
    });
    setIsDeleteConfirmOpen(false);
    setActiveChecklist(null);
  };


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Checklist Management</h2>
        <div className="flex items-center space-x-2">
            <Button onClick={handleCreate}>
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
                  <TableCell className="font-medium">{checklist.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{checklist.category}</Badge>
                  </TableCell>
                  <TableCell>{format(new Date(checklist.last_updated), "PPP")}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleEdit(checklist)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(checklist.id)}>
                            <Copy className="mr-2 h-4 w-4" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => handleDelete(checklist)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{activeChecklist ? 'Edit Checklist' : 'Create New Checklist'}</DialogTitle>
            <DialogDescription>
              {activeChecklist ? 'Update the details for this checklist.' : 'Enter the details for the new checklist template.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Checklist Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Quarterly Server Maintenance" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. IT Security" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {activeChecklist ? 'Save Changes' : 'Create Checklist'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the checklist "{activeChecklist?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={performDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
