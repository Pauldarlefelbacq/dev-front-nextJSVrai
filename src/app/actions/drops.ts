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
        const res = await apiPost('/drops', {
            title: formData.get('title'),
            content: formData.get('content'),
            category: formData.get('category'),
            imageUrl: formData.get('imageUrl') || undefined,
            lat: Number(formData.get('lat')),
            lng: Number(formData.get('lng')),
        })
        drop = await res.json() as Drop
    } catch (err) {
        if (err instanceof ApiError) return { fields: err.fields.title }
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