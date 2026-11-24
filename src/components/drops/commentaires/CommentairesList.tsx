import { apiGet } from "@/lib/api/client";
import { CommentPage } from "@/lib/api/types";
import { Suspense } from "react";
import { ComComponent } from "./CommentaireComponent";
import { ComsLiveWidget } from "@/components/ComsLiveWidget";

export async function ComList(dropId: number){
    const ComList = await apiGet<CommentPage>(`/drops/${dropId}/comments`);

    return(
        <ComsLiveWidget dropId={dropId} dropComs={ComList} />
    )
}