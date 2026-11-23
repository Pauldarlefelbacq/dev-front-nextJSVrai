'use server'

import { apiDelete, apiPatch, apiPost, ApiError, toApiActionState, type ApiActionState } from "@/lib/api/client"
import type { Drop } from "@/lib/api/types"
import { getToken, requireSession } from "@/lib/session"
import { refresh, revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

//      Drops
export type DropActionState = ApiActionState

export async function createDrop(_prev: DropActionState, formData: FormData): Promise<DropActionState>{
    const token = await getToken()
    if (!token) {
        return { error: "Vous devez être connecté pour créer un drop." }
    }

    let drop: Drop
    try {
        drop = await apiPost<Drop>('/drops', {
            title: formData.get('title'),
            content: formData.get('content'),
            category: formData.get('category'),
            imageUrl: formData.get('imageUrl') || undefined,
            lat: Number(formData.get('lat')),
            lng: Number(formData.get('lng')),
        })
    } catch (error) {
        return toApiActionState(error)
    }

    revalidatePath('/drops')
    redirect(`/drops/${drop.id}`)
}

export async function EditDrop(dropId: number, _prev: ApiActionState, formData: FormData): Promise<ApiActionState>{
    await requireSession()

    try {
        const imageUrl = String(formData.get('imageUrl') ?? '').trim()
        await apiPatch<Drop>(`/drops/${dropId}`, {
            title: String(formData.get('title') ?? ''),
            content: String(formData.get('content') ?? ''),
            category: String(formData.get('category') ?? ''),
            imageUrl: imageUrl || null,
            lat: Number(formData.get('lat')),
            lng: Number(formData.get('lng')),
        })
    } catch (error) {
        return toApiActionState(error)
    }

    revalidatePath(`/drops/${dropId}`)
    redirect(`/drops/${dropId}`)
}

export async function deleteDrop(dropId: number){
    await requireSession()
    try{
        await apiDelete(`/drops/${dropId}`)
    }catch(err){
        if (err instanceof ApiError) return { fields: err.message} //remplacer par la vraie erreur mais long
        throw err
    }
    redirect('/drops')
}

//      Like
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

export type ComFormState = ApiActionState & {
    success?: string
}

//      Comments
export async function createCom(dropId: number, _prev: ComFormState, formData: FormData): Promise<ComFormState>{
    await requireSession();
    try{
        await apiPost(`/drops/${dropId}/comments`, {
            content: formData.get('content'),
        })
    } catch(err){
        return toApiActionState(err)
    }
    revalidatePath(`/drops/${dropId}`)
    return { success: "Commentaire envoyé." }
}

export async function modifyCom(dropId: number){
    return;
}

export async function deleteCom(comId: number){
    await requireSession();
    try{
        await apiDelete(`/comments/${comId}`)
    }catch(err){
        if (err instanceof ApiError) return { fields: err.message} //remplacer par la vraie erreur mais long
        throw err
    }
    refresh();
}