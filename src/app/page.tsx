import React from "react";
// ...existing code... (Link and Image are used inside the new components)
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Aside from "@/components/layout/aside/aside";
import ArticlesSection from "@/components/articles/ArticlesSection.server";

//import { CookieSonner } from "./actions";

export default function HomePage(): React.ReactElement {
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
