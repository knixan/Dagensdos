import CreateArticle from "./createArticle";
import { Navbar } from "@/components/layout/Navbar";


export default function ArticleAIPage() {
  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <Navbar />
      <CreateArticle />
    </div>
  );
}