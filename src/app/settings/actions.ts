"use server";

import { z } from "zod";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";

const profileFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long." }),
});

export type ProfileState = {
  errors?: {
    name?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function updateUserProfile(prevState: ProfileState, formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Authentication error." };
  }

  const validatedFields = profileFormSchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid data provided.",
      success: false,
    };
  }

  const { name } = validatedFields.data;

  try {
    await prisma.user.update({
      where: { id: session.id },
      data: { name },
    });
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update profile.",
      success: false,
    };
  }

  // Revalidate paths where user name might be displayed
  revalidatePath("/settings");
  revalidatePath("/");
  
  return {
    message: "Your profile has been updated successfully.",
    success: true,
  };
}
