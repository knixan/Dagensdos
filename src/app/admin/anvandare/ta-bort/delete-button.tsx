"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function DeleteButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <Button
      className="bg-red-600 p-2 rounded-lg text-white"
      disabled={isDeleting}
      onClick={async () => {
        if (!confirm("Är du säker på att du vill ta bort användaren?")) return;
        setIsDeleting(true);
        try {
          const res = await fetch("/api/admin/anvandare/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          });
          const json = await res.json();
          if (json?.ok) {
            toast.success("Användaren togs bort");
            setTimeout(() => location.reload(), 500);
          } else {
            toast.error("Kunde inte ta bort: " + (json?.error ?? "okänt fel"));
            setIsDeleting(false);
          }
        } catch (err) {
          console.error(err);
          toast.error("Något gick fel");
          setIsDeleting(false);
        }
      }}
    >
      {isDeleting ? "Tar bort..." : "Ta bort"}
    </Button>
  );
}
