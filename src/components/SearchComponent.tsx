'use client'

import { useSearchParams, useRouter } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

export function SearchComponent(){
    const router = useRouter()
    const params = useSearchParams()

    const onSearch = useDebouncedCallback((q: string) =>{
        const next = new URLSearchParams(params)
        if (q) next.set('q',q); else next.delete('q')
            router.replace(`?${next}`)
    }, 300)

    return <input 
                defaultValue={params.get('q') ?? ''} 
                onChange={(e)=> onSearch(e.target.value)} 
            />
}