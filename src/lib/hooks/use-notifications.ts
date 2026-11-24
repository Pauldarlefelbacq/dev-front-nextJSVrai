'use client'

import { useState, useEffect } from "react";
import { retain, subscribe } from "../realtime";

type By = {avatarUrl: string, displayName: string, id: number, username: string}
export type Notification = { kind: string, dropId: number, dropTitle: string, by: By, at: Date }

export function useNotifications(){
    const [notifs, setNotifs] = useState<Notification | undefined>(undefined)

    useEffect(()=>{
        const release = retain();
        const stopDropUpdated = subscribe('notification', (data)=>{
            setNotifs(data);
            
        })
        return()=>{
            stopDropUpdated();
            release();
        }
    }, []);
    return notifs
}