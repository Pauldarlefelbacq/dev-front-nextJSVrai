import { apiGet } from "@/lib/api/client";
import { DropPage } from "@/lib/api/types";
import { dropComponent as DropComponent } from "./DropComponent";
import { SearchParams } from "next/dist/server/request/search-params";
import { Suspense } from "react";

export async function DropsList({ searchParams } : {searchParams: Promise<SearchParams>}){
    const params = await searchParams;
    const apiParams = new URLSearchParams()

    if (typeof params.q === "string" && params.q.trim()){
        apiParams.set("q", params.q.trim())
    }
    if (typeof params.category === "string" && params.category.trim()){
        apiParams.set("category", params.category.trim())
    }

    const query = apiParams.toString()
    const dropsList = await apiGet<DropPage>(`/drops${query ? `?${query}` : ""}`);

    return(
        <Suspense>
            <div>
                <ul className="*:my-2">
                    {dropsList.items.length === 0 ? (
                        <p>Aucun drop n'est disponible</p>
                        ):(
                            dropsList.items.map(drop =>(
                              <DropComponent key={drop.id} dropData={drop} />
                            ))
                        )
                    }
                </ul>
            </div>
        </Suspense>
    )
}