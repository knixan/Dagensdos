"use client";

import Link from "next/link";
import ThemeLogo from "@/components/Logo/ThemeLogo";
import React, { useEffect, useRef, useState } from "react";
import type { AdminUser } from "@/lib/schema/zod-schemas";
import { ModeToggle } from "../Buttons/toggle-theme-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import authClient, { useSession } from "@/lib/client/auth-client";
import { getNavbarCategories } from "@/lib/actions/category";
import {
  Search,
  User,
  LogIn,
  LogOut,
  UserPlus,
  ShieldCheck,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

type NavCategory = { id: string; name: string };

const navLinkBase =
  "whitespace-nowrap text-base font-medium px-2 py-1 rounded-md transition-colors text-secondary-foreground hover:bg-white/10";

const mobileLinkClass =
  "flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-base font-medium text-secondary-foreground hover:bg-white/10 transition-colors";

export function Navbar(): React.ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const role = (session?.user as unknown as AdminUser)?.role;
  const isAdmin = role === "admin";
  const isEditor = role === "editor";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categories, setCategories] = useState<NavCategory[]>([]);
  // Sök-state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchButtonRef = useRef<HTMLButtonElement | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [subscriptions, setSubscription] = useState<Array<{ status?: string }>>(
    [],
  );

  // Hantera sök-submit
  function handleSearchSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/sok?q=${encodeURIComponent(q)}`);
    setSearchQuery("");
    setSearchOpen(false);
    setMobileOpen(false);
  }

  useEffect(() => {
    // Close pop-out search when clicking outside
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node | null;
      if (
        searchOpen &&
        searchRef.current &&
        !searchRef.current.contains(target) &&
        searchButtonRef.current &&
        !searchButtonRef.current.contains(target)
      ) {
        setSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [searchOpen]);

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (session?.user.id) {
        const response = await authClient.subscription.list();
        setSubscription(response.data || []);
      }
    };
    fetchSubscriptions();
  }, [session?.user.id]);
  const activeSubscription = subscriptions.find(
    (sub) => sub.status === "active" || sub.status === "trialing",
  );

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
        const result = await getNavbarCategories();
        if (mounted && result.ok) {
          setCategories(result.categories || []);
        }
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
      <header className="shadow-md sticky top-0 z-50 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 md:justify-start md:gap-8">
            {/* Logo och Titel-sektion */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <ThemeLogo
                width={130}
                height={130}
                className="rounded shrink-0"
                priority
              />
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-secondary-foreground whitespace-nowrap">
                Dagens Dos
              </span>
            </Link>

            {/* Huvudnavigering (Desktop) - Startsida + Kategorier-dropdown */}
            <nav className="hidden md:flex items-center gap-2">
              <Link
                href="/"
                className={cn(navLinkBase, pathname === "/" && "bg-white/10")}
              >
                Startsida
              </Link>

              <Link
                href="/redaktorens-val"
                className={cn(
                  navLinkBase,
                  pathname === "/redaktorens-val" && "bg-white/10",
                )}
              >
                Redaktörens val
              </Link>

              {/* Kategorier dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    id="kategorier-dropdown-trigger"
                    type="button"
                    className={cn(
                      navLinkBase,
                      "bg-transparent border-0 cursor-pointer",
                      pathname?.startsWith("/kategori") && "bg-white/10",
                    )}
                  >
                    Kategorier
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuGroup>
                    {loadingCategories ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        Laddar...
                      </div>
                    ) : (
                      categories.map((cat) => (
                        <DropdownMenuItem key={cat.id} asChild>
                          <Link
                            href={`/kategori/${cat.id}`}
                            className="w-full block"
                          >
                            {cat.name}
                          </Link>
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            <div className="hidden md:flex items-center justify-end md:flex-1 gap-2">
              {/* Desktop-sök: expanderar mjukt intill ikonen */}
              <div className="flex items-center relative" ref={searchRef}>
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center"
                >
                  <label htmlFor="nav-search" className="sr-only">
                    Sök
                  </label>
                  <input
                    ref={searchInputRef}
                    id="nav-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Sök..."
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setSearchOpen(false);
                    }}
                    className={cn(
                      "rounded-md border border-white/20 bg-white/10 text-secondary-foreground placeholder:text-secondary-foreground/60 text-sm transition-all duration-300 ease-in-out focus:outline-none focus:border-white/40",
                      searchOpen
                        ? "w-40 lg:w-64 px-3 py-1.5 opacity-100 mr-1"
                        : "w-0 border-transparent px-0 py-1.5 opacity-0 pointer-events-none",
                    )}
                  />
                  <button
                    ref={searchButtonRef}
                    type="button"
                    onClick={() => setSearchOpen((s) => !s)}
                    aria-expanded={searchOpen}
                    aria-label="Öppna sök"
                    className="flex items-center justify-center h-8 w-8 rounded-md hover:bg-white/10 transition-colors"
                  >
                    <Search className="h-[1.1rem] w-[1.1rem] text-secondary-foreground" />
                  </button>
                </form>
              </div>

              <ModeToggle />

              {!isAuthenticated ? (
                <>
                  <Link
                    href="/logga-in"
                    className="whitespace-nowrap text-secondary-foreground hover:bg-white/10 py-1.5 px-3 rounded-md inline-flex items-center gap-1.5 justify-center text-sm font-medium transition-colors"
                  >
                    <LogIn className="h-4 w-4" />
                    Logga in
                  </Link>
                  <Link
                    href="/registrera"
                    className="whitespace-nowrap bg-primary text-primary-foreground hover:bg-primary/90 py-1.5 px-3 rounded-md inline-flex items-center gap-1.5 justify-center text-sm font-semibold"
                  >
                    <UserPlus className="h-4 w-4" />
                    Registrera
                  </Link>
                </>
              ) : (
                <>
                  {/* CTA sticker ut för sig, bara om användaren inte redan prenumererar */}
                  {activeSubscription?.status !== "active" && (
                 <Button
  size="sm"
  variant="secondary"
  className="bg-background text-forground"
  onClick={async () => {
    await authClient.subscription.upgrade({
      plan: "Premium",
      successUrl: "/",
      cancelUrl: "/",
    });
  }}
>
  Prenumerera
</Button>
                  )}

                  {/* Kontomeny: samlar Mina sidor / Admin / Prenumeration / Logga ut */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        aria-label="Kontomeny"
                        className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-white/10 transition-colors"
                      >
                        <User className="h-5 w-5 text-secondary-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      {session?.user?.name && (
                        <DropdownMenuLabel className="truncate">
                          {session.user.name}
                        </DropdownMenuLabel>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/mina-sidor"
                            className="flex items-center gap-2 w-full"
                          >
                            <User className="h-4 w-4" />
                            Mina sidor
                          </Link>
                        </DropdownMenuItem>
                        {(isAdmin || isEditor) && (
                          <DropdownMenuItem asChild>
                            <Link
                              href="/admin"
                              className="flex items-center gap-2 w-full"
                            >
                              <ShieldCheck className="h-4 w-4" />
                              {isAdmin ? "Admin" : "Editor's page"}
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                          <Link
                            href="/prenumeration"
                            className="flex items-center gap-2 w-full"
                          >
                            <Sparkles className="h-4 w-4" />
                            Prenumeration
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={handleLogout}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" />
                          Logga ut
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>

            {/* Mobil: statisk placerad meny som öppnas med state (undviker SSR/klient mismatch) */}
            <div className="md:hidden">
              <button
                type="button"
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                onClick={() => setMobileOpen((s) => !s)}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
              >
                {mobileOpen ? (
                  <X className="h-6 w-6 text-primary-foreground" />
                ) : (
                  <Menu className="h-6 w-6 text-primary-foreground" />
                )}
                <span className="sr-only">Öppna meny</span>
              </button>

              {mobileOpen && (
                <nav
                  id="mobile-menu"
                  className="absolute left-0 right-0 top-full w-full max-h-[calc(100vh-4rem)] overflow-auto shadow-lg z-50 bg-secondary"
                >
                  {/* Logga */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                    <Link
                      href="/"
                      className="flex items-center gap-2"
                      onClick={() => setMobileOpen(false)}
                    >
                      <ThemeLogo width={32} height={32} className="rounded" />
                      <span className="text-lg font-bold text-secondary-foreground">
                        Dagens Dos
                      </span>
                    </Link>
                    <button
                      type="button"
                      aria-label="Stäng meny"
                      onClick={() => setMobileOpen(false)}
                      className="p-1.5 rounded-md hover:bg-white/10"
                    >
                      <X className="h-5 w-5 text-secondary-foreground" />
                    </button>
                  </div>

                  <div className="flex flex-col p-2">
                    {/* Sök */}
                    <form
                      onSubmit={handleSearchSubmit}
                      className="flex items-center gap-2 px-3 py-2"
                    >
                      <Search className="h-4 w-4 text-secondary-foreground/70 shrink-0" />
                      <label htmlFor="mobile-nav-search" className="sr-only">
                        Sök
                      </label>
                      <input
                        id="mobile-nav-search"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Sök..."
                        className="w-full border-0 border-b border-white/20 bg-transparent px-1 py-1 text-sm text-secondary-foreground placeholder:text-secondary-foreground/60 focus:outline-none focus:border-white/40"
                      />
                    </form>

                    {/* Startsida */}
                    <Link
                      href="/"
                      className={mobileLinkClass}
                      onClick={() => setMobileOpen(false)}
                    >
                      Startsida
                    </Link>

                    {/* Redaktörens val */}
                    <Link
                      href="/redaktorens-val"
                      className={mobileLinkClass}
                      onClick={() => setMobileOpen(false)}
                    >
                      Redaktörens val
                    </Link>

                    {/* Kategorier */}
                    {loadingCategories ? (
                      <div className="px-3 py-2.5 text-sm text-secondary-foreground/70">
                        Laddar kategorier...
                      </div>
                    ) : (
                      categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/kategori/${cat.id}`}
                          className={mobileLinkClass}
                          onClick={() => setMobileOpen(false)}
                        >
                          {cat.name}
                        </Link>
                      ))
                    )}

                    {/* Prenumerera */}
                    <Link
                      href="/prenumeration"
                      className={mobileLinkClass}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Sparkles className="h-4 w-4" />
                      Prenumerera
                    </Link>

                    {/* Mina sidor */}
                    {isAuthenticated && (
                      <Link
                        href="/mina-sidor"
                        className={mobileLinkClass}
                        onClick={() => setMobileOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        Mina sidor
                      </Link>
                    )}

                    {/* Admin */}
                    {(isAdmin || isEditor) && (
                      <Link
                        href="/admin"
                        className={mobileLinkClass}
                        onClick={() => setMobileOpen(false)}
                      >
                        <ShieldCheck className="h-4 w-4" />
                        {isAdmin ? "Admin" : "Editor's page"}
                      </Link>
                    )}

                    {/* Logga in / Logga ut */}
                    {!isAuthenticated ? (
                      <>
                        <Link
                          href="/logga-in"
                          className={mobileLinkClass}
                          onClick={() => setMobileOpen(false)}
                        >
                          <LogIn className="h-4 w-4" />
                          Logga in
                        </Link>
                        <Link
                          href="/registrera"
                          className={mobileLinkClass}
                          onClick={() => setMobileOpen(false)}
                        >
                          <UserPlus className="h-4 w-4" />
                          Registrera
                        </Link>
                      </>
                    ) : (
                      <button
                        onClick={handleLogout}
                        className={cn(mobileLinkClass, "text-left")}
                      >
                        <LogOut className="h-4 w-4" />
                        Logga ut
                      </button>
                    )}

                    {/* Färgtema */}
                    <div className="flex items-center justify-between px-3 py-2.5 mt-1 border-t border-white/10">
                      <span className="text-base font-medium text-secondary-foreground">
                        Färgtema
                      </span>
                      <ModeToggle />
                    </div>
                  </div>
                </nav>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
