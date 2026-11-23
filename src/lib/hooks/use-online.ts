'use client'

import { useState,useEffect } from "react";
import { retain, subscribe } from "@/lib/realtime";

export type Viewer = { id: number, username: string, displayName: string, avatarUrl: string | null };

export function useOnline(){
    const [viewers, setViewers] = useState<Viewer[]>([]);

    useEffect(()=>{
        const release = retain();
        const stopHello = subscribe(
            "hello",
            (data: { online?: Viewer[] }) => setViewers(Array.isArray(data?.online) ? data.online : []),
        )
        const stopOnline = subscribe(
            "presence:online",
            (data: { viewers: Viewer[] }) => setViewers(data.viewers),
        )
        return()=>{
            stopOnline()
            stopHello();
            release();
            setViewers([]);
        };
    }, []);
    return viewers;
}