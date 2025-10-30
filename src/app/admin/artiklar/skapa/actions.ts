"use server";

import { ArticleCreateSchema, ArticleCreateValues } from "./schema";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/server-auth";

export async function createArticle(values: ArticleCreateValues) {
  const session = await requireAdmin();
  const data = await ArticleCreateSchema.parseAsync(values);

  const article = await prisma.article.create({
    data: {
      headline: data.headline,
      summary: data.summary,
      content: data.content,
      image_url: data.image_url,
      editorsChoice: data.editorsChoice,
      categoryId: data.categoryIds?.[0] || "", // Ta första kategorin
      authorId: session.user.id, // Använd den inloggade användarens ID
    },
  });

  // Return created article so the client can stay on the page and refresh state
  return { id: article.id, headline: article.headline };
}
