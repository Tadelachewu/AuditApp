"use server";

import { z } from "zod";
import { pool } from "@/lib/db";
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
  const startDateString = format(startDate, "yyyy-MM-dd");
  const endDateString = format(endDate, "yyyy-MM-dd");
  const id = `AUD-${String(Math.floor(Math.random() * 900) + 100)}`; // Temp ID generation
  const status = 'Scheduled';

  try {
    await pool.query(
        `INSERT INTO audits (id, name, auditor, start_date, end_date, status)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [id, name, auditor, startDateString, endDateString, status]
    );

    // Also add to activities log
    const description = `Audit "${name}" scheduled.`;
    await pool.query(
      `INSERT INTO activities (type, date, description) VALUES ($1, $2, $3)`,
      ['Audit', new Date(), description]
    );

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
