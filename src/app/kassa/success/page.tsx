import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Aside from "@/components/layout/aside/aside";
import { Button } from "@/components/ui/button";

export default function SuccessPage(): React.ReactElement {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <section className="bg-card p-6 rounded-xl shadow border border-border">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Tack! Din betalning lyckades. (HÅRDKODAD FRONTEND DEMO TA BORT
                  DENNA TEXT NÄR DU BYGT KLART BACKEND)
                </h1>
                <p className="text-muted-foreground">
                  Vi skickar en bekräftelse via e-post. Detta är en
                  frontend-demo och betalningen är simulerad.
                </p>

                <div className="mt-6 p-4 rounded-md border border-border bg-popover text-popover-foreground">
                  <h2 className="text-lg font-semibold text-foreground mb-2">
                    Orderbekräftelse
                  </h2>
                  <div className="text-sm text-muted-foreground mb-3">
                    Här är din köpsammanställning (hårdkodad för frontend-demo):
                  </div>

                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Ordernummer</dt>
                      <dd className="text-foreground font-medium">
                        KD-20251008-00123
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Datum</dt>
                      <dd className="text-foreground font-medium">
                        8 oktober 2025
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Plan</dt>
                      <dd className="text-foreground font-medium">Plus</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Pris</dt>
                      <dd className="text-foreground font-medium">
                        99 kr/månad
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Betalningsmetod</dt>
                      <dd className="text-foreground font-medium">
                        Kort (simulerad)
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Mottagare</dt>
                      <dd className="text-foreground font-medium">
                        Anna Svensson — anna@example.com
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4 flex gap-3">
                    <Button asChild variant="default">
                      <Link href="/installningar">Gå till Mina sidor</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/">Till startsidan</Link>
                    </Button>
                  </div>
                </div>
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
