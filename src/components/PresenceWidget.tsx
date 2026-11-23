'use client'

import { usePresence } from "@/lib/hooks/use-presence"

export function PresenceWidget({ dropId }: { dropId: number }){
    const viewers = usePresence(dropId);
    return (
        <aside
            aria-label="Personnes qui consultent ce drop"
            className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2 text-card-foreground shadow-sm"
        >
            <div aria-hidden="true" className="flex -space-x-2">
                {viewers.slice(0, 4).map((viewer) => (
                    <span
                        key={viewer.id}
                        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-secondary text-sm font-semibold text-secondary-foreground"
                    >
                        {viewer.avatarUrl ? (
                            <img
                                src={viewer.avatarUrl}
                                alt=""
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            viewer.displayName.trim().charAt(0).toUpperCase() || "?"
                        )}
                    </span>
                ))}
                {viewers.length > 4 && (
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-accent text-xs font-medium text-accent-foreground">
                        +{viewers.length - 4}
                    </span>
                )}
            </div>
            <div className="min-w-0">
                <p className="mb-0 text-sm font-semibold">Présents sur ce drop</p>
                <p className="mb-0 truncate text-xs text-muted-foreground">
                    {viewers.length > 0
                        ? viewers.map((viewer) => viewer.displayName).join(", ")
                        : "Aucun visiteur pour le moment"}
                </p>
            </div>
        </aside>
    )
}