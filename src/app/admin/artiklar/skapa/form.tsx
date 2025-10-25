"use client";
import React, { useState } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ArticleCreateSchema, ArticleCreateValues } from "./schema";
import { createArticle } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CreateArticleForm({ categories }: { categories: { id: string; name: string }[] }) {
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string>("");
    
    const form = useForm<ArticleCreateValues>({
        resolver: zodResolver(ArticleCreateSchema),
        defaultValues: {
            headline: "",
            summary: "",
            content: "",
            image_url: "",
            editorsChoice: true,
            categoryIds: [],
        }
    })
    const router = useRouter();

    async function onSubmit(values: ArticleCreateValues) {
        try {
            const res = await createArticle(values) as { id: string; headline: string };
            toast.success(`Artikel skapad: ${res.headline}`)
            form.reset();
            setImagePreview("");
            // navigera till artiklar admin-sidan
            router.push('/admin/artiklar');
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err)
            toast.error(msg || 'Kunde inte skapa artikel')
        }
    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit, (er) => console.error(er))}
                className="space-y-4"
            >
                <FormField
                    control={form.control}
                    name="headline"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Rubrik</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Samanfattning</FormLabel>
                            <FormControl>
                                <textarea
                                    {...field}
                                    className="w-full resize-y overflow-auto rounded border p-2 min-h-[4rem] max-h-[20rem]"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Innehåll</FormLabel>
                            <FormControl>
                                <textarea
                                    {...field}
                                    className="w-full resize-y overflow-auto rounded border p-2 min-h-[8rem] max-h-[36rem]"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bild</FormLabel>
                            <FormControl>
                                <div className="space-y-2">
                                    <Input
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            setUploading(true);
                                            try {
                                                const formData = new FormData();
                                                formData.append("file", file);

                                                const response = await fetch("/api/upload/article-image", {
                                                    method: "POST",
                                                    body: formData,
                                                });

                                                if (!response.ok) {
                                                    const error = await response.json();
                                                    throw new Error(error.error || "Upload failed");
                                                }

                                                const data = await response.json();
                                                field.onChange(data.url);
                                                setImagePreview(data.url);
                                                toast.success("Bild uppladdad!");
                                            } catch (err) {
                                                const msg = err instanceof Error ? err.message : "Kunde inte ladda upp bild";
                                                toast.error(msg);
                                            } finally {
                                                setUploading(false);
                                            }
                                        }}
                                        disabled={uploading}
                                    />
                                    {uploading && <p className="text-sm text-muted-foreground">Laddar upp...</p>}
                                    {imagePreview && (
                                        <div className="relative w-full h-48 rounded border">
                                            <Image
                                                src={imagePreview}
                                                alt="Preview"
                                                fill
                                                className="object-cover rounded"
                                            />
                                        </div>
                                    )}
                                    {field.value && !imagePreview && (
                                        <p className="text-sm text-muted-foreground">Bild: {field.value}</p>
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="editorsChoice"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Editors Choice</FormLabel>
                            <FormControl>
                                <input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="categoryIds"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Kategorier</FormLabel>
                            <FormControl>
                                <select
                                    multiple
                                    value={field.value ?? []}
                                    onChange={(e) =>
                                        field.onChange(Array.from(e.currentTarget.selectedOptions).map((o) => o.value))
                                    }
                                    className="w-full border rounded p-2"
                                >
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Skapa artikel</Button>
            </form>
        </Form>
    )
}
