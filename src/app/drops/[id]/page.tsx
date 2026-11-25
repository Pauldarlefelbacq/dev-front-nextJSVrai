import { ComList } from "@/components/drops/commentaires/CommentairesList";
import { LikeButton } from "@/components/drops/LikeButton";
import { newComForm as NewComForm } from "@/components/drops/commentaires/add/NewComForm";
import { DeleteDropButton } from "@/components/drops/DeleteDropButton";
import { apiGet } from "@/lib/api/client";
import type { Drop } from "@/lib/api/types";
import Link from "next/link";
import { PresenceWidget } from "@/components/PresenceWidget";
import { DropsMap } from "@/components/map/DropsMap";
import { Suspense } from "react";

export default async function dropPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const drop = await apiGet<Drop>(`/drops/${id}`);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <Suspense>
        <div>
          <PresenceWidget dropId={drop.id} />
        </div>
          <div className="order-first h-80 ">
            <DropsMap drops={[drop]} activeId={drop.id} />
          </div>
        <article className="overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm mt-5">
          {drop.imageUrl && (
            <img
              src={drop.imageUrl}
              alt={`Illustration de ${drop.title}`}
              className="max-h-96 w-full object-contain"
            />
          )}
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
                {drop.category}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
              {drop.title}
            </h1>
            <p className="mt-5 whitespace-pre-wrap text-base leading-7 text-foreground">
              {drop.content ?? "Aucune description disponible."}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5 text-sm text-muted-foreground">
              <div className="flex flex-col gap-1">
                <Link
                  href={`/user/${drop.author.username}`}
                  className="font-medium text-foreground hover:underline"
                >
                  {drop.author.displayName}
                </Link>
                <time dateTime={drop.createdAt}>
                  {new Intl.DateTimeFormat("fr-FR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(drop.createdAt))}
                </time>
              </div>
              <p className="font-medium text-foreground">
                {drop.likesCount} j'aime
              </p>
              <LikeButton dropId={drop.id} isLiked={drop.likedByMe} likeCount={drop.likesCount} />
            </div>
            {drop.isMine && (
              <div className="flex items-center gap-3">
                <Link href={`/drops/${drop.id}/edit`}>Modifier</Link>
                <DeleteDropButton dropId={drop.id} />
              </div>
            )}
          </div>
        </article>
        <section className="mt-8 grid gap-4">
          <h2 className="text-xl font-semibold">Commentaires {drop.commentsCount}</h2>
          <NewComForm dropId={drop.id} />
          {ComList(drop.id)}
        </section>
      </Suspense>
    </main>
  );
}