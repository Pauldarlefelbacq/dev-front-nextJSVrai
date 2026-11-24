'use client'

import { useState, useEffect } from "react";
import { onOpen, retain, subscribe, send } from "../realtime";
import { CommentPage } from "../api/types";

export function useCommentUpdated({ dropId}: { dropId: number }, {dropComs} : { dropComs: CommentPage }){
    const [comments, setComments] = useState<CommentPage>(dropComs);

    useEffect(()=>{
        const release = retain();
        const stopOpen = onOpen(()=> send('comment:created', { dropId }));
        const stopComAdded = subscribe('comment:created', (data)=>{
            if (data.comment.dropId === dropId) {
                setComments((s) => ({
                    ...s,
                    items: [...s.items, data.comment],
                }))
            }
        });
        const stopComDeleted = subscribe('comment:deleted', (data)=>{
            if (data.dropId === dropId) {
         
                setComments((s) => ({
                    ...s,
                    items: s.items.filter((com) => com.id !== data.commentId),
                }));
            }
        });
        return()=>{
            stopOpen();
            stopComAdded();
            stopComDeleted();
            release();
        };
    }, [dropId]);
    return comments
}