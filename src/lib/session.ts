import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function setSession(token: string){
    (await cookies()).set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60*60*24,
        path: '/',
    })
}

export async function getToken(){
    return (await cookies()).get('session')?.value
}

export async function requireSession(){
    const token = await getToken()
    if(!token) redirect('/login')
    return token
}