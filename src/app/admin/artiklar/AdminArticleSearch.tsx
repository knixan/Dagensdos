"use client"

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminArticleSearch({ onSearch }: { onSearch: (q: string) => void }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.replace(`/admin/artiklar?q=${encodeURIComponent(q)}`);
    onSearch(q);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        name="q"
        placeholder="Sök artiklar..."
        className="border rounded px-2 py-1"
      />
      <button type="submit" className="px-3 py-1 bg-gray-200 rounded">Sök</button>
    </form>
  );
}
