"use server";
import { redirect } from "next/navigation";
import { CategorySchema, CategoryValues } from "./schema";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/server-auth";
// importera typen Category från Prisma Client
// import type { Category } from "@prisma/client";
export async function editCategory(values: CategoryValues) {
  await requireAdmin();
  const data = await CategorySchema.parseAsync(values);
  await prisma.category.update({
    where: { id: data.id },
    data: {
      name: data.name,
      showInNavbar: data.showInNavbar ?? false,
    },
    select: { id: true },
  });
  redirect(`/admin/kategorier`);
}
