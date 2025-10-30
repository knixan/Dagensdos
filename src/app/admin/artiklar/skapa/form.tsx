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
                  className="w-full resize-y overflow-auto rounded border p-2 min-h- max-h-80"
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
                  className="w-full resize-y overflow-auto rounded border p-2 min-h-32 max-h-92"
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
              <FormLabel>Bild (URL)</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const url = e.target.value;
                      field.onChange(url);
                      setImagePreview(url);
                    }}
                  />
                  {imagePreview ? (
                    <div className="relative w-full h-48 rounded border overflow-hidden">
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
            <FormItem>
              <FormLabel>Editors Choice</FormLabel>
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
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
                    field.onChange(
                      Array.from(e.currentTarget.selectedOptions).map(
                        (o) => o.value
                      )
                    )
                  }
                  className="w-full border rounded p-2"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
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
  );
}
