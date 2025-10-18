"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/server-auth";

export async function deleteArticle(id: string) {
  await requireAdmin();
  const deleted = await prisma.article.delete({ where: { id } });
  console.log("Deleted article", deleted.id);
  redirect("/admin/artiklar");
}
