"use server"

import { ArticleCreateSchema, ArticleCreateValues } from "./schema"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/server-auth"

export async function createArticle(values: ArticleCreateValues) {
    await requireAdmin();
    const data = await ArticleCreateSchema.parseAsync(values);

    const connectCategories = (data.categoryIds || []).map((id) => ({ id }));

    const article = await prisma.article.create({
        data: {
            headline: data.headline,
            summary: data.summary,
            content: data.content,
            image_url: data.image_url,
            editorsChoice: data.editorsChoice,
            category: {
                connect: connectCategories,
            },
        },
    });

    // Return created article so the client can stay on the page and refresh state
    return { id: article.id, headline: article.headline }
}
