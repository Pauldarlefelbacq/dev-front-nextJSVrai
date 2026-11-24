import { DropsExplorer } from "@/components/drops/DropsExplorer";
import { SearchComponent } from "@/components/SearchComponent";
import { apiGet } from "@/lib/api/client";
import type { DropPage } from "@/lib/api/types";
import { Suspense } from "react";

async function HomeDrops() {
  const page = await apiGet<DropPage>("/drops");

  return <DropsExplorer drops={page.items} />;
}

export default function DropsPage() {
  return (
    <main className="page-container">
      <h1 className="font-bold text-2xl">Drops</h1>
      <SearchComponent />
      <Suspense fallback={<p className="text-muted">Chargement des drops…</p>}>
        <HomeDrops />
      </Suspense>
    </main>
  );
}
