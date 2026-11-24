'use client'

import { useActionState, useEffect, useState } from "react"
import { createReply, getComReplies, toggleComLike } from "@/app/actions/drops"
import type { Comment } from "@/lib/api/types"
import { subscribe } from "@/lib/realtime"
import { DeleteComButton } from "../DeleteComButton"

function ComLikeButton({ comment }: { comment: Comment }){
    const [reaction, setReaction] = useState({
        liked: comment.likedByMe,
        likesCount: comment.likesCount,
    })
    const [likeState, likeAction, likePending] = useActionState(
        toggleComLike.bind(null, comment.id, reaction.liked),
        {},
    )

    useEffect(() => {
        setReaction({ liked: comment.likedByMe, likesCount: comment.likesCount })
    }, [comment.likedByMe, comment.likesCount])

    useEffect(() => subscribe("comment:updated", (data) => {
        if (data.comment.id === comment.id) {
            setReaction({ liked: data.comment.likedByMe, likesCount: data.comment.likesCount })
        }
    }), [comment.id])

    return(
        <form action={likeAction}>
            <button
                type="submit"
                className="cursor-pointer"
                disabled={likePending}
                aria-pressed={reaction.liked}
            >
                {reaction.liked ? "❤" : "♡"} {reaction.likesCount}
            </button>
            {likeState.error && <p className="form-error mb-0" role="alert">{likeState.error}</p>}
        </form>
    )
}

export function ComComponent({ comment: ComData, isReply = false }: { comment: Comment, isReply?: boolean }){
    const rootId = ComData.parentId ?? ComData.id
    const [replies, setReplies] = useState<Comment[]>([])
    const [repliesCount, setRepliesCount] = useState(ComData.repliesCount)
    const [replyPage, setReplyPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [showReplies, setShowReplies] = useState(false)
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [repliesLoading, setRepliesLoading] = useState(false)
    const [repliesError, setRepliesError] = useState("")
    const [replyState, replyAction, replyPending] = useActionState(
        createReply.bind(null, ComData.dropId, rootId),
        {},
    )
    const date = new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(ComData.createdAt))

    useEffect(() => {
        setRepliesCount(ComData.repliesCount)
    }, [ComData.repliesCount])

    useEffect(() => {
        const reply = replyState.comment
        if (reply) {
            setReplies((s) => [...s, reply])
            setRepliesCount((s) => s + 1)
            setShowReplies(true)
        }
    }, [replyState.comment])

    async function loadReplies(page: number){
        setRepliesLoading(true)
        setRepliesError("")
        const result = await getComReplies(rootId, page)
        if ("items" in result) {
            setReplies((s) => page === 1 ? result.items : [...s, ...result.items])
            setReplyPage(result.page)
            setTotalPages(result.totalPages)
        } else {
            setRepliesError(result.error ?? "Impossible de charger les réponses.")
        }
        setRepliesLoading(false)
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
                            {DeleteComButton(ComData.id)}
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
                {!isReply && repliesCount > 0 && (
                    <button
                        type="button"
                        className="cursor-pointer text-sm text-muted-foreground"
                        onClick={() => {
                            setShowReplies(!showReplies)
                            if (!showReplies && replies.length === 0) void loadReplies(1)
                        }}
                        aria-expanded={showReplies}
                    >
                        {showReplies ? "Masquer" : "Voir"} {repliesCount} réponse{repliesCount > 1 ? "s" : ""}
                    </button>
                )}
                {!ComData.deleted && (
                    <button
                        type="button"
                        className="cursor-pointer text-sm text-muted-foreground"
                        onClick={() => setShowReplyForm(!showReplyForm)}
                        aria-expanded={showReplyForm}
                    >
                        Répondre
                    </button>
                )}
            </div>
            {showReplies && (
                <div className="mt-3 grid gap-2">
                    {repliesLoading && replies.length === 0 && <p className="text-sm text-muted-foreground">Chargement…</p>}
                    {replies.map((reply) => (
                        <ComComponent key={reply.id} comment={reply} isReply />
                    ))}
                    {repliesError && <p className="form-error mb-0" role="alert">{repliesError}</p>}
                    {replyPage < totalPages && (
                        <button
                            type="button"
                            className="cursor-pointer justify-self-start text-sm text-muted-foreground"
                            disabled={repliesLoading}
                            onClick={() => void loadReplies(replyPage + 1)}
                        >
                            {repliesLoading ? "Chargement…" : "Voir plus de réponses"}
                        </button>
                    )}
                </div>
            )}
            {showReplyForm && (
                <form action={replyAction} className="mt-3 grid gap-2">
                    <textarea
                        className="form-input min-h-20"
                        name="content"
                        minLength={1}
                        maxLength={500}
                        placeholder="Votre réponse…"
                        required
                    />
                    {replyState.error && <p className="form-error mb-0" role="alert">{replyState.error}</p>}
                    {replyState.success && <p className="text-muted mb-0" role="status">{replyState.success}</p>}
                    <button type="submit" className="cursor-pointer justify-self-start" disabled={replyPending}>
                        {replyPending ? "Envoi…" : "Envoyer la réponse"}
                    </button>
                </form>
            )}
        </article>
    )
}
