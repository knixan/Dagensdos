"use client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Category } from "@/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CategorySchema, CategoryValues } from "./schema";
import { editCategory } from "./actions";

export default function CategoryEditForm({
    category,
}: { category: Category }
) {
    const form = useForm<CategoryValues>({
        resolver: zodResolver(CategorySchema),
        defaultValues: {
            id: category.id,
            name: category.name
        }
    })

    async function onSubmit(values: CategoryValues) {
        await editCategory(values)
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Saving..." : "Save changes"}
                </Button>
            </form>
        </Form>
    )
}
