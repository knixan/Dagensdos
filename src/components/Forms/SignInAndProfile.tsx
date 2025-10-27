"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, LogIn } from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "sonner";

function LoginInlineForm({ onSubmit }: { onSubmit: (data: { email: string; password: string }) => void }) {
  const { register, handleSubmit } = useForm<{ email: string; password: string }>({
    defaultValues: { email: "", password: "" },
  });

  const submit = useCallback(
    (data: { email: string; password: string }) => onSubmit(data),
    [onSubmit]
  );

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-3">
      <div>
        <label className="block text-sm text-muted-foreground mb-1">E-post</label>
        <Input type="email" {...register("email", { required: true })} />
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-1">Lösenord</label>
        <Input type="password" {...register("password", { required: true })} />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button type="submit">Logga in</Button>
      </div>
    </form>
  );
}

export default function SignInAndProfile() {
  const router = useRouter();
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  async function handleSignIn(data: { email: string; password: string }) {
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error(error.message || "Kunde inte logga in");
    } else {
      toast.success("Inloggning lyckades");
      router.push("/mina-sidor");
    }
  }

  if (!isLoggedIn) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition transform hover:scale-110">
            <LogIn className="h-4 w-4" />
            Logga in
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Logga in</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <LoginInlineForm onSubmit={handleSignIn} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Enkelt: navigera direkt till Mina sidor
  return (
    <Button asChild className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition transform hover:scale-110">
      <Link href="/mina-sidor" className="flex items-center gap-2">
        <User className="h-4 w-4" />
        Mina sidor
      </Link>
    </Button>
  );
}
