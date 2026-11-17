import { apiGet } from "@/lib/api/client";
import { Drop } from "@/lib/api/types";
import { Suspense } from "react";


export default async function dropPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  console.log(id);

  const drop = await apiGet<Drop>(`/drops/${id}`)
  

  return (
    <Suspense fallback={<p>Chargement...</p>}>
      <h1>{drop.title}</h1>
    </Suspense>
  );
}