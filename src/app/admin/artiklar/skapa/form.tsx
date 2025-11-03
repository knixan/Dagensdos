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

export default function CreateArticleForm({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  const [imagePreview, setImagePreview] = useState<string>("");
// initiera formulär med react-hook-form och zod-validator
  const form = useForm<ArticleCreateValues>({
    resolver: zodResolver(ArticleCreateSchema),
    defaultValues: {
      headline: "",
      summary: "",
      content: "",
      image_url: "",
      editorsChoice: true,
      categoryIds: [],
    },
  });
  const router = useRouter();
// hantera formulärskick
  async function onSubmit(values: ArticleCreateValues) {
    try {
      const res = (await createArticle(values)) as {
        id: string;
        headline: string;
      };
      toast.success(`Artikel skapad: ${res.headline}`);
      form.reset();
      setImagePreview("");
      // navigera till artiklar admin-sidan
      router.push("/admin/artiklar");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || "Kunde inte skapa artikel");
    }
  }
  return (
    <Form {...form}>
      <div className="w-full max-w-full mx-auto px-4">
        <form
          onSubmit={form.handleSubmit(onSubmit, (er) => console.error(er))}
          className="w-full max-w-none space-y-8 bg-card p-8 md:p-10 rounded-xl shadow-lg border border-border"
        >
        <FormField
          control={form.control}
          name="headline"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">Rubrik</FormLabel>
              <FormControl>
                <Input {...field} className="h-14 text-lg px-4" placeholder="Skriv artikelns rubrik här..." />
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
              <FormLabel className="text-lg font-semibold">Sammanfattning</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  placeholder="En kort sammanfattning av artikeln..."
                  className="w-full resize-y overflow-auto rounded-md border border-input bg-background px-4 py-3 min-h-[120px] max-h-80 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary"
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
              <FormLabel className="text-lg font-semibold">Innehåll</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  placeholder="Skriv artikelns fullständiga innehåll här..."
                  className="w-full resize-y overflow-auto rounded-md border border-input bg-background px-4 py-3 min-h-80 max-h-[640px] text-base leading-relaxed font-normal focus:outline-none focus:ring-2 focus:ring-primary"
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
              <FormLabel className="text-lg font-semibold">Bild (URL)</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <Input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const url = e.target.value;
                      field.onChange(url);
                      setImagePreview(url);
                    }}
                    className="h-14 text-lg px-4"
                  />
                  {imagePreview ? (
                    <div className="relative w-full h-56 rounded border overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  ) : field.value ? (
                    <p className="text-sm text-muted-foreground">
                      Bild: {field.value}
                    </p>
                  ) : null}
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
            <FormItem className="flex items-center gap-3 space-y-0">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="w-5 h-5 rounded border-input cursor-pointer"
                />
              </FormControl>
              <FormLabel className="text-base font-medium cursor-pointer">Editors Choice</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">Kategorier <span className="text-sm font-normal text-muted-foreground">(håll Ctrl/Cmd för flera val)</span></FormLabel>
              <FormControl>
                <select
                  multiple
                  value={field.value ?? []}
                  onChange={(e) =>
                    field.onChange(
                      Array.from(e.currentTarget.selectedOptions).map(
                        (o) => o.value
                      )
                    )
                  }
                  className="w-full border border-input rounded-md px-4 py-3 h-48 text-base bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} className="py-2">
                      {c.name}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4 border-t border-border">
          <Button type="submit" className="h-14 px-8 text-lg font-semibold">
            Skapa artikel
          </Button>
        </div>
        </form>
      </div>
    </Form>
  );
}
