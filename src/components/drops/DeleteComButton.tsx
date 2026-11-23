import { deleteCom } from "@/app/actions/drops"

export function DeleteComButton(comId: number){

    return(
        <button onClick={() => deleteCom(comId)}>
            Supprimer
        </button>
    )
}