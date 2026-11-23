import { Suspense } from "react" // await concrètement


export default function statusPage(){
    return(
        <div>
            <h1>Santé de l'API</h1>
            <h3>Résumé de la santé de l'API, si elle a un problème il sera marqué ici</h3>
            <Suspense fallback={ <p>Chargement</p> }>
                <Health />
            </Suspense>
        </div>
    )
}

async function Health(){
    const res = await fetch(`${process.env.API_URL}/health`)
    return (
        <p className={`inline-flex rounded-full px-4 py-2 text-3xl font-black ${res.ok ? "bg-secondary text-secondary-foreground" : "bg-destructive text-destructive-foreground"}`}>
            {res.ok ? 'API en ligne' : 'API hors ligne'}
        </p>
    )
}