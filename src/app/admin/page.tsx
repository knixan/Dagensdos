import React from "react";
import LinkButton from "@/components/Buttons/LinkButton";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { requireAdmin } from "@/lib/server-auth";

export default async function AdminPage() {
  await requireAdmin();

  return (
    <>
      <Navbar />
      <main className="flex grow pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-8">Adminpanel</h1>
          <div className="flex flex-col md:flex-row gap-6 justify-center mt-8">
            <LinkButton
              href="/admin/artiklar"
              variant="primary"
              className="w-full md:w-auto text-center text-lg py-4 px-8"
            >
              Artiklar
            </LinkButton>

            <LinkButton
              href="/admin/kategorier"
              variant="primary"
              className="w-full md:w-auto text-center text-lg py-4 px-8"
            >
              Kategorier
            </LinkButton>
            <LinkButton
              href="/admin/anvandare"
              variant="primary"
              className="w-full md:w-auto text-center text-lg py-4 px-8"
            >
              Användare
            </LinkButton>
            <LinkButton
              href="/admin/dashboard"
              variant="primary"
              className="w-full md:w-auto text-center text-lg py-4 px-8"
            >
              Dashboard
            </LinkButton>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
