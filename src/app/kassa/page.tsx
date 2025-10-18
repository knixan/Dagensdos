"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation"; // Ta bort useSearchParams eftersom vi inte behöver det längre
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Aside } from "@/components/layout/aside";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useSession } from "@/lib/auth-client";

function CheckoutForm({ onSubmit }: { onSubmit: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onTouched' });

  function submit() {
    // For frontend demo we don't send data anywhere
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Förnamn</label>
          <Input {...register('firstName', { required: 'Fältet krävs' })} />
          {errors.firstName && <p className="text-xs text-destructive">{String(errors.firstName.message)}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Efternamn</label>
          <Input {...register('lastName', { required: 'Fältet krävs' })} />
          {errors.lastName && <p className="text-xs text-destructive">{String(errors.lastName.message)}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">E-post</label>
          <Input type="email" {...register('email', { required: 'E-post krävs', pattern: { value: /\S+@\S+\.\S+/, message: 'Ogiltig e-post' } })} />
          {errors.email && <p className="text-xs text-destructive">{String(errors.email.message)}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Telefonnummer</label>
          <Input type="tel" {...register('phone', { required: 'Telefonnummer krävs' })} />
          {errors.phone && <p className="text-xs text-destructive">{String(errors.phone.message)}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-1">Adress</label>
        <Input {...register('address', { required: 'Adress krävs' })} />
  {errors.address && <p className="text-xs text-destructive">{String(errors.address.message)}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Postnummer</label>
          <Input {...register('postalCode', { required: 'Postnummer krävs' })} />
          {errors.postalCode && <p className="text-xs text-destructive">{String(errors.postalCode.message)}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Stad</label>
          <Input {...register('city', { required: 'Stad krävs' })} />
          {errors.city && <p className="text-xs text-destructive">{String(errors.city.message)}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-1">Betalningsmetod</label>
        <div className="flex gap-3">
          <label className="inline-flex items-center gap-2">
            <input {...register('method')} type="radio" value="card" defaultChecked />
            <span className="text-sm">Kort</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input {...register('method')} type="radio" value="swish" />
            <span className="text-sm">Swish</span>
          </label>
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full">Gå till betalning</Button>
      </div>
    </form>
  );
}

export default function CheckoutPage(): React.ReactElement {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Kontrollera autentisering vid sidladdning
  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.push('/logga-in?message=Du måste registrera dig och logga in för att komma åt kassan.');
    }
  }, [router, session, isPending]);

  // Hårdkodad till premium-planen
  const selectedPlan = {
    name: 'Premium',
    price: '199 kr/månad',
    features: ['Full tillgång + arkiv', 'Personliga rekommendationer', 'VIP-evenemang']
  };

  // router navigation handled by CheckoutForm onSubmit

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <section className="bg-card p-6 rounded-xl shadow border border-border">
                <h1 className="text-2xl font-bold text-foreground mb-2">Checkout — Premium</h1>
                <p className="text-muted-foreground mb-4">Fyll i dina uppgifter för att slutföra betalningen.</p>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-foreground">Sammanfattning</h2>
                  <div className="mt-3 p-4 rounded-md border border-border bg-popover text-popover-foreground">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-md font-semibold text-foreground">{selectedPlan.name}</div>
                        <div className="text-sm text-muted-foreground">{selectedPlan.price}</div>
                      </div>
                  
                    </div>
                    <ul className="mt-3 text-sm text-muted-foreground space-y-1">
                      {selectedPlan.features.map((f) => (
                        <li key={f}>• {f}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <CheckoutForm onSubmit={() => router.push('/kassa/success')} />

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
