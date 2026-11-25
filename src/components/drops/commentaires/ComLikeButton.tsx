'use client'

import { useActionState, useOptimistic } from "react"
import { toggleComLike } from "@/app/actions/drops"
import type { Comment } from "@/lib/api/types"

export function ComLikeButton({ comment }: { comment: Comment }){
    const [optimisticLike, setOptimisticLike] = useOptimistic(
        { liked: comment.likedByMe, likesCount: comment.likesCount },
        (state) => ({
            liked: !state.liked,
            likesCount: state.likesCount + (state.liked ? -1 : 1),
        }),
    )
    const [likeState, likeAction, likePending] = useActionState(
        async () => {
            setOptimisticLike(null)
            return toggleComLike(comment.id, optimisticLike.liked, optimisticLike.likesCount, {})
        },
        {},
    )

    return(
        <form action={likeAction}>
            <button
                type="submit"
                className="cursor-pointer"
                disabled={likePending}
                aria-pressed={optimisticLike.liked}
            >
                {optimisticLike.liked ? "❤" : "♡"} {optimisticLike.likesCount}
            </button>
            {likeState.error && <p className="form-error mb-0" role="alert">{likeState.error}</p>}
        </form>
    )
}
