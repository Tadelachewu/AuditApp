"use server";

import { z } from "zod";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

const checklistFormSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters." }),
    category: z.string().min(3, { message: "Category must be at least 3 characters." }),
});

export type State = {
  errors?: {
    name?: string[];
    category?: string[];
  };
  message?: string | null;
};

export async function createChecklist(prevState: State, formData: FormData) {
    const validatedFields = checklistFormSchema.safeParse({
        name: formData.get("name"),
        category: formData.get("category"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Failed to create checklist. Please check the fields.",
        };
    }

    const { name, category } = validatedFields.data;
    const id = `CHK-NEW-${String(Math.floor(Math.random() * 900) + 100)}`;

    try {
        await prisma.$transaction([
            prisma.checklist.create({
                data: {
                    id,
                    name,
                    category,
                    lastUpdated: new Date(),
                }
            }),
            prisma.activity.create({
                data: {
                    type: 'Checklist',
                    date: new Date(),
                    description: `Checklist "${name}" created.`,
                }
            })
        ]);
    } catch (error) {
        console.error(error);
        return { 
            errors: {},
            message: "Database Error: Failed to create checklist." 
        };
    }

    revalidatePath("/checklists");
    revalidatePath("/");
    return { 
        message: "Successfully created checklist.",
        errors: {}
    };
}
