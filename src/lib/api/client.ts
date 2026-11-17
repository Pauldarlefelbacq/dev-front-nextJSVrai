import 'server-only'
import { notFound } from 'next/navigation'
import { cookies } from "next/headers";

export async function apiGet<T>(path: string){
    const token = (await cookies()).get('session')?.value
    console.log(`token:\n${token}`);
    

    const res = await fetch(`${process.env.API_URL}${path}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    if (res.status === 404) notFound();

    if (!res.ok) throw new Error(`API ${res.status} sur ${path}`);
    
    return (await res.json()) as T
}

export async function apiPost<T>(path: string, data: object){
    const res = await fetch(`${process.env.API_URL}${path}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        }
    })
    if (res.status === 404) notFound();
    if (!res.ok) throw new Error(`API ${res.status} sur ${path}`);
    return res as T
}