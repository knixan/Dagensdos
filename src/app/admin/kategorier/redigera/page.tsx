import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { requireAdminOrEditor } from "@/lib/server-auth";

export default async function AdminRedigeraKategoriPage() {
  await requireAdminOrEditor();

  return (
    <>
      <Navbar />
      <main className="flex grow pt-8 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-6">Redigera kategori</h1>
          {/* TODO: Lista kategorier och låt admin välja en att redigera */}
          <p>Välj en kategori att redigera.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
