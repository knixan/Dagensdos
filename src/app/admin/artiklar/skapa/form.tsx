"use client";
import React, { useState, useRef } from "react";
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
import { generateNews } from "./ai";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";
import { deleteUploadedImage } from "@/lib/actions/uploadthing";
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  headingsPlugin,
  InsertTable,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  MDXEditor,
  MDXEditorMethods,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

export default function CreateArticleForm({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const refSummary = useRef<MDXEditorMethods | null>(null);
  const refContent = useRef<MDXEditorMethods | null>(null);
  // initiera formulär med react-hook-form och zod-validator
  const form = useForm<ArticleCreateValues>({
    resolver: zodResolver(ArticleCreateSchema),
    defaultValues: {
      headline: "",
      summary: "",
      content: "",
      image_url: "",
      editorsChoice: true,
      premium: false,
      categoryIds: [],
    },
  });
  const router = useRouter();

  async function handleGenerate() {
    if (!topic.trim()) {
      toast.error("Ange ett ämne först");
      return;
    }
    setIsGenerating(true);
    try {
      const article = await generateNews(topic);
      form.setValue("headline", article.headerLine, { shouldValidate: true });
      form.setValue("summary", article.summary, { shouldValidate: true });
      form.setValue("content", article.content, { shouldValidate: true });
      refSummary.current?.setMarkdown(article.summary);
      refContent.current?.setMarkdown(article.content);
      toast.success("Artikel genererad! Granska och redigera vid behov.");
    } catch (err) {
      console.error("[AI Generate] Error:", err);
      toast.error("Kunde inte generera artikel");
    } finally {
      setIsGenerating(false);
    }
  }

  // hantera formulärskick
  async function onSubmit(values: ArticleCreateValues) {
    try {
      const res = (await createArticle(values)) as {
        id: string;
        headline: string;
      };
      toast.success(`Artikel skapad: ${res.headline}`);
      form.reset();
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
        {/* AI-generering */}
        <div className="space-y-3 bg-card p-6 md:p-8 rounded-xl shadow-lg border border-border mb-6">
          <h2 className="text-lg font-semibold">Generera med AI (valfritt)</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Skriv ett ämne, t.ex. 'elpriser i Sverige'..."
              disabled={isGenerating}
            />
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? "Genererar..." : "Generera"}
            </Button>
          </div>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit, () => {
            toast.error("Kontrollera fälten markerade med fel innan du sparar");
          })}
          className="w-full max-w-none space-y-8 bg-card p-8 md:p-10 rounded-xl shadow-lg border border-border"
        >
          <FormField
            control={form.control}
            name="headline"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">Rubrik</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="h-14 text-lg px-4"
                    placeholder="Skriv artikelns rubrik här..."
                  />
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
                <FormLabel className="text-lg font-semibold">
                  Sammanfattning
                </FormLabel>
                <FormControl>
                  <div className="text-foreground rounded-md border border-muted p-2 bg-card">
                    <MDXEditor
                      ref={refSummary}
                      markdown={field.value ?? ""}
                      onChange={(md) => field.onChange(md)}
                      contentEditableClassName="prose prose-slate"
                      className="min-h-[120px] prose max-w-none text-foreground bg-transparent"
                      plugins={[
                        headingsPlugin(),
                        listsPlugin(),
                        quotePlugin(),
                        thematicBreakPlugin(),
                        linkPlugin(),
                        linkDialogPlugin(),
                        tablePlugin(),
                        toolbarPlugin({
                          toolbarContents: () => (
                            <>
                              <UndoRedo />
                              <BoldItalicUnderlineToggles />
                              <BlockTypeSelect />
                              <ListsToggle />
                              <InsertTable />
                            </>
                          ),
                        }),
                      ]}
                    />
                  </div>
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
                <FormLabel className="text-lg font-semibold">
                  Innehåll
                </FormLabel>
                <FormControl>
                  <div className="rounded-md border border-muted p-2 bg-card">
                    <MDXEditor
                      ref={refContent}
                      markdown={field.value ?? ""}
                      onChange={(md) => field.onChange(md)}
                      className="min-h-[220px] prose max-w-none text-foreground bg-transparent"
                      plugins={[
                        headingsPlugin(),
                        listsPlugin(),
                        quotePlugin(),
                        thematicBreakPlugin(),
                        linkPlugin(),
                        linkDialogPlugin(),
                        tablePlugin(),
                        toolbarPlugin({
                          toolbarContents: () => (
                            <>
                              <UndoRedo />
                              <BoldItalicUnderlineToggles />
                              <BlockTypeSelect />
                              <ListsToggle />
                              <InsertTable />
                            </>
                          ),
                        }),
                      ]}
                    />
                  </div>
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
                <FormLabel className="text-lg font-semibold">Bild</FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    {field.value ? (
                      <div className="relative w-full h-56 rounded border overflow-hidden">
                        <Image
                          src={field.value}
                          alt="Förhandsgranskning"
                          fill
                          className="object-cover rounded"
                        />
                        <button
                          type="button"
                          aria-label="Ta bort bild"
                          onClick={async () => {
                            // Ingen artikel sparad än, så vi kan städa direkt.
                            await deleteUploadedImage(field.value);
                            field.onChange("");
                          }}
                          className="absolute top-2 right-2 bg-background/90 hover:bg-background rounded-full p-1.5 shadow"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <UploadDropzone
                        endpoint="articleImage"
                        onClientUploadComplete={(res) => {
                          const url = res?.[0]?.ufsUrl;
                          if (url) {
                            field.onChange(url);
                            toast.success("Bild uppladdad!");
                          }
                        }}
                        onUploadError={(error) => {
                          toast.error(
                            `Kunde inte ladda upp bild: ${error.message}`,
                          );
                        }}
                      />
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
              <FormItem className="flex items-center gap-3 space-y-0">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="w-5 h-5 rounded border-input cursor-pointer"
                  />
                </FormControl>
                <FormLabel className="text-base font-medium cursor-pointer">
                  Editors Choice
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="premium"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3 space-y-0">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value ?? false}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="w-5 h-5 rounded border-input cursor-pointer"
                  />
                </FormControl>
                <FormLabel className="text-base font-medium cursor-pointer">
                  Premium (endast för prenumeranter)
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">
                  Kategorier{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    (håll Ctrl/Cmd för flera val)
                  </span>
                </FormLabel>
                <FormControl>
                  <select
                    multiple
                    value={field.value ?? []}
                    onChange={(e) =>
                      field.onChange(
                        Array.from(e.currentTarget.selectedOptions).map(
                          (o) => o.value,
                        ),
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
            <Button type="submit">Skapa artikel</Button>
          </div>
        </form>
      </div>
    </Form>
  );
}
