"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema, type SignUpInput } from "@/lib/schemas/auth";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type FormValues = SignUpInput;

export default function SignUpForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPass: "" },
  });

  async function onSubmit(values: FormValues) {
    const res = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
    });

    // Debug: log full response from Better Auth so we can see validation details
    console.log("[SignUp] response:", res);
    if (res.error) {
      // Better-auth may return an Error-like object whose properties are non-enumerable.
      // Log non-enumerable properties and a dir view so we can see message/stack.
      try {
        console.error("SignUp error (dir):");
        console.dir(res.error);
        console.error("SignUp error keys:", Object.getOwnPropertyNames(res.error));
        try {
          // Try to stringify known properties
          const ser = JSON.stringify(res.error, Object.getOwnPropertyNames(res.error));
          console.error("SignUp error (serialized):", ser);
        } catch (serErr) {
          console.error("SignUp error: couldn't serialize error", serErr);
        }
      } catch (logErr) {
        console.error("SignUp error: logging failure", logErr);
        console.error(res.error);
      }
      // If the error object is empty ({}), do a raw fetch to capture the HTTP status and body
      if (Object.keys(res.error).length === 0) {
        try {
          const raw = await fetch('/api/auth/sign-up/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: values.name, email: values.email, password: values.password }),
          });

          const text = await raw.text();
          let parsed;
          try { parsed = JSON.parse(text); } catch { parsed = text; }

          console.error('[SignUp][raw fetch] status:', raw.status, 'body:', parsed);
          toast.error(`Registration failed (status ${raw.status}). Se konsol för detaljer.`);
        } catch (fetchErr) {
          console.error('[SignUp][raw fetch] error:', fetchErr);
          toast.error('Kunde inte nå auth-endpoint för felsökning.');
        }
      } else {
        toast.error(res.error?.message || "Kunde inte skapa konto");
      }
    } else {
      onSuccess?.();
      toast.success("Konto skapat");
      // After successful registration, navigate user to the login page
      router.push('/logga-in');
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Registrera</CardTitle>
        <CardDescription>Fyll i nedan för att skapa ett konto</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Namn</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-post</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lösenord</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPass"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bekräfta lösenord</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-auto bg-primary text-primary-foreground hover:bg-primary/90">
              {form.formState.isSubmitting ? "Skapar konto..." : "Skapa konto"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
