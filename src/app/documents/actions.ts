"use server";

import { z } from "zod";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

const documentSchema = z.object({
    title: z.string().min(1, "Title is required"),
    type: z.string().min(1, "Type is required"),
});

export async function createDocument(prevState: any, formData: FormData) {
    const validatedFields = documentSchema.safeParse({
        title: formData.get("title"),
        type: formData.get("type"),
    });

    if (!validatedFields.success) {
        return { message: "Failed to create document. Please check the fields." };
    }

    const { title, type } = validatedFields.data;
    const id = `DOC-NEW-${String(Math.floor(Math.random() * 900) + 100)}`;
    const version = "v1.0";

    try {
        await prisma.document.create({
            data: {
                id,
                title,
                type,
                version,
                uploadDate: new Date(),
            }
        });
        
        // Note: In a real app, file upload would be handled here.
        // For now, we just create the database record.

    } catch (error) {
        console.error(error);
        return { message: "Database Error: Failed to create document." };
    }

    revalidatePath("/documents");
    return { message: "Successfully created document." };
}
