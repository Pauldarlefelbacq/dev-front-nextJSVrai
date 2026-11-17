import { DropsList } from "@/components/drops/DropsList"
import { SearchComponent } from "@/components/SearchComponent"
import { CategoriesFilter } from "@/components/FilterComponent"
import { SearchParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime"


export default function DropPage(){



    return(
        <div>
            <h1>Page des drops</h1>
            <SearchComponent />
            <CategoriesFilter />
            
            <DropsList />
        </div>
        
    )
}