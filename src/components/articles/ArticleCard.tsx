import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Article } from "@/lib/articles";

type Props = {
  article: Article;
  compact?: boolean;
  className?: string;
};

export function ArticleCard({
  article,
  compact = false,
  className = "",
}: Props) {
  // Säker läsning av eventuellt bildfält utan `any`
  const imgSrc = (article as { image?: string }).image ?? "/placeholder.png";

  return (
    <article
      className={cn(
        "bg-card rounded-lg shadow hover:shadow-lg transition duration-200 border border-border",
        compact ? "p-3" : "p-6",
        "grid grid-cols-1  gap-4",
        className
      )}
    >
      {/* kategori */}
      <div className="col-span-full">
        <p className="text-xs font-semibold text-accent uppercase">
          {article.category}
        </p>
      </div>

      {/* innehåll: rubrik först */}
      <div className="col-span-full">
        <Link href={`/artiklar/${article.slug}`} className="mt-1 block">
          <h4 className="mt-1 text-xl font-bold text-foreground hover:text-accent cursor-pointer line-clamp-2">
            {article.title}
          </h4>
        </Link>
      </div>

      {/* bild (nu under rubriken och över excerpt) */}
      <div className="col-span-full w-full h-40 md:h-48 rounded-md overflow-hidden bg-muted relative">
        {article.premium ? (
          <div className="absolute left-2 top-2 bg-primary-foreground text-primary px-2 py-0.5 rounded-md text-xs font-semibold">
            Premium Artikel
          </div>
        ) : null}
        <Image
          src={imgSrc}
          alt={article.title}
          width={800}
          height={480}
          className="object-cover w-full h-full"
          priority={false}
        />
      </div>

      {/* excerpt + Läs mer */}
      <div className="col-span-full">
        <div className="mt-2 text-sm text-muted-foreground line-clamp-3 prose prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {article.excerpt}
          </ReactMarkdown>
        </div>

        <Link
          href={`/artiklar/${article.slug}`}
          className="mt-3 inline-block text-sm text-primary hover:underline"
        >
          Läs mer
        </Link>
      </div>
    </article>
  );
}

export default ArticleCard;
