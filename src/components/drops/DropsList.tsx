import { apiGet } from "@/lib/api/client";
import { DropPage } from "@/lib/api/types";
import { DropCard } from "./DropCard";
import { SearchParams } from "next/dist/server/request/search-params";
import { Suspense } from "react";
import { DropsLiveWidget } from "./DropsLiveWidget";

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
        <DropsLiveWidget drops={dropsList} />
    )
}