"use server";

import { z } from "zod";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

const checklistSchema = z.object({
    name: z.string().min(1, "Name is required"),
    category: z.string().min(1, "Category is required"),
});

export async function createChecklist(prevState: any, formData: FormData) {
    const validatedFields = checklistSchema.safeParse({
        name: formData.get("name"),
        category: formData.get("category"),
    });

    if (!validatedFields.success) {
        return {
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
        return { message: "Database Error: Failed to create checklist." };
    }

    revalidatePath("/checklists");
    revalidatePath("/");
    return { message: "Successfully created checklist." };
}
