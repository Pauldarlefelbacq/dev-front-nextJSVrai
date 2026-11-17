
import { apiGet } from "@/lib/api/client"
import type { Category } from "@/lib/api/types"
import { SearchParams } from "next/dist/server/request/search-params"
import Link from "next/link"


export async function CategoriesFilter({ searchParams } : {searchParams: Promise<SearchParams>}) {
    const params = await searchParams;
    const activeCat = typeof params.category === "string" ? params.category : undefined

    const categories = await apiGet<Category[]>("/categories")

    return (
        <nav className="flex flex-wrap gap-2">
            <Link 
                className={`p-1 mx-5 rounded-sm hover:bg-gray-200 hover:text-gray-700 ${activeCat ? "bg-white border text-black" : "bg-black text-white" }`}
                href="/drops">
                Toutes
            </Link>
            {categories.map((category) => {
                const isActive = category.id === activeCat
                return(
                    <Link
                        className={`p-1 mx-5 rounded-sm hover:bg-gray-200 hover:text-gray-700 ${!isActive ? "bg-white border text-black" : "bg-black text-white" }`}
                        href={`/drops?category=${encodeURIComponent(category.id)}`}
                        key={category.id}
                    >
                        {category.label}
                    </Link>
                )
                
            })}
        </nav>
    )
}