import { apiFetch } from "@/lib/api/client";
import { DropPage } from "@/lib/api/types";
import { dropComponent as DropComponent } from "./DropComponent";

export async function DropsList({ FilterText, Categorie } : { FilterText?: string, Categorie?: string }){
    let dropsList = await apiFetch<DropPage>('/drops');
    return(
        <div>
            <ul>
                {dropsList.items.length === 0 ? (
                    <p>Aucun drop n'est disponible</p>
                    ):(
                        dropsList.items.map(drop =>(
                          <DropComponent key={drop.id} dropData={drop} />  
                        ))
                    )
                }
                
            </ul>
        </div>
    )
}