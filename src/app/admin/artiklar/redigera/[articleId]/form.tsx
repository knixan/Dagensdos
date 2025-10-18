"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArticleEditSchema, ArticleEditValues } from "./schema";
import { editArticle } from "./actions";
import type { Article, Category } from "@/generated/prisma";

type ArticleWithCategories = Article & { category: Category[] };

export default function ArticleEditForm({ article, categories }: { article: ArticleWithCategories; categories: Category[] }) {
  const form = useForm<ArticleEditValues>({
    resolver: zodResolver(ArticleEditSchema),
    defaultValues: {
      id: article.id,
      headline: article.headline,
      summary: article.summary,
      content: article.content,
      image_url: article.image_url,
      editorsChoice: !!article.editorsChoice,
  categoryIds: article.category?.map((c) => c.id) ?? [],
    },
  });

  async function onSubmit(values: ArticleEditValues) {
    await editArticle(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="headline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Headline</FormLabel>
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
              <FormLabel>Summary</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input {...field} />
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
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Sparar..." : "Spara förändringar"}
        </Button>
      </form>
    </Form>
  );
}
