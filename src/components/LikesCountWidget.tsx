'use client'

import { useLikeUpdated } from "@/lib/hooks/use-likeUpdated"

export function LikesCountWidget({ dropId, dropLikes }: { dropId: number, dropLikes: number }){
    const likes = useLikeUpdated(dropId, dropLikes)
    return(
        <p>{likes} j'aime</p>
    )
}