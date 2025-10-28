"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Aside from "@/components/layout/aside/aside";
import LoginForm from "@/components/Forms/LoginForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Mail } from "lucide-react";

export default function LoginPage(): React.JSX.Element {
  const searchParams = useSearchParams();
  const message = searchParams?.get("message");
  const userEmail = searchParams?.get("email");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              {/* Email Verification Alert */}
              {message === "check-email" && (
                <Alert className="bg-blue-50 border-2 border-blue-200 dark:bg-blue-950 dark:border-blue-800 shadow-lg">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <AlertTitle className="text-blue-900 dark:text-blue-100 font-semibold text-lg">
                    Bekräfta din e-postadress
                  </AlertTitle>
                  <AlertDescription className="text-blue-800 dark:text-blue-200 text-base space-y-2">
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
            </div>

            <Aside />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
