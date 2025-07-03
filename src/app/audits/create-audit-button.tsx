"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { createAudit, type State, fetchAuditors } from "./actions";
import type { User } from "@prisma/client";
import { RiskLevel } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar as CalendarIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const auditFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  scope: z.string().min(3, "Scope must be at least 3 characters"),
  riskLevel: z.nativeEnum(RiskLevel),
  auditorId: z.string().min(1, "An auditor must be selected"),
  startDate: z.date({ required_error: "A start date is required." }),
  endDate: z.date({ required_error: "An end date is required." }),
}).refine((data) => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});


export function CreateAuditButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [auditors, setAuditors] = useState<User[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    async function loadAuditors() {
      const fetchedAuditors = await fetchAuditors();
      setAuditors(fetchedAuditors);
    }
    if (isDialogOpen) {
      loadAuditors();
    }
  }, [isDialogOpen]);

  const form = useForm<z.infer<typeof auditFormSchema>>({
    resolver: zodResolver(auditFormSchema),
    defaultValues: {
      name: "",
      scope: "",
      riskLevel: RiskLevel.MEDIUM,
      auditorId: "",
    }
  });

  const onSubmit = async (data: z.infer<typeof auditFormSchema>) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('scope', data.scope);
    formData.append('riskLevel', data.riskLevel);
    formData.append('auditorId', data.auditorId);
    formData.append('startDate', data.startDate.toISOString());
    formData.append('endDate', data.endDate.toISOString());

    const result = await createAudit({} as State, formData);
    
    if (result.success) {
        toast({
            title: "Success!",
            description: result.message,
        });
        form.reset();
        setIsDialogOpen(false);
    } else {
        toast({
            variant: "destructive",
            title: "Error",
            description: result.message || "An unknown error occurred.",
        });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Schedule New Audit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Schedule New Audit</DialogTitle>
          <DialogDescription>
            Fill in the details below to schedule a new audit.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Audit Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Q4 IT Security Audit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="scope"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Audit Scope</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., SOX Compliance" {...field} />
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="riskLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a risk level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(RiskLevel).map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="auditorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned Auditor</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an auditor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {auditors.map((auditor) => (
                          <SelectItem key={auditor.id} value={auditor.id}>
                            {auditor.name} ({auditor.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Schedule</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
