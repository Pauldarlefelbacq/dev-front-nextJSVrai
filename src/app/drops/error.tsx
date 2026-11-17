'use client'

import Link from "next/link"
import { useEffect } from "react"

export default function ErrorPage({
    error, 
    retry,
}: {
    error: unknown
    retry: ()=> void
}) {
    useEffect(()=>{
        console.error(error)
    }, [error])

    return(
        <div className="w-fit m-auto">
            <h2>Il y a un problème avec la liste de drops</h2>
            <button
                className="cursor-pointer"
                onClick={
                () => retry()
                }
            >
                Veuillez réessayer
            </button>
            <Link className="mx-5 p-1 border-2 bg-amber-500" href="/">Retour à l'accueil</Link>
        </div>
    )
}