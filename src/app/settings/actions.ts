"use server";

import { z } from "zod";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { Role } from "@prisma/client";
import bcrypt from 'bcryptjs';

// --- Profile Actions ---

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

  revalidatePath("/settings");
  revalidatePath("/");
  
  return {
    message: "Your profile has been updated successfully.",
    success: true,
  };
}


// --- User Management Actions (Admin only) ---

async function checkAdminAuth() {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        throw new Error("Unauthorized: Admin access required.");
    }
    return session;
}

const userManagementSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long." }),
  email: z.string().email({ message: "Invalid email format."}),
  role: z.nativeEnum(Role),
});

const createUserSchema = userManagementSchema.extend({
    password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
});

const updateUserSchema = userManagementSchema.extend({
    id: z.string().min(1, "User ID is required."),
});

export type UserManagementState = {
  errors?: {
    id?: string[];
    name?: string[];
    email?: string[];
    role?: string[];
    password?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function createUserByAdmin(prevState: UserManagementState, formData: FormData) {
  try {
    await checkAdminAuth();
  } catch(e: any) {
    return { success: false, message: e.message };
  }

  const validatedFields = createUserSchema.safeParse(Object.fromEntries(formData));
  
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid data provided.",
      success: false,
    };
  }

  const { name, email, password, role } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return { message: "A user with this email already exists.", success: false };
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
        data: { name, email, role, password: hashedPassword }
    });

  } catch (error) {
    console.error(error);
    return { message: "Database Error: Failed to create user.", success: false };
  }

  revalidatePath("/settings");
  return { message: "User created successfully.", success: true };
}

export async function updateUserByAdmin(prevState: UserManagementState, formData: FormData) {
    try {
        await checkAdminAuth();
    } catch(e: any) {
        return { success: false, message: e.message };
    }

    const validatedFields = updateUserSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Invalid data provided.",
            success: false,
        };
    }

    const { id, name, email, role } = validatedFields.data;
    
    const userToUpdate = await prisma.user.findUnique({ where: { id }});
    if (!userToUpdate) {
        return { message: "User not found.", success: false };
    }
    
    if (userToUpdate.role === 'ADMIN' && role !== 'ADMIN') {
        const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
        if (adminCount <= 1) {
            return { message: "Cannot remove the last administrator.", success: false };
        }
    }

    try {
        await prisma.user.update({
            where: { id },
            data: { name, email, role }
        });
    } catch (error) {
        console.error(error);
        if ((error as any).code === 'P2002' && (error as any).meta?.target.includes('email')) {
             return { message: "Another user with this email already exists.", success: false };
        }
        return { message: "Database Error: Failed to update user.", success: false };
    }

    revalidatePath("/settings");
    return { message: "User updated successfully.", success: true };
}

export async function deleteUserByAdmin(id: string) {
    let session;
    try {
        session = await checkAdminAuth();
    } catch(e: any) {
        return { success: false, message: e.message };
    }

    if (id === session.id) {
        return { message: "You cannot delete your own account.", success: false };
    }
    
    const userToDelete = await prisma.user.findUnique({ where: { id } });
    if (!userToDelete) {
      return { message: "User not found.", success: false };
    }

    if (userToDelete.role === 'ADMIN') {
        const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
        if (adminCount <= 1) {
            return { message: "Cannot delete the last administrator.", success: false };
        }
    }

    try {
        // You might want to handle related records here (e.g., reassign audits)
        // For now, we'll just delete the user. This will fail if there are relations.
        await prisma.user.delete({
            where: { id },
        });
    } catch (error) {
        console.error(error);
        return { message: "Database Error: Failed to delete user. They may be assigned to audits or reports.", success: false };
    }

    revalidatePath("/settings");
    return { message: "User deleted successfully.", success: true };
}
