import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Article } from "@/lib/articles";

type Props = {
  article: Article;
  compact?: boolean;
  className?: string;
};

export function ArticleCard({ article, compact = false, className = "" }: Props) {
  return (
    <article
      className={cn(
        "bg-card p-4 rounded-lg shadow hover:shadow-lg transition duration-200 border border-border",
        compact ? "p-3" : "p-4",
        className
      )}
    >
  <p className="text-xs font-semibold text-accent uppercase">{article.category}</p>
  <Link href={`/artiklar/${article.slug}`} className="mt-1 block">
        <h4 className="mt-1 text-lg font-bold text-foreground hover:text-accent cursor-pointer line-clamp-2">
          {article.title}
        </h4>
      </Link>
      <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{article.excerpt}</p>
      <Link href={`/artiklar/${article.slug}`} className="mt-3 inline-block text-sm text-primary hover:underline">
        Läs mer
      </Link>
    </article>
  );
}

export default ArticleCard;
