import { DropsList } from "@/components/drops/DropsList"
import { SearchComponent } from "@/components/SearchComponent"
import { SearchParams } from "next/dist/server/request/search-params"
import { Suspense } from "react"
import { CategoriesFilter } from "@/components/FilterComponent"
import { cookies } from "next/headers"
import { Button } from "@/components/ui/button"
import Link from "next/link"


export default async function DropPage({ searchParams } : {searchParams: Promise<SearchParams>}){
    const isLogged = (await cookies()).get("session")?.value

    return(
        <Suspense>
            <main className="page-container *:my-3">
                <h1>Page des drops</h1>
                <SearchComponent />
                <CategoriesFilter searchParams={searchParams} />
                <DropsList searchParams={searchParams} />
                { isLogged && 
                    <Button className="fixed z-10 bottom-5 right-5"><Link href="/drops/new">Créer un Drop</Link></Button>
                }
            </main>
        </Suspense>
        
    )
}