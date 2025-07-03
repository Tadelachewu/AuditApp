"use server";

import { z } from "zod";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { format } from 'date-fns';

const auditFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  auditor: z.string().min(3, "Auditor name must be at least 3 characters"),
  startDate: z.date({ required_error: "A start date is required." }),
  endDate: z.date({ required_error: "An end date is required." }),
}).refine((data) => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export type State = {
  errors?: {
    name?: string[];
    auditor?: string[];
    startDate?: string[];
    endDate?: string[];
  };
  message?: string | null;
};

export async function createAudit(prevState: State, formData: FormData) {
  const validatedFields = auditFormSchema.safeParse({
    name: formData.get("name"),
    auditor: formData.get("auditor"),
    startDate: new Date(formData.get("startDate") as string),
    endDate: new Date(formData.get("endDate") as string),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to create audit. Please check the fields.",
    };
  }

  const { name, auditor, startDate, endDate } = validatedFields.data;
  const id = `AUD-${String(Math.floor(Math.random() * 900) + 100)}`; // Temp ID generation
  const status = 'Scheduled';

  try {
    await prisma.$transaction([
      prisma.audit.create({
        data: {
          id,
          name,
          auditor,
          startDate,
          endDate,
          status,
        },
      }),
      prisma.activity.create({
        data: {
          type: 'Audit',
          date: new Date(),
          description: `Audit "${name}" scheduled.`,
        },
      }),
    ]);
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create audit.",
    };
  }

  revalidatePath("/audits");
  revalidatePath("/");
  return {
    message: "Successfully created audit.",
    errors: {}
  }
}
