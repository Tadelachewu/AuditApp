"use server";

import { z } from "zod";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";

const auditFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  auditorId: z.string().min(1, "Auditor is required"),
  startDate: z.date({ required_error: "A start date is required." }),
  endDate: z.date({ required_error: "An end date is required." }),
}).refine((data) => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export type State = {
  errors?: {
    name?: string[];
    auditorId?: string[];
    startDate?: string[];
    endDate?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function createAudit(prevState: State, formData: FormData) {
  const user = await getSession();
  if (!user) {
    return { success: false, message: "Not authenticated" };
  }

  const validatedFields = auditFormSchema.safeParse({
    name: formData.get("name"),
    auditorId: formData.get("auditorId"),
    startDate: new Date(formData.get("startDate") as string),
    endDate: new Date(formData.get("endDate") as string),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to create audit. Please check the fields.",
      success: false,
    };
  }

  const { name, auditorId, startDate, endDate } = validatedFields.data;
  const status = 'Scheduled';

  try {
    await prisma.$transaction([
      prisma.audit.create({
        data: {
          name,
          auditorId,
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
      success: false,
    };
  }

  revalidatePath("/audits");
  revalidatePath("/");
  return {
    message: "Successfully created audit.",
    errors: {},
    success: true,
  }
}
