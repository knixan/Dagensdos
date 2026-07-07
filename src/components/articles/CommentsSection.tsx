"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/client/auth-client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  type CommentWithUser,
} from "@/lib/actions/comment";

type CommentsSectionProps = {
  articleId: string;
};

export default function CommentsSection({ articleId }: CommentsSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getComments(articleId);
      setComments(data);
    } catch (err) {
      console.error("Failed to load comments:", err);
      toast.error("Kunde inte ladda kommentarer");
    } finally {
      setIsLoading(false);
    }
  }, [articleId]);

  useEffect(() => {
    // Fetch comments on mount and whenever articleId changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Kommentaren får inte vara tom");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createComment(articleId, content);

      if (result.success && result.comment) {
        setComments((prev) => [result.comment!, ...prev]);
        setContent("");
        toast.success("Kommentar skapad!");
      } else {
        toast.error(result.error || "Kunde inte skapa kommentar");
      }
    } catch (err) {
      console.error("Failed to create comment:", err);
      toast.error("Kunde inte skapa kommentar");
    } finally {
      setIsSubmitting(false);
    }
  }

  function startEdit(comment: CommentWithUser) {
    setEditingId(comment.id);
    setEditContent(comment.content);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditContent("");
  }

  async function handleSaveEdit(commentId: string) {
    if (!editContent.trim()) {
      toast.error("Kommentaren får inte vara tom");
      return;
    }

    setIsSavingEdit(true);
    try {
      const result = await updateComment(commentId, editContent);

      if (result.success && result.comment) {
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? result.comment! : c)),
        );
        setEditingId(null);
        setEditContent("");
        toast.success("Kommentar uppdaterad");
      } else {
        toast.error(result.error || "Kunde inte uppdatera kommentaren");
      }
    } catch (err) {
      console.error("Failed to update comment:", err);
      toast.error("Kunde inte uppdatera kommentaren");
    } finally {
      setIsSavingEdit(false);
    }
  }

  async function handleDelete(commentId: string) {
    if (!confirm("Är du säker på att du vill ta bort kommentaren?")) return;

    setDeletingId(commentId);
    try {
      const result = await deleteComment(commentId);

      if (result.success) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        toast.success("Kommentaren togs bort");
      } else {
        toast.error(result.error || "Kunde inte ta bort kommentaren");
      }
    } catch (err) {
      console.error("Failed to delete comment:", err);
      toast.error("Kunde inte ta bort kommentaren");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mt-12 border-t border-border pt-8">
      <h2 className="text-2xl font-bold mb-6 text-foreground">
        Kommentarer ({comments.length})
      </h2>

      {/* Comment form - only for logged in users */}
      {session?.user ? (
        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Skriv en kommentar..."
            rows={4}
            className="w-full"
            disabled={isSubmitting}
          />
          <Button type="submit" disabled={isSubmitting || !content.trim()}>
            {isSubmitting ? "Skickar..." : "Skicka kommentar"}
          </Button>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-muted/30 rounded-lg border border-border">
          <p className="text-muted-foreground">
            Du måste vara{" "}
            <a href="/logga-in" className="text-primary hover:underline">
              inloggad
            </a>{" "}
            för att kommentera.
          </p>
        </div>
      )}

      {/* Comments list */}
      {isLoading ? (
        <p className="text-muted-foreground">Laddar kommentarer...</p>
      ) : comments.length === 0 ? (
        <p className="text-muted-foreground">
          Inga kommentarer än. Bli först att kommentera!
        </p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => {
            const isOwner = session?.user?.id === comment.user.id;
            const isEditing = editingId === comment.id;
            const isEdited =
              comment.updatedAt.toString() !== comment.createdAt.toString();

            return (
              <div key={comment.id} className="border-b border-border pb-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="font-semibold text-foreground">
                        {comment.user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString(
                          "sv-SE",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                        {isEdited && " (redigerad)"}
                      </span>
                    </div>

                    {isEditing ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={3}
                          className="w-full"
                          disabled={isSavingEdit}
                        />
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleSaveEdit(comment.id)}
                            disabled={isSavingEdit || !editContent.trim()}
                          >
                            {isSavingEdit ? "Sparar..." : "Spara"}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={cancelEdit}
                            disabled={isSavingEdit}
                          >
                            Avbryt
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    )}

                    {isOwner && !isEditing && (
                      <div className="flex gap-3 mt-2">
                        <button
                          type="button"
                          onClick={() => startEdit(comment)}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Pencil className="h-3 w-3" />
                          Redigera
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(comment.id)}
                          disabled={deletingId === comment.id}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                          {deletingId === comment.id
                            ? "Tar bort..."
                            : "Ta bort"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
