import 'server-only'
import { notFound } from 'next/navigation'
import { cookies } from "next/headers";
import { requireSession } from '../session';
import type { ErrorResponse } from "./types";

export type ApiActionState = {
    error?: string
    fields?: Record<string, string[]>
}

export class ApiError extends Error {
    constructor(
        public status: number,
        public code: string,
        message: string,
        public fields: Record<string, string[]> = {},
    ) {
        super(message)
        this.name = "ApiError"
    }
}

export function toApiActionState(error: unknown): ApiActionState {
    if (error instanceof ApiError) {
        return { error: error.message, fields: error.fields }
    }
    if (error instanceof Error) return { error: error.message }
    return { error: "Une erreur inattendue est survenue." }
}

async function parseApiError(res: Response, path: string): Promise<ApiError> {
    try {
        const body = await res.json() as ErrorResponse
        return new ApiError(
            res.status,
            body.error.code,
            body.error.message,
            body.error.fields,
        )
    } catch {
        return new ApiError(res.status, "request_failed", `API ${res.status} sur ${path}`)
    }
}

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
    if (!res.ok) throw await parseApiError(res, path)
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
    if (!res.ok) throw await parseApiError(res, path)
    return (await res.json()) as T
}

export async function apiDelete(path: string): Promise<void>{
    const token = (await cookies()).get('session')?.value
    await requireSession()
    const res = await fetch(`${process.env.API_URL}${path}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    })

    if (res.status === 404) notFound()
    if (!res.ok) throw await parseApiError(res, path)
}