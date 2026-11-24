'use client'

import { useState,useEffect } from "react";
import { onOpen, retain, subscribe, send } from "../realtime";

export function useLikeUpdated(dropId: number, dropLikes: number){
    const [likes, setLikes] = useState(dropLikes);

    useEffect(()=>{
        const release = retain();
        const stopOpen = onOpen(()=> send( 'like:updated', { dropId }));
        const stopLikeUpdated = subscribe('like:upddated', (data)=>{
            if (data.dropId === dropId) setLikes(data.likesCount)
        });
    return()=>{
        stopOpen();
        stopLikeUpdated();
        release();
        // setLikes(dropLikes);
    };
    }, [dropId]);
    return likes
}