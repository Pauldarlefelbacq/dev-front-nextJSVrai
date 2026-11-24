'use client'

import { useState, useEffect } from "react";
import { retain, subscribe } from "../realtime";

export type Notification = { kind: string, dropId: number, dropTitle: string, by: string, at: Date }

export function useNotifications(){
    const [notifs, setNotifs] = useState<Notification | undefined>(undefined)

    useEffect(()=>{
        const release = retain();
        const stopDropUpdated = subscribe('notification', (data)=>{
            setNotifs(data);
            console.log(data);
            
        })
        return()=>{
            stopDropUpdated();
            release();
        }
    }, []);
    return notifs
}