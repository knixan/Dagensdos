"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { generateNews } from "./ai";    
import { useRef } from "react";   

import { MDXEditor, MDXEditorMethods } from "@mdxeditor/editor";

export default function CreateArticle() {
    const refSummary =useRef<MDXEditorMethods>(null);
    const refContent =useRef<MDXEditorMethods>(null);   

    const [topic, setTopic] = useState(""); 
    const [header, setHeader] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState(""); 

  return (
    <>
      <Card className="p-6 mb-8">
        <CardHeader>
          <CardTitle>Generate News Article with AI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex 1">
              <label htmlFor="topic" className="sr-only">
                Topic:
              </label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
              <Button
                onClick={async () => {
                  const article = await generateNews(topic);
                    setHeader(article.header);  
                    refSummary.current?.setMarkdown(article.summary);
                    refContent.current?.setMarkdown(article.content);   
                  console.log(article);
                }}
              >
                Generate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Article Details </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="header">
              Header
            </label>
            <Input
              id="header"
              value={header}
              onChange={(e) => setHeader(e.target.value)}
            />
            
          </div>
          <div className="space-y-2">
            <MDXEditor
              ref={refSummary}
              markdown={summary}
                onChange={ setSummary} 
                contentEditable="prose prose -slate max-w-none"  
                />


          </div>
          {/* Display generated article here */}
        </CardContent>
      </Card>
    </>
  );
}