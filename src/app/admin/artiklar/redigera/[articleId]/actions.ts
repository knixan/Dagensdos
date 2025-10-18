"use server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ArticleEditSchema, ArticleEditValues } from "./schema";
import { requireAdmin } from "@/lib/server-auth";

export async function editArticle(values: ArticleEditValues) {
  await requireAdmin();
  const data = await ArticleEditSchema.parseAsync(values);

    // Build connect array from provided categoryIds
    const connectCategories = (data.categoryIds || []).map((id) => ({ id }));

  const updated = await prisma.article.update({
    where: { id: data.id },
    data: {
      headline: data.headline,
      summary: data.summary,
      content: data.content,
      image_url: data.image_url,
      editorsChoice: data.editorsChoice,
        category: { set: [], connect: connectCategories },
    },
  });
  redirect(`/article/${updated.id}`);
}
