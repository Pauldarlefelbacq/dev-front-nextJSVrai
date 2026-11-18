import Link from "next/link"
import type { Drop } from "@/lib/api/types"
import { LikeButton } from "./LikeButton"

export function dropComponent({ dropData }: { dropData: Drop }) {

    return (
        <article className="card p-4">
            <h2 className="mb-2 text-lg font-semibold">
                <Link
                    className="hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
                    href={`/drops/${dropData.id}`}
                >
                    {dropData.title}
                </Link>
            </h2>
            <p className="text-muted text-sm">
                {dropData.content ?? "Aucune description disponible."}
            </p>
            <div className="flex justify-between gap-4 text-sm">
                <p className="text-muted mb-0">
                    {dropData.likesCount} j'aime
                </p>
                <p className="text-muted mb-0">
                    Par {dropData.author.username}
                </p>
            </div>
        </article>
    )
}