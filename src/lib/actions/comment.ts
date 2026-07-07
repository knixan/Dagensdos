"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { checkRateLimit } from "@/lib/rate-limit";
import type { AdminUser } from "@/lib/schema/zod-schemas";

export type CommentWithUser = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
  };
};

type CommentRow = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: { id: string; name: string | null; email: string };
};

function toCommentWithUser(comment: CommentRow): CommentWithUser {
  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    user: {
      id: comment.user.id,
      name: comment.user.name || comment.user.email.split("@")[0],
    },
  };
}

async function getSessionFromHeaders() {
  const hdrs = await headers();
  return auth.api.getSession({
    headers: hdrs as unknown as Record<string, string>,
  });
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
    const session = await getSessionFromHeaders();

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

export async function updateComment(
  commentId: string,
  content: string,
): Promise<{ success: boolean; comment?: CommentWithUser; error?: string }> {
  try {
    const session = await getSessionFromHeaders();

    if (!session || !session.user) {
      return { success: false, error: "Du måste vara inloggad" };
    }

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      return { success: false, error: "Kommentaren får inte vara tom" };
    }

    const existing = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    });

    if (!existing) {
      return { success: false, error: "Kommentaren hittades inte" };
    }

    if (existing.userId !== session.user.id) {
      return {
        success: false,
        error: "Du kan bara redigera dina egna kommentarer",
      };
    }

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { content: trimmedContent },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    return { success: true, comment: toCommentWithUser(updated) };
  } catch (err) {
    console.error("Failed to update comment:", err);
    return { success: false, error: "Kunde inte uppdatera kommentaren" };
  }
}

export async function deleteComment(
  commentId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getSessionFromHeaders();

    if (!session || !session.user) {
      return { success: false, error: "Du måste vara inloggad" };
    }

    const existing = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    });

    if (!existing) {
      return { success: false, error: "Kommentaren hittades inte" };
    }

    const role = (session.user as unknown as AdminUser)?.role;
    const isOwner = existing.userId === session.user.id;
    const isModerator = role === "admin" || role === "editor";

    if (!isOwner && !isModerator) {
      return {
        success: false,
        error: "Du kan bara ta bort dina egna kommentarer",
      };
    }

    await prisma.comment.delete({ where: { id: commentId } });

    return { success: true };
  } catch (err) {
    console.error("Failed to delete comment:", err);
    return { success: false, error: "Kunde inte ta bort kommentaren" };
  }
}
