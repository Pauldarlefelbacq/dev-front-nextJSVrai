'use server'

import { redirect } from "next/navigation"
import { apiGet, apiPost } from "@/lib/api/client"
import { setSession } from "@/lib/session"
import type { AuthResponse } from "@/lib/api/types"
import { cookies } from "next/headers"

export type LoginState = { error?: string }

export async function Signup(formData: FormData){
    
}

export async function Login(_prev: LoginState, formData: FormData): Promise<LoginState>{
    const res = await apiPost('/auth/login', {
        login: formData.get('login'),
        password: formData.get('password'),
    })
    
    if (!res.ok) return { error: 'Identifiants incorrects' }
    const { token } = (await res.json()) as AuthResponse
    await setSession(token)
    redirect('/')
}

export async function logout(){
    (await cookies()).delete('session')
    redirect('/login')
}