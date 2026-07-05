"use server";

import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/server-auth";
import { revalidatePath } from "next/cache";
import { ROLES, type Role } from "@/lib/roles";

function isValidRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}

function isForeignKeyViolation(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2003"
  );
}

/**
 * Update a user's role (admin only)
 */
export async function updateUserRole(userId: string, role: string) {
  try {
    await requireAdmin();

    const roleInput = role.toLowerCase();

    if (!isValidRole(roleInput)) {
      return { ok: false, error: "Invalid role" };
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: roleInput },
      select: { id: true, role: true, name: true, email: true },
    });

    revalidatePath("/admin/anvandare");
    return { ok: true, user };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { ok: false, error: "Could not update user" };
  }
}

/**
 * Delete a user (admin only)
 */
export async function deleteUser(userId: string) {
  try {
    await requireAdmin();

    if (!userId || typeof userId !== "string") {
      return { ok: false, error: "Invalid id" };
    }

    await prisma.user.delete({ where: { id: userId } });

    revalidatePath("/admin/anvandare");
    return { ok: true };
  } catch (error) {
    console.error("Failed to delete user", error);
    if (isForeignKeyViolation(error)) {
      return {
        ok: false,
        error:
          "Kan inte ta bort användaren eftersom den har skrivit artiklar. Ta bort eller omfördela artiklarna först.",
      };
    }
    return { ok: false, error: "Kunde inte ta bort användaren" };
  }
}

/**
 * Delete an article (admin only)
 */
export async function deleteArticle(articleId: string) {
  try {
    await requireAdmin();

    if (!articleId || typeof articleId !== "string") {
      return { ok: false, error: "Invalid id" };
    }

    await prisma.article.delete({ where: { id: articleId } });

    revalidatePath("/admin/artiklar");
    revalidatePath("/artiklar");
    return { ok: true };
  } catch (error) {
    console.error("Failed to delete article", error);
    return { ok: false, error: "Kunde inte ta bort artikeln" };
  }
}

/**
 * Delete a category (admin only)
 */
export async function deleteCategory(categoryId: string) {
  try {
    await requireAdmin();

    if (!categoryId || typeof categoryId !== "string") {
      return { ok: false, error: "Invalid id" };
    }

    await prisma.category.delete({ where: { id: categoryId } });

    revalidatePath("/admin/kategorier");
    revalidatePath("/kategori");
    return { ok: true };
  } catch (error) {
    console.error("Failed to delete category", error);
    if (isForeignKeyViolation(error)) {
      return {
        ok: false,
        error:
          "Kan inte ta bort kategorin eftersom den har artiklar kopplade till sig. Flytta eller ta bort artiklarna först.",
      };
    }
    return { ok: false, error: "Kunde inte ta bort kategorin" };
  }
}
