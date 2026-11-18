'use server'

import { apiPost } from "@/lib/api/client"
import { Drop } from "@/lib/api/types"
import { requireSession } from "@/lib/session"

export async function createDrop(prev: State, formData: FormData){
    await requireSession()
    let drop: Drop
    try {
        drop = await apiPost<Drop>('/drops', )
    } catch (err) {
        
    }
}