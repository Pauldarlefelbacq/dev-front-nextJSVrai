import { deleteDrop } from "@/app/actions/drops"

export function DeleteDropButton(dropId: number){

    return(
        <button onClick={() => deleteDrop(dropId)}>
            Supprimer mon drop
        </button>
    )
}