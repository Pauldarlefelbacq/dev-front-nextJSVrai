'use client'

import type { CommentPage } from "@/lib/api/types";
import { useCommentUpdated } from "@/lib/hooks/use-commentsUpdated";
import { Suspense } from "react";
import { ComComponent } from "@/components/drops/commentaires/CommentaireComponent";

export function ComsLiveWidget({dropId, dropComs}: {dropId: number, dropComs: CommentPage}){
    const coms = useCommentUpdated({ dropId }, { dropComs });

    return(
        <Suspense>
            <div>
                <ul className="*:my-2">
                    {coms.items.map((com)=>(
                        <ComComponent key={com.id} {...com} />
                    ))}
                </ul>
            </div>
        </Suspense>
    )
}