import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import LinkButton from "@/components/Buttons/LinkButton";
import type { Article, Category } from "@/generated/prisma";
import { requireAdmin } from "@/lib/server-auth";

export default async function AdminRedigeraArtikelPage({ searchParams }: { searchParams?: { q?: string } }) {
  await requireAdmin();
  const q = searchParams?.q ?? "";
  const articles = await prisma.article.findMany({ where: q ? { OR: [{ headline: { contains: q } }, { summary: { contains: q } }] } : undefined, include: { category: true } });
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-6">Redigera artikel</h1>
          <div className="mb-4">
            <form method="get" className="flex gap-2">
              <input defaultValue={q} name="q" placeholder="Sök artiklar..." className="border rounded px-2 py-1" />
              <button type="submit" className="px-3 py-1 bg-gray-200 rounded">Sök</button>
            </form>
          </div>
          <ul className="space-y-4">
            {articles.map((a) => (
              <li key={a.id} className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{a.headline}</div>
                  <div className="text-sm text-muted-foreground">
                    {Array.isArray((a as Article & { category: Category[] }).category)
                      ? ((a as Article & { category: Category[] }).category).map((c) => c.name).join(", ")
                      : ""}
                  </div>
                </div>
                <div className="flex gap-2">
                  <LinkButton href={`/admin/artiklar/redigera/${a.id}`} variant="primary">Redigera</LinkButton>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
