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