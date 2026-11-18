import { LikeButton } from "@/components/drops/LikeButton";
import { apiGet } from "@/lib/api/client";
import type { Drop } from "@/lib/api/types";
import Link from "next/link";


export default async function dropPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const drop = await apiGet<Drop>(`/drops/${id}`);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        {drop.imageUrl && (
          <img
            src={drop.imageUrl}
            alt={`Illustration de ${drop.title}`}
            className="max-h-96 w-full object-cover"
          />
        )}

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-950 dark:text-blue-200">
              {drop.category}
            </span>
            {drop.locked && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                Verrouillé
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {drop.title}
          </h1>

          {drop.hidden && (
            <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-100">
              Ce drop est masqué.
            </p>
          )}

          <p className="mt-5 whitespace-pre-wrap text-base leading-7 text-gray-700 dark:text-gray-300">
            {drop.content ?? "Aucune description disponible."}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-5 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
            <div className="flex flex-col gap-1">
              <Link
                href={`/users/${drop.author.username}`}
                className="font-medium text-gray-900 hover:underline dark:text-gray-100"
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
            <p className="font-medium text-gray-800 dark:text-gray-200">
              {drop.likesCount} j'aime
            </p>
            <LikeButton dropId={drop.id} isLiked={drop.likedByMe} likeCount={drop.likesCount} />
          </div>
        </div>
      </article>
    </main>
  );
}