'use client'

import { useOnline } from "@/lib/hooks/use-online"

export function OnlineWidget() {
    const online = useOnline()
    return <p className="mb-0">{(online ?? []).length} personnes en ligne</p>
}