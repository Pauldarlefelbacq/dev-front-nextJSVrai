import { newDropForm as NewDropForm } from "@/components/drops/add/NewDropForm"
import { apiGet } from "@/lib/api/client"
import { Category } from "@/lib/api/types"

export default async function NewDrop(){
    const cat: Category[] = await apiGet('/categories')

    return(
        <NewDropForm categories={cat} />
    )
}