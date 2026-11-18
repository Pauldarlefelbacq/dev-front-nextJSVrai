'use server'

import { apiDelete, apiPost } from "@/lib/api/client"
import { Drop } from "@/lib/api/types"
import { requireSession } from "@/lib/session"
import { refresh, revalidatePath } from "next/cache"
import { ApiError } from "next/dist/server/api-utils"
import { redirect } from "next/navigation"

export async function createDrop(_prev: { fields?: string }, formData: FormData){
    await requireSession()
    let drop: Drop
    try {
        drop = await apiPost<Drop>('/drops', { // y mettre les infos du drop au moment venu

        })
    } catch (err) {
        if (err instanceof ApiError) return { fields: err.message }
        throw err
    }

    revalidatePath('/drops')
    redirect(`/drops/${drop.id}`)
}

export async function toggleLike(dropId: number, liked: boolean){
    await requireSession();

    try{
        if (liked) await apiDelete(`/drops/${dropId}/like`)
        else await apiPost(`/drops/${dropId}/like`)
    }catch (err) {
        if (err instanceof ApiError)  return { error: err.message }
        throw err
    }

    refresh()
    return{}
}