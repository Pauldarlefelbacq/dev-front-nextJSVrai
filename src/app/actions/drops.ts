'use server'

import { apiDelete, apiPatch, apiPost } from "@/lib/api/client"
import type { Drop, ErrorResponse } from "@/lib/api/types"
import { requireSession } from "@/lib/session"
import { refresh, revalidatePath } from "next/cache"
import { ApiError } from "next/dist/server/api-utils"
import { redirect } from "next/navigation"

//      Drops
export async function createDrop(_prev: { fields?: string }, formData: FormData){
    await requireSession()
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
    } catch (err: any) {
        if (err) return { fields: err.error.fields.title }
        throw err
    }

    revalidatePath('/drops')
    redirect(`/drops/${drop.id}`)
}

type EditDropState = {
    error?: string
}

export async function EditDrop(dropId: number, _prev: EditDropState, formData: FormData): Promise<EditDropState>{
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
        if (error instanceof Error) return { error: error.message }
        throw error
    }

    revalidatePath(`/drops/${dropId}`)
    redirect(`/drops/${dropId}`)
}

export async function deleteDrop(dropId: number){
    await requireSession()
    try{
        await apiDelete(`/drops${dropId}`)
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

type ComFormState = {
    error?: string
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
        if (err instanceof Error) return { error: err.message }
        throw err
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