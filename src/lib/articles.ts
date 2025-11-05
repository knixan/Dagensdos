// Shared lightweight Article type used by UI components
// This mirrors the shape created in ArticlesSection.server when mapping Prisma rows
export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  category?: string;
  image?: string;
  date?: string; // ISO yyyy-mm-dd
  premium?: boolean;
};

