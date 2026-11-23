'use client'

import type { Comment } from "@/lib/api/types"
import { DeleteComButton } from "../DeleteComButton"

export function ComComponent(ComData: Comment){
    const date = new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(ComData.createdAt))

    return(
        <article className="card border-border bg-card p-4 text-card-foreground">
            <header className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="flex gap-2">
                    <span
                        key={ComData.author.id}
                        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-secondary text-sm font-semibold text-secondary-foreground"
                    >
                        {ComData.author.avatarUrl ? (
                            <img
                                src={ComData.author.avatarUrl}
                                alt=""
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            ComData.author.displayName.trim().charAt(0).toUpperCase() || "?"
                        )}
                    </span>
                    <div>
                        <p className="mb-0 font-semibold text-foreground">{ComData.author.displayName}</p>
                        <p className="mb-0 text-sm text-muted-foreground">@{ComData.author.username}</p>
                    </div>
                </span>
                <div className="flex items-center gap-3">
                    {ComData.isMine && (
                        <div>
                            <span className="rounded-full border border-border bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                                Votre commentaire
                            </span>
                            {DeleteComButton(ComData.id)}
                        </div>
                    )}
                    <time className="text-sm text-muted-foreground" dateTime={ComData.createdAt}>
                        {date}
                    </time>
                </div>
            </header>
            <p className="mb-0 max-w-full whitespace-pre-wrap break-words">{ComData.content}</p>
        </article>
    )
}