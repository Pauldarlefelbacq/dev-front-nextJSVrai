'use client'

import type { Comment } from "@/lib/api/types"
import { DeleteComButton } from "../DeleteComButton"

export function ComComponent(ComData: Comment){
    const date = new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(ComData.createdAt))

    return(
        <article className="card p-4">
            <header className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div>
                    <p className="mb-0 font-semibold">{ComData.author.displayName}</p>
                    <p className="mb-0 text-sm">@{ComData.author.username}</p>
                </div>
                <div className="flex items-center gap-3">
                    {ComData.isMine && (
                        <div>
                            <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-medium">
                                Votre commentaire
                            </span>
                            {DeleteComButton(ComData.id)}
                        </div>
                    )}
                    <time className="text-sm" dateTime={ComData.createdAt}>
                        {date}
                    </time>
                </div>
            </header>
            <p className="mb-0 max-w-full whitespace-pre-wrap break-words">{ComData.content}</p>
        </article>
    )
}