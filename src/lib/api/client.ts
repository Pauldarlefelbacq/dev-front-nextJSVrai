import 'server-only'
import { notFound } from 'next/navigation'

export async function apiFetch<T>(path: string, token?: string){
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