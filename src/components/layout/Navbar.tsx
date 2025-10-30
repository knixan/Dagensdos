"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { ModeToggle } from "../Buttons/toggle-theme-button";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import authClient, { useSession } from "@/lib/auth-client";

type NavCategory = { id: string; name: string };

export function Navbar(): React.ReactElement {
  const router = useRouter();
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categories, setCategories] = useState<NavCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [subscriptions, setSubscription] = useState<any[]>([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (session?.user.id) {
        const response = await authClient.subscription.list()
        setSubscription(response.data || [])
      }

    }
    fetchSubscriptions()
  }, [session?.user.id])
  const activeSubscription = subscriptions.find(
    (sub) => sub.status === "active" || sub.status === "trialing"
  )

  async function handleLogout() {
    await authClient.signOut();
    setMobileOpen(false);
    // refresh so UI updates
    router.refresh();
    router.push("/");
  }

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("/api/kategorier");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (mounted) setCategories(data || []);
      } catch (err) {
        console.error("Could not load navbar categories", err);
      } finally {
        if (mounted) setLoadingCategories(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <header className="bg-card shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
            {/* Logo och Titel-sektion */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex flex-col">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                  Dagens Dos
                </h1>
                <p className="text-sm italic text-muted-foreground mt-1">
                  Sanningen gör ont, här får du en bedövning.
                </p>
              </div>
            </Link>

            {/* Huvudnavigering (Desktop) - categories from API */}
            <nav className="hidden md:flex space-x-8">
              {loadingCategories ? (
                <div className="text-sm text-muted-foreground">Laddar...</div>
              ) : (
                categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/kategori/${cat.id}`}
                    className="whitespace-nowrap text-base font-medium text-muted-foreground hover:text-primary"
                  >
                    {cat.name}
                  </Link>
                ))
              )}
            </nav>

            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 space-x-3">
              <ModeToggle />

              {!isAuthenticated ? (
                <>
                  <Link
                    href="/logga-in"
                    className="whitespace-nowrap text-base font-medium text-foreground hover:text-primary"
                  >
                    Logga in
                  </Link>
                  <Button asChild variant="default">
                    <Link href="/registrera">Registrera</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/mina-sidor"
                    className="whitespace-nowrap text-base font-medium text-primary hover:underline"
                  >
                    Mina sidor
                  </Link>
                  {activeSubscription?.status === "active" ? (
                    <Button
                      onClick={async () => {
                        await authClient.subscription.cancel({
                          returnUrl: "/"
                        })
                      }}
                    >Unsubscribe</Button>) : (
                    <Button
                      onClick={async () => {
                        await authClient.subscription.upgrade({
                          plan: "Premium",
                          successUrl: "/",
                          cancelUrl: "/"
                        })
                      }}
                    >Subscribe</Button>)}
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="ml-2"
                  >
                    Logga ut
                  </Button>
                </>
              )}
            </div>

            {/* Mobil: statisk placerad meny som öppnas med state (undviker SSR/klient mismatch) */}
            <div className="md:hidden">
              <div>
                <button
                  type="button"
                  aria-expanded={mobileOpen}
                  aria-controls="mobile-menu"
                  onClick={() => setMobileOpen((s) => !s)}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50"
                >
                  {mobileOpen ? (
                    /* Stäng-ikon */
                    <svg
                      className="h-6 w-6 text-muted-foreground"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    /* Hamburgare-ikon */
                    <svg
                      className="h-6 w-6 text-muted-foreground"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                  <span className="sr-only">Öppna meny</span>
                </button>

                {mobileOpen && (
                  <nav
                    id="mobile-menu"
                    className="mt-2 bg-card rounded-md p-4 shadow-lg space-y-3 w-full max-h-[80vh] overflow-auto z-50"
                  >
                    <div className="flex flex-col space-y-2">
                      {loadingCategories ? (
                        <div className="block text-base font-medium text-foreground">
                          Laddar...
                        </div>
                      ) : (
                        categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/kategori/${cat.id}`}
                            className="block text-base font-medium text-foreground hover:text-primary"
                            onClick={() => setMobileOpen(false)}
                          >
                            {cat.name}
                          </Link>
                        ))
                      )}
                    </div>

                    <div className="pt-2 border-t border-muted-foreground/20 flex flex-col gap-2">
                      <div className="pt-2">
                        <ModeToggle />
                      </div>
                      {!isAuthenticated ? (
                        <>
                          <Link
                            href="/logga-in"
                            className="block text-base font-medium text-foreground hover:text-primary"
                            onClick={() => setMobileOpen(false)}
                          >
                            Logga in
                          </Link>
                          <Button asChild variant="default">
                            <Link
                              href="/registrera"
                              onClick={() => setMobileOpen(false)}
                            >
                              Registrera
                            </Link>
                          </Button>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/mina-sidor"
                            className="block text-base font-medium text-foreground hover:text-primary"
                            onClick={() => setMobileOpen(false)}
                          >
                            Mina sidor
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="block text-base font-medium text-foreground hover:text-primary"
                          >
                            Logga ut
                          </button>
                        </>
                      )}
                    </div>
                  </nav>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
