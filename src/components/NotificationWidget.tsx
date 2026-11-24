'use client'

import { useEffect } from "react"
import { useNotifications } from "@/lib/hooks/use-notifications"
import { toast } from "./ui/toast"

export function NotificationWidget(){
    let notif = useNotifications();
    console.log(notif);
    

    useEffect(() => {
        if (!notif) return

        toast.add({
            title: notif.kind,
            description: `${notif.dropTitle} - ${notif.by.displayName}`,
        })
    }, [notif])

    return null
}