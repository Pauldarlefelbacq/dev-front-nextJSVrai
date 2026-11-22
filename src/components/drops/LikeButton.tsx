'use client'

import { toggleLike } from "@/app/actions/drops"
import { useOptimistic, useActionState } from "react"

export function LikeButton({ dropId, isLiked, likeCount}: { dropId: number, isLiked: boolean, likeCount: number}){
    const [optimisticLike, setOptimisticLike] = useOptimistic(
        { isLiked, likeCount },
        (s) => ({ isLiked: !s.isLiked,
                likeCount: s.likeCount + (s.isLiked ? -1 : 1) }),
    )

    const [state, action, pending] = useActionState(async()=> {
        setOptimisticLike
        return toggleLike(dropId, isLiked)
    }, {})

    return(
        <form action={action}>
            <button className="cursor-pointer" disabled={pending} aria-pressed={optimisticLike.isLiked}>
                {optimisticLike.isLiked ? '❤︎' : '♡'}
            </button>
            {state.error && <p role="alert">{state.error}</p>}
        </form>
    )
}