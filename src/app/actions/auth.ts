'use server'

import { redirect } from "next/navigation"
import { apiGet, apiPost } from "@/lib/api/client"
import { setSession } from "@/lib/session"
import type { AuthResponse } from "@/lib/api/types"
import { cookies } from "next/headers"

// c'est pas trop ok mais y a que comme ça que j'évite l'erreur...
export type LoginState = { error?: string }
export type SignupState = { error?: string }

export async function Signup(_prev: SignupState, formData: FormData): Promise<SignupState>{
    const res = await apiPost<AuthResponse>('/auth/register',  {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
        displayName: formData.get('displayName'),
        bio: formData.get('bio'),
    })
    if (!res) return { error: 'Identifiants incorrects' }
    const { token } = res
    await setSession(token)
    redirect('/')
}

export async function Login(_prev: LoginState, formData: FormData): Promise<LoginState>{
    const res = await apiPost<AuthResponse>('/auth/login', {
        login: formData.get('login'),
        password: formData.get('password'),
    })
    
    if (!res) return { error: 'Identifiants incorrects' }
    const { token } = res
    await setSession(token)
    redirect('/')
}

export async function logout(){
    (await cookies()).delete('session')
    redirect('/login')
}