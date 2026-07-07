"use server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ArticleEditSchema, ArticleEditValues } from "./schema";
import { requireAdminOrEditor } from "@/lib/server-auth";
import { deleteUploadedImage } from "@/lib/actions/uploadthing";

export async function editArticle(values: ArticleEditValues) {
  await requireAdminOrEditor();
  const data = await ArticleEditSchema.parseAsync(values);

  const existing = await prisma.article.findUnique({
    where: { id: data.id },
    select: { image_url: true },
  });

  const categoryId = data.categoryIds?.[0];
  // Uppdatera artikeln med de nya värdena
  await prisma.article.update({
    where: { id: data.id },
    data: {
      headline: data.headline,
      summary: data.summary,
      content: data.content,
      image_url: data.image_url,
      editorsChoice: data.editorsChoice,
      // Enbart koppla kategorin om en categoryId finns
      ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
    },
  });

  // Om bilden byttes ut eller togs bort, städa bort den gamla filen från UploadThing
  if (existing?.image_url && existing.image_url !== data.image_url) {
    await deleteUploadedImage(existing.image_url);
  }

  revalidatePath("/");
  revalidatePath("/artiklar");
  revalidatePath("/kategori/[categoryId]", "layout");

  // Efter uppdatering, omdirigera till admin artikelsidan
  redirect(`/admin/artiklar`);
}
