"use server";

import { z } from "zod";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from 'bcryptjs';
// Session management is temporarily disabled.
// import { createSession, deleteSession } from '@/lib/session';
import { redirect } from "next/navigation";

// --- AUTH ACTIONS ---

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export async function login(prevState: any, formData: FormData) {
  // NOTE: Auth is disabled. This function will not be called.
  const validatedFields = loginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid fields.",
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { message: "Invalid credentials." };
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return { message: "Invalid credentials." };
    }

    // await createSession(user);

  } catch (error) {
    console.error(error);
    return { message: "An unexpected error occurred." };
  }
  redirect('/');
}

const registerSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export async function register(prevState: any, formData: FormData) {
    // NOTE: Auth is disabled. This function will not be called.
  const validatedFields = registerSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid fields.",
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { message: "User with this email already exists." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // Default role is AUDITOR
      },
    });

    // await createSession(user);

  } catch (error) {
    console.error(error);
    return { message: "An unexpected error occurred." };
  }
  redirect('/');
}


export async function logout() {
  // await deleteSession();
  // No redirect needed as auth is disabled.
}
