import 'server-only'
import { notFound, redirect } from 'next/navigation'
import { cookies } from "next/headers";
import { requireSession } from '../session';

export async function apiGet<T>(path: string){
    const token = (await cookies()).get('session')?.value

    const res = await fetch(`${process.env.API_URL}${path}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    if (res.status === 404) notFound();

    if (!res.ok) throw new Error(`API ${res.status} sur ${path}`);
    
    return (await res.json()) as T
}

export async function apiPost<T>(path: string, data?: object){
    const token = (await cookies()).get('session')?.value;

    const res = await fetch(`${process.env.API_URL}${path}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: token ? {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }:
        {
            "Content-Type": "application/json",
        }
    })
    if (res.status === 404) notFound();
    if (!res.ok) throw new Error(`API ${res.status} sur ${path}`);
    return (await res.json()) as T
}

export async function apiPatch<T>(path:string, data?: object){
    const token = (await cookies()).get('session')?.value
    
    const res = await fetch(`${process.env.API_URL}${path}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: token ? {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }:
        {
            "Content-Type": "application/json",
        }
    })
    if (res.status === 404) notFound();
    if (!res.ok) throw new Error(`API ${res.status} sur ${path}`);
    return res as T
}

export async function apiDelete(path: string): Promise<void>{
    const token = (await cookies()).get('session')?.value
    await requireSession()
    const res = await fetch(`${process.env.API_URL}${path}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    })

    if (res.status === 404) notFound();

    if (!res.ok) throw new Error(`API ${res.status} sur ${path}`);
}