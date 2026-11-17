import { apiGet } from "@/lib/api/client"
import { Category } from "@/lib/api/types"
import { cacheLife } from "next/cache"
import Link from "next/link"

export async function CategoriesFilter(){
    // 'use cache'
    // cacheLife('days')

    const list = await apiGet<Category[]>('/categories')

    return list.map((c)=>{
        <Link key={c.id} href={`/drops?cat=${c.id}`}>{c.label}</Link>
    })
}