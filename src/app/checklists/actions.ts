"use server";

import { z } from "zod";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

const checklistFormSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters." }),
    category: z.string().min(3, { message: "Category must be at least 3 characters." }),
});

const updateChecklistFormSchema = checklistFormSchema.extend({
    id: z.string().min(1, { message: "ID is required for updates." }),
});

export type State = {
  errors?: {
    name?: string[];
    category?: string[];
    id?: string[];
  };
  message?: string | null;
  success?: boolean;
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
            success: false,
        };
    }

    const { name, category } = validatedFields.data;

    try {
        await prisma.$transaction([
            prisma.checklist.create({
                data: {
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
            message: "Database Error: Failed to create checklist.",
            success: false, 
        };
    }

    revalidatePath("/checklists");
    revalidatePath("/");
    return { 
        message: "Successfully created checklist.",
        success: true,
    };
}


export async function updateChecklist(prevState: State, formData: FormData) {
    const validatedFields = updateChecklistFormSchema.safeParse({
        id: formData.get("id"),
        name: formData.get("name"),
        category: formData.get("category"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Failed to update checklist. Please check the fields.",
            success: false,
        };
    }

    const { id, name, category } = validatedFields.data;

    try {
        await prisma.checklist.update({
            where: { id },
            data: { name, category, lastUpdated: new Date() }
        });
    } catch (error) {
        console.error(error);
        return { message: "Database Error: Failed to update checklist.", success: false };
    }
    
    revalidatePath("/checklists");
    return { message: "Successfully updated checklist.", success: true };
}

export async function duplicateChecklist(id: string) {
    try {
        const original = await prisma.checklist.findUnique({
            where: { id },
        });

        if (!original) {
            return { message: "Checklist not found.", success: false };
        }
        
        await prisma.checklist.create({
            data: {
                name: `${original.name} (Copy)`,
                category: original.category,
                lastUpdated: new Date(),
            }
        });
        
    } catch (error) {
        console.error(error);
        return { message: "Database Error: Failed to duplicate checklist.", success: false };
    }

    revalidatePath("/checklists");
    return { message: "Successfully duplicated checklist.", success: true };
}

export async function deleteChecklist(id: string) {
    try {
        await prisma.checklist.delete({
            where: { id },
        });
    } catch (error) {
        console.error(error);
        return { message: "Database Error: Failed to delete checklist.", success: false };
    }

    revalidatePath("/checklists");
    revalidatePath("/");
    return { message: "Successfully deleted checklist.", success: true };
}
