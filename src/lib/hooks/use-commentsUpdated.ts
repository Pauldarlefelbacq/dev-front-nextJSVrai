'use client'

import { useState, useEffect } from "react";
import { retain, subscribe } from "../realtime";
import { CommentPage } from "../api/types";

export function useCommentUpdated({ dropId}: { dropId: number }, {dropComs} : { dropComs: CommentPage }){
    const [comments, setComments] = useState<CommentPage>(dropComs);

    useEffect(()=>{
        const release = retain();
        const stopComAdded = subscribe('comment:created', (data)=>{
            if (data.comment.dropId === dropId && data.comment.parentId === null) {
                setComments((s) => {
                    if (s.items.some((com) => com.id === data.comment.id)) return s;
                    return {
                        ...s,
                        items: [...s.items, data.comment],
                    };
                });
            }
        });
        const stopComUpdated = subscribe('comment:updated', (data)=>{
            if (data.comment.dropId === dropId && data.comment.parentId === null) {
                setComments((s) => ({
                    ...s,
                    items: s.items.map((com) => com.id === data.comment.id ? data.comment : com),
                }));
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
            stopComAdded();
            stopComUpdated();
            stopComDeleted();
            release();
        };
    }, [dropId]);
    return comments
}