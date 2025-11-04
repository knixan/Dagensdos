"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Aside from "@/components/layout/aside/aside";
import LoginForm from "@/components/Forms/LoginForm";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Mail } from "lucide-react";

export default function LoginPage(): React.JSX.Element {
  const searchParams = useSearchParams();
  const message = searchParams?.get("message");
  const userEmail = searchParams?.get("email");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex grow pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              {/* Email Verification Alert */}
              {message === "check-email" && (
                <Alert className="border-2 border-primary/50 bg-primary/10 dark:bg-primary-950 dark:border-primary-800 shadow-lg">
                  <Mail className="h-5 w-5 text-primary dark:text-primary-300" />
                  <AlertTitle className="text-primary font-semibold text-lg dark:text-primary-100">
                    Bekräfta din e-postadress
                  </AlertTitle>
                  <AlertDescription className="text-primary dark:text-primary-200 text-base space-y-2">
                    <p>
                      Vänligen bekräfta din e-postadress genom att klicka på
                      länken vi har skickat till{" "}
                      <strong>{userEmail || "din e-post"}</strong>.
                    </p>
                    <p>
                      Om du inte hittar mailet, kontrollera din skräppost.
                      Kontot aktiveras först efter bekräftelse av
                      e-postadressen.
                    </p>
                  </AlertDescription>
                </Alert>
              )}

              <LoginForm />
              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  Har du inget konto?&nbsp;
                  <Link
                    href={`/registrera${
                      searchParams?.get("next")
                        ? `?next=${encodeURIComponent(
                            searchParams.get("next") || ""
                          )}`
                        : ""
                    }`}
                    className="text-primary hover:underline"
                  >
                    Registrera dig
                  </Link>
                </p>
              </div>
            </div>

            <Aside />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
