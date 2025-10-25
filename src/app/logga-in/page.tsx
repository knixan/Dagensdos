"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Aside from "@/components/layout/aside/aside";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function LoginPage(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams?.get("message");

  type FormData = { email: string; password: string };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ defaultValues: { email: "", password: "" } });

  async function onSubmit(data: FormData) {
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error(error.message || "Kunde inte logga in");
      return;
    }

    toast.success("Inloggad");
    router.refresh();
    router.push("/mina-sidor");
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-card p-6 rounded-xl shadow border border-border">
                <h1 className="text-3xl font-extrabold text-foreground mb-2">
                  Logga in
                </h1>
                {message && (
                  <p className="text-sm text-destructive mb-4">
                    Du måste{" "}
                    <a href="/registrera" className="underline text-primary">
                      registrera dig
                    </a>{" "}
                    och logga in för att komma åt kassan.
                  </p>
                )}
                <p className="text-muted-foreground mb-6">
                  Logga in för att hantera din prenumeration och dina
                  inställningar.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">
                      E-post
                    </label>
                    <Input
                      type="email"
                      {...register("email", {
                        required: "E-post krävs",
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: "Ogiltig e-post",
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">
                      Lösenord
                    </label>
                    <Input
                      type="password"
                      {...register("password", {
                        required: "Lösenord krävs",
                        minLength: { value: 6, message: "Minst 6 tecken" },
                      })}
                    />
                    {errors.password && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/")}
                      disabled={isSubmitting}
                    >
                      Avbryt
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Loggar in..." : "Logga in"}
                    </Button>
                  </div>
                </form>
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
