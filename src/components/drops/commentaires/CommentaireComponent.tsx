'use client'

import { useState } from "react"
import { getComReplies } from "@/app/actions/drops"
import type { Comment } from "@/lib/api/types"
import { DeleteComButton } from "../DeleteComButton"
import { ComLikeButton } from "./ComLikeButton"
import { ComReplyForm } from "./ComReplyForm"

export function ComComponent({ comment: ComData, isReply = false, onReply }: { comment: Comment, isReply?: boolean, onReply?: () => void }){
    const rootId = ComData.parentId ?? ComData.id
    const [replyData, setReplyData] = useState({
        items: [] as Comment[],
        page: 1,
        totalPages: 1,
        loading: false,
        error: "",
    })
    const [showReplies, setShowReplies] = useState(false)
    const [showReplyForm, setShowReplyForm] = useState(false)
    const date = new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(ComData.createdAt))

    async function loadReplies(page: number){
        setReplyData((data) => ({ ...data, loading: true, error: "" }))
        const result = await getComReplies(rootId, page)
        if ("items" in result) {
            setReplyData((data) => ({
                items: page === 1 ? result.items : [...data.items, ...result.items],
                page: result.page,
                totalPages: result.totalPages,
                loading: false,
                error: "",
            }))
        } else {
            setReplyData((data) => ({
                ...data,
                loading: false,
                error: result.error ?? "Impossible de charger les réponses.",
            }))
        }
    }

    return(
        <article className={`card border-border bg-card p-4 text-card-foreground ${isReply ? "ml-6" : ""}`}>
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
                    {ComData.isMine && !ComData.deleted && (
                        <div>
                            <span className="rounded-full border border-border bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                                Votre commentaire
                            </span>
                            <DeleteComButton comId={ComData.id} dropId={ComData.dropId} />
                        </div>
                    )}
                    <time className="text-sm text-muted-foreground" dateTime={ComData.createdAt}>
                        {date}
                    </time>
                </div>
            </header>
            <p className="mb-0 max-w-full whitespace-pre-wrap break-words">
                {ComData.deleted ? "Commentaire supprimé." : ComData.content}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
                {!ComData.deleted && (
                    <ComLikeButton comment={ComData} />
                )}
                {!isReply && ComData.repliesCount > 0 && (
                    <button
                        type="button"
                        className="cursor-pointer text-sm text-muted-foreground"
                        onClick={() => {
                            setShowReplies(!showReplies)
                            if (!showReplies && replyData.items.length === 0) void loadReplies(1)
                        }}
                        aria-expanded={showReplies}
                    >
                        {showReplies ? "Masquer" : "Voir"} {ComData.repliesCount} réponse{ComData.repliesCount > 1 ? "s" : ""}
                    </button>
                )}
                {!ComData.deleted && (
                    <button
                        type="button"
                        className="cursor-pointer text-sm text-muted-foreground"
                        onClick={() => isReply ? onReply?.() : setShowReplyForm(!showReplyForm)}
                        aria-expanded={isReply ? undefined : showReplyForm}
                    >
                        Répondre
                    </button>
                )}
            </div>
            {showReplies && (
                <div className="mt-3 grid gap-2">
                    {replyData.loading && replyData.items.length === 0 && <p className="text-sm text-muted-foreground">Chargement…</p>}
                    {replyData.items.map((reply) => (
                        <ComComponent
                            key={reply.id}
                            comment={reply}
                            isReply
                            onReply={() => setShowReplyForm(true)}
                        />
                    ))}
                    {replyData.error && <p className="form-error mb-0" role="alert">{replyData.error}</p>}
                    {replyData.page < replyData.totalPages && (
                        <button
                            type="button"
                            className="cursor-pointer justify-self-start text-sm text-muted-foreground"
                            disabled={replyData.loading}
                            onClick={() => void loadReplies(replyData.page + 1)}
                        >
                            {replyData.loading ? "Chargement…" : "Voir plus de réponses"}
                        </button>
                    )}
                </div>
            )}
            {showReplyForm && !isReply && (
                <ComReplyForm
                    dropId={ComData.dropId}
                    parentId={rootId}
                />
            )}
        </article>
    )
}
