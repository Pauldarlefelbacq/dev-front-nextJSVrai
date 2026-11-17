
import { apiGet } from "@/lib/api/client"
import type { Category } from "@/lib/api/types"
import { SearchParams } from "next/dist/server/request/search-params"
import Link from "next/link"


export async function CategoriesFilter({ searchParams } : {searchParams: Promise<SearchParams>}) {
    const params = await searchParams;

    const categories = await apiGet<Category[]>("/categories")

    return (
        <nav className="flex flex-wrap gap-2">
            <Link  href="/drops">
                Toutes
            </Link>
            {categories.map((category) => (
                <Link
                    className={`bg-black text-white p-1 mx-5 rounded-sm hover:bg-gray-200 hover:text-gray-700`}
                    href={`/drops?category=${encodeURIComponent(category.id)}`}
                    key={category.id}
                >
                    {category.label}
                </Link>
            ))}
        </nav>
    )
}