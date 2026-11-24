import { apiGet } from "@/lib/api/client";
import { DropPage } from "@/lib/api/types";
import { SearchParams } from "next/dist/server/request/search-params";
import { DropsLiveWidget } from "./DropsLiveWidget";
import { Pagination } from "@/components/Pagination";

export async function DropsList({ searchParams } : {searchParams: Promise<SearchParams>}){
    const params = await searchParams;
    const apiParams = new URLSearchParams()

    if (typeof params.q === "string" && params.q.trim()){
        apiParams.set("q", params.q.trim())
    }
    if (typeof params.category === "string" && params.category.trim()){
        apiParams.set("category", params.category.trim())
    }
    const requestedPage = Number(params.page)
    if (Number.isInteger(requestedPage) && requestedPage > 0) {
        apiParams.set("page", String(requestedPage))
    }

    const query = apiParams.toString()
    const dropsList = await apiGet<DropPage>(`/drops${query ? `?${query}` : ""}`);

    return(
        <>
            <DropsLiveWidget drops={dropsList} />
            <Pagination page={dropsList.page} totalPages={dropsList.totalPages} />
        </>
    )
}