'use server'

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { apiPatch, apiPost, toApiActionState, type ApiActionState } from "@/lib/api/client"
import { requireSession, setSession } from "@/lib/session"
import type { AuthResponse, PrivateUser } from "@/lib/api/types"
import { cookies } from "next/headers"

export type LoginState = ApiActionState
export type SignupState = ApiActionState
export type UpdateProfileState = ApiActionState & { success?: string }

export async function Signup(_prev: SignupState, formData: FormData): Promise<SignupState>{
    let res: AuthResponse
    try {
        res = await apiPost<AuthResponse>('/auth/register',  {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            displayName: formData.get('displayName'),
            bio: formData.get('bio'),
        })
    } catch (error) {
        return toApiActionState(error)
    }
    const { token } = res
    await setSession(token)
    redirect('/')
}

export async function Login(_prev: LoginState, formData: FormData): Promise<LoginState>{
    let res: AuthResponse
    try {
        res = await apiPost<AuthResponse>('/auth/login', {
            login: formData.get('login'),
            password: formData.get('password'),
        })
    } catch (error) {
        return toApiActionState(error)
    }
    const { token } = res
    await setSession(token)
    redirect('/')
}

export async function updateMyProfile(
    _prev: UpdateProfileState,
    formData: FormData,
): Promise<UpdateProfileState> {
    await requireSession()

    const displayName = String(formData.get("displayName") ?? "").trim()
    const bio = String(formData.get("bio") ?? "").trim()
    const avatarUrl = String(formData.get("avatarUrl") ?? "").trim()

    try {
        await apiPatch<PrivateUser>("/auth/me", {
            displayName,
            bio: bio || null,
            avatarUrl: avatarUrl || null,
        })
    } catch (error) {
        return toApiActionState(error)
    }

    revalidatePath("/me")
    return { success: "Votre profil a été mis à jour." }
}

export async function logout(){
    (await cookies()).delete('session')
    redirect('/login')
}