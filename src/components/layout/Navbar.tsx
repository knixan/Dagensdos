"use client";

import Link from "next/link";
import Image from 'next/image';
import React, { useState, useEffect } from "react";
import type { AdminUser } from "@/lib/zod-schemas";
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
  // Shared style for auth / action buttons so they have equal size
  const actionStyle: React.CSSProperties = {
    backgroundColor: 'var(--chart-4)',
    color: 'var(--secondary-foreground)',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '130px',
    height: '44px',
    fontSize: '1.125rem',
    fontWeight: 'semibold'
  };
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [subscriptions, setSubscription] = useState<Array<{ status?: string }>>([]);

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
  <header className="shadow-md sticky top-0 z-50" style={{ backgroundColor: 'var(--secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
            {/* Logo och Titel-sektion */}
              <Link href="/" className="flex items-center space-x-3">
                <Image
                  src="/images/loggo.jpg"
                  alt="Dagens Dos logotyp"
                  width={60}
                  height={60}
                  className="rounded"
                  priority
                />
             
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
                    className="whitespace-nowrap text-lg font-medium"
                    style={{ color: 'var(--secondary-foreground)' }}
                  >
                    {cat.name}
                  </Link>
                ))
              )}
              {(session?.user as unknown as AdminUser)?.role === 'admin' && (
                <Link href="/admin" className="whitespace-nowrap text-lg font-medium" style={{ color: 'var(--secondary-foreground)' }}>
                  Admin
                </Link>
              )}
            </nav>

            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 gap-4">
              <ModeToggle />

              {!isAuthenticated ? (
                <>
                        <Link href="/logga-in" className="whitespace-nowrap text-lg font-medium" style={actionStyle}>
                          Logga in
                        </Link>
                        <Link href="/registrera" className="whitespace-nowrap text-lg font-medium" style={actionStyle}>
                          Registrera
                        </Link>
                </>
              ) : (
                <>
                  <Link href="/mina-sidor" className="whitespace-nowrap text-lg font-medium" style={actionStyle}>
                    Mina sidor
                  </Link>
                  {activeSubscription?.status === "active" ? (
                    <Button
                      onClick={async () => {
                        await authClient.subscription.cancel({
                          returnUrl: "/"
                        })
                      }}
                      style={actionStyle}
                      className="px-4 py-2"
                    >
                      Avsluta
                    </Button>
                  ) : (
                    <Button
                      onClick={async () => {
                        await authClient.subscription.upgrade({
                          plan: "Premium",
                          successUrl: "/",
                          cancelUrl: "/"
                        })
                      }}
                      className="px-4 py-2 text-lg"
                    >
                      Prenumerera
                    </Button>
                  )}
                  <Button variant="outline" onClick={handleLogout} style={{ minWidth: actionStyle.minWidth, height: actionStyle.height, fontSize: actionStyle.fontSize }}>
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
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
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
                    className="mt-2 rounded-md p-4 shadow-lg space-y-3 w-full max-h-[80vh] overflow-auto z-50"
                    style={{ backgroundColor: 'var(--secondary)' }}
                  >
                    <div className="flex flex-col space-y-3">
                      {loadingCategories ? (
                        <div className="block text-lg font-medium text-foreground">
                          Laddar...
                        </div>
                      ) : (
                        categories.map((cat) => (
                          <Link
                              key={cat.id}
                              href={`/kategori/${cat.id}`}
                  className="block text-lg font-medium"
                    style={{ color: 'var(--secondary-foreground)' }}
                              onClick={() => setMobileOpen(false)}
                            >
                              {cat.name}
                            </Link>
                        ))
                      )}
                      {(session?.user as unknown as AdminUser)?.role === 'admin' && (
                        <Link
                          href="/admin"
                          className="block text-lg font-medium"
                          style={{ color: 'var(--secondary-foreground)' }}
                          onClick={() => setMobileOpen(false)}
                        >
                          Admin
                        </Link>
                      )}
                    </div>

                    <div className="pt-2 border-t border-muted-foreground/20 flex flex-col gap-3">
                      <div className="pt-2">
                        <ModeToggle />
                      </div>
                      {!isAuthenticated ? (
                        <>
                          <Link href="/logga-in" className="block font-medium" style={actionStyle} onClick={() => setMobileOpen(false)}>
                            Logga in
                          </Link>
                          <Link href="/registrera" className="block font-medium" style={actionStyle} onClick={() => setMobileOpen(false)}>
                            Registrera
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link href="/mina-sidor" className="block font-medium" style={actionStyle} onClick={() => setMobileOpen(false)}>
                            Mina sidor
                          </Link>
                          <button onClick={handleLogout} className="block font-medium text-foreground hover:text-primary" style={{ minWidth: actionStyle.minWidth, height: actionStyle.height, fontSize: actionStyle.fontSize }}>
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

        {/* Varningsraden under länkar och knappar */}
        <div className="w-full overflow-hidden">
          <div
            role="status"
            aria-live="polite"
            className="marquee-bar"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--accent-foreground)', fontWeight: 'bold' }}
          >
            <div
              className="marquee"
              style={{ display: 'inline-block', paddingLeft: '100%', whiteSpace: 'nowrap', animation: 'marquee 40s linear infinite' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.animationPlayState = 'paused')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.animationPlayState = 'running')}
            >
              VARNING TILL ALLMÄNHETEN — En man som identifierar sig som en Kalkong springer runt med blöjja på södermalm, men va inte orolig han är inte farlig även om det är mycket obehagligt!
            </div>
          </div>

          <style>{`
            @keyframes marquee {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
            .marquee { animation-play-state: running; }
            .marquee-bar { padding: 0.5rem 0; }
            .marquee:hover { animation-play-state: paused; }
            @media (prefers-reduced-motion: reduce) {
              .marquee { animation: none !important; transform: none !important; }
            }
          `}</style>
        </div>
      </header>
    </>
  );
}
