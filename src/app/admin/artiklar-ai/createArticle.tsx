"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import { generateNews } from "./ai";

import { MDXEditor, MDXEditorMethods } from "@mdxeditor/editor";

export default function CreateArticle() {
  const refSummary = useRef<MDXEditorMethods>(null);
  const refContent = useRef<MDXEditorMethods>(null);

  const [topic, setTopic] = useState("");
  const [header, setHeader] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");

  return (
    <>
      <Card className="p-6 mb-8 bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">
            Generate News Article with AI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <label htmlFor="topic" className="sr-only">
                Topic:
              </label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter topic..."
                className="bg-secondary/5 border border-secondary text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button
              className="ml-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-95"
              onClick={async () => {
                const article = await generateNews(topic);
                setHeader(article.header);
                setSummary(article.summary);
                setContent(article.content);
                refSummary.current?.setMarkdown(article.summary);
                refContent.current?.setMarkdown(article.content);
                console.log(article);
              }}
            >
              Generate
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8 border border-border bg-background text-foreground">
        <CardHeader>
          <CardTitle>Article Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="header" className="text-sm text-muted-foreground">
              Header
            </label>
            <Input
              id="header"
              value={header}
              onChange={(e) => setHeader(e.target.value)}
              className="bg-surface border border-muted text-foreground"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Summary</label>
            <div className="rounded-md border border-muted p-2 bg-surface">
              <MDXEditor
                ref={refSummary}
                markdown={summary}
                onChange={setSummary}
                className="min-h-[120px] prose max-w-none text-foreground bg-transparent"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Content</label>
            <div className="rounded-md border border-muted p-2 bg-surface">
              <MDXEditor
                ref={refContent}
                markdown={content}
                onChange={setContent}
                className="min-h-[220px] prose max-w-none text-foreground bg-transparent"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border bg-background text-foreground">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold text-foreground">
            {header || "No header yet"}
          </h2>
          <div className="mt-4 text-muted-foreground">
            <h3 className="font-medium">Summary</h3>
            <div
              className="prose max-w-none text-foreground"
              dangerouslySetInnerHTML={{
                __html: summary || "<em>No summary</em>",
              }}
            />
            <h3 className="mt-4 font-medium">Content</h3>
            <div
              className="prose max-w-none text-foreground"
              dangerouslySetInnerHTML={{
                __html: content || "<em>No content</em>",
              }}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
