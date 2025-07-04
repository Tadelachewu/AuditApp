"use server";

import { z } from "zod";
import prisma from "@/lib/db";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import type { User } from "@prisma/client";
import { RiskLevel } from "@prisma/client";
import { getSession } from "@/lib/session";

const auditFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  scope: z.string().min(3, "Scope must be at least 3 characters"),
  riskLevel: z.nativeEnum(RiskLevel),
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
    scope?: string[];
    riskLevel?: string[];
    auditorId?: string[];
    startDate?: string[];
    endDate?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function createAudit(prevState: State, formData: FormData) {
  const session = await getSession();
  if (session?.role !== 'ADMIN') {
    return {
      message: "Unauthorized: You do not have permission to create audits.",
      success: false,
    };
  }
  
  const validatedFields = auditFormSchema.safeParse({
    name: formData.get("name"),
    scope: formData.get("scope"),
    riskLevel: formData.get("riskLevel"),
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

  const { name, scope, riskLevel, auditorId, startDate, endDate } = validatedFields.data;
  const status = 'Scheduled';

  try {
    await prisma.$transaction([
      prisma.audit.create({
        data: {
          name,
          scope,
          riskLevel,
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

export async function fetchAuditors(): Promise<User[]> {
    noStore();
    try {
        const users = await prisma.user.findMany({
            where: {
                // Fetch users who are either ADMIN or AUDITOR to assign audits
                role: { in: ['ADMIN', 'AUDITOR'] }
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                password: false // explicitly exclude password
            },
            orderBy: {
                name: 'asc'
            }
        });
        return users;
    } catch (error) {
        console.error('Database Error:', error);
        return [];
    }
}
