'use client'

import { DropPage } from "@/lib/api/types"
import { useDropsUpdated } from "@/lib/hooks/use-dropsUpdated"
import { Suspense } from "react";
import { DropCard } from "./DropCard";

export function DropsLiveWidget({drops}: {drops: DropPage}){
    
    const dropsLive = useDropsUpdated(drops);

    return(
        <Suspense>
            <div>
                <ul className="*:my-2">
                    {dropsLive.items.length === 0 ? (
                        <p>Aucun drop n'est disponible</p>
                        ):(
                            dropsLive.items.map(drop =>(
                              <DropCard key={drop.id} dropData={drop} />
                            ))
                        )
                    }
                </ul>
            </div>
        </Suspense>
    )
}