import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Aside from "@/components/layout/aside/aside";
import ArticlesSection from "@/components/articles/ArticlesSection.server";

export default async function HomePage(): Promise<React.ReactElement> {
  return (
    <>
      <Navbar />

      <main className="flex-grow pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              <ArticlesSection />
            </div>

            <Aside />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
