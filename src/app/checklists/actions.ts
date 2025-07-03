"use server";

import { z } from "zod";
import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";

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
    const lastUpdated = format(new Date(), "yyyy-MM-dd");

    try {
        await pool.query(
            `INSERT INTO checklists (id, name, category, last_updated)
             VALUES ($1, $2, $3, $4)`,
            [id, name, category, lastUpdated]
        );
        
        const description = `Checklist "${name}" created.`;
        await pool.query(
          `INSERT INTO activities (type, date, description) VALUES ($1, $2, $3)`,
          ['Checklist', new Date(), description]
        );

    } catch (error) {
        console.error(error);
        return { message: "Database Error: Failed to create checklist." };
    }

    revalidatePath("/checklists");
    revalidatePath("/");
    return { message: "Successfully created checklist." };
}
