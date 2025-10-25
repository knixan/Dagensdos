"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation"; // Ta bort useSearchParams eftersom vi inte behöver det längre
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Aside from "@/components/layout/aside/aside";
import CheckoutForm from "@/components/Forms/CheckoutForm";
import { useSession } from "@/lib/auth-client";

export default function CheckoutPage(): React.ReactElement {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Kontrollera autentisering vid sidladdning
  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.push(
        "/logga-in?message=Du måste registrera dig och logga in för att komma åt kassan."
      );
    }
  }, [router, session, isPending]);

  // Hårdkodad till premium-planen
  const selectedPlan = {
    name: "Premium",
    price: "199 kr/månad",
    features: [
      "Full tillgång + arkiv",
      "Personliga rekommendationer",
      "VIP-evenemang",
    ],
  };

  // router navigation handled by CheckoutForm onSubmit

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <section className="bg-card p-6 rounded-xl shadow border border-border">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Checkout — Premium (HÅRDKODAD FRONTEND)
                </h1>
                <p className="text-muted-foreground mb-4">
                  Fyll i dina uppgifter för att slutföra betalningen.
                </p>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-foreground">
                    Sammanfattning
                  </h2>
                  <div className="mt-3 p-4 rounded-md border border-border bg-popover text-popover-foreground">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-md font-semibold text-foreground">
                          {selectedPlan.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {selectedPlan.price}
                        </div>
                      </div>
                    </div>
                    <ul className="mt-3 text-sm text-muted-foreground space-y-1">
                      {selectedPlan.features.map((f) => (
                        <li key={f}>• {f}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <CheckoutForm onSubmit={() => router.push("/kassa/success")} />
              </section>
            </div>

            <Aside />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
