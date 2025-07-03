"use server";

import { z } from "zod";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

const documentFormSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters." }),
    type: z.string().min(1, "Type is required"),
});

const updateDocumentFormSchema = documentFormSchema.extend({
    id: z.string().min(1, "ID is required for updates."),
});

export type State = {
  errors?: {
    id?: string[];
    title?: string[];
    type?: string[];
  };
  message?: string | null;
  success?: boolean;
};


export async function createDocument(prevState: State, formData: FormData) {
    const validatedFields = documentFormSchema.safeParse({
        title: formData.get("title"),
        type: formData.get("type"),
    });

    if (!validatedFields.success) {
        return { 
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Failed to create document. Please check the fields.",
            success: false,
        };
    }

    const { title, type } = validatedFields.data;
    const id = `DOC-${String(Math.floor(Math.random() * 9000) + 1000)}`;
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
    } catch (error) {
        console.error(error);
        return { message: "Database Error: Failed to create document.", success: false, };
    }

    revalidatePath("/documents");
    return { message: "Successfully created document.", success: true, };
}


export async function updateDocument(prevState: State, formData: FormData) {
    const validatedFields = updateDocumentFormSchema.safeParse({
        id: formData.get("id"),
        title: formData.get("title"),
        type: formData.get("type"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Failed to update document. Please check the fields.",
            success: false,
        };
    }

    const { id, title, type } = validatedFields.data;

    try {
        const existingDoc = await prisma.document.findUnique({ where: { id }});
        if (!existingDoc) {
            return { message: "Document not found.", success: false, };
        }
        // Basic version bump logic
        const versionParts = existingDoc.version.replace('v', '').split('.');
        const major = parseInt(versionParts[0] || '1');
        const minor = parseInt(versionParts[1] || '0') + 1;
        const newVersion = `v${major}.${minor}`;


        await prisma.document.update({
            where: { id },
            data: { 
                title, 
                type,
                version: newVersion,
                uploadDate: new Date(),
            }
        });
    } catch (error) {
        console.error(error);
        return { message: "Database Error: Failed to update document.", success: false, };
    }
    
    revalidatePath("/documents");
    return { message: "Successfully updated document.", success: true, };
}

export async function duplicateDocument(id: string) {
    try {
        const original = await prisma.document.findUnique({
            where: { id },
        });

        if (!original) {
            return { message: "Document not found.", success: false, };
        }
        
        const newId = `DOC-${String(Math.floor(Math.random() * 9000) + 1000)}`;

        await prisma.document.create({
            data: {
                ...original,
                id: newId,
                title: `${original.title} (Copy)`,
                version: 'v1.0',
                uploadDate: new Date(),
            }
        });
        
    } catch (error) {
        console.error(error);
        return { message: "Database Error: Failed to duplicate document.", success: false, };
    }

    revalidatePath("/documents");
    return { message: "Successfully duplicated document.", success: true, };
}

export async function deleteDocument(id: string) {
    try {
        await prisma.document.delete({
            where: { id },
        });
    } catch (error) {
        console.error(error);
        return { message: "Database Error: Failed to delete document.", success: false, };
    }

    revalidatePath("/documents");
    return { message: "Successfully deleted document.", success: true, };
}
