import Link from "next/link"
import type { Drop } from "@/lib/api/types"

export function dropComponent({ dropData }: { dropData: Drop }) {
    return (
        <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">
                <Link
                    className="text-gray-900 hover:text-black focus-visible:outline-black"
                    href={`/drops/${dropData.id}`}
                >
                    {dropData.title}
                </Link>
            </h2>
            <p className="mt-2 text-sm text-gray-600">
                {dropData.content ?? "Aucune description disponible."}
            </p>
            <div className="flex w-full place-content-around">
                <p className="mt-3 text-sm text-gray-700">
                    {dropData.likesCount} j'aime
                </p>
                <p className="mt-3 text-sm text-gray-700">
                    Par {dropData.author.username}
                </p>
            </div>
        </article>
    )
}