
import { apiGet } from "@/lib/api/client"
import type { Category } from "@/lib/api/types"
import { SearchParams } from "next/dist/server/request/search-params"
import Link from "next/link"


export async function CategoriesFilter({ searchParams } : {searchParams: Promise<SearchParams>}) {
    const params = await searchParams;
    const activeCat = typeof params.category === "string" ? params.category : undefined

    const categories = await apiGet<Category[]>("/categories") || []
    const filterLinkClass = "rounded-full border px-3 py-1 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
    const inactiveClass = "border-border bg-card text-card-foreground"
    const activeClass = "border-transparent bg-secondary text-secondary-foreground"

    return (
        <nav className="flex flex-wrap gap-2">
            <Link
                className={`${filterLinkClass} ${activeCat ? inactiveClass : activeClass}`}
                href="/drops">
                Toutes
            </Link>
            {categories.map((category) => {
                const isActive = category.id === activeCat
                return(
                    <Link
                        className={`${filterLinkClass} ${isActive ? activeClass : inactiveClass}`}
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