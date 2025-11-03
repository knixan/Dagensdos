"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function DeleteButton({ id }: { id: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    return (
        <Button
            className="bg-red-600 p-2 rounded-lg text-white"
            disabled={isDeleting}
            onClick={async () => {
                if (!confirm("Är du säker på att du vill ta bort kategorin?")) return;
                setIsDeleting(true);
                try {
                    const res = await fetch('/api/admin/kategorier/delete', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id }),
                    });
                    const json = await res.json();
                    if (json?.ok) {
                        toast.success('Kategorin togs bort');
                        // small delay so toast is visible before reload
                        setTimeout(() => location.reload(), 500);
                    } else {
                        toast.error('Kunde inte ta bort: ' + (json?.error ?? 'okänt fel'));
                        setIsDeleting(false);
                    }
                } catch (err) {
                    console.error(err);
                    toast.error('Något gick fel');
                    setIsDeleting(false);
                }
            }}
        >
            {isDeleting ? 'Tar bort...' : 'Ta bort'}
        </Button>
    );
}
export default DeleteButton;
