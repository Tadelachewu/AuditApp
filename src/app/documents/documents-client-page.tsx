
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { User } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Download, MoreHorizontal, Pencil, Copy, Trash2, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createDocument, updateDocument, duplicateDocument, deleteDocument } from "./actions";
import type { Document } from "@/lib/definitions";

const documentFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  type: z.string().min(1, "Type is required"),
});

export default function DocumentsClientPage({ documents, user }: { documents: Document[], user: User }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [activeDocument, setActiveDocument] = useState<Document | null>(null);
  const { toast } = useToast();
  const canModify = user.role === 'ADMIN' || user.role === 'AUDITOR';

  const form = useForm<z.infer<typeof documentFormSchema>>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      title: "",
      type: "Evidence",
    },
  });

  useEffect(() => {
    if (activeDocument) {
      form.reset({
        id: activeDocument.id,
        title: activeDocument.title,
        type: activeDocument.type,
      });
    } else {
      form.reset({ title: "", type: "Evidence" });
    }
  }, [activeDocument, form, isDialogOpen]);

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: z.infer<typeof documentFormSchema>) => {
    const formData = new FormData();
    if(data.id) formData.append('id', data.id);
    formData.append('title', data.title);
    formData.append('type', data.type);
    
    // NOTE: In a real app, you would handle file uploads here.

    const action = data.id ? updateDocument : createDocument;
    const result = await action({} , formData);

    if (result.success) {
      toast({
          title: "Success!",
          description: result.message,
      });
      setIsDialogOpen(false);
      setActiveDocument(null);
    } else {
      toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "An unknown error occurred.",
      });
    }
  };

  const handleCreate = () => {
    setActiveDocument(null);
    setIsDialogOpen(true);
  };
  
  const handleEdit = (doc: Document) => {
    setActiveDocument(doc);
    setIsDialogOpen(true);
  };

  const handleDuplicate = async (id: string) => {
    const result = await duplicateDocument(id);
    toast({
        title: result.success ? "Success!" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
    });
  };

  const handleDelete = (doc: Document) => {
    setActiveDocument(doc);
    setIsDeleteConfirmOpen(true);
  };

  const performDelete = async () => {
    if (!activeDocument) return;
    const result = await deleteDocument(activeDocument.id);
    toast({
        title: result.success ? "Success!" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
    });
    setIsDeleteConfirmOpen(false);
    setActiveDocument(null);
  };

  const handleDownload = (docId: string) => {
    const doc = documents.find((d) => d.id === docId);
    if (!doc) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Document not found.",
      });
      return;
    }

    // This is a mock download. In a real app, this would fetch a file from a server.
    const fileContent = `This is a simulated document file for "${doc.title}".\n\nID: ${doc.id}\nType: ${doc.type}\nVersion: ${doc.version}\nUpload Date: ${doc.upload_date}`;
    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${doc.title.replace(/ /g, "_")}.txt`;
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: `Downloading a simulated file for "${doc.title}".`,
    });
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Document Management</h2>
        <div className="flex items-center space-x-2">
          {canModify && (
            <Button onClick={handleCreate}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          )}
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
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Upload Date</TableHead>
                {canModify && (
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{doc.type}</Badge>
                  </TableCell>
                  <TableCell>{doc.version}</TableCell>
                  <TableCell>{doc.upload_date}</TableCell>
                  {canModify && (
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
                          <DropdownMenuItem onClick={() => handleDownload(doc.id)}>
                            <Download className="mr-2 h-4 w-4" /> Download
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(doc)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(doc.id)}>
                            <Copy className="mr-2 h-4 w-4" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => handleDelete(doc)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
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
            <DialogTitle>{activeDocument ? 'Edit Document' : 'Upload Document'}</DialogTitle>
            <DialogDescription>
              {activeDocument ? 'Update the details for this document.' : 'Provide document details. File upload is a placeholder.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Q3 Firewall Logs" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Policy">Policy</SelectItem>
                            <SelectItem value="Procedure">Procedure</SelectItem>
                            <SelectItem value="Evidence">Evidence</SelectItem>
                            <SelectItem value="Report">Report</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <div className="space-y-2">
                  <FormLabel>File</FormLabel>
                  <Input id="file" type="file" className="col-span-3" disabled />
                  <p className="text-sm text-muted-foreground">File upload functionality is not implemented in this demo.</p>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {activeDocument ? 'Save Changes' : 'Create Record'}
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
              This action cannot be undone. This will permanently delete the document "{activeDocument?.title}".
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
