"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  onSubmit: () => void;
};

export default function CheckoutForm({ onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  function submit() {
    // frontend handling before navigation
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground mb-2">
            Formuläret är frontend-only i nuläget. Om du vill spara en order
            eller initiera betalning behöver du lägga till en serverruta och
            anropa den från formuläret. Ta bort denna text när det är gjort klar
            backend.
          </h1>
          <label className="block text-sm text-muted-foreground mb-1">
            Förnamn
          </label>
          <Input {...register("firstName", { required: "Fältet krävs" })} />
          {errors.firstName && (
            <p className="text-xs text-destructive">
              {String(errors.firstName.message)}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            Efternamn
          </label>
          <Input {...register("lastName", { required: "Fältet krävs" })} />
          {errors.lastName && (
            <p className="text-xs text-destructive">
              {String(errors.lastName.message)}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            E-post
          </label>
          <Input
            type="email"
            {...register("email", {
              required: "E-post krävs",
              pattern: { value: /\S+@\S+\.\S+/, message: "Ogiltig e-post" },
            })}
          />
          {errors.email && (
            <p className="text-xs text-destructive">
              {String(errors.email.message)}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            Telefonnummer
          </label>
          <Input
            type="tel"
            {...register("phone", { required: "Telefonnummer krävs" })}
          />
          {errors.phone && (
            <p className="text-xs text-destructive">
              {String(errors.phone.message)}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-1">
          Adress
        </label>
        <Input {...register("address", { required: "Adress krävs" })} />
        {errors.address && (
          <p className="text-xs text-destructive">
            {String(errors.address.message)}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            Postnummer
          </label>
          <Input
            {...register("postalCode", { required: "Postnummer krävs" })}
          />
          {errors.postalCode && (
            <p className="text-xs text-destructive">
              {String(errors.postalCode.message)}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            Stad
          </label>
          <Input {...register("city", { required: "Stad krävs" })} />
          {errors.city && (
            <p className="text-xs text-destructive">
              {String(errors.city.message)}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-1">
          Betalningsmetod
        </label>
        <div className="flex gap-3">
          <label className="inline-flex items-center gap-2">
            <input
              {...register("method")}
              type="radio"
              value="card"
              defaultChecked
            />
            <span className="text-sm">Kort</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input {...register("method")} type="radio" value="swish" />
            <span className="text-sm">Swish</span>
          </label>
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full">
          Gå till betalning
        </Button>
      </div>
    </form>
  );
}
