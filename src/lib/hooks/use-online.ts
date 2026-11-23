'use client'

import { useState,useEffect } from "react";
import { onOpen, retain, send, subscribe } from "@/lib/realtime";

export type Viewer = { id: number, username: string, displayName: string, avatarUrl: string | null };

export function useOnline(){
    const [viewers, setViewers] = useState<Viewer[]>([]);

    useEffect(()=>{
        const release = retain();
        const stopOnline = subscribe(
            "presence:online",
            (data: { viewers: Viewer[] }) => setViewers(data.viewers),
        )
        return()=>{
            stopOnline()
            release();
            setViewers([]);
        };
    }, []);
    return viewers
}