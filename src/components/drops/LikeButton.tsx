'use client'

import { toggleLike } from "@/app/actions/drops"
import { useOptimistic, useActionState } from "react"

export function LikeButton({ dropId, isLiked, likeCount}: { dropId: number, isLiked: boolean, likeCount: number}){
    const [optimistic, toggle] = useOptimistic(
        { isLiked, likeCount },
        (s) => ({ isLiked: !s.isLiked,
                likeCount: s.likeCount + (s.isLiked ? -1 : 1) }),
    )

    const [state, action, pending] = useActionState(async()=> {
        toggle(null)
        return toggleLike(dropId, isLiked)
    }, {})

    return(
        <form action={action}>
            <button className="cursor-pointer" disabled={pending} aria-pressed={optimistic.isLiked}>
                {optimistic.isLiked ? '❤︎' : '♡'}
            </button>
            {state.error && <p role="alert">{state.error}</p>}
        </form>
    )
}