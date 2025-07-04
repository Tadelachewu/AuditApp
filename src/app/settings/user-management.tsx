"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Role } from "@prisma/client";
import type { User } from "@/lib/definitions";

import { useToast } from "@/hooks/use-toast";
import { createUserByAdmin, updateUserByAdmin, deleteUserByAdmin } from "./actions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

const userFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  role: z.nativeEnum(Role),
  password: z.string().optional(),
}).refine(data => {
    if (!data.id) { // Only require password for new users
        return data.password && data.password.length >= 8;
    }
    return true;
}, {
    message: "Password must be at least 8 characters for new users.",
    path: ["password"],
});

type UserFormData = z.infer<typeof userFormSchema>;

export default function UserManagement({ initialUsers }: { initialUsers: User[] }) {
    const [users, setUsers] = useState(initialUsers);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [activeUser, setActiveUser] = useState<User | null>(null);
    const { toast } = useToast();

    const form = useForm<UserFormData>({
        resolver: zodResolver(userFormSchema),
        defaultValues: { name: "", email: "", role: Role.AUDITOR },
    });
    const { isSubmitting } = form.formState;

    useEffect(() => {
        if (isDialogOpen) {
            if (activeUser) {
                form.reset({
                    id: activeUser.id,
                    name: activeUser.name,
                    email: activeUser.email,
                    role: activeUser.role,
                    password: "",
                });
            } else {
                form.reset({ name: "", email: "", role: Role.AUDITOR, password: "" });
            }
        }
    }, [isDialogOpen, activeUser, form]);

    const onSubmit = async (data: UserFormData) => {
        const formData = new FormData();
        if (data.id) formData.append('id', data.id);
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('role', data.role);
        if (data.password) formData.append('password', data.password);

        const action = data.id ? updateUserByAdmin : createUserByAdmin;
        const result = await action({} as any, formData);

        if (result.success) {
            toast({ title: "Success!", description: result.message });
            setIsDialogOpen(false);
            // No need to re-fetch, revalidation will handle it.
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message || "An unknown error occurred." });
        }
    };

    const handleCreate = () => {
        setActiveUser(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (user: User) => {
        setActiveUser(user);
        setIsDialogOpen(true);
    };

    const handleDelete = (user: User) => {
        setActiveUser(user);
        setIsDeleteConfirmOpen(true);
    };

    const performDelete = async () => {
        if (!activeUser) return;
        const result = await deleteUserByAdmin(activeUser.id);
        toast({
            title: result.success ? "Success!" : "Error",
            description: result.message,
            variant: result.success ? "default" : "destructive",
        });
        setIsDeleteConfirmOpen(false);
        setActiveUser(null);
    };
    
    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription>Add, edit, or remove users from the system.</CardDescription>
                    </div>
                    <Button onClick={handleCreate}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add User
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Date Joined</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {initialUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell><Badge variant="secondary">{user.role}</Badge></TableCell>
                                    <TableCell>{format(new Date(user.createdAt), "PPP")}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleEdit(user)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(user)}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{activeUser ? 'Edit User' : 'Add New User'}</DialogTitle>
                        <DialogDescription>
                           {activeUser ? 'Update the user\'s details below.' : 'Enter the new user\'s information.'}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            {!activeUser && (
                               <FormField control={form.control} name="password" render={({ field }) => (
                                <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                            )}
                            <FormField control={form.control} name="role" render={({ field }) => (
                                <FormItem><FormLabel>Role</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {Object.values(Role).map(role => (
                                            <SelectItem key={role} value={role}>{role}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage /></FormItem>
                            )}/>
                            <DialogFooter>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {activeUser ? 'Save Changes' : 'Create User'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user account for "{activeUser?.name}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={performDelete} className="bg-destructive hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
