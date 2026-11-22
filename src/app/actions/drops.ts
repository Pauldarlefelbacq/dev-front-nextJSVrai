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
    } catch (err: ErrorResponse) {
        if (err instanceof ApiError) return { fields: err.fields.title }
        throw err
    }

    revalidatePath('/drops')
    redirect(`/drops/${drop.id}`)
}

export async function EditDrop(_prev: {fields?:string}, formData: FormData){
    await requireSession();
    let drop: Drop;
    try{
        const res = await apiPatch('/drops', {
            //pas encore fini
        })

    }catch(err){

    }
    
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

