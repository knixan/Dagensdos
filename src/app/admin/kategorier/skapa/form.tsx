"use client"

import { useForm } from "react-hook-form"
import { CategorySchema, CategoryValues } from "./schema"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCategory } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateCategoryForm() {
    const router = useRouter();

    const form = useForm<CategoryValues>({
        resolver: zodResolver(CategorySchema),
        defaultValues: {
            name: ""
        }
    })

    async function onSubmit(values: CategoryValues) {
        try {
            const res = await createCategory(values) as { id: string; name: string };
            toast.success(`Kategori skapad: ${res.name}`)
            form.reset()
            // Refresh the current route so server-side list of categories updates
            router.refresh()
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err)
            toast.error(msg || 'Kunde inte skapa kategori')
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Namn: </FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <Button disabled={form.formState.isSubmitting || !form.formState.isValid}>
                    {form.formState.isSubmitting ? "Loading..." : "Skapa kategori"}
                </Button>
            </form>
        </Form>
    )
}
