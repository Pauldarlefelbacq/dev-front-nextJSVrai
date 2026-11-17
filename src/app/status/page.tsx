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
    return <p className="text-3xl text-red-500 font-black">{res.ok ? 'API en ligne' : 'API hors ligne'}</p>
}