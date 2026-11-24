'use client'

import { useState, useEffect } from "react";
import { retain, subscribe } from "../realtime";
import { Drop, DropPage } from "../api/types";

export function useDropsUpdated(drops: DropPage){
    const [dropsLive, setDropsLive] = useState<DropPage>(drops)

    useEffect(()=>{
        const release = retain();
        const stopDropAdded = subscribe('drop:created', (data: { drop: Drop }) => {
            setDropsLive((s)=>({
                ...s,
                items: [...s.items, data.drop],
            }))
        });
        const stopDropUpdated = subscribe('drop:updated', (data: { drop: Drop }) => {
            setDropsLive((s)=>({
                    ...s,
                    items: s.items.map((drop) => drop.id === data.drop.id ? data.drop : drop),
                }
            ))
        })
        const stopDropDeleted = subscribe('drop:deleted', (data: { dropId: number }) => {
            setDropsLive((s)=>({
                ...s,
                items: s.items.filter((coms) => coms.id !== data.dropId)
            }))
        });
        return() => {
            stopDropAdded();
            stopDropUpdated();
            stopDropDeleted();
            release();
        }
    }, [drops]);
    return dropsLive
}