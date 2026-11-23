import { apiGet } from "@/lib/api/client";
import { CommentPage } from "@/lib/api/types";
import { Suspense } from "react";
import { ComComponent } from "./CommentaireComponent";

export async function ComList(dropId: number){
    const ComList = await apiGet<CommentPage>(`/drops/${dropId}/comments`);

    return(
        <Suspense>
            <div>
                <ul className="*:my-2">
                    {ComList.items.map((com)=>(
                        <ComComponent key={com.id} {...com} />
                    ))}
                </ul>
            </div>
        </Suspense>
    )
}