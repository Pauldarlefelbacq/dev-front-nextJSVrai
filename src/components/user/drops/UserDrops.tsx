import { apiGet } from "@/lib/api/client";
import type { DropPage } from "@/lib/api/types";
import { Suspense } from "react";
import { DropCard } from "@/components/drops/DropCard";


export async function UserDrops({ userName }: { userName: string }){
    const drops = await apiGet<DropPage>(`/drops?author=${userName}`)
    return(
        <Suspense>
            <ul className="*:my-2 grid grid-cols-3">
                {drops.items.length === 0 ? (
                    <p>Aucun drop n'est disponible</p>
                    ):(
                        drops.items.map(drop =>(
                            <li className="max-w-96">
                                <DropCard key={drop.id} dropData={drop} />
                            </li>
                        ))
                    )
                }
            </ul>
        </Suspense>
    )
}