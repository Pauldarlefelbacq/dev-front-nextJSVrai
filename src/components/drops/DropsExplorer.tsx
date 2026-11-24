'use client'

import { useState } from "react"
import { DropsMap } from "../map/DropsMap"
import { DropCard } from "./DropCard";
import type { Drop } from "@/lib/api/types"

export function DropsExplorer({ drops }: { drops: Drop[] }) {
    const [activeId, setActiveId] = useState<number | null>(null);
    function selectFromMap(id: number) {
        setActiveId(id);
        document.getElementById(`drop-${id}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <ul className="space-y-3">
                {drops.map((d) => (
                    <li key={d.id} id={`drop-${d.id}`}
                        onMouseEnter={() => setActiveId(d.id)}
                        onFocus={() => setActiveId(d.id)}>
                        <DropCard dropData={d} />
                    </li>
                ))}
            </ul>
            <div className="order-first h-80 lg:order-none lg:sticky lg:top-4 lg:h-[80vh]">
                <DropsMap drops={drops} activeId={activeId} onSelect={selectFromMap} />
            </div>
        </div>
    );
}