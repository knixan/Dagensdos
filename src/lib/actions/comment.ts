"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { checkRateLimit } from "@/lib/rate-limit";

export type CommentWithUser = {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
  };
};

type CommentRow = {
  id: string;
  content: string;
  createdAt: Date;
  user: { id: string; name: string | null; email: string };
};

function toCommentWithUser(comment: CommentRow): CommentWithUser {
  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    user: {
      id: comment.user.id,
      name: comment.user.name || comment.user.email.split("@")[0],
    },
  };
}

export async function getComments(
  articleId: string,
): Promise<CommentWithUser[]> {
  try {
    const comments = await prisma.comment.findMany({
      where: { articleId },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    return comments.map(toCommentWithUser);
  } catch (err) {
    console.error("Failed to fetch comments:", err);
    return [];
  }
}

export async function createComment(
  articleId: string,
  content: string,
): Promise<{ success: boolean; comment?: CommentWithUser; error?: string }> {
  try {
    const hdrs = await headers();
    const session = await auth.api.getSession({
      headers: hdrs as unknown as Record<string, string>,
    });

    if (!session || !session.user) {
      return {
        success: false,
        error: "Du måste vara inloggad för att kommentera",
      };
    }

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      return { success: false, error: "Kommentaren får inte vara tom" };
    }

    const allowed = await checkRateLimit(`comment:${session.user.id}`, {
      limit: 5,
      windowMs: 60_000,
    });
    if (!allowed) {
      return {
        success: false,
        error: "Du kommenterar för snabbt. Vänta en stund och försök igen.",
      };
    }

    const created = await prisma.comment.create({
      data: {
        content: trimmedContent,
        userId: session.user.id,
        articleId,
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    return { success: true, comment: toCommentWithUser(created) };
  } catch (err) {
    console.error("Failed to create comment:", err);
    return { success: false, error: "Kunde inte skapa kommentar" };
  }
}
