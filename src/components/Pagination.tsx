'use client'

import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "./ui/button";

export function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
    const router = useRouter()
    const params = useSearchParams()

    function goToPage(nextPage: number) {
        const next = new URLSearchParams(params.toString())
        next.set("page", String(nextPage))
        router.push(`/drops?${next.toString()}`)
    }

    if (totalPages <= 1) return null

    return (
        <nav aria-label="Pagination" className="flex items-center justify-center gap-4">
            <Button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
            >
                Précédent
            </Button>
            <span>Page {page} sur {totalPages}</span>
            <Button
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
            >
                Suivant
            </Button>
        </nav>
    )
}