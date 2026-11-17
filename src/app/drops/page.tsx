import { DropsList } from "@/components/drops/DropsList"
import { SearchComponent } from "@/components/SearchComponent"
import { SearchParams } from "next/dist/server/request/search-params"
import { Suspense } from "react"
import { CategoriesFilter } from "@/components/FilterComponent"


export default function DropPage({ searchParams } : {searchParams: Promise<SearchParams>}){

    return(
        <Suspense>
            <main className="page-container">
                <h1>Page des drops</h1>
                <SearchComponent />
                <CategoriesFilter searchParams={searchParams} />
                <DropsList searchParams={searchParams} />
            </main>
        </Suspense>
        
    )
}