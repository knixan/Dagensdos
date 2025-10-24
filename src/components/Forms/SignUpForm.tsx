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

    if (res.error) {
      // Log detailed error information
      console.error("[SignUp] Full response:", res);
      console.error("[SignUp] Error object:", res.error);
      console.error("[SignUp] Error code:", res.error.code);
      console.error("[SignUp] Error message:", res.error.message);
      console.error("[SignUp] Error status:", res.error.status);
      console.error("[SignUp] Error statusText:", res.error.statusText);
      
      // Show user-friendly error message
      const errorMessage = res.error?.message || res.error?.statusText || "Kunde inte skapa konto. Kontrollera att e-postadressen inte redan används.";
      toast.error(errorMessage);
    } else {
      console.log("[SignUp] Success:", res.data);
      onSuccess?.();
      toast.success("Konto skapat");
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
